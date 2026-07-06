import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllReviews, createReview, updateReview } from '../../api/reviewApi';
import { getAllAppraisals, updateAppraisalStatus } from '../../api/appraisalApi';
import { getAllSelfEvals } from '../../api/selfEvalApi';
import type { ReviewResponse } from '../../interfaces/review';
import type { AppraisalResponse } from '../../interfaces/appraisal';
import type { SelfEvaluationResponse } from '../../interfaces/selfEval';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Star, AlertCircle } from 'lucide-react';

const StarRating = ({ value }: { value?: number | null }) => {
  if (value == null) return <span className="text-xs text-gray-400">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(v => (
        <Star key={v} size={14} className={v <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
      ))}
      <span className="ml-1 text-xs text-gray-500">{value}/5</span>
    </div>
  );
};

const REVIEWED_STATUSES = ['REVIEWED', 'APPROVED'];

export const PendingReviewsPage = () => {
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState<AppraisalResponse[]>([]);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [selfEvals, setSelfEvals] = useState<SelfEvaluationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [target, setTarget] = useState<AppraisalResponse | null>(null);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getAllAppraisals(), getAllReviews(), getAllSelfEvals()])
      .then(([apps, revs, evals]) => {
        setAppraisals(apps.filter(a => a.managerId === user?.id));
        setReviews(revs.filter(r => r.managerId === user?.id));
        setSelfEvals(evals);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user]);

  const pendingReview = useMemo(
    () => appraisals.filter(a => a.status === 'SUBMITTED'),
    [appraisals]
  );
  const completedReview = useMemo(
    () => appraisals.filter(a => REVIEWED_STATUSES.includes(a.status)),
    [appraisals]
  );

  const reviewFor = (appraisalId: number) => reviews.find(r => r.appraisalId === appraisalId) || null;
  const selfEvalFor = (a: AppraisalResponse) =>
    selfEvals.find(e => e.userId === a.employeeId && e.appraisalCycleId === a.cycleId) || null;

  const isLocked = target ? REVIEWED_STATUSES.includes(target.status) : false;

  const openModal = (a: AppraisalResponse) => {
    const existing = reviewFor(a.id);
    setTarget(a);
    setRating(existing?.performanceRating ?? 0);
    setComments(existing?.comments ?? '');
    setStrengths(existing?.strengths ?? '');
    setImprovements(existing?.improvements ?? '');
    setReviewError(null);
  };

  const closeModal = () => { setTarget(null); setReviewError(null); };

  async function handleSave(submit: boolean) {
    if (!target || !user) return;
    setReviewError(null);

    if (submit && rating < 1) {
      setReviewError('Please select a rating before submitting.');
      return;
    }

    setIsSaving(true);
    try {
      const existing = reviewFor(target.id);
      const payload = {
        appraisalId: target.id,
        employeeId: target.employeeId,
        managerId: user.id,
        performanceRating: rating || 1,
        comments: comments.trim(),
        strengths: strengths.trim() || undefined,
        improvements: improvements.trim() || undefined,
        status: submit ? 'SUBMITTED' : 'DRAFT',
      };

      if (existing) await updateReview(existing.id, payload);
      else await createReview(payload);

      if (submit) {
        await updateAppraisalStatus(target.id, 'REVIEWED');
      }

      closeModal();
      load();
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Could not save this review. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return <Spinner />;

  const targetSelfEval = target ? selfEvalFor(target) : null;

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Pending Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Team appraisals waiting on your review, across every cycle</p>
      </div>

      {/* Pending */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          Pending Review
          {pendingReview.length > 0 && (
            <span className="rounded-full bg-[#0E4CB7] px-2 py-0.5 text-xs text-white">{pendingReview.length}</span>
          )}
        </h2>
        <div className="card p-0 overflow-hidden">
          {pendingReview.length === 0 ? (
            <EmptyState message="Nothing waiting on your review right now." icon="✅" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr>
                  <th className="table-header">Employee</th>
                  <th className="table-header hidden sm:table-cell">Cycle</th>
                  <th className="table-header">Status</th>
                  <th className="table-header hidden md:table-cell">Self Evaluation</th>
                  <th className="table-header">Actions</th>
                </tr></thead>
                <tbody>
                  {pendingReview.map(a => (
                    <tr key={a.id} className="hover:bg-[#F4F8FF] transition-colors">
                      <td className="table-cell font-medium">{a.employeeName}</td>
                      <td className="table-cell hidden sm:table-cell text-gray-500">{a.cycleName}</td>
                      <td className="table-cell"><StatusBadge status={a.status} /></td>
                      <td className="table-cell hidden md:table-cell">
                        {selfEvalFor(a) ? (
                          <span className="badge bg-green-100 text-green-700">Submitted</span>
                        ) : (
                          <span className="badge bg-gray-100 text-gray-500">Not submitted</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <button onClick={() => openModal(a)} className="btn-primary !px-3 !py-1.5 text-xs">
                          {reviewFor(a.id) ? 'Continue Review' : 'Review'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">Review History</h2>
        <div className="card p-0 overflow-hidden">
          {completedReview.length === 0 ? (
            <EmptyState message="No completed reviews yet." icon="📋" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr>
                  <th className="table-header">Employee</th>
                  <th className="table-header hidden sm:table-cell">Cycle</th>
                  <th className="table-header">Status</th>
                  <th className="table-header hidden md:table-cell">My Rating</th>
                  <th className="table-header hidden lg:table-cell">Comments</th>
                  <th className="table-header">Actions</th>
                </tr></thead>
                <tbody>
                  {completedReview.map(a => {
                    const rev = reviewFor(a.id);
                    return (
                      <tr key={a.id} className="hover:bg-[#F4F8FF] transition-colors">
                        <td className="table-cell font-medium">{a.employeeName}</td>
                        <td className="table-cell hidden sm:table-cell text-gray-500">{a.cycleName}</td>
                        <td className="table-cell"><StatusBadge status={a.status} /></td>
                        <td className="table-cell hidden md:table-cell"><StarRating value={rev?.performanceRating} /></td>
                        <td className="table-cell hidden lg:table-cell max-w-xs">
                          {rev?.comments ? (
                            <p className="truncate text-gray-500" title={rev.comments}>{rev.comments}</p>
                          ) : <span className="text-xs text-gray-400">—</span>}
                        </td>
                        <td className="table-cell">
                          <button onClick={() => openModal(a)} className="btn-secondary !px-3 !py-1.5 text-xs">View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!target}
        onClose={closeModal}
        title="Review Appraisal"
        description={target ? `${target.employeeName} · ${target.cycleName}` : undefined}
      >
        <div className="space-y-4">
          {targetSelfEval && (
            <>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Achievements</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{targetSelfEval.achievements}</p>
              </div>
              {targetSelfEval.challenges && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Challenges</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{targetSelfEval.challenges}</p>
                </div>
              )}
              {targetSelfEval.comments && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Employee Comments</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{targetSelfEval.comments}</p>
                </div>
              )}
            </>
          )}

          {!targetSelfEval && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <AlertCircle size={14} /> This employee hasn't submitted a self evaluation for this cycle yet.
            </p>
          )}

          <div>
            <label className="label">Your Rating <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} type="button" disabled={isLocked} onClick={() => setRating(v)} aria-label={`Rate ${v} out of 5`} className="disabled:cursor-not-allowed">
                  <Star size={24} className={v <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Comments</label>
            <textarea value={comments} onChange={e => setComments(e.target.value)} disabled={isLocked} rows={3}
              placeholder="Your overall feedback on this employee's performance..."
              className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Strengths</label>
              <textarea value={strengths} onChange={e => setStrengths(e.target.value)} disabled={isLocked} rows={2}
                placeholder="Key strengths..." className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500" />
            </div>
            <div>
              <label className="label">Improvements</label>
              <textarea value={improvements} onChange={e => setImprovements(e.target.value)} disabled={isLocked} rows={2}
                placeholder="Areas to improve..." className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500" />
            </div>
          </div>

          {reviewError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-200">{reviewError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={closeModal} className="btn-secondary">Cancel</button>
            <button onClick={() => handleSave(false)} disabled={isSaving || isLocked} className="btn-secondary disabled:opacity-50">
              {isLocked ? 'Submitted' : isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button onClick={() => handleSave(true)} disabled={isSaving || isLocked} className="btn-primary">
              {isLocked ? 'Submitted' : isSaving ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
