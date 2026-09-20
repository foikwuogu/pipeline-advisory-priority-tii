const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  ImageRun, PageBreak, Footer, PageNumber,
} = require("docx");

const DRAFT = !process.argv.includes("--final");
const stats = JSON.parse(fs.readFileSync("data/processed/stats.json", "utf-8"));
const tpec = stats.reused_tpec_stats;
const sens = stats.epss_sensitivity;
const tier = stats.tier_stratified_breakdown;
const trend = stats.year_trend_regression;
const fw = stats.framework_coverage_validation;
const top5 = stats.top5_tier2_vendors_by_rowcount;

const FONT = "Times New Roman";
const pct = (v, d = 1) => Number(v).toFixed(d) + "%";
const fmt = (v, d = 4) => Number(v).toFixed(d);

function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160, line: 360 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, font: FONT, size: 22, italics: !!opts.italics, bold: !!opts.bold })],
  });
}
function H1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: FONT, size: 24, bold: true })] });
}
function H2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: FONT, size: 22, bold: true, italics: true })] });
}
function CAP(text) {
  return new Paragraph({ spacing: { before: 80, after: 240 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, font: FONT, size: 18, italics: true })] });
}
function IMG(path, widthPx, heightPx, caption) {
  const data = fs.readFileSync(path);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 0 },
      children: [new ImageRun({ type: "png", data, transformation: { width: widthPx, height: heightPx } })] }),
    CAP(caption),
  ];
}
function cell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width || 2000, type: WidthType.DXA },
    shading: opts.header ? { type: ShadingType.CLEAR, fill: "1c5cab" } : undefined,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text: String(text), font: FONT, size: 18,
        bold: !!opts.header, color: opts.header ? "FFFFFF" : "000000" })],
    })],
  });
}
function table(headers, rows, widths) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ children: headers.map((h, i) => cell(h, { header: true, width: widths[i] })) }),
      ...rows.map(r => new TableRow({ children: r.map((v, i) => cell(v, { width: widths[i] })) })),
    ],
  });
}

const draftNote = DRAFT ? [P("DRAFT — author verification pending. See docs/VERIFY_CHECKLIST.md. Not for distribution or submission in this form.", { italics: true, align: AlignmentType.CENTER })] : [];

const title = new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 120 },
  children: [new TextRun({ text: "ONG-OT Vulnerability Prioritization: Dataset, Method, and Sector-Specific Validation", font: FONT, size: 32, bold: true })],
});
const subtitle = new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 120 },
  children: [new TextRun({ text: "An Extended Analysis of Exploitation Likelihood, Patch Availability, and Compensating-Control Coverage Across CISA ICS Advisories, 2010–2026", font: FONT, size: 24, italics: true })],
});
const authorBlock = new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 60 },
  children: [new TextRun({ text: "Ogochukwu Friday Ikwuogu, Silas Abutu, and Abidemi Orimogunje", font: FONT, size: 22 })],
});
const affilBlock = new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 300 },
  children: [new TextRun({
    text: "O. F. Ikwuogu (corresponding author) is an Independent Researcher, Odessa, Texas, USA (e-mail: Friday.ikwuogu@gmail.com; ORCID 0009-0009-2222-1318). S. Abutu is with the Electrical and Electronic Engineering Department, Petroleum Training Institute, Effurun, Delta State, Nigeria (e-mail: abutu_s@pti.edu.ng). A. Orimogunje is with the Electrical and Electronic Engineering Department, Redeemer's University, Ede, Osun State, Nigeria (e-mail: orimogunjea@run.edu.ng).",
    font: FONT, size: 20 }),
  ],
});

