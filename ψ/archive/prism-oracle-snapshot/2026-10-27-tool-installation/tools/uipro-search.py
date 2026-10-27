"""Run the workspace UI UX Pro Max search with portable Python on Windows."""
from pathlib import Path
import runpy
import sys

script = Path(__file__).resolve().parent.parent / ".agents" / "skills" / "ui-ux-pro-max" / "scripts" / "search.py"
sys.path.insert(0, str(script.parent))
sys.argv[0] = str(script)
runpy.run_path(str(script), run_name="__main__")
