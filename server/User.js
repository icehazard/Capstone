const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 _id: {
  type: String,
  required: true,
 },
 apiKey: {
  type: String,
 },
 apiKeySecret: {
  type: String,
 },
 email: {
  type: String,
  required: true,
  max: 255,
  min: 6
 },
 password: {
  type: String,
  required: true,
  max: 255,
  min: 6
 },
 token: {
  type: String
 },
 date: {
  type: Date,
  default: Date.now
 }
})

module.exports = mongoose.model("User", userSchema)