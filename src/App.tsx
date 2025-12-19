import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { CompletedTasks } from "./pages/CompletedTasks";
import { PaginationPathEnum } from "./utils/pagination";
import { PomodoroProvider } from "./context/PomodoroContent";

function App() {
  return (
    <PomodoroProvider>
      <BrowserRouter>
        <Routes>
          <Route path={PaginationPathEnum.HOME} element={<Home />} />
          <Route
            path={PaginationPathEnum.COMPLETED_TASKS}
            element={<CompletedTasks />}
          />
        </Routes>
      </BrowserRouter>
    </PomodoroProvider>
  );
}

export default App;
