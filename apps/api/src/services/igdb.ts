import axios, { AxiosInstance } from 'axios';
import type { IGDBGame } from '@collectr/types';

interface IGDBTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class IGDBService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    
    this.client = axios.create({
      baseURL: 'https://api.igdb.com/v4',
      timeout: 10000,
      headers: {
        'Client-ID': this.clientId,
        'Accept': 'application/json',
      },
    });
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    
    // Return cached token if still valid (with 5 minute buffer)
    if (this.accessToken && this.tokenExpiry > now + 300000) {
      return this.accessToken;
    }

    try {
      const response = await axios.post<IGDBTokenResponse>(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = now + (response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get IGDB access token:', error);
      throw new Error('Failed to authenticate with IGDB API');
    }
  }

  private async makeRequest<T>(endpoint: string, query: string): Promise<T> {
    const token = await this.getAccessToken();
    
    try {
      const response = await this.client.post<T>(endpoint, query, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`IGDB API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async searchGames(query: string, platform?: string, limit = 20, offset = 0): Promise<IGDBGame[]> {
    // Build IGDB query with fields we need
    let igdbQuery = `
      fields id, name, slug, summary, cover.url, platforms.name, platforms.abbreviation, 
             involved_companies.company.name, involved_companies.publisher, first_release_date;
      search "${query}";
      limit ${limit};
      offset ${offset};
    `;

    // Add platform filter if specified
    if (platform) {
      const platformMapping: Record<string, number[]> = {
        'SNES': [19], // Super Nintendo
        'NES': [18], // Nintendo Entertainment System
        'N64': [4], // Nintendo 64
        'GameCube': [21], // Nintendo GameCube
        'Wii': [5], // Nintendo Wii
        'WiiU': [41], // Nintendo Wii U
        'Switch': [130], // Nintendo Switch
        'PS1': [7], // PlayStation
        'PS2': [8], // PlayStation 2
        'PS3': [9], // PlayStation 3
        'PS4': [48], // PlayStation 4
        'PS5': [167], // PlayStation 5
        'PSP': [38], // PlayStation Portable
        'PSVita': [46], // PlayStation Vita
        'Xbox': [11], // Xbox
        'Xbox360': [12], // Xbox 360
        'XboxOne': [49], // Xbox One
        'XboxSeriesX': [169], // Xbox Series X|S
        'GameBoy': [33], // Game Boy
        'GameBoyColor': [22], // Game Boy Color
        'GameBoyAdvance': [24], // Game Boy Advance
        'DS': [20], // Nintendo DS
        '3DS': [37], // Nintendo 3DS
        'Genesis': [29], // Sega Genesis
        'DreamCast': [23], // Sega DreamCast
        'Saturn': [32], // Sega Saturn
      };

      const platformIds = platformMapping[platform];
      if (platformIds) {
        igdbQuery += `where platforms = (${platformIds.join(',')});`;
      }
    }

    try {
      const games = await this.makeRequest<IGDBGame[]>('/games', igdbQuery);
      return games || [];
    } catch (error) {
      console.error('IGDB search failed:', error);
      return [];
    }
  }

  async getGameById(igdbId: number): Promise<IGDBGame | null> {
    const query = `
      fields id, name, slug, summary, cover.url, platforms.name, platforms.abbreviation,
             involved_companies.company.name, involved_companies.publisher, first_release_date;
      where id = ${igdbId};
    `;

    try {
      const games = await this.makeRequest<IGDBGame[]>('/games', query);
      return games?.[0] || null;
    } catch (error) {
      console.error(`Failed to get IGDB game ${igdbId}:`, error);
      return null;
    }
  }

  async searchByUPC(upc: string): Promise<IGDBGame[]> {
    const query = `
      fields game.id, game.name, game.slug, game.summary, game.cover.url, 
             game.platforms.name, game.platforms.abbreviation,
             game.involved_companies.company.name, game.involved_companies.publisher, 
             game.first_release_date;
      where upc = "${upc}";
    `;

    try {
      const releases = await this.makeRequest<any[]>('/release_dates', query);
      return releases?.map(release => release.game).filter(Boolean) || [];
    } catch (error) {
      console.error(`Failed to search IGDB by UPC ${upc}:`, error);
      return [];
    }
  }

  // Helper method to convert IGDB cover URL to high-res
  static getHighResCoverUrl(coverUrl: string): string {
    if (!coverUrl) return '';
    
    // Convert thumbnail to high-res (720p)
    return coverUrl.replace('/t_thumb/', '/t_720p/');
  }

  // Helper method to extract publisher from involved companies
  static extractPublisher(involvedCompanies?: IGDBGame['involved_companies']): string {
    if (!involvedCompanies?.length) return 'Unknown';
    
    const publisher = involvedCompanies.find((company: any) => company.publisher);
    return publisher?.company.name || involvedCompanies[0]?.company.name || 'Unknown';
  }

  // Helper method to convert IGDB timestamp to year
  static extractYear(timestamp?: number): number {
    if (!timestamp) return new Date().getFullYear();
    return new Date(timestamp * 1000).getFullYear();
  }
}