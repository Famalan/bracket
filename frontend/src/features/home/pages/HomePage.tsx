import { Link } from "react-router-dom";

export function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                Добро пожаловать в мир киберспортивных турниров
            </h1>
            <p className="max-w-[600px] text-muted-foreground">
                Организуйте турниры, создавайте команды и участвуйте в
                соревнованиях. Наша платформа предоставляет все необходимые
                инструменты для проведения киберспортивных мероприятий любого
                масштаба.
            </p>
            <div className="flex gap-4">
                <Link
                    to="/tournaments"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    Просмотреть турниры
                </Link>
                <Link
                    to="/register"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    Создать аккаунт
                </Link>
            </div>
        </div>
    );
}
