type StreamingPlatform = 'twitch' | 'youtube' | 'tiktok' | 'kick' | 'rumble';

interface GetStreamersQuery {
  limit?: string;
  offset?: string;
  name?: string;
  pseudonym?: string;
  streamingPlatforms?: string;
  orderBy?: string;
  sortOrder?: string;
}

interface StreamersSearchCriteria extends GetStreamersQuery {
  limit: number;
  offset: number;
  streamingPlatforms?: string[];
  sortOrder?: SortOrder;
}
