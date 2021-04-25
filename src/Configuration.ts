import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfiguration {
    ScrapingTrackBotKey: string,
    WebScrapingServiceURL: string
}

export class Configuration {
    public static GetConfiguration() : EnvConfiguration {
        return {
            ScrapingTrackBotKey: process.env.ScrapingTrackBotKey ?? "",
            WebScrapingServiceURL: process.env.WebScrapingServiceURL ?? ""
        }
    }
}