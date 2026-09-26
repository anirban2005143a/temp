import { createSlice } from '@reduxjs/toolkit';

const defaultForm = {
  chat_response: '',
  site: '',
  occurrence_date: null,
  deviation_title: '',
  source: '',
  related_product_material: '',
  batch_lot_number: '',
  description: '',
  severity: '',
  risk_assessment: '',
  suggested_next_step: '',
};

const initialState = {
  ...defaultForm,
  formStatus: 'draft',
};

const deviationSlice = createSlice({
  name: 'deviation',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
      state.formStatus = 'draft';
    },
    setForm: (state, action) => {
      const incoming = action.payload || {};

      Object.keys(defaultForm).forEach((key) => {
        if(incoming[key]) 
          state[key] = incoming[key]
      });

      state.formStatus = 'draft';
    },
    resetForm: () => ({
      ...defaultForm,
      formStatus: 'draft',
    }),
    markFormSaved: (state) => {
      state.formStatus = 'saved';
    },
  },
});

export const { updateFormField, setForm, resetForm, markFormSaved } =
  deviationSlice.actions;
export default deviationSlice.reducer;
