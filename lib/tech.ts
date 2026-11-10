// Technologies Taras works with: the GitHub profile's tech stack plus the CV (React Native,
// RxJS) and this site (Tailwind CSS). Go is left out: it's listed as "learning".
// Used by the tech marquee, the Who I am stats and the chat.

export const tech = {
  frontend: [
    'TypeScript',
    'JavaScript',
    'React',
    'React Native',
    'Next.js',
    'Redux',
    'RxJS',
    'Tailwind CSS',
    'Material UI',
    'Styled Components',
    'Bootstrap',
    'Sass',
    'HTML',
    'CSS',
  ],
  backend: ['Node.js', 'NestJS', 'Express', 'GraphQL'],
  databases: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'RabbitMQ'],
  devops: ['AWS', 'Docker', 'Nginx', 'Heroku', 'Bash'],
  testing: ['Jest', 'Cypress'],
  tools: ['Git', 'GitHub', 'GitLab', 'Figma', 'Zapier'],
}

export const allTech = Object.values(tech).flat()
