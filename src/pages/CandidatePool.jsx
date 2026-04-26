import { useEffect, useState, useCallback } from 'react';
import { createCandidate, deleteCandidate, getCandidates, updateCandidate } from '../api/candidates.api';
import PageWrapper from '../components/layout/PageWrapper';
import CandidateAvatar from '../components/ui/CandidateAvatar';
import SkillTag from '../components/ui/SkillTag';
import { LoadingRows } from '../components/ui/LoadingPulse';
import { toTitleCase, timeAgo } from '../utils/formatters';

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'actively_looking', label: 'Actively looking' },
  { value: 'open', label: 'Open' },
  { value: 'not_looking', label: 'Not looking' },
];

export default function CandidatePool() {
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('');
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [form, setForm] = useState(getEmptyCandidateForm());
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCandidates({
        page,
        limit: 20,
        search,
        availability,
      });
      setCandidates(res.data.candidates);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, availability]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Reset to page 1 on filter change
  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
  };
  const handleAvailability = (v) => {
    setAvailability(v);
    setPage(1);
  };

  const openCreateForm = () => {
    setEditingCandidate(null);
    setForm(getEmptyCandidateForm());
    setShowForm(true);
  };

  const openEditForm = (candidate) => {
    setEditingCandidate(candidate);
    setForm(toCandidateForm(candidate));
    setShowForm(true);
  };

  const closeForm = () => {
    if (submitting) return;
    setShowForm(false);
    setEditingCandidate(null);
    setFormErrors({});
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateCandidateForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length) return;
    setSubmitting(true);
    try {
      const payload = fromCandidateForm(form);
      if (editingCandidate?._id) {
        await updateCandidate(editingCandidate._id, payload);
        showToast('Candidate updated successfully.', 'success');
      } else {
        await createCandidate(payload);
        showToast('Candidate created successfully.', 'success');
      }
      closeForm();
      fetchCandidates();
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.error ?? 'Could not save candidate.';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (candidate) => {
    const ok = window.confirm(`Delete ${candidate.name} from candidate pool?`);
    if (!ok) return;
    try {
      await deleteCandidate(candidate._id);
      showToast('Candidate deleted.', 'success');
      fetchCandidates();
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.error ?? 'Could not delete candidate.';
      showToast(message, 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  return (
    <PageWrapper title="Candidate pool">
      {/* Filters */}
      {toast && (
        <div
          className={`mb-4 px-3 py-2 rounded-lg text-sm border ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, skill, or role..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 max-w-sm px-3 py-2 text-sm border border-border rounded-lg bg-canvas
                     focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
        />
        <select
          value={availability}
          onChange={(e) => handleAvailability(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-canvas
                     focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
        >
          {AVAILABILITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {pagination && (
          <span className="text-xs text-text-secondary ml-auto">
            {pagination.total} candidates
          </span>
        )}
        <button
          onClick={openCreateForm}
          className="px-3 py-2 text-sm rounded-lg bg-brand-teal text-white hover:opacity-90 transition-opacity"
        >
          Add candidate
        </button>
      </div>

      {/* Table */}
      <div className="bg-canvas border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border text-xs text-text-secondary uppercase tracking-wide">
              <th className="px-6 py-3 text-left font-medium">Candidate</th>
              <th className="px-6 py-3 text-left font-medium">Skills</th>
              <th className="px-4 py-3 text-left font-medium">Experience</th>
              <th className="px-4 py-3 text-left font-medium">Availability</th>
              <th className="px-4 py-3 text-left font-medium">Active</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <LoadingRows count={8} />
            ) : candidates.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-text-tertiary text-sm"
                >
                  No candidates found. Try seeding some via the API.
                </td>
              </tr>
            ) : (
              candidates.map((c) => (
                <CandidateRow
                  key={c._id}
                  candidate={c}
                  onEdit={() => openEditForm(c)}
                  onDelete={() => handleDelete(c)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-2xl bg-canvas border border-border rounded-xl p-5 space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {editingCandidate ? 'Edit candidate' : 'Create candidate'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input className="input-modern w-full" placeholder="Name*" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
              </div>
              <input className="input-modern" placeholder="Headline" value={form.headline} onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))} />
              <input className="input-modern" placeholder="Current role" value={form.currentRole} onChange={(e) => setForm((f) => ({ ...f, currentRole: e.target.value }))} />
              <input className="input-modern" placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              <input className="input-modern" placeholder="Seniority level" value={form.seniorityLevel} onChange={(e) => setForm((f) => ({ ...f, seniorityLevel: e.target.value }))} />
              <input className="input-modern" placeholder="Employment preference" value={form.employmentTypePreference} onChange={(e) => setForm((f) => ({ ...f, employmentTypePreference: e.target.value }))} />
              <div>
                <input type="number" min={0} max={50} className="input-modern w-full" placeholder="Years experience*" value={form.yearsExperience} onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))} required />
                {formErrors.yearsExperience && <p className="text-xs text-red-600 mt-1">{formErrors.yearsExperience}</p>}
              </div>
              <div>
                <input type="number" min={0} className="input-modern w-full" placeholder="Last active days ago" value={form.lastActiveDaysAgo} onChange={(e) => setForm((f) => ({ ...f, lastActiveDaysAgo: e.target.value }))} />
                {formErrors.lastActiveDaysAgo && <p className="text-xs text-red-600 mt-1">{formErrors.lastActiveDaysAgo}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select className="input-modern" value={form.availabilitySignal} onChange={(e) => setForm((f) => ({ ...f, availabilitySignal: e.target.value }))}>
                {AVAILABILITY_OPTIONS.filter((o) => o.value).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <label className="text-sm text-text-secondary flex items-center gap-2">
                <input type="checkbox" checked={form.remoteOpen} onChange={(e) => setForm((f) => ({ ...f, remoteOpen: e.target.checked }))} />
                Open to remote
              </label>
            </div>
            <div>
              <input className="input-modern w-full" placeholder="Skills (comma separated)*" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} required />
              {formErrors.skills && <p className="text-xs text-red-600 mt-1">{formErrors.skills}</p>}
            </div>
            <input className="input-modern" placeholder="Education" value={form.education} onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))} />
            <textarea rows={3} className="input-modern resize-none" placeholder="Summary" value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />

            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeForm} className="px-3 py-2 text-sm border border-border rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-3 py-2 text-sm rounded-lg bg-brand-teal text-white">
                {submitting ? 'Saving...' : editingCandidate ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-border rounded-lg text-text-secondary
                       hover:bg-surface disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="text-text-secondary">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border border-border rounded-lg text-text-secondary
                       hover:bg-surface disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </PageWrapper>
  );
}

function CandidateRow({ candidate: c, onEdit, onDelete }) {
  const availColor = {
    actively_looking: 'text-brand-teal',
    open: 'text-brand-amber',
    not_looking: 'text-text-tertiary',
  };

  return (
    <tr className="hover:bg-surface transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <CandidateAvatar name={c.name} size={32} />
          <div>
            <p className="font-medium text-text-primary">{c.name}</p>
            <p className="text-xs text-text-secondary truncate max-w-[200px]">
              {c.headline}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {c.skills?.slice(0, 3).map((s) => (
            <SkillTag key={s} label={s} />
          ))}
          {c.skills?.length > 3 && (
            <span className="text-xs text-text-tertiary self-center">
              +{c.skills.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-text-secondary">{c.yearsExperience}y</td>
      <td className="px-4 py-4">
        <span
          className={`text-xs font-medium ${availColor[c.availabilitySignal] ?? 'text-text-tertiary'}`}
        >
          {toTitleCase(c.availabilitySignal)}
        </span>
      </td>
      <td className="px-4 py-4 text-xs text-text-tertiary font-mono">
        {timeAgo(c.updatedAt)}
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <button onClick={onEdit} className="px-2 py-1 text-xs border border-border rounded hover:bg-surface">
            Edit
          </button>
          <button onClick={onDelete} className="px-2 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function getEmptyCandidateForm() {
  return {
    name: '',
    headline: '',
    currentRole: '',
    yearsExperience: 0,
    skills: '',
    education: '',
    location: '',
    remoteOpen: true,
    employmentTypePreference: '',
    lastActiveDaysAgo: 30,
    availabilitySignal: 'open',
    summary: '',
    seniorityLevel: 'mid',
  };
}

function toCandidateForm(candidate) {
  return {
    name: candidate.name ?? '',
    headline: candidate.headline ?? '',
    currentRole: candidate.currentRole ?? '',
    yearsExperience: candidate.yearsExperience ?? 0,
    skills: Array.isArray(candidate.skills) ? candidate.skills.join(', ') : '',
    education: candidate.education ?? '',
    location: candidate.location ?? '',
    remoteOpen: Boolean(candidate.remoteOpen),
    employmentTypePreference: candidate.employmentTypePreference ?? '',
    lastActiveDaysAgo: candidate.lastActiveDaysAgo ?? 30,
    availabilitySignal: candidate.availabilitySignal ?? 'open',
    summary: candidate.summary ?? '',
    seniorityLevel: candidate.seniorityLevel ?? 'mid',
  };
}

function fromCandidateForm(form) {
  return {
    name: form.name.trim(),
    headline: form.headline.trim(),
    currentRole: form.currentRole.trim(),
    yearsExperience: Number(form.yearsExperience),
    skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    education: form.education.trim(),
    location: form.location.trim(),
    remoteOpen: Boolean(form.remoteOpen),
    employmentTypePreference: form.employmentTypePreference.trim(),
    lastActiveDaysAgo: Number(form.lastActiveDaysAgo),
    availabilitySignal: form.availabilitySignal,
    summary: form.summary.trim(),
    seniorityLevel: form.seniorityLevel.trim(),
  };
}

function validateCandidateForm(form) {
  const errors = {};
  if (!form.name?.trim() || form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }
  const years = Number(form.yearsExperience);
  if (!Number.isFinite(years) || years < 0 || years > 50) {
    errors.yearsExperience = 'Years of experience must be between 0 and 50.';
  }
  const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
  if (!skills.length) {
    errors.skills = 'Add at least one skill.';
  }
  const lastActive = Number(form.lastActiveDaysAgo);
  if (!Number.isFinite(lastActive) || lastActive < 0) {
    errors.lastActiveDaysAgo = 'Last active days must be 0 or more.';
  }
  return errors;
}
