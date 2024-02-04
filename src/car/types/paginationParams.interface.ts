import { CarAdminOrderingFieldsEnum } from 'core/enums/carAdminOrederingFields.enum';
import { CarOrderingFieldsEnum } from 'core/enums/carOrederingFields.enum';
import { SortDirection } from 'core/enums/sortDirection.enum';
import { IPagination } from 'core/types/pagination.intrface';
// import { CarAdminOrderingFieldsEnum } from 'src/core/enums/carAdminOrederingFields.enum copy';
// import { CarOrderingFieldsEnum } from 'src/core/enums/carOrederingFields.enum';
// import { SortDirection } from 'src/core/enums/sortDirection.enum';
// import { IPagination } from 'src/core/types/pagination.intrface';

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
