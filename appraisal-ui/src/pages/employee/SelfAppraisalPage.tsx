import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Pencil, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createSelfEval, getAllSelfEvals, updateSelfEval } from '../../api/selfEvalApi';
import { getAllCycles } from '../../api/cycleApi';
import { getAllAppraisals, updateAppraisalStatus } from '../../api/appraisalApi';
import { getAllReviews } from '../../api/reviewApi';
import type { SelfEvaluationResponse } from '../../interfaces/selfEval';
import type { AppraisalCycleResponse } from '../../interfaces/cycle';
import type { AppraisalResponse } from '../../interfaces/appraisal';
import type { ReviewResponse } from '../../interfaces/review';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const SelfAppraisalPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<AppraisalCycleResponse[]>([]);
  const [appraisals, setAppraisals] = useState<AppraisalResponse[]>([]);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [existing, setExisting] = useState<SelfEvaluationResponse | null>(null);

  const [achievements, setAchievements] = useState('');
  const [challenges, setChallenges] = useState('');
  const [comments, setComments] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCycle = useMemo(() => cycles.find(c => c.active) || null, [cycles]);

  const myAppraisal = useMemo(
    () => appraisals.find(a => a.employeeId === user?.id && a.cycleId === activeCycle?.id) || null,
    [appraisals, user, activeCycle]
  );

  const myReview = useMemo(
    () => reviews.find(r => r.appraisalId === myAppraisal?.id) || null,
    [reviews, myAppraisal]
  );

  // Editable until the assigned appraisal has actually moved past DRAFT (i.e. submitted for review).
  const isEditable = !myAppraisal || myAppraisal.status === 'DRAFT';

  const load = () => {
    setLoading(true);
    Promise.all([getAllCycles(), getAllSelfEvals(), getAllAppraisals(), getAllReviews()])
      .then(([cycleList, evals, apps, revs]) => {
        setCycles(cycleList);
        setAppraisals(apps);
        setReviews(revs);

        const currentActiveCycle = cycleList.find(c => c.active);
        const mine = currentActiveCycle
          ? evals.find(e => e.userId === user?.id && e.appraisalCycleId === currentActiveCycle.id)
          : undefined;

        if (mine) {
          setExisting(mine);
          setAchievements(mine.achievements ?? '');
          setChallenges(mine.challenges ?? '');
          setComments(mine.comments ?? '');
        } else {
          setExisting(null);
          setAchievements('');
          setChallenges('');
          setComments('');
        }
      })
      .catch(() => setFormError('Could not load your self appraisal. Please refresh the page.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user]);

  async function persistSelfEval() {
    if (!user || !activeCycle) return null;
    const payload = {
      userId: user.id,
      appraisalCycleId: activeCycle.id,
      achievements: achievements.trim(),
      challenges: challenges.trim() || undefined,
      comments: comments.trim() || undefined,
    };
    if (existing) {
      return updateSelfEval(existing.id, payload);
    }
    return createSelfEval(payload);
  }

  async function handleSaveDraft() {
    if (!activeCycle) return;
    setFormError(null);
    setInfoMessage(null);

    if (!achievements.trim()) {
      setFormError('Please describe your achievements before saving.');
      return;
    }

    setIsSavingDraft(true);
    try {
      const saved = await persistSelfEval();
      if (saved) setExisting(saved);
      setInfoMessage('Draft saved. You can keep editing until you submit it to your manager.');
    } catch {
      setFormError('Could not save your draft. Please try again.');
    } finally {
      setIsSavingDraft(false);
    }
  }

  async function handleSubmit() {
    if (!activeCycle) return;
    setFormError(null);
    setInfoMessage(null);

    if (!achievements.trim()) {
      setFormError('Please describe your achievements before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await persistSelfEval();
      if (saved) setExisting(saved);

      if (myAppraisal) {
        await updateAppraisalStatus(myAppraisal.id, 'SUBMITTED');
        await load();
        setInfoMessage('Your self appraisal has been submitted to your manager.');
      } else {
        setInfoMessage(
          'Your self appraisal has been saved. It will be sent to your manager once HR sets up your appraisal for this cycle.'
        );
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <Spinner />;

  if (!activeCycle) {
    return (
      <div className="max-w-2xl space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Self Appraisal</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in your self evaluation for this appraisal cycle.</p>
        </div>
        <EmptyState message="There is no active appraisal cycle right now. Check back once HR starts one." icon="🗓️" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Self Appraisal</h1>
        <p className="text-sm text-gray-500 mt-1">
          {activeCycle.name} · {formatDate(activeCycle.startDate)} – {formatDate(activeCycle.endDate)}
        </p>
      </div>

      {myAppraisal && (
        <div className="card flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-400">Appraisal status</p>
            <div className="mt-1"><StatusBadge status={myAppraisal.status} /></div>
          </div>
          <p className="text-sm text-gray-500">Manager: {myAppraisal.managerName}</p>
        </div>
      )}

      <div className="card space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            {existing ? 'Your Self Evaluation' : 'Fill Your Self Evaluation'}
          </h2>
          {!isEditable && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <CheckCircle2 size={14} className="text-green-500" /> Locked — already submitted
            </span>
          )}
        </div>

        <div>
          <label className="label">Achievements {isEditable && <span className="text-red-400">*</span>}</label>
          <textarea
            value={achievements}
            onChange={e => setAchievements(e.target.value)}
            disabled={!isEditable}
            rows={4}
            placeholder="Describe your key achievements this cycle..."
            className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="label">Challenges</label>
          <textarea
            value={challenges}
            onChange={e => setChallenges(e.target.value)}
            disabled={!isEditable}
            rows={3}
            placeholder="What challenges did you face?"
            className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="label">Additional Comments</label>
          <textarea
            value={comments}
            onChange={e => setComments(e.target.value)}
            disabled={!isEditable}
            rows={3}
            placeholder="Any other comments..."
            className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {myReview && (
          <div className="rounded-xl bg-[#F4F8FF] border border-[#D6E4FF] px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-[#0E4CB7]" />
              <p className="text-sm font-semibold text-[#0E4CB7]">
                Manager rating: {myReview.performanceRating}/5
              </p>
            </div>
            {myReview.comments && <p className="text-sm text-gray-600">{myReview.comments}</p>}
          </div>
        )}

        {formError && (
          <div className="flex items-start gap-2 text-sm px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {infoMessage && (
          <div className="flex items-start gap-2 text-sm px-4 py-3 rounded-xl bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {isEditable && (
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
            <button
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Pencil size={15} />
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSavingDraft || isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Submitting...' : 'Submit to Manager'}
            </button>
          </div>
        )}

        {isEditable && (
          <p className="text-xs text-gray-400">
            Save Draft keeps your evaluation editable. Submit sends it to your manager and locks the form.
          </p>
        )}
      </div>
    </div>
  );
};
