import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api';

const defaultForm = {
  deviation_id: '',
  product_name: '',
  batch_number: '',
  lot_number: '',
  site: '',
  deviation_title: '',
  deviation_type: '',
  description: '',
  affected_area: '',
  associated_material: '',
  impact_summary: '',
  severity: '',
  severity_reason: '',
  root_cause: '',
  immediate_action: '',
  owner: '',
  investigation_status: 'Open',
  quality_impact: '',
  reported_by: '',
  reporting_date: '',
};

const initialState = {
  form: defaultForm,
  draftText: '',
  ai: {
    loading: false,
    error: null,
    success: null,
    extractedData: {},
    impact: null,
  },
  save: {
    saving: false,
    success: null,
    error: null,
  },
};

export const processDeviation = createAsyncThunk(
  'deviation/process',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/deviation/process', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Unable to process the deviation.');
    }
  },
);

export const uploadDeviationFile = createAsyncThunk(
  'deviation/uploadFile',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', 'upload');

      const response = await api.post('/api/deviation/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Unable to upload the document.');
    }
  },
);

export const saveDeviation = createAsyncThunk(
  'deviation/save',
  async (formData, { rejectWithValue }) => {
    try {
      const payload = {
        ...formData,
        reporting_date: formData.reporting_date || new Date().toISOString().slice(0, 10),
      };
      const response = await api.post('/api/deviation/save', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Unable to save the deviation.');
    }
  },
);

const deviationSlice = createSlice({
  name: 'deviation',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    setDraftText: (state, action) => {
      state.draftText = action.payload;
    },
    applyExtractedData: (state, action) => {
      const extractedData = action.payload || {};
      state.form = { ...state.form, ...extractedData };
      state.ai.extractedData = extractedData;
    },
    clearAiState: (state) => {
      state.ai.error = null;
      state.ai.success = null;
      state.ai.impact = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processDeviation.pending, (state) => {
        state.ai.loading = true;
        state.ai.error = null;
        state.ai.success = null;
      })
      .addCase(processDeviation.fulfilled, (state, action) => {
        state.ai.loading = false;
        state.ai.success = 'Deviation successfully analyzed by AI Copilot.';
        state.ai.extractedData = action.payload.extracted_data || {};
        state.ai.impact = action.payload.impact_assessment || null;
        state.form = { ...state.form, ...(action.payload.extracted_data || {}) };
        if (action.payload.impact_assessment) {
          state.form.severity = action.payload.impact_assessment.severity;
          state.form.severity_reason = action.payload.impact_assessment.reason;
          state.form.impact_summary = action.payload.impact_assessment.reason;
        }
      })
      .addCase(processDeviation.rejected, (state, action) => {
        state.ai.loading = false;
        state.ai.error = action.payload || 'Unable to process the deviation.';
      })
      .addCase(uploadDeviationFile.pending, (state) => {
        state.ai.loading = true;
        state.ai.error = null;
      })
      .addCase(uploadDeviationFile.fulfilled, (state, action) => {
        state.ai.loading = false;
        state.draftText = action.payload.text || '';
        state.ai.success = action.payload.message || 'Document uploaded and text extracted.';
      })
      .addCase(uploadDeviationFile.rejected, (state, action) => {
        state.ai.loading = false;
        state.ai.error = action.payload || 'Unable to upload the document.';
      })
      .addCase(saveDeviation.pending, (state) => {
        state.save.saving = true;
        state.save.error = null;
        state.save.success = null;
      })
      .addCase(saveDeviation.fulfilled, (state, action) => {
        state.save.saving = false;
        state.save.success = action.payload.message || 'Deviation saved successfully.';
        state.form.deviation_id = action.payload.deviation_id || state.form.deviation_id;
      })
      .addCase(saveDeviation.rejected, (state, action) => {
        state.save.saving = false;
        state.save.error = action.payload || 'Unable to save the deviation.';
      });
  },
});

export const { updateFormField, setDraftText, applyExtractedData, clearAiState } = deviationSlice.actions;
export default deviationSlice.reducer;
