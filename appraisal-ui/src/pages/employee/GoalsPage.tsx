import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { acknowledgeGoal, completeGoal, getAllGoals } from '../../api/goalApi';
import type { GoalResponse } from '../../interfaces/goal';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const GoalsPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const load = async () => {
    const gs = await getAllGoals();
    setGoals(gs.filter(g => g.userId === user?.id && g.status !== 'DRAFT'));
    setLoading(false);
  };

  useEffect(() => { load().catch(() => setLoading(false)); }, [user]);

  const handleAcknowledge = async (goal: GoalResponse) => {
    setActionLoadingId(goal.id);
    try {
      await acknowledgeGoal(goal.id);
      await load();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleComplete = async (goal: GoalResponse) => {
    setActionLoadingId(goal.id);
    try {
      await completeGoal(goal.id);
      await load();
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Goals</h1>
          <p className="text-sm text-gray-500 mt-0.5">{goals.length} goals this cycle</p>
        </div>

      </div>

      {/* Goals list */}
      {goals.length === 0 ? <EmptyState message="No assigned goals yet." icon="" /> : (
        <div className="space-y-3">
          {goals.map(g => (
            <div key={g.id} className="card flex items-start gap-4 hover:border-[#D6E4FF] transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <p className="font-semibold text-gray-800">{g.title}</p>
                  {g.status !== 'SUBMITTED' && (
  <StatusBadge status={g.status} />
)}
                </div>
                {g.description && <p className="text-sm text-gray-500 mb-2">{g.description}</p>}
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Target: {formatDate(g.targetDate)}</span>
                  <span>Cycle: {g.cycleName}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {g.status === 'SUBMITTED' && (
                  <button
                    onClick={() => handleAcknowledge(g)}
                    disabled={actionLoadingId === g.id}
                    className="btn-secondary text-xs"
                  >
                    {actionLoadingId === g.id ? 'Please wait...' : 'Acknowledge'}
                  </button>
                )}
                {g.status === 'ACKNOWLEDGED' && (
                  <button
                    onClick={() => handleComplete(g)}
                    disabled={actionLoadingId === g.id}
                    className="btn-primary text-xs"
                  >
                    {actionLoadingId === g.id ? 'Please wait...' : 'Complete Goal'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
