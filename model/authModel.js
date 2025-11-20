const mongoose = require('mongoose');

// Sub-schema for Social Links
const socialLinksSchema = new mongoose.Schema({
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    instagram: { type: String, default: '' },
    website: { type: String, default: '' }
}, { _id: false });

// Sub-schema for Work Experience
const workExperienceSchema = new mongoose.Schema({
    role: { type: String },
    company: { type: String },
    duration: { type: String },
    description: { type: String }
}, { _id: false });

// Sub-schema for Education
const educationSchema = new mongoose.Schema({
    degree: { type: String },
    institution: { type: String },
    year: { type: String }
}, { _id: false });

// Sub-schema for Portfolio Projects
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, default: 'General' },
    year: { type: String },
    description: { type: String },
    link: { type: String }
});

const authSchema = new mongoose.Schema({
    username: { 
        type: String, 
        unique: true, 
        sparse: true,
        trim: true,
        lowercase: true,
        minlength: 3
    },
    // --- NEW: Track username changes for limits ---
    usernameHistory: [{
        username: { type: String },
        changedAt: { type: Date, default: Date.now }
    }],
    
    firstName: { type: String, required: false, default: '' },
    lastName: { type: String, required: false, default: '' },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false, default: '' },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    
    // --- Profile Fields ---
    professionalTitle: { type: String, default: '' },
    currentLocation: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 600 },
    
    // --- Images ---
    avatarUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },

    // --- Links ---
    portfolioLink: { type: String, default: '' }, 
    socialLinks: { type: socialLinksSchema, default: () => ({}) },

    // --- Resume Data ---
    skills: [{ type: String }], 
    languages: [{ type: String }],
    interests: [{ type: String }],
    
    workExperience: [workExperienceSchema],
    education: [educationSchema],
    
    // --- Portfolio Projects ---
    projects: [projectSchema],

    // Legacy/System fields
    yearOfGraduation: { type: String, default: '' },
    nameOfOrganisation: { type: String, default: '' },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isVerified: { type: Boolean, default: false },
    registeredCompetitions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competition' }],
    savedBlogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    savedTools: [{ type: String }]

}, { timestamps: true });

module.exports = mongoose.models.Auth || mongoose.model('Auth', authSchema);