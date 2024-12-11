import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    tournamentSchema,
    type TournamentFormData,
} from "@/schemas/tournament";

export function CreateTournamentForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<TournamentFormData>({
        resolver: zodResolver(tournamentSchema),
        defaultValues: {
            name: "",
            description: "",
            type: "single_elimination",
            rules: "",
            max_teams: 8,
            registration_deadline: "",
            start_date: "",
            end_date: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: TournamentFormData) => {
            const response = await apiClient.post("/tournaments/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tournaments"] });
            toast({
                title: "Турнир создан",
                description: "Турнир успешно создан",
            });
            navigate("/tournaments");
        },
        onError: (error) => {
            toast({
                title: "Ошибка",
                description: "Не удалось создать турнир",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: TournamentFormData) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название турнира</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Описание</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Тип турнира</FormLabel>
                            <FormControl>
                                <select {...field} className="form-select">
                                    <option value="single_elimination">
                                        Single Elimination
                                    </option>
                                    <option value="double_elimination">
                                        Double Elimination
                                    </option>
                                    <option value="round_robin">
                                        Round Robin
                                    </option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="max_teams"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Максимальное количество команд
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(parseInt(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="registration_deadline"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Дедлайн регистрации</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Дата начала</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Дата окончания</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Создание..." : "Создать турнир"}
                </Button>
            </form>
        </Form>
    );
}
