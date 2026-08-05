import { KpiCard, PriorityChart } from '../components/Shared';
import { computeScheduleMetrics, computePriorityStats } from '../utils/metrics';

export default function ManagerView({ allTodos }) {
  // For demonstration, we assume the manager is viewing the "Delivery" team.
  // In a real app, this would dynamically match the logged-in manager's team.
  const teamTodos = allTodos.filter(t => t.assigneeTeam === "Delivery");
  
  const openTodos = teamTodos.filter((t) => t.status.toLowerCase() !== "completed");
  const overdueTodos = teamTodos.filter((t) => t.status.toLowerCase() === "overdue" || (new Date() > t.dueDate && t.status.toLowerCase() !== "completed"));
  const completedTodos = teamTodos.filter((t) => t.status.toLowerCase() === "completed");

  const completionRate = teamTodos.length ? Math.round((completedTodos.length / teamTodos.length) * 100) : 0;
  
  const teamSched = computeScheduleMetrics(teamTodos);
  const teamPriorityStats = computePriorityStats(teamTodos);

  // Create a leaderboard by grouping tasks by Assignee ID
  const memberIds = [...new Set(teamTodos.map((t) => t.assignedTo).filter(id => id != null))];
  const leaderboard = memberIds.map((id) => {
    const memberTasks = teamTodos.filter((t) => t.assignedTo === id);
    const overdueCount = memberTasks.filter((t) => t.status.toLowerCase() === "overdue").length;
    return {
      id,
      name: memberTasks[0]?.assigneeName || `User ${id}`,
      total: memberTasks.length,
      overdue: overdueCount,
    };
  }).sort((a, b) => b.overdue - a.overdue); // Sort by most overdue first

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Team Open Tasks" value={openTodos.length} />
        <KpiCard 
          label="Completion Rate" 
          value={`${completionRate}%`} 
          tone={completionRate >= 75 ? "success" : "warning"} 
        />
        <KpiCard 
          label="Team Overdue" 
          value={overdueTodos.length} 
          tone={overdueTodos.length > 0 ? "danger" : "success"} 
        />
        <KpiCard 
          label="Avg Start Delay" 
          value={`${teamSched.avgStartDelay} days`} 
          tone={teamSched.avgStartDelay > 1 ? "warning" : "success"} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 border border-neutral-200 rounded-xl p-4 bg-white shadow-sm">
          <p className="text-sm font-semibold text-neutral-700 mb-4">Team Priorities</p>
          <PriorityChart data={teamPriorityStats} />
        </div>

        {/* Member Leaderboard */}
        <div className="col-span-1 md:col-span-2 border border-neutral-200 rounded-xl p-4 bg-white shadow-sm overflow-x-auto">
          <p className="text-sm font-semibold text-neutral-700 mb-4">Team Leaderboard</p>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-100">
                <th className="font-medium pb-2">Member</th>
                <th className="font-medium pb-2">Assigned Tasks</th>
                <th className="font-medium pb-2">Overdue</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr><td colSpan="3" className="py-4 text-center text-neutral-400">No team data available.</td></tr>
              ) : (
                leaderboard.map((m) => (
                  <tr key={m.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="py-3 font-medium text-neutral-800">{m.name}</td>
                    <td className="py-3 text-neutral-600">{m.total}</td>
                    <td className="py-3 font-semibold" style={{ color: m.overdue > 0 ? "#a32d2d" : "#27500a" }}>
                      {m.overdue}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}