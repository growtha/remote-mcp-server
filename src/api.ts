import { createGrowthaClient, type GrowthaClient } from "./lib/growtha";
import type { DomainKeywords } from "./types";

export class DataProvider {
	private client: GrowthaClient;

	constructor(apiKey: string) {
		this.client = createGrowthaClient(apiKey);
	}

	async getDomainLocations(domain: string) {
		const { data, error } = await this.client.POST("/api/v1/mcp/find-locations", {
			body: { domain },
		});

		if (error) {
			console.error(error);

			throw new Error(`API error: ${error.detail}`);
		}

		return data;
	}

	async createDomainAudit(domain: string, keywords: string[], locations: string[] = []) {
		const { data, error } = await this.client.POST("/api/v1/mcp/audit", {
			body: { domain, keywords, locations, in_worker: true },
		});

		if (error) {
			console.error(error);

			throw new Error(`API error: ${error.detail}`);
		}

		return data;
	}

	async getDomainAudit(domain: string, keywords: string[], locations: string[] = []) {
		const { data, error } = await this.client.POST("/api/v1/mcp/audit", {
			body: { domain, keywords, locations, in_worker: true },
		});

		if (error) {
			console.error(error);
			throw new Error(`API error: ${error.detail}`);
		}

		return data;
	}

	async getDomainKeywords(domain: string) {
		const { data, error } = await this.client.POST("/api/v1/mcp/get-domain-industry", {
			body: { domain },
		});

		if (error) {
			console.error(error);

			throw new Error(`API error: ${error.detail}`);
		}

		return data as unknown as DomainKeywords;
	}

	async getKeywordsSearchVolume(
		keywords: string[],
		location_name: string,
	): Promise<Record<string, number>> {
		const { data, error } = await this.client.POST("/api/v1/mcp/search-volume-of-keywords", {
			body: { keywords, location_name },
		});

		if (error) {
			console.error(error);

			throw new Error(`API error: ${error.detail}`);
		}

		return data;
	}
}
