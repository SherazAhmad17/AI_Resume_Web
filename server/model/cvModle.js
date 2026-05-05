import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  name: { type: String, trim: true },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
  },

  phone: { type: String, trim: true },
  github: { type: String, trim: true },
  linkedin: { type: String, trim: true },

  summary: { type: String },
  label: { type: String, trim: true },
  url: { type: String, trim: true },

  // 🌍 LOCATION
  location: {
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    city: { type: String, trim: true },
    countryCode: {
      type: String,
      trim: true,
      maxlength: 2
    },
    region: { type: String, trim: true }
  },

  // 🎓 EDUCATION
  education: [
    {
      degree: { type: String, required: true },
      institute: { type: String, required: true },

      // 🔥 FIXED: STRING → DATE
      startDate: { type: Date },
      endDate: { type: Date },

      isCurrent: { type: Boolean, default: false }
    }
  ],

  // 🧠 SKILLS
  skills: {
    type: [String],
    default: []
  },

  // 🚀 PROJECTS
  projects: [
    {
      title: { type: String, required: true },
      description: { type: String },
      githubLink: { type: String, trim: true },
      liveLink: { type: String, trim: true }
    }
  ],

  // 💼 EXPERIENCE
  experience: [
    {
      role: { type: String, required: true },
      company: { type: String, required: true },

      // 🔥 FIXED: STRING → DATE
      startDate: { type: Date },
      endDate: { type: Date },

      isCurrent: { type: Boolean, default: false },
      description: { type: String }
    }
  ],

  // 🤝 VOLUNTEER
  volunteer: [
    {
      organization: { type: String },
      position: { type: String },
      url: { type: String },

      startDate: { type: Date },
      endDate: { type: Date },

      summary: { type: String },
      highlights: [{ type: String }]
    }
  ],

  // 🏆 AWARDS
  awards: [
    {
      title: { type: String },

      // 🔥 FIXED
      date: { type: Date },

      awarder: { type: String },
      summary: { type: String }
    }
  ],

  // 📜 CERTIFICATES
  certificates: [
    {
      name: { type: String },

      // 🔥 FIXED
      date: { type: Date },

      issuer: { type: String },
      url: { type: String }
    }
  ],

  // 📚 PUBLICATIONS
  publications: [
    {
      name: { type: String },
      publisher: { type: String },

      // 🔥 FIXED
      releaseDate: { type: Date },

      url: { type: String },
      summary: { type: String }
    }
  ],

  // 🌐 LANGUAGES
  languages: [
    {
      language: { type: String },

      fluency: {
        type: String,
        enum: [
          "Native",
          "Fluent",
          "Professional",
          "Conversational",
          "Basic"
        ]
      }
    }
  ],

  // ❤️ INTERESTS
  interests: [
    {
      name: { type: String },
      keywords: [{ type: String }]
    }
  ],

  // 📌 REFERENCES
  references: [
    {
      name: { type: String },
      reference: { type: String }
    }
  ],

  // 👤 USER
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🎨 TEMPLATE
  templateId: {
    type: String,
    default: "american-style",
    enum: [
      "american-style",
      "european-style",
      "modern-style"
    ]
  },

  // 🖼️ PROFILE IMAGE
  profileImage: {
    secure_url: { type: String },
    public_id: { type: String }
  },

  // ➕ EXTRA SECTIONS
  additionalSections: [
    {
      title: { type: String, required: true },
      details: { type: String, required: true }
    }
  ]
}, { timestamps: true });

const Cv = mongoose.model("Cv", cvSchema);

export default Cv;