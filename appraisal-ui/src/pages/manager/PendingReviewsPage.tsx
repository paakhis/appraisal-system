import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllReviews, createReview, updateReview } from '../../api/reviewApi';
import { getAllAppraisals } from '../../api/appraisalApi';
import { getAllSelfEvals } from '../../api/selfEvalApi';
import type { ReviewResponse } from '../../interfaces/review';
import type { AppraisalResponse } from '../../interfaces/appraisal';
import type { SelfEvaluationResponse } from '../../interfaces/selfEval';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { RatingStars } from '../../components/common/RatingStars';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const PendingReviewsPage = () => {
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState<AppraisalResponse[]>([]);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [selfEvals, setSelfEvals] = useState<SelfEvaluationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [target, setTarget] = useState<AppraisalResponse | null>(null);
  const [managerRating, setManagerRating] = useState(0);
  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [revs, apps, evals] = await Promise.all([getAllReviews(), getAllAppraisals(), getAllSelfEvals()]);
      setReviews(revs);
      setAppraisals(apps.filter(a => a.managerId === user?.id && a.status !== 'DRAFT'));
      setSelfEvals(evals);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load().catch(() => setLoading(false)); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user]);

  const reviewFor = (appraisalId: number) => reviews.find(r => r.appraisalId === appraisalId) || null;
  const selfEvalFor = (a: AppraisalResponse) =>
    selfEvals.find(e => e.userId === a.employeeId && e.appraisalCycleId === a.cycleId) || null;

  const pending = useMemo(
    () => appraisals.filter(a => {
      const r = reviewFor(a.id);
      return !r || r.status === 'DRAFT';
    }),
    [appraisals, reviews]
  );

  const completed = useMemo(
    () => appraisals.filter(a => {
      const r = reviewFor(a.id);
      return !!r && (r.status === 'SUBMITTED' || r.status === 'APPROVED');
    }),
    [appraisals, reviews]
  );

  const targetReview = target ? reviewFor(target.id) : null;
  const targetSelfEval = target ? selfEvalFor(target) : null;
  const isLocked = targetReview ? targetReview.status !== 'DRAFT' : false;

  const openModal = (a: AppraisalResponse) => {
    const r = reviewFor(a.id);
    setTarget(a);
    setManagerRating(r?.performanceRating ?? 0);
    setComments(r?.comments ?? '');
    setStrengths(r?.strengths ?? '');
    setImprovements(r?.improvements ?? '');
    setFormError(null);
  };

  const closeModal = () => { setTarget(null); setFormError(null); };

  const handleSave = async (submit: boolean) => {
    if (!target || !user) return;
    if (isLocked) return;
    setFormError(null);

    if (submit && managerRating < 1) {
      setFormError('Please select a rating before submitting.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        appraisalId: target.id,
        employeeId: target.employeeId,
        managerId: user.id,
        performanceRating: managerRating || 1,
        comments: comments.trim(),
        strengths: strengths.trim() || undefined,
        improvements: improvements.trim() || undefined,
        status: submit ? 'SUBMITTED' : 'DRAFT',
      };

      const existing = reviewFor(target.id);
      if (existing) await updateReview(existing.id, payload);
      else await createReview(payload);

      closeModal();
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save this review. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Team appraisals waiting on your review, across every cycle</p>
      </div>

      {/* Pending Review */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center">
          Pending Review
          {pending.length > 0 && (
            <span className="ml-2 rounded-full bg-[#0E4CB7] px-2 py-0.5 text-xs text-white">{pending.length}</span>
          )}
        </h2>
        <div className="card p-0 overflow-hidden">
          {pending.length === 0 ? (
            <EmptyState message="Nothing waiting on your review right now." icon="✅" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="table-header">Employee</th>
                    <th className="table-header">Cycle</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Self Rating</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map(a => {
                    const r = reviewFor(a.id);
                    return (
                      <tr key={a.id} className="hover:bg-[#F4F8FF] transition-colors">
                        <td className="table-cell font-medium text-gray-800">{a.employeeName}</td>
                        <td className="table-cell">{a.cycleName}</td>
                        <td className="table-cell"><StatusBadge status={a.status} /></td>
                        <td className="table-cell"><RatingStars value={a.selfRating} showValue size={16} /></td>
                        <td className="table-cell">
                          <button onClick={() => openModal(a)} className="btn-primary !px-3 !py-1.5 text-xs">
                            {r?.status === 'DRAFT' ? 'Continue Review' : 'Review'}
                          </button>
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

      {/* Review History */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">Review History</h2>
        <div className="card p-0 overflow-hidden">
          {completed.length === 0 ? (
            <EmptyState message="No completed reviews yet." icon="📋" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="table-header">Employee</th>
                    <th className="table-header">Cycle</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Self Rating</th>
                    <th className="table-header">My Rating</th>
                    <th className="table-header">Comments</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {completed.map(a => {
                    const r = reviewFor(a.id);
                    return (
                      <tr key={a.id} className="hover:bg-[#F4F8FF] transition-colors">
                        <td className="table-cell font-medium text-gray-800">{a.employeeName}</td>
                        <td className="table-cell">{a.cycleName}</td>
                        <td className="table-cell"><StatusBadge status={a.status} /></td>
                        <td className="table-cell"><RatingStars value={a.selfRating} showValue size={16} /></td>
                        <td className="table-cell"><RatingStars value={r?.performanceRating} showValue size={16} /></td>
                        <td className="table-cell max-w-xs">
                          {r?.comments ? (
                            <p className="truncate text-gray-500" title={r.comments}>{r.comments}</p>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="table-cell">
                          <button onClick={() => openModal(a)} className="btn-secondary !px-3 !py-1.5 text-xs">
                            View
                          </button>
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
      {target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-[#D6E4FF]">
            <div className="flex items-start justify-between px-6 pt-6">
              <div>
                <h3 className="font-semibold text-gray-800">Review Appraisal</h3>
                <p className="text-xs text-gray-400 mt-0.5">{target.employeeName} — {target.cycleName}</p>
              </div>
              <button onClick={closeModal}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-xl border border-[#D6E4FF] bg-[#F4F8FF] px-4 py-3">
                <p className="text-xs font-medium text-[#0E4CB7] mb-1">Self rating</p>
                <RatingStars value={target.selfRating} showValue size={18} />
              </div>

              {targetSelfEval?.achievements && (
                <div>
                  <p className="label mb-1">Achievements</p>
                  <p className="text-sm text-gray-600">{targetSelfEval.achievements}</p>
                </div>
              )}
              {targetSelfEval?.challenges && (
                <div>
                  <p className="label mb-1">Challenges</p>
                  <p className="text-sm text-gray-600">{targetSelfEval.challenges}</p>
                </div>
              )}
              {targetSelfEval?.comments && (
                <div>
                  <p className="label mb-1">Employee Comments</p>
                  <p className="text-sm text-gray-600">{targetSelfEval.comments}</p>
                </div>
              )}

              <div>
                <label className="label">Your Rating {!isLocked && <span className="text-red-400">*</span>}</label>
                <RatingStars value={managerRating} editable={!isLocked} onChange={setManagerRating} showValue size={22} />
              </div>

              <div>
                <label className="label">Comments</label>
                <textarea
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  disabled={isLocked}
                  rows={3}
                  placeholder="Your feedback on this employee's performance..."
                  className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Strengths</label>
                  <textarea
                    value={strengths}
                    onChange={e => setStrengths(e.target.value)}
                    disabled={isLocked}
                    rows={2}
                    placeholder="Key strengths..."
                    className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="label">Improvements</label>
                  <textarea
                    value={improvements}
                    onChange={e => setImprovements(e.target.value)}
                    disabled={isLocked}
                    rows={2}
                    placeholder="Areas to improve..."
                    className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {formError && (
                <div className="flex items-start gap-2 text-sm px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {isLocked && (
                <div className="flex items-start gap-2 text-sm px-4 py-3 rounded-xl bg-green-50 text-green-700 border border-green-200">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <span>This review has already been submitted and can no longer be edited.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">

                <button
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  {isLocked ? "Close" : "Cancel"}
                </button>

                {!isLocked && (
                  <>
                    <button
                      onClick={() => handleSave(false)}
                      disabled={saving}
                      className="btn-secondary"
                    >
                      {saving ? "Saving..." : "Save Draft"}
                    </button>

                    <button
                      onClick={() => handleSave(true)}
                      disabled={saving}
                      className="btn-primary"
                    >
                      {saving ? "Submitting..." : "Submit Review"}
                    </button>
                  </>
                )}

              </div>                
            </div>
          </div>
        </div>
        
  )
}
</div>
  )};