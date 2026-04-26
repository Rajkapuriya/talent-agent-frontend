import { useParams } from 'react-router-dom';
import { usePipelineStore } from '../store/usePipelineStore';
import { usePipelineSSE } from '../hooks/usePipelineSSE';
import StageStatus from '../components/pipeline/StageStatus';
import PipelineProgress from '../components/pipeline/PipelineProgress';
import PageWrapper from '../components/layout/PageWrapper';

const STAGE_DEFS = [
  {
    key: 'parsing',
    label: 'Parsing JD',
    description: 'Extracting skills, seniority, deal-breakers',
  },
  {
    key: 'discovered',
    label: 'Candidate discovery',
    description: 'Semantic vector search + hard filters',
  },
  {
    key: 'scoring',
    label: 'Match scoring',
    description: 'Skills coverage, seniority, experience depth',
  },
  {
    key: 'engaging',
    label: 'Outreach simulation',
    description: 'Conversational interest assessment',
  },
  {
    key: 'ranking',
    label: 'Building shortlist',
    description: 'Combined score + tier classification',
  },
  { key: 'complete', label: 'Ready', description: 'Shortlist generated' },
];

export default function PipelineRun() {
  const { jobId, runId } = useParams();
  const { stages, shortlistId, error } = usePipelineStore();
  usePipelineSSE(runId);

  const completedCount = STAGE_DEFS.filter(
    (s) => stages[s.key]?.status === 'done',
  ).length;
  const progressPct = Math.round((completedCount / STAGE_DEFS.length) * 100);

  return (
    <PageWrapper title="Pipeline running">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Progress</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 bg-raised rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-teal rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="space-y-3">
        {STAGE_DEFS.map((stage, i) => (
          <StageStatus
            key={stage.key}
            label={stage.label}
            description={stage.description}
            status={stages[stage.key]?.status ?? 'idle'}
            data={stages[stage.key]?.data}
            index={i + 1}
          />
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* CTA when complete */}
      {shortlistId && (
        <div className="mt-8 p-6 bg-tier-1-bg border border-brand-teal/20 rounded-xl">
          <p className="font-semibold font-display mb-1">Shortlist ready</p>
          <p className="text-sm text-text-secondary mb-4">
            Candidates ranked by combined Match + Interest score.
          </p>
          <a
            href={`/shortlist/${jobId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5
              bg-sidebar text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            View shortlist →
          </a>
        </div>
      )}
    </PageWrapper>
  );
}
