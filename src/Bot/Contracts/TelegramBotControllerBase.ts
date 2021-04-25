import TelegramBot from 'node-telegram-bot-api';
import Telegram from 'node-telegram-bot-api';
import { TelegramCommand } from './TelegramCommand';
import { TelegramCommandBuilder } from './TelegramCommandBuilder';


export abstract class TelegramBotControllerBase {
    protected readonly bot: Telegram;
    private readonly name: string;
    private readonly commands: TelegramCommandBuilder[];
    private readonly currentCommands: Record<string, TelegramCommand> = {};

    constructor(botToken: string, botName: string) {
        this.bot = new Telegram(botToken);
        this.commands = [];
        this.name = botName;
        this.configureCommands();
        this.configure();
    }

    abstract configureCommands();

    
    private getCommands()
    {
        return this.commands.filter(it => !(it.hidden ?? false)).sort();
    }
    protected getBotName = () => this.name;

    protected getCommandsDescription() : string {
        const message : string[] = this.getCommands()
            .map(c => `/${c.command} - ${c.description}`);

        return ["Commands:", ...message].join("\n");
    }

    private getDefaultMessageOptions(): TelegramBot.SendMessageOptions {
        return {
            reply_markup: {
                remove_keyboard: true
            }
        }
    }

    private configureReservedCommands() {
    }

    private configure() {
        this.bot.setMyCommands(
            this.getCommands()
                .map(it => {
                return {
                    command: it.command,
                    description: it.description
                } as TelegramBot.BotCommand
            })
        );

        this.bot.onText(new RegExp("\/.*"), (msg, match) => this.receivedCommand(msg, match));
        this.bot.on("message", (msg, meta) => this.receivedText(msg, meta));
        this.configureReservedCommands();
    }

    private receivedCommand(msg: TelegramBot.Message, match: RegExpExecArray) {
        const textArgs = msg.text.replace("\/", "");
        const textCommand = textArgs.length > 0 ? textArgs.split(" ")[0] : "";
        const chatId = msg.chat.id;
        const selectedCommand = this.commands.find(it => it.command === textCommand);
        const currentCommand = selectedCommand.buildCommand();

        if(currentCommand)
            currentCommand.Received(this.bot, msg, match);
        else
            this.bot.sendMessage(
                chatId, 
                `This "/${textCommand}" command is not recognized, please try a valid command\n${this.getCommandsDescription()}`, 
                this.getDefaultMessageOptions()
            );

        if (currentCommand.IsFinish())
            delete this.currentCommands[chatId];
        else
            this.currentCommands[chatId] = currentCommand;
    }

    private receivedText(msg: TelegramBot.Message, meta: TelegramBot.Metadata) {        
        const chatId = msg.chat.id;
        const text = msg.text;

        if(text.startsWith("/"))
            return;

        const currentCommand = this.currentCommands[chatId];

        if (currentCommand)
            currentCommand.ReceivedText(this.bot, msg, meta);
        else
            this.bot.sendMessage(
                chatId, 
                `You do not have an active command, please try using a valid command\n${this.getCommandsDescription()}`,
                this.getDefaultMessageOptions()
            );

        if (currentCommand.IsFinish())
        {
            this.bot.sendMessage(chatId, `The command has ended`, this.getDefaultMessageOptions());
            delete this.currentCommands[chatId];
        }
    }

    protected addCommand(command: TelegramCommandBuilder) {
        this.commands.push(command);
    }

    public Start() {
        this.bot.startPolling();
    } 

    public Stop() {
        this.bot.stopPolling();
    }
}