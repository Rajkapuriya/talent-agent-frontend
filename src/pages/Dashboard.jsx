import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../api/jobs.api';
import StatCard from '../components/ui/StatCard';
import TierBadge from '../components/ui/TierBadge';
import EmptyState from '../components/ui/EmptyState';
import PageWrapper from '../components/layout/PageWrapper';
import { LoadingRows } from '../components/ui/LoadingPulse';
import StatusPill from '../components/ui/StatusPill';
import { formatDate } from '../utils/formatters';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs().then((res) => {
      setJobs(res.data);
      setLoading(false);
    });
  }, []);

  const stats = {
    total: jobs.length,
    running: jobs.filter((j) => j.status === 'running').length,
    complete: jobs.filter((j) => j.status === 'complete').length,
  };

  return (
    <PageWrapper title="Dashboard">
      {/* Stat strip */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total jobs" value={stats.total} />
        <StatCard
          label="Pipelines running"
          value={stats.running}
          accent="amber"
        />
        <StatCard
          label="Shortlists ready"
          value={stats.complete}
          accent="teal"
        />
      </div>

      {/* Job table */}
      <div className="table-modern">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-text-primary font-display">
            Recent jobs
          </h2>
          <Link to="/jobs/new" className="btn-primary px-4 py-2 text-xs">
            + Create job
          </Link>
        </div>

        {loading ? (
          <LoadingRows count={4} />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No jobs yet"
            description="Paste a job description to start your first pipeline."
            action={<Link to="/jobs/new">Create first job</Link>}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                {[
                  'Job title',
                  'Domain',
                  'Status',
                  'Shortlisted',
                  'Created',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="transition-colors hover:bg-blue-50/40"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="font-medium text-slate-800 hover:text-blue-700"
                    >
                      {job.structured?.jobTitle ?? '—'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {job.structured?.domain ?? '—'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={job.status} />
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {job.shortlistCount ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {formatDate(job.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageWrapper>
  );
}
