import { useState } from "react";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";
import { Todo } from "@/types/todo";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import { cn } from "@/lib/utils";

// Mock data - replace with actual API calls to your PostgreSQL backend
const initialTodos: Todo[] = [
  {
    id: 1,
    title: "Design the landing page",
    description: "Create wireframes and high-fidelity mockups for the new landing page",
    is_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Review pull requests",
    description: null,
    is_completed: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Set up database migrations",
    description: "Configure PostgreSQL and create initial schema",
    is_completed: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

type FilterType = "all" | "active" | "completed";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<FilterType>("all");

  const addTask = (title: string, description: string | null) => {
    const newTask: Todo = {
      id: Date.now(),
      title,
      description,
      is_completed: false,
      created_at: new Date().toISOString(),
    };
    setTodos([newTask, ...todos]);
  };

  const toggleTask = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
      )
    );
  };

  const deleteTask = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTask = (id: number, title: string, description: string | null) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title, description } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.is_completed;
    if (filter === "completed") return todo.is_completed;
    return true;
  });

  const activeTasks = todos.filter((t) => !t.is_completed).length;
  const completedTasks = todos.filter((t) => t.is_completed).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ListTodo className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          </div>
          <p className="text-muted-foreground">
            {activeTasks} active, {completedTasks} completed
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "active", "completed"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all duration-200",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {f === "all" && <span>All ({todos.length})</span>}
              {f === "active" && (
                <span className="flex items-center gap-1.5">
                  <Circle className="w-3.5 h-3.5" />
                  Active ({activeTasks})
                </span>
              )}
              {f === "completed" && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Done ({completedTasks})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Add Task Form */}
        <div className="mb-4">
          <AddTaskForm onAdd={addTask} />
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <ListTodo className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                {filter === "all"
                  ? "No tasks yet. Add one above!"
                  : filter === "active"
                  ? "No active tasks"
                  : "No completed tasks"}
              </p>
            </div>
          ) : (
            filteredTodos.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
