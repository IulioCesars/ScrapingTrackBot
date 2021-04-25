import TelegramBot from "node-telegram-bot-api";
import { TelegramCommand } from "../../Contracts/TelegramCommand";


export class CancelCommand extends TelegramCommand {
    protected onReceived(bot: TelegramBot, msg: TelegramBot.Message, match: RegExpExecArray) {
        this.finishCommand = true;
        bot.sendMessage(msg.chat.id, "The current command has be cancelled")
    }

    protected onReceivedText(bot: TelegramBot, message: TelegramBot.Message, metadata: TelegramBot.Metadata) {
        
    }
}