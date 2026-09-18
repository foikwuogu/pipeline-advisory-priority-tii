"""
Sector-specific validation: how well do the TSA Pipeline-2021-02 outcome groups
this study relies on trace to independently published, citable control
frameworks, versus resting on the author's own judgment? This is the paper's
explicit substitute for primary operator-validation data (none exists for this
project) -- a transparent public-standards crosswalk, not operator-confirmed
validation. See docs/BUILD_SPEC.md and docs/LIMITATIONS.md for the framing
disclosure this analysis must not overstate.
"""
import csv
import json
from collections import defaultdict

IN_CSV = "data/raw/tsa_crosswalk_REUSED.csv"
OUT_CSV = "data/processed/framework_coverage_validation.csv"
OUT_JSON = "data/processed/framework_coverage_summary.json"

with open(IN_CSV, newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

outcomes = sorted(set(r["tsa_outcome_id"] for r in rows))
frameworks = sorted(set(r["framework"] for r in rows))

# Cell-level coverage: every (outcome, framework) pair present?
cell_index = {(r["tsa_outcome_id"], r["framework"]): r for r in rows}
n_possible_cells = len(outcomes) * len(frameworks)
n_present_cells = len(cell_index)

# Per-outcome, per-framework source_type table
detail_rows = []
for r in rows:
    detail_rows.append({
        "tsa_outcome_id": r["tsa_outcome_id"],
        "tsa_outcome_name": r["tsa_outcome_name"],
        "framework": r["framework"],
        "source_type": r["source_type"],
        "control_ids": r["control_ids"],
    })
with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["tsa_outcome_id", "tsa_outcome_name", "framework", "source_type", "control_ids"])
    w.writeheader()
    w.writerows(detail_rows)

# Source-type distribution overall and per framework
source_type_counts = defaultdict(int)
for r in rows:
    source_type_counts[r["source_type"]] += 1

per_framework_source_type = defaultdict(lambda: defaultdict(int))
for r in rows:
    per_framework_source_type[r["framework"]][r["source_type"]] += 1

per_outcome_source_type = defaultdict(lambda: defaultdict(int))
for r in rows:
    per_outcome_source_type[r["tsa_outcome_id"]][r["source_type"]] += 1

summary = {
    "n_outcomes": len(outcomes),
    "n_frameworks": len(frameworks),
    "n_possible_cells": n_possible_cells,
    "n_present_cells": n_present_cells,
    "cell_coverage_pct": round(100 * n_present_cells / n_possible_cells, 2),
    "source_type_counts_overall": dict(source_type_counts),
    "source_type_pct_overall": {k: round(100 * v / len(rows), 1) for k, v in source_type_counts.items()},
    "per_framework_source_type": {k: dict(v) for k, v in per_framework_source_type.items()},
    "per_outcome_source_type": {k: dict(v) for k, v in per_outcome_source_type.items()},
    "frameworks": frameworks,
    "outcomes": outcomes,
    "interpretation_note": (
        "Full (100%) cell coverage means every TSA outcome group has *some* "
        "mapped control identifier in every reused framework -- it does NOT mean "
        "every mapping rests on equally strong evidence. The source_type "
        "breakdown is the load-bearing number: 'primary' cites the framework's "
        "own document directly, 'derived' reuses a secondary open-license "
        "source, and 'author-mapped' is this project's own judgment with no "
        "ready-made crosswalk to cite. This is a public-standards proxy "
        "validation, not operator-reported or operator-confirmed validation -- "
        "no primary operator survey or interview data was collected for this "
        "project."
    ),
}
with open(OUT_JSON, "w") as f:
    json.dump(summary, f, indent=2)

print(json.dumps(summary, indent=2))
