import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarIcon } from "lucide-react";

const Schedule = () => {
  // Моковые данные для расписания
  const matches = [
    {
      id: 1,
      tournament: "CS:GO Summer Championship",
      team1: "Team Alpha",
      team2: "Digital Dragons",
      date: "2024-03-15",
      time: "18:00",
      status: "Предстоит",
    },
    {
      id: 2,
      tournament: "Dota 2 Pro League",
      team1: "Team Beta",
      team2: "Cyber Knights",
      date: "2024-03-16",
      time: "19:30",
      status: "Предстоит",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Расписание</h1>
            <p className="text-muted-foreground">Расписание матчей и турниров</p>
          </div>
          <Button>
            <CalendarIcon className="mr-2 h-4 w-4" /> Календарь
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Предстоящие матчи</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Турнир</TableHead>
                  <TableHead>Команда 1</TableHead>
                  <TableHead>Команда 2</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Время</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell className="font-medium">{match.tournament}</TableCell>
                    <TableCell>{match.team1}</TableCell>
                    <TableCell>{match.team2}</TableCell>
                    <TableCell>{match.date}</TableCell>
                    <TableCell>{match.time}</TableCell>
                    <TableCell>{match.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Подробнее
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;