
export interface TelegramKeyboardOptions {
    text: string,
    action: () => void | (() => Promise<void>); 
}