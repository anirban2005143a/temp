import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { mergeFormValues, updateFormField } from "./store/deviationSlice";
import { submitDeviationQuery } from "./services/deviationService";
import { showErrorToast } from "./utils/toast";

const formFields = [
  { key: "product_name", label: "Product Name", type: "text" },
  { key: "batch_number", label: "Batch Number", type: "text" },
  { key: "site", label: "Site", type: "text" },
  { key: "deviation_title", label: "Deviation Title", type: "text" },
  {
    key: "deviation_type",
    label: "Deviation Type",
    type: "select",
    options: [
      "Process deviation",
      "Equipment deviation",
      "Material deviation",
      "Documentation deviation",
      "Environmental deviation",
    ],
  },
  { key: "affected_area", label: "Affected Area", type: "text" },
  {
    key: "severity",
    label: "Severity",
    type: "select",
    options: ["Low", "Moderate", "High"],
  },
];

function App() {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.deviation.form);
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [error_message, setError_message] = useState("");
  const [isResponseGenerating, setIsResponseGenerating] = useState(false);

  useEffect(() => {
    if (error_message) {
      showErrorToast(error_message);
    }
  }, [error_message]);

  const isFormDisabled = isResponseGenerating;

  const handleFieldChange = (field, value) => {
    if (isFormDisabled) {
      return;
    }
    dispatch(updateFormField({ field, value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || isResponseGenerating) {
      return;
    }

    setSelectedFile(file);
    setQuery(
      (currentQuery) =>
        currentQuery || `Please review the attached file: ${file.name}`,
    );
  };

  const handleSubmit = async () => {
    const trimmedQuery = query.trim();
    if ((!trimmedQuery && !selectedFile) || isResponseGenerating) {
      return;
    }

    setIsResponseGenerating(true);
    setError_message("");

    const userMessage = trimmedQuery || `Attached file: ${selectedFile.name}`;
    setChatMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", text: userMessage },
    ]);

    try {
      const payload = await submitDeviationQuery({
        query: trimmedQuery,
        file: selectedFile,
        currentForm: form,
      });

      const responseText =
        payload?.chat_response || "The deviation form has been updated.";
      setChatMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: responseText,
        },
      ]);
      dispatch(mergeFormValues(payload || {}));
      dispatch(
        updateFormField({ field: "chat_response", value: responseText }),
      );
      setQuery("");
      setSelectedFile(null);
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "The AI could not update the form at the moment.";
      setError_message(message);
      setChatMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text: message,
        },
      ]);
    } finally {
      setIsResponseGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <ToastContainer />
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600">
              Pharmaceutical Quality
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Deviation Intake Module
            </h1>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Save Draft
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)] lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
                Form Review
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                Deviation Details
              </h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              AI-assisted
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {formFields.map((field) => (
              <label key={field.key} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  {field.label}
                </span>
                {field.type === "select" ? (
                  <select
                    value={form[field.key] || ""}
                    onChange={(event) =>
                      handleFieldChange(field.key, event.target.value)
                    }
                    disabled={isFormDisabled}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">Select...</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={form[field.key] || ""}
                    onChange={(event) =>
                      handleFieldChange(field.key, event.target.value)
                    }
                    disabled={isFormDisabled}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                )}
              </label>
            ))}
          </div>

          <div className="mt-6 grid gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Description
              </span>
              <textarea
                rows="4"
                value={form.description || ""}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
                disabled={isFormDisabled}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Quality Impact
              </span>
              <textarea
                rows="3"
                value={form.quality_impact || ""}
                onChange={(event) =>
                  handleFieldChange("quality_impact", event.target.value)
                }
                disabled={isFormDisabled}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Root Cause
              </span>
              <textarea
                rows="3"
                value={form.root_cause || ""}
                onChange={(event) =>
                  handleFieldChange("root_cause", event.target.value)
                }
                disabled={isFormDisabled}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Immediate Action
              </span>
              <textarea
                rows="3"
                value={form.immediate_action || ""}
                onChange={(event) =>
                  handleFieldChange("immediate_action", event.target.value)
                }
                disabled={isFormDisabled}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Impact Summary
              </span>
              <textarea
                rows="3"
                value={form.impact_summary || ""}
                onChange={(event) =>
                  handleFieldChange("impact_summary", event.target.value)
                }
                disabled={isFormDisabled}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Severity Reason
              </span>
              <textarea
                rows="3"
                value={form.severity_reason || ""}
                onChange={(event) =>
                  handleFieldChange("severity_reason", event.target.value)
                }
                disabled={isFormDisabled}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
                Assistant
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                AI Copilot
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
              {isResponseGenerating ? "Running" : "Ready"}
            </span>
          </div>

          <div className="mb-4">
            <label
              className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              aria-disabled={isResponseGenerating}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                disabled={isResponseGenerating}
              />
              Attach document
            </label>
            {selectedFile ? (
              <p className="mt-2 text-xs text-slate-600">
                Selected file: {selectedFile.name}
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Upload a PDF or DOCX to enrich the form.
              </p>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl px-3 py-2 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "bg-white text-slate-700 shadow-sm"
                    : "ml-auto max-w-[85%] bg-blue-600 text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Query
            </label>
            <textarea
              rows="5"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ask the AI to review the form, update fields, or explain the deviation..."
              disabled={isResponseGenerating}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                (!query.trim() && !selectedFile) || isResponseGenerating
              }
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isResponseGenerating ? "Generating..." : "Send to AI"}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
