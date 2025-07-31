import { apiClient } from "@/lib/axios";

export interface Song {
  id: number;
  title: string;
  mood: string;
  url: string;
  created_at?: string;
}

export interface SongResponse {
  songs: Song[];
}

export interface StoreSongRequest {
  title: string;
  mood: string;
  url: string;
}

export interface StoreSongResponse {
  message: string;
  data: Song[];
}

export const songService = {
  // Get all songs
  getAllSongs: async (): Promise<Song[]> => {
    const response = await apiClient.get<SongResponse>("/api/getsongs");
    return response.data.songs;
  },

  // Get songs by mood
  getSongsByMood: async (mood: string): Promise<Song[]> => {
    const allSongs = await songService.getAllSongs();
    return allSongs.filter(
      (song) => song.mood.toLowerCase() === mood.toLowerCase()
    );
  },

  // Store a new song
  storeSong: async (songData: StoreSongRequest): Promise<Song[]> => {
    const response = await apiClient.post<StoreSongResponse>(
      "/api/storesongs",
      songData
    );
    return response.data.data;
  },
};
