import { createSlice } from '@reduxjs/toolkit';

const defaultForm = {
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

const initialState = { ...defaultForm };

const deviationSlice = createSlice({
  name: 'deviation',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setForm: (state, action) => {
      const incoming = action.payload || {};
      const nextState = { ...state };

      Object.keys(nextState).forEach((key) => {
        if (incoming[key]) {
          nextState[key] = incoming[key];
        }
      });

      return nextState;
    },
    resetForm : (state, action)=>{
      return initialState
    }
  },
});

export const { updateFormField, setForm, resetForm } = deviationSlice.actions;
export default deviationSlice.reducer;
