import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllReviews } from '../../api/reviewApi';
import { getAllAppraisals } from '../../api/appraisalApi';
import type { ReviewResponse } from '../../interfaces/review';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { Star } from 'lucide-react';

export const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllReviews(), getAllAppraisals()])
      .then(([revs, apps]) => {
        const myAppIds = apps.filter(a => a.employeeId === user?.id).map(a => a.id);
        setReviews(revs.filter(r => myAppIds.includes(r.appraisalId)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manager reviews of your performance</p>
      </div>

      {reviews.length === 0 ? <EmptyState message="No reviews yet from your manager." icon="📝" /> : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="card hover:border-[#D6E4FF] transition-colors">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E7F0FF] rounded-xl flex items-center justify-center">
                    <Star size={18} className="text-[#0E4CB7]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Performance Review</p>
                    <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0E4CB7]">{r.performanceRating}<span className="text-sm text-gray-400 font-normal">/5</span></p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </div>

              {r.comments && (
                <div className="mt-4 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Manager Comments</p>
                  <p className="text-sm text-gray-700">{r.comments}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {r.strengths && (
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-600 mb-1">✅ Strengths</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{r.strengths}</p>
                  </div>
                )}
                {r.improvements && (
                  <div className="bg-yellow-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-yellow-600 mb-1">📈 Areas to Improve</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{r.improvements}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
