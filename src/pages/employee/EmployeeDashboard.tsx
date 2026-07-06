import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllAppraisals } from '../../api/appraisalApi';
import { getAllGoals } from '../../api/goalApi';
import { getAllReviews } from '../../api/reviewApi';
import type { AppraisalResponse } from '../../interfaces/appraisal';
import type { GoalResponse } from '../../interfaces/goal';
import type { ReviewResponse } from '../../interfaces/review';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { User, Building2, UserCheck } from 'lucide-react';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [appraisal, setAppraisal] = useState<AppraisalResponse | null>(null);
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [apps, gs, revs] = await Promise.all([getAllAppraisals(), getAllGoals(), getAllReviews()]);
        const myApp = apps.find(a => a.employeeId === user?.id) || null;
        setAppraisal(myApp);
        setGoals(gs.filter(g => g.userId === user?.id));
        if (myApp) setReview(revs.find(r => r.appraisalId === myApp.id) || null);
      } catch { /* backend may not be running – show mock UI */ }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  const APPROVEDGoals = goals.filter(g => g.status === 'APPROVED').length;

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-[#D6E4FF] shadow-sm p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0E4CB7] to-[#5E8FE0] flex items-center justify-center">
            <User size={30} className="text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.name}
              </h2>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F0FF] text-[#0E4CB7]">
                EMPLOYEE
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Building2 size={14} />
                {appraisal?.cycleName || 'Engineering'}
              </span>

              <span className="flex items-center gap-2">
                <User size={14} />
                Software Engineer
              </span>
            </div>
          </div>

          {appraisal?.managerName && (
            <div className="bg-[#F4F8FF] rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                Reporting Manager
              </p>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D7DBFF] flex items-center justify-center">
                  <UserCheck size={14} className="text-[#0E4CB7]" />
                </div>

                <span className="font-medium text-gray-700">
                  {appraisal.managerName}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl border border-[#D6E4FF] p-5 shadow-sm hover:shadow-md transition">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            Self Rating
          </p>
          {review?.performanceRating ? (
            <h3 className="text-3xl font-bold text-[#0E4CB7]">
              {review.performanceRating}/5
            </h3>
          ) : (
            <p className="text-2xl font-bold text-[#0E4CB7]">
              Pending
            </p>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#D6E4FF] p-5 shadow-sm hover:shadow-md transition">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            Manager Rating
          </p>
          {review?.performanceRating ? (
            <h3 className="text-3xl font-bold text-[#0E4CB7]">
              {review.performanceRating}/5
            </h3>
          ) : (
            <p className="text-2xl font-bold text-[#0E4CB7]">
              Pending
            </p>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#D6E4FF] p-5 shadow-sm hover:shadow-md transition">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            Goals Approved
          </p>
          <h3 className="text-3xl font-bold text-[#0E4CB7]">
            {APPROVEDGoals}/{goals.length}
          </h3>
        </div>

        <div className="bg-white rounded-3xl border border-[#D6E4FF] p-5 shadow-sm hover:shadow-md transition">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            Appraisal Status
          </p>
          <StatusBadge status={appraisal?.status || 'SUBMITTED'} />
        </div>
      </div>

      {/* Skills */}
      {/* Timeline + Upcoming Goals */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* My Appraisals */}
        <div className="bg-white rounded-3xl border border-[#D6E4FF] p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            My Appraisal
          </h3>

          {!appraisal ? (
            <p className="text-sm text-gray-500">
              No appraisal cycle assigned yet.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="border border-[#D6E4FF] rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {appraisal.cycleName}
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      Manager: {appraisal.managerName || 'Not Assigned'}
                    </p>
                  </div>

                  <StatusBadge status={appraisal.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">
                      Self Rating
                    </p>
                    <p className="text-lg font-semibold text-[#0E4CB7]">
                      {review?.performanceRating
                        ? `${review.performanceRating}/5`
                        : 'Pending'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase">
                      Final Rating
                    </p>
                    <p className="text-lg font-semibold text-[#0E4CB7]">
                      {review?.performanceRating
                        ? `${review.performanceRating}/5`
                        : 'Pending'}
                    </p>
                  </div>
                </div>

                {review?.comments && (
                  <div className="mt-4 pt-4 border-t border-[#D6E4FF]">
                    <p className="text-xs text-gray-400 uppercase mb-1">
                      Review Comments
                    </p>

                    <p className="text-sm text-gray-600">
                      {review.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Upcoming Goal Deadlines */}
        <div className="bg-white rounded-3xl border border-[#D6E4FF] p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Upcoming Goal Deadlines
          </h3>

          {goals.length === 0 ? (
            <p className="text-sm text-gray-500">
              No active goals assigned.
            </p>
          ) : (
            <div className="space-y-4">
              {goals
                .filter(g => g.status !== 'APPROVED')
                .slice(0, 5)
                .map(goal => (
                  <div
                    key={goal.id}
                    className="border border-[#D6E4FF] rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {goal.title}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          {goal.description}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${goal.status === 'ASSIGNED' || goal.status === 'ACKNOWLEDGED' || goal.status === 'COMPLETED'
                          ? 'bg-[#E7F0FF] text-[#0E4CB7]'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {goal.status}
                      </span>
                    </div>

                    <p className="text-sm text-orange-600 mt-3">
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
