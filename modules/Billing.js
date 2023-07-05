import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Text, TextInput, StyleSheet, Image, Dimensions, ImageBackground, Linking} from 'react-native';
import {Feather} from "@expo/vector-icons";
import NaviagtionScreen from './NavigationScreen';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchFilter from './SearchFilter';
import { SwipeListView } from 'react-native-swipe-list-view';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height; 


const Billing = () => {

  const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [barcodeClicked, setBarcodeClicked] = useState(false);
    const [canScan, setCanScan] = useState(true);

    const askForCameraPermission = () => {
      (async () => {
          const {status} = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status == 'granted')
      })()
    }

    const handleBarCodeScanned = ({ type, data }) => {
      console.log(canScan);
      if (canScan) {
        console.log("Scanning")
        // setScanned(true);
        setBarcode(data);
        // setBarcodeClicked(false);
        console.log('Type: ' + type + '\nData: ' + data);
        const foundItem = items.find(item => item.barcode === data);
        if (selectedItems.some(item => item.itemCode === foundItem.itemCode)) {
          const itemFound = selectedItems.find(item => item.barcode === data);
          itemFound.itemQuantity++;
        } else {
          const newItem = {
            barcode: foundItem.barcode,
            itemName: foundItem.itemName,
            itemCode: foundItem.itemCode,
            itemQuantity: 1,
            itemSellPrice: foundItem.itemSellPrice,
            itemPurchasePrice: foundItem.itemPurchasePrice
          };
          selectedItems.push(newItem);
        }
  
        // Disable scanning for the specified duration
        setCanScan(false);
        setTimeout(() => {
          setCanScan(true);
        }, 3000); // 3000 milliseconds = 3 seconds
      }
    };

  useEffect(() => {
    getInventory();
    handleGetBills();
  }, []);

  const handleGetBills = async () => {
    console.log("getting all")
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');

      const response = await axios.get(`${ip}:3000/api/users/${userId}/allBills`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }});
        const n = response.data.length;
      setBillCode(n+1);
      console.log(billCode);
    } catch (error) {
       console.log(error)
    }   
  }

  // const initiateWhatsApp = async () => {

  //   if (customerNumber.length==11){
  //   var totalBill = 0;
  //   const billString = selectedItems
  //     .map(({ itemCode, itemName, itemQuantity, itemSellPrice }) => {
  //       const totalPrice = itemQuantity * itemSellPrice;
  //       totalBill += totalPrice;
  //       return `${itemCode} - ${itemName} - Quantity: ${itemQuantity} - Total Price: ${totalPrice}`;
  //     })
  //     .join('\n');
  //   const whatsappMessage =
  //     "Date: " + new Date() + "\nItems:\n" + billString + "\nTotal Bill: " + totalBill;
  //   if (customerNumber.length !== 11) {
  //     alert('Please insert correct WhatsApp number');
  //     return;
  //   }
  //   var invoiceHtml = `
  //   <!DOCTYPE html>
  //   <html>
  //   <head>
  //     <title>Invoice Template Design</title>
  //     <style>
  //       :root {
  //         --primary: rgb(94, 93, 93);
  //         --secondary: #3d3d3d; 
  //         --white: #fff;
  //       }
    
  //       * {
  //         margin: 0;
  //         padding: 0;
  //         box-sizing: border-box;
  //         font-family: 'Lato', sans-serif;
  //       }
    
  //       body {
  //         background: var(--secondary);
  //         padding: 50px;
  //         color: var(--secondary);
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         font-size: 14px;
  //       }
    
  //       .bold {
  //         font-weight: 900;
  //       }
    
  //       .light {
  //         font-weight: 100;
  //       }
    
  //       .wrapper {
  //         background: var(--white);
  //         padding: 30px;
  //       }
    
  //       .invoice_wrapper {
  //         border: 3px solid var(--primary);
  //         width: 700px;
  //         max-width: 100%;
  //       }
    
  //       .invoice_wrapper .header .logo_invoice_wrap,
  //       .invoice_wrapper .header .bill_total_wrap {
  //         display: flex;
  //         justify-content: space-between;
  //         padding: 30px;
  //       }
    
  //       .invoice_wrapper .header .logo_sec {
  //         display: flex;
  //         align-items: center;
  //       }
    
  //       .invoice_wrapper .header .logo_sec .title_wrap {
  //         margin-left: 5px;
  //       }
    
  //       .invoice_wrapper .header .logo_sec .title_wrap .title {
  //         text-transform: uppercase;
  //         font-size: 18px;
  //         color: var(--primary);
  //       }
    
  //       .invoice_wrapper .header .logo_sec .title_wrap .sub_title {
  //         font-size: 12px;
  //       }
    
  //       .invoice_wrapper .header .invoice_sec,
  //       .invoice_wrapper .header .bill_total_wrap .total_wrap {
  //         text-align: right;
  //       }
    
  //       .invoice_wrapper .header .invoice_sec .invoice {
  //         font-size: 28px;
  //         color: var(--primary);
  //       }
    
  //       .invoice_wrapper .header .invoice_sec .invoice_no,
  //       .invoice_wrapper .header .invoice_sec .date {
  //         display: flex;
  //         width: 100%;
  //       }
    
  //       .invoice_wrapper .header .invoice_sec .invoice_no span:first-child,
  //       .invoice_wrapper .header .invoice_sec .date span:first-child {
  //         width: 70px;
  //         text-align: left;
  //       }
    
  //       .invoice_wrapper .header .invoice_sec .invoice_no span:last-child,
  //       .invoice_wrapper .header .invoice_sec .date span:last-child {
  //         width: calc(100% - 70px);
  //       }
    
  //       .invoice_wrapper .header .bill_total_wrap .total_wrap .price,
  //       .invoice_wrapper .header .bill_total_wrap .bill_sec .name {
  //         color: var(--primary);
  //         font-size: 20px;
  //       }
    
  //       .invoice_wrapper .body .main_table .table_header {
  //         background: var(--primary);
  //       }
    
  //       .invoice_wrapper .body .main_table .table_header .row {
  //         color: var(--white);
  //         font-size: 18px;
  //         border-bottom: 0px;	
  //       }
    
  //       .invoice_wrapper .body .main_table .row {
  //         display: flex;
  //         border-bottom: 1px solid var(--secondary);
  //       }
    
  //       .invoice_wrapper .body .main_table .row .col {
  //         padding: 10px;
  //       }
  //       .invoice_wrapper .body .main_table .row .col_no { width: 5%; }
  //       .invoice_wrapper .body .main_table .row .col_des { width: 45%; }
  //       .invoice_wrapper .body .main_table .row .col_price { width: 20%; text-align: center; }
  //       .invoice_wrapper .body .main_table .row .col_qty { width: 10%; text-align: center; }
  //       .invoice_wrapper .body .main_table .row .col_total { width: 20%; text-align: right; }
    
  //       .invoice_wrapper .body .paymethod_grandtotal_wrap {
  //         display: flex;
  //         justify-content: space-between;
  //         padding: 5px 0 30px;
  //         align-items: flex-end;
  //       }
    
  //       .invoice_wrapper .body .paymethod_grandtotal_wrap .paymethod_sec {
  //         padding-left: 30px;
  //       }
    
  //       .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec {
  //         margin-top: 15%;
  //         width: 30%;
  //       }
    
  //       .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p {
  //         display: flex;
  //         width: 100%;
  //         padding-bottom: 5px;
  //       }
    
  //       .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span {
  //         padding: 0 10px;
  //       }
    
  //       .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span:first-child {
  //         width: 60%;
  //       }
    
  //       .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span:last-child {
  //         width: 40%;
  //         text-align: right;
  //       }
    
  //       .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p:last-child span {
  //         background: var(--primary);
  //         padding: 10px;
  //         color: #fff;
  //       }
  //     </style>
  //   </head>
  //   <body>
    
  //   <div class="wrapper">
  //     <div class="invoice_wrapper">
  //       <div class="header">
  //         <div class="logo_invoice_wrap">
  //           <div class="logo_sec">
  //             <div class="title_wrap">
  //               <p class="title bold">Coding Boss</p>
  //               <p class="sub_title">Privite Limited</p>
  //             </div>
  //           </div>
  //           <div class="invoice_sec">
  //             <p class="invoice bold">INVOICE</p>
  //             <p class="invoice_no">
  //               <span class="bold">Invoice</span>
  //               <span>#3488</span>
  //             </p>
  //             <p class="date">
  //               <span class="bold">Date</span>
  //               <span>08/Jan/2022</span>
  //             </p>
  //           </div>
  //         </div>
  //         <div class="bill_total_wrap">
  //           <div class="bill_sec">
  //             <p>Bill To</p> 
  //                   <p class="bold name">${customerName}</p>
  //                 <span>
  //                    ${customerNumber}
  //                 </span>
  //           </div>
  //         </div>
  //       </div>
  //       <div class="body">
  //         <div class="main_table">
  //           <div class="table_header">
  //             <div class="row">
  //               <div class="col col_no">NO.</div>
  //                 <div class="col col_des">ITEM DESCRIPTION</div>
  //                 <div class="col col_price">PRICE</div>
  //                 <div class="col col_qty">QTY</div>
  //                 <div class="col col_total">TOTAL</div>
  //               </div>
  //             </div>
  //             <div class="table_body">
  //               ${selectedItems.map((item, index) => `
  //                 <div class="row">
  //                   <div class="col col_no">
  //                     <p>${index + 1}</p>
  //                   </div>
  //                   <div class="col col_des">
  //                     <p class="bold">${item.itemName}</p>
  //                   </div>
  //                   <div class="col col_price">
  //                     <p>${item.itemSellPrice}</p>
  //                   </div>
  //                   <div class="col col_qty">
  //                     <p>${item.itemQuantity}</p>
  //                   </div>
  //                   <div class="col col_total">
  //                     <p>${item.itemSellPrice * item.itemQuantity}</p>
  //                   </div>
  //                 </div>
  //               `).join('')}
  //             </div>
  //           </div>
  //           <div class="paymethod_grandtotal_wrap">
  //             <div class="paymethod_sec">
  //               <p class="bold">Payment Method</p>
  //               <p>Visa, master Card and We accept Cheque</p>
  //             </div>
  //             <div class="grandtotal_sec">
  //                    <p class="bold">
  //                       <span>Grand Total</span>
  //                       <span>Rs.${totalBill}</span>
  //                   </p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </body>
  //   </html>`;

  //   const options = {
  //     html: invoiceHtml,
  //     fileName: 'invoice',
  //     directory: 'Documents',
  //   };
  //   const file = await printToFileAsync({
  //     html: invoiceHtml,
  //     base64:false
  //   });
  //   const pdfName = `${file.uri.slice(
  //     0,
  //     file.uri.lastIndexOf('/') + 1
  //   )}invoice.pdf`;
  //   await FileSystem.moveAsync({
  //     from: file.uri,
  //     to: pdfName,
  //   });
  //   console.log(file);
  //   // await shareAsync(pdfName);

  //   // Get the absolute path of the generated PDF file
  //   // const absolutePath = `file://${pdfFilePath.filePath}`;

  //   let url = 'whatsapp://send?phone=92' + customerNumber.toString().substring(1) + '&file=' + pdfName;
  //   Linking.canOpenURL(url)
  //     .then((supported) => {
  //       if (supported) {
  //         return Linking.openURL(url);
  //       } else {
  //         throw new Error('WhatsApp is not installed on your device');
  //       }
  //     })
  //     .then((data) => {
  //     })
  //     .catch((error) => {
  //       alert(error.message);
  //     });
  //     Alert.alert('Success!', 'Bill Successfully Delivered!', [{ text: 'Ok' }]);
  //   } else {
  //     Alert.alert("Error","Invalid Number");
  //   }
  // };

  const initiateWhatsApp = () => {
    var totalBill = 0;
    console.log(selectedItems);
    const billString = selectedItems
      .map(({ itemCode, itemName, itemQuantity, itemSellPrice }) => {
        const totalPrice = itemQuantity * itemSellPrice;
        totalBill += totalPrice;
        return `${itemCode}. ${itemName} - Quantity: ${itemQuantity} - Total Price: ${totalPrice}\n`;
      })
      .join('\n');
      var date = new Date().toString();
      console.log(date);
      date = date.split(" ")[0] + " " + date.split(" ")[1] + " " + date.split(" ")[2] + " " + date.split(" ")[3];
    const whatsappMessage =
      "Date: " + date + "\n\nItems:\n" + billString + "\n\nTotal Bill: " + totalBill + "\n\nPayment Link: https://buy.stripe.com/test_eVa2cf2p2fcr8zS6oo" ;
    if (customerNumber.length !== 11) {
      alert('Please insert correct WhatsApp number');
      return;
    }
    let url = 'whatsapp://send?text=' + encodeURIComponent(whatsappMessage) + '&phone=92' + customerNumber.toString().substring(1);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          throw new Error('WhatsApp is not installed on your device');
        }
      })
      .then((data) => {
      })
      .catch((error) => {
        alert(error.message);
      });
      Alert.alert('Success!', 'Bill Successfully Delivered!', [{ text: 'Ok' }]);
  };

  const handleEditItemQuantity = async (newItemCode, itemName, itemQuantity, itemPurchasePrice, itemSellPrice) => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    const ip = await AsyncStorage.getItem('ip');
      console.log("editing item")
    try {
      const response = await axios.put(`${ip}:3000/api/users/${userId}/updateItem`, {
       newItemCode, itemName, itemQuantity, itemPurchasePrice, itemSellPrice
    }, {
     headers: {
       'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
     },
   })  
       console.log(response.data)
         
     } catch (error) {
        console.log(error)
     }
  };


  const [items, setItems] = useState([]);
  const [billCode, setBillCode] = useState(1);

  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState();
  const [clicked, setClicked] = useState(false)
  const [input, setInput] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  const handleNavigation = useCallback(() => {
    if (showMenu) setShowMenu(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', handleNavigation);
    return unsubscribe;
  }, [navigation, handleNavigation]);

  async function getInventory() {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    const ip = await AsyncStorage.getItem('ip');
    try {
     const response = await axios.get(`${ip}:3000/Inventory/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
     const inventoryData = response.data;
     const newArray = inventoryData.map(({ _id, barcode, itemName, itemCode, itemQuantity, itemSellPrice, itemPurchasePrice}) => ({
      barcode,
      itemCode,
      itemName, 
      itemQuantity,
      itemSellPrice,
      itemPurchasePrice
     }));
     setItems(newArray);
    } catch (error) {
       console.log(error)
    }   
   };


   const handleAddBill = async () => {

    const newArray = selectedItems.map(item => {
      console.log(item.itemPurchasePrice);
      const itemTotalSellPrice = item.itemQuantity * item.itemSellPrice;
      const itemTotalPurchasePrice = item.itemQuantity * item.itemPurchasePrice;
    
      return {
        itemName: item.itemName,
        itemCode: item.itemCode,
        itemQuantity: item.itemQuantity,
        itemTotalSellPrice,
        itemTotalPurchasePrice
      };
    });
    
    const totalBill = selectedItems.reduce((sum, item) => {
      return sum + (item.itemQuantity * item.itemSellPrice);
    }, 0);
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');
      const response = await axios.post(`${ip}:3000/api/users/${userId}/addBill`, {
      billCode, newArray, totalBill,
      });
      setBillCode(billCode+1);

      const updatedSourceArray = [];
      selectedItems.forEach((deductionItem) => {
      const sourceItem = items.find((sourceItem) => sourceItem.itemCode === deductionItem.itemCode);

      if (sourceItem) {
      const updatedItem = { ...sourceItem };
      updatedItem.itemQuantity -= deductionItem.itemQuantity;

      if (updatedItem.itemQuantity < 0) {
        updatedItem.itemQuantity = 0;
      }

      updatedSourceArray.push(updatedItem);
      }
    });
    console.log(updatedSourceArray);
    var i;
      for(i=0;i<updatedSourceArray.length;i++){
        handleEditItemQuantity(updatedSourceArray[i].itemCode, updatedSourceArray[i].itemName, updatedSourceArray[i].itemQuantity, updatedSourceArray[i].itemPurchasePrice, updatedSourceArray[i].itemSellPrice)
      }
      setSelectedItems([]);
    } catch (error) {
       console.log(error)
    }   
   };

   const handleIncrementQuantity = (itemId) => {
    setSelectedItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.itemCode === itemId) {
          // Find the corresponding item from the items array
          const correspondingItem = items.find((i) => i.itemCode === itemId);
          if (correspondingItem) {
            // Check if the incremented quantity exceeds the maximum item quantity
            const newQuantity = item.itemQuantity + 1;
            const maxQuantity = correspondingItem.itemQuantity;
            const updatedQuantity = newQuantity <= maxQuantity ? newQuantity : maxQuantity;
  
            return {
              ...item,
              itemQuantity: updatedQuantity,
            };
          }
        }
        return item;
      });
      return updatedItems;
    });
  };
  

  const handleDecrementQuantity = (itemId) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.itemCode === itemId) {
          const updatedQuantity = item.itemQuantity - 1;
            // Item quantity still greater than or equal to 1, update the quantity
            return {
              ...item,
              itemQuantity: updatedQuantity,
            };
        }
        return item;
      }).filter((item) => item.itemQuantity >= 1)
    );
  };
  
  

  return (
    <View style={{ height: '100%' }}>
      <NaviagtionScreen Title="Billing"/>
      <Animated.View  style={{
          backgroundColor: 'white',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflow: showMenu ? 'visible' : 'hidden',
          transform: [
            {scale: scaleValue},
            {translateX: offsetValue},
          ]
        }}> 
          <View style={styles.header} onFocus={() => {setClicked(false); setBarcodeClicked(false);}}>
          <ImageBackground source={require('../assets/header.png')}
            style={{height: Dimensions.get('window').height/4, width: Dimensions.get('window').width, flexDirection: 'row', 
            alignItems: 'center' }}>
              <TouchableOpacity onPress = {() => {
                Animated.timing(scaleValue, {
                  toValue: showMenu ? 1 : 0.78,
                  duration: 150,
                  useNativeDriver: true
                }).start()

                Animated.timing(offsetValue, {
                  toValue: showMenu ? 0 : 220,
                  duration: 150,
                  useNativeDriver: true
                }).start()

                Animated.timing(closeButtonOffset, {
                  toValue: !showMenu ? -30 : 0,
                  duration: 150,
                  useNativeDriver: true
                }).start()

                setShowMenu(!showMenu);
              }}> 
              <Image
              source = { showMenu ? require('../assets/closeMenu.png') : require('../assets/menu.png')}
              style={{
                width: showMenu ? 70: 40,
                height: showMenu ? 70: 40,
                marginLeft: 20,
                marginBottom: 40,
              }}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Billing</Text>
            </ImageBackground>
          </View>
        <View style={styles.body}>
            <View style={{padding: 10,}} onFocus={() => {setClicked(false); setBarcodeClicked(false);}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Customer</Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    borderRadius: 10,
                    width: '95%',
                    height: 40,
                    borderWidth: 2,
                    marginTop: 10,
                    borderColor: 'black',
                    padding: 12,
                  }}
                    placeholderTextColor='black'
                    placeholder="Customer Name"
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                  <TextInput
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    borderRadius: 10,
                    width: '95%',
                    height: 40,
                    borderWidth: 2,
                    marginTop: 10,
                    borderColor: 'black',
                    padding: 12,
                  }}
                    placeholderTextColor='black'
                    placeholder="Customer Number"
                    value={customerNumber}
                    onChangeText={setCustomerNumber}
                    keyboardType='numeric'
                  />
            </View>
            <Text style={{fontSize: 20, fontWeight: 'bold', padding: 10,marginTop: -10,}}>Bill</Text>
            <View style = {{flexDirection: 'row'}}>
            <View style={{ marginLeft: width/100,padding: 10, flexDirection: 'row', width: "60%", backgroundColor: "#d9dbda", borderRadius: 10, alignItems: "center"}} onFocus={() => {setClicked(true); setBarcodeClicked(false)}}>
              <Feather name='search' size={20} color="black" style={{ marginLeft: 1, marginRight: 4}}/>
              <TextInput value={input} onChangeText={(text)=>setInput(text)} style={{ fontSize: 15, width: "100%"}} placeholder="Search" onFocus={() => {setClicked(true); setBarcodeClicked(false)}}/>
            </View>
            <View style={{ marginLeft: width/100, flexDirection: 'row', width: "35%", alignItems: "center"}}>
            <TouchableOpacity style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius:15,
            padding: 12,
            alignItems: 'center',
            width: Dimensions.get('screen').width/3,
          }} onPress={() => {
            askForCameraPermission(); 
            setBarcodeClicked(!barcodeClicked);
            setClicked(false);
            setScanned(!scanned);
          }}>
            <Text style={styles.buttonText}>{barcodeClicked ? "Cancel" : "Scan Barcode"}</Text>
          </TouchableOpacity>
            </View>
            </View>
            {barcodeClicked && <View style={styles.barcodebox}>
                <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style = {{height: 400, width: 400}}
                />
                </View>
            }
            {clicked && 
              <SearchFilter data={items} input={input} setSelectedItems={setSelectedItems} setClicked={setClicked} selectedItems={selectedItems}/>
            }
            <View style={styles.card} onFocus={()=>setClicked(false)}>
              <View style={{padding: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                <Text style={{ fontSize: 15, fontWeight: 'bold'}}>Code</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold'}}>Name</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold'}}>Quantity</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold'}}>Price</Text>
              </View>
              <View style={{height: 1, backgroundColor: 'black', marginVertical: 10,}} />
             { selectedItems.length > 0 && (
              <SwipeListView data={selectedItems}
              keyExtractor={(item) => item.itemCode}
              renderItem={({item, index}) => {
                return (<View style={{padding: 0, flexDirection: 'row', flex: 1}}>
                <Text style={{marginLeft: 8, marginRight: 20, flex: 0}}>{item.itemCode}</Text>
                <Text style={{marginLeft: 48, marginRight: 20, flex: 1}}>{item.itemName}</Text>
                <View style={{marginLeft: 0, marginRight: 20, flexDirection: 'row', flex: 2}}>
                  <TouchableOpacity
                    style={[styles.stockButton, {flex: 1}]}
                    onPress={() => handleIncrementQuantity(item.itemCode)}
                  >
                    <Text style={styles.stockButtonText}>+</Text>
                  </TouchableOpacity>
                  <Text style={{flex: 0,}}>{item.itemQuantity}</Text>
                  <TouchableOpacity
                    style={[styles.stockButton, {flex: 1}]}
                    onPress={() => handleDecrementQuantity(item.itemCode)}
                  >
                    <Text style={styles.stockButtonText}>-</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{marginLeft: 20, flex: 0}}>{item.itemSellPrice * item.itemQuantity}</Text>
                </View>
                )
              }}/>
              )}
            </View>
            <View style={{paddingHorizontal: 25, flexDirection: 'row' ,justifyContent: 'space-between'}} onFocus={()=>setClicked(false)}> 
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Total Bill:</Text>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Rs. {selectedItems.reduce((sum, item) => sum + (item.itemSellPrice * item.itemQuantity), 0)}</Text>
            </View>
            <TouchableOpacity  style={[styles.generateBillButton]} onPress={handleAddBill}>
              <Text style={styles.buttonText}>Generate Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.sendWhatsappButton]} onPress={initiateWhatsApp}>
              <Image source={require('../assets/whatsapp.png')} 
              style={{width: width/10, height: height/20,}}/>
              <Text style={styles.buttonText}>   Send On Whatsapp</Text>
            </TouchableOpacity>
        </View>
      </Animated.View>
      </View>  
  );
};

const styles = StyleSheet.create({
  generateBillButton: {
    backgroundColor: 'rgb(60,60,60)',
    padding: 10,
    borderRadius:15,
    alignItems: 'center',
    width: "95%",
    margin: 10,
    marginTop: 35,
  },
  sendWhatsappButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius:15,
    alignItems: 'center',
    width: "95%",
    margin: 10,
    marginVertical: 0,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 50,
  },
  header: {
    marginTop: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  logo: {
    width: 125,
    height: 120,
    marginLeft: 65,
    marginTop: 25,
    borderRadius: 50,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    marginTop: '-8%',
    marginLeft: '4%'
  },
  body: {
    flex: 8,
    backgroundColor: "rgba(0, 0, 0, 0)",
    flexDirection: 'column',
    marginTop: height/20,
  },
  card: {
    flexDirection: 'column',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    elevation: 10,
    alignContent: 'space-between',
    height: 200,
  },
  stockButton: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    textAlign: 'center',
    marginHorizontal: 8,
    marginTop: -5,
  },
  stockButtonText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  stockText: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 11,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    backgroundColor: '#FF0000',
    right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  backRightBtnRight: {
    backgroundColor: '#FF0000',
    right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  backLeftBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    backgroundColor: '#008000',
    left: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  backLeftBtnLeft: {
    backgroundColor: '#008000',
    left: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  backTextWhite: {
    color: '#FFF',
    fontSize: 15,
  },
  searchContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    zIndex: 999,
  },
  dropdownItem: {
    padding: 10,
  },
  barcodebox: {
    marginLeft: width/10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 300,
    margin: 10,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
},
});

export default Billing;
