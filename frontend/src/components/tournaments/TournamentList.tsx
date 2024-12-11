import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Tournament } from "@/types";
import { TournamentCard } from "./TournamentCard";

export function TournamentList() {
    const { data: tournaments = [], isLoading } = useQuery({
        queryKey: ["tournaments"],
        queryFn: async () => {
            const { data } = await apiClient.get("/tournaments/");
            return data;
        },
    });

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament: Tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
        </div>
    );
}
