"""
Purpose

    Merges new data (xx.json) into a base copy (copy_xx.json or xx_copy.json),
    with precise control over whether existing values can be overwritten. 
    Works on a single two-letter pair or in bulk.

        Base = copy_xx.json (preferred) or xx_copy.json (fallback).
        New data = xx.json.

Output:

    By default: merged_xx.json (or a folder of them with --out-dir).
    With --in-place: overwrites the base file directly.

Merge rules

    Without --overwrite: only adds new groups and new items. Existing values remain untouched.
    With --overwrite: existing items in base are replaced by values from xx.json.
    Non-dict groups or items are skipped unless --overwrite enables replacement of the whole group.

Sorting

    Output is recursively sorted by keys (groups and items alphabetically) for stable diffs.

CLI

    python merge_json.py [letters] [--overwrite] [--dir DIR] [--out FILE] [--in-place]
    python merge_json.py --all [--overwrite] [--dir DIR] [--out-dir DIR] [--in-place]
    
Modes

    Single pair: provide letters (e.g., ab).
    Bulk mode: use --all to process every detectable two-letter pair in the directory.  
    
Flags

    letters
    Exactly two letters (e.g., ab). Ignored if --all is used.

    --all
    Discovers all pairs where both xx.json and a base candidate (copy_xx.json or xx_copy.json) exist.

    --overwrite
    Replace existing values in base when keys overlap.

    --dir DIR
    Directory to scan for input files.

    --out FILE (single-pair only)
    Custom output file path.

    --out-dir DIR (bulk)
    Where to write merged_xx.json files when using --all.

    --in-place
    Overwrites the base file (copy_xx.json or xx_copy.json) instead of writing merged_xx.json. (Great for “apply changes to the copies” workflows.)   
    
Behavior & Output

    Prefers copy_xx.json as base; uses xx_copy.json if the former is missing.
    Validates that both base and new files exist and are JSON objects at the top level.
    Prints one status line per processed pair (including overwrite mode and output path).
    
Edge cases & tips

    If a group exists in base as a non-dict and in new as a dict:
        Without --overwrite: keep base as-is.
        With --overwrite: replace base group with the dict from new.

    If an item exists in both:
        Without --overwrite: keep base value.
        With --overwrite: take new value.

    If you want a “round trip” workflow:
        1) copy_json_files.py --copy to snapshot xx.json files
        2) Edit xx.json files (or replace them via i18Nexus.com)
        3) merge_json.py --all --in-place to apply changes into copies
        4) Optionally copy_json_files.py --restore to restore originals from updated copies

    Consider --out-dir for bulk runs to keep outputs away from sources.   
    
"""


import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

BASE_PREFIX = "copy_"
BASE_SUFFIX = "_copy"
TWO_LETTERS_RE = re.compile(r"^[A-Za-z]{2}$")
NEW_FILE_RE = re.compile(r"^([A-Za-z]{2})\.json$")
BASE_PREFIX_RE = re.compile(r"^copy_([A-Za-z]{2})\.json$", re.IGNORECASE)
BASE_SUFFIX_RE = re.compile(r"^([A-Za-z]{2})_copy\.json$", re.IGNORECASE)
PARENT_MAP = "messages"


# ---------- JSON Helpers ----------
def merge_json(base_data: dict[str, Any], new_data: dict[str, Any], overwrite:bool=False) -> dict[str, Any]:
    """
    Merge new_data into base_data.

    - If overwrite is False (default): keep existing groups/items in base_data;
      only add groups/items that don't exist yet.
    - If overwrite is True: values from new_data replace existing items in base_data
      when keys collide; new groups/items are added as well.
    """
    
    for group, items in new_data.items():
        # Only handle dict-like groups; skip anything malformed
        if not isinstance(items, dict):
            continue
        
        if group not in base_data:
             # Add entirely new group
            base_data[group] = items
            continue
        
        if not isinstance(base_data[group], dict):
             # If base has a non-dict here and overwrite is allowed, replace it; else, skip
            if overwrite:
                base_data[group] = items
            
            continue
        
        for item_key, item_value in items.items():
            # Merge items within existing group
            if item_key not in base_data[group] or overwrite:
                base_data[group][item_key] = item_value
    
    return base_data


def sort_json(data):
    """Recursively sort dictionary keys alphabetically."""
    if isinstance(data, dict):
        return {k: sort_json(v) for k, v in sorted(data.items())}
    elif isinstance(data, list):
        return [sort_json(x) for x in data]
    else:
        return data


def load_json(path: str) -> dict[str, Any]:
    # Load JSON file
    try:
        with  open(file=path, mode='r', encoding='utf-8') as file:
            data = json.load(fp=file)
    
    except FileNotFoundError:
        raise
    
    except json.JSONDecodeError as e:
        print(f"Error: '{path}' is not a valid JSON: {e}", file=sys.stderr)
        sys.exit(1)
        
    if not isinstance(data, dict):
        print(f"Error: top-level of '{path}' must be a JSON object.", file=sys.stderr)
        sys.exit(1)
    
    return data


# ---------- File Locators ----------
def default_messages_dir() -> str:
    """
    Find the nearest ancestor directory named 'messages' starting from this script's location.
    Fallback to current working directory if not found.
    """
    here = Path(__file__).resolve()
    for parent in [here.parent] + list(here.parents):
        if parent.name.lower() == PARENT_MAP.lower():
            return str(parent)
    
    return str(Path.cwd())


