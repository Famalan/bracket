import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { TournamentBracket } from "@/components/tournaments/TournamentBracket";

export default function TournamentDetails() {
    const { id } = useParams<{ id: string }>();

    const { data: tournament, isLoading } = useQuery({
        queryKey: ["tournament", id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/tournaments/${id}`);
            return data;
        },
    });

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{tournament.name}</h1>
                <p className="text-muted-foreground mt-2">
                    {tournament.description}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Информация</h2>
                    <dl className="space-y-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                Тип турнира
                            </dt>
                            <dd>{tournament.type}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                Статус
                            </dt>
                            <dd>{tournament.status}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                Команд зарегистрировано
                            </dt>
                            <dd>
                                {tournament.registered_teams} /{" "}
                                {tournament.max_teams}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Даты</h2>
                    <dl className="space-y-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                Дедлайн регистрации
                            </dt>
                            <dd>
                                {new Date(
                                    tournament.registration_deadline
                                ).toLocaleDateString()}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                Начало
                            </dt>
                            <dd>
                                {new Date(
                                    tournament.start_date
                                ).toLocaleDateString()}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                Окончание
                            </dt>
                            <dd>
                                {new Date(
                                    tournament.end_date
                                ).toLocaleDateString()}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {tournament.status === "in_progress" && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Турнирная сетка
                    </h2>
                    <TournamentBracket tournamentId={tournament.id} />
                </div>
            )}
        </div>
    );
}