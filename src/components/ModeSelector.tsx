import { HiOutlineBookOpen } from "react-icons/hi2";
import { IoPauseOutline, IoMoonOutline } from "react-icons/io5";
import { usePomodoro } from "../context/PomodoroContent";
import type { Mode } from "../utils/helpers";

interface Modes {
  id: Mode;
  label: string;
  icon: React.ReactNode;
}

export function ModeSelector() {
  const { mode, setMode } = usePomodoro();

  const modes: Modes[] = [
    {
      id: "foco",
      label: "Foco",
      icon: <HiOutlineBookOpen size={20} />,
    },
    {
      id: "pausa",
      label: "Pausa",
      icon: <IoPauseOutline size={20} />,
    },
    {
      id: "descanso",
      label: "Descanso",
      icon: <IoMoonOutline size={20} />,
    },
  ];

  return (
    <div className="flex justify-center gap-2 mb-6">
      {modes.map((modeItem) => (
        <button
          key={modeItem.id}
          onClick={() => setMode(modeItem.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            mode === modeItem.id
              ? "bg-orange-500 text-white"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {modeItem.icon}
          <span>{modeItem.label}</span>
        </button>
      ))}
    </div>
  );
}
