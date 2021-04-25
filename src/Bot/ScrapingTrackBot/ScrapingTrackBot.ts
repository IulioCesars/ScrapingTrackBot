import { TelegramBotControllerBase } from "../Contracts/TelegramBotControllerBase"
import { CancelCommand } from "./Commands/CancelCommand";
import { ExecCommand } from "./Commands/ExecCommad";
import { VersionCommand } from "./Commands/VersionCommand";

export class ScrapingTrackBot extends TelegramBotControllerBase {
    
    constructor(botKey: string) {
        super(botKey, "ScrapingTrackBot v0.3");
    }

    configureCommands() {
        this.addCommand({
            command: 'exec',
            description: 'Execute specific webscraping template',
            buildCommand: () => new ExecCommand()
        });

        this.addCommand({
            command: 'cancel',
            description: 'Cancel current command',
            buildCommand: () => new CancelCommand()
        })

        const sendVersion = () => new VersionCommand(this.getBotName(), this.getCommandsDescription());

        this.addCommand({
            command: 'start',
            description: null,
            hidden: true,
            buildCommand: () => sendVersion()
        });

        this.addCommand({
            command: 'version',
            description: 'Show bot version information',
            buildCommand: () => sendVersion()
        });
    }
}