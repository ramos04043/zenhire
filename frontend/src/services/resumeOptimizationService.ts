/**
 * resumeOptimizationService.ts
 * Provider-independent resume optimization service.
 * Currently uses Groq via the ZenHire backend.
 * Swap provider by changing the backend endpoint — frontend code stays unchanged.
 */

import { API_BASE } from '../lib/api'

export interface OptimizeRequest {
  parsed_resume: Record<string, any>
  ats_analysis: Record<string, any>
  job_title: string
  company_name: string
  job_description: string
  job_id?: string
  resume_id?: string
  user_id?: string
}

export interface OptimizationResult {
  version_id?: number
  optimizedSummary: string
  optimizedExperience: Array<{ title: string; company: string; duration: string; description: string }>
  optimizedSkills: string[]
  addedKeywords: string[]
  missingKeywords: string[]
  atsBefore: number
  atsAfter: number
  changes: string[]
  strengths: string[]
  remainingWeaknesses: string[]
  optimizedResumeMarkdown: string
}

export interface ResumeVersionSummary {
  id: number
  company_name: string
  job_title: string
  ats_before: number
  ats_after: number
  added_keywords: string[]
  changes: string[]
  optimized_summary: string
  optimized_skills: string[]
  optimized_resume_markdown: string
  created_at: string
}

class ResumeOptimizationService {
  async optimize(req: OptimizeRequest): Promise<OptimizationResult> {
    const resp = await fetch(`${API_BASE}/optimize/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })
    const text = await resp.text()
    if (!resp.ok) {
      let detail = text
      try { detail = JSON.parse(text).detail || text } catch {}
      throw new Error(detail || `Optimization failed (${resp.status})`)
    }
    return JSON.parse(text) as OptimizationResult
  }

  async getVersions(userId: string): Promise<ResumeVersionSummary[]> {
    const resp = await fetch(`${API_BASE}/optimize/versions/${userId}`)
    if (!resp.ok) return []
    return resp.json()
  }

  async getVersion(userId: string, versionId: number): Promise<ResumeVersionSummary | null> {
    const resp = await fetch(`${API_BASE}/optimize/versions/${userId}/${versionId}`)
    if (!resp.ok) return null
    return resp.json()
  }

  async deleteVersion(userId: string, versionId: number): Promise<void> {
    await fetch(`${API_BASE}/optimize/versions/${userId}/${versionId}`, { method: 'DELETE' })
  }

  downloadMarkdown(markdown: string, filename: string) {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  downloadHTML(markdown: string, filename: string, company: string, role: string) {
    const html = markdownToResumeHTML(markdown, role, company)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.html`
    a.click()
    URL.revokeObjectURL(url)
  }
}

export const resumeOptimizationService = new ResumeOptimizationService()

// ── Proper markdown → styled HTML resume ─────────────────────────────────────

function markdownToResumeHTML(markdown: string, role: string, company: string): string {
  const lines = markdown.split('\n')
  const bodyLines: string[] = []
  let inUl = false

  const closeUl = () => { if (inUl) { bodyLines.push('</ul>'); inUl = false } }

  const inlineFormat = (text: string) =>
    text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (line.startsWith('# ')) {
      closeUl()
      bodyLines.push(`<h1>${inlineFormat(line.slice(2))}</h1>`)
    } else if (line.startsWith('## ')) {
      closeUl()
      bodyLines.push(`<h2>${inlineFormat(line.slice(3))}</h2>`)
    } else if (line.startsWith('### ')) {
      closeUl()
      bodyLines.push(`<h3>${inlineFormat(line.slice(4))}</h3>`)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inUl) { bodyLines.push('<ul>'); inUl = true }
      bodyLines.push(`<li>${inlineFormat(line.slice(2))}</li>`)
    } else if (line.trim() === '' || line.startsWith('---')) {
      closeUl()
      bodyLines.push('')
    } else {
      closeUl()
      bodyLines.push(`<p>${inlineFormat(line)}</p>`)
    }
  }
  closeUl()

  const title = role && company ? `${role} at ${company}` : role || 'Resume'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 10.5pt;
    color: #1a1a1a;
    background: #fff;
    max-width: 780px;
    margin: 36px auto;
    padding: 0 28px;
    line-height: 1.55;
  }

  /* Name / H1 */
  h1 {
    font-size: 22pt;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.3px;
    margin-bottom: 4px;
    border: none;
  }

  /* Contact line immediately after h1 */
  h1 + p {
    font-size: 9pt;
    color: #555;
    margin-bottom: 18px;
    border-bottom: 2px solid #e84e1b;
    padding-bottom: 10px;
  }

  /* Section headers */
  h2 {
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #e84e1b;
    margin: 18px 0 6px;
    padding-bottom: 3px;
    border-bottom: 1px solid #f0d0c8;
  }

  /* Job title / degree */
  h3 {
    font-size: 10.5pt;
    font-weight: 600;
    color: #111;
    margin-bottom: 1px;
    margin-top: 8px;
  }

  p {
    margin-bottom: 3px;
    color: #333;
  }

  ul {
    margin: 4px 0 4px 18px;
    padding: 0;
  }
  li {
    margin-bottom: 2px;
    color: #333;
  }

  strong { font-weight: 600; color: #111; }
  em { font-style: italic; color: #444; }
  code {
    font-family: 'Courier New', monospace;
    font-size: 9pt;
    background: #f5f5f5;
    padding: 1px 4px;
    border-radius: 3px;
    color: #c0392b;
  }

  /* Print */
  @media print {
    body { margin: 20px; padding: 0; font-size: 10pt; }
    h1 { font-size: 18pt; }
  }
</style>
</head>
<body>
${bodyLines.join('\n')}
</body>
</html>`
}

