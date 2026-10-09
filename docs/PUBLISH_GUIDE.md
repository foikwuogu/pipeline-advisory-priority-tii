# Publish guide — IEEE Transactions on Industrial Informatics submission

**Page limit CONFIRMED by the author 2026-09-20, sourced directly from IEEE
TII's own official author-guidelines / Author Portal page** (this build's
own web access could not retrieve that page directly; the author retrieved
and supplied it):

| Manuscript type | New-submission limit | Final-version limit | Over-length charge |
| --- | --- | --- | --- |
| Regular research paper | 10 pages | 12 pages | $250/page ($200 for IES members) starting from page 11 |
| State-of-the-Art / Review paper (requires EiC permission) | 12 pages | 14 pages | $250/page ($200 for IES members) starting from page 13 |
| Letter | 4 pages | 6 pages | $250/page ($200 for IES members) starting from page 5 |

This manuscript is a **regular research paper**: 10 pages at initial
submission, 12 pages at final/camera-ready. An earlier, older scraped
author-guide document had suggested a legacy 4–8 page limit under a
ScholarOne-only flow with $160/page overlength from page 9 — that figure is
now superseded by the table above and should not be used.

Because page limits, portals, and charges at IEEE journals can still change
between now and actual submission, re-glance at IEEE TII's own
author-guidelines page once more immediately before submitting, as routine
due diligence — not because this figure is in doubt.

## What is confirmed (general IEEE TII scope and process, cross-checked
across multiple sources)

- **Scope:** industrial informatics, industrial IoT, cyber-physical systems,
  intelligent manufacturing, industrial AI/ML, predictive maintenance,
  digital twins, and — directly relevant here — industrial/OT cybersecurity.
  This paper's subject matter fits the journal's stated scope.
- **Article types:** regular papers and (shorter) letters/correspondence.
- **Review process:** Editor-in-Chief assigns an Associate Editor, who
  selects at least three reviewers; most manuscripts receive a revise
  decision before acceptance; a Major Revision typically gets one further
  revision round. Reported turnaround for a first decision runs several
  months (estimates in secondary sources range roughly 4–6 months total).
- **Format for initial submission:** a readable, evaluable draft in IEEE
  Transactions style is expected; exact camera-ready formatting compliance
  is typically enforced only after acceptance. This manuscript (built as a
  clean single-column Word document with the IEEE Transactions two-column
  template applied at camera-ready time) follows that pattern.
- **AI-assistance disclosure:** IEEE's current author guidelines require
  disclosing generative-AI use in the manuscript. This project's AI
  assistance (data pipeline code, figure generation, drafting mechanics) and
  the fact that every analytic decision and every number was reviewed by the
  human author should be disclosed per IEEE's current policy, which you
  should re-check at submission time (policies in this area have changed
  more than once across 2023–2026).

## What can legitimately be prepared right now (independent of confirming
the exact page limit)

- Clear `docs/VERIFY_CHECKLIST.md` — the actual blocking step, independent of
  IEEE's own portal details.
- Keep the manuscript's content (methods, results, figures, every number
  traced to `data/processed/stats.json`) stable and citable, so fitting it to
  whatever the confirmed page limit turns out to be is a trimming/formatting
  pass, not a rewrite. At its current length (12 pages in a single-column
  Times New Roman draft layout), this manuscript will very likely need
  cutting to fit either candidate page limit once reflowed into the two-
  column IEEE Transactions template — budget time for this.
- Resolve the TPEC-2027-sequencing question in `docs/LIMITATIONS.md` item 8
  before finalizing the manuscript's citation of the base paper.
- Prepare the cover letter now: state plainly that this is an extended
  version of a conference paper prepared for TPEC 2027 (not yet submitted as
  of this writing), summarize the new technical content (Sections II, IV,
  V.B–V.F), and disclose AI-assisted drafting per IEEE's current policy.

## What this build process will not and cannot do

Per this project's own build rules, nothing here submits to IEEE TII,
executes a copyright transfer, or represents the paper as ready for a
personal attestation the author has not made. IEEE TII submission is a
personal, author-authenticated action through IEEE's submission portal
(ScholarOne or its successor Author Portal) — not something this build
process can do on the author's behalf, and it should not be attempted here
even if credentials were available, because submission is itself an
attestation the author must make in person.

## Submission-day checklist (status as of 2026-10-09)

1. DONE 2026-09-20. Page limit confirmed directly from IEEE TII's own
   author-guidelines page (table at the top of this file). Template/portal:
   not separately re-confirmed beyond that page — glance at IEEE's Author
   Portal once at actual submission time in case anything has changed.
2. DONE 2026-10-09. The manuscript (`manuscript/TII_extended_manuscript_v1.docx`)
   is now reflowed into genuine IEEE Transactions two-column format: 10pt
   Times New Roman, IEEE-standard margins and column gap, wide tables broken
   into full-width single-column sections. Rebuilt and visually verified
   page by page. Result: **9 pages**, under the confirmed 10-page
   initial-submission limit, with headroom.
3. DONE 2026-10-09. `manuscript/cover_letter.docx` and
   `manuscript/conflict_of_interest_statement.docx` are drafted. No funding,
   grant, or other financial support was received for this research; this
   has been directly confirmed by all three authors, including co-authors
   Silas Abutu and Abidemi Orimogunje (no placeholder remains in the COI
   statement). The cover letter's date field is still a placeholder, to be
   filled in on the day of submission.
4. DONE 2026-10-09. IEEE TII's own submission checklist, read live from
   `ieee-ies.org/pubs/transactions-on-industrial-informatics/new-submission`,
   requires double-blind review: no author names, affiliations, ORCID, or
   acknowledgments in the manuscript file, and requires an institutional
   e-mail (not a free webmail address) on the IEEE Author Portal account.
   `manuscript/TII_extended_manuscript_v1_ANON.docx` is the blinded review
   copy — build with `node manuscript/build_manuscript.js --final --anon`.
   It strips the author/affiliation block and the Acknowledgment section,
   redacts the self-citing conference reference ([1]) to withhold the
   author's name (full attribution is disclosed to the editor via the cover
   letter instead), and withholds the Zenodo DOI from Appendix A — citing
   that DOI directly in the review copy would deanonymize the authors
   immediately, since the Zenodo record's own metadata lists their real
   names. **This `_ANON.docx` file, not `TII_extended_manuscript_v1.docx`,
   is the one to upload as the manuscript in the Author Portal.** The
   full-credit `v1.docx` remains correct for the Zenodo archive and any
   camera-ready version after acceptance. Verified: 9 pages, no author
   name/affiliation/ORCID/institution strings found in the extracted PDF
   text, and no author metadata embedded in the DOCX file properties.
5. NOT DONE — the author's own personal action. Create (or sign in to) an
   IEEE Account using an institutional e-mail, then submit the ANON
   manuscript, `cover_letter.docx`, and `conflict_of_interest_statement.docx`
   through IEEE's Author Portal at `https://ieee.atyponrex.com/journal/tii`
   (not the older ScholarOne link some IES pages still show).
6. NOT DONE — the author's own action once 5 happens. Log the submission
   (date, manuscript ID once assigned, portal) in this project's own
   record — this build process does not track it for you once submission
   happens outside its scope.
