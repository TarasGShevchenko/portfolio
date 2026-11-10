// What Taras is focused on now. Each area is backed by something real ("proof"), so the
// section never claims more than the work shows. Shown by the Current focus section and
// given to the chat.

export const focus = {
  // The middle part is highlighted with the accent.
  headline: ['Right now: bringing ', 'AI', ' into real products, not just demos.'],
  intro:
    'By day I build a fintech dashboard at Right and Above with React and GraphQL. The rest of my focus goes to AI: LLM features that hold up in production, and AI agents as part of how I write code.',
  areas: [
    {
      title: 'LLM features in products',
      text: 'Streaming chat interfaces, structured outputs and tool calling, wired into real backends and UIs.',
      proof: 'The chat on this site streams answers from an open model on Groq.',
    },
    {
      title: 'Answers you can trust',
      text: 'Keeping models on the facts: grounding in your own data, guardrails, and checking answers before users see them.',
      proof:
        'This site’s chat answers only from my CV; when it made up details in testing, I tightened the grounding.',
    },
    {
      title: 'Reliable and affordable AI',
      text: 'Rate limits, caching and graceful fallbacks, so a feature keeps working when a model is slow or out of quota.',
      proof:
        'The chat runs on a free tier, with per-visitor limits and prepared answers when the quota runs out.',
    },
    {
      title: 'AI-assisted engineering',
      text: 'Agentic coding tools in the daily workflow, with the judgement to review, test and own what they produce.',
      proof: 'This portfolio and drillingbud.com.ua were built with an AI-assisted workflow.',
    },
  ],
  next: 'Exploring next: retrieval over vector search (RAG) and automated evals for LLM features.',
}
