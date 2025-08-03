import type { GameSearchResult, GameSearchParams } from '@collectr/types';
import { IGDBService } from './igdb';
import { RAWGService } from './rawg';

export class GameSearchService {
  private igdb: IGDBService;
  private rawg: RAWGService;

  constructor(
    igdbClientId: string,
    igdbClientSecret: string,
    rawgApiKey?: string
  ) {
    this.igdb = new IGDBService(igdbClientId, igdbClientSecret);
    this.rawg = new RAWGService(rawgApiKey);
  }

  async searchGames(params: GameSearchParams): Promise<GameSearchResult[]> {
    const { q, platform, limit = 20, offset = 0 } = params;
    const results: GameSearchResult[] = [];

    try {
      // Primary search: IGDB
      const igdbResults = await this.igdb.searchGames(q, platform, limit, offset);
      
      for (const igdbGame of igdbResults) {
        const result: GameSearchResult = {
          id: `igdb_${igdbGame.id}`,
          title: igdbGame.name,
          platform: this.mapIGDBPlatform(igdbGame.platforms?.[0]?.abbreviation || ''),
          publisher: IGDBService.extractPublisher(igdbGame.involved_companies),
          year: IGDBService.extractYear(igdbGame.first_release_date),
          coverUrl: igdbGame.cover?.url ? IGDBService.getHighResCoverUrl(igdbGame.cover.url) : undefined,
          synopsis: igdbGame.summary,
          igdbId: igdbGame.id,
          createdBy: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          pendingReview: false,
          relevanceScore: this.calculateRelevance(q, igdbGame.name),
        };

        results.push(result);
      }

      // If IGDB didn't return enough results, try RAWG as fallback
      if (results.length < limit) {
        const remainingLimit = limit - results.length;
        const rawgResults = await this.rawg.searchGames(q, platform, remainingLimit, offset);

        for (const rawgGame of rawgResults) {
          // Avoid duplicates by checking if we already have this game
          const isDuplicate = results.some(result => 
            result.title.toLowerCase() === rawgGame.name.toLowerCase()
          );

          if (!isDuplicate) {
            const result: GameSearchResult = {
              id: `rawg_${rawgGame.id}`,
              title: rawgGame.name,
              platform: RAWGService.mapPlatform(rawgGame.platforms),
              publisher: RAWGService.extractPublisher(rawgGame.publishers),
              year: RAWGService.extractYear(rawgGame.released),
              coverUrl: rawgGame.background_image,
              synopsis: rawgGame.description_raw,
              createdBy: 'system',
              createdAt: new Date(),
              updatedAt: new Date(),
              pendingReview: false,
              relevanceScore: this.calculateRelevance(q, rawgGame.name),
            };

            results.push(result);
          }
        }
      }

      // Sort by relevance score (highest first)
      results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      return results.slice(0, limit);
    } catch (error) {
      console.error('Game search failed:', error);
      return [];
    }
  }

  async searchByBarcode(upc: string): Promise<GameSearchResult[]> {
    try {
      // Try IGDB UPC search first
      const igdbResults = await this.igdb.searchByUPC(upc);
      
      const results: GameSearchResult[] = igdbResults.map(igdbGame => ({
        id: `igdb_${igdbGame.id}`,
        title: igdbGame.name,
        platform: this.mapIGDBPlatform(igdbGame.platforms?.[0]?.abbreviation || ''),
        publisher: IGDBService.extractPublisher(igdbGame.involved_companies),
        year: IGDBService.extractYear(igdbGame.first_release_date),
        coverUrl: igdbGame.cover?.url ? IGDBService.getHighResCoverUrl(igdbGame.cover.url) : undefined,
        synopsis: igdbGame.summary,
        igdbId: igdbGame.id,
        upc,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        pendingReview: false,
        relevanceScore: 1.0, // Perfect match for UPC
      }));

      return results;
    } catch (error) {
      console.error('Barcode search failed:', error);
      return [];
    }
  }

  private calculateRelevance(query: string, title: string): number {
    const queryLower = query.toLowerCase();
    const titleLower = title.toLowerCase();

    // Exact match
    if (queryLower === titleLower) return 1.0;

    // Title starts with query
    if (titleLower.startsWith(queryLower)) return 0.9;

    // Title contains query as whole word
    const queryRegex = new RegExp(`\\b${queryLower}\\b`, 'i');
    if (queryRegex.test(titleLower)) return 0.8;

    // Title contains query as substring
    if (titleLower.includes(queryLower)) return 0.7;

    // Fuzzy match - calculate similarity
    const similarity = this.stringSimilarity(queryLower, titleLower);
    return similarity * 0.6; // Scale down fuzzy matches
  }

  private stringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator  // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private mapIGDBPlatform(platformAbbr: string): string {
    const platformMapping: Record<string, string> = {
      'SNES': 'SNES',
      'NES': 'NES', 
      'N64': 'N64',
      'GC': 'GameCube',
      'Wii': 'Wii',
      'WiiU': 'WiiU',
      'Switch': 'Switch',
      'PS': 'PS1',
      'PS2': 'PS2',
      'PS3': 'PS3',
      'PS4': 'PS4',
      'PS5': 'PS5',
      'PSP': 'PSP',
      'Vita': 'PSVita',
      'Xbox': 'Xbox',
      'X360': 'Xbox360',
      'XONE': 'XboxOne',
      'Series X': 'XboxSeriesX',
      'GB': 'GameBoy',
      'GBC': 'GameBoyColor',
      'GBA': 'GameBoyAdvance',
      'NDS': 'DS',
      '3DS': '3DS',
      'MD': 'Genesis',
      'DC': 'DreamCast',
      'Saturn': 'Saturn',
    };

    return platformMapping[platformAbbr] || 'Other';
  }
}