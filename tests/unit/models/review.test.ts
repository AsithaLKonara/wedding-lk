import mongoose from 'mongoose';
import { Review, IReview } from '@/lib/models/review';
import { setupMockDB, cleanupMockDB, mockObjectId } from '@/tests/helpers/mock-db';

// Use a simple string ID generator for tests
const generateTestId = () => mockObjectId().toString();

describe('Review Model', () => {
  let mockDB: ReturnType<typeof setupMockDB>;

  beforeAll(() => {
    mockDB = setupMockDB();
  });

  afterAll(() => {
    mockDB.restore();
    cleanupMockDB();
  });
  describe('Review Schema Validation', () => {
    it('should create a review with valid data', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        bookingId: generateTestId(),
        overallRating: 5,
        categoryRatings: {
          service: 5,
          quality: 5,
          value: 4,
          communication: 5,
          timeliness: 5,
        },
        title: 'Excellent Service',
        comment: 'Great experience with this vendor',
        pros: ['Professional', 'On time', 'Great quality'],
        cons: [],
        images: [],
        videos: [],
        isVerified: false,
        isAnonymous: false,
        helpful: [],
        notHelpful: [],
        reportCount: 0,
        status: 'pending' as const,
      };

      const review = new Review(reviewData);
      expect(review.vendorId).toBeDefined();
      expect(review.userId).toBeDefined();
      expect(review.overallRating).toBe(5);
      expect(review.title).toBe('Excellent Service');
      expect(review.status).toBe('pending');
    });

    it('should require vendorId field', () => {
      const reviewData = {
        userId: generateTestId(),
        overallRating: 5,
        categoryRatings: {
          service: 5,
          quality: 5,
          value: 4,
          communication: 5,
          timeliness: 5,
        },
        title: 'Excellent Service',
        comment: 'Great experience',
      };

      const review = new Review(reviewData);
      const error = review.validateSync();
      expect(error?.errors.vendorId).toBeDefined();
    });

    it('should require userId field', () => {
      const reviewData = {
        vendorId: generateTestId(),
        overallRating: 5,
        categoryRatings: {
          service: 5,
          quality: 5,
          value: 4,
          communication: 5,
          timeliness: 5,
        },
        title: 'Excellent Service',
        comment: 'Great experience',
      };

      const review = new Review(reviewData);
      const error = review.validateSync();
      expect(error?.errors.userId).toBeDefined();
    });

    it('should require overallRating field', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        categoryRatings: {
          service: 5,
          quality: 5,
          value: 4,
          communication: 5,
          timeliness: 5,
        },
        title: 'Excellent Service',
        comment: 'Great experience',
      };

      const review = new Review(reviewData);
      const error = review.validateSync();
      expect(error?.errors.overallRating).toBeDefined();
    });

    it('should validate overallRating range (1-5)', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 6, // Invalid: > 5
        categoryRatings: {
          service: 5,
          quality: 5,
          value: 4,
          communication: 5,
          timeliness: 5,
        },
        title: 'Excellent Service',
        comment: 'Great experience',
      };

      const review = new Review(reviewData);
      const error = review.validateSync();
      expect(error?.errors.overallRating).toBeDefined();
    });

    it('should validate category ratings range (1-5)', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        categoryRatings: {
          service: 6, // Invalid: > 5
          quality: 5,
          value: 4,
          communication: 5,
          timeliness: 5,
        },
        title: 'Excellent Service',
        comment: 'Great experience',
      };

      const review = new Review(reviewData);
      const error = review.validateSync();
      expect(error?.errors['categoryRatings.service']).toBeDefined();
    });

    it('should set default category ratings to 5', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
      };

      const review = new Review(reviewData);
      expect(review.categoryRatings.service).toBe(5);
      expect(review.categoryRatings.quality).toBe(5);
      expect(review.categoryRatings.value).toBe(5);
      expect(review.categoryRatings.communication).toBe(5);
      expect(review.categoryRatings.timeliness).toBe(5);
    });

    it('should set default values', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
      };

      const review = new Review(reviewData);
      expect(review.isVerified).toBe(false);
      expect(review.isAnonymous).toBe(false);
      expect(review.helpful).toHaveLength(0);
      expect(review.notHelpful).toHaveLength(0);
      expect(review.reportCount).toBe(0);
      expect(review.status).toBe('pending');
    });
  });

  describe('Pros and Cons', () => {
    it('should add pros', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
        pros: ['Professional', 'On time', 'Great quality', 'Affordable'],
        cons: ['None'],
      };

      const review = new Review(reviewData);
      expect(review.pros).toHaveLength(4);
      expect(review.pros).toContain('Professional');
      expect(review.pros).toContain('Affordable');
    });

    it('should add cons', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 3,
        title: 'Average Service',
        comment: 'Could be better',
        pros: ['Professional'],
        cons: ['Late arrival', 'Poor communication', 'Overpriced'],
      };

      const review = new Review(reviewData);
      expect(review.cons).toHaveLength(3);
      expect(review.cons).toContain('Late arrival');
    });
  });

  describe('Media Attachments', () => {
    it('should add images', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
          'https://example.com/image3.jpg',
        ],
      };

      const review = new Review(reviewData);
      expect(review.images).toHaveLength(3);
      expect(review.images[0]).toBe('https://example.com/image1.jpg');
    });

    it('should add videos', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
        videos: [
          'https://example.com/video1.mp4',
          'https://example.com/video2.mp4',
        ],
      };

      const review = new Review(reviewData);
      expect(review.videos).toHaveLength(2);
      expect(review.videos[0]).toBe('https://example.com/video1.mp4');
    });
  });

  describe('Verification', () => {
    it('should mark review as verified', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
        isVerified: true,
        verifiedAt: new Date(),
      };

      const review = new Review(reviewData);
      expect(review.isVerified).toBe(true);
      expect(review.verifiedAt).toBeDefined();
    });

    it('should allow anonymous reviews', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
        isAnonymous: true,
      };

      const review = new Review(reviewData);
      expect(review.isAnonymous).toBe(true);
    });
  });

  describe('Engagement', () => {
    it('should track helpful votes', () => {
      const userId1 = generateTestId();
      const userId2 = generateTestId();
      
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
        helpful: [userId1, userId2],
      };

      const review = new Review(reviewData);
      expect(review.helpful).toHaveLength(2);
      // Mongoose casts IDs to ObjectId instances, so compare using string values
      expect(review.helpful[0]?.toString()).toBe(userId1);
    });

    it('should track not helpful votes', () => {
      const userId1 = generateTestId();
      
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 2,
        title: 'Poor Service',
        comment: 'Not satisfied',
        notHelpful: [userId1],
      };

      const review = new Review(reviewData);
      expect(review.notHelpful).toHaveLength(1);
    });

    it('should track report count', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
        reportCount: 3,
      };

      const review = new Review(reviewData);
      expect(review.reportCount).toBe(3);
    });
  });

  describe('Vendor Response', () => {
    it('should allow vendor response', () => {
      const vendorId = generateTestId();
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 3,
        title: 'Average Service',
        comment: 'Could be better',
        vendorResponse: {
          comment: 'Thank you for your feedback. We will improve our services.',
          respondedAt: new Date(),
          respondedBy: vendorId,
        },
      };

      const review = new Review(reviewData);
      expect(review.vendorResponse?.comment).toBeDefined();
      // respondedBy is stored as ObjectId, so compare by string value
      expect(review.vendorResponse?.respondedBy?.toString()).toBe(vendorId);
    });
  });

  describe('Moderation', () => {
    it('should allow moderation status', () => {
      const moderatorId = generateTestId();
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
        status: 'approved' as const,
        moderationNotes: 'Review approved after verification',
        moderatedBy: moderatorId,
        moderatedAt: new Date(),
      };

      const review = new Review(reviewData);
      expect(review.status).toBe('approved');
      expect(review.moderationNotes).toBe('Review approved after verification');
      // moderatedBy is stored as ObjectId, so compare by string value
      expect(review.moderatedBy?.toString()).toBe(moderatorId);
    });

    it('should allow flagged status', () => {
      const reviewData = {
        vendorId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Excellent Service',
        comment: 'Great experience',
        status: 'flagged' as const,
        moderationNotes: 'Flagged for review due to multiple reports',
      };

      const review = new Review(reviewData);
      expect(review.status).toBe('flagged');
    });
  });

  describe('Venue Reviews', () => {
    it('should allow venue reviews', () => {
      const reviewData = {
        vendorId: generateTestId(),
        venueId: generateTestId(),
        userId: generateTestId(),
        overallRating: 5,
        title: 'Beautiful Venue',
        comment: 'Great location and facilities',
      };

      const review = new Review(reviewData);
      expect(review.venueId).toBeDefined();
    });
  });
});

