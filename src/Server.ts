import express from 'express'
import { ScrapingTrackBot } from './Bot/ScrapingTrackBot';
import { Configuration } from './Configuration';

const app = express();
const PORT = Number(process.env.PORT||8080);

const { ScrapingTrackBotKey, WebScrapingServiceURL } = Configuration.GetConfiguration();

const bot = new ScrapingTrackBot(ScrapingTrackBotKey);

app.get("/", (req, res) => {
    res.send(`Application Start, URL: ${WebScrapingServiceURL}`);
});

app.listen(PORT, "0.0.0.0", () => console.log(`Application Start, Port:${PORT}`));
bot.Start();
