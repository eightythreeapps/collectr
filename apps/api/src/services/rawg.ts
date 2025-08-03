import axios, { AxiosInstance } from 'axios';

interface RAWGGame {
  id: number;
  name: string;
  slug: string;
  description_raw?: string;
  background_image?: string;
  platforms?: Array<{
    platform: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  publishers?: Array<{
    id: number;
    name: string;
  }>;
  released?: string;
  rating?: number;
  ratings_count?: number;
}

interface RAWGSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RAWGGame[];
}

export class RAWGService {
  private client: AxiosInstance;
  private readonly apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    
    this.client = axios.create({
      baseURL: 'https://api.rawg.io/api',
      timeout: 10000,
      params: apiKey ? { key: apiKey } : {},
    });
  }

  async searchGames(query: string, platform?: string, limit = 20, offset = 0): Promise<RAWGGame[]> {
    try {
      const params: Record<string, any> = {
        search: query,
        page_size: Math.min(limit, 40), // RAWG max is 40
        page: Math.floor(offset / limit) + 1,
        ordering: '-relevance,-rating',
      };

      // Add platform filter if specified
      if (platform) {
        const platformMapping: Record<string, string> = {
          'SNES': 'snes',
          'NES': 'nes',
          'N64': 'nintendo-64',
          'GameCube': 'gamecube',
          'Wii': 'wii',
          'WiiU': 'wii-u',
          'Switch': 'nintendo-switch',
          'PS1': 'playstation',
          'PS2': 'playstation2',
          'PS3': 'playstation3',
          'PS4': 'playstation4',
          'PS5': 'playstation5',
          'PSP': 'psp',
          'PSVita': 'ps-vita',
          'Xbox': 'xbox-old',
          'Xbox360': 'xbox360',
          'XboxOne': 'xbox-one',
          'XboxSeriesX': 'xbox-series-x',
          'GameBoy': 'game-boy',
          'GameBoyColor': 'game-boy-color',
          'GameBoyAdvance': 'game-boy-advance',
          'DS': 'nintendo-ds',
          '3DS': 'nintendo-3ds',
          'Genesis': 'genesis',
          'DreamCast': 'dreamcast',
          'Saturn': 'sega-saturn',
        };

        const rawgPlatform = platformMapping[platform];
        if (rawgPlatform) {
          params.platforms = rawgPlatform;
        }
      }

      const response = await this.client.get<RAWGSearchResponse>('/games', { params });
      return response.data.results || [];
    } catch (error) {
      console.error('RAWG search failed:', error);
      return [];
    }
  }

  async getGameById(rawgId: number): Promise<RAWGGame | null> {
    try {
      const response = await this.client.get<RAWGGame>(`/games/${rawgId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get RAWG game ${rawgId}:`, error);
      return null;
    }
  }

  // Helper method to extract publisher from RAWG data
  static extractPublisher(publishers?: RAWGGame['publishers']): string {
    if (!publishers?.length) return 'Unknown';
    return publishers[0].name;
  }

  // Helper method to extract year from release date
  static extractYear(released?: string): number {
    if (!released) return new Date().getFullYear();
    return new Date(released).getFullYear();
  }

  // Helper method to map RAWG platform to our enum
  static mapPlatform(rawgPlatforms?: RAWGGame['platforms']): string {
    if (!rawgPlatforms || !rawgPlatforms.length) return 'Other';

    const platformMapping: Record<string, string> = {
      'nintendo-entertainment-system': 'NES',
      'super-nintendo-entertainment-system': 'SNES',
      'nintendo-64': 'N64',
      'nintendo-gamecube': 'GameCube',
      'nintendo-wii': 'Wii',
      'nintendo-wii-u': 'WiiU',
      'nintendo-switch': 'Switch',
      'playstation': 'PS1',
      'playstation-2': 'PS2',
      'playstation-3': 'PS3',
      'playstation-4': 'PS4',
      'playstation-5': 'PS5',
      'playstation-portable': 'PSP',
      'playstation-vita': 'PSVita',
      'xbox': 'Xbox',
      'xbox-360': 'Xbox360',
      'xbox-one': 'XboxOne',
      'xbox-series-x': 'XboxSeriesX',
      'game-boy': 'GameBoy',
      'game-boy-color': 'GameBoyColor',
      'game-boy-advance': 'GameBoyAdvance',
      'nintendo-ds': 'DS',
      'nintendo-3ds': '3DS',
      'sega-genesis': 'Genesis',
      'dreamcast': 'DreamCast',
      'sega-saturn': 'Saturn',
    };

    // Find the first matching platform
    for (const platform of rawgPlatforms) {
      if (platform?.platform?.slug) {
        const mapped = platformMapping[platform.platform.slug];
        if (mapped) return mapped;
      }
    }

    return 'Other';
  }
}