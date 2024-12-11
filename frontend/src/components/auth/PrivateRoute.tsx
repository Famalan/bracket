import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PrivateRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};
