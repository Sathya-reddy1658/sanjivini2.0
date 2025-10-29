"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Bell,
  User,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope
} from "lucide-react";
import { mockNotifications } from "@/lib/doctor-data";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Set default doctor name
    setDoctorName("Rajesh Kumar");
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/doctor/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      href: "/doctor/patients",
      icon: Users,
    },
    {
      name: "Appointments",
      href: "/doctor/appointments",
      icon: Calendar,
    },
    {
      name: "Medical Records",
      href: "/doctor/records",
      icon: FileText,
    },
    {
      name: "Schedule",
      href: "/doctor/schedule",
      icon: Activity,
    },
    {
      name: "Notifications",
      href: "/doctor/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      name: "Profile",
      href: "/doctor/profile",
      icon: User,
    },
  ];

  const NavItem = ({ item, isMobile = false }: { item: typeof navigation[0], isMobile?: boolean }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
          isActive
            ? "bg-blue-500 text-white"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        } ${!isExpanded && !isMobile ? "justify-center" : ""}`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {(isExpanded || isMobile) && (
          <span className="font-medium">{item.name}</span>
        )}
        {item.badge && (isExpanded || isMobile) && (
          <Badge className="ml-auto bg-red-500">{item.badge}</Badge>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col border-r bg-card transition-all duration-300 ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          {isExpanded ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">Doctor Portal</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(true)}
              className="mx-auto"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Doctor Info */}
        {isExpanded && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {doctorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">Dr. {doctorName}</p>
                <p className="text-xs text-muted-foreground">Physician</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={`w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 ${
              !isExpanded ? "px-0 justify-center" : ""
            }`}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">Doctor Portal</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Doctor Info */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {doctorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">Dr. {doctorName}</p>
                  <p className="text-xs text-muted-foreground">Physician</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} isMobile />
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Logout</span>
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">Doctor Portal</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
