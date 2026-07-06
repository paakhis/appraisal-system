import { useAuth } from '../../context/AuthContext';
import { initials } from '../../utils/formatters';

export const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-gray-900 mb-5">My Profile</h1>
      <div className="card">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0E4CB7] text-white text-xl font-bold flex items-center justify-center">
            {initials(user?.name || '')}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge bg-[#E7F0FF] text-[#0E4CB7] mt-1">{user?.role}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          {[
            { label: 'Full Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Role', value: user?.role },
            { label: 'User ID', value: `#${user?.id}` },
          ].map(f => (
            <div key={f.label}>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{f.label}</p>
              <p className="text-sm font-medium text-gray-800">{f.value || '-'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
