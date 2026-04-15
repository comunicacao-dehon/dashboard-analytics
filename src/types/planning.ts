import { SocialPlatform } from "./social";

export type PostStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'failed';

export interface ContentPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  media_urls: string[];
  platform: SocialPlatform;
  status: PostStatus;
  scheduled_at: string | null; // ISO date
  published_at: string | null; // ISO date
  external_post_id: string | null;
  error_log: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanningStats {
  total: number;
  byStatus: Record<PostStatus, number>;
  completionRate: number; // percentage of published vs scheduled/draft
}

export interface PublisherResponse {
  success: boolean;
  externalId?: string;
  error?: string;
}
