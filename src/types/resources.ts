export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  subjectArea: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export type ResourceType = 'article' | 'video' | 'document' | 'link' | 'quiz';
