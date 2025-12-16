import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { CompletedTasks } from "./pages/CompletedTasks";
import { PaginationPathEnum } from "./utils/pagination";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PaginationPathEnum.HOME} element={<Home />} />
        <Route
          path={PaginationPathEnum.COMPLETED_TASKS}
          element={<CompletedTasks />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
