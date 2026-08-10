// CV Data Types - Structured data format for CV storage and rendering

export interface CVData {
  personalDetails: {
    name: string;
    title: string; // Professional title tailored to the job
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    location: string;
  };
  summary: string; // Professional summary (3-4 sentences, tailored to job)
  roles?: string[]; // Professional roles (rewritten slightly to match job)
  experience?: Array<{
    role: string;
    company: string;
    years: string; // e.g., "2020 - Present"
    bullets: string[]; // Responsibilities and achievements
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    years: string;
  }>;
  skills: string[]; // Up to 15 skills, most relevant to job
  projects?: Array<{
    title: string;
    description: string;
  }>;
  accomplishments?: string[];
  awards?: Array<{
    title: string;
    issuer?: string;
    year?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: string;
  }>;
  languages?: string[];
  interests?: string[];
  publications?: Array<{
    title: string;
    journal?: string;
    year?: string;
  }>;
  volunteerWork?: Array<{
    organization: string;
    role?: string;
    duration?: string;
    description?: string;
  }>;
  additionalSections?: Array<{
    sectionName: string;
    content: string;
  }>;
  references?: Array<{
    name: string;
    title?: string;
    company?: string;
    phone?: string;
    email?: string;
  }>;
}

// The design list for this feature lives in ./design-list.ts (CV_PAGE_DESIGNS)
// — kept separate from this file, and separate from lib/types/cv.ts's own
// CV_TEMPLATES, so there's only one place either list can be imported from.
