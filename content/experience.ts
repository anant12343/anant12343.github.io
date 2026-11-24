// Experience timeline. Wording follows resume.pdf; trim freely, but don't add numbers that aren't on it.
import type { ExperienceItem } from "./types";

export const experience: ExperienceItem[] = [
  {
    org: "InternzValley",
    orgNote: "EdTech sales · Bengaluru",
    role: "Business Development Intern",
    period: "May 2026 – Jul 2026",
    kind: "Internship",
    points: [
      "Worked 1,100+ B2B leads through 500+ calls against an INR 1 lakh/month target, and closed 6 partner deals by mapping needs and handling objections.",
      "Built lead scoring and HubSpot triggers (CRM automation): qualification time cut ~30%, demo bookings up from 2.2% to 10.3%.",
      "A/B-tested AIDA-based pitch variants and tracked the pipeline in Salesforce and HubSpot through weekly dashboards.",
      "Wrote the sales playbook used to train 5 new interns, and recruited and onboarded 30+ campus ambassadors as a new outreach channel.",
    ],
  },
  {
    org: "Pocket Scholar",
    orgNote: "EdTech startup",
    role: "Co-founder & Chief Product Officer",
    period: "2025", // TODO: month range, and whether this is ongoing
    kind: "Work",
    points: [
      "Co-founded a 6-member venture offering skill modules, live industry projects and Edu Kits to students, and owned the product end to end.",
      "Ran customer discovery with students, colleges and industry partners, and turned the requirements into the roadmap, strategy and go-to-market plan.",
    ],
  },
  {
    org: "EcoChamber, BIMTECH",
    orgNote: "Economics club",
    role: "Executive Member",
    period: "2025 – Present",
    kind: "Leadership",
    points: [
      "Organised EcoQuest, a national inter-college economics competition for 500+ students from 25+ B-schools, delivered with zero escalations.",
    ],
  },
  {
    org: "Biogreenfuture",
    role: "Digital Marketing Intern",
    period: "Oct 2024 – Jan 2025",
    kind: "Internship",
    points: [
      "Worked with senior management on AI-assisted content for social, blogs and newsletters.",
      "Built a 3-month content calendar that lifted monthly reach by 20%+.",
      "Ran competitor and keyword analysis for blog SEO.",
    ],
  },
  {
    org: "Varahe Analytics",
    role: "Political Consultant",
    period: "Jun 2024 – Sep 2024",
    kind: "Work",
    points: [
      "Analysed public policy and operations data and presented evidence-based recommendations to stakeholders.",
      "Tracked Maharashtra's political and economic trends through structured, ongoing research.",
    ],
  },
];
