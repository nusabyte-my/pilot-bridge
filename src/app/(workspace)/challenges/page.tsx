import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, CircleDashed, FileStack } from "lucide-react";
import { ChallengeCreator } from "@/components/challenge-creator";
import { Pair } from "@/components/identity";
import { calculateHealth, nextBestAction } from "@/lib/health";
import { getData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function ChallengesPage() {
  const data = getData();
  const active = data.challenges.filter((c) => c.status !== "Completed").length;
  const completed = data.pocs.filter((p) => p.status === "Completed").length;

  return (
    <>
      <div className="breadcrumb">
        Startup ASEAN <span style={{ margin: "0 8px" }}>/</span> Challenges
      </div>
      <div className="page-heading">
        <div>
          <h1>Good morning, Aisha.</h1>
          <p className="subtitle">Move every introduction towards a clear, measurable next step.</p>
        </div>
        <ChallengeCreator />
      </div>
      <section className="stats" aria-label="Challenge summary">
        <div className="stat">
          <div className="stat-label">Active challenges</div>
          <div className="stat-value">{active}</div>
          <div className="stat-note">Across the corporate pipeline</div>
        </div>
        <div className="stat">
          <div className="stat-label">Curated startups</div>
          <div className="stat-value">{data.startups.length}</div>
          <div className="stat-note">Across 5 ASEAN countries</div>
        </div>
        <div className="stat">
          <div className="stat-label">Active POCs</div>
          <div className="stat-value">{data.pocs.filter((p) => ["Active", "ResultSubmitted"].includes(p.status)).length}</div>
          <div className="stat-note">Execution and outcome review</div>
        </div>
        <div className="stat">
          <div className="stat-label">Verified outcomes</div>
          <div className="stat-value">{completed}</div>
          <div className="stat-note">Measured, reviewed POCs</div>
        </div>
      </section>
      <section className="card">
        <div className="card-header">
          <div>
            <h2>Challenge pipeline</h2>
            <p className="subtitle">Requirements, ownership and POC execution in one view.</p>
          </div>
          <span className="badge">{data.challenges.length} challenges</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Corporate challenge</th>
                <th>POC partner</th>
                <th>Stage</th>
                <th>Next best action</th>
                <th>
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.challenges.map((challenge) => {
                const poc = data.pocs.find((p) => p.challengeId === challenge.id)!;
                const startup = data.startups.find((s) => s.id === poc.startupId);
                const health = calculateHealth(poc, data.milestones);
                return (
                  <tr key={challenge.id}>
                    <td>
                      <Link href={`/challenges/${challenge.id}`} className="who">
                        <Pair
                          left={{ initials: "ML", color: "#dff5eb", name: "Meridian Logistics" }}
                          right={startup ? { initials: startup.initials, color: startup.color, name: startup.name } : null}
                        />
                        <span>
                          <strong>{challenge.title}</strong>
                          <span className="tiny muted" style={{ display: "block", marginTop: 4 }}>
                            Meridian Logistics · {challenge.country}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td>{startup ? startup.name : <span className="muted">Not selected</span>}</td>
                    <td>
                      <span className={`badge ${health === "At Risk" ? "amber" : health === "Stalled" ? "red" : challenge.status === "Completed" ? "green" : ""}`}>
                        {poc.status === "Active" || poc.status === "ResultSubmitted" ? health : challenge.status}
                      </span>
                    </td>
                    <td className="next">{nextBestAction(poc, data.milestones)}</td>
                    <td>
                      <Link className="icon-button" aria-label={`Open ${challenge.title}`} href={`/challenges/${challenge.id}`}>
                        <ArrowUpRight size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <div className="dashboard-lower">
        <section className="card">
          <div className="card-header">
            <div>
              <h2>Execution signals</h2>
              <p className="subtitle">Where a programme manager can unblock progress.</p>
            </div>
            <FileStack size={18} color="var(--green)" />
          </div>
          <div className="card-body">
            {data.pocs
              .filter((p) => p.startupId)
              .map((poc) => {
                const challenge = data.challenges.find((c) => c.id === poc.challengeId)!;
                return (
                  <Link href={`/poc?id=${poc.id}`} className="signal-row" key={poc.id}>
                    <div>
                      <h3>{challenge.title}</h3>
                      <p className="tiny muted" style={{ marginTop: 5 }}>
                        {nextBestAction(poc, data.milestones)}
                      </p>
                    </div>
                    <ArrowRight size={15} />
                  </Link>
                );
              })}
            {!data.pocs.some((p) => p.startupId) && <div className="empty">Confirm a partner to begin tracking POC execution.</div>}
          </div>
        </section>
        <section className="next-action">
          <h2>Connection to outcome</h2>
          <p>
            {completed
              ? `${completed} POC${completed === 1 ? " has" : "s have"} verified results ready for ecosystem reporting.`
              : "Complete a measured result and evidence review to publish your first ecosystem outcome."}
          </p>
          <Link href="/outcomes" className="button">
            View ecosystem outcomes
            <ArrowUpRight size={14} />
          </Link>
          <hr className="divider" />
          <div className="check-row">
            <CheckCircle2 size={14} color="var(--green)" />
            Deterministic health and eligibility
          </div>
          <div className="check-row">
            <CircleDashed size={14} color="var(--green)" />
            Evidence before reported impact
          </div>
        </section>
      </div>
    </>
  );
}
