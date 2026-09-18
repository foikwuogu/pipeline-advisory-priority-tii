# Build spec: extended IEEE Transactions on Industrial Informatics journal article

**Status:** DRAFT — author verification pending. See `docs/VERIFY_CHECKLIST.md`.

## Target

Ikwuogu, O. F. *ONG-OT vulnerability prioritization: dataset, method, and operator
validation* (extended version of the TPEC 2027 paper). Target: IEEE Transactions on
Industrial Informatics (IEEE TII). Planned submission: March 2027. [Manuscript ID
pending — assigned by IEEE's Author Portal at submission.]

This is an **extended version** of a verified, sole-authored conference paper:
Ikwuogu, O. F., *Which ICS advisories matter to a pipeline operator? Exploitation
likelihood, patch availability, and compensating controls across CISA advisories,
2010–2026*, prepared for IEEE TPEC 2027 (not yet submitted — TPEC 2027's CFP is not
yet published as of 2026-09-18; see the sibling `pipeline-advisory-priority` repo).
IEEE's own extension policy for a journal submission built on a conference paper
requires: (a) citing the conference version, (b) at least 30% new technical content,
and (c) disclosing the relationship to the editor in the cover letter. This build
satisfies (a)–(b) via the new analyses below and documents (c) in
`docs/PUBLISH_GUIDE.md`.

## The question

Extends the TPEC paper's question with two new angles: (1) how sensitive is the
pipeline-relevance/prioritization picture to the analytic choices already disclosed
as author judgment calls in the TPEC paper (the EPSS high-exploitation threshold, the
tier1/tier2 taxonomy split) — i.e., a robustness analysis; and (2) how well do the
TSA Pipeline-2021-02 outcome groups this study leans on actually trace to independently
published control frameworks (NIST SP 800-82 Rev. 3, NIST SP 800-53 Rev. 5, IEC 62443,
CIS Controls v8, NIST CSF 2.0) — i.e., a sector-specific *proxy validation* against
public standards, in place of primary operator survey/interview data (none exists for
this project; see Assumptions).

## Data sources (all reused, cited, no re-fetch)

| Source | Role | Vintage | License |
|---|---|---|---|
| `pipeline-advisory-priority` v1 (sibling repo, author-verified 2026-09-18) | Deduplicated, scored, pipeline-prioritized dataset, 13,939 CVE-advisory rows | built 2026-09-12 to 2026-09-18 | Code MIT; data CC BY 4.0 + inherited ODbL v1.0 (ICS Advisory Project columns) |
| `data/raw/tsa_crosswalk_REUSED.csv` (sibling repo) | TSA outcome -> NIST SP 800-82 Rev.3 / NIST SP 800-53 Rev.5 / IEC 62443 / CIS Controls v8 crosswalk | verified 2026-09-16 | CC BY 4.0 except IEC 62443 / CIS Controls v8 cells (own licenses; IDs/paraphrase only reused here) |
| `config/product_class_taxonomy_pipeline.yaml`, `config/tsa_outcome_mapping.yaml` (sibling repo) | Author-confirmed taxonomy and EPSS threshold used for the sensitivity analysis below | author-confirmed 2026-09-18 | MIT |

No new external fetch is performed in this build: every row-level number traces back
to the already-verified sibling dataset, exactly as its own `docs/VERIFY_CHECKLIST.md`
records. This build's only new inputs are the analysis code and the crosswalk-coverage
tabulation.

## Unit of analysis

Same as the reused dataset: one row = one CVE x CISA ICS advisory pairing (13,939 rows).
The framework-coverage analysis (Section on sector-specific validation) has a second,
coarser unit: one row = one (TSA outcome, control framework) cell (30 rows in
`tsa_crosswalk_REUSED.csv`).

## New measures for this extension

1. **EPSS-threshold sensitivity.** Recompute the TSA-3 (Continuous Monitoring)
   response-flag rate and the tier distribution of `priority_score` under five EPSS
   high-exploitation thresholds (0.02, 0.04 [FIRST.org's own cited historical
   reference point], 0.10 [this study's chosen value], 0.20, 0.50), holding
   `priority_score` itself fixed (the threshold only ever gated the TSA-3/6
   informational flags, never the score — see the TPEC paper, Section II.C).
2. **Tier1-vs-tier2 stratified breakdown.** Report `priority_score` distributional
   statistics and tier shares separately for `tier1_pipeline_core` (n=72, the
   named-product-line rows) versus `tier2_ot_general_energy` (n=3,662 of the
   3,734 pipeline-relevant rows), which the TPEC paper's headline numbers pool
   together.
3. **Vendor-level concentration within tier2.** For the 26 tier2 vendors, report
   each vendor's row count, KEV-listed count, and mean `priority_score`, to make
   the "diluted by non-pipeline product lines" hypothesis in the TPEC paper's
   Discussion section (Sec. IV) checkable rather than asserted.
4. **Year-over-year trend regression.** Fit a simple linear (and log-linear) trend
   to full-population vs. pipeline-relevant advisory counts by year, 2010-2025
   (2026 excluded as a partial year), and report the growth-rate ratio, replacing
   the TPEC paper's qualitative "tracks a roughly proportional... share" claim
   with a quantified estimate and its uncertainty.
5. **Sector-specific validation via public control-framework crosswalk.** For each
   of the 6 TSA Pipeline-2021-02 outcome groups, tabulate: (a) whether a mapped
   control exists in each of the 5 reused frameworks, and (b) the `source_type` of
   that mapping (`primary` = the framework's own document cited directly,
   `derived` = a secondary open-license source, `author-mapped` = the project
   author's own judgment, not sourced from a ready-made crosswalk). This produces
   an honest coverage/provenance picture of exactly how much of the TSA-outcome
   compensating-control claim rests on citable external authority versus this
   project's own judgment — the paper's substitute for primary operator-validation
   data (see Assumptions).

## Outputs

- `data/processed/sensitivity_analysis.csv`, `tier_stratified_breakdown.csv`,
  `vendor_concentration.csv`, `year_trend_regression.json`,
  `framework_coverage_validation.csv` — new analysis tables.
- `data/processed/stats.json` — every number quoted in the manuscript, extending
  (not replacing) the reused `tpec_stats_REUSED.json`.
- `data/processed/qa_report.txt` — row counts, recomputation cross-check against
  the reused dataset's own numbers, named spot checks.
- `figures/` — fig3_epss_sensitivity, fig4_tier_stratified, fig5_framework_coverage
  (fig1/fig2 from the TPEC paper are reused by reference, not rebuilt, since the
  underlying full-vs-relevant year and tier distributions are unchanged).
- `manuscript/` — full IEEE Transactions-format journal manuscript (.docx), built
  under the `docx` skill, DRAFT-stamped until Step 5 clears.
- `docs/` — README, CODEBOOK, LIMITATIONS, VERIFY_CHECKLIST, NEXT_STEPS,
  PUBLISH_GUIDE, GITHUB_ZENODO_GUIDE, this BUILD_SPEC.
- `AUTHORS.json`, `CITATION.cff`, `LICENSE`.

## Venues

1. GitHub (new companion repo, self-serve, author's own account — see
   `docs/GITHUB_ZENODO_GUIDE.md`).
2. Zenodo (DOI for the reproducibility package, via GitHub-Zenodo integration).
3. IEEE Transactions on Industrial Informatics (author-submitted personally via
   IEEE's Author Portal / ScholarOne — see `docs/PUBLISH_GUIDE.md`; this build
   process does not and cannot submit on the author's behalf).

## Verification points (author sign-off required — see VERIFY_CHECKLIST.md)

1. The EPSS-threshold sensitivity analysis's chosen threshold grid (0.02/0.04/0.10/0.20/0.50).
2. The tier1/tier2 stratified breakdown and vendor-concentration table — read for
   any vendor mis-tier the original TPEC review may not have caught at this finer
   granularity.
3. Framing of the framework-coverage crosswalk as **proxy validation against
   public standards**, explicitly NOT operator-reported or operator-confirmed
   validation — this is the single most important disclosure in this extension
   and must read unambiguously that way in the abstract, not just a limitations
   footnote.
4. The IEEE TII page-limit and submission-portal facts in `docs/PUBLISH_GUIDE.md`
   (secondary sources disagree — 8 pages per one source, 10/12 pages per another;
   flagged for the author to confirm against IEEE TII's current official
   "Information for Authors" at submission time).
5. Full manuscript read-through for tone: a journal reviewer holds an extended
   version to a higher bar than a 6-page conference paper: every claim about
   "validation" must not overstate what a standards crosswalk can show.

## Assumptions

- **No primary operator data exists for this project** (confirmed with the author,
  2026-09-18/2026-09-19 build). Per the author's explicit choice, "operator
  validation" in the project's working title is satisfied here by a transparent,
  citable crosswalk against public control-framework standards, not by primary
  human-subject data (interviews, surveys). This is disclosed prominently, not
  quietly substituted.
- The reused v1 dataset (13,939 rows, EPSS/KEV snapshot dated 2026-09-12) is not
  re-fetched; every inherited limitation from the sibling repo's own
  `docs/LIMITATIONS.md` applies unchanged here (see this repo's own LIMITATIONS.md,
  which incorporates them by reference plus new items).
- Sole authorship (Friday Ogochukwu Ikwuogu), per the author's explicit 2026-09-19
  confirmation for this specific submission, consistent with the TPEC paper's own
  final author list.

## License

Code: MIT. New derived data and manuscript text: CC BY 4.0, except columns/cells
inherited from the ICS Advisory Project (ODbL v1.0) or from IEC 62443 / CIS
Controls v8 (their own licenses, IDs/paraphrase only).
