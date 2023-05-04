const mongoose = require('mongoose');

const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    trim: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    rerquired: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  gender: doc.gender
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
