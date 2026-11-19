// Everything about you that is not a project or a job.
// Source of truth: resume.pdf (Ananth_Madabhushini_CV_BIMTECH_Infosys_BPM_Digital_Delivery_v3).
import type { EducationItem } from "./types";

export const profile = {
  name: "Ananth Srivastav Madabhushini",
  shortName: "Ananth",
  // Positioning line (from your brief)
  headline: "Engineer turned data person turned marketer who builds things.",
  intro:
    "PGDM Marketing student at BIMTECH. Mechanical engineering first, then data science, now marketing. I work across product, growth and analytics, and I build no-code AI automations.",
  focus: ["Product", "Growth", "Analytics", "No-code AI automation"],
  location: "Greater Noida, India",
  timezone: "Asia/Kolkata",
  openTo: "Bengaluru / Pune · willing to travel",
  status: {
    label: "Open to roles",
    detail: "Graduating 2027",
  },

  // ---- Contact -------------------------------------------------------------
  // Public email: the BIMTECH address printed on the resume.
  // TODO: swap for a personal address if you prefer one that outlives college.
  email: "ananth.madabhushini27@bimtech.ac.in",
  // Phone intentionally left off the site (it is still in the downloadable PDF).
  links: {
    linkedin: "https://www.linkedin.com/in/ananthsm2",
    github: "https://github.com/anant12343",
  },

  // Set NEXT_PUBLIC_SITE_URL once you have a domain. On Vercel the production URL is picked up automatically.
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://ananth-portfolio.vercel.app"), // TODO: your real URL

  languages: ["English", "Hindi", "Telugu"],
  hobbies: [
    "Rugby (flanker / winger)",
    "MMA & functional fitness",
    "F1 aerodynamics",
    "Learning languages",
    "Geopolitics & history",
  ],
  learning: "Industrial design",
};

// Stack tile on the hero + Skills section. Grouped as on the resume.
export const skills = {
  Technical: [
    "Python",
    "SQL / MySQL",
    "Tableau",
    "Power BI",
    "Advanced Excel",
    "Make.com",
    "Google Gemini",
    "C++",
    "Java",
  ],
  CRM: ["HubSpot", "Salesforce", "Zoho CRM"],
  Functional: [
    "Process study & assessment",
    "Requirements documentation",
    "Solution conceptualisation",
    "ROI analysis",
    "Stakeholder management",
    "Market research",
  ],
  Coursework: [
    "Lean Six Sigma",
    "Robotic Process Automation",
    "AI & Machine Learning",
    "Business Process Improvement",
    "Operations & Process Management",
    "Digital Transformation",
  ],
};

/** Short list shown on the hero "stack" tile. */
export const heroStack = ["Python", "SQL", "Tableau", "Power BI", "Make.com", "Gemini", "HubSpot", "Salesforce"];

export const certifications = [
  "Google Data Analytics",
  "BCG Data Science (Forage)",
  "IBM Generative AI",
  "AWS",
  "HubSpot",
  "Salesforce CRM",
  "Design Boat UI/UX",
];

export const achievements = [
  "National Delegate, India Leadership Residency 2026, with sessions at Parliament and NITI Aayog",
  "Round 2, Hermes' Dialogue 7.0 (Cosmopolitan Club, BIMTECH): case study on India's response to the EU CBAM",
];

// Grades are deliberately not shown on the site (they are in the PDF).
export const education: EducationItem[] = [
  {
    qualification: "PGDM, Marketing",
    institution: "Birla Institute of Management Technology (BIMTECH)",
    place: "Greater Noida",
    period: "2025 – 2027",
  },
  {
    qualification: "PG Diploma in Data Science & Finance",
    institution: "Meghnad Desai Academy of Economics (MDAE)",
    place: "Mumbai",
    period: "2023 – 2024",
    note: "Live project with MySQL, Random Forest (scikit-learn) and Tableau",
  },
  {
    qualification: "B.Tech, Mechanical Engineering",
    institution: "Amrita School of Engineering",
    place: "Bengaluru",
    period: "2018 – 2022",
  },
];
