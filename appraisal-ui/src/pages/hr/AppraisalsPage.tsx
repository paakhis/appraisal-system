import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAllAppraisals, createAppraisal, updateAppraisalStatus, deleteAppraisal } from '../../api/appraisalApi';
import { getAllUsers } from '../../api/userApi';
import { getAllCycles } from '../../api/cycleApi';
import type { AppraisalResponse, AppraisalRequest } from '../../interfaces/appraisal';
import type { UserResponse } from '../../interfaces/user';
import type { AppraisalCycleResponse } from '../../interfaces/cycle';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { FormSelect } from '../../components/forms/FormSelect';
import { Plus, Trash2, X, Check } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { APPRAISAL_STATUSES } from '../../utils/constants';

export const AppraisalsPage = () => {
  const [appraisals, setAppraisals] = useState<AppraisalResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [cycles, setCycles] = useState<AppraisalCycleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppraisalRequest>();

  const load = () =>
    Promise.all([getAllAppraisals(), getAllUsers(), getAllCycles()])
      .then(([a, u, c]) => { setAppraisals(a); setUsers(u); setCycles(c); })
      .catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: AppraisalRequest) => {
    setSaving(true);
    try { await createAppraisal(data); setShowForm(false); await load(); }
    catch {} finally { setSaving(false); }
  };

  const handleStatusChange = async (id: number, status: string) => {
    await updateAppraisalStatus(id, status).catch(() => {});
    setAppraisals(prev => prev.map(a => a.id === id ? { ...a, status: status as never } : a));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this appraisal?')) return;
    await deleteAppraisal(id).catch(() => {});
    await load();
  };

  const employees = users.filter(u => u.roles === 'EMPLOYEE');
  const managers = users.filter(u => u.roles === 'MANAGER');

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Appraisals</h1><p className="text-sm text-gray-500">{appraisals.length} total</p></div>
        <button onClick={() => { reset(); setShowForm(true); }} className="btn-primary flex items-center gap-2"><Plus size={16}/>New Appraisal</button>
      </div>

      {showForm && (
        <div className="card border-[#D6E4FF]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Create Appraisal</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-gray-400"/></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormSelect label="Employee" registration={register('employeeId', { required: 'Required', valueAsNumber: true })}
                options={employees.map(u => ({ value: u.id, label: u.name }))} error={errors.employeeId?.message}/>
              <FormSelect label="Manager" registration={register('managerId', { required: 'Required', valueAsNumber: true })}
                options={managers.map(u => ({ value: u.id, label: u.name }))} error={errors.managerId?.message}/>
              <FormSelect label="Cycle" registration={register('cycleId', { required: 'Required', valueAsNumber: true })}
                options={cycles.map(c => ({ value: c.id, label: c.name }))} error={errors.cycleId?.message}/>
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                <Check size={15}/>{saving ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {appraisals.length === 0 ? <EmptyState message="No appraisals yet." icon=""/> : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead><tr>
              <th className="table-header">Employee</th>
              <th className="table-header hidden sm:table-cell">Manager</th>
              <th className="table-header hidden md:table-cell">Cycle</th>
              <th className="table-header hidden md:table-cell">Created</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr></thead>
            <tbody>
              {appraisals.map(a => (
                <tr key={a.id} className="hover:bg-[#F4F8FF] transition-colors">
                  <td className="table-cell font-medium">{a.employeeName}</td>
                  <td className="table-cell hidden sm:table-cell text-gray-500">{a.managerName}</td>
                  <td className="table-cell hidden md:table-cell text-gray-500">{a.cycleName}</td>
                  <td className="table-cell hidden md:table-cell text-xs text-gray-400">{formatDate(a.createdAt)}</td>
                  <td className="table-cell">
                    <select value={a.status}
                      onChange={e => handleStatusChange(a.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#BFD5FF]">
                      {APPRAISAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"><Trash2 size={13}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
