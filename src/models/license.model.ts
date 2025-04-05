import { Schema, model } from 'mongoose';

const licenseSchema = new Schema({
  // Define your schema fields here
  name: { type: String, required: true },
  // Add other fields as needed
});

export default model('License', licenseSchema); 