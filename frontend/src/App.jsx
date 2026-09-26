import { FileText, Save } from "lucide-react";
import { ChatInterface } from "./components/ChatInterface";
import { DeviationFrom } from "./components/DeviationFrom";

function App() {
  return (
    <div className="flex h-[100dvh] flex-col items-center bg-slate-100 text-slate-800">
      <header className="w-full max-w-[1400px] shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="flex min-h-[76px] items-center justify-between gap-6 px-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  Deviation Intake
                </h1>

                <span className="hidden rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-200 sm:inline-flex">
                  QA
                </span>
              </div>

              <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
                Review, assess, and document a quality deviation
              </p>
            </div>
          </div>

          
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1400px] flex-1 min-h-0 grid-cols-10 gap-2 py-4">
        <div className="col-span-7 h-full min-h-0 overflow-hidden">
          <DeviationFrom />
        </div>

        <div className="col-span-3 h-full min-h-0 overflow-hidden">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}

export default App;
