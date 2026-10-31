"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";

const STAGES = ["Challenge", "Matching", "Charter", "Outcome"] as const;
const ARC_LENGTH = 546;
const IVORY = "#F7F4EE";

const emptySubscribe = () => () => {};

export function BridgeArc() {
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const shouldAnimate = mounted && !reduceMotion;

  return (
    <figure className="mx-auto w-full max-w-3xl px-2">
      <svg viewBox="0 38 640 120" role="img" className="h-auto w-full overflow-visible">
        <title>PilotBridge execution span from challenge to outcome</title>
        <defs>
          <linearGradient id="bridge-stroke" x1="48" y1="0" x2="592" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0E7C86" />
            <stop offset="100%" stopColor="#E8893A" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 64 128 H 576"
          fill="none"
          stroke="#0E7C86"
          strokeOpacity="0.3"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d="M 64 128 C 160 28 480 28 576 128"
          fill="none"
          stroke="url(#bridge-stroke)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          initial={shouldAnimate ? { strokeDashoffset: ARC_LENGTH } : false}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.35, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
        <Node cx={64} cy={128} color="#0E7C86" delay={0.05} animate={shouldAnimate} />
        <Node cx={222} cy={61} color="#0E7C86" delay={0.42} animate={shouldAnimate} waypoint />
        <Node cx={418} cy={61} color="#E8893A" delay={0.78} animate={shouldAnimate} waypoint />
        <Node cx={576} cy={128} color="#E8893A" delay={1.15} animate={shouldAnimate} pulse={shouldAnimate} />
      </svg>
      <ol className="mt-3 grid grid-cols-4 gap-x-2 text-[11px] text-navy/70 sm:text-sm">
        {STAGES.map((stage, index) => (
          <motion.li
            key={stage}
            className={`font-medium ${
              index === 0 ? "text-left text-teal" : index === STAGES.length - 1 ? "text-right text-orange" : "text-center"
            }`}
            initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + index * 0.12, duration: 0.4 }}
          >
            {stage}
          </motion.li>
        ))}
      </ol>
    </figure>
  );
}

function Node({
  cx,
  cy,
  color,
  delay,
  animate,
  waypoint = false,
  pulse = false,
}: {
  cx: number;
  cy: number;
  color: string;
  delay: number;
  animate: boolean;
  waypoint?: boolean;
  pulse?: boolean;
}) {
  const r = waypoint ? 7 : 16;

  return (
    <motion.g
      initial={animate ? { scale: 0.6, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {pulse ? (
        <motion.circle
          cx={cx}
          cy={cy}
          r={r + 2}
          fill={color}
          initial={{ opacity: 0.28, scale: 0.7 }}
          animate={{ opacity: [0.28, 0], scale: [0.7, 1.7] }}
          transition={{ delay: delay + 0.2, duration: 1.4, repeat: Infinity, repeatDelay: 1.8 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ) : null}
      {waypoint ? (
        <circle cx={cx} cy={cy} r={r} fill={IVORY} stroke={color} strokeWidth="3" />
      ) : (
        <>
          <circle cx={cx} cy={cy} r={r} fill={color} />
          <circle cx={cx} cy={cy} r={6} fill={IVORY} />
        </>
      )}
    </motion.g>
  );
}