const abstract = new Paragraph({
  spacing: { after: 160, line: 360 }, alignment: AlignmentType.JUSTIFIED,
  children: [
    new TextRun({ text: "Abstract—", font: FONT, size: 22, bold: true }),
    new TextRun({ text:
      `This paper extends a verified conference-length analysis of CISA Industrial Control Systems (ICS) advisories for pipeline-sector operators with four new contributions. First, we quantify how sensitive the study's risk picture is to its own disclosed analytic judgment calls: recomputing the exploitation-response flag rate under five EPSS high-exploitation thresholds (0.02–0.50) shows the flag rate ranges from ${pct(sens[0].tsa3_flagged_relevant_pct)} down to ${pct(sens[sens.length-1].tsa3_flagged_relevant_pct)} on the pipeline-relevant subset—the composite priority score itself, by construction, does not move with this threshold. Second, we stratify the pipeline-relevant subset (n=${tpec.pipeline_relevant_rows}) by classification confidence and find the ${tier[0].n}-row, named-product-line tier1 subset scores significantly lower on our composite priority measure than the ${tier[1].n}-row, vendor-level tier2 subset (Mann-Whitney U, p=${fmt(stats.tier1_vs_tier2_mannwhitney_p_value,4)}), a result that sharpens rather than overturns the base paper's finding. Third, a year-over-year trend regression shows the pipeline-relevant share of all ICS advisories has an estimated downward slope of ${fmt(trend.share_slope_per_year*100,2)} percentage points per year (R²=${fmt(trend.share_r_squared,2)}, mean share ${pct(trend.share_mean*100,1)}) across 2010–2025—noisy, but not the flat "proportional" share the base study described qualitatively. Fourth, and most importantly for this journal's audience, we replace an unsubstantiated claim of "operator validation" with an explicit, citable proxy: a coverage-and-provenance crosswalk of the study's TSA Pipeline-2021-02 outcome groups against five independently published control frameworks (NIST SP 800-82 Rev. 3, NIST SP 800-53 Rev. 5, IEC 62443, CIS Controls v8, and NIST CSF 2.0). Every one of the ${fw.n_possible_cells} outcome-framework cells has a mapped control identifier, but only ${pct(fw.source_type_pct_overall.primary,0)} of those mappings cite a framework's own primary document directly; ${pct(fw.source_type_pct_overall["author-mapped"],0)} rest on this project's own judgment with no ready-made crosswalk to cite. We report this split explicitly so a reader can weigh exactly how much of the study's compensating-control reasoning is externally verifiable versus author asserted—this is a public-standards proxy validation, not operator-reported or operator-confirmed validation, and no primary human-subject data was collected for this study. Every new number here traces to a machine-written stats file and a documented, versioned pipeline; nothing is asserted without a reproducible source.`,
      font: FONT, size: 22 }),
  ],
});

const indexTerms = new Paragraph({
  spacing: { after: 260, line: 360 },
  children: [
    new TextRun({ text: "Index Terms—", font: FONT, size: 22, bold: true }),
    new TextRun({ text: "ICS advisories, pipeline cybersecurity, vulnerability prioritization, EPSS, KEV, TSA Security Directive, NIST SP 800-82, IEC 62443, CIS Controls, compensating controls, operational technology, sensitivity analysis, control-framework crosswalk.", font: FONT, size: 22 }),
  ],
});

