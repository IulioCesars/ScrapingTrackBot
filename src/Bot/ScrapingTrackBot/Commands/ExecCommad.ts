import TelegramBot from "node-telegram-bot-api";
import { WebScrappingService } from "../../../Services";
import { TelegramCommand } from "../../Contracts/TelegramCommand";

export class ExecCommand extends TelegramCommand {
    public command: string = "exec";
    public description: string = "Execute specific webscraping template";
    public hidden?: boolean = false;
    private service : WebScrappingService;

    private selectedTemplate: string = null;

    constructor() {
        super();
        this.service = new WebScrappingService();
    }

    public onSelectActionChain(bot: TelegramBot, msg: TelegramBot.Message, templateName: string) {
        this.selectedTemplate = templateName;

        const defaultOptions = { reply_markup: { remove_keyboard: true } };
        bot.sendMessage(msg.chat.id, "Insert the target URL", defaultOptions)
    }

    public onReceived(bot: TelegramBot, msg: TelegramBot.Message, match: RegExpExecArray) {
        const chatId = msg.chat.id;

        const defaultOptions = { reply_markup: { remove_keyboard: true } };
        bot.sendMessage(chatId, "Processing...", defaultOptions);

        this.service.getChainCollections("Telegram")
            .then(it => {
                this.setOptions(it.map(x=> {
                    return { text: x, action: () => this.onSelectActionChain(bot, msg, x) }
                }));

                bot.sendMessage(msg.chat.id, 
                    "What ActionChain do you want to execute?", 
                    { reply_markup: { keyboard: this.getKeyboardButtons() } }
                );
            })
            .catch(it => {
                bot.sendMessage(chatId, "An error occurred");
            });
    }

    public onReceivedText(bot: TelegramBot, message: TelegramBot.Message, metadata: TelegramBot.Metadata) {
        if (!this.selectedTemplate)
            return

        const url = message.text;
        this.service.exec(url, this.selectedTemplate)
            .then(async it => {
                await bot.sendMessage(message.chat.id, `Finished Task`);
                const result = (it.url_resolved as any[] ?? []).map(it =>  typeof it === "string" ? it : JSON.stringify(it));

                for(const i of result)
                    await bot.sendMessage(message.chat.id, i);
            });
        
        bot.sendMessage(message.chat.id, "Processing...");
    }
}