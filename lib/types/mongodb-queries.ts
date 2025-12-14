/**
 * MongoDB Query Type Definitions
 * Provides type-safe definitions for MongoDB query operations
 */

/**
 * MongoDB query operator types
 */
export type MongoQueryOperator<T> = {
  $eq?: T;
  $ne?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $in?: T[];
  $nin?: T[];
  $exists?: boolean;
  $regex?: string | RegExp;
  $options?: string;
  $all?: T[];
  $size?: number;
  $elemMatch?: Record<string, unknown>;
  $type?: string | number;
  $mod?: [number, number];
  $where?: string | Function;
  $geoWithin?: Record<string, unknown>;
  $geoIntersects?: Record<string, unknown>;
  $near?: Record<string, unknown>;
  $nearSphere?: Record<string, unknown>;
};

/**
 * MongoDB query type with support for operators and logical operators
 */
export type MongoQuery<T = Record<string, unknown>> = {
  [K in keyof T]?: T[K] | MongoQueryOperator<T[K]>;
} & {
  $or?: MongoQuery<T>[];
  $and?: MongoQuery<T>[];
  $nor?: MongoQuery<T>[];
  $not?: MongoQuery<T>;
  $text?: { $search: string; $language?: string; $caseSensitive?: boolean; $diacriticSensitive?: boolean };
  $where?: string | Function;
  $expr?: Record<string, unknown>;
  $jsonSchema?: Record<string, unknown>;
  $comment?: string;
  [key: string]: unknown;
};

/**
 * MongoDB sort criteria
 */
export type MongoSortCriteria<T = Record<string, unknown>> = {
  [K in keyof T]?: 1 | -1 | 'asc' | 'desc';
} & {
  [key: string]: 1 | -1 | 'asc' | 'desc';
};

/**
 * MongoDB projection (field selection)
 */
export type MongoProjection<T = Record<string, unknown>> = {
  [K in keyof T]?: 0 | 1 | string | Record<string, unknown>;
} & {
  [key: string]: 0 | 1 | string | Record<string, unknown>;
};

/**
 * MongoDB update operators
 */
export type MongoUpdateOperator<T = Record<string, unknown>> = {
  $set?: Partial<T>;
  $unset?: Partial<Record<keyof T, string>>;
  $inc?: Partial<Record<keyof T, number>>;
  $mul?: Partial<Record<keyof T, number>>;
  $rename?: Record<string, string>;
  $min?: Partial<Record<keyof T, number>>;
  $max?: Partial<Record<keyof T, number>>;
  $currentDate?: Partial<Record<keyof T, boolean | { $type: 'date' | 'timestamp' }>>;
  $addToSet?: Partial<Record<keyof T, unknown>>;
  $push?: Partial<Record<keyof T, unknown>>;
  $pull?: Partial<Record<keyof T, unknown>>;
  $pullAll?: Partial<Record<keyof T, unknown[]>>;
  $pop?: Partial<Record<keyof T, 1 | -1>>;
  $bit?: Partial<Record<keyof T, { and?: number; or?: number; xor?: number }>>;
};

/**
 * MongoDB update document
 */
export type MongoUpdate<T = Record<string, unknown>> = Partial<T> | MongoUpdateOperator<T>;

