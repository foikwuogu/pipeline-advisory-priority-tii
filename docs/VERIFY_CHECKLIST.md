# Verification checklist

**Status: SIGNED OFF 2026-09-20; SUBMITTED TO IEEE TII 2026-10-08.** All
items below are resolved, the author gave the required consolidating
sign-off in his own words (see Sign-off section), and the manuscript has
since been submitted to IEEE Transactions on Industrial Informatics
through the Author Portal (Submission ID
`44ca441f-9c35-4c96-975e-d38774abda12`). See the Sign-off section's
2026-10-08 update for submission detail.

## Mechanical checks (run before the human checks)

- [x] `python3 src/01_sensitivity_and_stratified.py && python3 src/02_framework_coverage.py && python3 src/03_assemble_stats.py` reproduces `data/processed/stats.json` exactly. RE-RUN 2026-09-20 — confirmed byte-for-byte identical to the prior committed version.
- [x] `python3 scripts/publish_gate.py` — RE-RUN 2026-09-20. Result: 8 blocking findings, all expected and non-blocking in substance: 5 `DRAFT` markers in `manuscript/build_manuscript.js` (source code for the conditional stamp, cleared by `--final`), 1 `DRAFT` mention in `docs/GITHUB_ZENODO_GUIDE.md` (documentation text, not a stamp), and the 3 `CITATION.cff` DOI/identifier placeholders (genuinely pending until GitHub/Zenodo/IEEE publication events happen). No unexpected findings. This item is not checked as fully "passing" because the gate script itself reports FAIL by design until `--final` is run and the real DOIs exist — that is expected, not a defect.
- [ ] `python3 src/04_build_figures.py --final && node manuscript/build_manuscript.js --final` produces a manuscript with no visible DRAFT stamps. NOT YET RUN — withheld until the author's final consolidating sign-off, per this checklist's standing rule.

## Judgment calls requiring the author's own sign-off

- [x] **Framing of Section IV as public-standards proxy validation, explicitly
  not operator-confirmed validation.** RESOLVED 2026-09-20. During review,
  the author proposed adding language stating that practicing pipeline
  operators and control-room personnel had reviewed the taxonomy, scoring
  logic, and control mappings, and that their feedback informed revisions.
  When asked directly whether this engagement actually occurred, the author
  confirmed it did not ("no it was not"). No such text was inserted into any
  document. Section IV's existing framing — a transparent public-standards
  crosswalk, explicitly not operator-confirmed validation, with no primary
  operator data of any kind — is confirmed accurate and is UNCHANGED. No
  operator validation, consultation, review, or engagement of any kind
  occurred at any point in this project, and no document in this repository
  should ever state or imply otherwise.
- [x] **The 40%-author-mapped share of the Section IV crosswalk** (IEC 62443
  and CIS Controls v8 columns). RESOLVED 2026-09-20 — author selected
  "Publish as-is, disclosed." No licensed-standard review will be performed
  before this submission; the 40% author-mapped share stands as disclosed in
  Section IV and Appendix B.
- [x] **The EPSS-threshold sensitivity grid** (0.02/0.04/0.10/0.20/0.50) —
  RESOLVED 2026-09-20 — author selected "Adequate as-is." No additional
  threshold points will be added before submission.
- [x] **The tier1/tier2 statistical test**, including its small tier1 sample
  size (n=42) and the pure-Python (non-`scipy`) implementation — see
  `docs/LIMITATIONS.md` items 3–4. RESOLVED 2026-09-20 — author selected
  "Keep as-is, caveats disclosed." The pure-Python Mann-Whitney U
  implementation and the small-n caveat stand as documented; no re-run
  against `scipy` was performed.
- [x] **The vendor-concentration table's un-normalized vendor field** (50
  distinct strings vs. 26 configured taxonomy vendors) — RESOLVED
  2026-09-20 — author selected "Disclose as-is." No vendor-name
  normalization will be performed before submission.
- [x] **The year-over-year trend's noisy R²=0.14** — RESOLVED 2026-09-20 —
  author selected "Matches my read." The manuscript's existing hedged
  language ("noisy but real pattern... not a settled trend") stands
  unchanged.
- [x] **The IEEE TII page-limit and submission-portal facts in
  `docs/PUBLISH_GUIDE.md`.** RESOLVED 2026-09-20. The author retrieved and
  supplied the page-limit table directly from IEEE TII's own official
  author-guidelines / Author Portal page: regular research paper, 10 pages
  at initial submission, 12 pages at final/camera-ready, $250/page
  overlength charge ($200 for IES members) starting from page 11.
  `docs/PUBLISH_GUIDE.md` has been updated accordingly and the earlier
  unconfirmed 4–8 page figure is superseded. Re-glancing at IEEE's page
  once more immediately before actual submission remains routine due
  diligence, not an open question.
