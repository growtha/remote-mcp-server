export interface LocationKeywordRanking {
    location: string;
    dma: string;
    keywords: {
        keyword: string;
        position: number;
        searchVolume: number;
        competitionLevel: 'low' | 'medium' | 'high';
    }[];
} // ===== Type Definitions =====
export interface KeywordSearchVolume {
    keyword: string;
    city: string;
    monthlySearchVolume: number;
}

export interface DomainKeyword {
    keyword: string;
    position: number;
    searchVolume: number;
    cpc: number;
    competition: 'low' | 'medium' | 'high';
    difficulty: number;
}

export interface DomainLocation {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    dma: string;
    latitude: number;
    longitude: number;
    phone: string;
    website: string;
}

export type GMBRating = 'good' | 'average' | 'poor';

export interface DomainRanking {
    domain: string;
    overallRank: number;
    organicVisibility: number;
    organicKeywords: number;
    paidVisibility: number;
    paidKeywords: number;
    backlinks: number;
    gmbRating: GMBRating;
    localRankings: {
        dma: string;
        position: number;
        keywordCount: number;
    }[];
}