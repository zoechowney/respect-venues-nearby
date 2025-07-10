import { z } from 'zod';

// Enhanced password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Email validation with additional security
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')
  .max(254, 'Email address too long')
  .refine((email) => !email.includes('+'), 'Plus addressing not allowed for security')
  .refine((email) => {
    const domain = email.split('@')[1];
    return domain && !domain.includes('tempmail') && !domain.includes('10minute');
  }, 'Temporary email addresses not allowed');

// Phone validation
export const phoneSchema = z
  .string()
  .optional()
  .refine((phone) => {
    if (!phone) return true;
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
  }, 'Please enter a valid phone number');

// URL validation with security checks
export const urlSchema = z
  .string()
  .optional()
  .refine((url) => {
    if (!url) return true;
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }, 'Please enter a valid URL starting with http:// or https://');

// Text sanitization schema
export const sanitizedTextSchema = z
  .string()
  .min(1, 'Text is required')
  .max(500, 'Text too long')
  .transform((str) => str.trim())
  .refine((str) => !/<script/i.test(str), 'Script tags not allowed')
  .refine((str) => !/<iframe/i.test(str), 'Iframe tags not allowed')
  .refine((str) => !/javascript:/i.test(str), 'JavaScript URLs not allowed');

// Business name validation
export const businessNameSchema = z
  .string()
  .min(2, 'Business name must be at least 2 characters')
  .max(100, 'Business name must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s&'.-]+$/, 'Business name contains invalid characters');

// Contact name validation  
export const contactNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Address validation
export const addressSchema = z
  .string()
  .min(10, 'Please enter a complete address')
  .max(200, 'Address too long')
  .refine((addr) => /\d/.test(addr), 'Address must contain a number');

// Review content validation
export const reviewContentSchema = z
  .string()
  .max(1000, 'Review must be less than 1000 characters')
  .transform((str) => str.trim())
  .refine((str) => !/<script/i.test(str), 'Script tags not allowed')
  .optional();

// File upload validation
export const fileUploadSchema = z
  .object({
    file: z.instanceof(File),
    maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
    allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp'])
  })
  .refine(({ file, maxSize }) => file.size <= maxSize, 'File size too large')
  .refine(({ file, allowedTypes }) => allowedTypes.includes(file.type), 'File type not allowed');

// Rate limiting validation
export const rateLimitSchema = z.object({
  action: z.string(),
  identifier: z.string(),
  windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
  maxAttempts: z.number().default(5)
});

// Venue application schema with enhanced validation
export const venueApplicationSchema = z.object({
  businessName: businessNameSchema,
  businessType: z.string().min(1, 'Business type is required'),
  contactName: contactNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema,
  website: urlSchema,
  description: z.string().max(500, 'Description too long').transform(str => str.trim()).optional(),
  signStyle: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  agreeToTraining: z.boolean().refine(val => val === true, 'You must agree to the training')
});

// Review submission schema
export const reviewSubmissionSchema = z.object({
  venueId: z.string().uuid('Invalid venue ID'),
  rating: z.number().min(1, 'Rating required').max(5, 'Rating must be between 1-5'),
  reviewText: reviewContentSchema
});

// Contact form schema
export const contactFormSchema = z.object({
  name: contactNameSchema,
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject too long').transform(str => str.trim()),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long').transform(str => str.trim())
});

// Sponsor application schema
export const sponsorApplicationSchema = z.object({
  companyName: businessNameSchema,
  contactName: contactNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  website: urlSchema,
  message: z.string().max(500, 'Message too long').transform(str => str.trim()).optional()
});