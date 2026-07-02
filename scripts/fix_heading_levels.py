#!/usr/bin/env python3
"""Demote markdown heading levels in posts that use an in-content H1.

The post layout already renders the title as the single <h1>. Any '# ' heading
in the markdown body becomes a second <h1>, hurting SEO. This script shifts the
whole heading hierarchy down by one level (# -> ##, ## -> ###, ...) for every
post whose minimum heading level (outside fenced code blocks) is 1, preserving
the relative structure while leaving exactly one <h1> (the title).

Code fences (``` and ~~~) and their contents are never modified, so shell/YAML
comments starting with '#' stay untouched.
"""
import re
import sys
from pathlib import Path

POSTS_DIR = Path(__file__).resolve().parent.parent / "_posts"
FENCE_RE = re.compile(r"^\s*(```|~~~)")
HEADING_RE = re.compile(r"^(#{1,6})(\s.*)$")


def analyze(lines):
    """Return (min_level, max_level, heading_line_indices) outside code fences."""
    in_fence = False
    min_level = 7
    max_level = 0
    indices = []
    for i, line in enumerate(lines):
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        m = HEADING_RE.match(line)
        if m:
            level = len(m.group(1))
            min_level = min(min_level, level)
            max_level = max(max_level, level)
            indices.append(i)
    return min_level, max_level, indices


def demote(lines, indices):
    for i in indices:
        m = HEADING_RE.match(lines[i])
        lines[i] = "#" + m.group(1) + m.group(2)
    return lines


def main(apply_changes):
    changed = []
    skipped_overflow = []
    for path in sorted(POSTS_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        lines = text.split("\n")
        min_level, max_level, indices = analyze(lines)
        if not indices or min_level != 1:
            continue  # no in-content H1 -> nothing to fix
        if max_level >= 6:
            skipped_overflow.append(path.name)
            continue  # cannot demote past h6 safely
        n = sum(1 for i in indices if HEADING_RE.match(lines[i]).group(1) == "#")
        changed.append((path.name, n))
        if apply_changes:
            new_lines = demote(lines, indices)
            path.write_text("\n".join(new_lines), encoding="utf-8")

    mode = "APPLIED" if apply_changes else "DRY-RUN"
    print(f"[{mode}] Files with in-content H1 to demote: {len(changed)}")
    for name, n in changed:
        print(f"  {name}  (h1 count: {n})")
    if skipped_overflow:
        print(f"\nSkipped (would overflow past h6): {len(skipped_overflow)}")
        for name in skipped_overflow:
            print(f"  {name}")


if __name__ == "__main__":
    main(apply_changes="--apply" in sys.argv)
