export function avgDays(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function fmtSigned(n, suffix = "") {
  const rounded = Math.round(n * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded}${suffix}`;
}

export function computeScheduleMetrics(todos) {
  const started = todos.filter((t) => t.actualStartDate);
  const finished = todos.filter((t) => t.actualEndDate);

  const onTimeStart = started.filter((t) => t.actualStartDate <= t.startDate).length;
  const onTimeStartPct = started.length ? Math.round((onTimeStart / started.length) * 100) : 0;

  const startDelays = started.map((t) => Math.max(0, Math.round((t.actualStartDate - t.startDate) / 86400000)));
  const avgStartDelay = avgDays(startDelays);

  const completionDelays = finished.map((t) => Math.round((t.actualEndDate - t.dueDate) / 86400000));
  const avgCompletionDelay = avgDays(completionDelays);

  return { onTimeStartPct, avgStartDelay, avgCompletionDelay };
}

export function computePriorityStats(todos) {
  const priorities = ["Urgent", "High", "Medium", "Low"];
  return priorities.map((p) => {
    const subset = todos.filter((t) => t.priority === p);
    const completed = subset.filter((t) => t.status.toLowerCase() === "completed").length;
    const rate = subset.length ? Math.round((completed / subset.length) * 100) : 0;
    return { priority: p, total: subset.length, completed, rate };
  });
}