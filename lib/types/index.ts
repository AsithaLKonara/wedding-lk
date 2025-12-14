/**
 * Type Definitions Index
 * Central export for all type definitions
 */

// MongoDB Query Types
export type {
  MongoQuery,
  MongoQueryOperator,
  MongoSortCriteria,
  MongoProjection,
  MongoUpdate,
  MongoUpdateOperator,
} from './mongodb-queries';

// Aggregation Pipeline Types
export type {
  AggregationStage,
  AggregationPipeline,
  GroupStage,
  GroupAccumulator,
  LookupStage,
  FacetOutput,
} from './aggregation-pipeline';

// Populated Document Types
export type {
  PopulatedField,
  PopulatedUser,
  PopulatedVendor,
  PopulatedVenue,
  PopulatedBooking,
  PopulatedComment,
  PopulatedReview,
  WithPopulated,
  WithPopulatedFields,
} from './populated-documents';

// Search Criteria Types
export type {
  BaseSearchCriteria,
  VendorSearchCriteria,
  VenueSearchCriteria,
  BookingSearchCriteria,
  ReviewSearchCriteria,
  CommentSearchCriteria,
  AvailabilitySearchCriteria,
  PackageSearchCriteria,
  PostSearchCriteria,
} from './search-criteria';

