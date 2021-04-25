import { TelegramCommand } from "./TelegramCommand";

export interface TelegramCommandBuilder {
    command: string;
    description: string;
    hidden?: boolean;

    buildCommand: () => TelegramCommand;
}