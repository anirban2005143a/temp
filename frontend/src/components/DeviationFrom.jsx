import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarDays,
  ChevronDown,
  RotateCcw,
  Save,
  Search,
  ShieldCheck
} from "lucide-react";
import { resetForm, setForm, updateFormField } from "../store/deviationSlice";

const basicFields = [
  {
    key: "site",
    label: "Site / Plant",
    type: "select",
    required: true,
    placeholder: "Select site / plant",
    options: [
      "API Manufacturing Unit",
      "Formulation Manufacturing Unit",
      "Packaging Unit",
    ],
  },
  {
    key: "occurrence_date",
    label: "Date of Occurrence",
    type: "date",
    required: true,
  },
  {
    key: "deviation_title",
    label: "Title / Short Description",
    type: "text",
    required: true,
    placeholder: "e.g. OOS result for Assay in Batch ABC-001",
  },
  {
    key: "source",
    label: "Source",
    type: "select",
    required: true,
    placeholder: "Select source",
    options: [
      "Quality Control",
      "Production",
      "Quality Assurance",
      "Warehouse",
      "Engineering",
      "Other",
    ],
  },
  {
    key: "related_product_material",
    label: "Related Product / Material",
    type: "search",
    required: false,
    placeholder: "Search product or material...",
  },
  {
    key: "batch_lot_number",
    label: "Batch/Lot Number",
    type: "text",
    required: false,
    placeholder: "Enter batch / lot no.",
  },
];

const severityOptions = ["Low", "Moderate", "High"];

