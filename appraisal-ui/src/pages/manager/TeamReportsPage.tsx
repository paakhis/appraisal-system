import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers } from '../../api/userApi';
import { getAllGoals } from '../../api/goalApi';
import { getAllReviews } from '../../api/reviewApi';
// import { getAllAppraisals } from '../../api/appraisalApi';
import { Spinner } from '../../components/common/Spinner';
import type { UserResponse } from '../../interfaces/user';
import type { ReviewResponse } from '../../interfaces/review';


export const TeamReportsPage = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [teamSize, setTeamSize] = useState(0);
    const [APPROVEDGoals, setAPPROVEDGoals] = useState(0);
    const [pendingGoals, setPendingGoals] = useState(0);
    const [pendingReviews, setPendingReviews] = useState(0);

    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [teamUsers, setTeamUsers] = useState<UserResponse[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [
                    users,
                    goals,
                    reviewsData,
                    // appraisals
                ] = await Promise.all([
                    getAllUsers(),
                    getAllGoals(),
                    getAllReviews(),
                    // getAllAppraisals()
                ]);

                const teamMembers = users.filter(
                    u => u.managerId === user?.id
                );

                const teamIds = teamMembers.map(
                    u => u.id
                );

                const teamGoals = goals.filter(
                    g => teamIds.includes(g.userId)
                );

                const teamReviews = reviewsData.filter(
                    r => r.managerId === user?.id
                );

                setTeamUsers(teamMembers);
                setReviews(teamReviews);

                setTeamSize(teamMembers.length);

                setAPPROVEDGoals(
                    teamGoals.filter(
                        g => g.status === 'APPROVED'
                    ).length
                );

                setPendingGoals(
                    teamGoals.filter(
                        g => g.status !== 'APPROVED'
                    ).length
                );

                setPendingReviews(
                    teamReviews.filter(
                        r => r.status === 'SUBMITTED'
                    ).length
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [user]);

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Team Reports
                </h1>

                <p className="text-sm text-gray-500">
                    Overview of your team's performance
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                <div className="card">
                    <p className="text-sm text-gray-500">
                        Team Members
                    </p>

                    <h2 className="text-3xl font-bold text-[#0E4CB7] mt-2">
                        {teamSize}
                    </h2>
                </div>

                <div className="card">
                    <p className="text-sm text-gray-500">
                        Approved Goals
                    </p>

                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                        {APPROVEDGoals}
                    </h2>
                </div>

                <div className="card">
                    <p className="text-sm text-gray-500">
                        Pending Goals
                    </p>

                    <h2 className="text-3xl font-bold text-orange-500 mt-2">
                        {pendingGoals}
                    </h2>
                </div>

                <div className="card">
                    <p className="text-sm text-gray-500">
                        Pending Reviews
                    </p>

                    <h2 className="text-3xl font-bold text-red-500 mt-2">
                        {pendingReviews}
                    </h2>
                </div>

            </div>

            {/* Team Review Summary */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">
                    Team Review Summary
                </h3>

                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        No reviews found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left p-3">
                                    Employee
                                </th>

                                <th className="text-left p-3">
                                    Rating
                                </th>

                                <th className="text-left p-3">
                                    Status
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {reviews.map(review => (
                                <tr
                                    key={review.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-3">
                                        {
                                            teamUsers.find(
                                                u => u.id === review.employeeId
                                            )?.name || 'Unknown'
                                        }
                                    </td>

                                    <td className="p-3">
                                        {review.performanceRating}/5
                                    </td>

                                    <td className="p-3">
                      <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                              review.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-700'
                                  : review.status === 'SUBMITTED'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {review.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};