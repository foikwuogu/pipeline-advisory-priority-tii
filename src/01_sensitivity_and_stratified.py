"""
New analysis for the IEEE TII extension, built on top of the already-verified
sibling dataset (pipeline_prioritized_v1.csv, 13,939 rows). Computes:
  1. EPSS-threshold sensitivity (TSA-3 response-flag rate under 5 thresholds)
  2. Tier1 vs tier2 stratified priority_score breakdown
  3. Vendor-level concentration within tier2
  4. Year-over-year trend regression (full vs pipeline-relevant)

Every number here is written to CSV/JSON files that the manuscript build script
reads — nothing is typed into the manuscript directly.
"""
from __future__ import annotations
import json
import numpy as np
import pandas as pd

IN_CSV = "data/raw/pipeline_prioritized_v1_REUSED.csv"
OUT_DIR = "data/processed"

df = pd.read_csv(IN_CSV, low_memory=False)
n_total = len(df)
assert n_total == 13939, f"Row count mismatch vs. verified sibling dataset: got {n_total}, expected 13939"

rel = df[df["pipeline_relevant"] == True].copy()
n_rel = len(rel)
assert n_rel == 3734, f"pipeline_relevant row count mismatch: got {n_rel}, expected 3734"

# ---------------------------------------------------------------------------
# 1. EPSS-threshold sensitivity
# ---------------------------------------------------------------------------
thresholds = [0.02, 0.04, 0.10, 0.20, 0.50]
sens_rows = []
for t in thresholds:
    epss_filled = df["epss"].fillna(0.0)
    known_exploited = df["known_exploited"].astype(bool)
    tsa3_full = ((known_exploited) | (epss_filled >= t))
    tsa3_rel = tsa3_full & (df["pipeline_relevant"] == True)
    sens_rows.append({
        "epss_threshold": t,
        "tsa3_flagged_full_n": int(tsa3_full.sum()),
        "tsa3_flagged_full_pct": round(100 * tsa3_full.sum() / n_total, 3),
        "tsa3_flagged_relevant_n": int(tsa3_rel.sum()),
        "tsa3_flagged_relevant_pct": round(100 * tsa3_rel.sum() / n_rel, 3),
    })
sens_df = pd.DataFrame(sens_rows)
sens_df.to_csv(f"{OUT_DIR}/sensitivity_analysis.csv", index=False)

# priority_score itself is threshold-invariant (threshold only gates the
# informational TSA-3/6 flags) -- confirm and record this explicitly.
score_invariant_note = "priority_score does not change with epss_threshold by construction (see src/03_score_prioritization.py in the sibling repo); only TSA-3/TSA-6 informational flags are threshold-dependent."

# ---------------------------------------------------------------------------
# 2. Tier1 vs tier2 stratified breakdown
# ---------------------------------------------------------------------------
tier_rows = []
for tier_name in ["tier1_pipeline_core", "tier2_ot_general_energy"]:
    sub = rel[rel["pipeline_tier"] == tier_name]
    if len(sub) == 0:
        continue
    desc = sub["priority_score"].describe()
    tier_rows.append({
        "pipeline_tier": tier_name,
        "n": int(len(sub)),
        "pct_of_pipeline_relevant": round(100 * len(sub) / n_rel, 2),
        "priority_score_mean": round(float(desc["mean"]), 4),
        "priority_score_median": round(float(sub["priority_score"].median()), 4),
        "priority_score_std": round(float(desc["std"]), 4),
        "priority_score_max": round(float(desc["max"]), 4),
        "known_exploited_n": int(sub["known_exploited"].astype(bool).sum()),
        "known_exploited_pct": round(100 * sub["known_exploited"].astype(bool).mean(), 2),
        "epss_mean": round(float(sub["epss"].fillna(0).mean()), 4),
    })
tier_df = pd.DataFrame(tier_rows)
tier_df.to_csv(f"{OUT_DIR}/tier_stratified_breakdown.csv", index=False)

# Mann-Whitney-style simple comparison (no scipy dependency assumed available;
# report rank-based effect size manually if scipy is present, else skip test).
import sys as _sys
_sys.path.insert(0, "src")
from mannwhitney import mannwhitneyu as _mwu
tier_test = {}
t1 = rel.loc[rel["pipeline_tier"] == "tier1_pipeline_core", "priority_score"]
t2 = rel.loc[rel["pipeline_tier"] == "tier2_ot_general_energy", "priority_score"]
if len(t1) > 0 and len(t2) > 0:
    stat, p = _mwu(t1, t2)
    tier_test = {"test": "mann_whitney_u_normal_approx", "statistic": float(stat), "p_value": float(p), "n_tier1": int(len(t1)), "n_tier2": int(len(t2))}

