export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
}

export enum UserRole {
    ADMIN = "ADMIN",
    ORGANIZER = "ORGANIZER",
    PLAYER = "PLAYER",
}

export interface Tournament {
    id: number;
    name: string;
    type: TournamentType;
    status: TournamentStatus;
    startDate: string;
    endDate: string | null;
    description: string;
    rules: string;
    maxTeams: number;
    registeredTeams: number;
    createdBy: number;
}

export interface TournamentCreate {
    name: string;
    type: TournamentType;
    startDate: string;
    description: string;
    rules: string;
    maxTeams: number;
}

export enum TournamentType {
    SINGLE_ELIMINATION = "SINGLE_ELIMINATION",
    DOUBLE_ELIMINATION = "DOUBLE_ELIMINATION",
    ROUND_ROBIN = "ROUND_ROBIN",
}

export enum TournamentStatus {
    DRAFT = "DRAFT",
    REGISTRATION = "REGISTRATION",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface Match {
    id: number;
    tournament_id: number;
    team1_id: number;
    team2_id: number;
    score_team1: number | null;
    score_team2: number | null;
    winner_id: number | null;
    status: "scheduled" | "in_progress" | "completed" | "cancelled";
    start_time: string;
    end_time: string | null;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}
