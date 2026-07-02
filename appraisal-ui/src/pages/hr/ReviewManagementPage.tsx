import { useEffect, useState } from 'react';
import { getAllReviews, updateReview } from '../../api/reviewApi';
import { getAllAppraisals } from '../../api/appraisalApi';
import type { ReviewResponse } from '../../interfaces/review';
import type { AppraisalResponse } from '../../interfaces/appraisal';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { getAllSelfEvals } from "../../api/selfEvalApi";
import type { SelfEvaluationResponse } from "../../interfaces/selfEval";
import { Eye, Check, X } from "lucide-react";

export const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [appraisals, setAppraisals] = useState<AppraisalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [selfEvaluations, setSelfEvaluations] = useState<SelfEvaluationResponse[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null);

  const load = () =>
Promise.all([
    getAllReviews(),
    getAllAppraisals(),
    getAllSelfEvals()
])
.then(([r, a, s]) => {
    setReviews(r);
    setAppraisals(a);
    setSelfEvaluations(s);
})
      .catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const getSelfEvaluation = (review: ReviewResponse) => {
    const appraisal = appraisals.find(a => a.id === review.appraisalId);

    if (!appraisal) return null;

    return selfEvaluations.find(
        s =>
            s.userId === appraisal.employeeId &&
            s.appraisalCycleId === appraisal.cycleId
    );
};

  const approve = async (r: ReviewResponse) => {
    setUpdating(r.id);
    try {
      await updateReview(r.id, { ...r, status: 'APPROVED' });
      setReviews(prev => prev.map(x => x.id === r.id ? { ...x, status: 'APPROVED' } : x));
    } catch {}
    finally { setUpdating(null); }
  };

  const getEmployee = (empId: number) => appraisals.find(a => a.employeeId === empId);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Review Management</h1>
        <p className="text-sm text-gray-500">{reviews.filter(r => r.status !== 'APPROVED').length} pending approval</p>
      </div>

      {reviews.length === 0 ? <EmptyState message="No reviews found." icon=""/> : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead><tr>
              <th className="table-header">Employee</th>
              <th className="table-header hidden sm:table-cell">Rating</th>
              <th className="table-header hidden md:table-cell">Comments</th>
              <th className="table-header hidden md:table-cell">Date</th>
              <th className="table-header">Status</th>
              <th className="table-header">Action</th>
            </tr></thead>
            <tbody>
              {reviews.map(r => {
                const app = getEmployee(r.employeeId);
                return (
                  <tr key={r.id} className="hover:bg-[#F4F8FF] transition-colors">
                    <td className="table-cell">
                      <p className="font-medium text-gray-800">{app?.employeeName || `Employee #${r.employeeId}`}</p>
                      <p className="text-xs text-gray-400">{app?.cycleName || ''}</p>
                    </td>
                    <td className="table-cell hidden sm:table-cell">
                      <span className="text-lg font-bold text-[#0E4CB7]">{r.performanceRating}</span>
                      <span className="text-xs text-gray-400">/5</span>
                    </td>
                    <td className="table-cell hidden md:table-cell">
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">{r.comments}</p>
                    </td>
                    <td className="table-cell hidden md:table-cell text-xs text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="table-cell"><StatusBadge status={r.status}/></td>
                    <td className="table-cell">
    <div className="flex gap-2">

        <button
            onClick={() => setSelectedReview(r)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
        >
            <Eye size={12}/>
            View
        </button>

        {r.status !== "APPROVED" && (
            <button
                onClick={() => approve(r)}
                disabled={updating === r.id}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs"
            >
                <Check size={12}/>
                {updating === r.id ? "..." : "Approve"}
            </button>
        )}

    </div>
</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {selectedReview && (() => {

    const appraisal = appraisals.find(a => a.id === selectedReview.appraisalId);

    const self = getSelfEvaluation(selectedReview);
    

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-xl font-bold">
                        Review Details
                    </h2>

                    <button onClick={() => setSelectedReview(null)}>
                        <X />
                    </button>

                </div>

                <div className="space-y-6">

                    <div>

                        <h3 className="font-semibold text-[#0E4CB7] mb-2">
                            Employee Self Evaluation
                        </h3>

                        <div className="space-y-3">

                            <div>
                                <p className="text-xs text-gray-400">Achievements</p>
                                <p>{self?.achievements || "-"}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Challenges</p>
                                <p>{self?.challenges || "-"}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Comments</p>
                                <p>{self?.comments || "-"}</p>
                            </div>

                        </div>

                    </div>

                    <hr/>

                    <div>

                        <h3 className="font-semibold text-[#0E4CB7] mb-2">
                            Manager Review
                        </h3>

                        <div className="space-y-3">

                            <div>
                                <p className="text-xs text-gray-400">
                                    Rating
                                </p>

                                <p>
                                    {selectedReview.performanceRating}/5
                                </p>

                            </div>

                            <div>
                                <p className="text-xs text-gray-400">
                                    Strengths
                                </p>

                                <p>
                                    {selectedReview.strengths || "-"}
                                </p>

                            </div>

                            <div>
                                <p className="text-xs text-gray-400">
                                    Improvements
                                </p>

                                <p>
                                    {selectedReview.improvements || "-"}
                                </p>

                            </div>

                            <div>
                                <p className="text-xs text-gray-400">
                                    Comments
                                </p>

                                <p>
                                    {selectedReview.comments || "-"}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

})()}
        </div>
      )}
    </div>
  );
};
