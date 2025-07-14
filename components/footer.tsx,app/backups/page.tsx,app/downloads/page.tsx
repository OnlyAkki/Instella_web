components / footer.tsx
\`\`\`tsx
"use client"
\`\`\`

app/backups/page.tsx
\`\`\`tsx
// Ensure this page is rendered on the server (not statically) because it
// performs dynamic GitHub API requests.
export const dynamic = "force-dynamic"
\`\`\`

app/downloads/page.tsx
\`\`\`tsx
export const dynamic = "force-dynamic"
\`\`\`
