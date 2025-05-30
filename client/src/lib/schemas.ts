import * as z from 'zod';
import { PropertyTypeEnum } from '@/lib/constants';

export const propertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  pricePerMonth: z.coerce.number().positive().min(0).int(),
  securityDeposit: z.coerce.number().positive().min(0).int(),
  applicationFee: z.coerce.number().positive().min(0).int(),
  cleaningFee: z.coerce.number().positive().min(0).int(),
  isPetsAllowed: z.boolean(),
  isParkingIncluded: z.boolean(),
  photoUrls: z.array(z.instanceof(File)).optional(),
  amenities: z.string().min(1, 'Amenities are required'),
  highlights: z.string().min(1, 'Highlights are required'),
  beds: z.coerce.number().positive().min(0).max(10).int(),
  baths: z.coerce.number().positive().min(0).max(10).int(),
  squareFeet: z.coerce.number().int().positive(),
  propertyType: z
    .nativeEnum(PropertyTypeEnum)
    .default(PropertyTypeEnum.Apartment),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

// Schema for editing, where photos are optional
export const propertyEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  pricePerMonth: z.coerce.number().positive().min(0).int(),
  securityDeposit: z.coerce.number().positive().min(0).int(),
  applicationFee: z.coerce.number().positive().min(0).int(),
  cleaningFee: z.coerce.number().positive().min(0).int(),
  isPetsAllowed: z.boolean(),
  isParkingIncluded: z.boolean(),
  photoUrls: z
    .union([z.array(z.instanceof(File)), z.array(z.string())])
    .optional(),
  amenities: z.string().min(1, 'Amenities are required'),
  highlights: z.string().min(1, 'Highlights are required'),
  beds: z.coerce.number().positive().min(0).max(10).int(),
  baths: z.coerce.number().positive().min(0).max(10).int(),
  squareFeet: z.coerce.number().int().positive(),
  propertyType: z
    .nativeEnum(PropertyTypeEnum)
    .default(PropertyTypeEnum.Apartment),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
export type PropertyEditFormData = z.infer<typeof propertyEditSchema>;

export const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  occupation: z.string().min(1, 'Occupation is required'),
  annualIncome: z.coerce
    .number()
    .positive('Annual income must be positive')
    .min(1, 'Annual income is required')
    .default(0),
  message: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
