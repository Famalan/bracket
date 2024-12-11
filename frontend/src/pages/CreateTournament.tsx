import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTournamentForm } from "@/components/tournaments/CreateTournamentForm";

const CreateTournament = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Создать турнир</h1>
                    <p className="text-muted-foreground">
                        Заполните форму для создания нового турнира
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Информация о турнире</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CreateTournamentForm />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CreateTournament;
