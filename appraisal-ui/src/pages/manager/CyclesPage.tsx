import { useEffect, useState } from 'react';
import { getAllCycles } from '../../api/cycleApi';
import type { AppraisalCycleResponse } from '../../interfaces/cycle';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { Calendar } from 'lucide-react';

export const ManagerCyclesPage = () => {
  const [cycles, setCycles] = useState<AppraisalCycleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAllCycles().then(setCycles).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <Spinner />;
  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Appraisal Cycles</h1>
      {cycles.length === 0 ? <EmptyState message="No cycles found." icon=""/> : (
        <div className="space-y-3">
          {cycles.map(c => (
            <div key={c.id} className="card flex items-center gap-4 hover:border-[#D6E4FF] transition-colors">
              <div className="w-10 h-10 bg-[#E7F0FF] rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-[#0E4CB7]"/>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">{formatDate(c.startDate)} → {formatDate(c.endDate)}</p>
              </div>
              {c.active && <span className="badge bg-green-100 text-green-700">Active</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
