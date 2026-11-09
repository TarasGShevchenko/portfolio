import type { CSSProperties } from "react";
import { cacheLife } from "next/cache";
import { env, isProduction } from "@/lib/env";

// Stagger index for the draw-in animation (see .draft in globals.css).
const step = (i: number) => ({ "--i": i }) as CSSProperties;

function Wireframe() {
  return (
    <svg
      viewBox="0 0 480 400"
      className="draft h-auto w-full max-w-[560px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      role="img"
      aria-label="Sketch of a landing page: navigation, headline, call-to-action button, image and three feature blocks"
    >
      {/* Dimension line */}
      <g className="text-muted">
        <line x1="20" y1="14" x2="460" y2="14" pathLength={1} style={step(0)} />
        <line x1="20" y1="8" x2="20" y2="20" pathLength={1} style={step(0)} />
        <line x1="460" y1="8" x2="460" y2="20" pathLength={1} style={step(0)} />
        <text
          className="note"
          x="240"
          y="10"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="11"
          style={step(1)}
        >
          1440
        </text>
      </g>

      <g className="text-line">
        {/* Browser frame */}
        <rect x="20" y="30" width="440" height="350" rx="10" pathLength={1} style={step(1)} />
        <line x1="20" y1="58" x2="460" y2="58" pathLength={1} style={step(2)} />

        {/* Navigation */}
        <rect x="44" y="78" width="54" height="14" rx="3" pathLength={1} style={step(3)} />
        <line x1="300" y1="85" x2="330" y2="85" pathLength={1} style={step(3)} />
        <line x1="346" y1="85" x2="376" y2="85" pathLength={1} style={step(4)} />
        <line x1="392" y1="85" x2="436" y2="85" pathLength={1} style={step(4)} />

        {/* Headline and copy */}
        <line x1="44" y1="132" x2="252" y2="132" strokeWidth={9} pathLength={1} style={step(5)} />
        <line x1="44" y1="152" x2="210" y2="152" strokeWidth={9} pathLength={1} style={step(6)} />
        <line x1="44" y1="178" x2="240" y2="178" pathLength={1} style={step(7)} />
        <line x1="44" y1="190" x2="200" y2="190" pathLength={1} style={step(7)} />

        {/* Hero image */}
        <rect x="290" y="114" width="146" height="120" rx="4" pathLength={1} style={step(6)} />
        <line x1="290" y1="114" x2="436" y2="234" pathLength={1} style={step(8)} />
        <line x1="436" y1="114" x2="290" y2="234" pathLength={1} style={step(8)} />

        {/* Feature blocks */}
        <rect x="44" y="266" width="120" height="86" rx="4" pathLength={1} style={step(9)} />
        <rect x="180" y="266" width="120" height="86" rx="4" pathLength={1} style={step(10)} />
        <rect x="316" y="266" width="120" height="86" rx="4" pathLength={1} style={step(11)} />
      </g>

      {/* Call to action: the one element that matters on any landing page */}
      <rect
        className="text-signal"
        x="44"
        y="210"
        width="96"
        height="28"
        rx="14"
        strokeWidth={2}
        pathLength={1}
        style={step(12)}
      />
    </svg>
  );
}

// Cached so the page can still be prerendered; refreshes daily, so the year rolls over on its own.
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function Home() {
  const year = await currentYear();

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 grid-rows-[auto_1fr_auto] gap-10 px-4 py-6 sm:px-8 sm:py-8">
      <header className="flex items-center justify-between gap-4">
        <span className="text-lg font-semibold tracking-tight">starg.shop</span>
        {!isProduction && (
          <span
            className="rounded-full border border-signal px-3 py-1 text-sm text-signal"
            title="Deployment environment"
          >
            {env.appEnv}
          </span>
        )}
      </header>

      <main className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <h1
            className="text-[clamp(4.25rem,14vw,9.5rem)] leading-[0.84] font-extrabold tracking-[-0.012em]"
            style={{ fontVariationSettings: "'wdth' 75, 'opsz' 96" }}
          >
            Coming soon.
          </h1>
          <p className="max-w-[36ch] text-lg leading-relaxed text-line/85 sm:text-xl">
            Landing pages built for companies, and the portfolio of the person who builds them. The
            site is still on the drawing board.
          </p>
          {env.contactEmail && (
            <p className="text-lg">
              Need a landing page now?{" "}
              <a
                href={`mailto:${env.contactEmail}`}
                className="underline decoration-signal decoration-2 underline-offset-4 hover:text-signal"
              >
                Write to {env.contactEmail}
              </a>
            </p>
          )}
        </div>

        <div className="flex justify-center lg:justify-end">
          <Wireframe />
        </div>
      </main>

      <footer className="text-sm text-muted">© {year} Taras Shevchenko</footer>
    </div>
  );
}
