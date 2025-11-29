"""
Purpose

    Standardizes other copies to a baseline structure. You pick a base copy_xx.json.
    The script prunes every other copy_??.json so they only contain:
        - Groups that exist in the base.
        - Items within those groups that exist in the base.

    In other words, it removes extra groups and extra items that aren't in the base.

Typical use cases

    Keep all per-language/per-region copies structurally in sync with a canonical file.
    Prepare downstream tooling that assumes identical group/item sets across all copy files.

CLI
    python prune_copies_to_base.py <letters> [--dir DIR] [--dry-run]

Arguments & flags

    letters
    Two letters identifying the base copy file copy_<letters>.json.

    --dir DIR
    Directory to scan (default: current directory).

    --dry-run
    Show planned removals per file, but don't write changes.


What it scans

    Loads base: copy_<letters>.json.
    Collects all other copy_??.json in the same directory (case-insensitive), excluding the base file itself.

Behavior

    For each target copy:
        - If the top level isn't a JSON object, it's skipped.
        - Keeps only groups present in the base (expects dict-of-dicts).
        - Inside kept groups, keeps only items whose keys exist in the base's corresponding group.
        - Writes back in place, unless --dry-run is enabled.

    Reports per file:
        Number of groups/items removed.
        “no changes” if already aligned.

Edge cases & tips

    Base structure is treated as canonical:
        - Non-dict groups in base are ignored when building the structure reference (script assumes dict-of-dicts).
        - Non-dict groups in targets are dropped (since they don't match the expected structure).

    This script does not merge or add items—it only removes anything not in the base.

    If you want all copies to gain new keys present in base, 
        run merge_json.py --all --in-place --overwrite 
    using the base xx.json as the new data (different workflow).

    For safety, test with --dry-run first.

"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

PATTERN_COPY = re.compile(r"^copy_([A-Za-z]{2})\.json$", re.IGNORECASE)
PARENT_MAP = "messages"


def default_messages_dir() -> str:
    """
    Find the nearest ancestor directory named 'messages' starting from this script's location.
    Fallback to current working directory if not found.
    """
    here: Path = Path(__file__).resolve()
    for parent in [here.parent] + list(here.parents):
        if parent.name.lower() == PARENT_MAP.lower():
            return str(parent)
    
    return str(Path.cwd())


def load_json(path: str) -> Any:
    try:
        with open(file=path, mode="r", encoding="utf-8") as f:
            return json.load(fp=f)
    except FileNotFoundError:
        print(f"Error: File not found: {path}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {path}: {e}", file=sys.stderr)
        sys.exit(1)


def save_json(path: str, data: Any) -> None:
    with open(file=path, mode="w", encoding="utf-8") as f:
        json.dump(obj=data, fp=f, indent=4, ensure_ascii=False)


def is_two_letters(token: str) -> bool:
    return re.fullmatch(r"[A-Za-z]{2}", token) is not None


def prune_to_base(base: dict[str, Any], target: dict[str, Any]) -> dict[str, Any]:
    """
    Return a pruned copy of 'target' where:
    - Only groups present in 'base' remain.
    - Within each shared group, only items present in base[group] remain.
    - Non-dict groups/items in 'target' are removed (structure must match dict-of-dicts).
    """
    pruned: dict[str, Any] = {}
    for group, base_items in base.items():
        if not isinstance(base_items, dict):
            # Base expects groups to be dicts; skip non-dict in base
            continue

        tgt_items = target.get(group)
        if not isinstance(tgt_items, dict):
            # Target has no dict for this group; nothing to keep here
            continue

        # Keep only items present in base group
        kept_items = {k: v for k, v in tgt_items.items() if k in base_items}
        if kept_items:
            pruned[group] = kept_items

    return pruned


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Prune all copy_XX.json files to match the structure (groups/items) of a base file. "
            "Base is copy_<letters>.json (two letters). Other copy_??.json files are pruned in-place."
        )
    )
    parser.add_argument(
        "letters",
        help="Two letters identifying the base (e.g., 'ab' for base file 'copy_ab.json')."
    )
    parser.add_argument(
        "--dir",
        default=default_messages_dir(),
        help="Directory to scan (default: nearest 'messages')."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would change, but do not modify files."
    )
    args = parser.parse_args()

    if not is_two_letters(args.letters):
        print("Error: argument must be exactly two letters (e.g., 'ab', 'XY').", file=sys.stderr)
        sys.exit(1)

    directory = args.dir
    print(f"Working directory: {directory}")
    base_filename = f"copy_{args.letters}.json"
    base_path = os.path.join(directory, base_filename)

    # Load base JSON
    base_data = load_json(base_path)
    if not isinstance(base_data, dict):
        print(f"Error: Top-level of base file '{base_filename}' must be a JSON object.", file=sys.stderr)
        sys.exit(1)

    # Build a quick reference of base structure (expect dict-of-dicts)
    # (We trust the base as the canonical structure; non-dict groups are ignored.)
    base_dict = {g: items for g, items in base_data.items() if isinstance(items, dict)}

    # Scan directory for copy_??.json files
    all_files = os.listdir(directory)
    targets = [
        f for f in all_files
        if PATTERN_COPY.match(f) and f.lower() != base_filename.lower()
    ]

    if not targets:
        print("No other copy_??.json files found to prune. Nothing to do.")
        return

    print(f"Base file: {base_filename}")
    print(f"Found {len(targets)} other copy files to check.\n")

    for fname in sorted(targets):
        path = os.path.join(directory, fname)
        data = load_json(path)

        if not isinstance(data, dict):
            print(f"- {fname}: skipped (top-level is not an object)")
            continue

        before_groups = len([g for g in data.keys() if isinstance(data.get(g), dict)])
        before_items = sum(
            len(items) for g, items in data.items() if isinstance(items, dict)
        )

        pruned: dict[str, Any] = prune_to_base(base=base_dict, target=data)

        after_groups = len(pruned)
        after_items = sum(len(items) for items in pruned.values())

        groups_removed = max(0, before_groups - after_groups)
        items_removed = max(0, before_items - after_items)

        if groups_removed == 0 and items_removed == 0:
            print(f"- {fname}: no changes")
        else:
            change_msg = f"- {fname}: remove {groups_removed} groups, {items_removed} items"
            if args.dry_run:
                print(change_msg + " (dry-run)")
            else:
                save_json(path=path, data=pruned)
                print(change_msg + " ✅")

    if args.dry_run:
        print("\nDry run complete. No files were modified.")
    else:
        print("\nDone.")


if __name__ == "__main__":
    main()