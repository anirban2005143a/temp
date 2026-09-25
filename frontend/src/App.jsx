import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { processDeviation, saveDeviation, uploadDeviationFile } from './store/deviationSlice';

const formFields = [
  { key: 'deviation_id', label: 'Deviation ID', type: 'text' },
  { key: 'product_name', label: 'Product Name', type: 'text' },
  { key: 'batch_number', label: 'Batch Number', type: 'text' },
  { key: 'lot_number', label: 'Lot Number', type: 'text' },
  { key: 'site', label: 'Site', type: 'text' },
  { key: 'deviation_title', label: 'Deviation Title', type: 'text' },
  { key: 'deviation_type', label: 'Deviation Type', type: 'select', options: ['Quality deviation', 'Process deviation', 'Documentation deviation', 'Equipment deviation'] },
  { key: 'affected_area', label: 'Affected Area', type: 'text' },
  { key: 'associated_material', label: 'Associated Material', type: 'text' },
  { key: 'owner', label: 'Owner', type: 'text' },
  { key: 'quality_impact', label: 'Quality Impact', type: 'text' },
  { key: 'reporting_date', label: 'Reporting Date', type: 'date' },
  { key: 'reported_by', label: 'Reported By', type: 'text' },
  { key: 'investigation_status', label: 'Status', type: 'select', options: ['Open', 'In Progress', 'Closed'] },
];

function App() {
  const dispatch = useDispatch();
  const { form, draftText, ai, save } = useSelector((state) => state.deviation);
  const [selectedFile, setSelectedFile] = useState(null);

  const impactBadgeClass = useMemo(() => {
    const level = ai.impact?.risk_level || 'Low';
    if (level === 'High') return 'badge danger';
    if (level === 'Moderate') return 'badge warning';
    return 'badge success';
  }, [ai.impact]);

  const handleTextSubmit = () => {
    if (!draftText.trim()) return;
    dispatch(processDeviation({ text: draftText, source: 'manual' }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file.name);
    const result = await dispatch(uploadDeviationFile(file));
    if (uploadDeviationFile.fulfilled.match(result) && result.payload?.text) {
      dispatch(processDeviation({ text: result.payload.text, source: 'upload', document_name: file.name }));
    }
  };

  const handleInputChange = (field, value) => {
    dispatch({
      type: 'deviation/updateFormField',
      payload: { field, value },
    });
  };

  const handleSave = () => {
    dispatch(saveDeviation(form));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Pharmaceutical Quality Systems</div>
          <h1>Deviation Intake Module</h1>
        </div>
        <button className="primary-btn" onClick={handleSave} disabled={save.saving}>
          {save.saving ? 'Saving...' : 'Save Deviation'}
        </button>
      </header>

      <main className="workspace-grid">
        <section className="panel form-panel">
          <div className="panel-header">
            <h2>Log Deviation</h2>
            <span className="status-pill">Auto-filled by AI</span>
          </div>

          <div className="field-grid">
            {formFields.map((field) => (
              <label key={field.key} className="field">
                <span>{field.label}</span>
                {field.type === 'select' ? (
                  <select value={form[field.key] || ''} onChange={(e) => handleInputChange(field.key, e.target.value)}>
                    <option value="">Select...</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={form[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                  />
                )}
              </label>
            ))}

            <label className="field full-width">
              <span>Deviation Description</span>
              <textarea value={form.description || ''} rows="5" onChange={(e) => handleInputChange('description', e.target.value)} />
            </label>

            <label className="field full-width">
              <span>Root Cause</span>
              <textarea value={form.root_cause || ''} rows="3" onChange={(e) => handleInputChange('root_cause', e.target.value)} />
            </label>

            <label className="field full-width">
              <span>Immediate Action</span>
              <textarea value={form.immediate_action || ''} rows="3" onChange={(e) => handleInputChange('immediate_action', e.target.value)} />
            </label>
          </div>
        </section>

        <aside className="panel ai-panel">
          <div className="panel-header">
            <h2>AI Copilot</h2>
            <span className="status-pill neutral">Processing</span>
          </div>

          <div className="upload-box">
            <label className="upload-button">
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
              Upload deviation file
            </label>
            {selectedFile ? <small>Selected: {selectedFile}</small> : <small>PDF, DOCX, or TXT supported</small>}
          </div>

          <label className="field full-width">
            <span>Deviation text or email</span>
            <textarea
              rows="8"
              placeholder="Paste a deviation report, QA email, or investigation note here..."
              value={draftText}
              onChange={(e) => dispatch({ type: 'deviation/setDraftText', payload: e.target.value })}
            />
          </label>

          <div className="action-row">
            <button className="secondary-btn" onClick={handleTextSubmit} disabled={ai.loading || !draftText.trim()}>
              {ai.loading ? 'Processing...' : 'Analyze with AI'}
            </button>
          </div>

          {ai.error && <div className="message error">{ai.error}</div>}
          {ai.success && <div className="message success">{ai.success}</div>}
          {save.success && <div className="message success">{save.success}</div>}
          {save.error && <div className="message error">{save.error}</div>}

          <div className="impact-card">
            <div className="impact-header">
              <span>Impact / Severity Recommendation</span>
              {ai.impact && <span className={impactBadgeClass}>{ai.impact.severity}</span>}
            </div>

            {ai.impact ? (
              <>
                <p className="impact-reason">{ai.impact.reason}</p>
                <ul>
                  {ai.impact.recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="impact-placeholder">The AI assessment will appear here after processing the intake content.</p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
