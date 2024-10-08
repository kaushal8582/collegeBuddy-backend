import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  name: { type: String },
  level: { type: Number, min: 1, max: 100 }
});

const LinkSchema = new mongoose.Schema({
  platform: { type: String },
  url: { type: String }
});

const EducationSchema = new mongoose.Schema({
  year: { type: String },
  degree: { type: String },
  subject: { type: String },
  marks: { type: String }
});

const ExperienceSchema = new mongoose.Schema({
  company: { type: String },
  year: { type: String },
  endDate: { type: String },
  role: { type: String }
});

const ProjectSchema = new mongoose.Schema({
  projectImg:{
    type:String,
    required:true
  },
  projectTitle:{
    type:String,
    required:true,
  },
  projectDesc:{
    type:String,
    required:true,
  },
  projectLiveLink:{
    type:String,
  },
  projectGithubLink:{
    type:String,
  }
},{timestamps:true})

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  about: { type: String,required:true  },
  username:{type:String,required:true ,unique: true,},
  gender: { type: String, required:true },
  city: { type: String,required:true  },
  bio: { type: String,required:true  },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  img: { type: String }, 
  skills: [SkillSchema], 
  links: [LinkSchema], 
  education: [EducationSchema], 
  experiences: [ExperienceSchema] ,
  projects:[ProjectSchema],
  password:{
    type:String,
    required:true
  }
},{timestamps:true});

// Create Profile model
export  const Profile = mongoose.model('Profile', ProfileSchema);


