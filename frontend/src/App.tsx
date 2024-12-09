import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { HomePage } from "./features/home";
import { LoginPage } from "./features/auth";
import "./App.css";

function App() {
    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        {/* Остальные маршруты будут добавлены позже */}
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
