export interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

export interface Anime {
  id: number;
  title: string;
  description: string;
  year: number;
  episodes: number | null;
  status: 'announced' | 'ongoing' | 'finished';
  poster_url: string | null;
  created_at: string;
}

export type PostType = 'post' | 'review' | 'fanart';

export interface Post {
  id: number;
  type: PostType;
  title: string;
  content: string;
  anime_id: number | null;
  rating: number | null;
  image_url: string | null;
  author_id: number;
  created_at: string;
}

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  created_at: string;
}

export interface CommentCreate {
  content: string;
}

export interface CommentUpdate {
  content: string;
}

export type ProductCategory = 'merch' | 'figure';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  image_url: string | null;
  anime_id: number | null;
  is_active: boolean;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  stock?: number;
  category: ProductCategory;
  image_url?: string;
  anime_id?: number;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: ProductCategory;
  image_url?: string;
  anime_id?: number;
  is_active?: boolean;
}
