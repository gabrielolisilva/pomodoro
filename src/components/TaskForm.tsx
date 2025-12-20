import { useState, useEffect, useRef } from "react";
import { type Task } from "../utils/tasks";
import { HiChevronUp, HiChevronDown } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { MySwal, DEFAULT_TASKS_TAGS } from "../utils/helpers";

interface TaskFormProps {
  task?: Task | null;
  onSave: (
    name: string,
    completedPomodoros: number,
    estimatedPomodoros: number,
    note?: string,
    tags?: string[]
  ) => void;
  onCancel: () => void;
  onDelete?: (taskId: string) => void;
}

export function TaskForm({ task, onSave, onCancel, onDelete }: TaskFormProps) {
  const [name, setName] = useState(task?.name || "");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(
    task?.estimatedPomodoros || 1
  );
  const [completedPomodoros, setCompletedPomodoros] = useState(
    task?.completedPomodoros || 0
  );
  const [note, setNote] = useState(task?.note || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || []);

  const noteTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setEstimatedPomodoros(task.estimatedPomodoros);
      setCompletedPomodoros(task.completedPomodoros);
      setNote(task.note || "");
      setSelectedTags(task.tags || []);
    } else {
      setName("");
      setEstimatedPomodoros(1);
      setCompletedPomodoros(0);
      setNote("");
      setSelectedTags([]);
    }
  }, [task]);

  const handleIncrement = () => {
    setEstimatedPomodoros((prev) => Math.min(prev + 1, 99));
  };

  const handleDecrement = () => {
    setEstimatedPomodoros((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(
        name.trim(),
        completedPomodoros,
        estimatedPomodoros,
        note.trim() || undefined,
        selectedTags.length > 0 ? selectedTags : undefined
      );
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const displaySwalNote = async () => {
    const result = await MySwal.fire({
      title: note ? "Editar Nota" : "Adicionar Nota",
      html: (
        <div className="text-left mt-4">
          <label className="block mb-2 text-gray-700 font-medium">Nota:</label>
          <textarea
            id="swal-note"
            ref={noteTextareaRef}
            defaultValue={note}
            rows={6}
            className="w-full p-2 border border-gray-300 rounded resize-none"
            placeholder="Digite sua nota aqui..."
          />
        </div>
      ),
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      preConfirm: () => {
        const noteInput = noteTextareaRef.current?.value;
        return noteInput?.trim() || "";
      },
    });

    if (result.isConfirmed && result.value !== undefined) {
      setNote(result.value as string);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="No que você está trabalhando?"
        className="w-full bg-transparent text-white placeholder-gray-500 border-none outline-none text-lg mb-4"
        autoFocus
      />

      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2">
          Est Pomodoros
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="99"
            value={completedPomodoros}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 0 && value <= 99) {
                setCompletedPomodoros(value);
              }
            }}
            className="w-16 bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-center outline-none focus:border-orange-500"
          />
          <span className="text-white text-xl">/</span>
          <input
            type="number"
            min="1"
            max="99"
            value={estimatedPomodoros}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 1 && value <= 99) {
                setEstimatedPomodoros(value);
              }
            }}
            className="w-16 bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-center outline-none focus:border-orange-500"
          />
          <div className="flex flex-col">
            <button
              type="button"
              onClick={handleIncrement}
              className="text-gray-400 hover:text-orange-500 transition-colors p-1"
              aria-label="Incrementar"
            >
              <HiChevronUp size={16} />
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              className="text-gray-400 hover:text-orange-500 transition-colors p-1"
              aria-label="Decrementar"
            >
              <HiChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_TASKS_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-orange-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        {note && (
          <div className="mb-2">
            <div
              className="relative bg-yellow-100/90 border-l-4 border-yellow-400 rounded-md px-3 py-2 text-yellow-900 text-sm shadow-sm font-mono whitespace-pre-line"
              style={{
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
            >
              {note}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={displaySwalNote}
          className="text-gray-400 hover:text-orange-500 text-sm transition-colors"
        >
          {note ? "Editar Nota" : "+ Adicionar Nota"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        {task && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Excluir tarefa"
          >
            <MdDelete size={20} />
          </button>
        )}
        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </form>
  );
}
