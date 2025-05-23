import {DomainKeywords} from "./types";

export class DataProvider {

    constructor(private apiKey: string) { }   

    async getDomainLocations(domain: string): Promise<string[]> {
        const response = await fetch("https://growtha-platform-g159.onrender.com/api/v1/mcp/find-locations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "locai-user-api-key": `${this.apiKey}`
            },
            body: JSON.stringify({ domain })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return await response.json();
    }

    async getDomainAudit(domain: string): Promise<string> {
        const response = await fetch("https://growtha-platform-g159.onrender.com/api/v1/mcp/audit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "locai-user-api-key": `${this.apiKey}`
            },
            body: JSON.stringify({ domain, in_worker: true })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    }

    async getDomainKeywords(domain: string): Promise<DomainKeywords> {
        const response = await fetch("https://growtha-platform-g159.onrender.com/api/v1/mcp/get-domain-industry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "locai-user-api-key": `${this.apiKey}`
            },
            body: JSON.stringify({ domain })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data: DomainKeywords = await response.json();
        return data;
    }

    async getKeywordsSearchVolume(keywords: string[], location_name: string): Promise<Record<string, number>> {
        const response = await fetch("https://growtha-platform-g159.onrender.com/api/v1/mcp/search-volume-of-keywords", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "locai-user-api-key": `${this.apiKey}`
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