export const DeviationFrom = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.deviation);
  const isFormDisabled = useSelector(
    (state) => state.chat.isResponseGenerating,
  );

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white rounded-lg">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-200 px-6 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-[#14213d]">
              Log Deviation
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Record any unexpected event, out-of-specification result or
              non-conformance.
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Draft
          </span>
        </div>
      </div>

      {/* Form body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        {/* -------------------------------------------------- */}
        {/* 1. DEVIATION INFORMATION */}
        {/* -------------------------------------------------- */}
        <section>
          <SectionHeading number="1." title="Deviation Information" />

          <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
            {basicFields.map((field) => {
              const value = form[field.key] || "";

              return (
                <FormField
                  key={field.key}
                  field={field}
                  value={value}
                  onChange={(newValue) =>
                    handleFieldChange(field.key, newValue)
                  }
                  disabled={isFormDisabled}
                />
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="my-8 h-px bg-slate-200" />

        {/* -------------------------------------------------- */}
        {/* 2. DEVIATION DETAILS */}
        {/* -------------------------------------------------- */}
        <section>
          <SectionHeading number="2." title="Deviation Details" />

          <div className="space-y-5">
            {/* Detailed Description */}
            <FormTextarea
              label="Detailed Description"
              required
              value={form.description}
              onChange={(value) => handleFieldChange("description", value)}
              disabled={isFormDisabled}
              rows={6}
              maxLength={2000}
              showCounter
              placeholder="Describe what happened, where, when and how it was detected..."
            />
          </div>
        </section>

        {/* Impact + Severity */}
        {/* <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              AI Risk Assessment
            </h3>
            <span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-200">
              AI generated
            </span>
          </div>
          <div className="grid gap-4">
            <label className="group flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">
                Severity
              </span>
              <div className="relative">
                <select
                  value={form.severity || ""}
                  onChange={(event) =>
                    handleFieldChange("severity", event.target.value)
                  }
                  disabled={isFormDisabled}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Select severity</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </label>
            <FormTextarea
              label="Risk Assessment"
              value={form.risk_assessment}
              onChange={(value) => handleFieldChange("risk_assessment", value)}
              disabled={isFormDisabled}
              rows={4}
              placeholder="Assess the confirmed or potential risk based on the available evidence..."
            />

            <FormTextarea
              label="Suggested Next Step"
              value={form.suggested_next_step}
              onChange={(value) =>
                handleFieldChange("suggested_next_step", value)
              }
              disabled={isFormDisabled}
              rows={4}
              placeholder="Recommend the next action or follow-up based on the documented deviation..."
            />
          </div>
        </section> */}

        <section className="mt-8 rounded-lg border border-indigo-100 bg-indigo-50/60 p-4">
  {/* Header */}
  <div className="mb-5 flex items-center gap-2">
    <ShieldCheck className="h-6 w-6 text-indigo-600" />

    <h3 className="text-lg font-semibold text-indigo-900">
      AI copilot risk assessment
    </h3>
  </div>

  <div className="grid gap-5 md:grid-cols-2">
    {/* Severity */}
    <label className="flex flex-col gap-2">
      <span className="text-base font-medium text-indigo-900">
        Severity (Suggested)
      </span>

      <div className="relative">
        <select
          value={form.severity || ""}
          onChange={(event) =>
            handleFieldChange("severity", event.target.value)
          }
          disabled={isFormDisabled}
          className="h-[56px] w-full appearance-none rounded-lg border border-indigo-200 bg-white px-3.5 pr-10 text-lg text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">Select severity</option>

          {severityOptions.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
      </div>
    </label>

    {/* Suggested Next Action */}
    <label className="flex flex-col gap-2">
      <span className="text-base font-medium text-indigo-900">
        Suggested Next Action
      </span>

      <input
        type="text"
        value={form.suggested_next_step || ""}
        onChange={(event) =>
          handleFieldChange("suggested_next_step", event.target.value)
        }
        disabled={isFormDisabled}
        placeholder="Recommend the next action..."
        className="h-[56px] w-full rounded-lg border border-indigo-200 bg-white px-3.5 text-lg text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>

    {/* Initial Risk Assessment */}
    <label className="flex flex-col gap-2 md:col-span-2">
      <span className="text-base font-medium text-indigo-900">
        Initial Risk Assessment
      </span>

      <input
        type="text"
        value={form.risk_assessment || ""}
        onChange={(event) =>
          handleFieldChange("risk_assessment", event.target.value)
        }
        disabled={isFormDisabled}
        placeholder="Assess the confirmed or potential risk based on the available evidence..."
        className="h-[56px] w-full rounded-lg border border-indigo-200 bg-white px-3.5 text-lg text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  </div>
</section>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-200 bg-white px-6 py-5 sm:px-8">
        <button
          type="button"
          onClick={handleResetForm}
          disabled={isFormDisabled}
          className="inline-flex h-[50px] cursor-pointer disabled:cursor-not-allowed items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw className="h-[18px] w-[18px]" />
          Reset Form
        </button>

        <button
          type="button"
          disabled={isFormDisabled}
          className="inline-flex h-[50px] disabled:cursor-not-allowed cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-[19px] w-[19px]" />
          Save Deviation
        </button>
      </div>
    </div>
  );
};

const SectionHeading = ({ number, title }) => {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-base font-bold text-[#1d3557]">{number}</span>

      <h2 className="text-base font-bold uppercase tracking-wide text-[#1d3557]">
        {title}
      </h2>
    </div>
  );
};

/* ========================================================= */
/* Generic Form Field                                        */
/* ========================================================= */

const FormField = ({ field, value, onChange, disabled }) => {
  const commonInputClasses =
    "h-[46px] w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60";

  return (
    <label className="flex flex-col gap-2">
      {/* Label */}
      <span className="text-[15px] font-semibold text-slate-800">
        {field.label}

        {field.required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {/* Text */}
      {field.type === "text" && (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder={field.placeholder}
          className={commonInputClasses}
        />
      )}

      {/* Date */}
      {field.type === "date" && (
        <div className="relative">
          <input
            type="date"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            className={`${commonInputClasses}`}
          />

        </div>
      )}

      {/* Select */}
      {field.type === "select" && (
        <div className="relative">
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            className={`${commonInputClasses} appearance-none pr-11`}
          >
            <option value="">{field.placeholder}</option>

            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        </div>
      )}

      {/* Search */}
      {field.type === "search" && (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            placeholder={field.placeholder}
            className={`${commonInputClasses} pr-11`}
          />

          <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        </div>
      )}
    </label>
  );
};

/* ========================================================= */
/* Select                                                    */
/* ========================================================= */

const FormSelect = ({
  label,
  required = false,
  value,
  onChange,
  disabled,
  placeholder,
  options = [],
}) => {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[15px] font-semibold text-slate-800">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="h-[46px] w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
      </div>
    </label>
  );
};

/* ========================================================= */
/* Textarea                                                  */
/* ========================================================= */

const FormTextarea = ({
  label,
  value,
  onChange,
  disabled,
  rows = 5,
  maxLength,
  showCounter = false,
  required = false,
  placeholder,
}) => {
  const characterCount = value?.length || 0;

  return (
    <label className="flex flex-col gap-2">
      <span className="text-[15px] font-semibold text-slate-800">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <div className="relative">
        <textarea
          rows={rows}
          value={value || ""}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="min-h-[140px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
        />

        {showCounter && (
          <span className="absolute bottom-3 right-3 text-xs text-slate-400">
            {characterCount}/{maxLength}
          </span>
        )}
      </div>
    </label>
  );
};
