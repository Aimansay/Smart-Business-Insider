var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

const models = require('./User.model');

var User = models.User;
var Inventory = models.Inventory;


mongoose.connect('mongodb://127.0.0.1:27017/SBI_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB connection error:', err));

//------------------------POST--------------------------------

app.use('/api/users', require('./userRoutes'))

app.post('/addUser', async (req, res) => {

  console.log("Adding new User");

  var userObj = {
    "_id": new mongoose.Types.ObjectId(),
    "firstName": req.body.firstName,
    "businessName": req.body.businessName,
    "username": req.body.username,
    "email": req.body.email,
    "password": req.body.password
  }

  var newUser = new User(userObj);
  try {
    const newSavedUser = await newUser.save();
    res.status(200).json(newSavedUser);
  
  } catch (error) {
    res.status(400).send("Error while saving new User");  
    console.log(error);
  }

});

app.post('/addItem/:id', async (req, res) => {

  console.log("Adding new item in Inventory");

  var itemObj = {
    "_id": new mongoose.Types.ObjectId(),
    "itemName": req.body.itemName,
    "itemCode": req.body.itemCode,
    "itemQuantity": req.body.itemQuantity,
    "itemPurchasePrice": req.body.itemPurchasePrice,
    "itemSellPrice": req.body.itemSellPrice
  }

  try {
    const user = await User.findById(req.params.id);
    user.inventory.push(itemObj);
    const newSavedItem = await user.save();
    
    res.status(200).json(newSavedItem);
  
  } catch (error) {
    res.status(400).send("Error while saving new Item");  
    console.log(error);
  }
});

app.post('/addBill/:id', async (req, res) => {

  console.log("Adding new Bill");

  var billObj = {
    "_id": new mongoose.Types.ObjectId(),
    "itemName": req.body.itemName,
    "itemQuantity": req.body.itemQuantity,
    "itemTotalPurchasePrice": req.body.itemTotalPurchasePrice,
    "itemTotalSellPrice": req.body.itemTotalSellPrice
  }

  try {
    const user = await User.findById(req.params.id);
    const rec = user.record.id(req.params.recordId);
    rec.billing.push(billObj);
    const newSavedBill = await user.save();
    res.status(200).json(newSavedBill);
  
  } catch (error) {
    res.status(400).send("Error while saving new Bill"); 
    console.log(error); 
  }

});

app.post('/addRecord/:id', async (req, res) => {

  console.log("Adding new Record");

  var billObj = {
    "_id": new mongoose.Types.ObjectId(),
    "billCode": req.body.billCode,
    "billing": req.body.selectedItems,
    "totalBill": req.body.totalBill
  }

  try {
    const user = await User.findById(req.params.id);
    user.record.push(billObj);
    const newSavedRecord = await user.save();
    res.status(200).json(newSavedRecord);
  
  } catch (error) {
    res.status(400).send("Error while saving new Record");
    console.log(error);  
  }

});

//--------------------------GET-------------------------------

app.get('/Inventory/:id', async (req, res) => {

  console.log("Getting user Inventory");

  try {
    const user = await User.findById(req.params.id).populate('inventory');

      const inventoryData = user.inventory;
      
      // Perform operations or checks on the inventory data
      console.log('Inventory Length:', inventoryData.length);
    
    //const userInventory = user.inventory;
      res.status(200).json(inventoryData);
  
  } catch (error) {
    res.status(400).send("Error while getting user inventory");  
  }

});

app.get('/Record/:id', async (req, res) => {

  console.log("Getting user Record");
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);

  try {
    //const user = await User.findOne({ _id: req.params.id}, { 'record.billing': 1 });  ---only get bills
  
    // const user = await User.findById(req.params.id, {
    //   'record': { $elemMatch: { itemSaleDate:  { $gte: targetStartDate}} }
    // });    ---first element

    const user = await User.findOne({ _id: req.params.id });
    const records = user.record.filter(record => {
    return (
    record.itemSaleDate >= startDate && 
    record.itemSaleDate < endDate
    );
  }).map(record => {
  return {
    itemSaleDate: record.itemSaleDate,
    totalBill: record.totalBill
  };
});

     res.status(200).json(records);
  
  } catch (error) {
    console.log(error);
    res.status(400).send("Error while getting user record");  
  }

});

