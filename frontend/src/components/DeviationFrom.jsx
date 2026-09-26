import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, RotateCcw } from "lucide-react";
import { resetForm, setForm, updateFormField } from "../store/deviationSlice";

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

const emptyForm = {
  product_name: "",
  batch_number: "",
  site: "",
  deviation_title: "",
  deviation_type: "",
  description: "",
  affected_area: "",
  immediate_action: "",
  root_cause: "",
  quality_impact: "",
  impact_summary: "",
  severity: "",
  severity_reason: "",
};

export const DeviationFrom = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.deviation);
  const isFormDisabled = useSelector((state) => state.chat.isResponseGenerating);

  const handleFieldChange = (field, value) => {
    if (isFormDisabled) {
      return;
    }
    dispatch(updateFormField({ field, value }));
  };

  const handleResetForm = () => {
    dispatch(resetForm());
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Deviation Details
              </h2>

              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-200">
                AI-assisted
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              Review and update the deviation information
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetForm}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset form
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />

            <h3 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Basic Information
            </h3>

            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="grid gap-x-4 gap-y-4 md:grid-cols-2">
            {formFields.map((field) => (
              <label key={field.key} className="group flex flex-col gap-1.5">
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                  {field.label}
                  <span className="text-slate-300">*</span>
                </span>

                {field.type === "select" ? (
                  <div className="relative">
                    <select
                      value={form[field.key] || ""}
                      onChange={(event) =>
                        handleFieldChange(field.key, event.target.value)
                      }
                      disabled={isFormDisabled}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">Select...</option>

                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={form[field.key] || ""}
                    onChange={(event) =>
                      handleFieldChange(field.key, event.target.value)
                    }
                    disabled={isFormDisabled}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                )}
              </label>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />

            <h3 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Deviation Description
            </h3>

            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <FormTextarea
            label="Description"
            value={form.description}
            onChange={(value) => handleFieldChange("description", value)}
            disabled={isFormDisabled}
            rows={4}
            placeholder="Describe what happened, when it occurred, and any relevant observations..."
          />
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />

            <h3 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Investigation & Actions
            </h3>

            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="grid gap-4">
            <FormTextarea
              label="Immediate Action"
              value={form.immediate_action}
              onChange={(value) => handleFieldChange("immediate_action", value)}
              disabled={isFormDisabled}
              rows={3}
              placeholder="Describe the immediate containment or corrective action taken..."
            />

            <FormTextarea
              label="Root Cause"
              value={form.root_cause}
              onChange={(value) => handleFieldChange("root_cause", value)}
              disabled={isFormDisabled}
              rows={3}
              placeholder="Describe the identified or suspected root cause..."
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />

            <h3 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Impact Assessment
            </h3>

            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="grid gap-4">
            <FormTextarea
              label="Quality Impact"
              value={form.quality_impact}
              onChange={(value) => handleFieldChange("quality_impact", value)}
              disabled={isFormDisabled}
              rows={3}
              placeholder="Describe the potential or confirmed impact on product quality..."
            />

            <FormTextarea
              label="Impact Summary"
              value={form.impact_summary}
              onChange={(value) => handleFieldChange("impact_summary", value)}
              disabled={isFormDisabled}
              rows={3}
              placeholder="Summarize the overall impact and affected materials or processes..."
            />

            <FormTextarea
              label="Severity Reason"
              value={form.severity_reason}
              onChange={(value) => handleFieldChange("severity_reason", value)}
              disabled={isFormDisabled}
              rows={3}
              placeholder="Explain the rationale for the selected severity..."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const FormTextarea = ({
  label,
  value,
  onChange,
  disabled,
  rows = 3,
  placeholder,
}) => {
  return (
    <label className="group flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-600">{label}</span>

      <textarea
        rows={rows}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
};