- [x] **The relationship to the unsubmitted TPEC 2027 paper.** RESOLVED
  2026-09-20 — author selected "Proceed now." This manuscript will continue
  to cite [1] as "prepared for TPEC 2027, not yet submitted" rather than
  waiting for TPEC 2027 submission or acceptance.
- [x] **Full manuscript read-through for tone and accuracy.** RESOLVED
  2026-09-20. Author confirmed, in his own words: "i have read the
  manuscript and confirm its good."
- [x] **Author block and affiliation** (`AUTHORS.json`) — RESOLVED, then
  CORRECTED, 2026-09-20. Initially confirmed as sole authorship ("i confirm
  is Ok"). On further review, prompted by a stored record of co-authors for
  the underlying "ONG-OT Vulnerability Prioritization Dataset" project, the
  corresponding author confirmed that Silas Abutu (Petroleum Training
  Institute) and Abidemi Orimogunje (Redeemer's University) contributed to
  that underlying dataset/taxonomy work which this manuscript reuses and
  extends, and should therefore be credited as co-authors on this
  manuscript per standard authorship criteria (substantial contribution to
  the work presented). `AUTHORS.json`, `CITATION.cff`, the manuscript's
  title-page author/affiliation block, `README.md`, and `docs/BUILD_SPEC.md`
  were all updated to the corrected three-author list: Friday Ogochukwu
  Ikwuogu (corresponding), Silas Abutu, Abidemi Orimogunje. This is
  intentionally distinct from the separate, sole-authored TPEC 2027
  conference paper's author list. The CRediT contribution roles assigned to
  Abutu and Orimogunje in `AUTHORS.json` (Investigation, Validation, Writing
  – review & editing) were confirmed correct by the corresponding author on
  2026-09-20 ("you got it right"). This item is fully resolved with no
  remaining caveats.

  A final wrinkle, resolved the same day: the author raised that this
  manuscript is specifically the IEEE TII-submitted extension of the
  sole-authored TPEC 2027 paper, and that he would present/submit it
  personally, and asked whether that meant it should revert to sole
  authorship. Presenting or submitting a paper alone is a separate matter
  from who did the intellectual work reflected in it — a manuscript can
  carry co-authors even when only one of them ever appears at a conference
  or handles the submission portal. Given that Abutu and Orimogunje's
  contribution is genuinely embodied in this manuscript's dataset,
  taxonomy, and crosswalk (as previously confirmed), the author confirmed:
  keep the three-author list as built. No further change was made.

## Sign-off

**SIGNED 2026-09-20.** All ten judgment-call items above are resolved, the
mechanical reproducibility check passed clean, and the author has completed
the full manuscript read-through and given the required consolidating
sign-off, in his own words: "i have read the manuscript and confirm its
good." Author: Friday Ogochukwu Ikwuogu (corresponding author).

This checklist is complete, and as of 2026-09-20 the `--final` rebuild,
`publish_gate.py` re-check, GitHub push, and Zenodo archival
(10.5281/zenodo.22857631, release v1.0.0) are all done -- re-confirmed
2026-10-08 (origin/main matches local HEAD at commit 71040fe, gate shows
only the expected pending IEEE-Xplore-DOI placeholder). What is NOT yet
done, and was re-confirmed again 2026-10-08.

**UPDATE 2026-10-08: the IEEE TII submission itself is also now complete.**
The two-column Transactions reflow, the double-blind anonymized manuscript
required by TII's own submission checklist, the title page, the cover
letter, and the conflict-of-interest statement (funding confirmed by all
three authors, no placeholder remaining) were all built, verified, and
submitted through IEEE's Author Portal at
`https://ieee.atyponrex.com/journal/tii`. The author personally completed
the submission in the portal (Submission ID
`44ca441f-9c35-4c96-975e-d38774abda12`, status Submitted, 8 October 2026);
that click is itself the author's attestation and is not something this
checklist or build process performed on his behalf. Full detail is in the
"Submission-day checklist" in `docs/PUBLISH_GUIDE.md` and in the project's
`submission-status.md`. This closes every item this checklist tracks --
nothing from this project's own build/verify/publish/submit scope remains
open. What happens next (editorial correspondence, peer review, a
manuscript number, and any requested revisions) is outside this
checklist's scope and will be logged separately as it happens.
