"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BridgeArc } from "@/components/landing/bridge-arc";
import { Wordmark } from "@/components/landing/wordmark";

const PIPELINE = ["Draft", "Matching", "Partner Selected", "Charter Review", "Active", "Result Submitted", "Completed"] as const;

const WORKFLOW = [
  {
    title: "A challenge is created",
    body: "Unstructured corporate problems become a named record. Gemma can draft structured requirements from text, PDFs, and images. Nothing enters matching until a human approves them.",
  },
  {
    title: "Explainable matches, then a named partner",
    body: "The application ranks a top three with reasons and evidence gaps. Partner confirmation is blocked for unavailable startups and locked after activation.",
  },
  {
    title: "A bounded POC with both parties on the charter",
    body: "Introduction pack and charter first. Charter edits reset both approvals. Activation requires both parties. Health is Completed, then Stalled, then At Risk, then On Track.",
  },
  {
    title: "A measured result, commercial next step apart",
    body: "Result submission needs baseline, target, actual, unit, measurement period, and evidence. Commercial progression is tracked independently from technical success.",
  },
] as const;

const OWNED = [
  "Eligibility and partner locks",
  "POC pipeline and charter approvals",
  "Deterministic health and reported metrics",
  "Commercial value, left blank until reviewed",
] as const;

const DRAFTED = [
  "Structured challenge extraction",
  "Meeting notes to proposed actions",
  "Result-card narrative drafting",
] as const;

export function LandingPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-ivory text-navy">
      <header className="sticky top-0 z-20 border-b border-navy/8 bg-ivory/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" aria-label="PilotBridge home" className="shrink-0">
            <Wordmark />
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Landing">
            <Button asChild variant="ghost" className="hidden text-navy/70 hover:bg-navy/5 hover:text-navy sm:inline-flex">
              <Link href="/app/marketplace">Marketplace</Link>
            </Button>
            <Button asChild>
              <Link href="/app">
                Open the demo
                <ArrowUpRight />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 text-center sm:px-8 sm:pt-24">
          <h1 className="font-display mx-auto max-w-4xl text-[clamp(2.15rem,6vw,4.35rem)] leading-[1.05] font-medium tracking-[-0.04em] text-balance">
            From a corporate problem to a measured, evidence-backed cross-border POC.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[1.05rem] leading-7 text-navy/68 sm:text-lg">
            PilotBridge is an execution copilot for Startup ASEAN. It turns unstructured corporate challenges into explainable
            startup matches, structured proof-of-concept projects, and verified commercial outcomes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-w-44">
              <Link href="/app">
                Open the demo
                <ArrowUpRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-44 border-navy/15 bg-transparent text-navy hover:bg-navy hover:text-ivory"
            >
              <Link href="/app/marketplace">Marketplace</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8" aria-label="Execution span">
          <div className="rounded-2xl bg-teal/[0.09] px-4 py-10 sm:px-10 sm:py-14">
            <BridgeArc />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <h2 className="font-display text-2xl font-medium tracking-[-0.03em]">POC pipeline</h2>
          <ol className="mt-5 flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-1 sm:gap-y-3">
            {PIPELINE.map((stage, index) => (
              <li key={stage} className="flex items-center gap-2 text-[15px] text-navy">
                <span className="font-medium">{stage}</span>
                {index < PIPELINE.length - 1 ? (
                  <span className="hidden text-navy/30 sm:inline" aria-hidden="true">
                    →
                  </span>
                ) : null}
                {index < PIPELINE.length - 1 ? <Separator className="my-3 sm:hidden" /> : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-navy/8 bg-card">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.03em] text-balance sm:text-4xl">
                Did this connection produce a verified POC and a real commercial next step?
              </h2>
              <p className="mt-5 max-w-prose text-pretty text-navy/68">
                Ecosystem introductions usually disappear into chats and spreadsheets. PilotBridge makes every introduction end
                with a named partner, a bounded pilot, an owner, a deadline, and a measurable result.
              </p>
            </div>
            <ol className="space-y-0">
              {WORKFLOW.map((step, index) => (
                <motion.li
                  key={step.title}
                  className="border-t border-navy/10 py-6 first:border-t-0 first:pt-0"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  <p className="font-display text-lg font-medium tracking-[-0.02em]">{step.title}</p>
                  <p className="mt-2 max-w-prose text-pretty text-navy/65">{step.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-[-0.03em] sm:text-3xl">The application owns the record</h2>
            <p className="mt-3 max-w-prose text-pretty text-navy/65">
              AI drafts JSON. Deterministic application logic owns eligibility, locking, health, and reported metrics. Unknown
              values stay missing. Malformed output cannot mutate workflow state.
            </p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {OWNED.map((item) => (
                <li key={item} className="border-l-2 border-teal pl-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-medium tracking-[-0.03em] sm:text-3xl">Gemma drafts, people approve</h2>
            <p className="mt-3 max-w-prose text-pretty text-navy/65">
              Every AI path is server-side, schema-checked, and review-gated. Without a live key the demo uses an explicitly
              labelled offline extraction path.
            </p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {DRAFTED.map((item) => (
                <li key={item} className="border-l-2 border-navy/15 pl-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <div className="rounded-2xl bg-navy px-6 py-12 text-ivory sm:px-12 sm:py-16">
            <h2 className="font-display max-w-3xl text-3xl leading-tight font-medium tracking-[-0.03em] text-balance sm:text-4xl">
              Technical success never implies commercial success.
            </h2>
            <p className="mt-5 max-w-2xl text-pretty text-ivory/72">
              Commercial progression runs No Decision → Commercial Negotiation → Contract Signed or Not Proceeding. Contract
              Signed requires an explicit value, currency, and evidence reference. Signed commercial value stays blank until
              reviewed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-teal text-ivory hover:bg-teal/90">
                <Link href="/app/outcomes">
                  Outcomes
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-ivory/20 bg-transparent text-ivory hover:bg-ivory hover:text-navy">
                <Link href="/app/poc">POC workspace</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-navy/8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-navy/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="tracking-[0.14em] uppercase">ASEAN · Cross-border POC execution</p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="border-teal/25 text-teal">
              Fictional demo
            </Badge>
            <p>All seeded organisations, people, challenges, metrics, and outcomes are fictional.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
