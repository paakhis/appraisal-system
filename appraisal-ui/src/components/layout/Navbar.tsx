import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, ChevronDown, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserNotifications, markAsRead } from '../../api/notificationApi';
import type { NotificationResponse } from '../../interfaces/notification';
import { initials, notifIcon } from '../../utils/formatters';
import { RoleBadge } from '../common/Badge';

const POLL_INTERVAL_MS = 30000;

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<NotificationResponse[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.isRead).length;

  const loadNotifs = () => {
    if (!user?.id) return;
    getUserNotifications(user.id).then(setNotifs).catch(() => {});
  };

  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleReadOne = async (n: NotificationResponse) => {
    if (n.isRead) return;
    setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
    try { await markAsRead(n.id); } catch { loadNotifs(); }
  };

  const handleReadAll = async () => {
    const unreadOnes = notifs.filter(n => !n.isRead);
    if (unreadOnes.length === 0) return;
    setNotifs(prev => prev.map(x => ({ ...x, isRead: true })));
    try { await Promise.all(unreadOnes.map(n => markAsRead(n.id))); } catch { loadNotifs(); }
  };

  const goToAllNotifications = () => {
    setNotifOpen(false);
    const role = (user?.role || 'employee').toLowerCase();
    navigate(`/${role}/notifications`);
  };

  const recent = notifs.slice(0, 6);

  return (
    <header className="h-14 bg-white border-b border-[#D6E4FF] flex items-center justify-end px-6 gap-4">
      {/* Bell */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen(o => !o)}
          className="relative p-2 rounded-xl hover:bg-[#F4F8FF] text-gray-500"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#0E4CB7] text-white text-[10px] rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-[#D6E4FF] rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7F0FF]">
              <p className="text-sm font-semibold text-gray-800">Notifications</p>
              {unread > 0 && (
                <button
                  onClick={handleReadAll}
                  className="flex items-center gap-1 text-xs font-medium text-[#0E4CB7] hover:underline"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recent.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-400">No notifications yet.</p>
              ) : (
                recent.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleReadOne(n)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-[#F4F8FF] last:border-0 hover:bg-[#F4F8FF] transition-colors ${!n.isRead ? 'bg-[#F4F8FF]/60' : ''}`}
                  >
                    <span className="text-lg shrink-0">{notifIcon(n.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm truncate ${!n.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#0E4CB7] shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <button
              onClick={goToAllNotifications}
              className="w-full text-center text-xs font-medium text-[#0E4CB7] py-2.5 border-t border-[#E7F0FF] hover:bg-[#F4F8FF]"
            >
              View all notifications
            </button>
          </div>
        )}
      </div>

      {/* User dropdown */}
      <div className="relative" ref={profileRef}>
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