const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const userModels = require('../User.model');
var mongoose = require('mongoose');
require('dotenv').config();
const nodemailer = require('nodemailer');

var User = userModels.User;


//@route POST /api/users
const registerUser = asyncHandler(async (req, res) => {
    const {firstName, businessName, username, email, password, confirmPassword} = req.body

    if(!firstName || !username || !email || !password || !confirmPassword){
        res.status(400);

        throw new Error('Please add all fields')
    }

    if(password !== confirmPassword){
        res.status(400)
        throw new Error('password not same')
    }

    //check user exists
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(410).json("User Already exists")
        throw new Error('User already exists')
    }

    const usernameExists = await User.findOne({username})
    if(usernameExists){
      res.status(410).json("User Already exists")
        throw new Error('User already exists')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        _id: new mongoose.Types.ObjectId(),
        firstName,
        businessName,
        username,
        email,
        password: hashedPassword
    })

    if(user){
        res.status(201).json({
            userId: user.id,
            token: generateToken(user._id),
            username: user.username,
            email: user.email,
            businessName: user.businessName
        })

    }
    else{
        res.status(400)
        throw new Error('invalid user data')
    }
})


//@route POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password} = req.body

    if( !email || !password ){
        res.status(400);
        throw new Error('Please add all fields')
    }

    const user = await User.findOne({
        $or: [
          { username: email },
          { email: email }
        ]
      });
   // const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            userId: user.id,
            token: generateToken(user._id),
            username: user.username,
            email: user.email,
            businessName: user.businessName
        })
        
    } else{
        res.status(400)
        throw new Error('invalid credentials')
    }
})


//@route POST /api/users/addItem/:id
const addItem = asyncHandler(async (req, res) => {
    console.log("Adding new item in Inventory");

  var itemObj = {
    "_id": new mongoose.Types.ObjectId(),
    "barcode": req.body.barcode,
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
})
 
//@route GET /api/users/Inventory/:id
const getInventory = asyncHandler(async (req, res) => {
    console.log("Getting user Inventory");

    const user = await User.findById(req.params.id).select('inventory').populate('inventory');
    if(user.inventory){
      const inventoryData = user.inventory;
      //const userInventory = user.inventory;
      res.status(200).json(inventoryData);
    }
    else{
      throw new Error("empty inventory")
    }
      
})

//@route PUT /api/users/updateItem/:id
const updateItem = asyncHandler(async (req, res) => {
    console.log("updating user Inventory");
  var itemObj = {
    "itemName": req.body.itemName,
    "itemQuantity": req.body.itemQuantity,
    "itemPurchasePrice": req.body.itemPurchasePrice,
    "itemSellPrice": req.body.itemSellPrice,
    "itemCode": req.body.newItemCode
  }
  try {
    console.log(itemObj.itemCode);
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, "inventory.itemCode":  itemObj.itemCode},
    { $set: { 'inventory.$.itemName': itemObj.itemName,
             'inventory.$.itemQuantity': itemObj.itemQuantity,
             'inventory.$.itemPurchasePrice': itemObj.itemPurchasePrice,
             'inventory.$.itemSellPrice': itemObj.itemSellPrice
            } },
    { new: true },);// Query to find the user and the inventory item with the specified id
    
    res.status(200).json(user.inventory);
  
  } catch (error) {
    res.status(500).send("Error while updating user inventory");
    console.log(error);  
  }
  
})

//@route DELETE /api/users/removeItem/:id
const deleteItem = asyncHandler(async (req, res) => {
  try {
    console.log("deleting item");
    var itemObj = {
  
      "itemCode": req.body.index
      
    }
    
    const filter = { _id: req.params.id };
      console.log(itemObj.itemCode)
      const update = { $pull: { inventory: { itemCode: itemObj.itemCode } } };
      const options = { new: true };
  
      const updatedUser = await User.findOneAndUpdate(filter, update, options);
    console.log(updatedUser)
     res.json(updatedUser)
  } catch (error) {
    console.log(error)
  }
 
    
})


//@route POST /api/users/:id/addBill/:recordId
// const addBill = asyncHandler(async (req, res) => {
//   console.log("Adding new Bill");

//   var itemObj = {
//     "_id": new mongoose.Types.ObjectId(),
//     "itemName": req.body.itemName,
//     "itemQuantity": req.body.itemQuantity,
//     "itemTotalPurchasePrice": req.body.itemTotalPurchasePrice,
//     "itemTotalSellPrice": req.body.itemTotalSellPrice
//   }

//     const user = await User.findById(req.params.id);
//     const rec = user.record.id(req.params.recordId);
//     rec.billing.push(itemObj);
//     const newSavedBill = await user.save();
//     res.status(200).json(newSavedBill);
// })

