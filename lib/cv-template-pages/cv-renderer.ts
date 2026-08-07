// CV Template Renderer - Renders structured CVData to HTML for different templates
// All templates enforce strict 1-page A4 format

import { CVData } from '@/lib/cv-template-pages/cv-data-types';

// Base CSS for A4 page (strict 1 page) - optimized for PDF conversion and responsive viewing
const baseCss = `
  @page { 
    size: A4;
    margin: 0;
  }
  @media print {
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { 
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    body { margin: 0; padding: 0; }
    .page { 
      width: 210mm;
      min-height: 297mm;
      max-height: 297mm;
      page-break-after: avoid;
      page-break-inside: avoid;
    }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { 
    width: 100%;
    margin: 0;
    padding: 0;
    background: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
  }
  .page { 
    width: 100%;
    max-width: 210mm;
    margin: 0 auto;
    background: #ffffff;
    padding: 20px;
    position: relative;
  }
  @media (min-width: 768px) {
    .page {
      padding: 50px;
    }
  }
`;

// Helper to escape HTML
function htmlEscape(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper to format bullets
function formatBullets(bullets: string[]): string {
  return bullets.filter(Boolean).map(b => `<li style="margin-bottom: 2mm; line-height: 1.4;">${htmlEscape(b)}</li>`).join('');
}

// Estimate section height in mm
function estimateSectionHeight(sectionType: string, data: CVData, sectionKey?: string): number {
  const BASE_SECTION_HEIGHT = 8; // Title + padding
  const LINE_HEIGHT_MM = 4; // Average line height in mm
  const BULLET_HEIGHT = 4; // Per bullet point
  const ENTRY_HEIGHT = 12; // Per work/education entry
  
  switch (sectionType) {
    case 'summary':
      const summaryLines = Math.max(3, Math.ceil((data.summary?.length || 0) / 60));
      return BASE_SECTION_HEIGHT + (summaryLines * LINE_HEIGHT_MM);
    
    case 'experience':
      let expHeight = BASE_SECTION_HEIGHT;
      (data.experience || []).forEach(exp => {
        expHeight += ENTRY_HEIGHT;
        expHeight += (exp.bullets?.length || 0) * BULLET_HEIGHT;
      });
      return expHeight;
    
    case 'education':
      return BASE_SECTION_HEIGHT + ((data.education?.length || 0) * ENTRY_HEIGHT);
    
    case 'skills':
      const skillLines = Math.ceil((data.skills?.length || 0) / 8);
      return BASE_SECTION_HEIGHT + Math.max(1, skillLines) * LINE_HEIGHT_MM;
    
    case 'projects':
      return BASE_SECTION_HEIGHT + ((data.projects?.length || 0) * 8);
    
    case 'accomplishments':
      return BASE_SECTION_HEIGHT + ((data.accomplishments?.length || 0) * 4);
    
    case 'awards':
      return BASE_SECTION_HEIGHT + ((data.awards?.length || 0) * 6);
    
    case 'certifications':
      return BASE_SECTION_HEIGHT + ((data.certifications?.length || 0) * 6);
    
    case 'languages':
      return BASE_SECTION_HEIGHT + LINE_HEIGHT_MM;
    
    case 'interests':
      return BASE_SECTION_HEIGHT + LINE_HEIGHT_MM;
    
    case 'publications':
      return BASE_SECTION_HEIGHT + ((data.publications?.length || 0) * 6);
    
    case 'volunteerWork':
      return BASE_SECTION_HEIGHT + ((data.volunteerWork?.length || 0) * 10);
    
    case 'additionalSections':
      const additionalSection = data.additionalSections?.find(s => s.sectionName === sectionKey);
      if (additionalSection) {
        const lines = Math.ceil((additionalSection.content?.length || 0) / 60);
        return BASE_SECTION_HEIGHT + (lines * LINE_HEIGHT_MM);
      }
      return BASE_SECTION_HEIGHT;
    
    case 'roles':
      return BASE_SECTION_HEIGHT + ((data.roles?.length || 0) * 4);
    
    default:
      return BASE_SECTION_HEIGHT + LINE_HEIGHT_MM * 2;
  }
}

// Calculate smart spacing based on actual content height - ensures 1 page
function calculateSpacing(data: CVData): { spacing: number; useDistribution: boolean } {
  const A4_HEIGHT = 297; // mm
  const HEADER_HEIGHT = 80; // mm (header + name + top padding)
  const BOTTOM_SPACE = 10; // mm
  const AVAILABLE_HEIGHT = A4_HEIGHT - HEADER_HEIGHT - BOTTOM_SPACE; // ~207mm
  
  // Estimate total content height
  let totalContentHeight = 0;
  const sectionOrder: Array<{ type: string; key?: string }> = [];
  
  if (data.summary) {
    totalContentHeight += estimateSectionHeight('summary', data);
    sectionOrder.push({ type: 'summary' });
  }
  if (data.roles && data.roles.length > 0) {
    totalContentHeight += estimateSectionHeight('roles', data);
    sectionOrder.push({ type: 'roles' });
  }
  if (data.experience && data.experience.length > 0) {
    totalContentHeight += estimateSectionHeight('experience', data);
    sectionOrder.push({ type: 'experience' });
  }
  if (data.education && data.education.length > 0) {
    totalContentHeight += estimateSectionHeight('education', data);
    sectionOrder.push({ type: 'education' });
  }
  if (data.skills && data.skills.length > 0) {
    totalContentHeight += estimateSectionHeight('skills', data);
    sectionOrder.push({ type: 'skills' });
  }
  if (data.projects && data.projects.length > 0) {
    totalContentHeight += estimateSectionHeight('projects', data);
    sectionOrder.push({ type: 'projects' });
  }
  if (data.accomplishments && data.accomplishments.length > 0) {
    totalContentHeight += estimateSectionHeight('accomplishments', data);
    sectionOrder.push({ type: 'accomplishments' });
  }
  if (data.awards && data.awards.length > 0) {
    totalContentHeight += estimateSectionHeight('awards', data);
    sectionOrder.push({ type: 'awards' });
  }
  if (data.certifications && data.certifications.length > 0) {
    totalContentHeight += estimateSectionHeight('certifications', data);
    sectionOrder.push({ type: 'certifications' });
  }
  if (data.languages && data.languages.length > 0) {
    totalContentHeight += estimateSectionHeight('languages', data);
    sectionOrder.push({ type: 'languages' });
  }
  if (data.interests && data.interests.length > 0) {
    totalContentHeight += estimateSectionHeight('interests', data);
    sectionOrder.push({ type: 'interests' });
  }
  if (data.publications && data.publications.length > 0) {
    totalContentHeight += estimateSectionHeight('publications', data);
    sectionOrder.push({ type: 'publications' });
  }
  if (data.volunteerWork && data.volunteerWork.length > 0) {
    totalContentHeight += estimateSectionHeight('volunteerWork', data);
    sectionOrder.push({ type: 'volunteerWork' });
  }
  if (data.additionalSections && data.additionalSections.length > 0) {
    data.additionalSections.forEach(section => {
      totalContentHeight += estimateSectionHeight('additionalSections', data, section.sectionName);
      sectionOrder.push({ type: 'additionalSections', key: section.sectionName });
    });
  }
  
  const activeSections = sectionOrder.length;
  const gapsBetweenSections = Math.max(1, activeSections - 1);
  
  // Calculate remaining space
  const extraSpace = AVAILABLE_HEIGHT - totalContentHeight;
  
  // Calculate spacing based on remaining space
  let spacing = 15; // default minimum spacing
  let useDistribution = false;
  
  if (extraSpace < 0) {
    spacing = 8;
    useDistribution = false;
  } else if (extraSpace > 80) {
    // Previously this required activeSections < 6 to spread content across
    // the page — but supporting all 6 section groups on every template
    // (Skills & Languages, Experience, Education, Achievements, Projects &
    // More, References) means most real CVs now have 6+ active sections,
    // which silently disabled fill-the-page distribution for exactly the
    // content-rich CVs it should help most. Section count shouldn't gate
    // this — how much actual empty space there is should.
    useDistribution = true;
    spacing = Math.max(15, Math.min(55, extraSpace / gapsBetweenSections));
  } else if (extraSpace > 40) {
    useDistribution = true;
    spacing = Math.max(14, Math.min(32, extraSpace / gapsBetweenSections));
  } else if (extraSpace > 15) {
    spacing = Math.max(12, extraSpace / gapsBetweenSections);
  } else {
    spacing = 10;
  }
  
  return { spacing: Math.round(spacing), useDistribution };
}

// ==================== TEMPLATE 5: Blue Professional ====================
function renderTemplate5(data: CVData): string {
  const { 
    personalDetails, 
    education, 
    experience, 
    projects, 
    skills,
    accomplishments,
    certifications, 
    awards, 
    publications, 
    volunteerWork, 
    languages, 
    interests, 
    additionalSections
  } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional CV</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4;
            margin: 0;
        }

        body {
            font-family: 'Computer Modern', 'Latin Modern Roman', serif;
            color: #000;
            background: white;
            line-height: 1.4;
        }

        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            padding: 14mm 9mm 16mm;
        }

        .header {
            text-align: center;
            margin-bottom: 8px;
        }

        .header h1 {
            font-size: 32px;
            font-weight: 400;
            letter-spacing: 2px;
            margin-bottom: 6px;
        }

        .header .contact-info {
            font-size: 10px;
            color: #333;
        }

        .header .contact-info a {
            color: #333;
            text-decoration: none;
        }

        .section {
            margin-bottom: 26px;
        }

        .section-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
            margin-bottom: 8px;
        }

        .entry {
            margin-bottom: 12px;
        }

        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2px;
        }

        .entry-title {
            font-weight: 700;
            font-size: 11px;
        }

        .entry-date {
            font-size: 10px;
            font-style: italic;
            white-space: nowrap;
        }

        .entry-subtitle {
            font-style: italic;
            font-size: 10px;
            margin-bottom: 4px;
        }

        .entry-description {
            font-size: 10px;
            line-height: 1.4;
            margin-bottom: 2px;
        }

        .entry-list {
            list-style: none;
            padding-left: 0;
            margin-top: 4px;
        }

        .entry-list li {
            font-size: 10px;
            line-height: 1.4;
            margin-bottom: 3px;
            padding-left: 12px;
            position: relative;
        }

        .entry-list li::before {
            content: '–';
            position: absolute;
            left: 0;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 4px 8px;
            font-size: 10px;
        }

        .skill-category {
            font-weight: 700;
        }

        .skill-items {
            line-height: 1.4;
        }

        .achievements-list {
            list-style: none;
            padding-left: 0;
        }

        .achievements-list li {
            font-size: 10px;
            line-height: 1.4;
            margin-bottom: 4px;
            padding-left: 12px;
            position: relative;
        }

        .achievements-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            font-weight: bold;
        }

        .achievements-list strong {
            font-weight: 700;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .page {
                margin: 0;
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <h1>${personalDetails.name || ''}</h1>
            <div class="contact-info">
                ${personalDetails.email ? `<a href="mailto:${personalDetails.email}">${personalDetails.email}</a>` : ''}
                ${personalDetails.phone ? ` | ${personalDetails.phone}` : ''}
                ${personalDetails.location ? ` | ${personalDetails.location}` : ''}
                ${personalDetails.github ? ` | <a href="${personalDetails.github}">GitHub</a>` : ''}
                ${personalDetails.linkedin ? ` | <a href="${personalDetails.linkedin}">LinkedIn</a>` : ''}
                ${personalDetails.portfolio ? ` | <a href="${personalDetails.portfolio}">Portfolio</a>` : ''}
            </div>
        </div>

        <!-- Education -->
        ${education && education.length > 0 ? `
        <div class="section">
            <div class="section-title">Education</div>
            ${education.map(edu => `
                <div class="entry">
                    <div class="entry-header">
                        <div class="entry-title">${edu.institution || ''}</div>
                        <div class="entry-date">${edu.years || ''}</div>
                    </div>
                    <div class="entry-subtitle">${edu.degree || ''}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Experience -->
        ${experience && experience.length > 0 ? `
        <div class="section">
            <div class="section-title">Experience</div>
            ${experience.map(exp => `
                <div class="entry">
                    <div class="entry-header">
                        <div class="entry-title">${exp.role || ''}</div>
                        <div class="entry-date">${exp.years || ''}</div>
                    </div>
                    <div class="entry-subtitle">${exp.company || ''}</div>
                    ${exp.bullets && exp.bullets.length > 0 ? `
                        <ul class="entry-list">
                            ${exp.bullets.map(bullet => `<li>${htmlEscape(bullet)}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Projects -->
        ${projects && projects.length > 0 ? `
        <div class="section">
            <div class="section-title">Projects</div>
            ${projects.map(project => `
                <div class="entry">
                    <div class="entry-title">${project.title || ''}</div>
                    ${project.description ? `<div class="entry-subtitle">${htmlEscape(project.description)}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Skills -->
        ${skills && skills.length > 0 ? `
        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-list">${skills.map(s => htmlEscape(s)).join(', ')}</div>
        </div>
        ` : ''}

        <!-- Accomplishments -->
        ${accomplishments && accomplishments.length > 0 ? `
        <div class="section">
            <div class="section-title">Accomplishments</div>
            <ul class="achievements-list">
                ${accomplishments.map(accomplishment => {
                    const formattedAccomplishment = htmlEscape(accomplishment)
                        .replace(/(\d+\+?)/g, '<strong>$1</strong>')
                        .replace(/(LeetCode|Codeforces|CodeChef|AtCoder|ICPC|Meta Hacker Cup|Smart India Hackathon|SIH)/g, '<strong>$1</strong>');
                    return `<li>${formattedAccomplishment}</li>`;
                }).join('')}
            </ul>
        </div>
        ` : ''}

        <!-- Certifications -->
        ${certifications && certifications.length > 0 ? `
        <div class="section">
            <div class="section-title">Certifications</div>
            <ul class="achievements-list">
                ${certifications.map(cert => `<li><strong>${htmlEscape(cert.name)}</strong>${cert.issuer ? ` - ${htmlEscape(cert.issuer)}` : ''}${cert.year ? ` (${htmlEscape(cert.year)})` : ''}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        <!-- Awards -->
        ${awards && awards.length > 0 ? `
        <div class="section">
            <div class="section-title">Awards & Accomplishments</div>
            ${awards.map(award => `
                <div class="entry">
                    <div class="entry-title">${htmlEscape(award.title || '')}</div>
                    <div class="entry-subtitle">${award.issuer ? `${htmlEscape(award.issuer)}${award.year ? ` (${htmlEscape(award.year)})` : ''}` : award.year || ''}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Publications -->
        ${publications && publications.length > 0 ? `
        <div class="section">
            <div class="section-title">Publications</div>
            ${publications.map(pub => `
                <div class="entry">
                    <div class="entry-title">${htmlEscape(pub.title || '')}</div>
                    <div class="entry-subtitle">${pub.journal ? `${htmlEscape(pub.journal)}${pub.year ? ` (${htmlEscape(pub.year)})` : ''}` : pub.year || ''}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Volunteer Work -->
        ${volunteerWork && volunteerWork.length > 0 ? `
        <div class="section">
            <div class="section-title">Volunteer Work</div>
            ${volunteerWork.map(vol => `
                <div class="entry">
                    <div class="entry-title">${htmlEscape(vol.role || '')}</div>
                    <div class="entry-subtitle">${htmlEscape(vol.organization)}${vol.duration ? ` (${htmlEscape(vol.duration)})` : ''}</div>
                    ${vol.description ? `<div class="entry-description">${htmlEscape(vol.description)}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Languages -->
        ${languages && languages.length > 0 ? `
        <div class="section">
            <div class="section-title">Languages</div>
            <div class="entry-description">
                ${languages.map(l => htmlEscape(l)).join(', ')}
            </div>
        </div>
        ` : ''}

        <!-- Interests -->
        ${interests && interests.length > 0 ? `
        <div class="section">
            <div class="section-title">Interests</div>
            <div class="entry-description">
                ${interests.map(i => htmlEscape(i)).join(', ')}
            </div>
        </div>
        ` : ''}

        <!-- Additional Information -->
        ${additionalSections && additionalSections.length > 0 ? `
        <div class="section">
            <div class="section-title">Additional Information</div>
            <ul class="achievements-list">
                ${additionalSections.map(section => `<li><strong>${htmlEscape(section.sectionName)}:</strong> ${htmlEscape(section.content)}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        <!-- References -->
        ${data.references && data.references.length > 0 ? `
        <div class="section">
            <div class="section-title">References</div>
            <ul class="achievements-list">
                ${data.references.map(r => `<li><strong>${htmlEscape(r.name)}</strong>${r.title || r.company ? `, ${htmlEscape([r.title, r.company].filter(Boolean).join(', '))}` : ''}${r.phone || r.email ? ` — ${htmlEscape([r.phone, r.email].filter(Boolean).join(' | '))}` : ''}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
</body>
</html>`;
}

// ==================== TEMPLATE 6: Two-Column Modern Layout ====================
function renderTemplate6(data: CVData): string {
  const { 
    personalDetails, 
    summary,
    education, 
    experience, 
    projects, 
    skills,
    certifications, 
    awards, 
    publications, 
    volunteerWork, 
    languages,
    interests,
    additionalSections
  } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional CV</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4;
            margin: 0;
        }

        body {
            font-family: 'Georgia', serif;
            color: #333;
            background: white;
            line-height: 1.6;
        }

        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            padding: 10mm 6mm 12mm;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .header h1 {
            font-size: 38px;
            letter-spacing: 8px;
            font-weight: 400;
            color: #2c2c2c;
        }

        .content {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 25px;
        }

        .left-column, .right-column {
            font-size: 11px;
        }

        .section {
            margin-bottom: 32px;
        }

        .section-title {
            font-size: 15px;
            letter-spacing: 4px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #2c2c2c;
        }

        .contact-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 10px;
            font-size: 11px;
        }

        .contact-item::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            flex-shrink: 0;
        }

        .contact-item.phone::before {
            content: '📞';
        }

        .contact-item.location::before {
            content: '📍';
        }

        .contact-item.email::before {
            content: '✉';
        }

        .education-item {
            margin-bottom: 15px;
        }

        .education-title {
            font-weight: 600;
            font-size: 12px;
            margin-bottom: 3px;
        }

        .education-details {
            font-size: 10.5px;
            color: #555;
            line-height: 1.5;
        }

        .skills-list, .cert-list, .lang-list {
            list-style: none;
            padding-left: 0;
        }

        .skills-list li, .cert-list li, .lang-list li {
            margin-bottom: 8px;
            padding-left: 15px;
            position: relative;
            font-size: 10.5px;
            line-height: 1.5;
        }

        .skills-list li::before, .cert-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            font-weight: bold;
        }

        .about-text {
            font-size: 10.5px;
            text-align: justify;
            line-height: 1.6;
            color: #444;
        }

        .work-item, .project-item, .volunteer-item, .award-item, .publication-item {
            margin-bottom: 18px;
        }

        .work-title {
            font-weight: 600;
            font-size: 12px;
            margin-bottom: 2px;
        }

        .work-company {
            font-size: 10.5px;
            color: #555;
            margin-bottom: 6px;
        }

        .work-list {
            list-style: none;
            padding-left: 0;
        }

        .work-list li {
            margin-bottom: 6px;
            padding-left: 15px;
            position: relative;
            font-size: 10.5px;
            line-height: 1.5;
        }

        .work-list li::before {
            content: '•';
            position: absolute;
            left: 0;
        }

        .interests-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .interest-tag {
            background: #f0f0f0;
            padding: 4px 10px;
            border-radius: 3px;
            font-size: 10px;
        }

        .additional-info {
            font-size: 10.5px;
            line-height: 1.6;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .page {
                margin: 0;
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <h1>${personalDetails.name || ''}</h1>
        </div>

        <!-- Main Content -->
        <div class="content">
            <!-- Left Column -->
            <div class="left-column">
                <!-- Contact -->
                <div class="section">
                    <h2 class="section-title">CONTACT</h2>
                    ${personalDetails.phone ? `<div class="contact-item phone">${personalDetails.phone}</div>` : ''}
                    ${personalDetails.location ? `<div class="contact-item location">${personalDetails.location}</div>` : ''}
                    ${personalDetails.email ? `<div class="contact-item email">${personalDetails.email}</div>` : ''}
                </div>

                <!-- Education -->
                ${education && education.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">EDUCATION</h2>
                    ${education.map(edu => `
                        <div class="education-item">
                            <div class="education-title">${edu.institution || ''}</div>
                            <div class="education-details">
                                ${edu.degree || ''}<br>
                                ${edu.years || ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Skills -->
                ${skills && skills.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">SKILLS</h2>
                    <ul class="skills-list">
                        ${skills.map(skill => `<li>${htmlEscape(skill)}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <!-- Certifications -->
                ${certifications && certifications.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">CERTIFICATION</h2>
                    <ul class="cert-list">
                        ${certifications.map(cert => `<li>${htmlEscape(cert.name)}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <!-- Languages -->
                ${languages && languages.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">LANGUAGES</h2>
                    <ul class="lang-list">
                        ${languages.map(lang => `<li>${htmlEscape(lang)}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <!-- Interests -->
                ${interests && interests.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">INTERESTS</h2>
                    <div class="interests-list">
                        ${interests.map(interest => `<span class="interest-tag">${htmlEscape(interest)}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Volunteer Work -->
                ${volunteerWork && volunteerWork.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">VOLUNTEER WORK</h2>
                    ${volunteerWork.map(vol => `
                        <div class="volunteer-item">
                            <div class="work-title">${htmlEscape(vol.role || 'Volunteer')}</div>
                            <div class="work-company">${htmlEscape(vol.organization)}${vol.duration ? ` (${htmlEscape(vol.duration)})` : ''}</div>
                            ${vol.description ? `<p style="font-size: 10.5px; margin-top: 4px;">${htmlEscape(vol.description)}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Additional Information -->
                ${additionalSections && additionalSections.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">ADDITIONAL INFORMATION</h2>
                    <div class="additional-info">
                        ${additionalSections.map(section => `<p>• <strong>${htmlEscape(section.sectionName)}:</strong> ${htmlEscape(section.content)}</p>`).join('')}
                    </div>
                </div>
                ` : ''}
                <!-- References -->
                ${data.references && data.references.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">REFERENCES</h2>
                    <div class="additional-info">
                        ${data.references.map(r => `<p><strong>${htmlEscape(r.name)}</strong>${r.title || r.company ? `, ${htmlEscape([r.title, r.company].filter(Boolean).join(', '))}` : ''}${r.phone || r.email ? `<br>${htmlEscape([r.phone, r.email].filter(Boolean).join(' | '))}` : ''}</p>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Right Column -->
            <div class="right-column">
                <!-- About Me -->
                ${summary ? `
                <div class="section">
                    <h2 class="section-title">ABOUT ME</h2>
                    <p class="about-text">${htmlEscape(summary)}</p>
                </div>
                ` : ''}

                <!-- Work Experience -->
                ${experience && experience.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">WORK EXPERIENCE</h2>
                    ${experience.map(work => `
                        <div class="work-item">
                            <div class="work-title">${htmlEscape(work.role || '')}</div>
                            <div class="work-company">${htmlEscape(work.company || '')} ${work.years ? `(${htmlEscape(work.years)})` : ''}</div>
                            ${work.bullets && work.bullets.length > 0 ? `
                                <ul class="work-list">
                                    ${work.bullets.map(bullet => `<li>${htmlEscape(bullet)}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Projects -->
                ${projects && projects.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">PROJECTS</h2>
                    ${projects.map(project => `
                        <div class="project-item">
                            <div class="work-title">${htmlEscape(project.title || '')}</div>
                            <div class="work-company">${htmlEscape(project.description || '')}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Awards & Accomplishments -->
                ${awards && awards.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">AWARDS & ACCOMPLISHMENTS</h2>
                    ${awards.map(award => `
                        <div class="award-item">
                            <div class="work-title">${htmlEscape(award.title || '')}</div>
                            <div class="work-company">${award.issuer ? `${htmlEscape(award.issuer)}${award.year ? ` (${htmlEscape(award.year)})` : ''}` : award.year || ''}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Publications -->
                ${publications && publications.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">PUBLICATIONS</h2>
                    ${publications.map(pub => `
                        <div class="publication-item">
                            <div class="work-title">${htmlEscape(pub.title || '')}</div>
                            <div class="work-company">${pub.journal ? `${htmlEscape(pub.journal)}${pub.year ? ` (${htmlEscape(pub.year)})` : ''}` : pub.year || ''}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

            </div>
        </div>
    </div>
</body>
</html>`;
}

// ==================== RESPONSIVE TEMPLATES (for view mode) ====================
// Simple fallback responsive versions (you can expand these later with full responsive logic)
function renderResponsiveTemplate5(data: CVData): string {
  return renderTemplate5(data);
}

function renderResponsiveTemplate6(data: CVData): string {
  return renderTemplate6(data);
}

// Main renderer function
// ---- Templates 7-12: ported from the JobPilot mobile app's oldCVTemplateRenderers.ts ----
function renderTemplate7(data: CVData): string {
  const { personalDetails, summary, experience, education, skills, projects, accomplishments, awards, certifications, languages, interests, publications, volunteerWork, additionalSections } = data;
  
  // Calculate smart spacing based on actual content height
  const { spacing, useDistribution } = calculateSpacing(data);
  
  // Build CSS content justification property
  const contentJustify = useDistribution ? 'justify-content: space-between;' : 'justify-content: flex-start;';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Template</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 0; }
        body { font-family: 'Arial', 'Helvetica', sans-serif; background: white; margin: 0; padding: 0; }
        .page { width: 210mm; height: 297mm; max-height: 297mm; background: white; margin: 0; padding: 10mm 0 8mm; position: relative; overflow: hidden; }
        .header { text-align: center; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 3px solid #000; }
        .name { font-size: 32px; font-weight: bold; color: #000; letter-spacing: 6px; text-transform: uppercase; margin-bottom: 6px; }
        .job-title { font-size: 12px; color: #000; text-transform: uppercase; letter-spacing: 1.5px; }
        .about-contact-section { display: grid; grid-template-columns: 1fr auto; gap: 30px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 3px solid #000; align-items: start; }
        .about-me { flex: 1; }
        .contact-info { display: flex; flex-direction: column; gap: 8px; }
        .contact-item { display: flex; align-items: center; gap: 8px; font-size: 10px; }
        .main-section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
        .about-content { font-size: 10px; line-height: 1.5; text-align: justify; color: #333; }
        .two-column-layout { display: grid; grid-template-columns: 1fr 2px 2fr; gap: 20px; margin-bottom: 15px; }
        .divider { background: #000; width: 2px; }
        .left-column { padding-right: 8px; }
        .right-column { padding-left: 8px; }
        .left-column, .right-column {
            --section-spacing: ${spacing}mm;
            height: 207mm;
            max-height: 207mm;
            display: flex;
            flex-direction: column;
            ${contentJustify}
            overflow: hidden;
        }
        .section { margin-bottom: var(--section-spacing); page-break-inside: avoid; }
        .section:last-child { margin-bottom: 0; }
        .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #000; }
        .section-content { font-size: 10px; line-height: 1.4; color: #333; }
        .work-entry { margin-bottom: 14px; }
        .work-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
        .company-name { font-weight: bold; font-size: 10px; text-transform: uppercase; }
        .work-location-date { font-size: 9px; text-align: right; white-space: nowrap; margin-left: 12px; }
        .work-position { font-size: 10px; font-style: italic; margin-bottom: 6px; }
        .work-entry ul { margin-left: 16px; }
        .work-entry li { margin-bottom: 4px; font-size: 10px; line-height: 1.4; }
        .education-entry { margin-bottom: 14px; }
        .education-degree { font-weight: bold; font-size: 10px; margin-bottom: 4px; }
        .education-dates { font-size: 9px; margin-bottom: 6px; }
        .skills-list { list-style: none; padding: 0; }
        .skills-list li { padding-left: 12px; position: relative; margin-bottom: 6px; font-size: 10px; }
        .skills-list li:before { content: "•"; position: absolute; left: 0; font-weight: bold; }
        .project-entry, .cert-entry, .award-entry { margin-bottom: 6px; font-size: 10px; line-height: 1.3; }
        .project-title, .cert-name, .award-title { font-weight: bold; }
        .list-item { margin-bottom: 4px; font-size: 10px; line-height: 1.3; }
        .volunteer-entry { margin-bottom: 8px; font-size: 10px; }
        .volunteer-header { font-weight: bold; margin-bottom: 2px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="name">${personalDetails.name.toUpperCase()}</div>
            <div class="job-title">${personalDetails.title.toUpperCase()}</div>
        </div>

        <div class="about-contact-section">
            <div class="about-me">
                <div class="main-section-title">ABOUT ME</div>
                <div class="about-content">${summary}</div>
            </div>
            <div class="contact-info">
                <div class="contact-item">
                    <div>📞</div>
                    <div>${personalDetails.phone}</div>
                </div>
                <div class="contact-item">
                    <div>✉</div>
                    <div>${personalDetails.email}</div>
                </div>
                <div class="contact-item">
                    <div>📍</div>
                    <div>${personalDetails.location}</div>
                </div>
                ${personalDetails.linkedin ? `<div class="contact-item"><div>💼</div><div>${personalDetails.linkedin}</div></div>` : ''}
                ${personalDetails.github ? `<div class="contact-item"><div>🔗</div><div>${personalDetails.github}</div></div>` : ''}
                ${personalDetails.portfolio ? `<div class="contact-item"><div>🌐</div><div>${personalDetails.portfolio}</div></div>` : ''}
            </div>
        </div>

        <div class="two-column-layout">
            <div class="left-column">
                <div class="section">
                    <div class="section-title">EDUCATION</div>
                    <div class="section-content">
                        ${(education || []).map(edu => `
                            <div class="education-entry">
                                <div class="education-degree">${edu.degree}</div>
                                <div class="education-dates">${edu.years}</div>
                                <div>${edu.institution}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">SKILLS</div>
                    <div class="section-content">
                        <ul class="skills-list">
                            ${skills.map(skill => `<li>${skill}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                ${certifications && certifications.length > 0 ? `
                <div class="section">
                    <div class="section-title">CERTIFICATIONS</div>
                    <div class="section-content">
                        ${certifications.map(cert => `
                            <div class="cert-entry">
                                <span class="cert-name">${cert.name}</span>${cert.issuer ? ` – ${cert.issuer}` : ''}${cert.year ? ` (${cert.year})` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${languages && languages.length > 0 ? `
                <div class="section">
                    <div class="section-title">LANGUAGES</div>
                    <div class="section-content">
                        ${languages.join(' • ')}
                    </div>
                </div>
                ` : ''}

                ${interests && interests.length > 0 ? `
                <div class="section">
                    <div class="section-title">INTERESTS</div>
                    <div class="section-content">
                        ${interests.join(' • ')}
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="divider"></div>

            <div class="right-column">
                <div class="section">
                    <div class="section-title">WORK EXPERIENCE</div>
                    <div class="section-content">
                        ${(experience || []).map(exp => `
                            <div class="work-entry">
                                <div class="work-header">
                                    <div class="company-name">${exp.company}</div>
                                    <div class="work-location-date">${personalDetails.location}<br>${exp.years}</div>
                                </div>
                                <div class="work-position">${exp.role}</div>
                                <ul>
                                    ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${projects && projects.length > 0 ? `
                <div class="section">
                    <div class="section-title">PROJECTS</div>
                    <div class="section-content">
                        ${projects.map(proj => `
                            <div class="project-entry">
                                <span class="project-title">${proj.title}</span> – ${proj.description}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${accomplishments && accomplishments.length > 0 ? `
                <div class="section">
                    <div class="section-title">ACCOMPLISHMENTS</div>
                    <div class="section-content">
                        ${accomplishments.map(acc => `<div class="list-item">• ${acc}</div>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${awards && awards.length > 0 ? `
                <div class="section">
                    <div class="section-title">AWARDS</div>
                    <div class="section-content">
                        ${awards.map(award => `
                            <div class="award-entry">
                                <span class="award-title">${award.title}</span>${award.issuer ? ` – ${award.issuer}` : ''}${award.year ? ` (${award.year})` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${publications && publications.length > 0 ? `
                <div class="section">
                    <div class="section-title">PUBLICATIONS</div>
                    <div class="section-content">
                        ${publications.map(pub => `
                            <div class="list-item">${pub.title}${pub.journal ? ` – ${pub.journal}` : ''}${pub.year ? ` (${pub.year})` : ''}</div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${volunteerWork && volunteerWork.length > 0 ? `
                <div class="section">
                    <div class="section-title">VOLUNTEER WORK</div>
                    <div class="section-content">
                        ${volunteerWork.map(vol => `
                            <div class="volunteer-entry">
                                <div class="volunteer-header">${vol.organization}${vol.role ? ` – ${vol.role}` : ''}${vol.duration ? ` (${vol.duration})` : ''}</div>
                                ${vol.description ? `<div style="margin-top: 2px; font-size: 9px;">${vol.description}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${additionalSections && additionalSections.length > 0 ? additionalSections.map(section => `
                <div class="section">
                    <div class="section-title">${section.sectionName.toUpperCase()}</div>
                    <div class="section-content">
                        ${section.content.split('\n').map(line => `<div class="list-item">${line}</div>`).join('')}
                    </div>
                </div>
                `).join('') : ''}
                ${data.references && data.references.length > 0 ? `
                <div class="section">
                    <div class="section-title">REFERENCES</div>
                    <div class="section-content">
                        ${data.references.map(r => `<div class="list-item"><strong>${r.name}</strong>${r.title || r.company ? `, ${[r.title, r.company].filter(Boolean).join(', ')}` : ''}${r.phone || r.email ? ` — ${[r.phone, r.email].filter(Boolean).join(' | ')}` : ''}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;
}

function renderTemplate8(data: CVData): string {
  const { personalDetails, summary, experience, education, skills, projects, accomplishments, awards, certifications, languages, interests, publications, volunteerWork, additionalSections, references } = data;
  
  const nameParts = (personalDetails.name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  const contactInfo = [
    personalDetails.phone,
    personalDetails.email,
    personalDetails.location,
    personalDetails.linkedin,
    personalDetails.github
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Template</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 0; }
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            background: white;
            margin: 0;
            padding: 0;
        }
        .page {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            background: white;
            margin: 0;
            padding: 10mm 0 8mm;
            overflow: hidden;
            position: relative;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            padding-bottom: 12px;
        }
        .name-title { flex: 1; }
        .name { font-size: 32px; font-weight: normal; color: #4a4a4a; margin-bottom: 5px; }
        .first-name { font-weight: 300; color: #7a7a7a; }
        .last-name { font-weight: bold; color: #4a4a4a; }
        .name-underline { width: 200px; height: 2px; background: #4a4a4a; margin-bottom: 12px; }
        .job-title { font-size: 16px; color: #4a4a4a; font-weight: 300; font-style: italic; }
        .contact-info { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
        .contact-item { display: flex; align-items: center; gap: 10px; font-size: 11px; color: #4a4a4a; }
        .horizontal-divider { width: 100%; height: 2px; background: #5a5a5a; margin-bottom: 15px; }
        .summary-section { margin-bottom: 20px; text-align: center; }
        .summary-title { font-size: 13px; font-weight: normal; text-transform: uppercase; letter-spacing: 2px; color: #4a4a4a; margin-bottom: 10px; }
        .summary-content { font-size: 10px; line-height: 1.5; color: #4a4a4a; text-align: justify; }
        .content-wrapper {
            height: calc(297mm - 140px);
            max-height: calc(297mm - 140px);
            overflow: hidden;
            padding: 0 5mm;
        }
        .two-column-layout { 
            display: grid; 
            grid-template-columns: 1fr 3px 2fr; 
            gap: 20px;
            height: 100%;
            max-height: 100%;
        }
        .left-column, .right-column {
            overflow: hidden;
            height: 100%;
        }
        .vertical-divider { background: #5a5a5a; width: 3px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 13px; font-weight: normal; text-transform: uppercase; letter-spacing: 2px; color: #4a4a4a; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #5a5a5a; }
        .section-content { font-size: 11px; line-height: 1.6; color: #4a4a4a; }
        .work-entry, .education-entry { margin-bottom: 12px; }
        .work-role { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
        .work-company { font-size: 11px; margin-bottom: 2px; }
        .work-dates { font-size: 10px; font-style: italic; color: #666; margin-bottom: 4px; }
        .work-bullets { margin-left: 15px; font-size: 10px; line-height: 1.4; }
        .work-bullets li { margin-bottom: 3px; }
        .education-school { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
        .education-degree { font-size: 11px; margin-bottom: 2px; }
        .education-dates { font-size: 10px; font-style: italic; color: #666; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-item { font-size: 10px; padding: 4px 8px; background: #e0e0e0; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="name-title">
                <div class="name">
                    <span class="first-name">${firstName}</span> <span class="last-name">${lastName}</span>
                </div>
                <div class="name-underline"></div>
                <div class="job-title">${personalDetails.title || ''}</div>
            </div>
            <div class="contact-info">
                ${contactInfo.map(info => `<div class="contact-item">${info}</div>`).join('')}
            </div>
        </div>
        <div class="horizontal-divider"></div>
        ${summary ? `
        <div class="summary-section">
            <div class="summary-title">Professional Summary</div>
            <div class="summary-content">${summary}</div>
        </div>
        ` : ''}
        <div class="content-wrapper">
        <div class="two-column-layout">
            <div class="left-column">
                ${education && education.length > 0 ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    <div class="section-content">
                        ${education.map(edu => `
                            <div class="education-entry">
                                <div class="education-school">${edu.institution}</div>
                                <div class="education-degree">${edu.degree}</div>
                                <div class="education-dates">${edu.years}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                ${skills && skills.length > 0 ? `
                <div class="section">
                    <div class="section-title">Skills</div>
                    <div class="section-content">
                        <div class="skills-list">
                            ${skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}
                ${languages && languages.length > 0 ? `
                <div class="section">
                    <div class="section-title">Languages</div>
                    <div class="section-content">${languages.join(' • ')}</div>
                </div>
                ` : ''}
                ${(accomplishments && accomplishments.length > 0) || (awards && awards.length > 0) || (certifications && certifications.length > 0) || (publications && publications.length > 0) ? `
                <div class="section">
                    <div class="section-title">Achievements</div>
                    <div class="section-content">
                        ${(accomplishments || []).map(a => `<div style="margin-bottom: 3px;">• ${a}</div>`).join('')}
                        ${(awards || []).map(a => `<div style="margin-bottom: 3px;">• ${[a.title, a.issuer, a.year].filter(Boolean).join(', ')}</div>`).join('')}
                        ${(certifications || []).map(c => `<div style="margin-bottom: 3px;">• ${[c.name, c.issuer, c.year].filter(Boolean).join(', ')}</div>`).join('')}
                        ${(publications || []).map(p => `<div style="margin-bottom: 3px;">• ${[p.title, p.journal, p.year].filter(Boolean).join(', ')}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
                ${references && references.length > 0 ? `
                <div class="section">
                    <div class="section-title">References</div>
                    <div class="section-content">
                        ${references.map(r => `
                            <div style="margin-bottom: 8px;">
                                <div style="font-weight: bold;">${r.name}</div>
                                ${r.title || r.company ? `<div style="font-size: 10px;">${[r.title, r.company].filter(Boolean).join(', ')}</div>` : ''}
                                ${r.phone || r.email ? `<div style="font-size: 10px; color: #666;">${[r.phone, r.email].filter(Boolean).join(' | ')}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            <div class="vertical-divider"></div>
            <div class="right-column">
                ${experience && experience.length > 0 ? `
                <div class="section">
                    <div class="section-title">Experience</div>
                    <div class="section-content">
                        ${experience.map(exp => `
                            <div class="work-entry">
                                <div class="work-role">${exp.role}</div>
                                <div class="work-company">${exp.company}</div>
                                <div class="work-dates">${exp.years}</div>
                                ${exp.bullets && exp.bullets.length > 0 ? `
                                    <ul class="work-bullets">
                                        ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                                    </ul>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                ${(projects && projects.length > 0) || (volunteerWork && volunteerWork.length > 0) || (additionalSections && additionalSections.length > 0) ? `
                <div class="section">
                    <div class="section-title">Projects & More</div>
                    <div class="section-content">
                        ${(projects || []).map(proj => `
                            <div class="work-entry">
                                <div class="work-role">${proj.title}</div>
                                <div class="work-company">${proj.description}</div>
                            </div>
                        `).join('')}
                        ${(volunteerWork || []).map(v => `
                            <div class="work-entry">
                                <div class="work-role">${v.organization}${v.role ? ` — ${v.role}` : ''}</div>
                                ${v.description ? `<div class="work-company">${v.description}</div>` : ''}
                            </div>
                        `).join('')}
                        ${(additionalSections || []).map(s => `<div style="margin-bottom: 6px;"><strong>${s.sectionName}:</strong> ${s.content}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
        </div>
    </div>
</body>
</html>`;
}

function renderTemplate9(data: CVData): string {
  const { personalDetails, summary, experience, education, skills, projects, accomplishments, awards, certifications, publications, languages, volunteerWork, additionalSections, references } = data;
  
  const contactInfo = [
    personalDetails.location,
    personalDetails.phone,
    personalDetails.email,
    personalDetails.linkedin,
    personalDetails.github
  ].filter(Boolean).join(' | ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Template</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 0; }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: white;
            margin: 0;
            padding: 0;
        }
        .page {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            background: white;
            margin: 0;
            padding: 10mm 0 8mm;
            overflow: hidden;
            position: relative;
        }
        .header { margin-bottom: 15px; }
        .name { font-size: 34px; font-weight: bold; color: #2d2d2d; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .job-title { font-size: 18px; font-weight: bold; color: #2d2d2d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .contact-info { font-size: 10px; color: #2d2d2d; line-height: 1.5; margin-bottom: 15px; }
        .content-wrapper {
            height: calc(297mm - 160px);
            max-height: calc(297mm - 160px);
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0 5mm;
        }
        .section { margin-bottom: 30px; }
        .section-title-container { background: #d4d4d4; padding: 8px 15px; margin-bottom: 12px; border-radius: 20px; }
        .section-title { font-size: 12px; font-weight: bold; color: #2d2d2d; text-transform: uppercase; font-style: italic; letter-spacing: 1px; }
        .section-content { font-size: 11px; line-height: 1.5; color: #2d2d2d; }
        .work-entry, .education-entry { margin-bottom: 10px; }
        .work-role { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
        .work-company { font-size: 11px; margin-bottom: 2px; }
        .work-dates { font-size: 10px; color: #666; margin-bottom: 4px; }
        .work-bullets { margin-left: 15px; font-size: 10px; line-height: 1.4; }
        .work-bullets li { margin-bottom: 3px; }
        .education-school { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
        .education-degree { font-size: 11px; margin-bottom: 2px; }
        .education-dates { font-size: 10px; color: #666; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-item { font-size: 10px; padding: 4px 10px; background: #f0f0f0; border-radius: 15px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="name">${personalDetails.name || ''}</div>
            <div class="job-title">${personalDetails.title || ''}</div>
            <div class="contact-info">${contactInfo}</div>
        </div>
        <div class="content-wrapper">
        ${summary ? `
        <div class="section">
            <div class="section-title-container">
                <div class="section-title">Professional Summary</div>
            </div>
            <div class="section-content">${summary}</div>
        </div>
        ` : ''}
        ${experience && experience.length > 0 ? `
        <div class="section">
            <div class="section-title-container">
                <div class="section-title">Experience</div>
            </div>
            <div class="section-content">
                ${experience.map(exp => `
                    <div class="work-entry">
                        <div class="work-role">${exp.role}</div>
                        <div class="work-company">${exp.company}</div>
                        <div class="work-dates">${exp.years}</div>
                        ${exp.bullets && exp.bullets.length > 0 ? `
                            <ul class="work-bullets">
                                ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        ${education && education.length > 0 ? `
        <div class="section">
            <div class="section-title-container">
                <div class="section-title">Education</div>
            </div>
            <div class="section-content">
                ${education.map(edu => `
                    <div class="education-entry">
                        <div class="education-school">${edu.institution}</div>
                        <div class="education-degree">${edu.degree}</div>
                        <div class="education-dates">${edu.years}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        ${skills && skills.length > 0 ? `
        <div class="section">
            <div class="section-title-container">
                <div class="section-title">Skills & Languages</div>
            </div>
            <div class="section-content">
                <div class="skills-list">
                    ${skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                </div>
                ${languages && languages.length > 0 ? `<div style="margin-top: 8px; font-size: 10px; color: #555;">${languages.join(' • ')}</div>` : ''}
            </div>
        </div>
        ` : ''}
        ${(accomplishments && accomplishments.length > 0) || (awards && awards.length > 0) || (certifications && certifications.length > 0) || (publications && publications.length > 0) ? `
        <div class="section">
            <div class="section-title-container">
                <div class="section-title">Achievements</div>
            </div>
            <div class="section-content" style="font-size: 10px; line-height: 1.6;">
                ${(accomplishments || []).map(a => `<div>• ${a}</div>`).join('')}
                ${(awards || []).map(a => `<div>• ${[a.title, a.issuer, a.year].filter(Boolean).join(', ')}</div>`).join('')}
                ${(certifications || []).map(c => `<div>• ${[c.name, c.issuer, c.year].filter(Boolean).join(', ')}</div>`).join('')}
                ${(publications || []).map(p => `<div>• ${[p.title, p.journal, p.year].filter(Boolean).join(', ')}</div>`).join('')}
            </div>
        </div>
        ` : ''}
        ${(projects && projects.length > 0) || (volunteerWork && volunteerWork.length > 0) || (additionalSections && additionalSections.length > 0) ? `
        <div class="section">
            <div class="section-title-container">
                <div class="section-title">Projects & More</div>
            </div>
            <div class="section-content" style="font-size: 10px; line-height: 1.5;">
                ${(projects || []).map(p => `<div style="margin-bottom: 4px;"><strong>${p.title}</strong>${p.description ? ` — ${p.description}` : ''}</div>`).join('')}
                ${(volunteerWork || []).map(v => `<div style="margin-bottom: 4px;"><strong>${v.organization}</strong>${v.role ? ` — ${v.role}` : ''}${v.duration ? `, ${v.duration}` : ''}</div>`).join('')}
                ${(additionalSections || []).map(s => `<div style="margin-bottom: 4px;"><strong>${s.sectionName}:</strong> ${s.content}</div>`).join('')}
            </div>
        </div>
        ` : ''}
        ${references && references.length > 0 ? `
        <div class="section">
            <div class="section-title-container">
                <div class="section-title">References</div>
            </div>
            <div class="section-content" style="font-size: 10px; line-height: 1.5;">
                ${references.map(r => `<div style="margin-bottom: 4px;"><strong>${r.name}</strong>${r.title ? `, ${r.title}` : ''}${r.company ? `, ${r.company}` : ''}${r.phone || r.email ? ` — ${[r.phone, r.email].filter(Boolean).join(' | ')}` : ''}</div>`).join('')}
            </div>
        </div>
        ` : ''}
        </div>
    </div>
</body>
</html>`;
}

function renderTemplate10(data: CVData): string {
  const { personalDetails, summary, experience, education, skills, projects, accomplishments, awards, certifications, publications, languages, volunteerWork, additionalSections, references } = data;
  

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Template</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 0; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: white;
            margin: 0;
            padding: 0;
        }
        .page {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            background: white;
            margin: 0;
            padding: 10mm 5mm 12mm;
            display: grid;
            grid-template-columns: 280px 1fr;
            position: relative;
            overflow: hidden;
        }
        .top-decoration {
            position: absolute;
            top: 0;
            right: 0;
            width: 60%;
            height: 130px;
            display: flex;
        }
        .stripe { height: 100%; transform: skewX(-20deg); }
        .stripe1 { width: 35%; background: #a8b4c4; margin-left: -50px; }
        .stripe2 { width: 30%; background: #b5a589; }
        .stripe3 { width: 35%; background: #4a5f73; }
        .sidebar {
            background: white;
            padding: 55px 30px 30px 30px;
            position: relative;
            z-index: 1;
        }
        .sidebar-section { margin-bottom: 25px; }
        .sidebar-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 12px;
            color: #2d3e4a;
            letter-spacing: 1px;
        }
        .sidebar-content-text { font-size: 10px; line-height: 1.5; color: #4a4a4a; }
        .sidebar { overflow-y: auto; overflow-x: hidden; height: 100%; }
        .main-content {
            padding: 80px 20px 40px 20px;
            position: relative;
            z-index: 1;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .main-content-wrapper {
            height: calc(297mm - 140px);
            max-height: calc(297mm - 140px);
            overflow-y: auto;
            overflow-x: hidden;
        }
        .name { font-size: 36px; font-weight: bold; color: #2d3e4a; margin-bottom: 8px; }
        .job-title { font-size: 16px; color: #4a5f73; margin-bottom: 15px; }
        .section { margin-bottom: 30px; }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            color: #2d3e4a;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #4a5f73;
        }
        .section-content { font-size: 11px; line-height: 1.6; color: #4a4a4a; }
        .work-entry, .education-entry { margin-bottom: 12px; }
        .work-role { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
        .work-company { font-size: 11px; margin-bottom: 2px; }
        .work-dates { font-size: 10px; color: #666; margin-bottom: 4px; }
        .work-bullets { margin-left: 15px; font-size: 10px; line-height: 1.4; }
        .work-bullets li { margin-bottom: 3px; }
        .skill-item { display: block; margin-bottom: 4px; font-size: 10px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="top-decoration">
            <div class="stripe stripe1"></div>
            <div class="stripe stripe2"></div>
            <div class="stripe stripe3"></div>
        </div>
        <div class="sidebar">
            <div class="sidebar-section">
                <div class="sidebar-title">Contact</div>
                <div class="sidebar-content-text">
                    ${personalDetails.phone ? `<div style="margin-bottom: 5px;">${personalDetails.phone}</div>` : ''}
                    ${personalDetails.email ? `<div style="margin-bottom: 5px;">${personalDetails.email}</div>` : ''}
                    ${personalDetails.location ? `<div style="margin-bottom: 5px;">${personalDetails.location}</div>` : ''}
                    ${personalDetails.linkedin ? `<div style="margin-bottom: 5px;">${personalDetails.linkedin}</div>` : ''}
                </div>
            </div>
            ${education && education.length > 0 ? `
            <div class="sidebar-section">
                <div class="sidebar-title">Education</div>
                <div class="sidebar-content-text">
                    ${education.map(edu => `
                        <div style="margin-bottom: 12px;">
                            <div style="font-weight: bold;">${edu.degree}</div>
                            <div>${edu.institution}</div>
                            <div style="font-size: 9px; color: #666;">${edu.years}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            ${skills && skills.length > 0 ? `
            <div class="sidebar-section">
                <div class="sidebar-title">Skills & Languages</div>
                <div class="sidebar-content-text">
                    ${skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                    ${languages && languages.length > 0 ? `<div style="margin-top: 8px; font-size: 9px; color: #666;">${languages.join(' • ')}</div>` : ''}
                </div>
            </div>
            ` : ''}
            ${references && references.length > 0 ? `
            <div class="sidebar-section">
                <div class="sidebar-title">References</div>
                <div class="sidebar-content-text">
                    ${references.map(r => `
                        <div style="margin-bottom: 10px;">
                            <div style="font-weight: bold;">${r.name}</div>
                            ${r.title || r.company ? `<div>${[r.title, r.company].filter(Boolean).join(', ')}</div>` : ''}
                            ${r.phone || r.email ? `<div style="font-size: 9px; color: #666;">${[r.phone, r.email].filter(Boolean).join(' | ')}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        <div class="main-content">
            <div class="main-content-wrapper">
            <div class="name">${personalDetails.name || ''}</div>
            <div class="job-title">${personalDetails.title || ''}</div>
            ${summary ? `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="section-content">${summary}</div>
            </div>
            ` : ''}
            ${experience && experience.length > 0 ? `
            <div class="section">
                <div class="section-title">Experience</div>
                <div class="section-content">
                    ${experience.map(exp => `
                        <div class="work-entry">
                            <div class="work-role">${exp.role}</div>
                            <div class="work-company">${exp.company}</div>
                            <div class="work-dates">${exp.years}</div>
                            ${exp.bullets && exp.bullets.length > 0 ? `
                                <ul class="work-bullets">
                                    ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            ${(accomplishments && accomplishments.length > 0) || (awards && awards.length > 0) || (certifications && certifications.length > 0) || (publications && publications.length > 0) ? `
            <div class="section">
                <div class="section-title">Achievements</div>
                <div class="section-content">
                    ${(accomplishments || []).map(a => `<div style="margin-bottom: 3px;">• ${a}</div>`).join('')}
                    ${(awards || []).map(a => `<div style="margin-bottom: 3px;">• ${[a.title, a.issuer, a.year].filter(Boolean).join(', ')}</div>`).join('')}
                    ${(certifications || []).map(c => `<div style="margin-bottom: 3px;">• ${[c.name, c.issuer, c.year].filter(Boolean).join(', ')}</div>`).join('')}
                    ${(publications || []).map(p => `<div style="margin-bottom: 3px;">• ${[p.title, p.journal, p.year].filter(Boolean).join(', ')}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            ${(projects && projects.length > 0) || (volunteerWork && volunteerWork.length > 0) || (additionalSections && additionalSections.length > 0) ? `
            <div class="section">
                <div class="section-title">Projects & More</div>
                <div class="section-content">
                    ${(projects || []).map(proj => `
                        <div class="work-entry">
                            <div class="work-role">${proj.title}</div>
                            <div class="work-company">${proj.description}</div>
                        </div>
                    `).join('')}
                    ${(volunteerWork || []).map(v => `
                        <div class="work-entry">
                            <div class="work-role">${v.organization}${v.role ? ` — ${v.role}` : ''}</div>
                            ${v.description ? `<div class="work-company">${v.description}</div>` : ''}
                        </div>
                    `).join('')}
                    ${(additionalSections || []).map(s => `<div style="margin-bottom: 6px;"><strong>${s.sectionName}:</strong> ${s.content}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;
}

function renderTemplate11(data: CVData): string {
  const { personalDetails, summary, experience, education, skills, projects, accomplishments, awards, certifications, publications, languages, volunteerWork, additionalSections, references } = data;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Template</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 0; }
        body {
            font-family: 'Segoe UI', 'Open Sans', Arial, sans-serif;
            background: white;
            margin: 0;
            padding: 0;
        }
        .page {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            background: white;
            margin: 0;
            padding: 10mm 0 8mm;
            display: grid;
            grid-template-columns: 315px 1fr;
            overflow: hidden;
            position: relative;
        }
        .sidebar {
            background: #1e3d52;
            color: white;
            padding: 0 5mm;
        }
        .profile-section {
            padding: 40px 20px 30px 20px;
            text-align: center;
        }
        .name { font-size: 28px; font-weight: bold; color: white; margin-bottom: 8px; }
        .job-title { font-size: 14px; color: #a0c4d0; margin-bottom: 20px; }
        .sidebar-content { padding: 0 20px 40px 20px; overflow-y: auto; overflow-x: hidden; height: calc(297mm - 280px); max-height: calc(297mm - 280px); }
        .sidebar-section { margin-bottom: 25px; }
        .sidebar-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 12px;
            letter-spacing: 2px;
            padding-bottom: 8px;
            border-bottom: 2px solid rgba(255,255,255,0.3);
        }
        .sidebar-content-text { font-size: 11px; line-height: 1.5; }
        .sidebar { overflow-y: auto; overflow-x: hidden; height: 100%; }
        .main-content {
            padding: 50px 20px 40px 20px;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .main-content-wrapper {
            height: calc(297mm - 90px);
            max-height: calc(297mm - 90px);
            overflow-y: auto;
            overflow-x: hidden;
        }
        .section { margin-bottom: 30px; }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            color: #1e3d52;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #1e3d52;
        }
        .section-content { font-size: 11px; line-height: 1.6; color: #4a4a4a; }
        .work-entry, .education-entry { margin-bottom: 12px; }
        .work-role { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
        .work-company { font-size: 11px; margin-bottom: 2px; }
        .work-dates { font-size: 10px; color: #666; margin-bottom: 4px; }
        .work-bullets { margin-left: 15px; font-size: 10px; line-height: 1.4; }
        .work-bullets li { margin-bottom: 3px; }
        .contact-item { margin-bottom: 6px; font-size: 11px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="sidebar">
            <div class="profile-section">
                <div class="name">${personalDetails.name || ''}</div>
                <div class="job-title">${personalDetails.title || ''}</div>
            </div>
            <div class="sidebar-content">
                <div class="sidebar-section">
                    <div class="sidebar-title">Contact</div>
                    <div class="sidebar-content-text">
                        ${personalDetails.phone ? `<div class="contact-item">${personalDetails.phone}</div>` : ''}
                        ${personalDetails.email ? `<div class="contact-item">${personalDetails.email}</div>` : ''}
                        ${personalDetails.location ? `<div class="contact-item">${personalDetails.location}</div>` : ''}
                        ${personalDetails.linkedin ? `<div class="contact-item">${personalDetails.linkedin}</div>` : ''}
                    </div>
                </div>
                ${education && education.length > 0 ? `
                <div class="sidebar-section">
                    <div class="sidebar-title">Education</div>
                    <div class="sidebar-content-text">
                        ${education.map(edu => `
                            <div style="margin-bottom: 12px;">
                                <div style="font-weight: bold;">${edu.degree}</div>
                                <div>${edu.institution}</div>
                                <div style="font-size: 10px; opacity: 0.8;">${edu.years}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                ${skills && skills.length > 0 ? `
                <div class="sidebar-section">
                    <div class="sidebar-title">Skills & Languages</div>
                    <div class="sidebar-content-text">
                        ${skills.map(skill => `<div style="margin-bottom: 5px;">${skill}</div>`).join('')}
                        ${languages && languages.length > 0 ? `<div style="margin-top: 8px; font-size: 10px; opacity: 0.85;">${languages.join(' • ')}</div>` : ''}
                    </div>
                </div>
                ` : ''}
                ${references && references.length > 0 ? `
                <div class="sidebar-section">
                    <div class="sidebar-title">References</div>
                    <div class="sidebar-content-text">
                        ${references.map(r => `
                            <div style="margin-bottom: 10px;">
                                <div style="font-weight: bold;">${r.name}</div>
                                ${r.title || r.company ? `<div style="font-size: 10px;">${[r.title, r.company].filter(Boolean).join(', ')}</div>` : ''}
                                ${r.phone || r.email ? `<div style="font-size: 10px; opacity: 0.8;">${[r.phone, r.email].filter(Boolean).join(' | ')}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
        <div class="main-content">
            <div class="main-content-wrapper">
            ${summary ? `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="section-content">${summary}</div>
            </div>
            ` : ''}
            ${experience && experience.length > 0 ? `
            <div class="section">
                <div class="section-title">Experience</div>
                <div class="section-content">
                    ${experience.map(exp => `
                        <div class="work-entry">
                            <div class="work-role">${exp.role}</div>
                            <div class="work-company">${exp.company}</div>
                            <div class="work-dates">${exp.years}</div>
                            ${exp.bullets && exp.bullets.length > 0 ? `
                                <ul class="work-bullets">
                                    ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            ${(accomplishments && accomplishments.length > 0) || (awards && awards.length > 0) || (certifications && certifications.length > 0) || (publications && publications.length > 0) ? `
            <div class="section">
                <div class="section-title">Achievements</div>
                <div class="section-content">
                    ${(accomplishments || []).map(a => `<div style="margin-bottom: 3px;">• ${a}</div>`).join('')}
                    ${(awards || []).map(a => `<div style="margin-bottom: 3px;">• ${[a.title, a.issuer, a.year].filter(Boolean).join(', ')}</div>`).join('')}
                    ${(certifications || []).map(c => `<div style="margin-bottom: 3px;">• ${[c.name, c.issuer, c.year].filter(Boolean).join(', ')}</div>`).join('')}
                    ${(publications || []).map(p => `<div style="margin-bottom: 3px;">• ${[p.title, p.journal, p.year].filter(Boolean).join(', ')}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            ${(projects && projects.length > 0) || (volunteerWork && volunteerWork.length > 0) || (additionalSections && additionalSections.length > 0) ? `
            <div class="section">
                <div class="section-title">Projects & More</div>
                <div class="section-content">
                    ${(projects || []).map(proj => `
                        <div class="work-entry">
                            <div class="work-role">${proj.title}</div>
                            <div class="work-company">${proj.description}</div>
                        </div>
                    `).join('')}
                    ${(volunteerWork || []).map(v => `
                        <div class="work-entry">
                            <div class="work-role">${v.organization}${v.role ? ` — ${v.role}` : ''}</div>
                            ${v.description ? `<div class="work-company">${v.description}</div>` : ''}
                        </div>
                    `).join('')}
                    ${(additionalSections || []).map(s => `<div style="margin-bottom: 6px;"><strong>${s.sectionName}:</strong> ${s.content}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;
}

function renderTemplate12(data: CVData): string {
  const { personalDetails, summary, experience, education, skills, projects, accomplishments, awards, certifications, languages, publications, volunteerWork, additionalSections, references } = data;
  
  const nameInitials = (personalDetails.name || '').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Template</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 0; }
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            background: white;
            margin: 0;
            padding: 0;
        }
        .cv-container {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            background: white;
            margin: 0;
            padding: 10mm 0 8mm;
            overflow: hidden;
            position: relative;
        }
        .header {
            text-align: center;
            padding-bottom: 25px;
            margin-bottom: 30px;
            border-bottom: 2px solid #666;
            border-top: 2px solid #666;
            padding-top: 15px;
            position: relative;
        }
        .initials-bg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 180px;
            font-weight: bold;
            color: rgba(230, 230, 230, 0.3);
            font-style: italic;
            z-index: 0;
            letter-spacing: 10px;
        }
        .header-content { position: relative; z-index: 1; }
        .name {
            font-size: 36px;
            font-weight: 500;
            color: #4a4a4a;
            text-transform: uppercase;
            letter-spacing: 12px;
            margin-bottom: 8px;
        }
        .job-title {
            font-size: 13px;
            color: #666;
            font-weight: 400;
            letter-spacing: 3px;
            text-transform: uppercase;
        }
        .content-wrapper {
            display: grid;
            grid-template-columns: 0.7fr 1.3fr;
            gap: 25px;
            height: calc(297mm - 150px);
            max-height: calc(297mm - 150px);
            overflow: hidden;
            padding: 0 5mm;
        }
        .left-column { 
            padding-right: 10px; 
            overflow-y: auto;
            overflow-x: hidden;
            height: 100%;
        }
        .right-column { 
            overflow-y: auto;
            overflow-x: hidden;
            height: 100%;
        }
        .section { margin-bottom: 28px; }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            color: #4a4a4a;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid #ccc;
        }
        .section-content { font-size: 11px; line-height: 1.6; color: #4a4a4a; }
        .work-entry, .education-entry { margin-bottom: 12px; }
        .work-role { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
        .work-company { font-size: 11px; margin-bottom: 2px; }
        .work-dates { font-size: 10px; color: #666; margin-bottom: 4px; }
        .work-bullets { margin-left: 15px; font-size: 10px; line-height: 1.4; }
        .work-bullets li { margin-bottom: 3px; }
        .skill-item { display: block; margin-bottom: 4px; font-size: 11px; }
        .contact-item { margin-bottom: 6px; font-size: 11px; }
    </style>
</head>
<body>
    <div class="cv-container">
        <div class="header">
            <div class="initials-bg">${nameInitials}</div>
            <div class="header-content">
                <div class="name">${personalDetails.name || ''}</div>
                <div class="job-title">${personalDetails.title || ''}</div>
            </div>
        </div>
        <div class="content-wrapper">
            <div class="left-column">
                ${summary ? `
                <div class="section">
                    <div class="section-title">Summary</div>
                    <div class="section-content">${summary}</div>
                </div>
                ` : ''}
                <div class="section">
                    <div class="section-title">Contact</div>
                    <div class="section-content">
                        ${personalDetails.phone ? `<div class="contact-item">${personalDetails.phone}</div>` : ''}
                        ${personalDetails.email ? `<div class="contact-item">${personalDetails.email}</div>` : ''}
                        ${personalDetails.location ? `<div class="contact-item">${personalDetails.location}</div>` : ''}
                        ${personalDetails.linkedin ? `<div class="contact-item">${personalDetails.linkedin}</div>` : ''}
                    </div>
                </div>
                ${education && education.length > 0 ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    <div class="section-content">
                        ${education.map(edu => `
                            <div class="education-entry">
                                <div style="font-weight: bold;">${edu.degree}</div>
                                <div>${edu.institution}</div>
                                <div style="font-size: 10px; color: #666;">${edu.years}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                ${skills && skills.length > 0 ? `
                <div class="section">
                    <div class="section-title">Skills & Languages</div>
                    <div class="section-content">
                        ${skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                        ${languages && languages.length > 0 ? `<div style="margin-top: 6px; font-size: 10px; color: #666;">${languages.join(' • ')}</div>` : ''}
                    </div>
                </div>
                ` : ''}
                ${(accomplishments && accomplishments.length > 0) || (awards && awards.length > 0) || (certifications && certifications.length > 0) || (publications && publications.length > 0) ? `
                <div class="section">
                    <div class="section-title">Achievements</div>
                    <div class="section-content">
                        ${(accomplishments || []).map(a => `<div style="margin-bottom: 3px;">• ${a}</div>`).join('')}
                        ${(awards || []).map(a => `<div style="margin-bottom: 3px;">• ${[a.title, a.issuer, a.year].filter(Boolean).join(', ')}</div>`).join('')}
                        ${(certifications || []).map(c => `<div style="margin-bottom: 3px;">• ${[c.name, c.issuer, c.year].filter(Boolean).join(', ')}</div>`).join('')}
                        ${(publications || []).map(p => `<div style="margin-bottom: 3px;">• ${[p.title, p.journal, p.year].filter(Boolean).join(', ')}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
                ${references && references.length > 0 ? `
                <div class="section">
                    <div class="section-title">References</div>
                    <div class="section-content">
                        ${references.map(r => `
                            <div style="margin-bottom: 8px;">
                                <div style="font-weight: bold;">${r.name}</div>
                                ${r.title || r.company ? `<div style="font-size: 10px;">${[r.title, r.company].filter(Boolean).join(', ')}</div>` : ''}
                                ${r.phone || r.email ? `<div style="font-size: 10px; color: #666;">${[r.phone, r.email].filter(Boolean).join(' | ')}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            <div class="right-column">
                ${experience && experience.length > 0 ? `
                <div class="section">
                    <div class="section-title">Experience</div>
                    <div class="section-content">
                        ${experience.map(exp => `
                            <div class="work-entry">
                                <div class="work-role">${exp.role}</div>
                                <div class="work-company">${exp.company}</div>
                                <div class="work-dates">${exp.years}</div>
                                ${exp.bullets && exp.bullets.length > 0 ? `
                                    <ul class="work-bullets">
                                        ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                                    </ul>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                ${(projects && projects.length > 0) || (volunteerWork && volunteerWork.length > 0) || (additionalSections && additionalSections.length > 0) ? `
                <div class="section">
                    <div class="section-title">Projects & More</div>
                    <div class="section-content">
                        ${(projects || []).map(proj => `
                            <div class="work-entry">
                                <div class="work-role">${proj.title}</div>
                                <div class="work-company">${proj.description}</div>
                            </div>
                        `).join('')}
                        ${(volunteerWork || []).map(v => `
                            <div class="work-entry">
                                <div class="work-role">${v.organization}${v.role ? ` — ${v.role}` : ''}</div>
                                ${v.description ? `<div class="work-company">${v.description}</div>` : ''}
                            </div>
                        `).join('')}
                        ${(additionalSections || []).map(s => `<div style="margin-bottom: 6px;"><strong>${s.sectionName}:</strong> ${s.content}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Hard caps applied to every template, regardless of which path produced the
// data (manual form, Quick Create, Fetch My Details, or Parse). AI prompts
// already ask for these limits, but prompts can drift — this is the actual
// guarantee. Summary/skills/experience/education are capped here; nothing
// else is trimmed, so achievements/projects/etc. stay as entered.
function capCVDataForRender(data: CVData): CVData {
  const capped: CVData = { ...data };

  if (capped.summary) {
    const words = capped.summary.trim().split(/\s+/);
    if (words.length > 60) {
      capped.summary = words.slice(0, 60).join(' ').replace(/[,;:]$/, '') + '.';
    }
  }

  if (capped.skills?.length) {
    capped.skills = capped.skills.slice(0, 10);
  }

  if (capped.experience?.length) {
    capped.experience = capped.experience.slice(0, 4).map((exp) => ({
      ...exp,
      bullets: exp.bullets?.length ? exp.bullets.slice(0, 4) : exp.bullets,
    }));
  }

  if (capped.education?.length) {
    capped.education = capped.education.slice(0, 3);
  }

  return capped;
}

export function renderCVTemplate(templateId: string, rawData: CVData, mode: 'view' | 'pdf' = 'pdf'): string {
  const data = capCVDataForRender(rawData);

  if (mode === 'view') {
    switch (templateId) {
      case 'template-5': return renderResponsiveTemplate5(data);
      case 'template-6': return renderResponsiveTemplate6(data);
      // Templates 7-12 don't have a separate responsive/on-screen variant
      // (the source app used one render for both) — same function both modes.
      case 'template-7': return renderTemplate7(data);
      case 'template-8': return renderTemplate8(data);
      case 'template-9': return renderTemplate9(data);
      case 'template-10': return renderTemplate10(data);
      case 'template-11': return renderTemplate11(data);
      case 'template-12': return renderTemplate12(data);
      default: return renderResponsiveTemplate5(data);
    }
  }
  
  // PDF mode - strict 1-page enforcement
  switch (templateId) {
    case 'template-5': return renderTemplate5(data);
    case 'template-6': return renderTemplate6(data);
    case 'template-7': return renderTemplate7(data);
    case 'template-8': return renderTemplate8(data);
    case 'template-9': return renderTemplate9(data);
    case 'template-10': return renderTemplate10(data);
    case 'template-11': return renderTemplate11(data);
    case 'template-12': return renderTemplate12(data);
    default: return renderTemplate5(data);
  }
}