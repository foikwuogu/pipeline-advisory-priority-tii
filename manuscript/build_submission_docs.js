// Builds the two remaining IEEE TII submission documents: the cover letter and the
// conflict-of-interest statement. Separate from build_manuscript.js (which builds the
// paper itself) because these are short, single-column business documents, not the
// two-column manuscript.
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require("docx");

const FONT = "Times New Roman";
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 200, line: 360 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, font: FONT, size: 24, italics: !!opts.italics, bold: !!opts.bold })],
  });
}
function pageProps() {
  return { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } };
}

// ---------------------------------------------------------------- Cover letter ----

const coverChildren = [
  P("[Submission date — fill in on the day you actually submit]"),
  P(""),
  P("Editor-in-Chief"),
  P("IEEE Transactions on Industrial Informatics"),
  P("Submitted via IEEE Author Portal"),
  P(""),
  P("Re: Submission of manuscript “ONG-OT Vulnerability Prioritization: Dataset, Method, and Sector-Specific Validation” (Regular Paper)", { bold: true }),
  P(""),
  P("Dear Editor-in-Chief,"),
  P("We are pleased to submit our manuscript, “ONG-OT Vulnerability Prioritization: Dataset, Method, and Sector-Specific Validation,” for consideration as a Regular Paper in IEEE Transactions on Industrial Informatics. The manuscript presents a composite, reproducible vulnerability-prioritization score for oil-and-gas pipeline operational technology, built from CISA ICS advisories joined against EPSS, KEV, and a TSA Pipeline-2021-02 outcome taxonomy, and reports a public-standards crosswalk of that taxonomy against five independently published control frameworks as an explicit, citable substitute for operator-confirmed validation. We believe the manuscript's subject matter — OT/ICS cybersecurity for critical energy infrastructure — fits squarely within the journal's scope."),
  P("Relationship to prior work. This manuscript is an extended version of a conference-length paper, O. F. Ikwuogu, “Which ICS advisories matter to a pipeline operator? Exploitation likelihood, patch availability, and compensating controls across CISA advisories, 2010–2026,” prepared for the IEEE Texas Power and Energy Conference (TPEC 2027). In the interest of full transparency: as of this writing, TPEC 2027's own call for papers has not yet been published, so the conference paper itself has not yet been submitted, let alone accepted or presented. TPEC 2027 is scheduled for February 2027, ahead of this journal submission; our intended sequence is to present the conference version at TPEC 2027 and submit this extended version afterward. We disclose this chronology plainly rather than presenting the conference paper as further along than it is, and we recognize that if TPEC 2027 acceptance or presentation does not proceed as planned, the framing of this manuscript as an “extended version of” a specific conference paper may need to be revisited — for example, citing it instead as a preprint or as a manuscript concurrently in preparation."),
  P("This extension adds substantial new technical content beyond the conference version: (1) an EPSS-threshold sensitivity analysis quantifying how much of the study's exploitation-response reasoning depends on an author-chosen parameter; (2) a statistically tested stratification of the pipeline-relevant subset by classification-confidence tier; (3) a quantified year-over-year trend regression on the pipeline-relevant share of advisories, replacing a qualitative claim with an estimate and its uncertainty; and (4) a new Section IV presenting a coverage-and-provenance crosswalk of the study's TSA-outcome taxonomy against five independently published control frameworks, with the share of that crosswalk resting on primary, derived, and author-mapped evidence disclosed explicitly. In our own assessment this constitutes well over 30% new technical content relative to the base paper, consistent with IEEE's conference-to-journal extension norms, though we recognize this is a self-assessment and defer to the editorial team's own determination."),
  P("AI-assistance disclosure. Generative-AI assistance was used in this project's data pipeline code, figure-generation scripts, and manuscript drafting mechanics. Every analytic decision, every statistical result, and every number reported in the manuscript was reviewed and verified by the human authors against a machine-written, version-controlled statistics file before being included in the text; no analytic conclusion in this paper was generated without author review. We disclose this per IEEE's current generative-AI use policy and are glad to provide further detail if the editorial team requires it."),
  P("Data and code availability. All new analysis code, configuration, documentation, and figures supporting this manuscript are openly archived at Zenodo (DOI: 10.5281/zenodo.22857631, https://doi.org/10.5281/zenodo.22857631), corresponding to a public GitHub repository release. This DOI is cited in the manuscript's Appendix A."),
  P("Conflict of interest. The authors declare no conflicts of interest relevant to this manuscript; a separate conflict-of-interest statement is enclosed with this submission."),
  P("We confirm that this manuscript has not been published previously and is not under consideration for publication elsewhere, and that all authors have reviewed and approved this submission. Thank you for considering our manuscript. We look forward to the review process and welcome any questions."),
  P(""),
  P("Sincerely,"),
  P(""),
  P("Ogochukwu Friday Ikwuogu (corresponding author)"),
  P("Independent Researcher, Odessa, Texas, USA"),
  P("Friday.ikwuogu@gmail.com — ORCID 0009-0009-2222-1318"),
  P(""),
  P("On behalf of co-authors Silas Abutu (Petroleum Training Institute) and Abidemi Orimogunje (Redeemer's University)"),
];

const coverDoc = new Document({ sections: [{ properties: pageProps(), children: coverChildren }] });

// ------------------------------------------------------- Conflict-of-interest statement ----

const coiChildren = [
  P("Conflict of Interest Statement", { bold: true, align: AlignmentType.CENTER }),
  P(""),
  P("Manuscript: “ONG-OT Vulnerability Prioritization: Dataset, Method, and Sector-Specific Validation”", { align: AlignmentType.CENTER, italics: true }),
  P(""),
  P("The authors declare that they have no known competing financial interests, personal relationships, or institutional affiliations that could have appeared to influence the work reported in this paper. No funding, grant, or other financial support was received for this research. This has been confirmed directly by all three authors, including co-authors Silas Abutu and Abidemi Orimogunje."),
  P(""),
  P("Ogochukwu Friday Ikwuogu, Independent Researcher, Odessa, Texas, USA (corresponding author)"),
  P("Silas Abutu, Electrical and Electronic Engineering Department, Petroleum Training Institute, Effurun, Delta State, Nigeria"),
  P("Abidemi Orimogunje, Electrical and Electronic Engineering Department, Redeemer's University, Ede, Osun State, Nigeria"),
];

const coiDoc = new Document({ sections: [{ properties: pageProps(), children: coiChildren }] });

Promise.all([
  Packer.toBuffer(coverDoc).then(buf => fs.writeFileSync("manuscript/cover_letter.docx", buf)),
  Packer.toBuffer(coiDoc).then(buf => fs.writeFileSync("manuscript/conflict_of_interest_statement.docx", buf)),
]).then(() => console.log("Wrote manuscript/cover_letter.docx and manuscript/conflict_of_interest_statement.docx"));
