import { FileText, Save } from "lucide-react";
import { ChatInterface } from "./components/ChatInterface";
import { DeviationFrom } from "./components/DeviationFrom";

function App() {
  return (
    <div className="flex h-[100dvh] flex-col items-center bg-slate-100 text-slate-800">
      <header className="w-full max-w-[1400px] shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="flex min-h-[76px] items-center justify-between gap-6 px-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  Deviation Intake
                </h1>

                <span className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-200 sm:inline-flex">
                  QA
                </span>
              </div>

              <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
                Review, assess, and document a quality deviation
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Unsaved changes</span>
            </div>

            <button
              type="button"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1400px] flex-1 min-h-0 grid-cols-5 gap-2 py-4">
        <div className="col-span-3 h-full min-h-0 overflow-hidden">
          <DeviationFrom />
        </div>

        <div className="col-span-2 h-full min-h-0 overflow-hidden">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}

export default App;
