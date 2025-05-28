// methods.ts
import {z} from "zod";
import {MockDataProvider} from "./mock";
import type {DomainKeywords, LocationKeywordRanking} from "./types";
import {DataProvider} from "./api";

// Define a more specific ToolDefinition type that uses Zod for schema and type inference
export interface ToolDefinition<TParams> {
    name: string;
    description: string;
    schema: Record<string, z.ZodType<any>>;
    method: (params: TParams) => Promise<any>;
    formatResult: (params: TParams, result: any) => string;
}

const keywordsSearchVolumeSchema = z.object({
    keywords: z.array(z.string()).describe("Keywords to get search volume for"),
    location_name: z.string().describe("Location name to check search volume in"),
});

const domainSchema = z.object({
    domain: z.string().describe("Domain name to get keywords for"),
});

const auditSchema = z.object({
    domain: z.string().describe("Domain name to get audit for"),
    keywords: z.array(z.string()).min(1).describe("Keywords to get audit for"),
    locations: z.array(z.string()).min(1).describe("Locations to get audit for"),
});

const locationRankingsSchema = z.object({
    location: z.string().describe("Location name"),
    dma: z.string().describe("DMA (Designated Market Area)"),
});

// Define types based on Zod schemas
type KeywordsSearchVolumeParams = z.infer<typeof keywordsSearchVolumeSchema>;
type DomainParams = z.infer<typeof domainSchema>;
type LocationRankingsParams = z.infer<typeof locationRankingsSchema>;
type AuditParams = z.infer<typeof auditSchema>;

// Create a map type for our tools with correct schema and return types
// Create a map type for our tools
export interface ToolMap {
    getKeywordsSearchVolume: ToolDefinition<KeywordsSearchVolumeParams>;
    getDomainKeywords: ToolDefinition<DomainParams>;
    getDomainLocations: ToolDefinition<DomainParams>;
    createDomainAudit: ToolDefinition<AuditParams>;
    getDomainAudit: ToolDefinition<AuditParams>;
    getLocationRankings: ToolDefinition<LocationRankingsParams>;
};

// ===== API Service Layer with Tool Definitions =====
export class LocAIService {
    private dataProvider: DataProvider;

    constructor(private apiKey: string) {
        this.dataProvider = new DataProvider(this.apiKey);
    }

    // Define tool definitions with schemas, methods, and formatters
    tools: ToolMap = {
        getKeywordsSearchVolume: {
            name: "get_keywords_search_volume",
            description: "Get search volume of given keywords in a given location_name",
            schema: keywordsSearchVolumeSchema.shape,
            method: async (params: KeywordsSearchVolumeParams): Promise<Record<string, number>> => {
                console.log("getKeywordsSearchVolume", params);
                return this.dataProvider.getKeywordsSearchVolume(params.keywords, params.location_name);
            },
            formatResult: (params: KeywordsSearchVolumeParams, result: Record<string, number>): string => {
                return `Search volume data for "${params.keywords}" in ${params.location_name}:\n${JSON.stringify(result, null, 2)}`;
            }
        },

        getDomainKeywords: {
            name: "get_domain_keywords",
            description: "Get keywords for a given domain",
            schema: domainSchema.shape,
            method: async (params: DomainParams): Promise<DomainKeywords> => {
                return this.dataProvider.getDomainKeywords(params.domain);
            },
            formatResult: (params: DomainParams, result: DomainKeywords): string => {
                return `Keywords for "${params.domain}":\n${JSON.stringify(result, null, 2)}`;
            }
        },

        getDomainLocations: {
            name: "get_domain_locations",
            description: "Get all locations of a given domain",
            schema: domainSchema.shape,
            method: async (params: DomainParams): Promise<string[]> => {
                return this.dataProvider.getDomainLocations(params.domain);
            },
            formatResult: (params: DomainParams, result: string[]): string => {
                return `Locations for "${params.domain}":\n${JSON.stringify(result, null, 2)}`;
            }
        },

        createDomainAudit: {
            name: "create_domain_audit",
            description: "Create an audit for a given domain name, keywords, and locations",
            schema: auditSchema.shape,
            method: async (params: z.infer<typeof auditSchema>) => {
                return this.dataProvider.createDomainAudit(params.domain, params.keywords, params.locations);
            },
            formatResult: (params: z.infer<typeof auditSchema>, result: string): string => {
                return `Audit for "${params.domain}":\n${JSON.stringify(result, null, 2)} will be available in a few moments. Check the URL in a few minutes.`;
            }
        },

        getDomainAudit: {
            name: "get_domain_audit",
            description: "Get audit of a given domain name",
            schema: auditSchema.shape,
            method: async (params: AuditParams) => {
                return this.dataProvider.getDomainAudit(params.domain, params.keywords, params.locations);
            },
            formatResult: (params: AuditParams, result: string): string => {
                return `Audit for "${params.domain}" is available here:\n${JSON.stringify(result, null, 2)}`;
            }
        },

        getLocationRankings: {
            name: "get_location_rankings",
            description: "Get rankings of a given location (all keywords for a given DMA)",
            schema: locationRankingsSchema.shape,
            method: async (params: LocationRankingsParams): Promise<LocationKeywordRanking> => {
                return MockDataProvider.getLocationRankings(params.location, params.dma);
            },
            formatResult: (params: LocationRankingsParams, result: LocationKeywordRanking): string => {
                return `Rankings for location "${params.location}" in ${params.dma}:\n${JSON.stringify(result, null, 2)}`;
            }
        },
    };
}
