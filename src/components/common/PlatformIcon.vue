<template>
  <span
    class="inline-flex items-center justify-center shrink-0 transition-transform duration-200 select-none"
    :class="[sizeClass, { 'hover:scale-110': interactive }]"
    :title="title || computedTitle"
  >
    <!-- 1. JIRA -->
    <svg v-if="normalizedName === 'jira'" viewBox="0 0 24 24" class="w-full h-full">
      <path fill="#2684FF" d="M11.53 2c0 2.4-1.95 4.35-4.35 4.35H4.83v2.35c0 2.4-1.95 4.35-4.35 4.35H0V2h11.53z" />
      <path fill="#0052CC" d="M16.24 6.71c0 2.4-1.95 4.35-4.35 4.35H9.54v2.35c0 2.4-1.95 4.35-4.35 4.35H4.71V6.71h11.53z" />
      <path fill="#003884" d="M20.95 11.42c0 2.4-1.95 4.35-4.35 4.35h-2.35v2.35c0 2.4-1.95 4.35-4.35 4.35H9.42v-11.05h11.53z" />
    </svg>

    <!-- 2. CONFLUENCE -->
    <svg v-else-if="normalizedName === 'confluence'" viewBox="0 0 24 24" class="w-full h-full">
      <path fill="#172B4D" d="M2.08 17.58c-.68 1.15-.35 2.64.76 3.39l3.52 2.37a2.53 2.53 0 0 0 3.52-.76l4.08-6.95a12.92 12.92 0 0 1-7.8-1.02l-4.08 2.97z" />
      <path fill="#0052CC" d="M21.92 6.42a2.53 2.53 0 0 0-.76-3.39L17.64.66a2.53 2.53 0 0 0-3.52.76l-4.08 6.95c2.9.27 5.6 1.49 7.8 3.48l4.08-5.43z" />
    </svg>

    <!-- 3. FIGMA -->
    <svg v-else-if="normalizedName === 'figma'" viewBox="0 0 24 24" class="w-full h-full">
      <path fill="#F24E1E" d="M8 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4V2H8z" />
      <path fill="#0ACF83" d="M8 10a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4v-4H8z" />
      <path fill="#1ABCFE" d="M8 18a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4v-4H8z" />
      <path fill="#FF7262" d="M12 2h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-4V2z" />
      <path fill="#A259FF" d="M12 10h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-4v-8z" />
    </svg>

    <!-- 4. MIRO -->
    <svg v-else-if="normalizedName === 'miro'" viewBox="0 0 24 24" class="w-full h-full">
      <rect width="24" height="24" rx="5" fill="#FFD02F" />
      <path fill="#050038" d="M17.4 5.3l-2.7 4.7 3.3 8.7h-3.3l-2.4-6.3-1.6 2.8v3.5H7.7V5.3h3v4.6l3.4-4.6h3.3z" />
    </svg>

    <!-- 5. POSTMAN -->
    <svg v-else-if="normalizedName === 'postman'" viewBox="0 0 24 24" class="w-full h-full">
      <circle cx="12" cy="12" r="11" fill="#FF6C37" />
      <path fill="#FFFFFF" d="M18.8 11.2c-.2-.6-.6-1-1.2-1.3l-5.3-2.6c-.7-.3-1.5-.2-2 .3l-4 4c-.5.5-.6 1.3-.3 1.9l2.6 5.3c.3.6.8 1 1.4 1.1.2 0 .4 0 .6-.1l6-3.2c.7-.4 1.1-1.1 1.1-1.9v-2.3c.7-.3 1.1-.9 1.1-1.2zm-6.2 3.6l-2-4.1 2.3-2.3 4.4 2.2-4.7 4.2z" />
    </svg>

    <!-- 6. SQL SERVER / MS SQL -->
    <svg v-else-if="normalizedName === 'sqlserver' || normalizedName === 'sql'" viewBox="0 0 24 24" class="w-full h-full">
      <path fill="#CC292B" d="M12 3C6.48 3 2 4.34 2 6v12c0 1.66 4.48 3 10 3s10-1.34 10-3V6c0-1.66-4.48-3-10-3z" />
      <path fill="#E65355" d="M12 5c4.97 0 8 1.12 8 2s-3.03 2-8 2-8-1.12-8-2 3.03-2 8-2z" />
      <path fill="#991F21" d="M12 11c4.97 0 8 1.12 8 2s-3.03 2-8 2-8-1.12-8-2 3.03-2 8-2z" />
      <path fill="#FFFFFF" opacity="0.9" d="M8.5 7.5h7v1.5h-7zm0 6h7v1.5h-7z" />
    </svg>

    <!-- 7. POSTGRESQL -->
    <svg v-else-if="normalizedName === 'postgres' || normalizedName === 'postgresql'" viewBox="0 0 24 24" class="w-full h-full">
      <path fill="#336791" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.65 14.8c-.85.35-1.95.45-2.85.25-.65-.15-1.25-.45-1.7-.85-.35-.35-.6-.75-.75-1.2-.15-.45-.2-.95-.15-1.45.05-.5.2-.95.45-1.35.25-.4.6-.75 1-.95.45-.25.95-.4 1.45-.4.55 0 1.1.1 1.6.3.55.2 1.05.5 1.45.9.4.4.7.85.9 1.4.2.55.25 1.1.15 1.65-.1.55-.35 1.05-.75 1.45-.4.35-.9.65-1.4.8z" />
      <path fill="#FFFFFF" d="M11.5 8c-1.38 0-2.5 1.12-2.5 2.5 0 .69.28 1.32.73 1.77.45.45 1.08.73 1.77.73s1.32-.28 1.77-.73C13.72 11.82 14 11.19 14 10.5 14 9.12 12.88 8 11.5 8z" />
    </svg>

    <!-- 8. DOCKER -->
    <svg v-else-if="normalizedName === 'docker'" viewBox="0 0 24 24" class="w-full h-full">
      <path fill="#2496ED" d="M22.95 10.54c-.38-.28-1.27-.42-2.31-.22-.32-.67-.84-1.23-1.51-1.63l-.4-.24-.25.4c-.45.71-.58 1.62-.39 2.52-.61.34-1.4.52-2.28.52H2.33c-.3 1.34.02 2.76.88 3.96 1.15 1.6 3.01 2.55 4.98 2.55 6.09 0 10.84-3.52 12.39-8.5.83.05 1.83-.17 2.37-.86z" />
      <path fill="#2496ED" d="M7.78 9.38H5.66v2.12h2.12V9.38zm2.66 0H8.32v2.12h2.12V9.38zm2.66 0H11v2.12h2.12V9.38zm2.66 0h-2.12v2.12h2.12V9.38zm-5.32-2.66H8.32v2.12h2.12V6.72zm2.66 0H11v2.12h2.12V6.72zm2.66 0h-2.12v2.12h2.12V6.72zm-2.66-2.66H11v2.12h2.12V4.06z" />
    </svg>

    <!-- 9. SWAGGER / OPENAPI -->
    <svg v-else-if="normalizedName === 'swagger' || normalizedName === 'openapi'" viewBox="0 0 24 24" class="w-full h-full">
      <circle cx="12" cy="12" r="11" fill="#85EA2D" />
      <path fill="#173647" d="M12 5.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm1.5 9.8c-1.8 0-3.3-.8-3.3-2.1h1.7c0 .5.7.8 1.6.8.9 0 1.5-.4 1.5-.9 0-.6-.5-.8-1.5-1-1.6-.3-2.8-.7-2.8-2.1 0-1.2 1.1-2 2.7-2 1.6 0 2.9.7 3.1 1.9h-1.7c-.1-.4-.6-.7-1.4-.7-.8 0-1.3.3-1.3.8 0 .5.4.7 1.4.9 1.7.3 2.9.7 2.9 2.2 0 1.4-1.2 2.2-2.9 2.2z" />
    </svg>

    <!-- 10. POWER BI -->
    <svg v-else-if="normalizedName === 'powerbi'" viewBox="0 0 24 24" class="w-full h-full">
      <rect width="24" height="24" rx="5" fill="#EAA700" />
      <rect x="5" y="12" width="3" height="8" rx="1.5" fill="#FFFFFF" opacity="0.8" />
      <rect x="10.5" y="8" width="3" height="12" rx="1.5" fill="#FFFFFF" opacity="0.9" />
      <rect x="16" y="4" width="3" height="16" rx="1.5" fill="#FFFFFF" />
    </svg>

    <!-- 11. GITHUB -->
    <svg v-else-if="normalizedName === 'github'" viewBox="0 0 24 24" class="w-full h-full fill-current">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>

    <!-- 12. LINKEDIN -->
    <svg v-else-if="normalizedName === 'linkedin'" viewBox="0 0 24 24" class="w-full h-full">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path fill="#FFFFFF" d="M7.1 9.3H4.7V19h2.4V9.3zM5.9 5.8c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4zM19.3 13.5c0-2.7-1.4-4-3.4-4-1.6 0-2.3.9-2.7 1.5V9.3h-2.4c.03.7 0 9.7 0 9.7h2.4v-5.4c0-.3 0-.6.1-.8.2-.6.8-1.3 1.7-1.3 1.2 0 1.7.9 1.7 2.3V19h2.4v-5.5z" />
    </svg>

    <!-- 13. .NET CORE / C# -->
    <svg v-else-if="normalizedName === 'dotnet' || normalizedName === 'csharp'" viewBox="0 0 24 24" class="w-full h-full">
      <path fill="#512BD4" d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
      <path fill="#FFFFFF" d="M8.5 15.5H6.8l-1.6-4.5v4.5H4V8.5h1.7l1.6 4.5V8.5h1.2v7zm5.5 0h-3.8V8.5H14v1.2h-2.6v2.2h2.4v1.2h-2.4v1.2H14v1.2zm5.5-5.8h-1.8v5.8h-1.2V9.7h-1.8V8.5H19.5v1.2z" />
    </svg>

    <!-- 14. DRAW.IO -->
    <svg v-else-if="normalizedName === 'drawio' || normalizedName === 'visio'" viewBox="0 0 24 24" class="w-full h-full">
      <rect width="24" height="24" rx="5" fill="#F08705" />
      <circle cx="8" cy="8" r="2.5" fill="#FFFFFF" />
      <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" />
      <circle cx="16" cy="8" r="2.5" fill="#FFFFFF" />
      <path stroke="#FFFFFF" stroke-width="1.8" d="M8 8h8v8" fill="none" />
    </svg>

    <!-- 15. DAPPER / DATABASE -->
    <svg v-else-if="normalizedName === 'dapper' || normalizedName === 'database'" viewBox="0 0 24 24" class="w-full h-full">
      <path fill="#A78BFA" d="M12 3C7.58 3 4 4.34 4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6c0-1.66-3.58-3-8-3zm0 2c3.87 0 6 1.05 6 1.5S15.87 8 12 8 6 6.95 6 6.5 8.13 5 12 5zm0 5c3.87 0 6 1.05 6 1.5s-2.13 1.5-6 1.5-6-1.05-6-1.5 2.13-1.5 6-1.5zm0 5c3.87 0 6 1.05 6 1.5s-2.13 1.5-6 1.5-6-1.05-6-1.5 2.13-1.5 6-1.5z" />
    </svg>

    <!-- 16. BPMN / WORKFLOW -->
    <svg v-else-if="normalizedName === 'bpmn' || normalizedName === 'workflow'" viewBox="0 0 24 24" class="w-full h-full">
      <rect x="2" y="7" width="6" height="10" rx="2" fill="#8B5CF6" />
      <rect x="16" y="7" width="6" height="10" rx="2" fill="#A78BFA" />
      <path d="M8 12h8m-3-3l3 3-3 3" stroke="#C4B5FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </svg>

    <!-- 17. REST API / CONTRACT -->
    <svg v-else-if="normalizedName === 'api' || normalizedName === 'rest'" viewBox="0 0 24 24" class="w-full h-full">
      <circle cx="6" cy="12" r="3" fill="#38BDF8" />
      <circle cx="18" cy="12" r="3" fill="#38BDF8" />
      <path d="M9 12h6" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M12 9v6" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" fill="none" />
    </svg>

    <!-- 18. ERD / SCHEMA -->
    <svg v-else-if="normalizedName === 'erd' || normalizedName === 'schema'" viewBox="0 0 24 24" class="w-full h-full">
      <rect x="3" y="4" width="8" height="6" rx="1.5" fill="#10B981" />
      <rect x="13" y="14" width="8" height="6" rx="1.5" fill="#34D399" />
      <path d="M11 7h4a2 2 0 0 1 2 2v5" stroke="#10B981" stroke-width="2" fill="none" />
    </svg>

    <!-- 19. UAT / QUALITY ASSURANCE -->
    <svg v-else-if="normalizedName === 'uat' || normalizedName === 'qa'" viewBox="0 0 24 24" class="w-full h-full">
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#10B981" />
      <path d="M9 11.5l2 2 4-4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </svg>

    <!-- 20. PRD / BRD / DOCUMENT -->
    <svg v-else-if="normalizedName === 'prd' || normalizedName === 'brd' || normalizedName === 'doc'" viewBox="0 0 24 24" class="w-full h-full">
      <rect x="4" y="2" width="16" height="20" rx="3" fill="#6366F1" />
      <path d="M8 7h8M8 11h8M8 15h5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </svg>

    <!-- DEFAULT FALLBACK (Rendered only if not onlyKnown) -->
    <svg v-else-if="!onlyKnown" viewBox="0 0 24 24" class="w-full h-full fill-current text-violet-400">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md', // xs, sm, md, lg, xl
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
  },
  interactive: {
    type: Boolean,
    default: false
  },
  onlyKnown: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const knownPlatforms = [
  'jira', 'confluence', 'figma', 'miro', 'postman', 'sqlserver', 'sql',
  'postgres', 'postgresql', 'docker', 'swagger', 'openapi', 'powerbi',
  'github', 'git', 'linkedin', 'dotnet', 'csharp', 'drawio', 'visio',
  'dapper', 'database', 'bpmn', 'workflow', 'api', 'rest', 'erd', 'schema',
  'uat', 'qa', 'prd', 'brd', 'doc'
]

