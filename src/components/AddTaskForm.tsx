import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddTaskFormProps {
  onAdd: (title: string, description: string | null) => void;
}

const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || null);
      setTitle("");
      setDescription("");
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full task-card p-4 flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <div className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center">
          <Plus className="w-3 h-3" />
        </div>
        <span className="font-medium">Add a new task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="task-card p-4 animate-slide-up">
      <div className="space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="font-medium"
          autoFocus
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          className="min-h-[80px] resize-none"
        />
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsExpanded(false);
              setTitle("");
              setDescription("");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
