import axios from 'axios';

// Direct connections to the microservices
const todoService = axios.create({ baseURL: 'https://localhost:5001/api' });
const employeeService = axios.create({ baseURL: 'https://localhost:5002/api' }); 

export async function fetchDashboardData() {
  try {
    // Fetch tasks and employees concurrently
    const [todoRes, employeeRes] = await Promise.all([
      todoService.get('/todos/analytics'),
      employeeService.get('/employees')
    ]);

    const employees = employeeRes.data;
    
    // Create a lookup map for O(1) matching: { 1: { name: "Ananya R.", team: "Delivery" } }
    const employeeMap = employees.reduce((acc, emp) => {
      acc[emp.employeeId] = emp;
      return acc;
    }, {});

    // Stitch the DB records with the employee data
    return todoRes.data.map(todo => {
      const assignee = employeeMap[todo.assignedTo] || { name: 'Unassigned', team: 'Unknown' };

      return {
        todoId: todo.todoId,
        todoTitle: todo.todoTitle,
        status: todo.status,
        priority: todo.priority,
        assigneeName: assignee.name,
        assigneeTeam: assignee.team,
        
        // Date Parsing
        createdDate: new Date(todo.createdDate),
        startDate: new Date(todo.startDate),
        dueDate: new Date(todo.dueDate),
        actualStartDate: todo.actualStartDate ? new Date(todo.actualStartDate) : null,
        actualEndDate: todo.actualEndDate ? new Date(todo.actualEndDate) : null,
      };
    });
  } catch (error) {
    console.error("Dashboard API Error:", error.response?.data || error.message);
    throw new Error("Failed to load dashboard data.", { cause: error });
  }
}