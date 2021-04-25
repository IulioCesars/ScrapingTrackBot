import axios from 'axios';
import { Configuration } from '../Configuration';


export class WebScrappingService {

    public async getChainCollections(collectionName: string) : Promise<string[]> {
        const config = Configuration.GetConfiguration();
        const request = await axios.get(`${config.WebScrapingServiceURL}/chain_collections/${collectionName}`)

        if (request.status != 200)
            return []
        else
            return request.data.actionChains as string[];
    }


    public async exec(baseURL: string, template: string): Promise<any> {
        const config = Configuration.GetConfiguration();
        const request = await axios.post(`${config.WebScrapingServiceURL}/exec`, {
            base_url: baseURL,
            template: template
        })

        return request.data;
    }
}