import { Tournament } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TournamentCardProps {
    tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        {tournament.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {tournament.description}
                    </p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Тип:</span>
                        <span className="text-sm font-medium">
                            {tournament.type}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Статус:</span>
                        <span className="text-sm font-medium">
                            {tournament.status}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Команды:</span>
                        <span className="text-sm font-medium">
                            {tournament.registered_teams} /{" "}
                            {tournament.max_teams}
                        </span>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button asChild>
                        <Link to={`/tournaments/${tournament.id}`}>
                            Подробнее
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
