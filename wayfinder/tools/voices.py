#!/usr/bin/env python3
"""Generate Wayfinder's voice clips ahead of time.

Clips are made once by the developer and shipped in audio/voice/. Players never contact a
voice service, and nothing they write is ever spoken or sent anywhere.

Commands
  python3 tools/voices.py list                      Show every voiced line (also writes audio/voice/script.json)
  python3 tools/voices.py generate                  Generate missing clips with Fish Audio (needs FISH_API_KEY)
  python3 tools/voices.py generate --journey naomi  Only one journey
  python3 tools/voices.py generate --engine say     Free local preview clips using macOS speech (for testing)
  python3 tools/voices.py manifest                  Rebuild audio/voice/manifest.js from the clips on disk
  python3 tools/voices.py prune                     Delete clips whose line no longer exists in the game

Set up voices in tools/voices.json: put a Fish Audio voice model ID next to each speaker.
Your API key is read from the FISH_API_KEY environment variable and is never written to disk.

Line extraction runs the game's own content files through macOS JavaScriptCore (osascript),
so ids always match what the game looks up. On another OS, export the script from the game in a
browser console with  copy(JSON.stringify(Wayfinder.voice.allLines()))  and pass --script file.json.
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOICE_DIR = ROOT / "audio" / "voice"
CONFIG = ROOT / "tools" / "voices.json"
FISH_URL = "https://api.fish.audio/v1/tts"
NARRATOR_FALLBACK = {"page", "note"}  # these use the narrator's voice unless given their own
SAY_VOICES = ["Samantha", "Daniel", "Karen", "Moira", "Tessa", "Rishi", "Fred", "Victoria", "Alex"]


def extract_lines(script_path=None):
    if script_path:
        return json.loads(Path(script_path).read_text(encoding="utf-8"))
    if sys.platform != "darwin":
        sys.exit("Line extraction needs macOS (osascript). Use --script with an exported file instead.")
    order = ["src/core.js", "src/voice.js", "src/content/companions.js"]
    order += sorted(str(p.relative_to(ROOT)) for p in (ROOT / "src/content/journeys").glob("*.js"))
    parts = ["var window = this; var console = { log: function(){}, warn: function(){}, error: function(){} };"]
    parts += [(ROOT / f).read_text(encoding="utf-8") for f in order]
    parts.append("JSON.stringify(Wayfinder.voice.allLines());")
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as tmp:
        tmp.write("\n;\n".join(parts))
        tmp_path = tmp.name
    try:
        out = subprocess.run(["osascript", "-l", "JavaScript", tmp_path], capture_output=True, text=True, encoding="utf-8")
    finally:
        os.unlink(tmp_path)
    if out.returncode != 0:
        sys.exit("Could not read the game's content:\n" + out.stderr)
    return json.loads(out.stdout)


def load_config():
    if not CONFIG.exists():
        sys.exit(f"Missing {CONFIG}")
    return json.loads(CONFIG.read_text(encoding="utf-8"))


def voice_for(cfg, speaker):
    voices = cfg.get("voices", {})
    ref = (voices.get(speaker) or "").strip()
    if not ref and speaker in NARRATOR_FALLBACK:
        ref = (voices.get("narrator") or "").strip()
    return ref


def existing_clip(line_id):
    for ext in ("mp3", "m4a"):
        path = VOICE_DIR / f"{line_id}.{ext}"
        if path.exists():
            return path
    return None


def speed_for(cfg, speaker):
    speed = cfg.get("speed")
    if isinstance(speed, dict):
        return speed.get(speaker, speed.get("default"))
    return speed


def fish_tts(text, reference_id, cfg, key, speaker=None):
    body = {
        "text": text,
        "reference_id": reference_id,
        "format": "mp3",
        "mp3_bitrate": cfg.get("mp3_bitrate", 128),
        "normalize": True,
        "latency": "normal",
    }
    if cfg.get("language"):
        body["language"] = cfg["language"]
    speed = speed_for(cfg, speaker)
    if speed:
        body["prosody"] = {"speed": speed}
    req = urllib.request.Request(
        FISH_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "model": cfg.get("model", "s1"),
        },
        method="POST",
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                return resp.read()
        except urllib.error.HTTPError as err:
            detail = err.read().decode("utf-8", "replace")[:300]
            if err.code in (429, 503) and attempt < 3:
                wait = 5 * (attempt + 1)
                print(f"    busy ({err.code}), retrying in {wait}s…")
                time.sleep(wait)
                continue
            if err.code == 401:
                sys.exit("Fish Audio rejected the API key (401). Check FISH_API_KEY.")
            if err.code == 402:
                sys.exit("Fish Audio says payment is required (402). Check your plan or credits.")
            raise RuntimeError(f"Fish Audio error {err.code}: {detail}")
        except urllib.error.URLError as err:
            if attempt < 3:
                time.sleep(5)
                continue
            raise RuntimeError(f"Network error: {err.reason}")
    raise RuntimeError("Fish Audio did not respond")


def say_tts(text, speaker, speakers, out_path):
    voice = SAY_VOICES[speakers.index(speaker) % len(SAY_VOICES)] if speaker in speakers else SAY_VOICES[0]
    with tempfile.TemporaryDirectory() as tmp:
        aiff = Path(tmp) / "line.aiff"
        if subprocess.run(["say", "-v", voice, "-o", str(aiff), text], capture_output=True).returncode != 0:
            subprocess.run(["say", "-o", str(aiff), text], check=True)
        subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", str(aiff), str(out_path)], check=True, capture_output=True)


def write_manifest(lines):
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for line in lines:
        clip = existing_clip(line["id"])
        if clip:
            manifest[line["id"]] = clip.name
    js = (
        "/* Generated by tools/voices.py — do not edit. Maps voiced line ids to clip files. */\n"
        "window.Wayfinder = window.Wayfinder || {};\n"
        f"window.Wayfinder.voiceManifest = {json.dumps(manifest, indent=0, sort_keys=True)};\n"
    )
    (VOICE_DIR / "manifest.js").write_text(js, encoding="utf-8")
    return manifest


def cmd_list(args):
    lines = extract_lines(args.script)
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    (VOICE_DIR / "script.json").write_text(json.dumps(lines, indent=2, ensure_ascii=False), encoding="utf-8")
    cfg = load_config()
    by_journey, by_speaker = {}, {}
    for line in lines:
        by_journey.setdefault(line["journey"], [0, 0, 0])
        by_journey[line["journey"]][0] += 1
        by_journey[line["journey"]][1] += len(line["text"])
        if existing_clip(line["id"]):
            by_journey[line["journey"]][2] += 1
        by_speaker[line["speaker"]] = by_speaker.get(line["speaker"], 0) + 1
    print(f"{len(lines)} voiced lines, {sum(len(l['text']) for l in lines):,} characters\n")
    print(f"{'journey':<10} {'lines':>6} {'chars':>8} {'have clip':>10}")
    for j, (n, chars, have) in by_journey.items():
        print(f"{j:<10} {n:>6} {chars:>8,} {have:>10}")
    print("\nspeaker      lines  voice")
    for s, n in sorted(by_speaker.items(), key=lambda kv: -kv[1]):
        ref = voice_for(cfg, s)
        note = ref if ref else "— not set (add a Fish Audio voice ID in tools/voices.json)"
        if not cfg["voices"].get(s) and ref:
            note += "  (narrator's voice)"
        who = cfg.get("_who", {}).get(s) or (cfg.get("_who", {}).get("narrator") if s in NARRATOR_FALLBACK else "")
        if who:
            note += f"  — {who.split(':')[0]}"
        print(f"{s:<12} {n:>5}  {note}")
    print(f"\nFull script written to {VOICE_DIR.relative_to(ROOT)}/script.json")


def cmd_generate(args):
    lines = extract_lines(args.script)
    if args.journey:
        lines = [l for l in lines if l["journey"] == args.journey]
        if not lines:
            sys.exit(f"No lines for journey '{args.journey}'.")
    cfg = load_config()
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    speakers = sorted({l["speaker"] for l in lines})
    key = None
    if args.engine == "fish":
        key = os.environ.get("FISH_API_KEY", "").strip()
        if not key:
            sys.exit("Set FISH_API_KEY first, e.g.  export FISH_API_KEY=...  (it is never saved to disk).")
    made, skipped, missing_voice, failed = 0, 0, set(), []
    todo = []
    for line in lines:
        clip = existing_clip(line["id"])
        if args.engine == "fish":
            if clip and clip.suffix == ".mp3" and not args.force:
                skipped += 1
                continue
        elif clip and not args.force:
            skipped += 1
            continue
        todo.append(line)
    if args.limit:
        todo = todo[: args.limit]
    for i, line in enumerate(todo, 1):
        label = f"[{i}/{len(todo)}] {line['journey']} · {line['speaker']}"
        try:
            if args.engine == "fish":
                ref = voice_for(cfg, line["speaker"])
                if not ref:
                    missing_voice.add(line["speaker"])
                    continue
                print(f"{label}: {line['text'][:60]}…")
                audio = fish_tts(line["text"], ref, cfg, key, line["speaker"])
                (VOICE_DIR / f"{line['id']}.mp3").write_bytes(audio)
                stale = VOICE_DIR / f"{line['id']}.m4a"
                if stale.exists():
                    stale.unlink()
            else:
                print(f"{label} (preview voice)")
                say_tts(line["text"], line["speaker"], speakers, VOICE_DIR / f"{line['id']}.m4a")
            made += 1
        except Exception as err:  # keep going; report at the end
            failed.append((line["id"], str(err)))
            print(f"    failed: {err}")
    manifest = write_manifest(extract_lines(args.script))
    print(f"\nMade {made} clips, kept {skipped} existing. Manifest lists {len(manifest)} clips.")
    if missing_voice:
        print("No voice set for: " + ", ".join(sorted(missing_voice)) + " — add Fish Audio voice IDs in tools/voices.json.")
    if failed:
        print(f"{len(failed)} lines failed; run the command again to retry them.")


def cmd_manifest(args):
    manifest = write_manifest(extract_lines(args.script))
    print(f"Manifest lists {len(manifest)} clips.")


def cmd_prune(args):
    keep = {l["id"] for l in extract_lines(args.script)}
    removed = 0
    for path in VOICE_DIR.glob("*.*"):
        if path.suffix in (".mp3", ".m4a") and path.stem not in keep:
            path.unlink()
            removed += 1
    write_manifest(extract_lines(args.script))
    print(f"Removed {removed} clips for lines that no longer exist.")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--script", help="Use an exported line list (JSON) instead of reading the content files")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list")
    gen = sub.add_parser("generate")
    gen.add_argument("--engine", choices=["fish", "say"], default="fish")
    gen.add_argument("--journey")
    gen.add_argument("--limit", type=int, help="Only generate this many clips (useful for a first test)")
    gen.add_argument("--force", action="store_true", help="Regenerate clips that already exist")
    sub.add_parser("manifest")
    sub.add_parser("prune")
    args = parser.parse_args()
    {"list": cmd_list, "generate": cmd_generate, "manifest": cmd_manifest, "prune": cmd_prune}[args.cmd](args)


if __name__ == "__main__":
    main()
