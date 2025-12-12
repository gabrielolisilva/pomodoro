interface TimerProps {
  minutes: number;
  seconds: number;
  status: string;
}

export function Timer({ minutes, seconds, status }: TimerProps) {
  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  return (
    <div className="flex flex-col items-center justify-center mb-18">
      <p className="text-white text-lg mb-8">{status}</p>
      <div className="relative">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)",
            transform: "scale(1.5)",
          }}
        ></div>

        {/* Timer circle */}
        <div className="relative w-64 h-64 rounded-full border-4 border-orange-500/30 flex items-center justify-center bg-black/20">
          <div className="text-center">
            <span className="text-orange-500 text-6xl font-bold tabular-nums">
              {formatTime(minutes)}:{formatTime(seconds)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
