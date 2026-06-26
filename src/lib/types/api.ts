import type { CenterListItem } from './center';

export interface PaginatedResponse {
  centers: CenterListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
}

export interface ReportResponse {
  success: boolean;
  report_count: number;
}
