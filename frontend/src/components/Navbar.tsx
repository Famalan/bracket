import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-primary">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="text-primary-foreground text-lg font-bold"
                        >
                            Киберспортивные турниры
                        </Link>
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                to="/tournaments"
                                className="text-primary-foreground hover:text-primary-foreground/80 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Турниры
                            </Link>
                            <Link
                                to="/teams"
                                className="text-primary-foreground hover:text-primary-foreground/80 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Команды
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/login"
                            className="text-primary-foreground hover:text-primary-foreground/80 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Войти
                        </Link>
                        <Link
                            to="/register"
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Регистрация
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
