export interface IQuestion {
  id: number;
  title: string;
  content: string;
  categories: ICategory[];
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
  title: string;
  content: string;
  ip_address?: string;
  created_at?: string;
}

export interface IAttachment {
  id: number;
  filename: string;
  filepath: string;
  mimetype: string;
}
