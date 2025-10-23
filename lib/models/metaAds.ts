import mongoose, { Schema, Document } from 'mongoose';

export interface IMetaAdsCampaign extends Document {
  vendorId: mongoose.Types.ObjectId;
  packageId?: mongoose.Types.ObjectId;
  metaCampaignId: string;
  name: string;
  objective: 'CONVERSIONS' | 'TRAFFIC' | 'REACH' | 'BRAND_AWARENESS';
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'DRAFT';
  budget: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  startTime: Date;
  endTime?: Date;
  targeting: {
    ageMin: number;
    ageMax: number;
    genders: number[];
    geoLocations: {
      countries: string[];
      regions?: string[];
      cities?: string[];
    };
    interests: string[];
    behaviors: string[];
    demographics: string[];
  };
  metrics: {
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
    lastUpdated: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMetaAdsAdSet extends Document {
  campaignId: mongoose.Types.ObjectId;
  metaAdSetId: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'DRAFT';
  budget: number;
  optimizationGoal: 'CONVERSIONS' | 'CLICKS' | 'IMPRESSIONS' | 'REACH';
  targeting: {
    ageMin: number;
    ageMax: number;
    genders: number[];
    geoLocations: {
      countries: string[];
      regions?: string[];
      cities?: string[];
    };
    interests: string[];
    behaviors: string[];
    demographics: string[];
  };
  metrics: {
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
    lastUpdated: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMetaAdsCreative extends Document {
  adSetId: mongoose.Types.ObjectId;
  metaCreativeId: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'DRAFT';
  creative: {
    title: string;
    body: string;
    callToActionType: 'BOOK_NOW' | 'LEARN_MORE' | 'SHOP_NOW' | 'SIGN_UP';
    imageUrl?: string;
    videoUrl?: string;
    linkUrl: string;
  };
  metrics: {
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
    lastUpdated: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMetaAdsAccount extends Document {
  vendorId: mongoose.Types.ObjectId;
  metaAccountId: string;
  accessToken: string;
  accountName: string;
  currency: string;
  timezone: string;
  isActive: boolean;
  permissions: string[];
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MetaAdsCampaignSchema = new Schema<IMetaAdsCampaign>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  packageId: { type: Schema.Types.ObjectId, ref: 'VendorPackage' },
  metaCampaignId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  objective: { 
    type: String, 
    enum: ['CONVERSIONS', 'TRAFFIC', 'REACH', 'BRAND_AWARENESS'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'PAUSED', 'DELETED', 'DRAFT'],
    default: 'DRAFT' 
  },
  budget: { type: Number, required: true },
  dailyBudget: { type: Number },
  lifetimeBudget: { type: Number },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  targeting: {
    ageMin: { type: Number, default: 25 },
    ageMax: { type: Number, default: 45 },
    genders: [{ type: Number }],
    geoLocations: {
      countries: [{ type: String }],
      regions: [{ type: String }],
      cities: [{ type: String }]
    },
    interests: [{ type: String }],
    behaviors: [{ type: String }],
    demographics: [{ type: String }]
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    spend: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    cpm: { type: Number, default: 0 },
    roas: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

const MetaAdsAdSetSchema = new Schema<IMetaAdsAdSet>({
  campaignId: { type: Schema.Types.ObjectId, ref: 'MetaAdsCampaign', required: true },
  metaAdSetId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'PAUSED', 'DELETED', 'DRAFT'],
    default: 'DRAFT' 
  },
  budget: { type: Number, required: true },
  optimizationGoal: { 
    type: String, 
    enum: ['CONVERSIONS', 'CLICKS', 'IMPRESSIONS', 'REACH'],
    required: true 
  },
  targeting: {
    ageMin: { type: Number, default: 25 },
    ageMax: { type: Number, default: 45 },
    genders: [{ type: Number }],
    geoLocations: {
      countries: [{ type: String }],
      regions: [{ type: String }],
      cities: [{ type: String }]
    },
    interests: [{ type: String }],
    behaviors: [{ type: String }],
    demographics: [{ type: String }]
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    spend: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    cpm: { type: Number, default: 0 },
    roas: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

const MetaAdsCreativeSchema = new Schema<IMetaAdsCreative>({
  adSetId: { type: Schema.Types.ObjectId, ref: 'MetaAdsAdSet', required: true },
  metaCreativeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'PAUSED', 'DELETED', 'DRAFT'],
    default: 'DRAFT' 
  },
  creative: {
    title: { type: String, required: true },
    body: { type: String, required: true },
    callToActionType: { 
      type: String, 
      enum: ['BOOK_NOW', 'LEARN_MORE', 'SHOP_NOW', 'SIGN_UP'],
      required: true 
    },
    imageUrl: { type: String },
    videoUrl: { type: String },
    linkUrl: { type: String, required: true }
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    spend: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    cpm: { type: Number, default: 0 },
    roas: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

const MetaAdsAccountSchema = new Schema<IMetaAdsAccount>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  metaAccountId: { type: String, required: true },
  accessToken: { type: String, required: true },
  accountName: { type: String, required: true },
  currency: { type: String, default: 'LKR' },
  timezone: { type: String, default: 'Asia/Colombo' },
  isActive: { type: Boolean, default: true },
  permissions: [{ type: String }],
  lastSyncAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better performance
MetaAdsCampaignSchema.index({ vendorId: 1, status: 1 });
MetaAdsCampaignSchema.index({ packageId: 1 });

MetaAdsAdSetSchema.index({ campaignId: 1, status: 1 });

MetaAdsCreativeSchema.index({ adSetId: 1, status: 1 });

MetaAdsAccountSchema.index({ vendorId: 1 });
MetaAdsAccountSchema.index({ metaAccountId: 1 });

export const MetaAdsCampaign = mongoose.models.MetaAdsCampaign || mongoose.model<MetaAdsCampaign>('MetaAdsCampaign', MetaAdsCampaignSchema);
export const MetaAdsAdSet = mongoose.models.MetaAdsAdSet || mongoose.model<MetaAdsAdSet>('MetaAdsAdSet', MetaAdsAdSetSchema);
export const MetaAdsCreative = mongoose.models.MetaAdsCreative || mongoose.model<MetaAdsCreative>('MetaAdsCreative', MetaAdsCreativeSchema);
export const MetaAdsAccount = mongoose.models.MetaAdsAccount || mongoose.model<MetaAdsAccount>('MetaAdsAccount', MetaAdsAccountSchema);
