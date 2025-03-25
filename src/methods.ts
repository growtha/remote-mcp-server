// methods.ts
import {z} from "zod";
import {MockDataProvider} from "./mock";
import {DomainKeyword, DomainLocation, DomainRanking, KeywordSearchVolume, LocationKeywordRanking} from "./types";
// methods.ts


// Define a more specific ToolDefinition type that uses Zod for schema and type inference
export interface ToolDefinition<TParams> {
  name: string;
  description: string;
  schema: Record<string, z.ZodType<any>>;
  method: (params: TParams) => Promise<any>;
  formatResult: (params: TParams, result: any) => string;
}


// Define schema objects first, with proper primitive return types
const keywordSearchVolumeSchema = {
  keyword: z.string().describe("Keyword to get search volume for"),
  city: z.string().describe("City name to check search volume in"),
};

const domainSchema = {
  domain: z.string().describe("Domain name to get keywords for"),
};

const locationRankingsSchema = {
  location: z.string().describe("Location name"),
  dma: z.string().describe("DMA (Designated Market Area)"),
};

// Define types based on Zod schemas
type KeywordSearchVolumeParams = z.infer<z.ZodObject<typeof keywordSearchVolumeSchema>>;
type DomainParams = z.infer<z.ZodObject<typeof domainSchema>>;
type LocationRankingsParams = z.infer<z.ZodObject<typeof locationRankingsSchema>>;

// Create a map type for our tools with correct schema and return types
// Create a map type for our tools
export type ToolMap = {
  getKeywordSearchVolume: ToolDefinition<KeywordSearchVolumeParams>;
  getDomainKeywords: ToolDefinition<DomainParams>;
  getDomainLocations: ToolDefinition<DomainParams>;
  getDomainRankings: ToolDefinition<DomainParams>;
  getLocationRankings: ToolDefinition<LocationRankingsParams>;
};

// ===== API Service Layer with Tool Definitions =====
export class LocAIService {
  private static API_KEY = '';
  private static BASE_URL = 'https://api.loc.ai/v1';

  // Define tool definitions with schemas, methods, and formatters
  static tools: ToolMap = {
    getKeywordSearchVolume: {
      name: "get_keyword_search_volume",
      description: "Get search volume of a given keyword in a given city's DMA",
      schema: keywordSearchVolumeSchema,
      method: async (params: KeywordSearchVolumeParams): Promise<KeywordSearchVolume> => {
        return MockDataProvider.getKeywordSearchVolume(params.keyword, params.city);
      },
      formatResult: (params: KeywordSearchVolumeParams, result: KeywordSearchVolume): string => {
        return `Search volume data for "${params.keyword}" in ${params.city}:\n${JSON.stringify(result, null, 2)}`;
      }
    },

    getDomainKeywords: {
      name: "get_domain_keywords",
      description: "Get keywords for a given domain",
      schema: domainSchema,
      method: async (params: DomainParams): Promise<DomainKeyword[]> => {
        return MockDataProvider.getDomainKeywords(params.domain);
      },
      formatResult: (params: DomainParams, result: DomainKeyword[]): string => {
        return `Keywords for "${params.domain}":\n${JSON.stringify(result, null, 2)}`;
      }
    },

    getDomainLocations: {
      name: "get_domain_locations",
      description: "Get all locations of a given domain",
      schema: domainSchema,
      method: async (params: DomainParams): Promise<DomainLocation[]> => {
        return MockDataProvider.getDomainLocations(params.domain);
      },
      formatResult: (params: DomainParams, result: DomainLocation[]): string => {
        return `Locations for "${params.domain}":\n${JSON.stringify(result, null, 2)}`;
      }
    },

    getDomainRankings: {
      name: "get_domain_rankings",
      description: "Get rankings of a given domain name including GMB ratings",
      schema: domainSchema,
      method: async (params: DomainParams): Promise<DomainRanking> => {
        return MockDataProvider.getDomainRankings(params.domain);
      },
      formatResult: (params: DomainParams, result: DomainRanking): string => {
        return `Rankings for "${params.domain}":\n${JSON.stringify(result, null, 2)}`;
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
