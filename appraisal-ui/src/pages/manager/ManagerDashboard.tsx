import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers } from '../../api/userApi';
import { getAllAppraisals } from '../../api/appraisalApi';
import { getAllReviews } from '../../api/reviewApi';
import { getAllGoals } from '../../api/goalApi';
import type { UserResponse } from '../../interfaces/user';
import type { AppraisalResponse } from '../../interfaces/appraisal';
import type { ReviewResponse } from '../../interfaces/review';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { Users, ClipboardList, Target, CheckCircle } from 'lucide-react';

export const ManagerDashboard = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState<UserResponse[]>([]);
  const [appraisals, setAppraisals] = useState<AppraisalResponse[]>([]);
  const [pendingReviews, setPendingReviews] = useState<ReviewResponse[]>([]);
  const [goalsDone, setGoalsDone] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Promise.all([
    getAllUsers(),
    getAllAppraisals(),
    getAllReviews(),
    getAllGoals()
  ])
    .then(([users, apps, revs, goals]) => {
      const myTeam = users.filter(u => u.managerId === user?.id);
      const myTeamIds = myTeam.map(u => u.id);

      console.log('Team:', myTeam);
      console.log('Team IDs:', myTeamIds);
      console.log('Appraisals:', apps);
      console.log('Reviews:', revs);
      console.log('Goals:', goals);

      setTeam(myTeam);

      setAppraisals(
        apps.filter(a => myTeamIds.includes(a.employeeId))
      );

setPendingReviews([]);
      setGoalsDone(
        goals.filter(g => myTeamIds.includes(g.userId)).length
      );
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, [user]);

  if (loading) return <Spinner />;

  const stats = [
    { label: 'Team Members', value: team.length, icon: Users, color: 'bg-[#E7F0FF] text-[#0E4CB7]' },
    { label: 'Pending Reviews', value: pendingReviews.length, icon: ClipboardList, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Team Goals Done', value: goalsDone, icon: Target, color: 'bg-green-100 text-green-600' },
    { label: 'Appraisals', value: appraisals.length, icon: CheckCircle, color: 'bg-[#E7F0FF] text-[#0E4CB7]' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

<div className="grid grid-cols-1 gap-5">        

        {/* Appraisal status */}
        <div className="card">
          <h3 className="section-header">Appraisal Status</h3>
          {appraisals.length === 0 ? <p className="text-sm text-gray-400">No appraisals yet.</p> : (
            <div className="space-y-3">
              {appraisals.slice(0,5).map(a => (
                <div key={a.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{a.employeeName}</p>
                    <p className="text-xs text-gray-400">{a.cycleName}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
