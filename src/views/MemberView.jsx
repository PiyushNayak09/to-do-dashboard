import { KpiCard, PriorityBadge, PriorityChart } from '../components/Shared';
import { computeScheduleMetrics, computePriorityStats } from '../utils/metrics';

export default function MemberView({ allTodos }) {
  // In a real app with auth, you'd filter by the logged-in user's ID.
  // For this demo, we'll assume we want to view a specific user's metrics (e.g., ID 1)
  const myTodos = allTodos.filter(t => t.assignedTo === 1); 
  
  const openTodos = myTodos.filter((t) => t.status.toLowerCase() !== "completed");
  const overdueTodos = myTodos.filter((t) => t.status.toLowerCase() === "overdue" || (new Date() > t.dueDate && t.status.toLowerCase() !== "completed"));
  
  const sched = computeScheduleMetrics(myTodos);
  const priorityStats = computePriorityStats(myTodos);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Assigned" value={myTodos.length} />
        <KpiCard label="Open Tasks" value={openTodos.length} />
        <KpiCard 
          label="On-Time Start Rate" 
          value={`${sched.onTimeStartPct}%`} 
          tone={sched.onTimeStartPct >= 80 ? "success" : sched.onTimeStartPct >= 60 ? "warning" : "danger"} 
        />
        <KpiCard 
          label="Tasks Overdue" 
          value={overdueTodos.length} 
          tone={overdueTodos.length > 0 ? "danger" : "success"} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 border border-neutral-200 rounded-xl p-4 bg-white shadow-sm">
          <p className="text-sm font-semibold text-neutral-700 mb-4">My Tasks by Priority</p>
          <PriorityChart data={priorityStats} />
        </div>

        {/* Task Data Table */}
        <div className="col-span-1 md:col-span-2 border border-neutral-200 rounded-xl p-4 bg-white shadow-sm overflow-x-auto">
          <p className="text-sm font-semibold text-neutral-700 mb-4">Current Open Tasks</p>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-100">
                <th className="font-medium pb-2">Title</th>
                <th className="font-medium pb-2">Priority</th>
                <th className="font-medium pb-2">Due Date</th>
                <th className="font-medium pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {openTodos.length === 0 ? (
                <tr><td colSpan="4" className="py-4 text-center text-neutral-400">No open tasks right now.</td></tr>
              ) : (
                openTodos.slice(0, 5).map((t) => (
                  <tr key={t.todoId} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="py-3 font-medium text-neutral-800">{t.todoTitle}</td>
                    <td className="py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="py-3 text-neutral-600">{t.dueDate.toLocaleDateString()}</td>
                    <td className="py-3 capitalize text-neutral-600">{t.status.replace('_', ' ')}</td>
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