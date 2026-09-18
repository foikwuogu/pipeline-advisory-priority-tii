"""
Pre-publication scan: refuses to signal "ready" while DRAFT stamps, [VERIFY]
tags, placeholder brackets, or obvious secrets remain in this repository's
docs/ and manuscript/ trees. Does not touch data/ or figures/ pixel content
(figures carry their own DRAFT stamp, checked visually, not by this scanner).

This script reports; it does not delete anything or modify the repo.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCAN_DIRS = ["docs", "manuscript", "README.md", "AUTHORS.json", "CITATION.cff"]

DRAFT_PATTERNS = [
    re.compile(r"\bDRAFT\b"),
    re.compile(r"\[VERIFY\]"),
    re.compile(r"\[to be filled in"),
    re.compile(r"\[insert"),
    re.compile(r"\bTBD\b"),
    re.compile(r"\bTODO\b"),
]
SECRET_PATTERNS = [
    re.compile(r"ghp_[A-Za-z0-9]{20,}"),
    re.compile(r"sk-[A-Za-z0-9]{20,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
]
# Files/lines that are EXPECTED to mention DRAFT/VERIFY (the checklist and
# guide docs themselves, and this scanner's own source) are allowed and
# reported separately, not as failures.
EXPECTED_FILES = {"VERIFY_CHECKLIST.md", "NEXT_STEPS.md", "PUBLISH_GUIDE.md",
                   "LIMITATIONS.md", "BUILD_SPEC.md", "publish_gate.py", "README.md"}


def scan_file(path: Path):
    hits = []
    text = path.read_text(encoding="utf-8", errors="ignore")
    for pat in DRAFT_PATTERNS:
        for m in pat.finditer(text):
            line_no = text[: m.start()].count("\n") + 1
            hits.append(("draft_marker", path, line_no, m.group(0)))
    for pat in SECRET_PATTERNS:
        for m in pat.finditer(text):
            line_no = text[: m.start()].count("\n") + 1
            hits.append(("secret", path, line_no, "[REDACTED]"))
    return hits


def main():
    all_hits = []
    for entry in SCAN_DIRS:
        p = ROOT / entry
        if p.is_file():
            all_hits.extend(scan_file(p))
        elif p.is_dir():
            for f in p.rglob("*"):
                if f.is_file() and f.suffix in {".md", ".docx", ".json", ".js", ".txt"}:
                    if f.suffix == ".docx":
                        continue  # binary; checked visually via rendered pages instead
                    all_hits.extend(scan_file(f))

    blocking = [h for h in all_hits if h[0] == "secret" or h[1].name not in EXPECTED_FILES]
    expected = [h for h in all_hits if h not in blocking]

    print(f"Scanned under: {', '.join(SCAN_DIRS)}")
    print(f"Expected DRAFT/placeholder mentions (in checklist/guide docs, not blocking): {len(expected)}")
    print(f"BLOCKING findings: {len(blocking)}")
    for kind, path, line, snippet in blocking:
        print(f"  [{kind}] {path.relative_to(ROOT)}:{line}: {snippet}")

    if blocking:
        print("\nGATE: FAIL -- resolve the findings above before publishing.")
        sys.exit(1)
    else:
        print("\nGATE: PASS on the automated checks above.")
        print("This does NOT mean the project is verified -- docs/VERIFY_CHECKLIST.md")
        print("still requires the author's own, human sign-off before anything here")
        print("is published, pushed publicly, or submitted.")
        sys.exit(0)


if __name__ == "__main__":
    main()
