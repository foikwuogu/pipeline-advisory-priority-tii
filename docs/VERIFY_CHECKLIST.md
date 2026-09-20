# Verification checklist

**Status: ALL JUDGMENT-CALL ITEMS RESOLVED except the full manuscript
read-through — mechanical checks have passed — final consolidating sign-off
still pending.** Nothing in this project is published, submitted, or
presented as finished until the author has done the full read-through below
and given one explicit, consolidating sign-off statement in their own
words. This artifact would carry the author's name into a journal
submission — this is not a formality.

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
- [ ] **Full manuscript read-through for tone and accuracy.** A journal
  reviewer holds an extended version to a higher bar than a 6-page
  conference paper. Read every sentence that uses the word "validation" and
  confirm none of them overstate what Section IV's desk review can show.
  (An informal pass was done via the rendered PDF pages during the build;
  this item asks for the author's own full read-through, not a proxy for
  it.)
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
  Abutu and Orimogunje in `AUTHORS.json` are the build's best-guess
  placeholders (Investigation, Validation, Writing – review & editing) —
  **the author should confirm or adjust these to accurately reflect each
  co-author's actual role before submission.**

## Sign-off

**Not yet signed.** Nine of ten judgment-call items above are resolved, and
the mechanical reproducibility check has passed clean. Two items remain
open, one by design and one pending the author's own action:

1. **The full manuscript read-through** — an informal pass was done via the
   rendered PDF pages during the build, but this checklist asks for the
   author's own read of every sentence using the word "validation."

Before this repository's DRAFT stamps are removed (`--final` flags) or
anything here is shared, pushed publicly, or submitted, the author still
needs to: (1) do the full manuscript read-through, and (2) give one
explicit, consolidating sign-off statement in their own words — for
example, something to the effect of "I have read the manuscript in full,
I've reviewed every item on this checklist, and I approve this for
finalization" — after which the figures and manuscript will be rebuilt with
`--final` and the DRAFT stamps removed.
