import type { Post } from '../stores/post'
import { PostModel } from '../stores/post'
import type { BaseService } from '@@/app/services/baseService'
import { usePosts } from '../composables/usePosts'
import type { BasePagination } from '@@/app/types/base'

// Use a composable pattern to ensure Pinia is initialized before using the store
export const usePostService = (): BaseService<Post> => {
  // Only create usePosts() when the composable is called, not at module level
  const postsApi = usePosts()
  
  return {
    async fetch(page = 1, pageSize = 10): Promise<{ items: Post[], pagination: BasePagination }> {
      console.log('PostService.fetch called with page:', page, 'pageSize:', pageSize)
      const result = await postsApi.fetchPosts(page, pageSize)
      console.log('PostService API response:', result)
      return {
        items: PostModel.fromJsonList(result.posts),
        pagination: result.pagination
      }
    },
    async create(data: Omit<Post, 'id'>): Promise<{ item: Post }> {
      const result = await postsApi.createPost(data)
      return {
        item: PostModel.fromJson(result.post)
      }
    },

    async update(id: number, data: Partial<Omit<Post, 'id'>>): Promise<{ item: Post }> {
      const result = await postsApi.updatePost(id, data)
      return {
        item: PostModel.fromJson(result.post)
      }
    },

    async delete(id: number): Promise<void> {
      await postsApi.deletePost(id)
    }
  }
}
