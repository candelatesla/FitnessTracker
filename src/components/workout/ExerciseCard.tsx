"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SetLogger } from "@/components/workout/SetLogger";
import { getYoutubeEmbedUrl } from "@/lib/fitness";
import type { Exercise, ExerciseLog } from "@/types";

const muscleColors: Record<string, string> = {
  "Inner thighs": "bg-accent/15 text-accent",
  "Outer thighs": "bg-cyan-500/15 text-cyan-300",
  Glutes: "bg-emerald-500/15 text-emerald-300",
  Hamstrings: "bg-orange-500/15 text-orange-300",
  Quads: "bg-blue-500/15 text-blue-300",
  Cardio: "bg-cyan-500/15 text-cyan-300",
  Core: "bg-rose-500/15 text-rose-300",
  Shoulders: "bg-violet-500/15 text-violet-300",
  Back: "bg-sky-500/15 text-sky-300",
  Chest: "bg-red-500/15 text-red-300",
  Arms: "bg-fuchsia-500/15 text-fuchsia-300",
  Recovery: "bg-emerald-500/15 text-emerald-300",
  Rest: "bg-white/10 text-white",
};

export function ExerciseCard({
  exercise,
  log,
  onChange,
}: {
  exercise: Exercise;
  log: ExerciseLog;
  onChange: (nextLog: ExerciseLog) => void;
}) {
  const embedUrl = getYoutubeEmbedUrl(exercise.youtube);
  const allSetsDone = log.setLogs.every((set) => set.completed);

  return (
    <motion.div
      animate={allSetsDone ? { scale: [1, 1.01, 1] } : { scale: 1 }}
      className={`panel p-6 ${allSetsDone ? "border-accent/50" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-4xl uppercase tracking-[0.08em] text-foreground">
            {exercise.name}
          </p>
          <p className="mt-2 text-sm text-muted">
            Target: {exercise.target} · {exercise.rest}
          </p>
          {exercise.note ? <p className="mt-1 text-sm text-muted">{exercise.note}</p> : null}
        </div>
        <div className="flex items-center gap-3">
          <Badge className={muscleColors[exercise.muscleGroup] ?? "bg-white/10 text-white"}>
            {exercise.muscleGroup}
          </Badge>
          <button
            type="button"
            onClick={() => onChange({ ...log, completed: !log.completed })}
            className={`min-h-11 rounded-2xl border px-4 text-sm ${
              log.completed
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-white/10 bg-white/[0.02] text-muted"
            }`}
          >
            {log.completed ? "Exercise complete ✓" : "Mark complete"}
          </button>
        </div>
      </div>

      {embedUrl ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <iframe
            src={embedUrl}
            title={exercise.name}
            className="aspect-video w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          {exercise.youtube ? (
            <div className="border-t border-white/10 bg-black/30 px-4 py-3 text-sm">
              <a
                href={exercise.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline underline-offset-4"
              >
                Open on YouTube
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      <SetLogger
        sets={log.setLogs}
        onChange={(index, patch) => {
          const nextSets = log.setLogs.map((set, setIndex) =>
            setIndex === index ? { ...set, ...patch } : set,
          );
          onChange({
            ...log,
            setLogs: nextSets,
            completed: nextSets.every((set) => set.completed) || log.completed,
          });
        }}
      />
    </motion.div>
  );
}
