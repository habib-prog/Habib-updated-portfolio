import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  photoUrl: string;
  email: string;
  phone?: string;
  location: string;
  responseSla: string;
  githubUrl: string;
  linkedinUrl: string;
  mediumUrl?: string;
  twitterUrl?: string;
  skills: string[];
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    responseSla: { type: String, default: '< 12 Hours SLA' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    mediumUrl: { type: String },
    twitterUrl: { type: String },
    skills: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: 'profiles',
  }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
