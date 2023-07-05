import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Text, Button, TextInput, Modal, StyleSheet, Image, Dimensions, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import NaviagtionScreen from './NavigationScreen';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useItems } from './Items';
import {BarCodeScanner} from 'expo-barcode-scanner';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Feather} from "@expo/vector-icons";


const Inventory = () => {
  useEffect(() => {
    getInventory();
  }, []);

  const navigation = useNavigation();
  const { items, setItems } = useItems([]);
  const [showMenu, setShowMenu] = useState(false);
  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  const [itemCode, setItemCode] = useState(1);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [input, setInput] = useState();
  const [searched, setSearched] = useState(false);

  const search = () => {
    if (searched) {
      setSearched(false);
      getInventory();
    } else {
      setSearched(true);
      const temp = items.filter(item => item.itemName.startsWith(input));
      setItems(temp);
    }
  }
  

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
     const newArray = inventoryData.map(({ _id, itemName, itemCode, itemQuantity, itemSellPrice, itemPurchasePrice}) => ({
      itemCode,
      itemName, 
      itemQuantity,
      itemPurchasePrice,
      itemSellPrice,
     }));
     setItems(newArray);
     if (newArray.length>0){
      const code = Number(newArray[newArray.length-1].itemCode) + 1; 
      setItemCode(code);
     } else {
      setItemCode(1);
     }
    } catch (error) {
       console.log(error)
    }   
   };

  const addItem = (itemCode, barcode, itemName, itemQuantity, itemPurchasePrice, itemSellPrice) => {
    const newItem = { itemCode, barcode, itemName, itemQuantity, itemPurchasePrice, itemSellPrice };
    setItems([...items, newItem]);
  };
  const handleItemSelect = (index) => {
    setSelectedItemIndex(index);
  };  
  const handleNavigation = useCallback(() => {
    if (showMenu) setShowMenu(false);
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', handleNavigation);
    return unsubscribe;
  }, [navigation, handleNavigation]);

  const AddItemModal = ({ visible, onClose }) => {
    const [itemName, setItemName] = useState("");
    const [itemQuantity, setItemQuantity] = useState(0);
    const [itemPurchasePrice, setItemPurchasePrice] = useState("");
    const [itemSellPrice, setItemSellPrice] = useState("");
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [clicked, setClicked] = useState(false);

    const askForCameraPermission = () => {
      (async () => {
          const {status} = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status == 'granted')
      })()
    }

    const handleBarCodeScanned = ({type, data}) => {
      setScanned(true);
      setBarcode(data);
      setClicked(false);
      console.log('Type: ' + type + '\nData: ' + data);
    }
  
    const handleAddItem  = async () => {
      setItemCode(itemCode+1);
      
      try {
        const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');

       const response = await axios.post(`${ip}:3000/api/users/addItem/${userId}`, {
        itemCode, barcode, itemName, itemQuantity, itemPurchasePrice, itemSellPrice
     }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })  
        console.log(response.data)
          
      } catch (error) {
         console.log(error + " 1");
      }
      addItem(itemCode, barcode, itemName, itemQuantity, itemPurchasePrice, itemSellPrice);
      onClose(); 
     };

  
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
          >Add Item</Text>
          <TextInput 
            style={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 10,
                width: 200,
                height: 40,
                borderWidth: 2,
                borderColor: 'black',
            }}
            placeholderTextColor='black'
            textAlign={'center'}
            placeholder="Name"
            value={itemName}
            onChangeText={setItemName}
          />
          <View style={styles.stockContainer}>
            <TextInput
            style={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 10,
                width: 200,
                height: 40,
                borderWidth: 2,
                borderColor: 'black',
            }}
            placeholderTextColor='black'
            textAlign={'center'}
            placeholder="Quantity"
            value={itemQuantity.toString()}
            onChangeText={setItemQuantity}
            keyboardType="numeric"
          />
          </View>
          <TextInput
          style={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: 10,
            width: 200,
            height: 40,
            borderWidth: 2,
            marginTop: 10,
            borderColor: 'black',
        }}
        placeholderTextColor='black'
        textAlign={'center'}
            placeholder="Purchase Price"
            value={itemPurchasePrice.toString()}
            onChangeText={setItemPurchasePrice}
            keyboardType="numeric"
          />
          <TextInput
          style={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: 10,
            width: 200,
            height: 40,
            borderWidth: 2,
            marginTop: 10,
            borderColor: 'black',
        }}
        placeholderTextColor='black'
        textAlign={'center'}
            placeholder="Sell Price"
            value={itemSellPrice.toString()}
            onChangeText={setItemSellPrice}
            keyboardType="numeric"
          />
          <TextInput
          style={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: 10,
            width: 200,
            height: 40,
            borderWidth: 2,
            marginTop: 10,
            borderColor: 'black',
        }}
        editable={false}
        placeholderTextColor='black'
        textAlign={'center'}
            placeholder="Barcode"
            value={barcode.toString()}
            keyboardType="numeric"
          />
          {clicked && <View style={styles.barcodebox}>
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style = {{height: 400, width: 400}}
                />
          </View>}
          <TouchableOpacity style={{
            backgroundColor: 'gray',
            padding: 10,
            borderRadius:15,
            alignItems: 'center',
            width: Dimensions.get('screen').width/3,
            margin: 10,
          }} onPress={() => {
            askForCameraPermission(); 
            setClicked(true);
          }}>
            <Text style={styles.buttonText}>Scan Barcode</Text>
          </TouchableOpacity>
          <View style={{
            padding: 50,
            margin: 20,
            flexDirection: 'row',
          }}>

          <View style={{
                marginRight: 20,
                width: 80,
            }}>
          <Button color="gray" title="Save" onPress={handleAddItem} />
          </View>
          <View>
          <Button color="gray" title="Cancel" onPress={onClose} />
          </View>
          </View>
        </View>
      </Modal>
    );
  };  

  const EditItemModal = ({ visible, onClose }) => {

    const selectedItem = items[selectedItemIndex];

    const handleIncrementStock = () => {
        var stock = Number(itemQuantity) + 1;
        setItemQuantity(stock);
      };
    
      const handleDecrementStock = () => {
        if (Number(itemQuantity) > 0) {
          setItemQuantity(Number(itemQuantity) - 1);
        }
      };
  
    const handleEditItem = async () => {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');
      const newItem = {itemCode, itemName, itemQuantity, itemPurchasePrice, itemSellPrice };
      newItem.itemCode = selectedItem.itemCode
      const newItems = [...items];
      newItems[selectedItemIndex] = newItem;
      var newItemCode = newItem.itemCode;
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

      setItems(newItems);
      setSelectedItemIndex(-1);
      onClose();
      // this.swipeListView.safeCloseOpenRow();
    };

    const [itemName, setItemName] = useState(selectedItem.itemName);
    const [itemQuantity, setItemQuantity] = useState(selectedItem.itemQuantity);
    const [itemPurchasePrice, setItemPurchasePrice] = useState(selectedItem.itemPurchasePrice);
    const [itemSellPrice, setItemSellPrice] = useState(selectedItem.itemSellPrice);
  
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
          >Edit Item</Text>
          <TextInput 
            style={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 10,
                width: 200,
                height: 40,
                borderWidth: 2,
                borderColor: 'black',
            }}
            placeholderTextColor='black'
            textAlign={'center'}
            placeholder="Name"
            value={itemName || selectedItem.itemName}
            onChangeText={setItemName}
          />
          <View style={styles.stockContainer}>
            <TouchableOpacity
              style={styles.stockButton}
              onPress={handleDecrementStock}
            >
              <Text style={styles.stockButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
            style={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 10,
                width: 200,
                height: 40,
                borderWidth: 2,
                borderColor: 'black',
            }}
            placeholderTextColor='black'
            textAlign={'center'}
            placeholder={"Quantity"}
            value={itemQuantity.toString()}
            onChangeText={setItemQuantity}
          />
            <TouchableOpacity
              style={styles.stockButton}
              onPress={handleIncrementStock}>
              <Text style={styles.stockButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TextInput
          style={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: 10,
            width: 200,
            height: 40,
            borderWidth: 2,
            marginTop: 10,
            borderColor: 'black',
        }}
        placeholderTextColor='black'
        textAlign={'center'}
            placeholder="Purchase Price"
            value={itemPurchasePrice.toString() || selectedItem.itemPurchasePrice.toString()}
            onChangeText={setItemPurchasePrice}
            keyboardType="numeric"
          />
          <TextInput
          style={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: 10,
            width: 200,
            height: 40,
            borderWidth: 2,
            marginTop: 10,
            borderColor: 'black',
        }}
        placeholderTextColor='black'
        textAlign={'center'}
            placeholder="Sell Price"
            value={itemSellPrice.toString() || selectedItem.itemSellPrice.toString()}
            onChangeText={setItemSellPrice}
            keyboardType="numeric"
          />
          <View style={{
            padding: 50,
            margin: 20,
            flexDirection: 'row',
          }}>
            <View style={{
                marginRight: 20,
                width: 80,
            }}>
          <Button color="gray" title="Save" onPress={handleEditItem} />
          </View>
          <View>
          <Button color="gray" title="Cancel" onPress={() => {onClose(); 
        // this.swipeListView.safeCloseOpenRow();
          }} />
          </View>
          </View>
        </View>
      </Modal>
    );
  };  
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleAddPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
  };

  const handleEditModal = () => {
    setEditModalVisible(true);
  }

  const handleRemove = async (index) => {
      console.log("removeing " + index)
    const newItems = [...items];
    newItems.splice(index, 1);
    // for (let i = index; i < newItems.length; i++) {
    //   newItems[i].itemCode -= 1;
    // }
    setItems(newItems);
    if (items.length>0){
    setItemCode((items[items.length-1].itemCode)+1);
    } else {
      setItemCode(1);
    }
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');
     const response = await axios.delete(`${ip}:3000/api/users/removeItem/${userId}`, { data: { index: items[index].itemCode } }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })  
    } catch (error) {
      console.log(error);
    } 
    // this.swipeListView.safeCloseOpenRow();  
   };
  

  return (
    <View style={{ height: '100%' }}>
      <NaviagtionScreen Title="Inventory"/>
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
          <View style={styles.header}>
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
            <Text style={styles.title}>Inventory</Text>
            </ImageBackground>
          </View>
          <View style={styles.body}>
            <View style={{justifyContent: 'center',
        alignItems: 'center',
        margin: 15}}>
          <View style={{flexDirection: 'row', marginTop: 40}}>
          <TouchableOpacity  style={[styles.button, {width: "100%"}]} onPress={handleAddPress}>
            <Text style={styles.buttonText}>Add New Item</Text>
          </TouchableOpacity>
          </View>
          <AddItemModal visible={modalVisible} onClose={handleModalClose} />
          </View>
          <View style={{flexDirection: "row", marginHorizontal: 10}}> 
            <View style={{ flex: 2, marginLeft: 10, marginBottom: 10, padding: 10, flexDirection: 'row', backgroundColor: "#d9dbda", borderRadius: 10, alignItems: "center"}}>
              <Feather name='search' size={20} color="black" style={{ marginLeft: 1, marginRight: 4}}/>
              <TextInput value={input} onChangeText={(text)=>setInput(text)} style={{ fontSize: 15, width: "100%"}} placeholder="Search" />
            </View>
            <TouchableOpacity style={[styles.button, {flex: 1, height: 48, marginTop: 0,}]} onPress={search}>
              <Text style={[styles.buttonText, {marginTop: 2}]}>{searched ? "Cancel": "Search"  }</Text>
            </TouchableOpacity>
          </View>
          {items.length > 0 ? (
        <SwipeListView style={styles.list}
          data={items}
          keyExtractor={(item) => item.itemCode}
          renderItem={({ item, index }) => (
          <View style={[styles.card, {/*borderWidth: item.itemQuantity < 10 ? 5 : 0, borderColor: item.itemQuantity < 10 ? "red" : "white"*/}]}>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginRight: 20,
            }}>{item.itemCode}.</Text>
          <Text style={{
            fontSize: 25,
            marginRight: 20,
            maxWidth: 120,
          }}>{item.itemName}</Text>
            <View style={{
                flexDirection: 'row',
                padding: 20,
                justifyContent: 'flex-end',
                marginLeft: 'auto'
            }}>
                <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                margin: 5,
            }}>
                <Text style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: item.itemQuantity < 10 ? "red" : "black" 
          }}>Quantity</Text>
            <Text style = {{color: item.itemQuantity < 10 ? "red" : "black" }}>{item.itemQuantity}</Text>
            <Text style={{
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: 15,
          }}>Purchase Price</Text>
          <Text>{item.itemPurchasePrice}</Text>
          <Text style={{
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: 15,
          }}>Sell Price</Text>
          <Text>{item.itemSellPrice}</Text>
            </View>
            </View>
          </View>
        )}
        renderHiddenItem={({ item, index}) => (
          <View style={[styles.rowBack, { height: 80 }]}>
            <TouchableOpacity
      style={[styles.backLeftBtn, styles.backLeftBtnLeft]}
      onPress={() => {
        handleEditModal();
        handleItemSelect(index);
      }}>
      <Text style={styles.backTextWhite}>Edit</Text>
    </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {handleRemove(index)}}>
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
        )}
        rightOpenValue={-75}
        leftOpenValue={75}
      /> ) : ( 
        <View style={styles.center}>
          <Text style={{marginBottom: 150, fontSize: 20,}}>No Items!!! :(</Text>
        </View>
      )}
      {selectedItemIndex !== -1 && (
        <EditItemModal
          visible={editModalVisible}
          onClose={handleEditModalClose}
        />
      )}
          </View>
      </Animated.View>
      </View>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  modal: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Overview: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
  },
  list: {
    marginTop: -10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  labels: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius:15,
    alignItems: 'center',
    width: Dimensions.get('screen').width/3-15,
    height: 48,
    marginLeft: 10,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  card: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // add a semi-transparent black background to the modal
  },
  formContainer: {
    backgroundColor: 'white', // add a white background to the form
    padding: 20,
    borderRadius: 10,
    width: '80%', // set the width of the form to 80% of the screen width
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  stockButton: {
    backgroundColor: 'white',
    padding:10,
    width: 30,
    height: 50,
    borderRadius: 100,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
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
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 200,
    margin: 10,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
},
});

export default Inventory;
