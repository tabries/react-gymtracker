import { BrowserRouter, Routes, Route } from "react-router-dom";
import History from "@/routes/history";
import Weight from "@/routes/weight";
import { Footer } from "@/components/Footer";
import React from "react";
import { Routines } from "@/routes/routines";
import { Exercises } from "@/routes/exercises";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="flex flex-col h-screen justify-between">
            <div className="pt-4 px-4 h-full overflow-auto justify-items-center">
              <Routes>
                <Route path="/routines" Component={Routines} />
                <Route path="/routines/:id/exercises" Component={Exercises} />
                <Route path="/history" Component={History} />
                <Route path="/weight" Component={Weight} />
                <Route path="/" Component={Routines} />
              </Routes>
            </div>

            <Footer />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
