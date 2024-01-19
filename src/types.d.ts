declare module 'steam' {
  export type User = {
    steamid: string;
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    avatarhash: string;
    lastlogoff: number;
    personastate: number;
    realname: string?;
    primaryclanid: string;
    timecreated: number;
    personastateflags: number;
  }
  
  export type Game = {
    name: string;
    steam_appid: number;
    is_free: boolean;
    header_image: string;
    price_overview: {
      currency: string;
      initial: number;
      final: number;
      discount_percent: number;
      initial_formatted: string;
      final_formatted: string;
    };
    platforms: {
      windows: boolean;
      mac: boolean;
      linux: boolean;
    };
    categories: {
      id: number;
      description: string;
    }[];
    genres: {
      id: string;
      description: string;
    }[];
    
  }
  
  export type Comparison = {
    id: string;
    users: User[];
    games: Game[];
    commonGames: Game[];
    commonGamesCount: number;
  }
}