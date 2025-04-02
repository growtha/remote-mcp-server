// methods.ts
import {z} from "zod";
import {MockDataProvider} from "./mock";
import {DomainKeywords, LocationKeywordRanking} from "./types";
import {DataProvider} from "./api";

// Define a more specific ToolDefinition type that uses Zod for schema and type inference
export interface ToolDefinition<TParams> {
    name: string;
    description: string;
    schema: Record<string, z.ZodType<any>>;
    method: (params: TParams) => Promise<any>;
    formatResult: (params: TParams, result: any) => string;
}

const keywordsSearchVolumeSchema = {
    keywords: z.array(z.string()).describe("Keywords to get search volume for"),
    location_name: z.string().describe("Location name to check search volume in"),
};

const domainSchema = {
    domain: z.string().describe("Domain name to get keywords for"),
};

const locationRankingsSchema = {
    location: z.string().describe("Location name"),
    dma: z.string().describe("DMA (Designated Market Area)"),
};

// Define types based on Zod schemas
type KeywordsSearchVolumeParams = z.infer<z.ZodObject<typeof keywordsSearchVolumeSchema>>;
type DomainParams = z.infer<z.ZodObject<typeof domainSchema>>;
type LocationRankingsParams = z.infer<z.ZodObject<typeof locationRankingsSchema>>;

// Create a map type for our tools with correct schema and return types
// Create a map type for our tools
export type ToolMap = {
    getKeywordsSearchVolume: ToolDefinition<KeywordsSearchVolumeParams>;
    getDomainKeywords: ToolDefinition<DomainParams>;
    getDomainLocations: ToolDefinition<DomainParams>;
    getDomainAudit: ToolDefinition<DomainParams>;
    getLocationRankings: ToolDefinition<LocationRankingsParams>;
};

// ===== API Service Layer with Tool Definitions =====
export class LocAIService {
    private static API_KEY = '';
    private static BASE_URL = 'https://api.loc.ai/v1';

    // Define tool definitions with schemas, methods, and formatters
    static tools: ToolMap = {
        getKeywordsSearchVolume: {
            name: "get_keywords_search_volume",
            description: "Get search volume of given keywords in a given location_name",
            schema: keywordsSearchVolumeSchema,
            method: async (params: KeywordsSearchVolumeParams): Promise<Record<string, number>> => {
                return DataProvider.getKeywordsSearchVolume(params.keywords, params.location_name);
            },
            formatResult: (params: KeywordsSearchVolumeParams, result: Record<string, number>): string => {
                return `Search volume data for "${params.keywords}" in ${params.location_name}:\n${JSON.stringify(result, null, 2)}`;
            }
        },

        getDomainKeywords: {
            name: "get_domain_keywords",
            description: "Get keywords for a given domain",
            schema: domainSchema,
            method: async (params: DomainParams): Promise<DomainKeywords> => {
                return DataProvider.getDomainKeywords(params.domain);
            },
            formatResult: (params: DomainParams, result: DomainKeywords): string => {
                return `Keywords for "${params.domain}":\n${JSON.stringify(result, null, 2)}`;
            }
        },

        getDomainLocations: {
            name: "get_domain_locations",
            description: "Get all locations of a given domain",
            schema: domainSchema,
            method: async (params: DomainParams): Promise<string[]> => {
                return DataProvider.getDomainLocations(params.domain);
            },
            formatResult: (params: DomainParams, result: string[]): string => {
                return `Locations for "${params.domain}":\n${JSON.stringify(result, null, 2)}`;
            }
        },

        getDomainAudit: {
            name: "get_domain_audit",
            description: "Get audit of a given domain name",
            schema: domainSchema,
            method: async (params: DomainParams): Promise<string> => {
                return DataProvider.getDomainAudit(params.domain);
            },
            formatResult: (params: DomainParams, result: string): string => {
                return `Audit for "${params.domain}":\n${result}`;
            }
        },

        getLocationRankings: {
            name: "get_location_rankings",
            description: "Get rankings of a given location (all keywords for a given DMA)",
            schema: locationRankingsSchema,
            method: async (params: LocationRankingsParams): Promise<LocationKeywordRanking> => {
                return MockDataProvider.getLocationRankings(params.location, params.dma);
            },
            formatResult: (params: LocationRankingsParams, result: LocationKeywordRanking): string => {
                return `Rankings for location "${params.location}" in ${params.dma}:\n${JSON.stringify(result, null, 2)}`;
            }
        },
    };
}
