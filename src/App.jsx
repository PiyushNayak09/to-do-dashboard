import { useState, useEffect } from "react";
import { fetchDashboardData } from "./services/api";
import { UserCircle2, Users2, Building2 } from "lucide-react";
import MemberView from "./views/MemberView";
import ManagerView from "./views/ManagerView";
import AdminView from "./views/AdminView";

const ROLE_META = {
  member: { icon: UserCircle2, label: "My Tasks" },
  manager: { icon: Users2, label: "Team Tasks" },
  admin: { icon: Building2, label: "Organizational Tasks" },
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState("member");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setTodos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;

  const meta = ROLE_META[activeRole];
  const Icon = meta.icon;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white min-h-screen rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Icon size={20} /> {meta.label}
        </h1>
        <select 
          value={activeRole} 
          onChange={(e) => setActiveRole(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="member">View as Member</option>
          <option value="manager">View as Manager</option>
          <option value="admin">View as Admin</option>
        </select>
      </div>

      {activeRole === "member" && <MemberView allTodos={todos} />}
      {activeRole === "manager" && <ManagerView allTodos={todos} />}
      {activeRole === "admin" && <AdminView allTodos={todos} />}
    </div>
  );
}