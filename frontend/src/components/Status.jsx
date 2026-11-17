import React from 'react';
import { AlertCircle, Circle, CircleCheck, LoaderCircle } from 'lucide-react';

const stageLabels = [
  { id: 'reading-image', label: 'Reading image' },
  { id: 'extracting-labels', label: 'Extracting labels' },
  { id: 'identifying-visual-elements', label: 'Identifying visual elements' },
  { id: 'understanding-color-relationships', label: 'Understanding color relationships' },
  { id: 'preparing-accessible-output', label: 'Preparing accessible output' },
];

export function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-heading-action">{action}</div>}</div>;
}

export function RequestStatus({ state }) {
  if (!state) return null;
  const progress = state.progress;
  const actualStages = Array.isArray(progress?.stages) ? progress.stages : [];
  const stages = stageLabels.map((fallback) => actualStages.find((stage) => stage.id === fallback.id) || { ...fallback, status: 'pending', progress: 0 });
  const isUploading = progress?.status === 'uploading';

  return <div className={`request-status ${state.kind || ''}`} role={state.kind === 'error' ? 'alert' : 'status'} aria-live="polite">
    {state.kind === 'success' ? <CircleCheck size={19}/> : state.kind === 'error' ? <AlertCircle size={19}/> : <LoaderCircle className="status-spin" size={19}/>}
    <div className="request-status-content">
      <strong>{isUploading ? `Uploading image${Number.isFinite(progress.uploadProgress) ? ` · ${progress.uploadProgress}%` : ''}` : state.title}</strong>
      {state.message && <p>{state.message}</p>}
      {state.kind === 'loading' && <>
        {isUploading && <div className="upload-progress-track" role="progressbar" aria-label="Image upload progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress.uploadProgress || 0}><span style={{ width: `${progress.uploadProgress || 0}%` }}/></div>}
        <ol className="analysis-stage-list" aria-label="Image analysis stages">
          {stages.map((stage) => {
            const status = stage.status || 'pending';
            const Icon = status === 'complete' ? CircleCheck : status === 'active' ? LoaderCircle : status === 'failed' ? AlertCircle : Circle;
            const accessibleStatus = status === 'complete' ? 'Complete' : status === 'active' ? 'In progress' : status === 'failed' ? 'Could not complete' : 'Not started';
            return <li key={stage.id} className={`analysis-stage stage-${status}`} aria-current={status === 'active' ? 'step' : undefined}>
              <Icon className={status === 'active' ? 'status-spin' : ''} size={15} aria-hidden="true"/>
              <span><strong>{stage.label}</strong><span className="sr-only">{accessibleStatus}</span>{status === 'active' && stage.message && <small>{stage.message}</small>}</span>
              {status === 'active' && Number.isFinite(stage.progress) && stage.progress > 0 && <small className="stage-progress-number">{stage.progress}%</small>}
            </li>;
          })}
        </ol>
      </>}
    </div>
  </div>;
}
