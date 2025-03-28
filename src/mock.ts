// ===== Mock Data Provider =====
import {
    DomainKeywords,
    DomainLocation,
    DomainRanking,
    GMBRating,
    KeywordSearchVolume,
    LocationKeywordRanking
} from "./types";

export class MockDataProvider {
    // static getKeywordSearchVolume(keyword: string, city: string): KeywordSearchVolume {
    //     return {
    //         keyword,
    //         city,
    //         monthlySearchVolume: Math.floor(Math.random() * 10000),
    //     };
    // }

    // static getDomainKeywords(domain: string): DomainKeywords[] {
    //     const keywords = [
    //         'seo services', 'local seo', 'digital marketing', 'web design', 'ppc advertising',
    //         'content marketing', 'social media marketing', 'email marketing', 'reputation management',
    //         'conversion optimization'
    //     ];
    //
    //     return keywords.map(keyword => ({
    //         keyword,
    //         position: Math.floor(Math.random() * 100) + 1,
    //         searchVolume: Math.floor(Math.random() * 10000),
    //         cpc: parseFloat((Math.random() * 5).toFixed(2)),
    //         competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    //         difficulty: Math.floor(Math.random() * 100)
    //     }));
    // }

    static getDomainLocations(domain: string): DomainLocation[] {
        const cities = [
            {city: 'New York', state: 'NY', dma: 'New York DMA'},
            {city: 'Los Angeles', state: 'CA', dma: 'Los Angeles DMA'},
            {city: 'Chicago', state: 'IL', dma: 'Chicago DMA'},
            {city: 'Houston', state: 'TX', dma: 'Houston DMA'},
            {city: 'Phoenix', state: 'AZ', dma: 'Phoenix DMA'}
        ];

        return cities.map((city, index) => ({
            id: `loc-${index + 1}`,
            name: `${domain} - ${city.city}`,
            address: `${1000 + index} Main St`,
            city: city.city,
            state: city.state,
            zipCode: `${10000 + index}`,
            dma: city.dma,
            latitude: parseFloat((Math.random() * 10 + 30).toFixed(6)),
            longitude: parseFloat((Math.random() * 50 - 120).toFixed(6)),
            phone: `(${800 + index}) 555-${1000 + index}`,
            website: `https://${domain}/locations/${city.city.toLowerCase().replace(' ', '-')}`
        }));
    }

    static getDomainRankings(domain: string): DomainRanking {
        const dmas = ['New York DMA', 'Los Angeles DMA', 'Chicago DMA', 'Houston DMA', 'Phoenix DMA'];

        return {
            domain,
            overallRank: Math.floor(Math.random() * 1000) + 1,
            organicVisibility: Math.floor(Math.random() * 100),
            organicKeywords: Math.floor(Math.random() * 10000),
            paidVisibility: Math.floor(Math.random() * 100),
            paidKeywords: Math.floor(Math.random() * 5000),
            backlinks: Math.floor(Math.random() * 100000),
            gmbRating: ['good', 'average', 'poor'][Math.floor(Math.random() * 3)] as GMBRating,
            localRankings: dmas.map(dma => ({
                dma,
                position: Math.floor(Math.random() * 50) + 1,
                keywordCount: Math.floor(Math.random() * 1000)
            }))
        };
    }

    static getLocationRankings(location: string, dma: string): LocationKeywordRanking {
        const keywords = [
            'local business', 'near me', 'best in city', 'top rated', 'affordable',
            'professional', 'experienced', 'trusted', 'same day service', 'emergency service'
        ];

        return {
            location,
            dma,
            keywords: keywords.map(keyword => ({
                keyword,
                position: Math.floor(Math.random() * 100) + 1,
                searchVolume: Math.floor(Math.random() * 5000),
                competitionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
            }))
        };
    }
}