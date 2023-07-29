export enum ENUM_PAGINATION_ORDER_DIRECTION_TYPE {
  ASC = 'asc',
  DESC = 'desc',
}

export type IPaginationOrder = Record<string, ENUM_PAGINATION_ORDER_DIRECTION_TYPE>;

export interface IPaginationPaging {
  limit: number;
  offset: number;
}

export interface IPaginationOptions {
  paging?: IPaginationPaging;
  order?: IPaginationOrder;
}
