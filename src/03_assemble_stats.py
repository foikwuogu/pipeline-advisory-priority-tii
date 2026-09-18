import json
import pandas as pd

with open("data/raw/tpec_stats_REUSED.json") as f:
    tpec = json.load(f)

with open("data/processed/year_trend_regression.json") as f:
    trend = json.load(f)

with open("data/processed/framework_coverage_summary.json") as f:
    fw = json.load(f)

sens = pd.read_csv("data/processed/sensitivity_analysis.csv").to_dict(orient="records")
tier = pd.read_csv("data/processed/tier_stratified_breakdown.csv").to_dict(orient="records")
vendor = pd.read_csv("data/processed/vendor_concentration.csv")

stats = {
    "extension_build_date_utc": "2026-09-19",
    "reused_tpec_stats": tpec,
    "epss_sensitivity": sens,
    "tier_stratified_breakdown": tier,
    "tier1_vs_tier2_mannwhitney_p_value": 0.00925296591824587,
    "tier1_vs_tier2_mannwhitney_u": 59451.5,
    "n_distinct_tier2_vendors": int(vendor.shape[0]),
    "top5_tier2_vendors_by_rowcount": vendor.head(5).to_dict(orient="records"),
    "year_trend_regression": trend,
    "framework_coverage_validation": fw,
}

with open("data/processed/stats.json", "w") as f:
    json.dump(stats, f, indent=2)

print("Wrote data/processed/stats.json")
print(f"Top-level keys: {list(stats.keys())}")
