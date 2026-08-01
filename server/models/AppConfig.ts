import mongoose, { Schema, Document } from 'mongoose';

export interface IAppConfig extends Document {
  passkeyHash: string;
  updatedAt: Date;
}

const AppConfigSchema = new Schema<IAppConfig>({
  passkeyHash: { type: String, required: true },
}, {
  timestamps: true,
  collection: 'appconfigs',
});

export const AppConfig = mongoose.model<IAppConfig>('AppConfig', AppConfigSchema);
