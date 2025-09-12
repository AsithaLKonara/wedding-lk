// Data Export Service for GDPR Compliance and User Data Portability

import { User, Vendor, Venue, Booking, Payment, Post, Review } from '@/lib/models';

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeMedia: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  dataTypes: ('profile' | 'bookings' | 'payments' | 'posts' | 'reviews' | 'messages')[];
}

export interface ExportData {
  user: {
    profile: any;
    preferences: any;
    settings: any;
  };
  bookings: any[];
  payments: any[];
  posts: any[];
  reviews: any[];
  messages: any[];
  metadata: {
    exportDate: string;
    dataTypes: string[];
    recordCounts: Record<string, number>;
  };
}

export class DataExportService {
  async exportUserData(
    userId: string,
    userRole: 'user' | 'vendor' | 'admin',
    options: ExportOptions
  ): Promise<ExportData> {
    const exportData: ExportData = {
      user: {
        profile: null,
        preferences: null,
        settings: null,
      },
      bookings: [],
      payments: [],
      posts: [],
      reviews: [],
      messages: [],
      metadata: {
        exportDate: new Date().toISOString(),
        dataTypes: options.dataTypes,
        recordCounts: {},
      },
    };

    try {
      // Export user profile data
      if (options.dataTypes.includes('profile')) {
        const user = await User.findById(userId).select('-password -twoFactorSecret');
        if (user) {
          exportData.user.profile = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            preferences: user.preferences,
            settings: user.settings,
          };
        }

        // Export vendor-specific data
        if (userRole === 'vendor') {
          const vendor = await Vendor.findOne({ userId }).select('-password');
          if (vendor) {
            exportData.user.profile = {
              ...exportData.user.profile,
              businessName: vendor.businessName,
              businessType: vendor.businessType,
              description: vendor.description,
              location: vendor.location,
              services: vendor.services,
              pricing: vendor.pricing,
              availability: vendor.availability,
              socialMedia: vendor.socialMedia,
              isVerified: vendor.isVerified,
            };
          }
        }
      }

      // Export bookings
      if (options.dataTypes.includes('bookings')) {
        const bookings = await Booking.find({ 
          $or: [
            { 'customer.id': userId },
            { 'vendor.id': userId }
          ],
          ...(options.dateRange && {
            createdAt: {
              $gte: options.dateRange.start,
              $lte: options.dateRange.end,
            },
          }),
        }).sort({ createdAt: -1 });

        exportData.bookings = bookings.map(booking => ({
          id: booking._id,
          serviceName: booking.serviceName,
          vendorName: booking.vendorName,
          customerName: booking.customerName,
          date: booking.date,
          time: booking.time,
          duration: booking.duration,
          status: booking.status,
          totalAmount: booking.totalAmount,
          currency: booking.currency,
          specialRequests: booking.specialRequests,
          notes: booking.notes,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        }));

        exportData.metadata.recordCounts.bookings = bookings.length;
      }

      // Export payments
      if (options.dataTypes.includes('payments')) {
        const payments = await Payment.find({ 
          userId,
          ...(options.dateRange && {
            createdAt: {
              $gte: options.dateRange.start,
              $lte: options.dateRange.end,
            },
          }),
        }).sort({ createdAt: -1 });

        exportData.payments = payments.map(payment => ({
          id: payment._id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          transactionId: payment.transactionId,
          description: payment.description,
          bookingId: payment.bookingId,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        }));

        exportData.metadata.recordCounts.payments = payments.length;
      }

      // Export posts
      if (options.dataTypes.includes('posts')) {
        const posts = await Post.find({ 
          'author.id': userId,
          ...(options.dateRange && {
            createdAt: {
              $gte: options.dateRange.start,
              $lte: options.dateRange.end,
            },
          }),
        }).sort({ createdAt: -1 });

        exportData.posts = posts.map(post => ({
          id: post._id,
          content: post.content,
          images: options.includeMedia ? post.images : [],
          tags: post.tags,
          location: post.location,
          engagement: post.engagement,
          status: post.status,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        }));

        exportData.metadata.recordCounts.posts = posts.length;
      }

      // Export reviews
      if (options.dataTypes.includes('reviews')) {
        const reviews = await Review.find({ 
          $or: [
            { 'author.id': userId },
            { 'vendor.id': userId }
          ],
          ...(options.dateRange && {
            createdAt: {
              $gte: options.dateRange.start,
              $lte: options.dateRange.end,
            },
          }),
        }).sort({ createdAt: -1 });

        exportData.reviews = reviews.map(review => ({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          vendorName: review.vendorName,
          authorName: review.authorName,
          images: options.includeMedia ? review.images : [],
          isVerified: review.isVerified,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        }));

        exportData.metadata.recordCounts.reviews = reviews.length;
      }

      // Export messages
      if (options.dataTypes.includes('messages')) {
        // This would require a messages collection
        // For now, we'll include a placeholder
        exportData.messages = [];
        exportData.metadata.recordCounts.messages = 0;
      }

      return exportData;

    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  async generateCSV(data: ExportData): Promise<string> {
    const csvRows: string[] = [];
    
    // Add metadata
    csvRows.push('Data Type,Record Count');
    csvRows.push(`Export Date,${data.metadata.exportDate}`);
    Object.entries(data.metadata.recordCounts).forEach(([type, count]) => {
      csvRows.push(`${type},${count}`);
    });
    csvRows.push(''); // Empty row

    // Add user profile
    if (data.user.profile) {
      csvRows.push('USER PROFILE');
      csvRows.push('Field,Value');
      Object.entries(data.user.profile).forEach(([key, value]) => {
        csvRows.push(`${key},"${value}"`);
      });
      csvRows.push(''); // Empty row
    }

    // Add bookings
    if (data.bookings.length > 0) {
      csvRows.push('BOOKINGS');
      csvRows.push('ID,Service Name,Vendor Name,Customer Name,Date,Time,Status,Amount,Currency,Created At');
      data.bookings.forEach(booking => {
        csvRows.push([
          booking.id,
          `"${booking.serviceName}"`,
          `"${booking.vendorName}"`,
          `"${booking.customerName}"`,
          booking.date,
          booking.time,
          booking.status,
          booking.totalAmount,
          booking.currency,
          booking.createdAt,
        ].join(','));
      });
      csvRows.push(''); // Empty row
    }

    // Add payments
    if (data.payments.length > 0) {
      csvRows.push('PAYMENTS');
      csvRows.push('ID,Amount,Currency,Status,Method,Transaction ID,Description,Created At');
      data.payments.forEach(payment => {
        csvRows.push([
          payment.id,
          payment.amount,
          payment.currency,
          payment.status,
          payment.method,
          payment.transactionId || '',
          `"${payment.description || ''}"`,
          payment.createdAt,
        ].join(','));
      });
      csvRows.push(''); // Empty row
    }

    // Add posts
    if (data.posts.length > 0) {
      csvRows.push('POSTS');
      csvRows.push('ID,Content,Tags,Status,Engagement Likes,Engagement Comments,Engagement Shares,Created At');
      data.posts.forEach(post => {
        csvRows.push([
          post.id,
          `"${post.content}"`,
          `"${post.tags.join(', ')}"`,
          post.status,
          post.engagement.likes,
          post.engagement.comments,
          post.engagement.shares,
          post.createdAt,
        ].join(','));
      });
      csvRows.push(''); // Empty row
    }

    // Add reviews
    if (data.reviews.length > 0) {
      csvRows.push('REVIEWS');
      csvRows.push('ID,Rating,Comment,Vendor Name,Author Name,Is Verified,Created At');
      data.reviews.forEach(review => {
        csvRows.push([
          review.id,
          review.rating,
          `"${review.comment || ''}"`,
          `"${review.vendorName}"`,
          `"${review.authorName}"`,
          review.isVerified,
          review.createdAt,
        ].join(','));
      });
    }

    return csvRows.join('\n');
  }

  async generatePDF(data: ExportData): Promise<Buffer> {
    // This would require a PDF generation library like puppeteer or jsPDF
    // For now, we'll return a placeholder
    const content = JSON.stringify(data, null, 2);
    return Buffer.from(content, 'utf-8');
  }

  async exportToFile(
    userId: string,
    userRole: 'user' | 'vendor' | 'admin',
    options: ExportOptions
  ): Promise<{ data: Buffer; filename: string; mimeType: string }> {
    const exportData = await this.exportUserData(userId, userRole, options);
    
    let data: Buffer;
    let filename: string;
    let mimeType: string;

    switch (options.format) {
      case 'json':
        data = Buffer.from(JSON.stringify(exportData, null, 2), 'utf-8');
        filename = `weddinglk-data-${userId}-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      
      case 'csv':
        const csvData = await this.generateCSV(exportData);
        data = Buffer.from(csvData, 'utf-8');
        filename = `weddinglk-data-${userId}-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      
      case 'pdf':
        data = await this.generatePDF(exportData);
        filename = `weddinglk-data-${userId}-${Date.now()}.pdf`;
        mimeType = 'application/pdf';
        break;
      
      default:
        throw new Error('Unsupported export format');
    }

    return { data, filename, mimeType };
  }

  // Admin function to export all user data
  async exportAllUsersData(options: ExportOptions): Promise<Buffer> {
    const users = await User.find({}).select('_id name email role');
    const allData = {
      exportDate: new Date().toISOString(),
      totalUsers: users.length,
      users: [],
    };

    for (const user of users) {
      const userData = await this.exportUserData(
        user._id.toString(),
        user.role as 'user' | 'vendor' | 'admin',
        options
      );
      allData.users.push(userData);
    }

    return Buffer.from(JSON.stringify(allData, null, 2), 'utf-8');
  }

  // Data deletion for GDPR compliance
  async deleteUserData(userId: string): Promise<{ deleted: Record<string, number> }> {
    const deleted: Record<string, number> = {};

    try {
      // Delete user account
      const userResult = await User.deleteOne({ _id: userId });
      deleted.users = userResult.deletedCount;

      // Delete vendor profile if exists
      const vendorResult = await Vendor.deleteOne({ userId });
      deleted.vendors = vendorResult.deletedCount;

      // Delete bookings
      const bookingResult = await Booking.deleteMany({
        $or: [
          { 'customer.id': userId },
          { 'vendor.id': userId }
        ]
      });
      deleted.bookings = bookingResult.deletedCount;

      // Delete payments
      const paymentResult = await Payment.deleteMany({ userId });
      deleted.payments = paymentResult.deletedCount;

      // Delete posts
      const postResult = await Post.deleteMany({ 'author.id': userId });
      deleted.posts = postResult.deletedCount;

      // Delete reviews
      const reviewResult = await Review.deleteMany({
        $or: [
          { 'author.id': userId },
          { 'vendor.id': userId }
        ]
      });
      deleted.reviews = reviewResult.deletedCount;

      // Note: Messages would need to be deleted from a messages collection
      // This is a placeholder for future implementation

      return { deleted };

    } catch (error) {
      console.error('Error deleting user data:', error);
      throw new Error('Failed to delete user data');
    }
  }
}

export const dataExportService = new DataExportService();


