export const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '-';

export const initials = (name: string) =>
  name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || '?';

export const statusColor = (s: string) => {
  const map: Record<string,string> = {
    DRAFT:'bg-gray-100 text-gray-600',
    SUBMITTED:'bg-[#E7F0FF] text-[#0E4CB7]',
    ASSIGNED:'bg-[#E7F0FF] text-[#0E4CB7]',
    ACKNOWLEDGED:'bg-yellow-100 text-yellow-700',
    COMPLETED:'bg-purple-100 text-purple-700',
    APPROVED:'bg-green-100 text-green-700',
    REJECTED:'bg-red-100 text-red-700',
  };
  return map[s] || 'bg-gray-100 text-gray-600';
};

export const goalStatusColor = (s: string) => {
  const map: Record<string,string> = {
    DRAFT: 'bg-gray-100 text-gray-600',
    SUBMITTED: 'bg-[#E7F0FF] text-[#0E4CB7]',
    ASSIGNED: 'bg-[#E7F0FF] text-[#0E4CB7]',
    ACKNOWLEDGED: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-purple-100 text-purple-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };
  return map[s] || 'bg-gray-100 text-gray-600';
};

export const notifIcon = (type: string) => {
  const map: Record<string,string> = {
    INFO:'ℹ️', WARNING:'⚠️', SUCCESS:'✅', APPRAISAL:'📋', REVIEW:'📝', GOAL:'🎯',
  };
  return map[type] || '🔔';
};
