
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

type Notification = {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
};

// Mock notifications data
const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Performance Review Due",
    message: "Your quarterly performance review is due in 3 days.",
    timestamp: "Just now",
    type: "alert",
    read: false
  },
  {
    id: 2,
    title: "Leave Approved",
    message: "Your leave request for Dec 20-27 has been approved.",
    timestamp: "2 hours ago",
    type: "success",
    read: false
  },
  {
    id: 3,
    title: "New Feedback",
    message: "David Rodriguez has submitted feedback for you.",
    timestamp: "Yesterday",
    type: "info",
    read: false
  },
  {
    id: 4,
    title: "Team Meeting",
    message: "Reminder: Weekly team meeting tomorrow at 10 AM.",
    timestamp: "Yesterday",
    type: "info",
    read: true
  },
  {
    id: 5,
    title: "Task Deadline Approaching",
    message: "Your task 'Complete Frontend Project' is due in 2 days.",
    timestamp: "2 days ago",
    type: "warning",
    read: true
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  
  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-1 rounded-full">
          <span className="sr-only">View notifications</span>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white"
            >
              {unreadCount}
            </motion.div>
          )}
          <Bell className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        {notifications.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`${notification.read ? 'opacity-70' : ''} hover:bg-muted rounded-md p-2 transition-colors`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeStyles(notification.type)}>
                          {notification.type === 'info' && 'Info'}
                          {notification.type === 'warning' && 'Warning'}
                          {notification.type === 'success' && 'Success'}
                          {notification.type === 'alert' && 'Alert'}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        )}
        <Separator />
        <div className="p-2 text-center">
          <Button variant="ghost" size="sm" className="text-xs w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
