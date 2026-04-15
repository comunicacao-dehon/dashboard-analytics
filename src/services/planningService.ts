import { supabase } from "@/lib/supabase";
import { ContentPost, PostStatus } from "@/types/planning";
import { ApiResponse } from "@/types/social";

export const planningService = {
  /**
   * Buscar todos os posts do usuário
   */
  async getPosts(userId: string): Promise<ContentPost[]> {
    const { data, error } = await supabase
      .from("content_posts")
      .select("*")
      .eq("user_id", userId)
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Criar um novo post
   */
  async createPost(post: Partial<ContentPost>): Promise<ContentPost> {
    const { data, error } = await supabase
      .from("content_posts")
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Atualizar um post existente
   */
  async updatePost(id: string, updates: Partial<ContentPost>): Promise<ContentPost> {
    const { data, error } = await supabase
      .from("content_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletar um post
   */
  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from("content_posts")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Upload de mídia para o Supabase Storage
   */
  async uploadMedia(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('content')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('content')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Atualizar status do post (Pipeline)
   */
  async updateStatus(id: string, status: PostStatus): Promise<ContentPost> {
    return this.updatePost(id, { status });
  },

  /**
   * Buscar estatísticas de progresso
   */
  async getPlanningStats(userId: string): Promise<any> {
    const posts = await this.getPosts(userId);
    const byStatus = posts.reduce((acc, post) => {
      acc[post.status] = (acc[post.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const published = byStatus['published'] || 0;
    const total = posts.length;
    const completionRate = total > 0 ? (published / total) * 100 : 0;

    return {
      total,
      byStatus,
      completionRate
    };
  }
};
