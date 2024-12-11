import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/auth/LoginForm";
import { Navigate } from "react-router-dom";

const Login = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoginForm />
        </div>
    );
};

export default Login;
