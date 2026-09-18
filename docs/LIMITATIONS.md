# Limitations

This project inherits every limitation disclosed in the base paper's own
`docs/LIMITATIONS.md` (sibling repo `pipeline-advisory-priority`) unchanged,
since no row-level data is re-fetched or re-derived here. They are not
repeated in full below — read that file too before treating any inherited
number as settled. This file lists only the limitations new to this extension.

1. **No primary operator-validation data exists for this project.** This is
   the single most important disclosure in this repository. The working
   title "operator validation" is satisfied here, by the author's explicit
   choice, with a public control-framework crosswalk (Section IV of the
   manuscript) — not with interview, survey, or other primary human-subject
   data from any pipeline operator. The manuscript states this in its
   abstract, not only in a limitations section, precisely so a reader cannot
   mistake the crosswalk for something it is not.

2. **40% of the Section IV crosswalk is author-mapped, not citable to a
   primary or secondary source.** The full IEC 62443 and CIS Controls v8
   columns of the TSA-outcome crosswalk rest on the author's own judgment,
   because both are paid standards whose full requirement text this project
   does not reproduce — only their published control IDs/titles were checked
   directly. Treat the crosswalk's "100% cell coverage" figure as a coverage
   metric only, never as a correctness or compliance claim; see the
   `source_type` breakdown for the load-bearing number.

3. **The tier1/tier2 statistical test rests on a small tier1 sample (n=42).**
   The Mann-Whitney U result (p=0.0093) indicates a real difference in
   central tendency between tiers, but with this few observations the
   precision of tier1's own summary statistics is limited; read the finding
   as "the tiers differ," not as a precise effect-size estimate.

4. **The Mann-Whitney test was implemented without `scipy`.** This device's
   outbound network policy blocked a `pip install scipy` at build time (see
   `src/mannwhitney.py` for the pure-Python normal-approximation
   implementation, tie-corrected, following the standard large-sample
   formula). This should agree with `scipy.stats.mannwhitneyu` to several
   decimal places at these sample sizes (n=42, n=3,692), but was not
   cross-checked against a `scipy` reference implementation because none was
   installable in this build environment. **Verification point:** if the
   author has `scipy` available elsewhere, re-running the comparison there
   before submission is recommended.

5. **The tier2 vendor field is not fully normalized.** Grouping by the raw
   `Vendor` string yields 50 distinct values within tier2, not the 26 vendors
   enumerated in `config/product_class_taxonomy_pipeline.yaml`, because the
   source field sometimes contains multi-vendor strings or name variants.
   This does not change any reported total (all totals are computed on the
   full tier2 set regardless of grouping), but the vendor-level breakdown
   (Table III / `vendor_concentration.csv`) undercounts each named vendor's
   true row count to the extent its rows are split across variant spellings.

6. **The year-over-year share trend is noisy (R²=0.14).** The reported
   -1.22 percentage-point/year slope is a real fit to the data, but the low
   R² and the wide year-to-year range (9.1%–56.1%) mean this should be
   reported as a pattern worth monitoring, not a settled or precisely
   estimated decline. A future annual re-run with more years of data would
   sharpen this considerably.

7. **IEEE Transactions on Industrial Informatics page-limit and
   submission-portal facts are unconfirmed and secondary sources disagree.**
   One source (a scraped older author-guide document) states an 8-page
   regular-paper limit under the legacy page-charge model; another (a
   third-party 2026 submission-guide blog, not an IEEE-operated site) states
   a 10-page initial / 12-page final limit under a "IEEE TII Author Portal"
   said to have launched February 2025. Neither is IEEE's own current,
   authoritative "Information for Authors" page, which this build could not
   directly retrieve. **Verification point: the author must confirm the
   current page limit, submission portal, and template directly from IEEE's
   own TII author-guidelines page before submission** — see
   `docs/PUBLISH_GUIDE.md`.

8. **This paper extends a conference paper that has not yet been submitted,
   let alone accepted or presented.** IEEE's own conference-to-journal
   extension norms (cite the conference version; ≥30% new technical content;
   disclose the relationship in the cover letter) presuppose the conference
   paper already exists in some citable, ideally IEEE Xplore, form. As of
   this build, TPEC 2027's own call for papers is not yet published, so the
   base paper [1] cited throughout this manuscript is itself unsubmitted.
   The March 2027 IEEE TII target postdates TPEC 2027's Feb 7–9, 2027
   conference dates, so the intended sequence (present at TPEC, then submit
   the extension) is chronologically workable — but **this is a verification
   point, not a settled plan**: if TPEC 2027 acceptance or presentation
   slips, or if the paper is not accepted at TPEC at all, the manuscript's
   framing as an "extended version of" a specific conference paper would
   need to be revisited before submission (e.g., citing it as a preprint or
   as "concurrently under review" instead).

9. **The EPSS-threshold grid (0.02/0.04/0.10/0.20/0.50) tested in the
   sensitivity analysis is itself an author choice**, not an exhaustive or
   externally mandated set of values — chosen to span roughly an order of
   magnitude around the base study's 0.10 operating point and FIRST.org's
   own cited ~0.04 historical reference point.

10. **The "≥30% new technical content" self-assessment has not been reviewed
    by an editor.** This build's author judges the four new analyses
    (Sections II, IV, V.B–V.F) to constitute substantial new content beyond
    the base paper, but this is the author's own assessment, not a
    determination by IEEE TII's editorial staff, who make the final call at
    submission.