def find_base_file(directory: str, letters: str) -> str | None:
    """Prefer copy_<xx>.json, else <xx>_copy.json"""
    candidates: list[str] = [
        os.path.join(directory, f"{BASE_PREFIX}{letters}.json"),
        os.path.join(directory, f"{letters}{BASE_SUFFIX}.json"),
    ]
    for c in candidates:
        if os.path.exists(path=c):
            return c
    
    return None


def find_new_file(directory: str, letters: str) -> str:
    return os.path.join(directory, f"{letters}.json")


def output_path_for(directory: str, out_dir: str | None, letters: str) -> str:
    target_dir: str = out_dir if out_dir else directory
    os.makedirs(name=target_dir, exist_ok=True)
    
    return os.path.join(target_dir, f"merged_{letters}.json")


# ---------- Core Merge ----------
def process_pair(directory: str, letters: str, overwrite: bool, out_dir: str | None, in_place: bool = False, explicit_out: str | None = None) -> bool:
    base_file: str | None = find_base_file(directory, letters)
    if not base_file:
        print(f"[{letters}] Skipped: base file not found (tried '{BASE_PREFIX}{letters}.json' and '{letters}{BASE_SUFFIX}.json').", file=sys.stderr)
        return False

    new_file: str = find_new_file(directory, letters)
    if not os.path.exists(path=new_file):
        print(f"[{letters}] Skipped: new data file '{letters}.json' not found.", file=sys.stderr)
        return False

    base_data: dict[str, Any] = load_json(base_file)
    new_data: dict[str, Any] = load_json(new_file)
    merged: dict[str, Any] = merge_json(base_data, new_data, overwrite=overwrite)
    merged: dict[str, Any] = sort_json(merged)

    
    # If explicit_out is provided, use it (only valid when processing a single pair)
    if in_place:
        out_path: str = base_file
    elif explicit_out:
        out_path: str = explicit_out
        os.makedirs(name=os.path.dirname(out_path) or ".", exist_ok=True)
    else:
        out_path: str = output_path_for(directory, out_dir, letters)

    with open(file=out_path, mode="w", encoding="utf-8") as out:
        json.dump(obj=merged, fp=out, indent=2, ensure_ascii=False, sort_keys=False)

    mode = "in_place" if in_place else f"→ {out_path}"

    print(f"[{letters}] Merged '{os.path.basename(new_file)}' → base '{os.path.basename(base_file)}' "
          f"({'overwrite' if overwrite else 'no-overwrite'}). saved {mode}")
    
    return True


# ---------- Multi-pair mode ----------
def collect_two_letter_pairs(directory: str) -> set:
    """
    Discover all two-letter pairs that have:
      - a new file '<xx>.json' and
      - at least one base candidate: 'copy_<xx>.json' or '<xx>_copy.json'
    """
    files: list[str] = os.listdir(directory)
    pairs: set[Any] = set()

    # From new files
    for f in files:
        m = NEW_FILE_RE.match(f)
        if m:
            letters = m.group(1).lower()
            if find_base_file(directory=directory, letters=letters):
                pairs.add(letters)
    
    return pairs


# ---------- CLI ----------
def parse_args():
    parser = argparse.ArgumentParser(
        description="Merge <xx>.json (new data) into copy_<xx>.json or <xx>_copy.json (base). "
                    "Run for one pair or use --all to process all available two-letter pairs."
    )
    parser.add_argument("letters", nargs="?", help="Two letters identifying the pair, e.g. 'ab' for ab.json + copy_ab.json")
    parser.add_argument("--all", action="store_true", help="Process all detected two-letter pairs in the directory")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing items in base with new data")
    parser.add_argument("--dir", default=default_messages_dir(), help="Directory to scan (default: nearest 'messages')")
    parser.add_argument("--out", default=None, help="Output file (only when merging a single pair)")
    parser.add_argument("--out-dir", default=None, help="Directory for outputs (useful with --all); files named merged_<xx>.json")
    parser.add_argument("--in-place", action="store_true", help="Overwrite the base file directly instead of writing a merged_XX.json")
    args = parser.parse_args()

    # Validate mode
    if args.all:
        if args.letters:
            print("Note: --all ignores the single 'letters' argument.", file=sys.stderr)
        if args.out:
            print("Error: --out cannot be used with --all. Use --out-dir or --in-place instead.", file=sys.stderr)
            sys.exit(1)
    else:
        if not args.letters:
            print("Error: provide two letters (e.g., 'ab') or use --all.", file=sys.stderr)
            sys.exit(1)
        if not TWO_LETTERS_RE.fullmatch(args.letters):
            print("Error: 'letters' must be exactly two letters (e.g., 'ab', 'XY').", file=sys.stderr)
            sys.exit(1)

    return args


def main():
    
    args = parse_args()
    directory = args.dir
    
    if args.all:
        pairs = sorted(collect_two_letter_pairs(directory))
        if not pairs:
            print("No valid two-letter pairs found (need both base and new files). Nothing to do.")
            return
        
        print(f"Found {len(pairs)} pair(s): {', '.join(pairs)}")
        success = 0
        for letters in pairs:
            if process_pair(directory=directory, letters=letters, overwrite=args.overwrite, out_dir=args.out_dir, in_place=args.in_place):
                success += 1
        print(f"\nDone. {success}/{len(pairs)} merged.")
        
    else:
        # Single pair
        _ = process_pair(
                directory=directory,
                letters=args.letters,
                overwrite=args.overwrite,
                out_dir=None if args.out else args.out_dir, # ignore out_dir when explicit out is given
                in_place=args.in_place,
                explicit_out=args.out
        )
    
    
if __name__ == "__main__":
    main()