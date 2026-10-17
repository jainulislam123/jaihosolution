/**
 * AI Service for Jaiho Solution
 * Integrates with Google Gemini API when available, with rich domain-specific fallback
 * generation to guarantee zero-downtime interactive live preview.
 */

export interface AIResponse {
  html: string;
  isSimulated?: boolean;
}

export async function generateProjectBlueprint(prompt: string, mode: 'architect' | 'branding'): Promise<string> {
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';

  if (envKey) {
    try {
      const systemInstruction = mode === 'architect'
        ? `You are the Principal Solutions Architect for Jaiho Solution. Analyze the user's project idea and return a comprehensive technical proposal formatted in semantic HTML. Use <h3> for section headers, <p> for text, <ul> and <li> for lists, and <strong> for key terminology. Include: 1. Executive Architecture Summary 2. Recommended Tech Stack (Frontend, Backend, Database, AI/Cloud) 3. System Architecture & Data Flow 4. Core Milestone Roadmap (Phases 1 to 4) 5. Security & Scalability Considerations. Do not wrap in markdown backticks.`
        : `You are the Lead Brand Strategist for Jaiho Solution. Generate a modern brand identity concept based on the user's business description. Format in semantic HTML using <h3>, <p>, <ul>, <li>, and <strong>. Sections: 1. Brand Names & Etymology 2. High-impact Slogans & Taglines 3. Color Palette & Emotional Resonance 4. Target Audience & Positioning 5. Launch Campaign Concept. Do not wrap in markdown backticks.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${envKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `User request: ${prompt}` }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return cleanOutput(text);
        }
      }
    } catch {
      // Fallback cleanly below
    }
  }

  // Realistic artificial intelligence generation fallback
  await new Promise((resolve) => setTimeout(resolve, 900));
  return generateContextualFallback(prompt, mode);
}

function cleanOutput(text: string): string {
  return text
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

function generateContextualFallback(userPrompt: string, mode: 'architect' | 'branding'): string {
  const query = userPrompt.toLowerCase();
  const summaryTitle = userPrompt.length > 40 ? userPrompt.slice(0, 37) + '...' : userPrompt;

  if (mode === 'architect') {
    const isAi = query.includes('ai') || query.includes('bot') || query.includes('agent') || query.includes('smart') || query.includes('tinder') || query.includes('adopt');
    const isMobile = query.includes('app') || query.includes('mobile') || query.includes('ios') || query.includes('android');
    const isEcom = query.includes('shop') || query.includes('store') || query.includes('e-commerce') || query.includes('coffee') || query.includes('delivery');

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-bold text-slate-900 border-b border-teal-100 pb-2 mb-3">1. Executive Architecture for "${summaryTitle}"</h3>
          <p class="text-slate-600 leading-relaxed">
            Our engineering team architects <strong>"${summaryTitle}"</strong> as a resilient, high-throughput modern platform. Designed with microservices decoupling, automated horizontal scaling, and sub-100ms API latency.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-bold text-slate-900 border-b border-teal-100 pb-2 mb-3">2. Recommended Tech Stack</h3>
          <ul class="list-disc list-inside space-y-2 text-slate-700">
            <li><strong>Frontend / Client:</strong> ${isMobile ? 'React Native / Flutter with Tailwind and Reanimated' : 'Next.js 15 App Router + React 19, Tailwind CSS, Framer Motion for 60fps animations'}</li>
            <li><strong>Backend Services:</strong> Distributed Node.js / Go microservices running on containerized AWS ECS / Google Cloud Run</li>
            <li><strong>Database & Cache:</strong> PostgreSQL (Cloud SQL) with pgvector embeddings, Redis cluster for session cache & real-time messaging</li>
            <li><strong>AI / Intelligent Layer:</strong> ${isAi ? 'Gemini 2.5 Flash LLM orchestration, multimodal vision parsing, vector similarity search' : 'Automated workflow engine, predictive analytics, intelligent recommendation pipeline'}</li>
            <li><strong>DevOps & Security:</strong> Automated GitHub Actions CI/CD, Cloudflare DDoS shield, OAuth 2.0 + JWT with role-based access control (RBAC)</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-bold text-slate-900 border-b border-teal-100 pb-2 mb-3">3. Phased Implementation Roadmap</h3>
          <ul class="list-disc list-inside space-y-2 text-slate-700">
            <li><strong>Phase 1 (Sprint 1-2):</strong> Technical wireframes, database entity schemas, and core REST / GraphQL API endpoints</li>
            <li><strong>Phase 2 (Sprint 3-4):</strong> Core user experience, authentication flow, ${isEcom ? 'Stripe payment gateway integration' : 'primary business logic module'}, and interactive client interface</li>
            <li><strong>Phase 3 (Sprint 5-6):</strong> Cloud infrastructure provisioning, edge caching, analytics integration, and automated test coverage</li>
            <li><strong>Phase 4 (Sprint 7+):</strong> Production staging audit, SOC2/GDPR compliance checks, and global CDN rollout</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-bold text-slate-900 border-b border-teal-100 pb-2 mb-3">4. Next Steps with Jaiho Solution</h3>
          <p class="text-slate-600">
            Our Senior Architects in West Bengal & global dev team can commence an initial sprint prototype within 5 business days. Tap below to schedule a direct discovery consultation!
          </p>
        </div>
      </div>
    `;
  }

  // Branding mode
  return `
    <div class="space-y-6">
      <div>
        <h3 class="text-xl font-bold text-slate-900 border-b border-teal-100 pb-2 mb-3">🏷️ Brand Name Concepts</h3>
        <ul class="list-disc list-inside space-y-2 text-slate-700">
          <li><strong>NovaPulse:</strong> Represents fresh velocity, vitality, and forward-moving momentum in modern markets.</li>
          <li><strong>AuraScale:</strong> Conveys intuitive elegance, effortless expansion, and enterprise reliability.</li>
          <li><strong>SynapseCraft:</strong> Highlighting smart craftsmanship, connected ecosystems, and purposeful design.</li>
          <li><strong>VeloCore:</strong> Punchy, tech-forward, and memorable across global domains and app stores.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold text-slate-900 border-b border-teal-100 pb-2 mb-3">📢 High-Conversion Slogans</h3>
        <ul class="list-disc list-inside space-y-2 text-slate-700">
          <li><em>"Engineered for what's next."</em></li>
          <li><em>"Precision built. Future delivered."</em></li>
          <li><em>"Empowering extraordinary experiences every day."</em></li>
          <li><em>"Smart systems. Effortless results."</em></li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold text-slate-900 border-b border-teal-100 pb-2 mb-3">🎨 Visual Identity & Color Resonance</h3>
        <ul class="list-disc list-inside space-y-2 text-slate-700">
          <li><strong>Teal / Cyan (#45bdb5):</strong> Signals clarity, innovation, high intelligence, and trustworthy modern security.</li>
          <li><strong>Lime Cyber (#c6ea0f):</strong> High-voltage energy, agility, cutting-edge disruption, and modern youth appeal.</li>
          <li><strong>Deep Void Navy (#0B1120):</strong> Enterprise gravitas, solid foundation, and clean contrast for readability.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold text-slate-900 border-b border-teal-100 pb-2 mb-3">🚀 Brand Launch Strategy</h3>
        <p class="text-slate-600 leading-relaxed">
          Lead with an interactive product demo teaser, verified founder testimonials, and an invite-only early adopter beta campaign crafted by Jaiho Solution's creative studio.
        </p>
      </div>
    </div>
  `;
}
