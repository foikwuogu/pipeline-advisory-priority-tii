"""
Figures for the IEEE TII extension manuscript, built under the dataviz skill's
scientific-figure conventions: one hue per series (fixed categorical order,
validated for CVD separation), no dual axes, direct annotation of the values
that matter, axes labeled with units, vintage stated in the caption (added in
the manuscript, not the image). DRAFT-stamped by default; pass --final to
remove the stamp once the verification gate has passed.

Colors are the validated default categorical slots (see dataviz skill,
references/palette.md): blue #2a78d6 (slot 1), orange #eb6834 (slot 2),
aqua #1baf7a (slot 3), violet #4a3aa7 (slot 7). Validated
2026-09-19 via scripts/validate_palette.js: all CVD/normal-vision checks pass;
aqua requires visible direct labels (contrast WARN vs. light surface) --
applied below.
"""
import json
import sys
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker

FINAL = "--final" in sys.argv
STAMP = None if FINAL else "DRAFT"

BLUE = "#2a78d6"
ORANGE = "#eb6834"
AQUA = "#1baf7a"
VIOLET = "#4a3aa7"
GRAY = "#8a8a86"
TEXT = "#0b0b0b"
SEQ_STRONG = "#184f95"   # ordinal step 600 -- "primary" (strongest evidence)
SEQ_MID = "#2a78d6"      # ordinal step 450 -- "derived"
SEQ_WEAK = "#9ec5f4"     # ordinal step 200 -- "author-mapped" (weakest evidence)

plt.rcParams.update({
    "font.size": 11,
    "axes.edgecolor": "#c7c6c0",
    "axes.labelcolor": TEXT,
    "text.color": TEXT,
    "xtick.color": TEXT,
    "ytick.color": TEXT,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "figure.facecolor": "white",
    "savefig.facecolor": "white",
})


def stamp(ax):
    if STAMP:
        ax.text(0.99, 0.02, STAMP, transform=ax.transAxes, ha="right", va="bottom",
                 fontsize=9, color="#c0392b", fontweight="bold", alpha=0.85)


with open("data/processed/stats.json") as f:
    stats = json.load(f)

# --------------------------------------------------------------------------
# Fig 3: EPSS-threshold sensitivity -- TSA-3 flag rate vs. threshold
# --------------------------------------------------------------------------
sens = pd.DataFrame(stats["epss_sensitivity"])
fig, ax = plt.subplots(figsize=(6.5, 4.2), dpi=200)
ax.plot(sens["epss_threshold"], sens["tsa3_flagged_full_pct"], marker="o",
        color=BLUE, linewidth=2, markersize=6, label="Full dataset (n=13,939)")
ax.plot(sens["epss_threshold"], sens["tsa3_flagged_relevant_pct"], marker="o",
        color=ORANGE, linewidth=2, markersize=6, label="Pipeline-relevant (n=3,734)")
ax.axvline(0.10, color=GRAY, linestyle="--", linewidth=1)
ax.text(0.102, ax.get_ylim()[1]*0.92, "this study's\nthreshold (0.10)", fontsize=8.5, color=GRAY)
ax.set_xlabel("EPSS high-exploitation threshold")
ax.set_ylabel("Rows flagged TSA-3 (Continuous Monitoring), %")
ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{x:.2f}"))
ax.legend(frameon=False, loc="upper right", fontsize=9)
ax.set_title("Fig. 3. TSA-3 flag-rate sensitivity to the EPSS threshold", fontsize=10.5, loc="left")
stamp(ax)
fig.tight_layout()
fig.savefig("figures/fig3_epss_sensitivity.png")
plt.close(fig)

# --------------------------------------------------------------------------
# Fig 4: tier1 vs tier2 priority_score -- mean with n and significance note
# --------------------------------------------------------------------------
tier = pd.DataFrame(stats["tier_stratified_breakdown"])
fig, ax = plt.subplots(figsize=(6.5, 4.2), dpi=200)
labels = ["tier1_pipeline_core\n(n=42)", "tier2_ot_general_energy\n(n=3,692)"]
means = tier["priority_score_mean"].tolist()
colors = [AQUA, VIOLET]
bars = ax.bar(labels, means, color=colors, width=0.55)
for b, v in zip(bars, means):
    ax.text(b.get_x() + b.get_width()/2, v + 0.0006, f"{v:.4f}", ha="center",
            va="bottom", fontsize=10, color=TEXT, fontweight="bold")
