# Verification checklist

**Status: NOT YET SIGNED OFF.** Nothing in this project is published, submitted,
or presented as finished until every item below is checked by the author in
their own hand. This artifact would carry the author's name into a journal
submission — this is not a formality.

## Mechanical checks (run before the human checks)

- [ ] `python3 src/01_sensitivity_and_stratified.py && python3 src/02_framework_coverage.py && python3 src/03_assemble_stats.py` reproduces `data/processed/stats.json` exactly (byte-for-byte diff against the version this checklist was written against).
- [ ] `python3 scripts/publish_gate.py` passes: no `DRAFT`, `[VERIFY]`, or placeholder-bracket text remains anywhere in `manuscript/` or `docs/` outside of intentional references to this checklist itself.
- [ ] `python3 src/04_build_figures.py --final && node manuscript/build_manuscript.js --final` produces a manuscript with no visible DRAFT stamps.

## Judgment calls requiring the author's own sign-off

- [ ] **Framing of Section IV as public-standards proxy validation, explicitly
  not operator-confirmed validation.** Read the abstract and Section IV in
  the built manuscript and confirm this reads unambiguously, not as a
  softened or hedged version of an operator-validation claim. This is the
  single highest-priority item on this checklist.
- [ ] **The 40%-author-mapped share of the Section IV crosswalk** (IEC 62443
  and CIS Controls v8 columns). Confirm you are comfortable with this
  disclosure level, or decide whether a licensed-standard review should be
  done before submission to convert some author-mapped cells to primary.
- [ ] **The EPSS-threshold sensitivity grid** (0.02/0.04/0.10/0.20/0.50) —
  confirm this is an adequate range, or request additional threshold points.
- [ ] **The tier1/tier2 statistical test**, including its small tier1 sample
  size (n=42) and the pure-Python (non-`scipy`) implementation — see
  `docs/LIMITATIONS.md` items 3–4. Re-run against `scipy` if available to you
  outside this build environment, and flag any discrepancy.
- [ ] **The vendor-concentration table's un-normalized vendor field** (50
  distinct strings vs. 26 configured taxonomy vendors) — confirm this
  disclosure is sufficient, or request vendor-name normalization before
  submission.
- [ ] **The year-over-year trend's noisy R²=0.14** — confirm the manuscript's
  hedged language ("noisy but real pattern... not a settled trend") matches
  your own read of the finding's strength.
- [ ] **The IEEE TII page-limit and submission-portal facts in
  `docs/PUBLISH_GUIDE.md`.** Two secondary sources disagree (8 pages vs.
  10/12 pages); neither is IEEE's own current official page. **You must
  confirm the current, authoritative page limit and submission process
  directly from IEEE TII's own author-guidelines page before submission** —
  this build could not retrieve that page directly.
- [ ] **The relationship to the unsubmitted TPEC 2027 paper.** Confirm you
  are comfortable citing [1] as "prepared for TPEC 2027, not yet submitted"
  in a journal manuscript, or decide whether to wait for TPEC 2027
  submission/acceptance before submitting this extension — see
  `docs/LIMITATIONS.md` item 8.
- [ ] **Full manuscript read-through for tone and accuracy.** A journal
  reviewer holds an extended version to a higher bar than a 6-page
  conference paper. Read every sentence that uses the word "validation" and
  confirm none of them overstate what Section IV's desk review can show.
- [ ] **Author block and affiliation** (`AUTHORS.json`) — confirm sole
  authorship and the exact name/ORCID/affiliation spelling are correct for
  this specific submission.

## Sign-off

**Not yet signed.** This checklist should be re-read in full, item by item,
with the built manuscript open, before this repository's DRAFT stamps are
removed (`--final` flags) or anything here is shared, pushed publicly, or
submitted.
