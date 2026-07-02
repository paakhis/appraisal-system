import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../api/departmentApi';
import type { DepartmentResponse, DepartmentRequest } from '../../interfaces/department';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { FormInput } from '../../components/forms/FormInput';
import { Plus, Trash2, Edit2, X, Check, Building2 } from 'lucide-react';

export const DepartmentsPage = () => {
  const [depts, setDepts] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DepartmentResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<DepartmentRequest>();

  const load = () => getAllDepartments().then(setDepts).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { reset(); setEditing(null); setShowForm(true); };
  const openEdit = (d: DepartmentResponse) => {
    setValue('name', d.name); setValue('description', d.description || '');
    setEditing(d); setShowForm(true);
  };

  const onSubmit = async (data: DepartmentRequest) => {
    setSaving(true);
    try {
      if (editing) await updateDepartment(editing.id, data);
      else await createDepartment(data);
      setShowForm(false); await load();
    } catch {}
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this department?')) return;
    await deleteDepartment(id).catch(() => {});
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Departments</h1><p className="text-sm text-gray-500">{depts.length} departments</p></div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16}/>Add Department</button>
      </div>

      {showForm && (
        <div className="card border-[#D6E4FF]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">{editing ? 'Edit Department' : 'New Department'}</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-gray-400"/></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Department Name" registration={register('name', { required: 'Required' })} error={errors.name?.message} placeholder="e.g. Engineering" />
            <div className="mb-4">
              <label className="label">Description</label>
              <textarea {...register('description')} rows={2} className="input-field resize-none" placeholder="Optional description..." />
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

      {depts.length === 0 ? <EmptyState message="No departments found." icon=""/> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {depts.map(d => (
            <div key={d.id} className="card hover:border-[#D6E4FF] transition-colors flex items-start gap-4">
              <div className="w-10 h-10 bg-[#E7F0FF] rounded-xl flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-[#0E4CB7]"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">{d.name}</p>
                {d.description && <p className="text-sm text-gray-500 mt-0.5 truncate">{d.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-[#E7F0FF] text-gray-400 hover:text-[#0E4CB7] transition"><Edit2 size={13}/></button>
                <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
