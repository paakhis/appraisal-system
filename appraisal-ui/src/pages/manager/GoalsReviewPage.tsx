import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { approveGoal, createGoal, deleteGoal, getAllGoals, rejectGoal, submitGoal, updateGoal } from '../../api/goalApi';
import { getAllUsers } from '../../api/userApi';
import { getAllCycles } from '../../api/cycleApi';

import type { GoalResponse, GoalRequest } from '../../interfaces/goal';
import type { UserResponse } from '../../interfaces/user';
import type { AppraisalCycleResponse } from '../../interfaces/cycle';

import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';

import { formatDate } from '../../utils/formatters';

import {
    Plus,
    User,
    X,
    Check,
    Edit2,
    Trash2
} from 'lucide-react';

export const GoalsReviewPage = () => {
    const { user } = useAuth();

    const [goals, setGoals] = useState<GoalResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [cycles, setCycles] = useState<AppraisalCycleResponse[]>([]);

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState<GoalResponse | null>(null);
    const [saving, setSaving] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<GoalRequest>();

    const loadData = async () => {
        try {
            const allGoals = await getAllGoals();
            const allUsers = await getAllUsers();
            const allCycles = await getAllCycles();

            console.log("Goals", allGoals);
            console.log("Users", allUsers);

            console.log("Logged User", user);

            const teamUsers = allUsers.filter(
                u => u.managerId === user?.id
            );

            console.log("Team Users", teamUsers);

            const teamIds = teamUsers.map(u => u.id);

            console.log("Team IDs", teamIds);

            const filteredGoals = allGoals.filter(
                g => teamIds.includes(g.userId)
            );

            console.log("Filtered Goals", filteredGoals);

            setUsers(teamUsers);
            setCycles(allCycles);
            setGoals(filteredGoals);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const handleSubmitGoal = async (goal: GoalResponse) => {
        if (goal.status !== 'DRAFT') return;
        setActionLoadingId(goal.id);
        try {
            const updatedGoal = await submitGoal(goal.id);
            setGoals(prev => prev.map(g => g.id === goal.id ? updatedGoal : g));
            await loadData();
        } catch (error) {
            console.error('Failed to submit goal:', error);
            window.alert('Could not submit the goal. Please make sure the backend is running and try again.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleApprove = async (goal: GoalResponse) => {
        if (goal.status !== 'COMPLETED') return;
        setActionLoadingId(goal.id);
        try {
            const updatedGoal = await approveGoal(goal.id);
            setGoals(prev => prev.map(g => g.id === goal.id ? updatedGoal : g));
            await loadData();
        } catch (error) {
            console.error('Failed to approve goal:', error);
            window.alert('Could not approve the goal. Please try again.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReject = async (goal: GoalResponse) => {
        if (goal.status !== 'COMPLETED') return;
        setActionLoadingId(goal.id);
        try {
            const updatedGoal = await rejectGoal(goal.id);
            setGoals(prev => prev.map(g => g.id === goal.id ? updatedGoal : g));
            await loadData();
        } catch (error) {
            console.error('Failed to reject goal:', error);
            window.alert('Could not reject the goal. Please try again.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const onSubmit = async (
        data: GoalRequest
    ) => {
        setSaving(true);

        try {
            const goalData = {
                ...data,
                status: 'DRAFT',
            };
            if (editingGoal) {
                await updateGoal(editingGoal.id, goalData);
            } else {
                await createGoal(goalData);
            }

            setShowForm(false);
            setEditingGoal(null);
            reset();

            await loadData();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleEditGoal = (goal: GoalResponse) => {
        if (goal.status !== 'DRAFT') return;
        setEditingGoal(goal);
        reset({
            title: goal.title,
            description: goal.description || '',
            targetDate: goal.targetDate,
            userId: goal.userId,
            appraisalCycleId: goal.appraisalCycleId,
            status: 'DRAFT',
        });
        setShowForm(true);
    };

    const handleDeleteGoal = async (goal: GoalResponse) => {
        if (goal.status !== 'DRAFT') return;
        const confirmed = window.confirm('Delete this draft goal?');
        if (!confirmed) return;
        setActionLoadingId(goal.id);
        try {
            await deleteGoal(goal.id);
            await loadData();
        } finally {
            setActionLoadingId(null);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-5xl space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Team Goals
                    </h1>

                    <p className="text-sm text-gray-500">
                        {goals.length} total goals
                    </p>
                </div>

                <button
                    onClick={() => {
                        reset({
                            status: 'DRAFT'
                        });

                        setShowForm(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Goal
                </button>
            </div>

            {/* Goal Form */}
            {showForm && (
                <div className="card border-[#D6E4FF]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                            {editingGoal ? 'Edit Goal' : 'Assign Goal'}
                        </h3>

                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingGoal(null);
                                reset();
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div>
                            <label className="label">
                                Goal Title
                            </label>

                            <input
                                {...register('title', {
                                    required: 'Title is required'
                                })}
                                className="input-field"
                                placeholder="Enter goal title"
                            />

                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="label">
                                Description
                            </label>

                            <textarea
                                {...register('description')}
                                className="input-field resize-none"
                                rows={3}
                                placeholder="Goal description"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    Employee
                                </label>

                                <select
                                    {...register('userId', {
                                        required: true,
                                        valueAsNumber: true
                                    })}
                                    className="input-field"
                                >
                                    <option value="">
                                        Select Employee
                                    </option>

                                    {users.map(u => (
                                        <option
                                            key={u.id}
                                            value={u.id}
                                        >
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">
                                    Target Date
                                </label>

                                <input
                                    type="date"
                                    {...register('targetDate', {
                                        required: true
                                    })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                Appraisal Cycle
                            </label>

                            <select
                                {...register(
                                    'appraisalCycleId',
                                    {
                                        required: true,
                                        valueAsNumber: true
                                    }
                                )}
                                className="input-field"
                            >
                                <option value="">
                                    Select Cycle
                                </option>
                                {cycles.map(c => (
                                    <option
                                        key={c.id}
                                        value={c.id}
                                    >
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Check size={15} />
                            {saving
                                ? 'Saving...'
                                : editingGoal
                                    ? 'Update Goal'
                                    : 'Assign Goal'}
                        </button>
                    </form>
                </div>
            )}

            {/* Goals List */}
            {goals.length === 0 ? (
                <EmptyState
                    message="No team goals found."
                    icon=""
                />
            ) : (
                <div className="space-y-3">
                    {goals.map(g => (
                        <div
                            key={g.id}
                            className="card hover:border-[#D6E4FF] transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-1">

                                    <p className="font-semibold text-gray-800">
                                        {g.title}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1">
                                        <User
                                            size={14}
                                            className="text-[#0E4CB7]"
                                        />

                                        <span className="text-sm font-medium text-[#0E4CB7]">
                                            {g.employeeName}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Cycle: {g.cycleName}
                                    </p>

                                    {g.description && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            {g.description}
                                        </p>
                                    )}

                                    <p className="text-xs text-gray-400 mt-2">
                                        Target: {formatDate(
                                            g.targetDate
                                        )}
                                    </p>
                                </div>

                                {g.status === 'APPROVED' ? (
                                    <span className="px-3 py-2 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                                        APPROVED
                                    </span>
                                ) : g.status === 'REJECTED' ? (
                                    <span className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
                                        REJECTED
                                    </span>
                                ) : g.status === 'COMPLETED' ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(g)}
                                            disabled={actionLoadingId === g.id}
                                            className="px-3 py-2 rounded-lg bg-green-100 text-green-700 text-xs font-semibold"
                                        >
                                            {actionLoadingId === g.id ? 'Please wait...' : 'Approve'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(g)}
                                            disabled={actionLoadingId === g.id}
                                            className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-xs font-semibold"
                                        >
                                            {actionLoadingId === g.id ? 'Please wait...' : 'Reject'}
                                        </button>
                                    </div>
                                ) : (g.status === 'ASSIGNED' || g.status === 'SUBMITTED') ? (
                                    <span className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                                        {g.status === 'SUBMITTED' ? 'SUBMITTED' : 'ASSIGNED'}
                                    </span>
                                ) : g.status === 'ACKNOWLEDGED' ? (
                                    <span className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                        ACKNOWLEDGED
                                    </span>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={async () => {
                                                const confirmed = window.confirm('Submit this draft goal to the employee?');
                                                if (confirmed) {
                                                    await handleSubmitGoal(g);
                                                }
                                            }}
                                            disabled={actionLoadingId === g.id}
                                            className="px-3 py-2 rounded-lg bg-[#0E4CB7] text-white text-xs font-semibold"
                                        >
                                            {actionLoadingId === g.id ? 'Please wait...' : 'Submit'}
                                        </button>
                                        <button
                                            onClick={() => handleEditGoal(g)}
                                            className="p-2 rounded-lg hover:bg-[#F4F8FF] text-gray-400 hover:text-[#0E4CB7] transition"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteGoal(g)}
                                            disabled={actionLoadingId === g.id}
                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};