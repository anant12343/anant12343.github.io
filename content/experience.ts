// Experience timeline. Wording follows resume.pdf; trim freely, but don't add numbers that aren't on it.
import type { ExperienceItem } from "./types";

export const experience: ExperienceItem[] = [
  {
    org: "InternzValley",
    orgNote: "EdTech · Bengaluru",
    role: "Business Development Intern",
    period: "May 2026 – Jul 2026",
    kind: "Internship",
    points: [
      "Diagnosed low conversion in the enrolment funnel stage by stage, A/B-tested pitch variants (AIDA) and built a lead-scoring system. Demo bookings went from 2.2% to 10.3% (~4.7x).",
      "Managed 1,100+ leads and 500+ calls through a CRM pipeline against an INR 1 lakh monthly target, closed 6 partner institutions and tracked benefits realisation in weekly MIS reports.",
      "Turned the process into a sales playbook, coached 5 incoming interns on it and built a 30+ member campus ambassador network.",
    ],
  },
  {
    org: "Pocket Scholar",
    orgNote: "EdTech startup",
    role: "Co-founder & Chief Product Officer",
    period: "2025", // TODO: month range, and whether this is ongoing
    kind: "Work",
    points: [
      "Co-founded a 6-member cross-functional EdTech venture (skill modules, live industry projects, Edu Kits). Own product strategy and roadmap.",
      "Ran design-thinking interviews and workshops with students, colleges and partners. Requirements live as a prioritised backlog.",
      "Pitched solution concepts to co-founders and partners and won buy-in on what the team builds first.",
    ],
  },
  {
    org: "EcoChamber, BIMTECH",
    orgNote: "Economics club",
    role: "Executive Member",
    period: "Jul 2025 – Present",
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
      "Ran competitor and keyword analysis for blog SEO; managed scheduling and engagement analytics.",
    ],
  },
  {
    org: "Varahe Analytics",
    role: "Political Consultant",
    period: "Jun 2024 – Sep 2024",
    kind: "Work",
    points: [
      "Assessed public policies and institutional programme operations with a data-driven approach to find gaps.",
      "Tracked Maharashtra's political and economic trends through structured, ongoing research.",
      "Turned findings into strategic recommendations for senior stakeholders.",
    ],
  },
];
