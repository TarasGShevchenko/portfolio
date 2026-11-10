// Work history at Right and Above, newest first. Source: Taras's 2026 CV. Shown by the
// Experience section and given to the chat as facts, so keep it accurate. Personal and
// commercial projects live in lib/profile.ts (projects), not here.

export type Role = {
  start: string // 'YYYY-MM'
  end: string | null // null = present
  title: string
  company: string
  project: string
  points: string[]
  stack: string[]
}

export const experience: Role[] = [
  {
    start: '2025-11',
    end: null,
    title: 'Front-end Developer',
    company: 'Right and Above',
    project: 'Fintech dashboard for business accounts',
    points: [
      'Develop and maintain a fintech dashboard for business account management: payments, transactions, cards and other financial operations.',
    ],
    stack: ['React', 'GraphQL'],
  },
  {
    start: '2025-03',
    end: '2025-11',
    title: 'Full-stack Developer',
    company: 'Right and Above',
    project: 'Sparling Finance',
    points: [
      'Built the financial platform end to end: web app, CRM, backend and socket connector.',
      'Integrated Fireblocks, B2C2, Chainalysis and SumSub.',
      'Implemented the spot trading module with socket subscriptions to currency pairs.',
      'Set up real-time transaction processing.',
    ],
    stack: ['NestJS', 'React', 'Redux', 'RxJS', 'PostgreSQL'],
  },
  {
    start: '2025-01',
    end: '2025-03',
    title: 'Full-stack Developer',
    company: 'Right and Above',
    project: 'Netzilo VPN Manager',
    points: [
      'Built the mobile app for managing VPN connections.',
      'Supported connections to both corporate and client servers.',
    ],
    stack: ['React Native', 'Redux'],
  },
  {
    start: '2024-07',
    end: '2024-12',
    title: 'Full-stack Developer',
    company: 'Right and Above',
    project: 'BDSwiss mobile trading app',
    points: [
      'Built the mobile app for the BDSwiss trading platform.',
      'Implemented the mobile dashboard for account and trade management.',
    ],
    stack: ['React Native', 'Redux', 'GraphQL'],
  },
  {
    start: '2022-10',
    end: '2024-07',
    title: 'Full-stack Developer',
    company: 'Right and Above',
    project: 'BuyOnTrust',
    points: [
      'Developed the e-commerce solution and integrated new lending providers.',
      'Optimised the CRM system for user and order management.',
    ],
    stack: ['Next.js', 'Node.js', 'React'],
  },
  {
    start: '2021-08',
    end: '2022-10',
    title: 'Front-end Developer',
    company: 'Right and Above',
    project: 'BDSwiss web trading platform',
    points: ['Developed the web trading platform and its communication services.'],
    stack: ['React', 'Redux', 'GraphQL'],
  },
  {
    start: '2021-05',
    end: '2021-08',
    title: 'Front-end Developer (Intern)',
    company: 'Right and Above',
    project: 'Internship',
    points: ['Worked on real projects: bug fixing and front-end optimisation.'],
    stack: [],
  },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatMonth(value: string) {
  const [year, month] = value.split('-').map(Number)
  return `${MONTHS[month - 1]} ${year}`
}

export function formatPeriod(role: Role) {
  return `${formatMonth(role.start)} — ${role.end ? formatMonth(role.end) : 'Present'}`
}
