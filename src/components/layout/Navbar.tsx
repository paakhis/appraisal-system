import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getLatestNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead
} from '../../api/notificationApi';

import type { NotificationResponse } from '../../interfaces/notification'; import { initials } from '../../utils/formatters';
import { RoleBadge } from '../common/Badge';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  const [unread, setUnread] = useState(0);

  useEffect(() => {

    if (!user?.id) return;

    loadNotifications();

  }, [user]);

  const loadNotifications = async () => {

    try {

      const [count, latest] = await Promise.all([
        getUnreadCount(user!.id),
        getLatestNotifications(user!.id)
      ]);

      setUnread(count);

      setNotifications(latest);

    } catch (e) {

      console.error(e);

    }

  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="h-14 bg-white border-b border-[#D6E4FF] flex items-center justify-end px-6 gap-4">
      {/* Bell */}
      <button
        onClick={() => setNotificationOpen(!notificationOpen)}
        className="relative p-2 rounded-xl hover:bg-[#F4F8FF] text-gray-500">        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#0E4CB7] text-white text-[10px] rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {notificationOpen && (

        <div className="absolute right-20 top-14 w-96 bg-white rounded-2xl border border-[#D6E4FF] shadow-xl z-50 overflow-hidden">

          {/* Header */}

          <div className="flex items-center justify-between px-5 py-4 border-b">

            <h3 className="font-semibold text-gray-800">
              Notifications
            </h3>

            {unread > 0 && (
              <span className="text-xs font-medium text-[#0E4CB7]">
                {unread} unread
              </span>
            )}

          </div>

          {/* Notifications */}

          <div className="max-h-[380px] overflow-y-auto">

            {notifications.length === 0 ? (

              <div className="py-10 text-center text-sm text-gray-500">
                No notifications
              </div>

            ) : (

              notifications.map(notification => (

                <button
                  key={notification.id}
                  onClick={async () => {

                    if (!notification.isRead) {
                      await markAsRead(notification.id);
                      loadNotifications();
                    }

                  }}
                  className="w-full text-left px-5 py-4 hover:bg-[#F7FAFF] transition border-b last:border-none">

                  <div className="flex gap-3">

                    <div className="mt-2">

                      {!notification.isRead && (

                        <div className="w-2.5 h-2.5 rounded-full bg-[#0E4CB7]" />

                      )}

                    </div>

                    <div className="flex-1">

                      <p
                        className={`text-sm ${notification.isRead
                            ? "text-gray-600"
                            : "font-semibold text-gray-900"
                          }`}
                      >
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>

                    </div>

                  </div>

                </button>

              ))

            )}

          </div>

          {/* Footer */}

          <div className="border-t">

            <button
              onClick={async () => {

                await markAllAsRead(user!.id);

                loadNotifications();

              }}
              className="w-full py-3 text-sm text-[#0E4CB7] hover:bg-[#F5F9FF]">

              Mark all as read

            </button>

            <button
              onClick={() => {
                setNotificationOpen(false);
                if (user?.role === "HR") {
                  navigate("/hr/notifications");
                } else if (user?.role === "MANAGER") {
                  navigate("/manager/notifications");
                } else {
                  navigate("/employee/notifications");
                }
              }}
              className="w-full py-3 border-t text-sm font-medium hover:bg-[#F5F9FF] transition"
            >
              Show all notifications →
            </button>

          </div>

        </div>

      )}

      {/* User dropdown */}
      <div className="relative">
        <button onClick={() => setDropdown(d => !d)}
          className="flex items-center gap-2 hover:bg-[#F4F8FF] px-3 py-1.5 rounded-xl transition">
          <div className="w-8 h-8 rounded-full bg-[#0E4CB7] text-white flex items-center justify-center text-xs font-bold">
            {initials(user?.name || '')}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-[10px] text-[#0E4CB7] font-semibold uppercase">{user?.role}</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {dropdown && (
          <div className="absolute right-0 top-12 w-44 bg-white border border-[#D6E4FF] rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E7F0FF]">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <RoleBadge role={user?.role || ''} />
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
