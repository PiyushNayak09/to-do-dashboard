import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const PRIORITY_COLOR = { Urgent: "#a32d2d", High: "#854f0b", Medium: "#185fa5", Low: "#5f5e5a" };

export function KpiCard({ label, value, tone }) {
  const color = { danger: "#a32d2d", warning: "#854f0b", success: "#27500a", neutral: "#0b0b0b" }[tone || "neutral"];
  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-neutral-500 mb-1 font-medium">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

export function PriorityBadge({ priority }) {
  const color = PRIORITY_COLOR[priority] || PRIORITY_COLOR.Low;
  return <span className="font-semibold px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-xs" style={{ color }}>{priority}</span>;
}

export function PriorityChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="priority" tick={{ fontSize: 11, fill: '#737373' }} />
        <YAxis tick={{ fontSize: 11, fill: '#737373' }} allowDecimals={false} />
        <Tooltip cursor={{ fill: '#f5f5f5' }} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={PRIORITY_COLOR[d.priority] || '#d4d4d4'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}