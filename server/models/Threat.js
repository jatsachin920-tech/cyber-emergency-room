const mongoose = require("mongoose");

const ThreatSchema = new mongoose.Schema(
  {
    textSnippet: { 
      type: String, 
      required: true 
    }, 
    
    threatType: { 
      type: String, 
      required: true 
    }, 
    
    confidenceScore: { 
      type: Number, 
      required: true 
    }, 
    
    language: { 
      type: String, 
      default: "english" 
    }, 
    
    status: { 
      type: String, 
      default: "active" 
    } 
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Threat", ThreatSchema);