ax.set_ylabel("Mean priority_score")
ax.set_title("Fig. 4. Priority score by pipeline-relevance tier\n(Mann-Whitney U, p = 0.0093)", fontsize=10.5, loc="left")
stamp(ax)
fig.tight_layout()
fig.savefig("figures/fig4_tier_stratified.png")
plt.close(fig)

# --------------------------------------------------------------------------
# Fig 5: framework coverage by source_type (ordinal heatmap: outcome x framework)
# --------------------------------------------------------------------------
cov = pd.read_csv("data/processed/framework_coverage_validation.csv")
outcomes = sorted(cov["tsa_outcome_id"].unique())
frameworks = sorted(cov["framework"].unique())
order_map = {"primary": 2, "derived": 1, "author-mapped": 0}
color_map = {2: SEQ_STRONG, 1: SEQ_MID, 0: SEQ_WEAK}
label_map = {2: "primary", 1: "derived", 0: "author-\nmapped"}

grid = pd.DataFrame(index=outcomes, columns=frameworks, dtype=float)
for _, r in cov.iterrows():
    grid.loc[r["tsa_outcome_id"], r["framework"]] = order_map[r["source_type"]]

fig, ax = plt.subplots(figsize=(7.5, 4.6), dpi=200)
cmap = matplotlib.colors.ListedColormap([SEQ_WEAK, SEQ_MID, SEQ_STRONG])
im = ax.imshow(grid.values, cmap=cmap, vmin=-0.5, vmax=2.5, aspect="auto")
ax.set_xticks(range(len(frameworks)))
ax.set_xticklabels(frameworks, rotation=25, ha="right", fontsize=8.5)
ax.set_yticks(range(len(outcomes)))
ax.set_yticklabels(outcomes, fontsize=9)
for i in range(len(outcomes)):
    for j in range(len(frameworks)):
        v = int(grid.values[i, j])
        txt_color = "white" if v == 2 else TEXT
        ax.text(j, i, label_map[v], ha="center", va="center", fontsize=7.5, color=txt_color)
ax.set_title("Fig. 5. TSA outcome to control-framework mapping, by evidence strength\n"
              "(public-standards crosswalk -- not operator-confirmed validation)", fontsize=10, loc="left")
stamp(ax)
fig.tight_layout()
fig.savefig("figures/fig5_framework_coverage.png")
plt.close(fig)

# --------------------------------------------------------------------------
# Fig 6: pipeline-relevant share of advisories by year (declining-share finding)
# --------------------------------------------------------------------------
trend = stats["year_trend_regression"]
fig, ax = plt.subplots(figsize=(6.5, 4.2), dpi=200)
years = trend["years"]
share = [s * 100 for s in trend["share_by_year"]]
ax.plot(years, share, marker="o", color=BLUE, linewidth=2, markersize=5)
ax.axhline(trend["share_mean"] * 100, color=GRAY, linestyle="--", linewidth=1)
ax.text(years[0], trend["share_mean"] * 100 + 1.5, f"mean = {trend['share_mean']*100:.1f}%", fontsize=8.5, color=GRAY)
ax.set_xlabel("Year")
ax.set_ylabel("Pipeline-relevant share of advisories, %")
ax.set_title("Fig. 6. Pipeline-relevant share of ICS advisories by year, 2010-2025\n"
              f"(OLS trend: {trend['share_slope_per_year']*100:.2f} pp/yr, R²={trend['share_r_squared']:.2f})",
              fontsize=10, loc="left")
stamp(ax)
fig.tight_layout()
fig.savefig("figures/fig6_relevant_share_trend.png")
plt.close(fig)

print("Wrote figures/fig3_epss_sensitivity.png, fig4_tier_stratified.png, fig5_framework_coverage.png, fig6_relevant_share_trend.png")
print(f"DRAFT stamp applied: {bool(STAMP)}")
