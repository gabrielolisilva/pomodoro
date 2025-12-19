import { Header } from "../components/Header";
import { ModeSelector } from "../components/ModeSelector";
import { Timer } from "../components/Timer";
import { TimerControls } from "../components/TimerControls";
import { TaskList } from "../components/TaskList";
import { TaskSummary } from "../components/TaskSummary";

export function Home() {
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
        <Header />

        <div className="flex flex-col justify-center items-center pb-10">
          <div className="flex flex-col items-center justify-start mt-8 lg:mt-[100px]">
            <ModeSelector />

            <Timer />

            <TimerControls />
          </div>

          <div className="max-w-2xl w-full mt-8 lg:mt-[100px] pb-20">
            <TaskList />
          </div>
        </div>

        <TaskSummary />
      </div>
    </div>
  );
}
