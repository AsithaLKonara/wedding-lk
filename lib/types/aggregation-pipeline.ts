/**
 * MongoDB Aggregation Pipeline Type Definitions
 * Provides type-safe definitions for MongoDB aggregation operations
 */

/**
 * Aggregation stage types
 */
export type AggregationStage =
  | { $match: Record<string, unknown> }
  | { $group: GroupStage }
  | { $sort: Record<string, 1 | -1> }
  | { $project: Record<string, 0 | 1 | string | Record<string, unknown>> }
  | { $limit: number }
  | { $skip: number }
  | { $unwind: string | { path: string; preserveNullAndEmptyArrays?: boolean; includeArrayIndex?: string } }
  | { $lookup: LookupStage }
  | { $addFields: Record<string, unknown> }
  | { $replaceRoot: { newRoot: string | Record<string, unknown> } }
  | { $facet: Record<string, AggregationStage[]> }
  | { $count: string }
  | { $out: string | { db: string; coll: string } }
  | { $merge: Record<string, unknown> }
  | { $graphLookup: Record<string, unknown> }
  | { $bucket: Record<string, unknown> }
  | { $bucketAuto: Record<string, unknown> }
  | { $sample: { size: number } }
  | { $redact: Record<string, unknown> }
  | { $indexStats: Record<string, unknown> }
  | { $collStats: Record<string, unknown> }
  | { $currentOp: Record<string, unknown> }
  | { $listLocalSessions: Record<string, unknown> }
  | { $listSessions: Record<string, unknown> }
  | { $unionWith: { coll: string; pipeline?: AggregationStage[] } }
  | { $set: Record<string, unknown> }
  | { $unset: string | string[] };

/**
 * Aggregation pipeline array
 */
export type AggregationPipeline = AggregationStage[];

/**
 * Group stage accumulator operators
 */
export type GroupAccumulator = {
  $sum?: string | number | Record<string, unknown>;
  $avg?: string | Record<string, unknown>;
  $min?: string | Record<string, unknown>;
  $max?: string | Record<string, unknown>;
  $push?: string | Record<string, unknown>;
  $addToSet?: string | Record<string, unknown>;
  $first?: string;
  $last?: string;
  $stdDevPop?: string | Record<string, unknown>;
  $stdDevSamp?: string | Record<string, unknown>;
  $mergeObjects?: string | Record<string, unknown>;
  $accumulator?: Record<string, unknown>;
};

/**
 * Group stage definition
 */
export type GroupStage = {
  _id: string | Record<string, string> | null | Record<string, unknown>;
  [field: string]: GroupAccumulator | string | number | Record<string, unknown> | null | undefined;
};

/**
 * Lookup stage definition
 */
export type LookupStage = {
  from: string;
  localField?: string;
  foreignField?: string;
  as: string;
  let?: Record<string, string>;
  pipeline?: AggregationStage[];
};

/**
 * Facet stage output
 */
export type FacetOutput = {
  [outputName: string]: AggregationStage[];
};

