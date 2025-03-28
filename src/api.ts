import {DomainKeywords} from "./types";

export class DataProvider {

    static async getDomainKeywords(domain: string): Promise<DomainKeywords> {
        const response = await fetch("https://growtha-platform-g159.onrender.com/api/v1/mcp/get-domain-industry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({ domain })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data: DomainKeywords = await response.json();
        return data;
    }

    static async getKeywordsSearchVolume(keywords: string[], location_name: string): Promise<Record<string, number>> {
        const response = await fetch("https://growtha-platform-g159.onrender.com/api/v1/mcp/search-volume-of-keywords", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                keywords: keywords,
                location_name: location_name
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return await response.json()
    }
}