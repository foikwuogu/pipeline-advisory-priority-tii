# Publishing this package to GitHub and Zenodo

Self-serve, independent of the IEEE TII submission timeline — same pattern as
the sibling `pipeline-advisory-priority` repo (also not yet pushed as of this
writing). GitHub and Zenodo are your own accounts; nothing here requires a
third party's approval.

Status as of 2026-09-19: this repository is initialized and committed on your
computer at `Project\pipeline-advisory-priority-tii`. `docs/VERIFY_CHECKLIST.md`
is **not yet signed off** — do this before pushing publicly, since a public
GitHub repo with unresolved DRAFT stamps and an unsigned checklist is visible
to anyone.

## Part 1 — Push to GitHub

1. Create an empty repository on GitHub (suggested name:
   `pipeline-advisory-priority-tii` or `ong-ot-tii-extended` — your choice).
   Leave it empty (no README/license/.gitignore — this repo already has all
   three).
2. Public is the standard choice for a reproducibility package (and is what
   lets Zenodo mint a free DOI from it).
3. Tell me the repository URL GitHub shows you after creation and I will run:
   ```
   git remote add origin <that URL>
   git push -u origin main
   ```
   The push itself needs your own GitHub authentication (browser sign-in or
   a Windows credential-manager popup) — expected and correct.

## Part 2 — Connect Zenodo and mint a DOI

Same flow as the sibling repo: zenodo.org → log in with GitHub → Settings →
GitHub → toggle this repo on → create a GitHub Release (e.g., tag `v0.1.0`,
title "v0.1.0 — TII extension, pre-submission draft") → Zenodo archives the
release and mints a DOI within a minute or two.

## Part 3 — Fold the DOI back into the package

Once you have the DOI, send it and I will update, in one pass: `CITATION.cff`
(`identifiers.value`), `README.md` (a DOI line near the top), and the
manuscript's "Data and code availability" statement (Appendix A).

## What this DOI is and isn't

This DOI covers the **reproducibility package** (this repo: new analysis
code, figures, docs, manuscript draft) — separate from any DOI the base TPEC
paper's own reproducibility package gets (sibling repo, not yet pushed
either), and separate from the eventual **IEEE Xplore DOI** the published
journal article would get from IEEE after peer review and acceptance (see
`docs/PUBLISH_GUIDE.md`). A manuscript's "Data and code availability"
statement conventionally cites this kind of DOI — a genuine, professional
touch reviewers expect for a paper built on a public dataset.
