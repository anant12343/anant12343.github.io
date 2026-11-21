// Shared content types. Edit the data files, not this one.

/** Any string starting with "TODO" is rendered as a visible, dashed "to fill" marker on the site. */
export type Text = string;

export const categories = ["Product", "Data/ML", "AI Automation", "Marketing Strategy", "Side builds"] as const;
export type Category = (typeof categories)[number];

export interface ImageRef {
  src: string; // path under /public
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One-line summary for cards. */
  tagline: Text;
  category: Category;
  featured?: boolean;
  /** Where it happened: course, competition, company, or "Self-initiated". */
  context: Text;
  /** Date as it appears on the resume. Use "TODO" if unknown. */
  date: Text;
  role: Text;
  /** Case-study sections */
  problem: Text;
  approach: Text[];
  built: Text[];
  outcome: Text[];
  tools: string[];
  /** Hard numbers that appear on the resume. Never add a number that is not there. */
  stats?: { value: string; label: string }[];
  cover: ImageRef;
  gallery: ImageRef[];
  og: string;
  links?: { label: string; href: string }[];
  /** Where each fact came from, for your own checking. Not rendered. */
  sources?: string[];
}

export interface ExperienceItem {
  org: string;
  orgNote?: string;
  role: string;
  period: string;
  kind: "Work" | "Internship" | "Leadership";
  points: string[];
}

export interface EducationItem {
  qualification: string;
  institution: string;
  place?: string;
  period: string;
  note?: string;
}
