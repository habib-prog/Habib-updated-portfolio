import mongoose, { Schema, Document } from 'mongoose';

export interface IFooterConfig extends Document {
  tagline: string;
  copyrightText: string;
  systemStatusText: string;
  systemStatusState: 'operational' | 'degraded' | 'maintenance';
  showNavLinks: boolean;
  showOpsLinks: boolean;
  showSpecializationTags: boolean;
  specializationTags: string[];
  footerPhotoUrl?: string;
  showFooterPhoto?: boolean;
}

const FooterConfigSchema = new Schema<IFooterConfig>(
  {
    tagline: { type: String, required: true, trim: true },
    copyrightText: { type: String, required: true, trim: true },
    systemStatusText: { type: String, required: true, trim: true },
    systemStatusState: {
      type: String,
      required: true,
      enum: ['operational', 'degraded', 'maintenance'],
      default: 'operational',
    },
    showNavLinks: { type: Boolean, default: true },
    showOpsLinks: { type: Boolean, default: true },
    showSpecializationTags: { type: Boolean, default: true },
    specializationTags: { type: [String], default: [] },
    footerPhotoUrl: { type: String, default: '' },
    showFooterPhoto: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'footer_config',
  }
);

export const FooterConfig = mongoose.model<IFooterConfig>('FooterConfig', FooterConfigSchema);
