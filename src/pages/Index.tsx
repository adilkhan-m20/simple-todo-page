import { useState, useEffect } from "react";
import { CheckCircle2, Circle, ListTodo, Loader2 } from "lucide-react";
import { Todo } from "@/types/todo";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type FilterType = "all" | "active" | "completed";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTodos(
        data.map((todo) => ({
          ...todo,
          is_completed: todo.is_completed ?? false,
          created_at: todo.created_at ?? new Date().toISOString(),
        }))
      );
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast({ title: "Error", description: "Failed to fetch tasks", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (title: string, description: string | null) => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .insert({ title, description, is_completed: false })
        .select()
        .single();

      if (error) throw error;

      setTodos([
        { ...data, is_completed: data.is_completed ?? false, created_at: data.created_at ?? new Date().toISOString() },
        ...todos,
      ]);
      toast({ title: "Task added successfully" });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({ title: "Error", description: "Failed to add task", variant: "destructive" });
    }
  };

  const toggleTask = async (id: number) => {
    const task = todos.find((t) => t.id === id);
    if (!task) return;

    try {
      const { error } = await supabase
        .from("todos")
        .update({ is_completed: !task.is_completed })
        .eq("id", id);

      if (error) throw error;

      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo)));
    } catch (error) {
      console.error("Error toggling task:", error);
      toast({ title: "Error", description: "Failed to update task", variant: "destructive" });
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;

      setTodos(todos.filter((todo) => todo.id !== id));
      toast({ title: "Task deleted" });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({ title: "Error", description: "Failed to delete task", variant: "destructive" });
    }
  };

  const updateTask = async (id: number, title: string, description: string | null) => {
    try {
      const { error } = await supabase.from("todos").update({ title, description }).eq("id", id);
      if (error) throw error;

      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, title, description } : todo)));
      toast({ title: "Task updated" });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({ title: "Error", description: "Failed to update task", variant: "destructive" });
    }
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
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              <p className="text-muted-foreground mt-2">Loading tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
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
