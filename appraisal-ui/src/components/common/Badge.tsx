import { statusColor } from '../../utils/formatters';
export const StatusBadge = ({ status }: { status: string }) => (
  <span className={`badge ${statusColor(status)}`}>{status.replace(/_/g,' ')}</span>
);
export const RoleBadge = ({ role }: { role: string }) => {
  const colors: Record<string,string> = {
    HR:'bg-[#E7F0FF] text-[#0E4CB7]', MANAGER:'bg-[#E7F0FF] text-[#0E4CB7]', EMPLOYEE:'bg-[#E7F0FF] text-[#0E4CB7]'
  };
  return <span className={`badge ${colors[role]||'bg-gray-100 text-gray-600'}`}>{role}</span>;
};
