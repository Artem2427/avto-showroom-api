// import { CarAdminOrderingFieldsEnum } from 'src/core/enums/carAdminOrederingFields.enum copy';
// import {
//   CarFilterFieldsEnum,
//   FilterParamsValuesType,
// } from 'src/core/enums/carFilter.enum';
// import { SortDirection } from 'src/core/enums/sortDirection.enum';
import { PaginationFilterDTO } from '../dto/paginationFilter.dto';
import { IParseOrdering } from '../types/paginationParams.interface';
import { SortDirection } from 'core/enums/sortDirection.enum';
import { CarFilterFieldsEnum, FilterParamsValuesType } from 'core/enums/carFilter.enum';
import { CarAdminOrderingFieldsEnum } from 'core/enums/carAdminOrederingFields.enum';

export const parseAdminCarsOrdering = (
  ordering: CarAdminOrderingFieldsEnum,
  dir: SortDirection,
): IParseOrdering => {
  const direction = dir === SortDirection.Descend ? 'DESC' : 'ASC';

  switch (ordering) {
    case CarAdminOrderingFieldsEnum.Body:
      return {
        order: direction,
        sort: `bodyType.body`,
      };
    case CarAdminOrderingFieldsEnum.Brand:
      return {
        order: direction,
        sort: `brand.name`,
      };
    case CarAdminOrderingFieldsEnum.Model:
      return {
        order: direction,
        sort: `model.name`,
      };
    case CarAdminOrderingFieldsEnum.Color:
      return {
        order: direction,
        sort: `color.color`,
      };
    case CarAdminOrderingFieldsEnum.Transmission:
      return {
        order: direction,
        sort: `transmission.transmission`,
      };
    default:
      return { sort: `car.${ordering}`, order: direction };
  }
};

export const filterCarsFindOptions = (filters: PaginationFilterDTO[]) => {
  const filterList = [];

  for (let i = 0; i < filters.length; i++) {
    let options = {};
    const filterParam = filters[i];

    if (filterParam && !filterParam.disabled) {
      switch (filterParam.type) {
        case FilterParamsValuesType.Array: {
          if (filterParam.values.length) {
            options = arrayParamsOptions(filterParam);
          }
          break;
        }
        case FilterParamsValuesType.Range:
        case FilterParamsValuesType.DateRange: {
          options = rangeParamsOptions(filterParam);
          break;
        }
        default:
          break;
      }
      filterList.push(options);
    }
  }
  return filterList;
};

const arrayParamsOptions = (params: PaginationFilterDTO) => {
  switch (params.field) {
    case CarFilterFieldsEnum.Brand: {
      return {
        where: 'car.brand.id IN (:...brandIds)',
        parameters: {
          brandIds: params.values,
        },
      };
    }
    case CarFilterFieldsEnum.Color: {
      return {
        where: 'car.color.id IN (:...colorIds)',
        parameters: {
          colorIds: params.values,
        },
      };
    }
    case CarFilterFieldsEnum.Transmission: {
      return {
        where: 'car.transmission.id IN (:...transmissionIds)',
        parameters: {
          transmissionIds: params.values,
        },
      };
    }
    case CarFilterFieldsEnum.BodyType: {
      return {
        where: 'car.bodyType.id IN (:...bodyTypeIds)',
        parameters: {
          bodyTypeIds: params.values,
        },
      };
    }
    case CarFilterFieldsEnum.FuelType: {
      return {
        where: 'fuel.id IN (:...fuelTypeIds)',
        parameters: {
          fuelTypeIds: params.values,
        },
      };
    }
    case CarFilterFieldsEnum.Drive: {
      return {
        where: 'car.bodyType.id IN (:...driveIds)',
        parameters: {
          driveIds: params.values,
        },
      };
    }
    default:
      return {};
  }
};

const rangeValue = (value: string, isDate: boolean) => {
  return isDate ? new Date(value).toISOString() : Number(value);
};

const rangeParamsOptions = (params: PaginationFilterDTO) => {
  const isDate = params.type === FilterParamsValuesType.DateRange;
  if (params.from && params.to) {
    return {
      where: `car.${params.field} BETWEEN '${rangeValue(
        params.from,
        isDate,
      )}' AND '${rangeValue(params.to, isDate)}'`,
    };
  }
  if (params.to) {
    return {
      where: `car.${params.field} < :start_to`,
      parameters: { start_to: rangeValue(params.to, isDate) },
    };
  }
  if (params.from) {
    return {
      where: `car.${params.field} > :end_from`,
      parameters: { end_from: rangeValue(params.from, isDate) },
    };
  }
};
