import type { Activity } from "@/lib/types";
export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (!activities.length) return <div className="empty">No activity recorded for this POC yet.</div>;
  return <div>{activities.map(item => <div className="activity-item" key={item.id}>{item.text}<time dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleString("en-SG",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</time></div>)}</div>;
}