const normalizedName = computed(() => {
  const n = (props.name || '').toLowerCase().trim()
  if (n.includes('jira')) return 'jira'
  if (n.includes('confluence')) return 'confluence'
  if (n.includes('figma')) return 'figma'
  if (n.includes('miro')) return 'miro'
  if (n.includes('postman')) return 'postman'
  if (n.includes('sql server') || n.includes('mssql') || n.includes('ssms')) return 'sqlserver'
  if (n.includes('postgres')) return 'postgres'
  if (n.includes('docker')) return 'docker'
  if (n.includes('swagger') || n.includes('openapi')) return 'swagger'
  if (n.includes('powerbi') || n.includes('power bi')) return 'powerbi'
  if (n.includes('github') || n.includes('git')) return 'github'
  if (n.includes('linkedin')) return 'linkedin'
  if (n.includes('.net') || n.includes('c#') || n.includes('csharp')) return 'dotnet'
  if (n.includes('draw.io') || n.includes('visio')) return 'drawio'
  if (n.includes('dapper')) return 'dapper'
  if (n.includes('bpmn')) return 'bpmn'
  if (n.includes('api') || n.includes('rest')) return 'api'
  if (n.includes('erd') || n.includes('schema')) return 'erd'
  if (n.includes('uat') || n.includes('test')) return 'uat'
  if (n.includes('prd') || n.includes('brd')) return 'prd'
  if (n.includes('sql') || n.includes('db')) return 'sql'
  return n
})