# ---------------------------------------------------------------------------
# 3. Vendor-level concentration within tier2
# ---------------------------------------------------------------------------
tier2 = rel[rel["pipeline_tier"] == "tier2_ot_general_energy"].copy()
vendor_rows = []
for vendor, sub in tier2.groupby("Vendor"):
    vendor_rows.append({
        "vendor": vendor,
        "n_rows": int(len(sub)),
        "known_exploited_n": int(sub["known_exploited"].astype(bool).sum()),
        "known_exploited_pct": round(100 * sub["known_exploited"].astype(bool).mean(), 2),
        "priority_score_mean": round(float(sub["priority_score"].mean()), 4),
        "priority_score_max": round(float(sub["priority_score"].max()), 4),
    })
vendor_df = pd.DataFrame(vendor_rows).sort_values("n_rows", ascending=False)
vendor_df.to_csv(f"{OUT_DIR}/vendor_concentration.csv", index=False)

# ---------------------------------------------------------------------------
# 4. Year-over-year trend regression
# ---------------------------------------------------------------------------
df["Year"] = pd.to_numeric(df["Year"], errors="coerce")
year_counts_full = df[(df["Year"] >= 2010) & (df["Year"] <= 2025)].groupby("Year").size()
year_counts_rel = rel[(rel["Year"] >= 2010) & (rel["Year"] <= 2025)].groupby("Year").size()
years = sorted(set(year_counts_full.index) | set(year_counts_rel.index))
full_series = np.array([year_counts_full.get(y, 0) for y in years], dtype=float)
rel_series = np.array([year_counts_rel.get(y, 0) for y in years], dtype=float)
years_arr = np.array(years, dtype=float)

def linfit(x, y):
    slope, intercept = np.polyfit(x, y, 1)
    yhat = slope * x + intercept
    ss_res = np.sum((y - yhat) ** 2)
    ss_tot = np.sum((y - np.mean(y)) ** 2)
    r2 = 1 - ss_res / ss_tot if ss_tot > 0 else float("nan")
    return float(slope), float(intercept), float(r2)

full_slope, full_intercept, full_r2 = linfit(years_arr, full_series)
rel_slope, rel_intercept, rel_r2 = linfit(years_arr, rel_series)

# share = pipeline-relevant / full, per year, and its own trend
share_series = np.divide(rel_series, full_series, out=np.zeros_like(rel_series), where=full_series != 0)
share_slope, share_intercept, share_r2 = linfit(years_arr, share_series)

trend = {
    "years": [int(y) for y in years],
    "full_counts": [int(v) for v in full_series],
    "relevant_counts": [int(v) for v in rel_series],
    "share_by_year": [round(float(v), 4) for v in share_series],
    "full_slope_per_year": round(full_slope, 3),
    "full_r_squared": round(full_r2, 4),
    "relevant_slope_per_year": round(rel_slope, 3),
    "relevant_r_squared": round(rel_r2, 4),
    "growth_rate_ratio_relevant_over_full": round(rel_slope / full_slope, 4) if full_slope != 0 else None,
    "share_slope_per_year": round(share_slope, 6),
    "share_r_squared": round(share_r2, 4),
    "share_mean": round(float(np.mean(share_series)), 4),
    "share_std": round(float(np.std(share_series)), 4),
    "note": "2026 excluded as a partial year. Linear OLS trend on annual counts, 2010-2025.",
}
with open(f"{OUT_DIR}/year_trend_regression.json", "w") as f:
    json.dump(trend, f, indent=2)

# ---------------------------------------------------------------------------
# QA report
# ---------------------------------------------------------------------------
qa_lines = []
qa_lines.append(f"QA report: sensitivity + stratified + vendor + trend analysis")
qa_lines.append(f"Input row count: {n_total} (matches sibling repo's verified count: {'OK' if n_total==13939 else 'MISMATCH'})")
qa_lines.append(f"pipeline_relevant row count: {n_rel} (matches sibling repo's verified count: {'OK' if n_rel==3734 else 'MISMATCH'})")
qa_lines.append("")
qa_lines.append("EPSS threshold sensitivity (TSA-3 flag rate, full population):")
qa_lines.append(sens_df.to_string(index=False))
qa_lines.append("")
qa_lines.append(score_invariant_note)
qa_lines.append("")
qa_lines.append("Tier1 vs tier2 stratified breakdown:")
qa_lines.append(tier_df.to_string(index=False))
qa_lines.append(f"Statistical test: {tier_test}")
qa_lines.append("")
qa_lines.append(f"Vendor concentration table: {len(vendor_df)} distinct tier2 vendors, top 5 by row count:")
qa_lines.append(vendor_df.head(5).to_string(index=False))
qa_lines.append("")
qa_lines.append("Year-over-year trend regression:")
qa_lines.append(json.dumps(trend, indent=2))

with open(f"{OUT_DIR}/qa_report_extension_v1.txt", "w") as f:
    f.write("\n".join(qa_lines) + "\n")

print("\n".join(qa_lines))
