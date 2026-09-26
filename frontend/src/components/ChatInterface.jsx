import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bot,
  FileText,
  LoaderCircle,
  Plus,
  SendHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { addMessage, setisResponseGenerating } from "../store/chatSlide";
import { setForm } from "../store/deviationSlice";
import { submitDeviationQuery } from "../services/deviationService";

export const ChatInterface = () => {
  const dispatch = useDispatch();
  const { isResponseGenerating, chatMessages } = useSelector(
    (state) => state.chat,
  );
  const form = useSelector((state) => state.deviation);
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, isResponseGenerating]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 160)}px`;
  };

  const handleTextareaKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const trimmedQuery = query.trim();
    if ((!trimmedQuery && !selectedFile) || isResponseGenerating) {
      return;
    }

    const tempSelectedFile = selectedFile;

    setSelectedFile(null);
    setQuery("")

    dispatch(setisResponseGenerating(true));

    if (tempSelectedFile) {
      dispatch(
        addMessage({
          id: `user-file-${Date.now()}`,
          role: "user",
          type: "file",
          text: tempSelectedFile.name,
          fileName: tempSelectedFile.name,
          mimeType: tempSelectedFile.type,
        }),
      );
    }

    if (trimmedQuery) {
      dispatch(
        addMessage({
          id: `user-${Date.now()}`,
          role: "user",
          type: "text",
          text: trimmedQuery,
        }),
      );
    }

    try {
      // const response = await submitDeviationQuery({
      //   query: trimmedQuery,
      //   file: tempSelectedFile,
      //   currentForm: form,
      // });

      const response = {
        chat_response: "form updated successfuly",
        product_name: "Paracetamol 500mg Tablets",
        batch_number: "PCM2026B001",
        site: "Manufacturing Site - Unit 1",
        deviation_title: "Temperature Excursion During Storage",
        deviation_type: "Environmental",
        description:
          "The storage temperature exceeded the specified limit during routine monitoring. The temperature was recorded at 28°C for approximately 45 minutes against the specified range of 20°C to 25°C.",
        affected_area: "Finished Goods Warehouse",
        immediate_action:
          "The affected materials were placed on hold and the temperature monitoring system was checked. Warehouse personnel were notified and the HVAC system was inspected.",
        root_cause:
          "Temporary malfunction of the HVAC control system resulted in inadequate temperature regulation.",
        quality_impact:
          "Potential impact on product quality due to exposure to temperatures above the specified storage conditions.",
        impact_summary:
          "A total of 120 cartons from batch PCM2026B001 were potentially affected. Quality assessment and stability data review are required before disposition.",
        severity: "Major",
        severity_reason:
          "The deviation may have a potential impact on product quality, but the exposure was limited in duration and the affected batch has been placed on hold pending investigation.",
      };

      await new Promise((res, rej) => {
        setTimeout(() => {
          res(5);
        }, 5000);
      });

      const { chat_response, ...fordata } = response || {};

      const aiMessage =
        response?.chat_response || "The deviation form has been updated.";

      dispatch(
        addMessage({
          id: `assistant-${Date.now()}`,
          role: "assistant",
          type: "text",
          text: aiMessage,
        }),
      );

      dispatch(setForm(fordata));

      console.log(response);
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "The AI could not update the form at the moment.";

      dispatch(
        addMessage({
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          type: "text",
          text: message,
        }),
      );
    } finally {
      dispatch(setisResponseGenerating(false));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedFile(file);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                AI Copilot
              </h2>

              <span
                className={`h-2 w-2 rounded-full ${
                  isResponseGenerating ? "bg-amber-400" : "bg-emerald-500"
                }`}
              />
            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              {isResponseGenerating
                ? "Generating response..."
                : "Ready to assist with your deviation"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            isResponseGenerating
              ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
          }`}
        >
          {isResponseGenerating ? "Running" : "Ready"}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-slate-50/70">
        <div
          ref={chatContainerRef}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
        >
          {chatMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-xs text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Bot className="h-5 w-5" />
                </div>

                <h3 className="text-sm font-semibold text-slate-800">
                  How can I help?
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Ask questions about the deviation, upload a document, or let
                  me help you complete the form.
                </p>
              </div>
            </div>
          ) : (
            chatMessages.map((message) => {
              const isAssistant = message.role === "assistant";
              const isFile = message.type === "file";

              return (
                <div
                  key={message.id}
                  className={`group flex w-full ${
                    isAssistant ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`flex max-w-[88%] items-end gap-2.5 ${
                      isAssistant ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        isAssistant
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                          : "bg-blue-600 text-white shadow-sm"
                      }`}
                    >
                      {isAssistant ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <UserRound className="h-4 w-4" />
                      )}
                    </div>

                    {/* Message content */}
                    <div className="min-w-0">
                      {/* Sender */}
                      <div
                        className={`mb-1 flex items-center gap-2 ${
                          isAssistant ? "justify-start" : "justify-end"
                        }`}
                      >
                      </div>

                      {/* Bubble */}
                      {isFile ? (
                        <div className="min-w-[220px] rounded-2xl rounded-bl-md border border-blue-200/80 bg-blue-50 p-2.5 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                              <FileText className="h-4.5 w-4.5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-blue-900">
                                {message.text}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                <span className="text-[10px] font-medium text-blue-500">
                                  Document uploaded
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm ${
                            isAssistant
                              ? "rounded-bl-md bg-white text-slate-700 ring-1 ring-slate-200/80"
                              : "rounded-br-md bg-blue-600 text-white shadow-blue-600/10"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {message.text}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isResponseGenerating && (
            <div className="flex justify-start">
              <div className="flex max-w-[88%] items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 ring-1 ring-slate-200">
                  <Bot className="h-3.5 w-3.5" />
                </div>

                <div className="rounded-xl rounded-bl-md bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-200/80">
                  <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
          {selectedFile ? (
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-blue-800">
                  {selectedFile.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="flex h-7 w-7 cursor-pointer shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-red-500"
                aria-label="Remove selected file"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
            <label
              className={`flex h-10 w-10 shrink-0  items-center justify-center rounded-lg text-slate-500 transition cursor-pointer hover:bg-slate-200 hover:text-slate-700`}
              aria-label="Add file"
              title="Add PDF or DOCX"
            >
              <Plus className="h-5 w-5" />
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                multiple={false}
                className="hidden"
              />
            </label>

            <textarea
              rows="1"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Ask the AI anything about this deviation..."
              className="max-h-40 min-h-[40px] flex-1 resize-none overflow-y-auto bg-transparent px-1 py-2 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                (!query.trim() && !selectedFile) || isResponseGenerating
              }
              className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 px-1 text-[10px] text-slate-400">
            Upload a PDF or DOCX to provide additional context.
          </p>
        </div>
      </div>
    </div>
  );
};