const isKnown = computed(() => knownPlatforms.includes(normalizedName.value))

const computedTitle = computed(() => {
  const map = {
    jira: 'Atlassian Jira (Backlog & Agile Delivery)',
    confluence: 'Atlassian Confluence (BRD/PRD Documentation)',
    figma: 'Figma (UI/UX & Wireframing)',
    miro: 'Miro (Process Mapping & Brainstorming)',
    postman: 'Postman (API Contract Testing)',
    sqlserver: 'Microsoft SQL Server (Schema & Query Optimization)',
    postgres: 'PostgreSQL (Relational Data Modeling)',
    docker: 'Docker (Containerized Workflows)',
    swagger: 'Swagger / OpenAPI (API Specifications)',
    powerbi: 'Power BI (Telemetry & KPI Dashboards)',
    github: 'GitHub (Version Control & CI/CD)',
    linkedin: 'LinkedIn Professional Profile',
    dotnet: '.NET 8 / C# (Backend Logic Architecture)',
    drawio: 'Draw.io / Visio (BPMN 2.0 & Architecture)',
    dapper: 'Dapper ORM (High Performance Data Access)'
  }
  return map[normalizedName.value] || props.name
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-3.5 h-3.5'
    case 'sm': return 'w-4 h-4'
    case 'lg': return 'w-6 h-6'
    case 'xl': return 'w-8 h-8'
    case 'md':
    default:
      return 'w-5 h-5'
  }
})
</script>
