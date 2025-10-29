"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Calendar,
  FileText,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
  Clock,
  Check,
  X,
  Filter
} from "lucide-react";
import { mockNotifications, type Notification } from "@/lib/doctor-data";
import { formatDistance } from "date-fns";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "appointment" | "report" | "emergency" | "message">("all");

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-5 h-5" />;
      case "report":
        return <FileText className="w-5 h-5" />;
      case "emergency":
        return <AlertTriangle className="w-5 h-5" />;
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "text-blue-500 bg-blue-50 dark:bg-blue-950";
      case "report":
        return "text-purple-500 bg-purple-50 dark:bg-purple-950";
      case "emergency":
        return "text-red-500 bg-red-50 dark:bg-red-950";
      case "message":
        return "text-green-500 bg-green-50 dark:bg-green-950";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-950";
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAcceptAppointment = (id: string) => {
    // Handle appointment acceptance
    handleMarkAsRead(id);
    // In real app, this would make an API call
    alert("Appointment accepted successfully!");
  };

  const handleRejectAppointment = (id: string) => {
    // Handle appointment rejection
    handleMarkAsRead(id);
    // In real app, this would make an API call
    alert("Appointment rejected.");
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);

    // Navigate based on notification type
    if (notification.type === "appointment" && notification.appointmentId) {
      router.push("/doctor/appointments");
    } else if (notification.type === "report" && notification.patientName) {
      router.push("/doctor/patients");
    } else if (notification.type === "emergency") {
      router.push("/doctor/patients");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Bell className="w-4 h-4" />
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Bell className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Calendar className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">
                {notifications.filter(n => n.type === "appointment").length}
              </p>
              <p className="text-xs text-muted-foreground">Appointments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <FileText className="w-8 h-8 text-purple-500 mb-2" />
              <p className="text-2xl font-bold">
                {notifications.filter(n => n.type === "report").length}
              </p>
              <p className="text-xs text-muted-foreground">Reports</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-2xl font-bold">
                {notifications.filter(n => n.type === "emergency").length}
              </p>
              <p className="text-xs text-muted-foreground">Emergency</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <MessageSquare className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold">
                {notifications.filter(n => n.type === "message").length}
              </p>
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              onClick={() => setFilter("unread")}
              size="sm"
            >
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500">{unreadCount}</Badge>
              )}
            </Button>
            <Button
              variant={filter === "appointment" ? "default" : "outline"}
              onClick={() => setFilter("appointment")}
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </Button>
            <Button
              variant={filter === "report" ? "default" : "outline"}
              onClick={() => setFilter("report")}
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </Button>
            <Button
              variant={filter === "emergency" ? "default" : "outline"}
              onClick={() => setFilter("emergency")}
              size="sm"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency
            </Button>
            <Button
              variant={filter === "message" ? "default" : "outline"}
              onClick={() => setFilter("message")}
              size="sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === "unread"
                ? "You're all caught up!"
                : "No notifications matching this filter"}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(
                      notification.type
                    )}`}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold mb-1">{notification.title}</h4>
                        {notification.patientName && (
                          <Badge variant="outline" className="mb-2">
                            {notification.patientName}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistance(notification.timestamp, new Date(), {
                            addSuffix: true,
                          })}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {notification.message}
                    </p>
                    <div className="flex gap-2">
                      {notification.type === "appointment" && notification.title.includes("Request") && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptAppointment(notification.id);
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectAppointment(notification.id);
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {notification.type === "appointment" && !notification.title.includes("Request") && (
                        <Button size="sm" variant="outline">
                          View Appointment
                        </Button>
                      )}
                      {notification.type === "report" && (
                        <Button size="sm" variant="outline">
                          View Report
                        </Button>
                      )}
                      {notification.type === "emergency" && (
                        <Button size="sm" variant="destructive">
                          View Emergency
                        </Button>
                      )}
                      {notification.type === "message" && (
                        <Button size="sm" variant="outline">
                          Reply
                        </Button>
                      )}
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
