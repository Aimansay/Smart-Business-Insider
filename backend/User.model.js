var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var inventorySchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
      barcode: {
        type: String,
        required: false,
      },
      itemName: {
        type: String,
        required: true
      },
      itemCode: {
        type: String,
        required: true
      },
      itemQuantity: {
        type: Number,
        required: true
      },
      itemSellPrice: {
        type: Number,
        required: true,
      },
      itemPurchasePrice: {
          type: Number,
          required: true,
        }
});

var billingSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  itemName: {
    type: String,
    required: true
  },
    itemQuantity: {
      type: Number,
      required: true
    },
    itemTotalSellPrice: {
      type: Number,
      required: true,
    },
    itemTotalPurchasePrice: {
        type: Number,
        required: true,
      }
});

var recordSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  billCode:{
    type: Number,
    required: true,
  },
  itemSaleDate: {
        type: Date,
        default: Date.now
  },
  billing: [billingSchema],
  totalBill: {
    type: Number,
    required: true,
    default: 0
  },
});


var userSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
      },
      businessName: {
        type: String
      },
      username: {
        type: String,
        required: true,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      inventory: [inventorySchema],
      record: [recordSchema]
  });

const User = mongoose.model('User', userSchema);  
const Inventory = mongoose.model('Inventory', inventorySchema);
const Billing = mongoose.model('Billing', billingSchema);
const Record = mongoose.model('Record', recordSchema);

module.exports = {
  User: User,
  Inventory: Inventory,
  Billing: Billing,
  Record: Record
}