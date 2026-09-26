import { createSlice } from '@reduxjs/toolkit';

const defaultForm = {
  chat_response: '',
  site: '',
  occurrence_date: '',
  deviation_title: '',
  source: '',
  related_product_material: '',
  batch_lot_number: '',
  description: '',
  severity: '',
  risk_assessment: '',
  suggested_next_step: '',
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
