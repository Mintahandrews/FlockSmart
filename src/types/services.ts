export type ServiceStatus = 'open' | 'in-progress' | 'completed';
export type ServiceComplexity = 'beginner' | 'intermediate' | 'advanced';

export interface Service {
  id: string;
  title: string;
  description: string;
  subjectArea: string;
  deadline: string;
  budget: number;
  complexity: ServiceComplexity;
  status: ServiceStatus;
  createdAt: string;
  createdBy: string;
  creatorName: string;
  creatorId: string;
}

export interface ServiceFilters {
  query: string;
  subjectArea: string;
  minPrice: number | null;
  maxPrice: number | null;
  complexity: ServiceComplexity | '';
  status: ServiceStatus | '';
  sortBy: 'latest' | 'price-low-high' | 'price-high-low';
}
