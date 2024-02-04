import { CarAdminOrderingFieldsEnum } from '../../../core/enums/carAdminOrederingFields.enum';
import { CarOrderingFieldsEnum } from '../../../core/enums/carOrederingFields.enum';
import { SortDirection } from '../../../core/enums/sortDirection.enum';
import { IPagination } from '../../../core/types/pagination.intrface';

export interface IPaginationParams<T extends OrderingFields> {
  paginationSettings: IPagination;
  searchTerm: string;
  dir: SortDirection;
  ordering: T;
}

export type OrderingFields = CarOrderingFieldsEnum | CarAdminOrderingFieldsEnum;

export interface IParseOrdering {
  sort: string;
  order: 'ASC' | 'DESC';
}
