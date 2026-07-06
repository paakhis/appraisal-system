import { useEffect, useState } from 'react';
import { getAllUsers } from '../../api/userApi';
import { getAllDepartments } from '../../api/departmentApi';
import { getAllAppraisals } from '../../api/appraisalApi';
import { getAllCycles } from '../../api/cycleApi';
import { Spinner } from '../../components/common/Spinner';
import { StatusBadge } from '../../components/common/Badge';
import { Users, Building2, RefreshCcw, ClipboardList } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const HRDashboard = () => {
  const [counts, setCounts] = useState({ users:0, depts:0, cycles:0, appraisals:0 });
  const [recentAppraisals, setRecentAppraisals] = useState<{employeeName:string;cycleName:string;status:string;createdAt:string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllDepartments(), getAllCycles(), getAllAppraisals()])
      .then(([u, d, c, a]) => {
        setCounts({ users:u.length, depts:d.length, cycles:c.length, appraisals:a.length });
        setRecentAppraisals(a.slice(-5).reverse());
      }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const stats = [
    { label:'Total Employees', value:counts.users, icon:Users, color:'bg-[#E7F0FF] text-[#0E4CB7]' },
    { label:'Departments', value:counts.depts, icon:Building2, color:'bg-[#E7F0FF] text-[#0E4CB7]' },
    { label:'Appraisal Cycles', value:counts.cycles, icon:RefreshCcw, color:'bg-green-100 text-green-600' },
    { label:'Total Appraisals', value:counts.appraisals, icon:ClipboardList, color:'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div><h1 className="text-xl font-bold text-gray-900">HR Dashboard</h1><p className="text-sm text-gray-500">System overview</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={18}/></div>
            <div><p className="text-2xl font-bold text-gray-800">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="section-header">Recent Appraisals</h3>
        {recentAppraisals.length === 0 ? <p className="text-sm text-gray-400">No appraisals yet.</p> : (
          <table className="w-full">
            <thead><tr>
              <th className="table-header">Employee</th>
              <th className="table-header">Cycle</th>
              <th className="table-header">Status</th>
              <th className="table-header">Created</th>
            </tr></thead>
            <tbody>
              {recentAppraisals.map((a, i) => (
                <tr key={i} className="hover:bg-[#F4F8FF] transition-colors">
                  <td className="table-cell font-medium">{a.employeeName}</td>
                  <td className="table-cell">{a.cycleName}</td>
                  <td className="table-cell"><StatusBadge status={a.status}/></td>
                  <td className="table-cell">{formatDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
