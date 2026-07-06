import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { getAllUsers, createUser, updateUser, deleteUser, createUsersBulk } from '../../api/userApi';
import { getAllDepartments } from '../../api/departmentApi';
import type { UserResponse, UserRequest, BulkUserResponse } from '../../interfaces/user';
import type { DepartmentResponse } from '../../interfaces/department';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { RoleBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { Plus, Trash2, Edit2, X, Check, Search, Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { initials } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';

const BULK_TEMPLATE_HEADERS = ['name', 'email', 'password', 'designation', 'role', 'department', 'managerEmail'];

interface BulkRow {
  row: number;
  name: string;
  email: string;
  password: string;
  designation: string;
  role: string;
  department: string;
  managerEmail: string;
  error?: string;
}

function parseCsv(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.split(',').map(cell => cell.trim()));
}

async function parseExcel(file: File): Promise<string[][]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
  return rows
    .map(row => row.map(cell => String(cell ?? '').trim()))
    .filter(row => row.some(cell => cell.length > 0));
}

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

  const [showBulk, setShowBulk] = useState(false);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkUserResponse | null>(null);
  const [bulkParseError, setBulkParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const downloadTemplate = () => {
    const sample = ['Jane Doe', 'jane.doe@company.com', 'Passw0rd!', 'Software Engineer', 'EMPLOYEE', 'Engineering', 'manager@company.com'];
    const worksheet = XLSX.utils.aoa_to_sheet([BULK_TEMPLATE_HEADERS, sample]);
    worksheet['!cols'] = BULK_TEMPLATE_HEADERS.map(() => ({ wch: 22 }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    XLSX.writeFile(workbook, 'employees_bulk_template.xlsx');
  };

  const openBulk = () => {
    setBulkRows([]);
    setBulkResult(null);
    setBulkParseError(null);
    setShowBulk(true);
  };

  const handleFileSelect = (file: File) => {
    setBulkParseError(null);
    setBulkResult(null);

    const isExcel = /\.xlsx?$/i.test(file.name);
    const rowsPromise = isExcel ? parseExcel(file) : file.text().then(parseCsv);

    rowsPromise.then(rows => {
      if (rows.length === 0) {
        setBulkParseError('The file is empty.');
        return;
      }
      const header = rows[0].map(h => h.toLowerCase());
      const dataRows = rows.slice(1);
      if (dataRows.length === 0) {
        setBulkParseError('No employee rows found below the header.');
        return;
      }

      const idx = (col: string) => header.indexOf(col);
      const parsed: BulkRow[] = dataRows.map((cells, i) => {
        const get = (col: string) => {
          const at = idx(col);
          return at >= 0 ? (cells[at] ?? '').trim() : '';
        };
        const name = get('name');
        const email = get('email');
        const password = get('password');
        const designation = get('designation');
        const role = get('role').toUpperCase();
        const department = get('department');
        const managerEmail = get('manageremail');

        let error: string | undefined;
        if (!name || !email || !password || !designation || !role || !department) {
          error = 'Missing required field(s)';
        } else if (!Object.values(ROLES).includes(role)) {
          error = `Unknown role "${role}"`;
        } else if (!depts.some(d => d.name.toLowerCase() === department.toLowerCase())) {
          error = `Unknown department "${department}"`;
        } else if (managerEmail && !users.some(u => u.email.toLowerCase() === managerEmail.toLowerCase())) {
          error = `Manager email "${managerEmail}" not found`;
        }

        return { row: i + 1, name, email, password, designation, role, department, managerEmail, error };
      });

      setBulkRows(parsed);
    }).catch(() => setBulkParseError('Could not read this file. Please upload a valid Excel (.xlsx) or CSV file.'));
  };

  const handleBulkUpload = async () => {
    const validRows = bulkRows.filter(r => !r.error);
    if (validRows.length === 0) return;

    setBulkUploading(true);
    try {
      const payload: UserRequest[] = validRows.map(r => ({
        name: r.name,
        email: r.email,
        password: r.password,
        designation: r.designation,
        roles: r.role,
        departmentId: depts.find(d => d.name.toLowerCase() === r.department.toLowerCase())!.id,
        managerId: r.managerEmail
          ? users.find(u => u.email.toLowerCase() === r.managerEmail.toLowerCase())?.id
          : undefined,
      }));
      const result = await createUsersBulk(payload);
      setBulkResult(result);
      await load();
    } catch {
      setBulkParseError('Bulk upload failed. Please try again.');
    } finally {
      setBulkUploading(false);
    }
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
                onClick={openBulk}
                className="btn-secondary flex items-center gap-2"
            >
              <Upload size={16} />
              Bulk Upload
            </button>

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

        {filtered.length === 0 ? <EmptyState message="No employees found." icon="👤"/> : (
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

        <Modal
          isOpen={showBulk}
          onClose={() => setShowBulk(false)}
          title="Bulk Upload Employees"
          description="Upload an Excel (.xlsx) or CSV file to add multiple employees at once"
        >
          <div className="space-y-4">
            <button onClick={downloadTemplate} className="btn-secondary flex items-center gap-2 text-xs">
              <Download size={14} /> Download Excel Template
            </button>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-[#D6E4FF] py-6 text-sm text-gray-500 hover:bg-[#F4F8FF] transition flex flex-col items-center gap-2"
              >
                <Upload size={20} className="text-[#0E4CB7]" />
                Click to choose an Excel (.xlsx) or CSV file
              </button>
            </div>

            {bulkParseError && (
              <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                <AlertCircle size={15} /> {bulkParseError}
              </p>
            )}

            {bulkRows.length > 0 && !bulkResult && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  {bulkRows.filter(r => !r.error).length} of {bulkRows.length} rows look valid
                </p>
                <div className="max-h-56 overflow-y-auto rounded-lg border border-[#D6E4FF]">
                  <table className="w-full text-xs">
                    <thead className="bg-[#F4F8FF] sticky top-0">
                      <tr>
                        <th className="px-2 py-1.5 text-left">Row</th>
                        <th className="px-2 py-1.5 text-left">Name</th>
                        <th className="px-2 py-1.5 text-left">Email</th>
                        <th className="px-2 py-1.5 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkRows.map(r => (
                        <tr key={r.row} className="border-t border-[#EEF3FC]">
                          <td className="px-2 py-1.5">{r.row}</td>
                          <td className="px-2 py-1.5">{r.name || '—'}</td>
                          <td className="px-2 py-1.5">{r.email || '—'}</td>
                          <td className="px-2 py-1.5">
                            {r.error ? (
                              <span className="text-red-500">{r.error}</span>
                            ) : (
                              <span className="text-green-600">Ready</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handleBulkUpload}
                  disabled={bulkUploading || bulkRows.every(r => r.error)}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <Check size={15} />
                  {bulkUploading ? 'Uploading...' : `Upload ${bulkRows.filter(r => !r.error).length} Employees`}
                </button>
              </div>
            )}

            {bulkResult && (
              <div className="space-y-2">
                <p className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  <CheckCircle2 size={15} /> {bulkResult.created.length} employee(s) created successfully
                </p>
                {bulkResult.errors.length > 0 && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-2 max-h-40 overflow-y-auto">
                    {bulkResult.errors.map(e => (
                      <p key={e.row} className="text-xs text-red-600">
                        Row {e.row} ({e.email || 'no email'}): {e.message}
                      </p>
                    ))}
                  </div>
                )}
                <button onClick={() => setShowBulk(false)} className="btn-secondary">Done</button>
              </div>
            )}
          </div>
        </Modal>
      </div>
  );
};