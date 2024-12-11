import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { apiClient } from "@/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
    username: z.string().min(1, "Введите имя пользователя"),
    password: z.string().min(1, "Введите пароль"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: LoginForm) => {
            const formData = new URLSearchParams();
            formData.append("username", data.username);
            formData.append("password", data.password);

            const response = await apiClient.post("/auth/login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            login(data.access_token);
            toast({
                title: "Успешный вход",
                description: "Добро пожаловать!",
            });
            navigate("/");
        },
        onError: (error) => {
            console.error("Login error:", error);
            toast({
                title: "Ошибка",
                description: "Неверное имя пользователя или пароль",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: LoginForm) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Имя пользователя</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Вход..." : "Войти"}
                </Button>
            </form>
        </Form>
    );
}
