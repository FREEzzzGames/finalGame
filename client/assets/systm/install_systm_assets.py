#!/usr/bin/env python3
from pathlib import Path
import zipfile
import sys

zip_path = Path(sys.argv[1] if len(sys.argv) > 1 else "SYSTeM_assets_150_extracted.zip")
target = Path("client/assets/systm")
target.mkdir(parents=True, exist_ok=True)

with zipfile.ZipFile(zip_path) as z:
    for name in z.namelist():
        if name.endswith("/"):
            continue
        dst = target / Path(name).name
        with z.open(name) as src, dst.open("wb") as out:
            out.write(src.read())

print(f"Installed {len(list(target.glob('*.png')))} PNG assets into {target}")
