import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserNotifications, markAsRead } from '../../api/notificationApi';
import type { NotificationResponse } from '../../interfaces/notification';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate, notifIcon } from '../../utils/formatters';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => getUserNotifications(user!.id).then(setNotifs).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, [user]);

  const handleRead = async (id: number) => {
    await markAsRead(id).catch(() => {});
    setNotifs(n => n.map(x => x.id === id ? { ...x, isRead: true } : x));
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          {/* <p className="text-sm text-gray-500 mt-0.5">{notifs.filter(n => !n.isRead).length} unread</p> */}
        </div>
      </div>

      {notifs.length === 0 ? <EmptyState message="No notifications yet." icon="" /> : (
        <div className="space-y-3">
          {notifs.map(n => (
            <div key={n.id} onClick={() => !n.isRead && handleRead(n.id)}
              className={`card cursor-pointer hover:border-[#D6E4FF] transition-colors ${!n.isRead ? 'border-[#BFD5FF] bg-[#F4F8FF]' : ''}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{notifIcon(n.type)}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!n.isRead ? 'text-[#C3006F]' : 'text-gray-800'}`}>{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#0E4CB7] shrink-0 mt-1" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
