import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarDays,
  ChevronDown,
  LoaderCircle,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
} from "lucide-react";
import { saveDeviationToDatabase } from "../services/deviationService";
import { showErrorToast } from "../utils/toast";
import {
  markFormSaved,
  resetForm,
  setForm,
  updateFormField,
} from "../store/deviationSlice";

const basicFields = [
  {
    key: "site",
    label: "Site / Plant",
    type: "text",
    placeholder: "Enter site / plant",
  },
  {
    key: "occurrence_date",
    label: "Date of Occurrence",
    type: "date",
  },
  {
    key: "deviation_title",
    label: "Title / Short Description",
    type: "text",
    placeholder: "e.g. OOS result for Assay in Batch ABC-001",
  },
  {
    key: "source",
    label: "Source",
    type: "select",
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
    placeholder: "Search product or material...",
  },
  {
    key: "batch_lot_number",
    label: "Batch/Lot Number",
    type: "text",
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
  const [isSaving, setIsSaving] = useState(false);
  const formStatus = form.formStatus || "draft";

  const handleFieldChange = (field, value) => {
    if (isFormDisabled || isSaving) {
      return;
    }
    dispatch(updateFormField({ field, value }));
  };

  const handleResetForm = () => {
    if (isSaving) {
      return;
    }
    dispatch(resetForm());
  };

  const handleSaveDeviation = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const { chat_response, ...payload } = form;
      await saveDeviationToDatabase(payload);
      dispatch(markFormSaved());
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save deviation.";

      showErrorToast(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white rounded-lg">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-200 px-6 py-2 sm:px-8">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-[#14213d]">
              Log Deviation
            </h1>

            <p className=" text-sm text-slate-500">
              Record any unexpected event, out-of-specification result or
              non-conformance.
            </p>
          </div>

          <div
            className={`inline-flex shrink-0 items-center rounded-lg border px-4 py-2 text-sm font-semibold ${
              formStatus === "saved"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {formStatus === "saved" ? "Saved" : "Draft"}
          </div>
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

              if (field.type === "select") {
                return (
                  <FormSelect
                    key={field.key}
                    label={field.label}
                    value={value}
                    onChange={(newValue) =>
                      handleFieldChange(field.key, newValue)
                    }
                    disabled={isFormDisabled}
                    placeholder={field.placeholder}
                    options={field.options || []}
                  />
                );
              }

              if (field.type === "search") {
                return (
                  <FormInputField
                    key={field.key}
                    label={field.label}
                    type="text"
                    value={value}
                    onChange={(newValue) =>
                      handleFieldChange(field.key, newValue)
                    }
                    disabled={isFormDisabled}
                    placeholder={field.placeholder}
                    icon={
                      <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    }
                  />
                );
              }

              return (
                <FormInputField
                  key={field.key}
                  label={field.label}
                  type={field.type}
                  value={value}
                  onChange={(newValue) =>
                    handleFieldChange(field.key, newValue)
                  }
                  disabled={isFormDisabled}
                  placeholder={field.placeholder}
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
              value={form.description}
              onChange={(value) => handleFieldChange("description", value)}
              disabled={isFormDisabled}
              rows={6}
              maxLength={2000}
              showCounter
              placeholder="Describe what happened, where, when and how it was detected..."
              className="text-lg"
            />
          </div>
        </section>

        {/* Impact + Severity */}

        <section className="mt-8 rounded-lg border border-indigo-100 bg-indigo-50/60 p-4">
          {/* Header */}
          <div className="mb-5 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />

            <h3 className="text-lg font-semibold text-indigo-900">
              AI Risk Assessment
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <FormSelect
              label="Severity (Suggested)"
              value={form.severity || ""}
              onChange={(value) => handleFieldChange("severity", value)}
              disabled={isFormDisabled}
              placeholder="Select severity"
              options={severityOptions}
              className="col-span-1"
            />

            <FormInputField
              label="Suggested Next Action"
              type="text"
              value={form.suggested_next_step}
              onChange={(value) =>
                handleFieldChange("suggested_next_step", value)
              }
              disabled={isFormDisabled}
              className="col-span-3"
              placeholder="Recommend the next action..."
            />

            <FormTextarea
              label="Risk Assessment"
              value={form.risk_assessment}
              onChange={(value) => handleFieldChange("risk_assessment", value)}
              disabled={isFormDisabled}
              rows={3}
              placeholder="Assess the confirmed or potential risk based on the available evidence..."
              className=" md:col-span-4"
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-200 bg-white px-6 py-5 sm:px-8">
        <button
          type="button"
          onClick={handleResetForm}
          disabled={isFormDisabled || isSaving}
          className="inline-flex h-[50px] cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw className="h-[18px] w-[18px]" />
          Reset Form
        </button>

        <button
          type="button"
          onClick={handleSaveDeviation}
          disabled={isFormDisabled || isSaving}
          className="inline-flex h-[50px] cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <LoaderCircle className="h-[19px] w-[19px] animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-[19px] w-[19px]" />
              Save Deviation
            </>
          )}
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
/* Input Field                                               */
/* ========================================================= */

const FormInputField = ({
  label,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
  icon,
  className = "",
}) => {
  const commonInputClasses =
    "h-[46px] w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60";

  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[15px] font-semibold text-slate-800">
        {label}

      </span>

      <div className="relative">
        <input
          type={type}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`${commonInputClasses} ${icon ? "pr-11" : ""}`}
        />

        {icon}
      </div>
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
  className = "",
}) => {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
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
  placeholder,
  className = "",
}) => {
  const characterCount = value?.length || 0;

  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[15px] font-semibold text-slate-800">
        {label}

      </span>

      <div className="relative">
        <textarea
          rows={rows}
          value={value || ""}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`min-h-[140px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 ${className}`}
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
