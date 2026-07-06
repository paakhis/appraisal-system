import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers } from '../../api/userApi';
import type { UserResponse } from '../../interfaces/user';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { initials } from '../../utils/formatters';
import { Search } from 'lucide-react';

export const TeamPage = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState<UserResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then(users => setTeam(users.filter(u => u.managerId === user?.id)))
      .catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const filtered = team.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.designation?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Team Members</h1><p className="text-sm text-gray-500">{team.length} members</p></div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search members..." className="input-field pl-9 w-56" />
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState message="No team members found." icon="👥" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="card hover:border-[#D6E4FF] transition-colors flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0E4CB7] text-white font-bold text-sm flex items-center justify-center shrink-0">
                {initials(m.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{m.name}</p>
                <p className="text-sm text-gray-500">{m.designation}</p>
                <p className="text-xs text-[#0E4CB7] mt-1">{m.departmentName}</p>
                <p className="text-xs text-gray-400 truncate">{m.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
