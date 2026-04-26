import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShortlist } from '../api/shortlist.api';
import ScoreRing from '../components/ui/ScoreRing';
import TierBadge from '../components/ui/TierBadge';
import SkillTag from '../components/ui/SkillTag';
import ConversationViewer from '../components/pipeline/ConversationViewer';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingPulse from '../components/ui/LoadingPulse';
import ScoreDimension from '../components/ui/ScoreDimension';

export default function Shortlist() {
  const { jobId } = useParams();
  const [shortlist, setShortlist] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getShortlist(jobId).then((res) => {
      setShortlist(res.data);
      setSelected(res.data.entries[0]?.candidateId);
    });
  }, [jobId]);

  if (!shortlist) return <LoadingPulse />;

  const selectedEntry = shortlist.entries.find(
    (e) => e.candidateId === selected,
  );

  return (
    <PageWrapper title="Ranked shortlist">
      {/* Aggregate insights strip */}
      {shortlist.aggregateInsights && (
        <div className="mb-6 p-4 bg-canvas border border-border rounded-lg text-sm">
          <span className="font-medium">Market signal:</span>{' '}
          <span className="text-text-secondary">
            {shortlist.aggregateInsights.commonGap}
          </span>
          {shortlist.aggregateInsights.jdCalibrationNote && (
            <span className="ml-4 text-amber-700">
              ⚠ {shortlist.aggregateInsights.jdCalibrationNote}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Left: ranked list */}
        <div className="col-span-5 space-y-2">
          {shortlist.entries.map((entry) => (
            <CandidateRow
              key={entry.candidateId}
              entry={entry}
              selected={selected === entry.candidateId}
              onClick={() => setSelected(entry.candidateId)}
            />
          ))}
        </div>

        {/* Right: candidate detail panel */}
        <div className="col-span-7">
          {selectedEntry && <CandidateDetailPanel entry={selectedEntry} />}
        </div>
      </div>
    </PageWrapper>
  );
}

function CandidateRow({ entry, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all
        ${
          selected
            ? 'border-brand-teal bg-canvas shadow-sm'
            : 'border-border bg-canvas hover:border-border-strong'
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <span className="text-xs font-mono text-text-tertiary w-5">
          #{entry.rank}
        </span>

        {/* Candidate info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-sm truncate">
              {entry.candidate?.name ?? 'Candidate'}
            </span>
            <TierBadge tier={entry.tier} />
          </div>
          <p className="text-xs text-text-secondary truncate">
            {entry.candidate?.headline}
          </p>
        </div>

        {/* Score rings */}
        <div className="flex items-center gap-3 shrink-0">
          <ScoreRing value={Math.round(entry.matchScore)} label="M" size={40} />
          <ScoreRing
            value={Math.round(entry.interestScore)}
            label="I"
            size={40}
          />
        </div>
      </div>
    </button>
  );
}

function CandidateDetailPanel({ entry }) {
  const [tab, setTab] = useState('overview');

  return (
    <div className="bg-canvas border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display font-semibold text-lg">
                {entry.candidate?.name}
              </h2>
              <TierBadge tier={entry.tier} />
            </div>
            <p className="text-text-secondary text-sm">
              {entry.candidate?.headline}
            </p>
          </div>
          {/* Score display */}
          <div className="flex gap-4 shrink-0">
            <div className="text-center">
              <ScoreRing value={Math.round(entry.matchScore)} size={56} />
              <p className="text-xs text-text-secondary mt-1">Match</p>
            </div>
            <div className="text-center">
              <ScoreRing value={Math.round(entry.interestScore)} size={56} />
              <p className="text-xs text-text-secondary mt-1">Interest</p>
            </div>
            <div className="text-center">
              <ScoreRing
                value={Math.round(entry.combinedScore)}
                size={56}
                accent
              />
              <p className="text-xs text-text-secondary mt-1">Combined</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        {['overview', 'match', 'conversation'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-3 px-4 text-sm capitalize border-b-2 -mb-px transition-colors
              ${
                tab === t
                  ? 'border-brand-teal text-text-primary font-medium'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {tab === 'overview' && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              {entry.scoreCard}
            </p>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary mb-2">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {entry.candidate?.skills?.map((s) => (
                  <SkillTag key={s} label={s} />
                ))}
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <span className="text-text-secondary">
                Experience: <strong>{entry.candidate?.yearsExperience}y</strong>
              </span>
              <span className="text-text-secondary">
                Availability:{' '}
                <strong>{entry.interestResult?.availabilityFlag ?? '—'}</strong>
              </span>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium mb-1">
                Recommended next action
              </p>
              <p className="text-sm text-text-secondary">
                {entry.interestResult?.recommendedNextAction}
              </p>
            </div>
          </div>
        )}

        {tab === 'match' && (
          <div className="space-y-5">
            <p className="text-sm text-text-secondary">
              {entry.matchResult?.matchExplanation}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <ScoreDimension
                label="Skills coverage"
                value={entry.matchResult?.skillsCoverage}
              />
              <ScoreDimension
                label="Seniority alignment"
                value={entry.matchResult?.seniorityAlignment}
              />
              <ScoreDimension
                label="Experience depth"
                value={entry.matchResult?.experienceDepth}
              />
              <ScoreDimension
                label="Domain relevance"
                value={entry.matchResult?.domainRelevance}
              />
            </div>
            {entry.matchResult?.skillGaps?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
                  Skill gaps
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.matchResult.skillGaps.map((g) => (
                    <SkillTag key={g} label={g} variant="gap" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'conversation' && (
          <ConversationViewer
            transcript={entry.interestResult?.conversationTranscript ?? []}
          />
        )}
      </div>
    </div>
  );
}