app.get('/Billing/:id', async (req, res) => {

  console.log("Getting user Bill");
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);

  try {

  const user = await User.findOne({ _id: req.params.id });
  const bills = user.record.reduce((acc, record) => {
  if (record.itemSaleDate >= startDate && record.itemSaleDate < endDate) {
    acc.push(...record.billing);
  }
  return acc;
}, []);

     res.status(200).json(bills);
  
  } catch (error) {
    console.log(error);
    res.status(400).send("Error while getting user bill");  
  }

});

//---------------------------Update----------------------------
app.put('/updateItem/:id', async (req, res) => {

  console.log("updating user Inventory");
  var itemObj = {
    "itemName": req.body.itemName,
    "itemQuantity": req.body.itemQuantity,
    "itemPurchasePrice": req.body.itemPurchasePrice,
    "itemSellPrice": req.body.itemSellPrice
  }
  try {
    //const user1 = await User.findById(req.params.id);
   // const updatedInventory = await user.findOneAndUpdate({_id: req.body.id}, itemObj, {new: true});
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, "inventory._id": req.body.id },
  { $set: { 'inventory.$.itemName': req.body.itemName, } },
  { new: true },);// Query to find the user and the inventory item with the specified id
    
    res.status(200).json(user.inventory);
  
  } catch (error) {
    res.status(500).send("Error while updating user inventory");
    console.log(error);  
  }
});


app.put('/User/:id', async (req, res) => {

  console.log("updating user");
  try {
    const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, { $set: req.body }, {new: true});
    res.status(200).json(updatedUser);
  
  } catch (error) {
    res.status(500).send("Error while updating user");  
  }
});

app.put('/User/:id/Record/:recordId/Billing/:billId', async (req, res) => {

  console.log("updating bill");
  try {
    const filter = { _id: req.params.id };
const update = {
  $set: { "record.$[recordElem].billing.$[billingElem].itemQuantity": req.body.itemQuantity }
};
const options = {
  arrayFilters: [
    { "recordElem._id": req.params.recordId },
    { "billingElem._id": req.params.billId }
  ],
  new: true
};

const updatedUser = await User.updateOne(filter, update, options);
    
    res.status(200).json(updatedUser);
  
  } catch (error) {
    res.status(500).send("Error while updating bill");  
  }
});

app.put('/User/:id/Record/:recordId', async (req, res) => {

  console.log("updating record");
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, "record._id": req.params.recordId },
  { $set: { 'record.$.totalBill': req.body.totalBill } },
  { new: true },);// Query to find the user and the inventory item with the specified id
    
    res.status(200).json(user.record);
  
  } catch (error) {
    res.status(500).send("Error while updating bill");  
  }
});

//---------------------------DELETE---------------------------
app.delete('/User/:id', async (req, res) => {

  console.log("deleting user");
  try {
    const deletedUser = await User.findOneAndDelete({_id: req.params.id});
    res.status(200).json(deletedUser);
  
  } catch (error) {
    res.status(400).send("Error while deleting user");  
  }
});

app.delete('/Inventory/:id', async (req, res) => {

  console.log("deleting item");
  try {
    const deletedItem = await Inventory.findOneAndDelete({_id: req.params.id});
    res.status(200).json(deletedItem);
  
  } catch (error) {
    res.status(400).send("Error while deleting item");  
  }
});


app.delete('/User/:id/Record/:recordId/Billing/:billId', async (req, res) => {

  console.log("deleting bill");
  try {
    const filter = { _id: req.params.id, "record._id": req.params.recordId };
const update = { $pull: { "record.$.billing": { _id: req.params.billId } } };
const options = { new: true };

const updatedUser = await User.findOneAndUpdate(filter, update, options);



    res.status(200).json(updatedUser);
  
  } catch (error) {
    res.status(400).send("Error while deleting bill");  
  }
});

app.get('/', (req, res) => {
  res.send("Home Page");
});

app.listen(port, () => {
  console.log("App is running on port ", port);
})

// const post = new Post({ title: 'My first post', content: 'Lorem ipsum', user: user._id });
