
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notificationService } from "@/services/notification";

interface NotificationBellProps {
  onClick: () => void;
  className?: string;
}

const NotificationBell = ({ onClick, className }: NotificationBellProps) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await notificationService.getUserNotifications();
        if (response && response.notifications) {
          const unread = response.notifications.filter(
            (notif: any) => !notif.read
          ).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Set up polling every 2 minutes
    const intervalId = setInterval(fetchNotifications, 2 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={className} 
      onClick={onClick}
      disabled={isLoading}
    >
      <Bell size={18} />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="h-5 w-5 absolute -top-1 -right-1 text-xs p-0 flex items-center justify-center rounded-full"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationBell;
