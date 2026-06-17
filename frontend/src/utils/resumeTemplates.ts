/**
 * resumeTemplates.ts
 * Generates print-ready HTML for PDF export via window.print()
 * 4 templates: Executive, Modern, Minimal, ATS-Pro
 */

export interface ResumeData {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  summary: string
  experience: { title: string; company: string; duration: string; description: string }[]
  education: { degree: string; institution: string; year: string }[]
  skills: string[]
  projects: { title: string; description: string; tech: string }[]
  certifications: string[]
}

export type TemplateId = 'executive' | 'modern' | 'minimal' | 'ats-pro'

// ── shared helpers ────────────────────────────────────────────────────────────

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const ul = (text: string) =>
  text
    .split(/\n|•/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => `<li>${esc(l.replace(/^[-•]\s*/, ''))}</li>`)
    .join('')

// ── EXECUTIVE template ────────────────────────────────────────────────────────
// Two-column: left sidebar (dark) + right main area

const executive = (d: ResumeData): string => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4;margin:0}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:9.5pt;color:#1a1a1a;display:flex;min-height:100vh;background:#fff}

/* LEFT SIDEBAR */
.sidebar{width:210px;min-height:100vh;background:#1c2b3a;color:#fff;padding:32px 20px;flex-shrink:0}
.sidebar h1{font-size:15pt;font-weight:700;line-height:1.2;margin-bottom:4px;color:#fff}
.sidebar .role{font-size:8.5pt;color:#93a8bc;margin-bottom:20px;font-weight:400}
.sidebar hr{border:none;border-top:1px solid #2e4458;margin:14px 0}
.sidebar h3{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#56a0d3;margin-bottom:8px}
.sidebar p,.sidebar a{font-size:8.5pt;color:#c8d8e8;line-height:1.6;word-break:break-all}
.sidebar a{text-decoration:none}
.skill-pill{display:inline-block;background:#243d52;color:#93c7e8;font-size:7.5pt;padding:3px 8px;border-radius:3px;margin:2px 2px 2px 0}
.cert-item{font-size:8pt;color:#c8d8e8;margin-bottom:4px}

/* RIGHT MAIN */
.main{flex:1;padding:32px 28px}
.section{margin-bottom:20px}
.section-title{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#1c2b3a;border-bottom:2px solid #1c2b3a;padding-bottom:3px;margin-bottom:10px}
.job-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px}
.job-title{font-size:10pt;font-weight:700;color:#1a1a1a}
.job-meta{font-size:8pt;color:#555}
.company{font-size:9pt;color:#2c6fad;font-weight:600;margin-bottom:4px}
.desc ul{padding-left:14px;margin-top:3px}
.desc li{font-size:8.5pt;color:#333;margin-bottom:2px;line-height:1.45}
.desc p{font-size:8.5pt;color:#333;line-height:1.5}
.edu-row{display:flex;justify-content:space-between;margin-bottom:6px}
.edu-degree{font-weight:600;font-size:9.5pt}
.edu-inst{font-size:8.5pt;color:#555}
.proj-title{font-weight:600;font-size:9.5pt}
.proj-tech{font-size:8pt;color:#2c6fad;margin-bottom:2px}
.summary-text{font-size:9pt;color:#333;line-height:1.6}

@media print{
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .sidebar{background:#1c2b3a!important}
}
</style></head>
<body>
<div class="sidebar">
  <h1>${esc(d.name || 'Your Name')}</h1>
  ${d.experience[0]?.title ? `<p class="role">${esc(d.experience[0].title)}</p>` : ''}
  <hr/>
  <h3>Contact</h3>
  ${d.email ? `<p>${esc(d.email)}</p>` : ''}
  ${d.phone ? `<p>${esc(d.phone)}</p>` : ''}
  ${d.location ? `<p>${esc(d.location)}</p>` : ''}
  ${d.linkedin ? `<p><a href="${esc(d.linkedin)}">${esc(d.linkedin.replace(/^https?:\/\//, ''))}</a></p>` : ''}
  ${d.skills.filter(Boolean).length ? `<hr/><h3>Skills</h3><div>${d.skills.filter(Boolean).map(s => `<span class="skill-pill">${esc(s)}</span>`).join('')}</div>` : ''}
  ${d.certifications.filter(Boolean).length ? `<hr/><h3>Certifications</h3>${d.certifications.filter(Boolean).map(c => `<p class="cert-item">${esc(c)}</p>`).join('')}` : ''}
</div>
<div class="main">
  ${d.summary ? `<div class="section"><div class="section-title">Professional Summary</div><p class="summary-text">${esc(d.summary)}</p></div>` : ''}
  ${d.experience.filter(e => e.title).length ? `
  <div class="section"><div class="section-title">Experience</div>
  ${d.experience.filter(e => e.title).map(e => `
    <div style="margin-bottom:12px">
      <div class="job-header"><span class="job-title">${esc(e.title)}</span><span class="job-meta">${esc(e.duration)}</span></div>
      <div class="company">${esc(e.company)}</div>
      ${e.description ? `<div class="desc"><ul>${ul(e.description)}</ul></div>` : ''}
    </div>`).join('')}
  </div>` : ''}
  ${d.projects.filter(p => p.title).length ? `
  <div class="section"><div class="section-title">Projects</div>
  ${d.projects.filter(p => p.title).map(p => `
    <div style="margin-bottom:10px">
      <div class="proj-title">${esc(p.title)}</div>
      ${p.tech ? `<div class="proj-tech">${esc(p.tech)}</div>` : ''}
      ${p.description ? `<div class="desc"><p>${esc(p.description)}</p></div>` : ''}
    </div>`).join('')}
  </div>` : ''}
  ${d.education.filter(e => e.degree).length ? `
  <div class="section"><div class="section-title">Education</div>
  ${d.education.filter(e => e.degree).map(e => `
    <div class="edu-row">
      <div><div class="edu-degree">${esc(e.degree)}</div><div class="edu-inst">${esc(e.institution)}</div></div>
      <div class="job-meta">${esc(e.year)}</div>
    </div>`).join('')}
  </div>` : ''}
</div>
</body></html>`

// ── MODERN template ───────────────────────────────────────────────────────────
// Single-column with orange accent line + header band

const modern = (d: ResumeData): string => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4;margin:15mm 18mm}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:9.5pt;color:#222;background:#fff;line-height:1.5}
.header{border-left:5px solid #e84e1b;padding-left:14px;margin-bottom:22px}
.header h1{font-size:20pt;font-weight:700;color:#111;letter-spacing:-0.3px}
.header .contact{font-size:8.5pt;color:#555;margin-top:4px}
.header .contact span{margin-right:14px}
.section{margin-bottom:18px}
.section-title{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:1.4px;color:#e84e1b;margin-bottom:7px;padding-bottom:3px;border-bottom:1px solid #f5c4b8}
.job-row{display:flex;justify-content:space-between;margin-bottom:1px}
.job-title{font-weight:700;font-size:10pt}
.date{font-size:8pt;color:#777}
.company{font-size:9pt;color:#444;margin-bottom:4px}
ul{padding-left:14px;margin-top:3px}
li{font-size:8.5pt;margin-bottom:2px;color:#333}
.skills{display:flex;flex-wrap:wrap;gap:5px}
.skill{background:#fff5f2;border:1px solid #f5c4b8;color:#c0392b;font-size:8pt;padding:2px 9px;border-radius:12px}
.edu-row{display:flex;justify-content:space-between}
.edu-degree{font-weight:600;font-size:9.5pt}
.edu-inst{font-size:8.5pt;color:#555}
.summary{font-size:9pt;color:#333;line-height:1.6}
.proj-title{font-weight:600;font-size:9.5pt}
.proj-tech{font-size:8pt;color:#e84e1b;margin-bottom:2px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head>
<body>
<div class="header">
  <h1>${esc(d.name || 'Your Name')}</h1>
  <div class="contact">
    ${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}
  </div>
</div>
${d.summary ? `<div class="section"><div class="section-title">Summary</div><p class="summary">${esc(d.summary)}</p></div>` : ''}
${d.skills.filter(Boolean).length ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${d.skills.filter(Boolean).map(s => `<span class="skill">${esc(s)}</span>`).join('')}</div></div>` : ''}
${d.experience.filter(e => e.title).length ? `
<div class="section"><div class="section-title">Experience</div>
${d.experience.filter(e => e.title).map(e => `
  <div style="margin-bottom:11px">
    <div class="job-row"><span class="job-title">${esc(e.title)}</span><span class="date">${esc(e.duration)}</span></div>
    <div class="company">${esc(e.company)}</div>
    ${e.description ? `<ul>${ul(e.description)}</ul>` : ''}
  </div>`).join('')}
</div>` : ''}
${d.projects.filter(p => p.title).length ? `
<div class="section"><div class="section-title">Projects</div>
${d.projects.filter(p => p.title).map(p => `
  <div style="margin-bottom:10px">
    <div class="proj-title">${esc(p.title)}</div>
    ${p.tech ? `<div class="proj-tech">${esc(p.tech)}</div>` : ''}
    ${p.description ? `<p style="font-size:8.5pt;color:#333">${esc(p.description)}</p>` : ''}
  </div>`).join('')}
</div>` : ''}
${d.education.filter(e => e.degree).length ? `
<div class="section"><div class="section-title">Education</div>
${d.education.filter(e => e.degree).map(e => `
  <div class="edu-row" style="margin-bottom:6px">
    <div><div class="edu-degree">${esc(e.degree)}</div><div class="edu-inst">${esc(e.institution)}</div></div>
    <div class="date">${esc(e.year)}</div>
  </div>`).join('')}
</div>` : ''}
${d.certifications.filter(Boolean).length ? `<div class="section"><div class="section-title">Certifications</div><ul>${d.certifications.filter(Boolean).map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>` : ''}
</body></html>`

// ── MINIMAL template ──────────────────────────────────────────────────────────

const minimal = (d: ResumeData): string => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4;margin:20mm 22mm}
body{font-family:Georgia,'Times New Roman',serif;font-size:10pt;color:#1a1a1a;background:#fff;line-height:1.6}
.header{text-align:center;border-bottom:1px solid #1a1a1a;padding-bottom:12px;margin-bottom:20px}
h1{font-size:22pt;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:#111}
.contact{font-size:8.5pt;color:#555;margin-top:6px;letter-spacing:0.3px}
.contact span{margin:0 8px}
.section{margin-bottom:18px}
.section-title{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1a1a1a;margin-bottom:8px}
.job-row{display:flex;justify-content:space-between}
.job-title{font-size:10pt;font-style:italic;font-weight:700}
.date{font-size:8.5pt;color:#666}
.company{font-size:9pt;color:#444;margin-bottom:4px}
ul{padding-left:16px;margin-top:4px}
li{font-size:9pt;margin-bottom:2px}
.skills-list{font-size:9pt;color:#333;line-height:1.8}
.edu-row{display:flex;justify-content:space-between}
.summary{font-size:9.5pt;line-height:1.7;color:#333}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head>
<body>
<div class="header">
  <h1>${esc(d.name || 'Your Name')}</h1>
  <div class="contact">
    ${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}
  </div>
</div>
${d.summary ? `<div class="section"><div class="section-title">Profile</div><p class="summary">${esc(d.summary)}</p></div>` : ''}
${d.experience.filter(e => e.title).length ? `
<div class="section"><div class="section-title">Experience</div>
${d.experience.filter(e => e.title).map(e => `
  <div style="margin-bottom:12px">
    <div class="job-row"><span class="job-title">${esc(e.title)}</span><span class="date">${esc(e.duration)}</span></div>
    <div class="company">${esc(e.company)}</div>
    ${e.description ? `<ul>${ul(e.description)}</ul>` : ''}
  </div>`).join('')}
</div>` : ''}
${d.skills.filter(Boolean).length ? `<div class="section"><div class="section-title">Skills</div><p class="skills-list">${d.skills.filter(Boolean).map(s => esc(s)).join('  ·  ')}</p></div>` : ''}
${d.education.filter(e => e.degree).length ? `
<div class="section"><div class="section-title">Education</div>
${d.education.filter(e => e.degree).map(e => `
  <div class="edu-row" style="margin-bottom:6px">
    <div><strong>${esc(e.degree)}</strong><br/><span style="font-size:9pt;color:#555">${esc(e.institution)}</span></div>
    <span class="date">${esc(e.year)}</span>
  </div>`).join('')}
</div>` : ''}
${d.projects.filter(p => p.title).length ? `
<div class="section"><div class="section-title">Projects</div>
${d.projects.filter(p => p.title).map(p => `
  <div style="margin-bottom:10px">
    <strong>${esc(p.title)}</strong>${p.tech ? ` <span style="font-size:8pt;color:#666">— ${esc(p.tech)}</span>` : ''}<br/>
    ${p.description ? `<span style="font-size:9pt;color:#444">${esc(p.description)}</span>` : ''}
  </div>`).join('')}
</div>` : ''}
${d.certifications.filter(Boolean).length ? `<div class="section"><div class="section-title">Certifications</div><p class="skills-list">${d.certifications.filter(Boolean).map(c => esc(c)).join('  ·  ')}</p></div>` : ''}
</body></html>`

// ── ATS-PRO template ──────────────────────────────────────────────────────────
// Pure text, maximum ATS compatibility

const atsPro = (d: ResumeData): string => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4;margin:16mm 20mm}
body{font-family:Arial,Helvetica,sans-serif;font-size:10pt;color:#000;background:#fff;line-height:1.55}
.header{margin-bottom:14px}
h1{font-size:18pt;font-weight:700;color:#000}
.contact{font-size:9pt;color:#333;margin-top:3px}
.contact span{margin-right:16px}
hr{border:none;border-top:1.5px solid #000;margin:10px 0}
.section-title{font-size:10pt;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;margin-top:12px}
.job-row{display:flex;justify-content:space-between}
.job-title{font-weight:700;font-size:10pt}
.date{font-size:9pt;color:#333}
.company{font-size:9.5pt;font-style:italic;color:#333;margin-bottom:3px}
ul{padding-left:16px;margin-top:2px}
li{font-size:9.5pt;margin-bottom:1.5px}
.skills-wrap{font-size:9.5pt;line-height:1.8}
.edu-row{display:flex;justify-content:space-between;margin-bottom:5px}
.summary{font-size:9.5pt;line-height:1.6}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head>
<body>
<div class="header">
  <h1>${esc(d.name || 'Your Name')}</h1>
  <div class="contact">
    ${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}
  </div>
</div>
<hr/>
${d.summary ? `<div class="section-title">Professional Summary</div><p class="summary">${esc(d.summary)}</p><hr/>` : ''}
${d.experience.filter(e => e.title).length ? `
<div class="section-title">Work Experience</div>
${d.experience.filter(e => e.title).map(e => `
  <div style="margin-bottom:10px">
    <div class="job-row"><span class="job-title">${esc(e.title)}</span><span class="date">${esc(e.duration)}</span></div>
    <div class="company">${esc(e.company)}</div>
    ${e.description ? `<ul>${ul(e.description)}</ul>` : ''}
  </div>`).join('')}
<hr/>` : ''}
${d.skills.filter(Boolean).length ? `<div class="section-title">Skills</div><p class="skills-wrap">${d.skills.filter(Boolean).map(s => esc(s)).join(' | ')}</p><hr/>` : ''}
${d.education.filter(e => e.degree).length ? `
<div class="section-title">Education</div>
${d.education.filter(e => e.degree).map(e => `
  <div class="edu-row">
    <div><strong>${esc(e.degree)}</strong><br/><span style="font-size:9pt">${esc(e.institution)}</span></div>
    <span class="date">${esc(e.year)}</span>
  </div>`).join('')}
${d.projects.filter(p => p.title).length || d.certifications.filter(Boolean).length ? '<hr/>' : ''}` : ''}
${d.projects.filter(p => p.title).length ? `
<div class="section-title">Projects</div>
${d.projects.filter(p => p.title).map(p => `
  <div style="margin-bottom:8px">
    <strong>${esc(p.title)}</strong>${p.tech ? ` | ${esc(p.tech)}` : ''}<br/>
    ${p.description ? `<span style="font-size:9pt">${esc(p.description)}</span>` : ''}
  </div>`).join('')}
${d.certifications.filter(Boolean).length ? '<hr/>' : ''}` : ''}
${d.certifications.filter(Boolean).length ? `<div class="section-title">Certifications</div><ul>${d.certifications.filter(Boolean).map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
</body></html>`

// ── Public API ────────────────────────────────────────────────────────────────

export const TEMPLATE_META: Record<TemplateId, { name: string; desc: string; ats: number; color: string }> = {
  executive: { name: 'Executive', desc: 'Two-column with dark sidebar. Professional & striking.', ats: 88, color: '#1c2b3a' },
  modern:    { name: 'Modern',    desc: 'Orange accent, single-column. Clean and contemporary.',  ats: 92, color: '#e84e1b' },
  minimal:   { name: 'Minimal',   desc: 'Serif font, centered header. Elegant and timeless.',     ats: 90, color: '#1a1a1a' },
  'ats-pro': { name: 'ATS Pro',   desc: 'Pure text, max ATS score. Best for IT/fresher roles.',   ats: 98, color: '#2563eb' },
}

export function generateResumeHTML(data: ResumeData, templateId: TemplateId): string {
  switch (templateId) {
    case 'executive': return executive(data)
    case 'modern':    return modern(data)
    case 'minimal':   return minimal(data)
    case 'ats-pro':   return atsPro(data)
    default:          return modern(data)
  }
}

/** Open a print dialog so the user can Save as PDF */
export function downloadAsPDF(data: ResumeData, templateId: TemplateId) {
  const html = generateResumeHTML(data, templateId)
  const win = window.open('', '_blank')
  if (!win) { alert('Allow pop-ups to download PDF'); return }
  win.document.write(html)
  win.document.close()
  // Wait for fonts/styles to load then print
  win.onload = () => {
    setTimeout(() => {
      win.focus()
      win.print()
      // Close after print dialog closes
      win.onafterprint = () => win.close()
    }, 400)
  }
}
