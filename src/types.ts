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

export interface DomainKeywords {
    keywords: string[];
    confidence: number; // float
    industry: string;
}


export type GMBRating = 'good' | 'average' | 'poor';

