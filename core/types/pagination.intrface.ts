export interface IPagination {
  page: number;
  pageSize: number;
}

export type IPaginationQuery = IPagination & { searchTerm?: string };

