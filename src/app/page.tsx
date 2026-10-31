import Link from "next/link";
import { BridgeArc } from "@/components/bridge-arc";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, CircleDashed, FileCheck2, Network, ShieldCheck, Sparkles, Waypoints } from "lucide-react";
export const metadata = { title: "PilotBridge — From connection to verified outcome", description: "PilotBridge turns corporate challenges into explainable startup matches, structured cross-border POCs, and evidence-backed commercial outcomes." };
const steps = [
  { n: "01", title: "Challenge", body: "A corporate problem becomes measurable requirements, with missing facts kept visible." },
  { n: "02", title: "Match", body: "Top three startups ranked on reproducible criteria, with evidence, risks and first-meeting questions." },
  { n: "03", title: "Pilot", body: "Both parties approve one charter, then execute milestones, owners, deadlines and actions." },
  { n: "04", title: "Outcome", body: "Measured results require evidence. Commercial decisions are tracked separately—never inferred." },
];
export default function LandingPage() {
  return <div className="landing">
    <header className="landing-nav"><Link href="/" className="brand"><span className="brand-mark"><Waypoints size={17}/></span>PilotBridge<span className="muted tiny" style={{fontWeight:400}}>/ ASEAN</span></Link><nav aria-label="Landing navigation"><a href="#how">How it works</a><a href="#trust">Trust</a><a href="#marketplace">Marketplace</a></nav><div className="landing-actions"><Link className="button small" href="/login">Sign in</Link><Link className="button small primary" href="/app">Open demo<ArrowRight size={13}/></Link></div></header>
    <main>
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="eyebrow">Execution infrastructure for Startup ASEAN</div>
          <h1>Introductions are easy.<br/><span>Outcomes are the hard part.</span></h1>
          <p>PilotBridge carries a corporate challenge through explainable startup matching, a jointly approved cross-border POC, and a measured result backed by evidence.</p>
          <div className="landing-cta"><Link className="button primary" href="/app">Explore the working demo<ArrowRight size={15}/></Link><a className="button" href="#how">See the workflow</a></div>
          <p className="landing-note"><CircleDashed size={12}/>Fictional data · Sign in with the demo account</p>
        </div>
        <div className="landing-panel" aria-label="Product preview">
          <div className="landing-panel-head"><span>POC workspace</span><span className="badge green"><span className="status-dot"/>On Track</span></div>
          <div className="landing-panel-body">
            <div className="landing-panel-title">Last-Mile Delivery Optimisation</div>
            <p className="tiny muted">Meridian Logistics × Routify AI · Singapore → Malaysia</p>
            <div className="landing-metrics"><div><span>Baseline</span><strong>11%</strong></div><div><span>Target</span><strong>&lt;7%</strong></div><div className="active"><span>Actual</span><strong>6.8%</strong></div></div>
            <div className="landing-flow">
              <div><Check size={11}/>Challenge approved</div>
              <div><Check size={11}/>Partner confirmed</div>
              <div><Check size={11}/>Charter approved</div>
              <div className="current"><span/>Result review</div>
            </div>
            <div className="landing-callout"><Sparkles size={14}/><div><strong>Next best action</strong><p>Verify the measurement evidence before recording the commercial decision.</p></div></div>
          </div>
        </div>
      </section>

      <section className="landing-strip" aria-label="Product principles">
        <div><strong>1</strong><span>challenge</span></div><div><strong>3</strong><span>explained matches</span></div><div><strong>2</strong><span>charter approvals</span></div><div><strong>1</strong><span>verified outcome</span></div><div className="landing-strip-note">Every introduction ends with an owner, a deadline and a measurable next step.</div>
      </section>

      <section className="landing-section landing-arc"><BridgeArc/></section>

      <section className="landing-section" id="how">
        <div className="landing-section-head"><div><div className="eyebrow">The loop</div><h2>One path from problem to proof.</h2></div><p>AI drafts. Deterministic logic controls eligibility, locks, health and reported metrics. People approve.</p></div>
        <div className="landing-steps">{steps.map(step => <div className="landing-step" key={step.n}><span>{step.n}</span><h3>{step.title}</h3><p>{step.body}</p></div>)}</div>
      </section>

      <section className="landing-section landing-ownership"><div className="landing-ownership-grid"><div><div className="eyebrow">The application owns the record</div><h2>AI drafts JSON.<br/>The workflow owns truth.</h2><p>Unknown values stay missing. Malformed output cannot mutate state. Eligibility, locks, health and reported metrics are deterministic.</p></div><div className="landing-owned"><div><span>Application-owned</span><ul><li>Eligibility and partner locks</li><li>Pipeline transitions and approvals</li><li>Deterministic health and metrics</li><li>Commercial value until reviewed</li></ul></div><div><span>AI-drafted</span><ul><li>Structured challenge extraction</li><li>Meeting notes to proposed actions</li><li>Match explanations and introductions</li><li>Result-card narrative</li></ul></div></div></div></section>

      <section className="landing-section landing-split" id="trust">
        <div><div className="eyebrow">Trust by design</div><h2>Evidence over activity.</h2><p className="landing-lede">Most ecosystem platforms stop at the introduction. PilotBridge records what happened next—and refuses to overstate it.</p>
          <ul className="landing-checklist">
            <li><ShieldCheck size={16}/><div><strong>Deterministic decisions</strong><span>Eligibility, partner locks, POC health and metrics never come from a model.</span></div></li>
            <li><BadgeCheck size={16}/><div><strong>Grounded AI</strong><span>Every generated claim is limited to supplied evidence and requires human review.</span></div></li>
            <li><FileCheck2 size={16}/><div><strong>Verified outcomes</strong><span>Completion needs measurements and evidence. Commercial success is recorded separately.</span></div></li>
          </ul>
        </div>
        <div className="landing-quote"><div className="eyebrow">The product test</div><blockquote>“Did this connection produce a verified POC and a real commercial next step?”</blockquote><p>If the answer is no, the dashboard should say so.</p></div>
      </section>

      <section className="landing-section" id="marketplace">
        <div className="landing-section-head"><div><div className="eyebrow">Ecosystem marketplace</div><h2>Fit with a purpose.</h2></div><p>Startup and investor profiles are matched on transparent criteria—then converted into a bounded first-phase POC idea.</p></div>
        <div className="landing-market">
          <div className="landing-market-card"><div className="startup-logo" style={{background:"#e8e6ff"}}>RO</div><div><strong>Routify AI</strong><span>Malaysia · Logistics intelligence</span></div><span className="badge green">Strong fit</span></div>
          <div className="landing-market-card"><div className="startup-logo" style={{background:"#dff5eb"}}>NM</div><div><strong>Nexus Mobility</strong><span>Indonesia · Mobility systems</span></div><span className="badge amber">Clarify evidence</span></div>
          <div className="landing-market-card"><div className="startup-logo" style={{background:"#fff0d9"}}>FL</div><div><strong>Fleetly</strong><span>Malaysia · Fleet operations</span></div><span className="badge">In active POC</span></div>
        </div>
        <div className="landing-market-cta"><Network size={17}/><span>Sector, stage and ticket alignment are eligibility gates. Scores indicate fit—not predicted funding.</span><Link href="/app/marketplace">Browse marketplace<ArrowUpRight size={13}/></Link></div>
      </section>

      <section className="landing-final"><div><div className="eyebrow">Startup ASEAN</div><h2>See the complete connection-to-outcome loop.</h2><p>The demo includes a corporate challenge, five fictional startups, investor matching, and a POC ready to execute.</p></div><Link className="button primary" href="/app">Open the demo<ArrowRight size={15}/></Link></section>
    </main>
    <footer className="landing-footer"><div className="brand"><span className="brand-mark"><Waypoints size={15}/></span>PilotBridge</div><p>Built for Startup ASEAN · Fictional demonstration data</p><div><Link href="/login">Sign in</Link><Link href="/app">Demo</Link></div></footer>
  </div>;
}
