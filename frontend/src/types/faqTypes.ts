export interface Question {
  id: number;
  title: string;
  content: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Suggestion {
  id: number;
  question: string;
  createdAt?: string;
}
