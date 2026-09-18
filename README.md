# ONG-OT vulnerability prioritization: dataset, method, and sector-specific validation

**Status: DRAFT — not yet author-verified.** See `docs/VERIFY_CHECKLIST.md` before
treating any number here as finished. Not yet submitted anywhere.

Extended, journal-length companion to a verified conference paper:

> Ikwuogu, O. F. *Which ICS advisories matter to a pipeline operator? Exploitation
> likelihood, patch availability, and compensating controls across CISA advisories,
> 2010 to 2026.* Prepared for IEEE Texas Power and Energy Conference (TPEC 2027).
> Not yet submitted (TPEC 2027's CFP is not yet published). See sibling repo
> `pipeline-advisory-priority`.

Target for this extended version: **IEEE Transactions on Industrial Informatics**,
planned submission March 2027 (author-submitted personally; see
`docs/PUBLISH_GUIDE.md`).

## What this project adds on top of the base paper

Reuses the base paper's already-verified, deduplicated, scored dataset
(13,939 CVE-advisory rows; no re-fetch) and adds four new layers of analysis:

1. **EPSS-threshold sensitivity** — how much the exploitation-response flag rate
   moves under five different threshold choices (the composite priority score
   itself does not move; only the informational TSA-3/6 flags do).
2. **Tier1-vs-tier2 stratified breakdown**, with a statistical test (Mann-Whitney
   U, computed with a dependency-free implementation — see `src/mannwhitney.py`
   — because this device's network policy blocks a `scipy` install).
3. **Year-over-year trend regression** on the pipeline-relevant share of
   advisories, replacing a qualitative claim with a quantified (and noisy)
   estimate.
4. **Sector-specific validation via a public control-framework crosswalk** —
   the paper's explicit substitute for primary operator-validation data, which
   does not exist for this project. See `docs/LIMITATIONS.md` item 1 and the
   manuscript's Section IV: this is a transparent, provenance-disclosed public-
   standards desk review, not an operator-confirmed study.

## Repository layout

```
data/raw/       reused inputs from the sibling pipeline-advisory-priority repo
                (dataset CSV, TSA crosswalk, config YAMLs, upstream stats/QA)
data/processed/ new analysis tables, stats.json, qa_report.txt
src/            01_sensitivity_and_stratified.py, 02_framework_coverage.py,
                03_assemble_stats.py, 04_build_figures.py, mannwhitney.py
figures/        fig3-fig6 (new); fig1-fig2 from the base paper are reused by
                reference (unchanged underlying data), not rebuilt here
manuscript/     build_manuscript.js (docx-js) and the built .docx
docs/           BUILD_SPEC, CODEBOOK, LIMITATIONS, VERIFY_CHECKLIST, NEXT_STEPS,
                PUBLISH_GUIDE, GITHUB_ZENODO_GUIDE
```

## Reproducing the numbers

```bash
pip install pandas pyyaml
python3 src/01_sensitivity_and_stratified.py
python3 src/02_framework_coverage.py
python3 src/03_assemble_stats.py
python3 src/04_build_figures.py          # add --final once verification passes
node manuscript/build_manuscript.js      # add --final once verification passes
```

`data/raw/pipeline_prioritized_v1_REUSED.csv` is committed here (copied from the
verified sibling repo), so every script above runs standalone from a fresh clone
— unlike the base paper's own dedup step, which depends on an unpublished
upstream raw export.

## Data sources

All reused, cited, no new fetch. See `docs/BUILD_SPEC.md` for the full table
with vintages and licenses: the base paper's verified v1 dataset (ICS Advisory
Project, CISA KEV, FIRST.org EPSS, CISA Vulnrichment, MITRE ATT&CK-for-ICS,
TSA Pipeline-2021-02 crosswalk), plus five independently published control
frameworks used only for the Section IV crosswalk (NIST SP 800-82 Rev. 3, NIST
SP 800-53 Rev. 5, IEC 62443, CIS Controls v8, NIST CSF 2.0).

## Author

Sole author: Friday Ogochukwu Ikwuogu (ORCID 0009-0009-2222-1318),
Independent Researcher, Odessa, Texas, USA. See `AUTHORS.json`.

## License

Code: MIT. New derived data and manuscript text: CC BY 4.0, except columns
inherited from the ICS Advisory Project (ODbL v1.0) and IEC 62443 / CIS
Controls v8 control identifiers (their own licenses). See `LICENSE`.
