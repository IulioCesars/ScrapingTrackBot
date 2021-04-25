import TelegramBot from "node-telegram-bot-api";
import { TelegramKeyboardOptions } from "./TelegramKeyboardOptions";

export abstract class TelegramCommand {
    private options: TelegramKeyboardOptions[];
    private readonly defaultOptions: TelegramKeyboardOptions[];
    protected finishCommand: boolean = false;

    constructor() {
        this.options = [];
        this.defaultOptions = [
            {
                text: "Exit",
                action: () => { this.finishCommand = true }
            }
        ]
    }

    protected setOptions(options: TelegramKeyboardOptions[]) {
        this.options = options;
    }

    protected getOptions = () => [ ...this.options, ...this.defaultOptions ];
    protected getKeyboardButtons() : TelegramBot.KeyboardButton[][] {
        return this.getOptions()
            .map(it => { return {text: it.text} })
            .map(it => [ it ]);
    }

    public IsFinish = () => this.finishCommand; 

    public Received(bot: TelegramBot, msg: TelegramBot.Message, match: RegExpExecArray)
    {
        this.onReceived(bot, msg, match);
    }

    public ReceivedText(bot: TelegramBot, message: TelegramBot.Message, metadata: TelegramBot.Metadata) {
        const { text } = message;
        const selectedOption = this.getOptions().find(it => it.text === text);

        if(selectedOption)
            selectedOption.action();
        else
            this.onReceivedText(bot, message, metadata);
    }
    

    protected abstract onReceived(bot: TelegramBot, msg: TelegramBot.Message, match: RegExpExecArray);
    protected abstract onReceivedText(bot: TelegramBot, message: TelegramBot.Message, metadata: TelegramBot.Metadata);
}