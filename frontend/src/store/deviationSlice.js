import { createSlice } from '@reduxjs/toolkit';

const defaultForm = {
  chat_response: '',
  product_name: '',
  batch_number: '',
  site: '',
  deviation_title: '',
  deviation_type: '',
  description: '',
  affected_area: '',
  immediate_action: '',
  root_cause: '',
  quality_impact: '',
  impact_summary: '',
  severity: '',
  severity_reason: '',
};

const initialState = {
  form: defaultForm,
};

const deviationSlice = createSlice({
  name: 'deviation',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    setForm: (state, action) => {
      state.form = { ...defaultForm, ...(action.payload || {}) };
    },
    mergeFormValues: (state, action) => {
      const values = action.payload || {};
      state.form = { ...state.form, ...values };
    },
  },
});

export const { updateFormField, setForm, mergeFormValues } = deviationSlice.actions;
export default deviationSlice.reducer;

