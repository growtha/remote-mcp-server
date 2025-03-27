import {KeywordSearchVolume} from "./types";

export class DataProvider {
    static async getKeywordSearchVolume(keyword: string, city: string): Promise<KeywordSearchVolume> {
        const response = await fetch("https://growtha-platform-g159.onrender.com/api/v1/mcp/search-volume-of-keywords", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                keywords: [keyword],
                location_name: city
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data: Record<string, number> = await response.json();

        const volume = data[keyword];
        if (volume === undefined) {
            throw new Error("Keyword not found in response");
        }

        return {
            keyword,
            city,
            monthlySearchVolume: volume,
        };
    }
}