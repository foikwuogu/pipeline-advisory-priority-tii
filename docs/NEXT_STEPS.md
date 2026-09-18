# Next steps

1. **Author review of `docs/VERIFY_CHECKLIST.md`** — not yet done. This is
   the actual blocking step and is independent of TPEC's or IEEE TII's own
   publication schedules.
2. **Confirm IEEE TII's current page limit and submission portal directly
   from IEEE's own author-guidelines page** (see `docs/LIMITATIONS.md` item 7
   and `docs/PUBLISH_GUIDE.md`) — this build could not retrieve that page
   directly and relied on two disagreeing secondary sources.
3. **Decide on the TPEC 2027 sequencing question** (`docs/LIMITATIONS.md`
   item 8): submit this extension only after TPEC 2027 accepts/schedules the
   base paper, or proceed now and revise the citation framing if needed.
4. **GitHub push + Zenodo deposit** for this reproducibility package — see
   `docs/GITHUB_ZENODO_GUIDE.md`. The repo is initialized and committed
   locally; pushing needs the author's own GitHub login (same as the sibling
   `pipeline-advisory-priority` repo, which is also not yet pushed).
5. **Consider a licensed-standard review** of the IEC 62443 / CIS Controls v8
   crosswalk cells currently marked `author-mapped` (see
   `docs/LIMITATIONS.md` item 2), to convert some to `primary` before
   submission if the author has access to those paid standards.
6. **Re-run the tier1/tier2 statistical test against `scipy`** if available
   outside this build environment, to cross-check the pure-Python
   implementation in `src/mannwhitney.py` (`docs/LIMITATIONS.md` item 4).
7. Once the base TPEC paper's own upstream duplication fix (its own
   `docs/NEXT_STEPS.md` item 3) is pushed to the `ong-ot-dataset-pipeline` /
   ONG-OT Vulnerability Explorer projects, consider whether this extension's
   reused dataset should be refreshed to match, or whether the current
   snapshot remains the citable basis for this specific paper (the latter is
   generally preferable for reproducibility once a paper is under review).
8. Once a Zenodo DOI exists for this package, add a "Data and code
   availability" statement to the manuscript citing it, alongside the base
   paper's own separate DOI once that exists.
