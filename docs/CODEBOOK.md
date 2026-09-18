# Codebook

This project's new outputs, in `data/processed/`. For the underlying row-level
dataset's own columns (inherited unchanged from `pipeline_prioritized_v1_REUSED.csv`),
see the sibling repo's `docs/CODEBOOK.md` — not repeated here.

## `sensitivity_analysis.csv`

| Column | Type | Definition |
|---|---|---|
| `epss_threshold` | float | The EPSS high-exploitation threshold tested (0.02, 0.04, 0.10, 0.20, 0.50). |
| `tsa3_flagged_full_n`, `tsa3_flagged_full_pct` | int, float | Rows flagged TSA-3 (Continuous Monitoring) under this threshold, full dataset (n=13,939). |
| `tsa3_flagged_relevant_n`, `tsa3_flagged_relevant_pct` | int, float | Same, restricted to `pipeline_relevant=True` rows (n=3,734). |

## `tier_stratified_breakdown.csv`

| Column | Type | Definition |
|---|---|---|
| `pipeline_tier` | string | `tier1_pipeline_core` or `tier2_ot_general_energy` (restricted to `pipeline_relevant=True` rows). |
| `n`, `pct_of_pipeline_relevant` | int, float | Row count and share of the 3,734-row pipeline-relevant subset. |
| `priority_score_mean/median/std/max` | float | Distributional statistics of `priority_score` within this tier. |
| `known_exploited_n/pct` | int, float | CISA KEV membership within this tier. |
| `epss_mean` | float | Mean EPSS score within this tier (missing values treated as 0). |

## `vendor_concentration.csv`

| Column | Type | Definition |
|---|---|---|
| `vendor` | string | Raw `Vendor` field value (not normalized — see `docs/LIMITATIONS.md` item 4), restricted to `pipeline_tier=tier2_ot_general_energy` rows. |
| `n_rows` | int | Row count for this vendor string. |
| `known_exploited_n/pct` | int, float | KEV membership for this vendor's rows. |
| `priority_score_mean/max` | float | Priority-score statistics for this vendor's rows. |

## `year_trend_regression.json`

OLS linear-trend fit of annual advisory counts, 2010–2025 (2026 excluded as a
partial year), for the full dataset and the pipeline-relevant subset, plus the
pipeline-relevant *share* (relevant/full) and its own separate trend fit.
Fields: `years`, `full_counts`, `relevant_counts`, `share_by_year`,
`full_slope_per_year`, `full_r_squared`, `relevant_slope_per_year`,
`relevant_r_squared`, `growth_rate_ratio_relevant_over_full`,
`share_slope_per_year`, `share_r_squared`, `share_mean`, `share_std`.

## `framework_coverage_validation.csv` / `framework_coverage_summary.json`

Row-level and summary form of the Section IV crosswalk analysis, derived from
`data/raw/tsa_crosswalk_REUSED.csv` (30 rows: 6 TSA outcomes × 5 frameworks).

| Column | Type | Definition |
|---|---|---|
| `tsa_outcome_id`, `tsa_outcome_name` | string | TSA Pipeline-2021-02 outcome group (TSA-1 .. TSA-6). |
| `framework` | string | One of the 5 reused frameworks. |
| `source_type` | string | `primary` (framework's own document cited directly), `derived` (secondary open-license source), or `author-mapped` (this project's own judgment; see `docs/LIMITATIONS.md` item 2). |
| `control_ids` | string | The framework's own control/requirement identifiers for this outcome, as recorded in the reused crosswalk. |

Summary JSON adds: `cell_coverage_pct` (share of the 30 possible cells with any
mapping — 100% here), `source_type_counts_overall` / `_pct_overall`,
`per_framework_source_type`, `per_outcome_source_type`.

## `stats.json`

Assembled from every file above plus the reused base-paper stats
(`reused_tpec_stats`, a copy of the sibling repo's own final `stats.json`).
This is the single file the manuscript build script (`manuscript/build_manuscript.js`)
reads — every number quoted in the manuscript traces here, per the project's
stats-file rule (no number is typed by hand into the manuscript text).
