"""
Purpose

    Creates or restores two-letter JSON copies. It operates on filenames that match
    the strict pattern <letters><letters>.json (exactly two A-Z characters, case-insensitive).

        --copy: makes copy_xx.json from xx.json.
        --restore: restores xx.json from copy_xx.json.

What it scans

    The specified directory (default: current directory).
    Matches base files with exactly two letters: ab.json, XY.json, etc. (Ignores abc.json, data.json.)

CLI

    python copy_json_files.py [--copy | --restore] [directory]
    
Flags

    --copy
    For each xx.json, copy → copy_xx.json. Preserves timestamps (uses shutil.copy2).

    --restore
    For each copy_xx.json, copy → xx.json (overwrites if present).

    directory (optional)
    Folder to scan; default .
    
Behavior & Output

    Non-matching files are ignored.
    Will create or overwrite the target file silently (prints a “Copied: …” line per file).
    Doesn't parse JSON (pure file copy).
    Case-insensitive pattern (so AB.json is valid; output becomes copy_AB.json).

Edge cases & tips

    If both xx.json and copy_xx.json exist and you run --copy, the copy operation still proceeds (overwrites the existing copy).
    With --retrore, existing xx.json will be overwritten—add a manual backup step if you need one.
    If you plan to merge later, using --copy is a good way to snapshot the originals. 
    
"""

import os
import re
import shutil
import sys
from pathlib import Path

MODE_COPY = "copy"
MODE_RESTORE = "restore"
PARENT_MAP = "messages"


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


def copy_json_files(directory=".", mode=MODE_COPY):
    """
    Copy JSON files in either direction:
        - mode = 'copy' : Copy all JSON files that match the pattern <letter><letter>.json
                          to new files named copy_<letter><letter>.json
        - mode = 'back' : Copy all JSON files that match pattern copy_<letter><letter>.json
                          te files named <letter><letter>.json
    """
    # Regex: two letters followed by '.json' (case-insensitive)
    base_pattern = re.compile(r"^[A-Za-z]{2}\.json$", re.IGNORECASE)
    restore_pattern = re.compile(r"^copy_([A-Za-z]{2})\.json$", re.IGNORECASE)
    
    for filename in os.listdir(directory):
        src = os.path.join(directory, filename)
        dest = None
        
        if mode == MODE_COPY and base_pattern.match(filename):
            name, ext = os.path.splitext(filename)
            dest = os.path.join(directory, f"copy_{name}{ext}")
            
        if mode == MODE_RESTORE and restore_pattern.match(filename):
            base_name = restore_pattern.match(filename).group(1)
            dest = os.path.join(directory, f"{base_name}.json")
        
        if dest:
            shutil.copy2(src, dest)
            print(f"Copied: {src} → {dest}")
            
    print("\n Done!")

            
if __name__ == "__main__":

    if len(sys.argv) < 2 or sys.argv[1] not in [f"--{MODE_COPY}", f"--{MODE_RESTORE}"]:
        print(f"Usage: python copy_json_files.py [--{MODE_COPY} | --{MODE_RESTORE}] [directory]")
    
    else:
        mode = sys.argv[1][2:]
        directory = sys.argv[2] if len(sys.argv) == 3 else default_messages_dir()
        
        copy_json_files(directory=directory, mode=mode)
        