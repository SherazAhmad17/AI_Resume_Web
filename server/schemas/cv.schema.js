import * as z from "zod";

const emptyToNull = (val) => {
  if (val === "") return null;
  return val;
};

const safeDate = (val) => {
  if (!val || val === "") return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const CvSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),

  github: z.preprocess(emptyToNull, z.string().optional()),
  linkedin: z.preprocess(emptyToNull, z.string().optional()),
  summary: z.string().min(1, "Summary is required"),

  label: z.preprocess(emptyToNull, z.string().optional()),
  url: z.preprocess(emptyToNull, z.string().optional()),

  location: z
    .object({
      address: z.preprocess(emptyToNull, z.string().optional()),
      postalCode: z.preprocess(emptyToNull, z.string().optional()),
      city: z.preprocess(emptyToNull, z.string().optional()),
      countryCode: z
        .preprocess(emptyToNull, z.string().length(2, "Country code must be 2 letters (e.g PK)").optional()),
      region: z.preprocess(emptyToNull, z.string().optional())
    })
    .optional(),

  education: z.array(
    z.object({
      degree: z.string().min(1),
      institute: z.string().min(1),
      startDate: z.preprocess(safeDate, z.date().nullable().optional()),
      endDate: z.preprocess(safeDate, z.date().nullable().optional()),
      isCurrent: z.boolean().optional()
    })
  ),

  skills: z.array(z.string()),

  projects: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.preprocess(emptyToNull, z.string().optional()),
        githubLink: z.preprocess(emptyToNull, z.string().optional()),
        liveLink: z.preprocess(emptyToNull, z.string().optional())
      })
    )
    .optional(),

  experience: z.array(
    z.object({
      role: z.string().min(1),
      company: z.string().min(1),
      startDate: z.preprocess(safeDate, z.date().nullable().optional()),
      endDate: z.preprocess(safeDate, z.date().nullable().optional()),
      isCurrent: z.boolean().optional(),
      description: z.preprocess(emptyToNull, z.string().optional())
    })
  ),

  volunteer: z
    .array(
      z.object({
        organization: z.preprocess(emptyToNull, z.string().optional()),
        position: z.preprocess(emptyToNull, z.string().optional()),
        url: z.preprocess(emptyToNull, z.string().optional()),
        startDate: z.preprocess(safeDate, z.date().nullable().optional()),
        endDate: z.preprocess(safeDate, z.date().nullable().optional()),
        summary: z.preprocess(emptyToNull, z.string().optional()),
        highlights: z.array(z.string()).optional()
      })
    )
    .optional(),

  awards: z
    .array(
      z.object({
        title: z.preprocess(emptyToNull, z.string().optional()),
        date: z.preprocess(safeDate, z.date().nullable().optional()),
        awarder: z.preprocess(emptyToNull, z.string().optional()),
        summary: z.preprocess(emptyToNull, z.string().optional())
      })
    )
    .optional(),

  certificates: z
    .array(
      z.object({
        name: z.preprocess(emptyToNull, z.string().optional()),
        date: z.preprocess(safeDate, z.date().nullable().optional()),
        issuer: z.preprocess(emptyToNull, z.string().optional()),
        url: z.preprocess(emptyToNull, z.string().optional())
      })
    )
    .optional(),

  publications: z
    .array(
      z.object({
        name: z.preprocess(emptyToNull, z.string().optional()),
        publisher: z.preprocess(emptyToNull, z.string().optional()),
        releaseDate: z.preprocess(safeDate, z.date().nullable().optional()),
        url: z.preprocess(emptyToNull, z.string().optional()),
        summary: z.preprocess(emptyToNull, z.string().optional())
      })
    )
    .optional(),

  languages: z
    .array(
      z.object({
        language: z.preprocess(emptyToNull, z.string().optional()),
        fluency: z
          .enum(["Native", "Fluent", "Professional", "Conversational", "Basic"])
          .optional()
      })
    )
    .optional(),

  interests: z
    .array(
      z.object({
        name: z.preprocess(emptyToNull, z.string().optional()),
        keywords: z.array(z.string()).optional()
      })
    )
    .optional(),

  references: z
    .array(
      z.object({
        name: z.preprocess(emptyToNull, z.string().optional()),
        reference: z.preprocess(emptyToNull, z.string().optional())
      })
    )
    .optional(),

  templateId: z
    .enum(["american-style", "european-style", "modern-style"])
    .optional()
});

export const createCvSchema = CvSchema;
export const updateCvSchema = CvSchema.partial();
