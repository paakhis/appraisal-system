import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAllCycles, createCycle, updateCycle, deleteCycle } from '../../api/cycleApi';
import type { AppraisalCycleResponse, AppraisalCycleRequest } from '../../interfaces/cycle';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { FormInput } from '../../components/forms/FormInput';
import { Plus, Trash2, Edit2, X, Check, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const CyclesPage = () => {
  const [cycles, setCycles] = useState<AppraisalCycleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AppraisalCycleResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AppraisalCycleRequest>();

  const load = () => getAllCycles().then(setCycles).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { reset({ active: true }); setEditing(null); setShowForm(true); };
  const openEdit = (c: AppraisalCycleResponse) => {
    setValue('name', c.name);
    setValue('startDate', c.startDate?.slice(0, 10));
    setValue('endDate', c.endDate?.slice(0, 10));
    setValue('active', c.active);
    setEditing(c); setShowForm(true);
  };

  const onSubmit = async (data: AppraisalCycleRequest) => {
    setSaving(true);
    try {
      if (editing) await updateCycle(editing.id, data);
      else await createCycle(data);
      setShowForm(false); await load();
    } catch {}
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this cycle?')) return;
    await deleteCycle(id).catch(() => {});
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Appraisal Cycles</h1><p className="text-sm text-gray-500">{cycles.length} cycles</p></div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16}/>New Cycle</button>
      </div>

      {showForm && (
        <div className="card border-[#D6E4FF]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">{editing ? 'Edit Cycle' : 'New Cycle'}</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-gray-400"/></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Cycle Name" registration={register('name', { required: 'Required' })} error={errors.name?.message} placeholder="e.g. Q1 2025 Appraisal" />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Start Date" type="date" registration={register('startDate', { required: 'Required' })} error={errors.startDate?.message}/>
              <FormInput label="End Date" type="date" registration={register('endDate', { required: 'Required' })} error={errors.endDate?.message}/>
            </div>
            <div className="mb-4 flex items-center gap-2">


              <input type="checkbox" {...register('active')} id="active" className="w-4 h-4 accent-[#0E4CB7]"/>
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Mark as Active</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                <Check size={15}/>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {cycles.length === 0 ? <EmptyState message="No appraisal cycles found." icon=""/> : (
        <div className="space-y-3">
          {cycles.map(c => (
            <div key={c.id} className="card flex items-center gap-4 hover:border-[#D6E4FF] transition-colors">
              <div className="w-10 h-10 bg-[#E7F0FF] rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-[#0E4CB7]"/>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  {c.active && <span className="badge bg-green-100 text-green-700">Active</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(c.startDate)} → {formatDate(c.endDate)}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-[#E7F0FF] text-gray-400 hover:text-[#0E4CB7] transition"><Edit2 size={13}/></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
