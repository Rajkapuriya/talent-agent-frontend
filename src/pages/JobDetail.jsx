import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, deleteJob } from '../api/jobs.api';
import { startPipeline } from '../api/pipeline.api';
import PageWrapper from '../components/layout/PageWrapper';
import SkillTag from '../components/ui/SkillTag';
import StatusPill from '../components/ui/StatusPill';
import Spinner from '../components/ui/Spinner';
import LoadingPulse from '../components/ui/LoadingPulse';
import { formatDate } from '../utils/formatters';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getJob(id)
      .then((res) => setJob(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRunPipeline = async () => {
    setRunning(true);
    try {
      const { data } = await startPipeline({ jobId: id });
      navigate(`/pipeline/${id}/${data.runId}`);
    } catch (err) {
      console.error(err);
      setRunning(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this job and all associated results?')) return;
    setDeleting(true);
    await deleteJob(id);
    navigate('/');
  };

  if (loading) return <LoadingPulse />;
  if (!job) return null;

  const jd = job.structured;
  const canRun = ['draft', 'parsed', 'error'].includes(job.status);

  return (
    <PageWrapper title={jd?.jobTitle ?? 'Job detail'} back="/">
      <div className="grid grid-cols-12 gap-6">
        {/* Left: metadata + actions */}
        <div className="col-span-4 space-y-4">
          <div className="bg-canvas border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <StatusPill status={job.status} />
              <span className="text-xs text-text-tertiary font-mono">
                {formatDate(job.createdAt)}
              </span>
            </div>

            {jd && (
              <div className="space-y-3 text-sm">
                <Row label="Domain" value={jd.domain} />
                <Row label="Seniority" value={jd.seniorityLevel} />
                <Row label="Industry" value={jd.industry} />
                <Row label="Remote" value={jd.remotePolicy} />
                <Row label="Employment" value={jd.employmentType} />
                <Row
                  label="Min exp."
                  value={
                    jd.yearsExperienceMin ? `${jd.yearsExperienceMin}y` : '—'
                  }
                />
                <Row
                  label="Parse quality"
                  value={
                    jd.parseQuality
                      ? `${Math.round(jd.parseQuality * 100)}%`
                      : '—'
                  }
                />
              </div>
            )}

            <div className="pt-3 border-t border-border space-y-2">
              {canRun && (
                <button
                  onClick={handleRunPipeline}
                  disabled={running}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-sidebar text-white
                             text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-60 transition-colors"
                >
                  {running ? <Spinner size={14} /> : null}
                  {running ? 'Starting...' : 'Run talent pipeline →'}
                </button>
              )}

              {job.status === 'complete' && (
                <Link
                  to={`/shortlist/${id}`}
                  className="flex items-center justify-center py-2.5 bg-tier-1-bg border border-brand-teal/20
                             text-brand-teal text-sm font-medium rounded-lg hover:bg-teal-100 transition-colors"
                >
                  View shortlist →
                </Link>
              )}

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-2 text-xs text-text-tertiary hover:text-red-600 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete job'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: JD breakdown */}
        <div className="col-span-8 space-y-4">
          {jd ? (
            <>
              {/* Required skills */}
              <Section title="Required skills">
                <div className="flex flex-wrap gap-1.5">
                  {jd.requiredSkills?.map((s) => (
                    <SkillTag key={s} label={s} variant="strength" />
                  ))}
                </div>
              </Section>

              {/* Preferred skills */}
              {jd.preferredSkills?.length > 0 && (
                <Section title="Preferred skills">
                  <div className="flex flex-wrap gap-1.5">
                    {jd.preferredSkills.map((s) => (
                      <SkillTag key={s} label={s} />
                    ))}
                  </div>
                </Section>
              )}

              {/* Responsibilities */}
              {jd.keyResponsibilities?.length > 0 && (
                <Section title="Key responsibilities">
                  <ul className="space-y-1.5 text-sm text-text-secondary">
                    {jd.keyResponsibilities.map((r, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-text-tertiary shrink-0">·</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Deal-breakers */}
              {jd.dealBreakers?.length > 0 && (
                <Section title="Deal-breakers">
                  <div className="flex flex-wrap gap-1.5">
                    {jd.dealBreakers.map((d) => (
                      <SkillTag key={d} label={d} variant="gap" />
                    ))}
                  </div>
                </Section>
              )}

              {/* Screening questions */}
              {jd.screeningQuestions?.length > 0 && (
                <Section title="Screening questions">
                  <ol className="space-y-1.5 text-sm text-text-secondary list-decimal list-inside">
                    {jd.screeningQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </Section>
              )}
            </>
          ) : (
            /* Raw JD before parsing */
            <Section title="Raw job description">
              <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
                {job.rawJd}
              </pre>
            </Section>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-text-tertiary">{label}</span>
      <span className="font-medium capitalize">{value ?? '—'}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-canvas border border-border rounded-xl p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
