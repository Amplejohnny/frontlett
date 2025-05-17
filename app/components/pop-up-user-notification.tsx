import { useState, useEffect, useRef } from "react";
import { LuX } from "react-icons/lu";
import { get } from "~/libs/axios";
import type { User } from "~/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";

type Role = User["role"];

interface NotificationUser {
  id: string;
  full_name: string;
  profile_picture: string;
  location: string;
  role: Role;
  addedAt: number;
}

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState<NotificationUser[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRecentUsers = async () => {
    try {
      const response = await get("/users?limit=4&sort=created_at:desc");
      const now = Date.now();
      const users = (response.data as User[])
        .filter((user) => user.role === "employee" || user.role === "business")
        .map(
          (user: User): NotificationUser => ({
            id: user.id,
            full_name: user.full_name,
            profile_picture: user.profile?.profile_picture || "",
            location: user.location || "Unknown",
            role: user.role,
            addedAt: now,
          })
        );

      if (users.length === 0) return;

      setNotifications((prev) => {
        const newIds = new Set(users.map((u) => u.id));
        return [...users, ...prev.filter((u) => !newIds.has(u.id))].slice(0, 4);
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchRecentUsers();

    intervalRef.current = setInterval(fetchRecentUsers, 10000); // Poll every 10s

    const cleanupInterval = setInterval(() => {
      setNotifications((prev) =>
        prev.filter((n) => Date.now() - n.addedAt < 45000)
      );
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(cleanupInterval);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AnimatePresence>
      {notifications.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-xs w-full">
          {notifications.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-xl shadow-md flex items-center px-4 py-3 gap-3 border border-gray-200"
            >
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-800 leading-snug">
                  <strong>{user.full_name}</strong> from {user.location} joined
                  as {user.role === "employee" ? "Employee" : "Employer"}!
                </p>
              </div>
              <button onClick={() => removeNotification(user.id)}>
                <LuX className="text-gray-500 hover:text-gray-800" size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
