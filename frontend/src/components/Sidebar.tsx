import { Trophy, Users, Calendar, Settings, Home } from "lucide-react";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: "Главная", path: "/" },
    { icon: Trophy, label: "Турниры", path: "/tournaments" },
    { icon: Users, label: "Команды", path: "/teams" },
    { icon: Calendar, label: "Расписание", path: "/schedule" },
    { icon: Settings, label: "Настройки", path: "/settings" },
  ];

  return (
    <div className="h-screen w-64 bg-secondary/20 border-r border-secondary p-4">
      <div className="flex items-center gap-2 mb-8">
        <Trophy className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold">E-Sport Symphony</span>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-md hover:bg-secondary/50 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};