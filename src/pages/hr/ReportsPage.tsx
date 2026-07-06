import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { getAllUsers } from '../../api/userApi';
import { getAllAppraisals } from '../../api/appraisalApi';
import { getAllGoals } from '../../api/goalApi';
import { getAllReviews } from '../../api/reviewApi';
import { getAllDepartments } from '../../api/departmentApi';
import { downloadEmployeesReport } from '../../api/reportApi';
import { Spinner } from '../../components/common/Spinner';
import { StatusBadge } from '../../components/common/Badge';

interface ReportData {
  totalEmployees: number;
  totalAppraisals: number;
  appraisalByStatus: Record<string, number>;
  totalGoals: number;
  goalsByStatus: Record<string, number>;
  avgRating: number;
  departmentStats: { name: string; employees: number; appraisals: number }[];
}

export const ReportsPage = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllAppraisals(), getAllGoals(), getAllReviews(), getAllDepartments()])
      .then(([users, apps, goals, reviews, depts]) => {
        const appraisalByStatus: Record<string, number> = {};
        apps.forEach(a => { appraisalByStatus[a.status] = (appraisalByStatus[a.status] || 0) + 1; });

        const goalsByStatus: Record<string, number> = {};
        goals.forEach(g => { goalsByStatus[g.status] = (goalsByStatus[g.status] || 0) + 1; });

        const ratings = reviews.filter(r => r.performanceRating).map(r => r.performanceRating);
        const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

        const departmentStats = depts.map(d => ({
          name: d.name,
          employees: users.filter(u => u.departmentId === d.id).length,
          appraisals: apps.filter(a => users.find(u => u.id === a.employeeId)?.departmentId === d.id).length,
        }));

        setData({ totalEmployees: users.length, totalAppraisals: apps.length, appraisalByStatus, totalGoals: goals.length, goalsByStatus, avgRating, departmentStats });
      }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      await downloadEmployeesReport();
    } catch (error) {
      console.error('Failed to download report', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Spinner />;

  if (!data) return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold text-gray-900 mb-5">Reports</h1>
      <div className="card text-center py-12">
        <p className="text-gray-400">Could not load report data. Ensure the backend is running.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
        <button
          onClick={handleDownloadReport}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D6E4FF] bg-white px-4 py-2 text-sm font-medium text-[#0E4CB7] transition hover:bg-[#F4F8FF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={16} />
          {downloading ? 'Preparing...' : 'Download Excel'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: data.totalEmployees, color: 'bg-[#0E4CB7]' },
          { label: 'Total Appraisals', value: data.totalAppraisals, color: 'bg-blue-500' },
          { label: 'Total Goals', value: data.totalGoals, color: 'bg-green-500' },
          { label: 'Avg Rating', value: data.avgRating ? data.avgRating.toFixed(1) + '/5' : 'N/A', color: 'bg-yellow-500' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-8 h-1.5 rounded-full ${s.color} mb-3`}/>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Appraisal by status */}
        <div className="card">
          <h3 className="section-header">Appraisals by Status</h3>
          <div className="space-y-3">
            {Object.entries(data.appraisalByStatus).length === 0
              ? <p className="text-sm text-gray-400">No data</p>
              : Object.entries(data.appraisalByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status}/>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-[#0E4CB7] h-2 rounded-full transition-all"
                        style={{ width: `${(count / data.totalAppraisals) * 100}%` }}/>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Goals by status */}
        <div className="card">
          <h3 className="section-header">Goals by Status</h3>
          <div className="space-y-3">
            {Object.entries(data.goalsByStatus).length === 0
              ? <p className="text-sm text-gray-400">No data</p>
              : Object.entries(data.goalsByStatus).map(([status, count]) => {
                const colors: Record<string,string> = { DRAFT:'bg-gray-400', SUBMITTED:'bg-yellow-400', APPROVED:'bg-green-500' };
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-28">{status.replace(/_/g,' ')}</span>
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className={`${colors[status]||'bg-[#0E4CB7]'} h-2 rounded-full transition-all`}
                          style={{ width: `${(count / data.totalGoals) * 100}%` }}/>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Department table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D6E4FF]">
          <h3 className="section-header mb-0">Department Overview</h3>
        </div>
        <table className="w-full">
          <thead><tr>
            <th className="table-header">Department</th>
            <th className="table-header">Employees</th>
            <th className="table-header">Appraisals</th>
            <th className="table-header">Coverage</th>
          </tr></thead>
          <tbody>
            {data.departmentStats.map(d => (
              <tr key={d.name} className="hover:bg-[#F4F8FF] transition-colors">
                <td className="table-cell font-medium">{d.name}</td>
                <td className="table-cell">{d.employees}</td>
                <td className="table-cell">{d.appraisals}</td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[80px]">
                      <div className="bg-[#0E4CB7] h-1.5 rounded-full"
                        style={{ width: d.employees ? `${Math.min((d.appraisals / d.employees) * 100, 100)}%` : '0%' }}/>
                    </div>
                    <span className="text-xs text-gray-500">
                      {d.employees ? Math.round((d.appraisals / d.employees) * 100) : 0}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
