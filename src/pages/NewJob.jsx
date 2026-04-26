import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createJob } from '../api/jobs.api';
import { startPipeline } from '../api/pipeline.api';
import PageWrapper from '../components/layout/PageWrapper';
import Spinner from '../components/ui/Spinner';

const schema = z.object({
  rawJd: z
    .string()
    .min(200, 'Please paste the full job description (min 200 characters)'),
});

export default function NewJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const charCount = watch('rawJd')?.length ?? 0;

  const onSubmit = async ({ rawJd }) => {
    setLoading(true);
    try {
      // 1. Create job document
      const { data: job } = await createJob({ rawJd });
      // 2. Kick off pipeline immediately
      const {
        data: { runId },
      } = await startPipeline({ jobId: job._id });
      // 3. Navigate to live progress view
      navigate(`/pipeline/${job._id}/${runId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="New job" back="/">
      <div className="surface-card max-w-3xl p-6 sm:p-8">
        <p className="mb-6 text-sm text-slate-600">
          Paste the full job description below. The AI agent will parse it,
          discover matching candidates, simulate outreach, and build a ranked
          shortlist.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Job description
            </label>
            <textarea
              {...register('rawJd')}
              rows={18}
              placeholder="Paste the full JD here — including responsibilities, requirements, and any must-haves..."
              className="input-modern min-h-[350px] resize-none font-mono"
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-red-600">{errors.rawJd?.message}</p>
              <p className="text-xs text-slate-400">{charCount} chars</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? <Spinner /> : null}
            {loading ? 'Starting pipeline...' : 'Run talent pipeline →'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
