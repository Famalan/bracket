import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { logout, user } = useAuth();

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <header className="border-b">
                    <div className="container flex h-16 items-center justify-between">
                        <div className="text-xl font-bold">
                            E-Sport Symphony
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <UserAvatar user={user} />
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {user?.username}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                            <Button variant="outline" onClick={logout}>
                                Выйти
                            </Button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto">
                    <div className="container py-6">{children}</div>
                </main>
            </div>
        </div>
    );
};
