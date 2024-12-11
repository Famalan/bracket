import { Routes, Route, Navigate } from "react-router-dom";
import Tournaments from "@/pages/Tournaments";
import CreateTournament from "@/pages/CreateTournament";
import TournamentDetails from "@/pages/TournamentDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Schedule from "@/pages/Schedule";
import Teams from "@/pages/Teams";
import Settings from "@/pages/Settings";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/hooks/useAuth";

export function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/tournaments" replace />
                    ) : (
                        <Login />
                    )
                }
            />
            <Route
                path="/register"
                element={
                    isAuthenticated ? (
                        <Navigate to="/tournaments" replace />
                    ) : (
                        <Register />
                    )
                }
            />
            <Route
                path="/tournaments"
                element={
                    <PrivateRoute>
                        <Tournaments />
                    </PrivateRoute>
                }
            />
            <Route
                path="/tournaments/create"
                element={
                    <PrivateRoute>
                        <CreateTournament />
                    </PrivateRoute>
                }
            />
            <Route
                path="/tournaments/:id"
                element={
                    <PrivateRoute>
                        <TournamentDetails />
                    </PrivateRoute>
                }
            />
            <Route
                path="/schedule"
                element={
                    <PrivateRoute>
                        <Schedule />
                    </PrivateRoute>
                }
            />
            <Route
                path="/teams"
                element={
                    <PrivateRoute>
                        <Teams />
                    </PrivateRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<Navigate to="/tournaments" replace />} />
            <Route path="*" element={<Navigate to="/tournaments" replace />} />
        </Routes>
    );
}
