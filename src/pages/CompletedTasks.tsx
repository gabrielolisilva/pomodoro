import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  type Task,
  getCompletedTasksFromLocalStorage,
  deleteCompletedTask,
} from "../utils/tasks";
import { HiArrowLeft, HiTrash } from "react-icons/hi2";
import { formatTime } from "../utils/tasks";
import { PaginationPathEnum } from "../utils/pagination";

export function CompletedTasks() {
  const location = useLocation();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const loadCompletedTasks = () => {
    const tasks = getCompletedTasksFromLocalStorage();

    tasks.sort((a, b) => b.updatedAt - a.updatedAt);
    setCompletedTasks(tasks);
  };

  useEffect(() => {
    loadCompletedTasks();
  }, [location.pathname]);

  const handleDelete = (taskId: string) => {
    if (deleteCompletedTask(taskId)) {
      loadCompletedTasks();
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Hoje às ${formatTime(date)}`;
    } else if (isYesterday) {
      return `Ontem às ${formatTime(date)}`;
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Radial glow background effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
        }}
      ></div>

      <div className="flex flex-col min-h-screen">
        <header className="flex justify-between items-center p-6 w-full">
          <div className="flex items-center gap-4">
            <Link
              to={PaginationPathEnum.HOME}
              className="text-gray-400 hover:text-orange-500 transition-colors"
              aria-label="Voltar para home"
            >
              <HiArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
              <h1 className="text-white text-xl font-semibold">
                Tarefas Completas
              </h1>
            </div>
          </div>
        </header>

        <div className="flex flex-col justify-center items-center pb-10 flex-1">
          <div className="max-w-2xl w-full mt-8 lg:mt-[50px] px-4">
            {completedTasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-500 text-lg mb-2">
                  Nenhuma tarefa completa ainda
                </div>
                <p className="text-gray-600 text-sm">
                  As tarefas que você completar aparecerão aqui
                </p>
                <Link
                  to={PaginationPathEnum.HOME}
                  className="inline-block mt-6 text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Voltar para home
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <h2 className="text-white text-xl font-semibold mb-1">
                    {completedTasks.length}{" "}
                    {completedTasks.length === 1
                      ? "tarefa completa"
                      : "tarefas completas"}
                  </h2>
                </div>

                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-orange-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0"></div>
                            <h3 className="text-white font-medium text-lg">
                              {task.name}
                            </h3>
                          </div>

                          {task.note && (
                            <div className="ml-5 mb-3">
                              <div
                                className="relative bg-yellow-100/90 border-l-4 border-yellow-400 rounded-md px-3 py-2 text-yellow-900 text-sm shadow-sm font-mono whitespace-pre-line"
                                style={{
                                  fontFamily:
                                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                }}
                              >
                                {task.note}
                              </div>
                            </div>
                          )}

                          <div className="ml-5 flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Pomodoros:</span>
                              <span className="text-orange-500 font-medium">
                                {task.completedPomodoros}/
                                {task.estimatedPomodoros}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">
                                Completada em:
                              </span>
                              <span className="text-gray-300">
                                {formatDate(task.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(task.id)}
                          className="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2"
                          aria-label="Excluir tarefa"
                        >
                          <HiTrash size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
