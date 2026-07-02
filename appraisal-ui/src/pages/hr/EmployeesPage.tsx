import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../api/userApi';
import { getAllDepartments } from '../../api/departmentApi';
import type { UserResponse, UserRequest } from '../../interfaces/user';
import type { DepartmentResponse } from '../../interfaces/department';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { RoleBadge } from '../../components/common/Badge';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { Plus, Trash2, Edit2, X, Check, Search } from 'lucide-react';
import { initials } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';

export const EmployeesPage = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [depts, setDepts] = useState<DepartmentResponse[]>([]);
  const [managers, setManagers] = useState<UserResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<UserResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UserRequest>();

  const load = async () => {
    const [u, d] = await Promise.all([getAllUsers(), getAllDepartments()]);
    setUsers(u); setDepts(d);
    setManagers(u.filter(x => x.roles === 'MANAGER'));
    setLoading(false);
  };
  useEffect(() => { load().catch(() => setLoading(false)); }, []);

  const openAdd = () => { reset(); setEditing(null); setShowForm(true); };
  const openEdit = (u: UserResponse) => {
    setValue('name', u.name); setValue('email', u.email); setValue('roles', u.roles);
    setValue('designation', u.designation); setValue('departmentId', u.departmentId);
    if (u.managerId) setValue('managerId', u.managerId);
    setEditing(u); setShowForm(true);
  };

  const onSubmit = async (data: UserRequest) => {
    setSaving(true);
    try {
      if (editing) await updateUser(editing.id, data);
      else await createUser(data);
      setShowForm(false); await load();
    } catch { }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    await deleteUser(id).catch(() => {});
    await load();
  };

  const filtered = users.filter(u => {
    const term = search.toLowerCase();

    const matchesSearch =
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.designation.toLowerCase().includes(term) ||
        (u.departmentName && u.departmentName.toLowerCase().includes(term)) ||
        u.roles.toLowerCase().includes(term);

    const matchesFilter =
        filter === '' ||
        u.roles === filter ||
        u.designation === filter ||
        (u.departmentName && u.departmentName === filter);

    return matchesSearch && matchesFilter;
  });

  if (loading) return <Spinner />;

  return (
      <div className="max-w-5xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Employees</h1>
            <p className="text-sm text-gray-500">{users.length} total</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, email, role..."
                  className="input-field pl-9 w-52"
              />
            </div>

            <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="input-field w-48"
            >
              <option value="">All</option>

              <optgroup label="Role">
                <option value="MANAGER">Managers</option>
                <option value="EMPLOYEE">Employees</option>
              </optgroup>

              <optgroup label="Department">
                {depts.map(d => (
                    <option key={`dept-${d.id}`} value={d.name}>
                      {d.name}
                    </option>
                ))}
              </optgroup>

              <optgroup label="Designation">
                {Array.from(new Set(users.map(u => u.designation))).map(designation => (
                    <option key={`desig-${designation}`} value={designation}>
                      {designation}
                    </option>
                ))}
              </optgroup>
            </select>

            <button
                onClick={openAdd}
                className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
        </div>

        {showForm && (
            <div className="card border-[#D6E4FF]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">{editing ? 'Edit Employee' : 'New Employee'}</h3>
                <button onClick={() => setShowForm(false)}><X size={16} className="text-gray-400"/></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Full Name" registration={register('name',{required:'Required'})} error={errors.name?.message} placeholder="John Doe"/>
                  <FormInput label="Email" type="email" registration={register('email',{required:'Required'})} error={errors.email?.message} placeholder="john@company.com"/>
                  {!editing && <FormInput label="Password" type="password" registration={register('password',{required:'Required'})} error={errors.password?.message} placeholder="••••••"/>}
                  <FormInput label="Designation" registration={register('designation',{required:'Required'})} error={errors.designation?.message} placeholder="Software Engineer"/>
                  <FormSelect label="Role" registration={register('roles',{required:'Required'})}
                              options={Object.values(ROLES).map(r=>({value:r,label:r}))} error={errors.roles?.message}/>
                  <FormSelect label="Department" registration={register('departmentId',{required:'Required',valueAsNumber:true})}
                              options={depts.map(d=>({value:d.id,label:d.name}))} error={errors.departmentId?.message}/>
                  <FormSelect label="Manager (optional)" registration={register('managerId',{valueAsNumber:true})}
                              options={managers.map(m=>({value:m.id,label:m.name}))}/>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    <Check size={15}/>{saving?'Saving...':editing?'Update':'Create'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
        )}

        {filtered.length === 0 ? <EmptyState message="No employees found." icon=""/> : (
            <div className="card p-0 overflow-hidden">
              <table className="w-full">
                <thead><tr>
                  <th className="table-header">Name</th>
                  <th className="table-header hidden sm:table-cell">Designation</th>
                  <th className="table-header hidden md:table-cell">Department</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Actions</th>
                </tr></thead>
                <tbody>
                {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-[#F4F8FF] transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E7F0FF] text-[#0E4CB7] text-xs font-bold flex items-center justify-center shrink-0">{initials(u.name)}</div>
                          <div><p className="font-medium text-gray-800">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                        </div>
                      </td>
                      <td className="table-cell hidden sm:table-cell">{u.designation}</td>
                      <td className="table-cell hidden md:table-cell">{u.departmentName}</td>
                      <td className="table-cell"><RoleBadge role={u.roles}/></td>
                      <td className="table-cell">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-[#E7F0FF] text-gray-400 hover:text-[#0E4CB7] transition"><Edit2 size={13}/></button>
                          <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"><Trash2 size={13}/></button>
                        </div>
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