//@route POST /api/users/:id/addBill/:recordId
const addBill = asyncHandler(async (req, res) => {
  console.log("Adding new Bill");

  var billObj = {
    "_id": new mongoose.Types.ObjectId(),
    "billCode": req.body.billCode,
    "billing": req.body.newArray,
    "totalBill": req.body.totalBill,
    //"itemSaleDate": new Date("2022-12-17T15:35:34.000Z")
  }
    console.log(billObj.billCode);
    const user = await User.findById(req.params.id);
    user.record.push(billObj);
    const newSavedRecord = await user.save();
    res.status(200).json(newSavedRecord);
  
})

//@route POST /api/users/:id/addBill/:recordId
const getBills = asyncHandler(async (req, res) => {
  console.log("Getting user Bill");
  
const startDate = new Date(req.query.startDate);
const endDate = new Date(req.query.endDate);

console.log(startDate);
console.log(endDate);

const user = await User.findOne({ _id: req.params.id });
const bills = user.record.reduce((acc, record) => {
  if (record.itemSaleDate >= startDate && record.itemSaleDate < endDate) {
    const bill = {
      billCode: record.billCode,
       _id: record._id,
       billing: record.billing,
       itemSaleDate: record.itemSaleDate,
       totalBill: record.totalBill,
    };
    acc.push(bill);
  }
  return acc;
},[]);
res.status(200).json(bills);
})


//@route POST /api/users/:id/addBill/:recordId
const getAllBills = asyncHandler(async (req, res) => {
  console.log("Getting user Bill");
  
const user = await User.findOne({ _id: req.params.id });
const bills = user.record.reduce((acc, record) => {
    const bill = {
      billCode: record.billCode,
       _id: record._id,
       billing: record.billing,
       itemSaleDate: record.itemSaleDate,
       totalBill: record.totalBill,
    };
    acc.push(bill);
  return acc;
},[]);
res.status(200).json(bills);

})

//@route
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  console.log(email)
  if(newPassword !== confirmPassword){
    res.status(400)
    throw new Error('password not same')
}

  const user = await User.findById(req.params.id)
  console.log(user.password)

  if(user && (await bcrypt.compare(oldPassword, user.password))){

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    res.status(200).json(updatedUser)
    
} else{
    res.status(400)
    throw new Error('invalid credentials')
}
})

//@route
const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body
  console.log(email)
  // Generate JWT token
function generateToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
}
  //check user exists
  const userExists = await User.findOne({email})
  if(userExists){
      
      const code = Math.floor(100000 + Math.random() * 900000); // Generate a random code

     const token = generateToken({ email, code });
    
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Confirmation Code',
    html: `<h1>Confirmation Code</h1><p>Your confirmation code is: ${code}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully', token });
    }
  });
  }
  else{
      res.status(400)
      throw new Error('User does not exists')
  }

})


//@route
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword} = req.body
  console.log(oldPassword)
  if(newPassword !== confirmPassword){
    res.status(400)
    throw new Error('password not same')
}

  const user = await User.findById(req.params.id)
  console.log(user.password)

  if(user && (await bcrypt.compare(oldPassword, user.password))){

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    res.status(200).json(updatedUser)
    
} else{
    res.status(400)
    throw new Error('invalid credentials')
}
})

//@route
const newPassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword} = req.body

  if( !newPassword || !confirmPassword){
    res.status(400);
    throw new Error('Please add all fields')
}

  if(newPassword !== confirmPassword){
    res.status(400)
    throw new Error('password not same')
}

  const user = await User.findById(req.params.id)

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    res.status(200).json(updatedUser)
    

})


//@route
const changeUsername = asyncHandler(async (req, res) => {
  const { username } = req.body
  console.log(username)

const updatedUser = await User.findOneAndUpdate(
  { _id: req.params.id },
  { $set: { username: username } },
  { new: true }
);

res.status(200).json("Updated Email")

})

//@route
const changeEmail = asyncHandler(async (req, res) => {
  const { email } = req.body

const updatedUser = await User.findOneAndUpdate(
  { _id: req.params.id },
  { $set: { email: email } },
  { new: true }
);

res.status(200).json("Updated Email")

})

//@route GET /api/users/me
const getMe = asyncHandler(async (req, res) => {
    const {_id, username, email} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        username,
        email
    })
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    addItem,
    getInventory,
    updateItem,
    deleteItem,
    addBill,
    getBills,
    getAllBills,
    changePassword,
    changeUsername,
    changeEmail,
    forgetPassword,
    verifyEmail,
    newPassword,
    getMe
}