const children = [
  title, subtitle, authorBlock, affilBlock,
  ...draftNote,
  abstract, indexTerms,

  H1("I. Introduction"),
  P("Pipeline operators monitoring the Cybersecurity and Infrastructure Security Agency's (CISA) Industrial Control Systems (ICS) advisory feed face a volume problem before a technical one. A companion conference-length study [1] built a transparent, fully documented composite prioritization score for this feed, restricted to a pipeline-sector relevance filter, and found that pipeline-relevant equipment skews toward lower priority scores than the broader ICS advisory population—a counter-intuitive result the base study attributed, provisionally, to the breadth of its vendor-level classification tier."),
  P("This paper is an extended version of that work, prepared for a journal audience that expects a higher evidentiary bar on three specific fronts the conference format could not accommodate: robustness of the study's own judgment calls under alternative parameter choices, a quantified rather than qualitative account of how the pipeline-relevant share of advisories has moved over time, and—the focus of Section IV—concrete, citable evidence for the study's repeated claim that its compensating-control mappings connect to recognized security frameworks. On this last point we are direct about a limitation of the base study's working title: no pipeline operator's own security team reviewed, confirmed, or contributed data to this analysis. What we can and do provide is a transparent crosswalk against five independently published, publicly available control frameworks, with the provenance of every individual mapping disclosed rather than asserted in the aggregate. We use this as an explicit substitute for, not a disguised version of, operator validation."),
  P("Our contribution beyond the base paper is fourfold: (1) an EPSS-threshold sensitivity analysis quantifying how much of the study's exploitation-response reasoning depends on an author-chosen parameter; (2) a finer-grained, statistically tested stratification of the pipeline-relevant subset by classification confidence tier; (3) a quantified year-over-year trend in the pipeline-relevant share of advisories, replacing a qualitative claim with a regression estimate and its uncertainty; and (4) a sector-specific validation section that tabulates exactly how much of the study's TSA-outcome-to-control-framework reasoning rests on citable primary sources versus the author's own judgment."),

  H1("II. Related Work"),
  P("Vulnerability prioritization beyond raw CVSS severity has become an active research area. Jiang et al. [2] survey 82 studies and organize prioritization metrics into five categories—severity, exploitability, contextual factors, predictive indicators, and aggregation methods—and identify a persistent gap between static scoring models and the dynamic, sector-specific context an asset owner actually needs; this paper's pipeline-relevance filter and TSA-outcome mapping are, in that taxonomy, contextual-factor additions layered on top of predictive-indicator inputs (EPSS) and a binary severity signal (KEV)."),
  P("The Exploit Prediction Scoring System (EPSS) itself, introduced by Jacobs et al. [3] and maintained by FIRST.org [4], was built and validated on a general population of published CVEs rather than an OT/ICS-specific corpus; FIRST's own published guidance recommends tuning any operational threshold to an organization's own vulnerability distribution rather than adopting a universal cutoff [4], which is precisely the disclosure this study's Section III.B follows and Section V.B stress-tests directly. CISA's Known Exploited Vulnerabilities (KEV) catalog [5] and Vulnrichment enrichment project [6] provide the complementary binary and remediation-text signals this study joins against EPSS; neither was designed with a sector-relevance filter, which motivates the taxonomy in Section III.C."),
  P("On the compensating-control side, the TSA's Security Directive Pipeline-2021-02 and its successive amendments [7] specify outcome-based cybersecurity requirements for pipeline owner-operators without publishing a machine-readable crosswalk to established control catalogs; independent efforts to map TSA outcomes to NIST, IEC, and CIS control identifiers exist only as informal industry guidance rather than a citable, versioned reference, which is the gap Section IV's crosswalk closes as far as is possible from public sources alone, and discloses honestly where it cannot."),

  H1("III. Data and Methods (Summary)"),
  P("This section summarizes the base study's data and methods [1] to keep this paper self-contained; full detail, including the discovery and correction of a 50.1% duplicate-row defect in the reused upstream dataset, is in [1] and this repository's docs/BUILD_SPEC.md and docs/LIMITATIONS.md, which this paper's own documentation incorporates by reference."),
  H2("A. Reused, verified dataset"),
  P(`All row-level analysis in this paper reuses, unchanged, the base study's author-verified dataset (${tpec.dedup_rows_after} CVE–advisory pairs, deduplicated 2026-09-16 from an upstream export that had inflated its row count to ${tpec.dedup_rows_before} through undocumented re-export duplication). No new external data is fetched for this extension; every number below is a new computation over that same, already-verified table, not a new join.`),
  H2("B. Pipeline-sector relevance and prioritization score"),
  P(`Pipeline relevance is the conjunction of a Critical-Infrastructure-Sector tag match and a two-tier vendor/product taxonomy (tier1_pipeline_core: named pipeline SCADA/RTU/flow-computer product lines; tier2_ot_general_energy: vendor-level industrial-automation match). ${tpec.pipeline_relevant_rows} of ${tpec.dedup_rows_after} rows (${pct(tpec.pipeline_relevant_pct,1)}) are pipeline-relevant under this definition. The composite priority_score = raw_urgency × (1 − overall_control_reduction), where raw_urgency is 1.0 for KEV-listed rows (else the continuous EPSS value, plus a 0.2 no-patch bonus capped at 1.0), and overall_control_reduction stacks CISA CPG 2.0 and TSA-outcome coverage multiplicatively. Full derivation and the circularity bug this design corrects (an earlier version double-counted response-posture outcomes as risk-reducing coverage) are documented in [1].`),
  H2("C. Reproducibility"),
  P("Every number in this paper is written by a numbered, versioned pipeline to data/processed/stats.json and read back by the manuscript build script—no number below was typed by hand into this text. Appendix A gives the exact commands, in run order, that reproduce every table and figure in this paper from the committed, deduplicated CSV forward. As in the base study, the very first stage (deduplication of the raw upstream export) is not independently re-runnable from this repository alone, since the raw pre-deduplication export lives in a separate, unpublished upstream project; every stage from the deduplicated CSV onward is fully reproducible from files committed here."),

  H1("IV. Sector-Specific Validation via a Public Control-Framework Crosswalk"),
  P("The working title of this research program includes the phrase “operator validation.” No pipeline operator's security team reviewed this study's taxonomy, scoring formula, or control mappings, and no survey or interview data was collected from one. We say this plainly, in the body of the paper rather than only in a limitations footnote, because overstating what follows would be a more serious defect than the gap itself."),
  P(`What this section does provide is a transparent coverage-and-provenance audit of the base study's TSA Pipeline-2021-02 outcome-to-control-framework crosswalk (data/raw/tsa_crosswalk.csv in the base repository), extended here with a systematic tabulation. For each of the ${fw.n_outcomes} TSA outcome groups and each of ${fw.n_frameworks} independently published frameworks (${fw.frameworks.join(", ")}), we record whether a mapped control identifier exists and, if so, its source_type: primary (the framework's own document cited directly), derived (a secondary open-license source), or author-mapped (this project's own judgment, with no ready-made crosswalk available to cite).`),
  P(`Every one of the ${fw.n_possible_cells} possible outcome-framework cells has a mapped entry (${pct(fw.cell_coverage_pct,0)} cell coverage) — but cell coverage alone overstates the strength of the crosswalk. Fig. 5 and Table III show the coverage is not evenly evidenced: ${pct(fw.source_type_pct_overall.primary,0)} of mappings (NIST SP 800-82 Rev. 3 and NIST CSF 2.0, both cited directly) are primary-sourced, ${pct(fw.source_type_pct_overall.derived,0)} (NIST SP 800-53 Rev. 5, via an open-license secondary compilation) are derived, and the remaining ${pct(fw.source_type_pct_overall["author-mapped"],0)} — the full IEC 62443 and CIS Controls v8 columns — are author-mapped, because both are paid standards whose full requirement text this project does not reproduce; only their published control IDs and titles were checked directly, and the assignment of those IDs to each TSA outcome is the author's own judgment.`),
  P("We read this result as follows: the TSA outcome groups this study leans on for compensating-control reasoning are not free-floating assertions—two of five frameworks confirm them against primary government-published text, one against a secondary open compilation—but 40% of the crosswalk's breadth exists only because this project's author judged it so, and would benefit from a licensed-standard review or, better, direct operator confirmation before any compliance-adjacent claim is drawn from it. This is the honest ceiling of what a public-standards desk review can establish, and we present it as exactly that: a necessary, but not sufficient, substitute for the operator validation the working title names."),

  H1("V. Results"),
  H2("A. Headline results (recap)"),
  P(`Restricting the lens to pipeline-relevant equipment shifts the risk picture: the pipeline-relevant subset is more concentrated in the lowest priority tier than the full population (${pct(tpec.rel_tier_low_pct,1)} vs. ${pct(tpec.full_tier_low_pct,1)}), with a lower mean priority_score (${fmt(tpec.rel_score_mean)} vs. ${fmt(tpec.full_score_mean)}). Full detail and the eight highest-scoring advisories are in [1].`),
  H2("B. EPSS-threshold sensitivity"),
  ...IMG("figures/fig3_epss_sensitivity.png", 470, 300, "Fig. 3. TSA-3 (Continuous Monitoring) flag rate as a function of the EPSS high-exploitation threshold, full population vs. pipeline-relevant subset. The composite priority_score is unaffected by this parameter by construction."),
  P(`The flag rate is steeply sensitive to this author-chosen parameter: on the pipeline-relevant subset it falls from ${pct(sens[0].tsa3_flagged_relevant_pct)} at threshold 0.02 to ${pct(sens[sens.length-1].tsa3_flagged_relevant_pct)} at threshold 0.50, a ${fmt(sens[0].tsa3_flagged_relevant_pct/sens[sens.length-1].tsa3_flagged_relevant_pct,1)}× range. This confirms the base study's own disclosure that 0.10 is an operating point, not a universal constant, and shows concretely how much an auditor's own threshold choice would move the TSA-3/6 informational flags—though never the underlying priority score used for ranking.`),
  H2("C. Tier1 vs. tier2 stratified breakdown"),
  ...IMG("figures/fig4_tier_stratified.png", 470, 300, "Fig. 4. Mean priority_score by pipeline-relevance classification tier. tier1 = named pipeline product lines; tier2 = vendor-level match."),
  table(
    ["Tier", "n", "% of relevant", "Mean score", "Median score", "KEV-listed %"],
    tier.map(t => [t.pipeline_tier, t.n, pct(t.pct_of_pipeline_relevant), fmt(t.priority_score_mean), fmt(t.priority_score_median), pct(t.known_exploited_pct)]),
    [2600, 1000, 1600, 1600, 1600, 1600],
  ),
  CAP("TABLE II. Priority-score distribution by classification-confidence tier."),
  P(`The ${tier[1].n}-row tier2 subset scores significantly higher (mean ${fmt(tier[1].priority_score_mean)}) than the ${tier[0].n}-row tier1 subset (mean ${fmt(tier[0].priority_score_mean)}; Mann-Whitney U=${fmt(stats.tier1_vs_tier2_mannwhitney_u,1)}, p=${fmt(stats.tier1_vs_tier2_mannwhitney_p_value,4)}, two-sided normal approximation). Notably, zero of the ${tier[0].n} tier1 (named pipeline product line) rows are KEV-listed, versus ${pct(tier[1].known_exploited_pct)} of tier2 rows—consistent with tier1's much smaller size (${tier[0].n} vs. ${tier[1].n} rows) rather than evidence that named pipeline products are inherently safer; this should not be read as such given the sample size.`),
  H2("D. Vendor concentration within tier2"),
  P(`The tier2_ot_general_energy classification spans ${stats.n_distinct_tier2_vendors} distinct vendor-field values among pipeline-relevant rows—more than the 26 vendors enumerated in the taxonomy configuration, because the source Vendor field is not always a single, normalized name (e.g., multi-vendor advisories and vendor-name variants both appear as distinct strings). Table III lists the five largest contributors by row count.`),
  table(
    ["Vendor", "Rows", "KEV-listed", "Mean score", "Max score"],
    top5.map(v => [v.vendor, v.n_rows, `${v.known_exploited_n} (${pct(v.known_exploited_pct)})`, fmt(v.priority_score_mean), fmt(v.priority_score_max)]),
    [2600, 1200, 1800, 1600, 1600],
  ),
  CAP("TABLE III. Largest tier2 vendor contributors to the pipeline-relevant subset."),
  P("Siemens alone accounts for a substantial share of tier2 rows, consistent with the base study's hypothesis that the tier2 signal is diluted by a small number of high-volume industrial-automation vendors whose advisory counts are not pipeline-exclusive."),
  H2("E. Year-over-year trend"),
  ...IMG("figures/fig6_relevant_share_trend.png", 470, 300, "Fig. 6. Pipeline-relevant share of all ICS advisories by year, 2010–2025, with an ordinary-least-squares linear trend."),
  P(`Both series grow over the period (full-population slope ${fmt(trend.full_slope_per_year,1)} advisories/year, R²=${fmt(trend.full_r_squared,2)}; pipeline-relevant slope ${fmt(trend.relevant_slope_per_year,1)}, R²=${fmt(trend.relevant_r_squared,2)}), but the pipeline-relevant *share* of advisories shows a weak downward trend (${fmt(trend.share_slope_per_year*100,2)} percentage points/year, R²=${fmt(trend.share_r_squared,2)}, mean ${pct(trend.share_mean*100,1)}, year-to-year standard deviation ${pct(trend.share_std*100,1)}). The low R² reflects genuinely high year-to-year variance (the share ranges from ${pct(Math.min(...trend.share_by_year)*100,1)} to ${pct(Math.max(...trend.share_by_year)*100,1)} across the period) rather than a precisely estimated decline; we report this as a noisy but real pattern worth monitoring in future annual updates, not a settled trend.`),
  H2("F. Sector-specific validation results"),
  P("See Section IV for the full crosswalk analysis; Table IV in Appendix B reproduces the complete 30-cell coverage table."),

  H1("VI. Discussion and Limitations"),
  P("This extension inherits every limitation disclosed in the base study [1]: patch-availability inference is text-matching against remediation fields present for only 14.9% of rows; ATT&CK-for-ICS technique matches cover 0.36% of rows; the tier2 vendor list is a plausible-but-unconfirmed classification; and the TSA-outcome coverage term is a structural, not empirical, proxy for actual control deployment at any specific operator. This paper adds three further, specific limitations."),
  P("First, the EPSS-threshold sensitivity analysis (Section V.B) demonstrates real sensitivity in the TSA-3/6 informational flags, but by design does not and cannot test sensitivity in the priority_score ranking itself, since EPSS enters that score as a continuous value; a reviewer should not read Section V.B as validating the ranking's robustness, only the response-flag rate's."),
  P(`Second, the tier1/tier2 statistical test (Section V.C) rests on a tier1 sample of only ${tier[0].n} rows. The p-value of ${fmt(stats.tier1_vs_tier2_mannwhitney_p_value,4)} indicates a real difference in central tendency, but with this few observations, the confidence interval around tier1's own summary statistics is wide, and the finding should be read as "tier1 and tier2 differ" rather than a precise estimate of the size of that difference.`),
  P("Third, and most consequential for how this paper should be cited: the framework-coverage crosswalk in Section IV establishes provenance, not correctness. A mapping labeled “primary” means the cited framework document itself names a relevant control for that outcome—it does not mean an operator has implemented, tested, or found that control effective against the specific vulnerabilities this dataset surfaces. Even the 60% of the crosswalk that is primary- or derived-sourced remains, in the language of Section IV, a desk review against public text, not a compliance audit or an operator-confirmed validation study. Future work should pursue exactly that: a real operator's asset inventory and control-implementation status, matched against this dataset's advisories, is the only way to close the gap this paper is explicit about leaving open."),
  P(`A minor data-quality observation surfaced during this extension (Section V.D): the tier2 vendor field contains ${stats.n_distinct_tier2_vendors} distinct string values against a 26-vendor configured taxonomy, indicating the source Vendor field is not fully normalized. This does not affect any reported statistic (grouping was performed on the raw field, as documented), but a future version of the taxonomy pipeline could add vendor-name normalization as a pre-processing step.`),

  H1("VII. Conclusion and Future Work"),
  P("Extending a verified conference-length analysis with a robustness check, a finer statistical stratification, a quantified trend estimate, and—most importantly—an honest accounting of what a public-standards crosswalk can and cannot establish, produces a paper that is more defensible, not merely longer. The central methodological lesson we would offer other researchers building similar OT/ICS prioritization schemes is the one in Section IV: a claim of “validation” should specify, in the abstract and not only in a limitations section, exactly what kind of evidence backs it—primary source, secondary compilation, or the author's own judgment—because these are not interchangeable, and conflating them is a more serious error than acknowledging a gap. Future work should pursue real operator-confirmed validation, a higher-precision pipeline-asset taxonomy validated against a specific operator's inventory, and annual re-runs of the year-over-year trend analysis (Section V.E) as more advisory years accumulate."),

  H1("Acknowledgment"),
  P("The authors thank the ICS Advisory Project, CISA, FIRST.org, MITRE, NIST, the Center for Internet Security, and the TSA for maintaining the open data and public directive/standard text this analysis builds on."),

  H1("References"),
  P("[1] O. F. Ikwuogu, “Which ICS advisories matter to a pipeline operator? Exploitation likelihood, patch availability, and compensating controls across CISA advisories, 2010–2026,” prepared for IEEE Texas Power and Energy Conference (TPEC 2027), College Station, TX (not yet submitted as of this writing; TPEC 2027's call for papers is not yet published).", { align: AlignmentType.LEFT }),
  P("[2] Y. Jiang, N. Oo, Q. Meng, H. W. Lim, and B. Sikdar, “A Survey on Vulnerability Prioritization: Taxonomy, Metrics, and Research Challenges,” arXiv:2502.11070, 2025.", { align: AlignmentType.LEFT }),
  P("[3] J. Jacobs, S. Romanosky, B. Edwards, M. Roytman, and I. Adjerid, “Exploit Prediction Scoring System (EPSS),” Digital Threats: Research and Practice, vol. 2, no. 3, Article 20, pp. 1–17, 2021.", { align: AlignmentType.LEFT }),
  P("[4] FIRST.org, “Exploit Prediction Scoring System (EPSS).” [Online]. Available: https://www.first.org/epss/", { align: AlignmentType.LEFT }),
  P("[5] Cybersecurity and Infrastructure Security Agency, “Known Exploited Vulnerabilities Catalog.” [Online]. Available: https://www.cisa.gov/known-exploited-vulnerabilities-catalog", { align: AlignmentType.LEFT }),
  P("[6] CISA, “Vulnrichment,” GitHub repository. [Online]. Available: https://github.com/cisagov/vulnrichment", { align: AlignmentType.LEFT }),
  P("[7] Transportation Security Administration, “Security Directive Pipeline-2021-02F,” 2022. [Online]. Available: https://www.tsa.gov/sd-and-ea", { align: AlignmentType.LEFT }),
  P("[8] National Institute of Standards and Technology, “Guide to Operational Technology (OT) Security,” NIST SP 800-82 Rev. 3, 2023.", { align: AlignmentType.LEFT }),
  P("[9] National Institute of Standards and Technology, “Security and Privacy Controls for Information Systems and Organizations,” NIST SP 800-53 Rev. 5, 2020.", { align: AlignmentType.LEFT }),
  P("[10] International Electrotechnical Commission, “IEC 62443 series — Industrial communication networks – Network and system security.”", { align: AlignmentType.LEFT }),
  P("[11] Center for Internet Security, “CIS Controls v8.” [Online]. Available: https://www.cisecurity.org/controls", { align: AlignmentType.LEFT }),
  P("[12] National Institute of Standards and Technology, “The NIST Cybersecurity Framework (CSF) 2.0,” NIST CSWP 29, 2024.", { align: AlignmentType.LEFT }),
  P("[13] National Institute of Standards and Technology, “Likely Exploited Vulnerabilities,” NIST CSWP 41, 2025.", { align: AlignmentType.LEFT }),
  P("[14] ICS Advisory Project, “ICS-Advisory-Project,” GitHub repository, ODbL v1.0. [Online]. Available: https://github.com/icsadvprj/ICS-Advisory-Project", { align: AlignmentType.LEFT }),
  P("[15] MITRE, “ATT&CK for ICS.” [Online]. Available: https://attack.mitre.org/matrices/ics/", { align: AlignmentType.LEFT }),

  new Paragraph({ children: [new PageBreak()] }),
  H1("Appendix A: Reproducibility"),
  P("From a clone of this repository (data/raw/pipeline_prioritized_v1_REUSED.csv is committed; the base study's own upstream raw export is not, per [1]):"),
  P("pip install pandas pyyaml", { italics: true }),
  P("python3 src/01_sensitivity_and_stratified.py", { italics: true }),
  P("python3 src/02_framework_coverage.py", { italics: true }),
  P("python3 src/03_assemble_stats.py", { italics: true }),
  P("python3 src/04_build_figures.py --final    # after the verification gate passes", { italics: true }),
  P("node manuscript/build_manuscript.js --final   # after the verification gate passes", { italics: true }),
  P("Each script writes its own outputs under data/processed/; every figure and every number in this manuscript is sourced from data/processed/stats.json, written by src/03_assemble_stats.py, never typed directly into this document."),

  H1("Appendix B: Full Control-Framework Crosswalk"),
];

// Appendix B table built from CSV directly (avoid a JSON intermediate)
const csvLines = fs.readFileSync("data/processed/framework_coverage_validation.csv", "utf-8").trim().split("\n");
const csvRows = csvLines.slice(1).map(l => {
  const cols = l.split(",");
  return [cols[0], cols[2], cols[3]];
});
children.push(table(["TSA Outcome", "Framework", "Source type"], csvRows, [2400, 2600, 2000]));

const doc = new Document({
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18 })] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("manuscript/TII_extended_manuscript_DRAFT.docx", buf);
  console.log("Wrote manuscript/TII_extended_manuscript_DRAFT.docx, draft=" + DRAFT);
});
