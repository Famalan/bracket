import { DashboardLayout } from "@/components/DashboardLayout";
import { TournamentList } from "@/components/tournaments/TournamentList";

const Tournaments = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Турниры</h1>
                <TournamentList />
            </div>
        </DashboardLayout>
    );
};

export default Tournaments; 