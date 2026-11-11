export interface PageResult<T> {
     content: T[];
     totalPages: number;
     totalElemets: number;
     number: number;
     size: number;
     first: boolean;
     last: boolean;
}