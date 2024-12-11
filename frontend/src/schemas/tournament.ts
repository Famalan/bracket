import { z } from "zod";

export const tournamentSchema = z.object({
    name: z
        .string()
        .min(3, "Минимум 3 символа")
        .max(100, "Максимум 100 символов"),
    description: z.string().optional(),
    type: z.enum(["single_elimination", "double_elimination", "round_robin"]),
    rules: z.string().optional(),
    max_teams: z.number().min(2).max(64),
    registration_deadline: z.string().datetime(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
});

export type TournamentFormData = z.infer<typeof tournamentSchema>;
