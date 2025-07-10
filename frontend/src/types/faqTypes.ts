export interface IQuestion {
  id: number;
  title: string;
  content: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  attachments?: IAttachment[];
}

export interface ICategory {
  id: number;
  name: string;
}

export interface ISuggestion {
  id: number;
  question: string;
  createdAt?: string;
}

export interface IAttachment {
  id: number;
  filename: string;
  filepath: string;
  mimetype: string;
}
