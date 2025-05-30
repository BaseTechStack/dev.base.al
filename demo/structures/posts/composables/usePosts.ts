import type { BasePagination } from '@@/app/types/base'
import { useApi } from '@@/app/composables/useApi'
import type { Post } from '../stores/post'

export const usePosts = () => {
  const api = useApi()

  const fetchPosts = async (page = 1, pageSize = 10) => {
    console.log('usePosts.fetchPosts called with page:', page, 'pageSize:', pageSize)
    const result = await api.get(`/posts?page=${page}&limit=${pageSize}`)
    console.log('usePosts API response:', result)
    const total = result.pagination?.total || 0
    const pagination: BasePagination = {
      total: total,
      page: result.pagination?.page || 1,
      pageSize: pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    }
    console.log('usePosts returning pagination:', pagination)
    return { posts: result.data, pagination }
  }

  const fetchPostById = async (id: number) => {
    const result = await api.get(`/posts/${id}`)
    return { post: result.data }
  }

  const createPost = async (postData: Omit<Post, 'id'>) => {
    const result = await api.post('/posts', postData)
    return { post: result.data }
  }

  const updatePost = async (id: number, postData: Partial<Omit<Post, 'id'>>) => {
    const result = await api.put(`/posts/${id}`, postData)
    return { post: result.data }
  }

  const deletePost = async (id: number) => {
    await api.delete(`/posts/${id}`)
  }

  return {
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost
  }
}
