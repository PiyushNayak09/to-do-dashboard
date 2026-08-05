import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { KpiCard, PriorityChart } from '../components/Shared';
import { computeScheduleMetrics, computePriorityStats } from '../utils/metrics';

export default function AdminView({ allTodos }) {
  const openTodos = allTodos.filter((t) => t.status.toLowerCase() !== "completed");
  const overdueTodos = allTodos.filter((t) => t.status.toLowerCase() === "overdue" || (new Date() > t.dueDate && t.status.toLowerCase() !== "completed"));
  const completedTodos = allTodos.filter((t) => t.status.toLowerCase() === "completed");

  const completionRate = allTodos.length ? Math.round((completedTodos.length / allTodos.length) * 100) : 0;
  
  const orgSched = computeScheduleMetrics(allTodos);
  const orgPriorityStats = computePriorityStats(allTodos);

  // Calculate completion rates grouped by team
  const teams = [...new Set(allTodos.map(t => t.assigneeTeam).filter(team => team && team !== 'Unknown'))];
  const completionByTeam = teams.map((team) => {
    const teamTodos = allTodos.filter((t) => t.assigneeTeam === team);
    const comp = teamTodos.filter((t) => t.status.toLowerCase() === "completed").length;
    return { 
      team, 
      rate: teamTodos.length ? Math.round((comp / teamTodos.length) * 100) : 0 
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Org Open Tasks" value={openTodos.length} />
        <KpiCard 
          label="Org Completion Rate" 
          value={`${completionRate}%`} 
          tone={completionRate >= 75 ? "success" : "warning"} 
        />
        <KpiCard 
          label="Org Overdue Tasks" 
          value={overdueTodos.length} 
          tone={overdueTodos.length > 0 ? "danger" : "success"} 
        />
        <KpiCard 
          label="Org On-Time Start" 
          value={`${orgSched.onTimeStartPct}%`} 
          tone={orgSched.onTimeStartPct >= 80 ? "success" : "warning"} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="border border-neutral-200 rounded-xl p-4 bg-white shadow-sm">
          <p className="text-sm font-semibold text-neutral-700 mb-4">Org Tasks by Priority</p>
          <PriorityChart data={orgPriorityStats} />
        </div>

        {/* Team Performance Chart */}
        <div className="border border-neutral-200 rounded-xl p-4 bg-white shadow-sm">
          <p className="text-sm font-semibold text-neutral-700 mb-4">Completion Rate by Team (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={completionByTeam} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="team" tick={{ fontSize: 11, fill: '#737373' }} />
              <YAxis tick={{ fontSize: 11, fill: '#737373' }} unit="%" />
              <Tooltip cursor={{ fill: '#f5f5f5' }} />
              <Bar dataKey="rate" fill="#185fa5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}