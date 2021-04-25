import TelegramBot from "node-telegram-bot-api";
import { TelegramCommand } from "../../Contracts/TelegramCommand";


export class VersionCommand extends TelegramCommand {
    constructor(
        private botName:string,
        private commandDescription: string
    ){
        super();
    }

    protected onReceived(bot: TelegramBot, msg: TelegramBot.Message, match: RegExpExecArray) {
        this.finishCommand = true;
        bot.sendMessage(msg.chat.id, `Welcome to ${this.botName}\n${this.commandDescription}`);
    }

    protected onReceivedText(bot: TelegramBot, message: TelegramBot.Message, metadata: TelegramBot.Metadata) { }
}