import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, Dimensions, ImageBackground, FlatList, ScrollView } from 'react-native';
import NaviagtionScreen from './NavigationScreen';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';



const BillRecords = () => {
  useEffect(() => {
    handleGetBills();
  }, []);

  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  const [bills, setBills] = useState([]);

  const BillCard = ({ bill }) => {
    const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <View style={styles.itemText}><Text> {item.itemName}</Text></View>
        <View style={styles.itemText}><Text> {item.itemQuantity}</Text></View>
        <View style={{marginRight: 10}}><Text> {item.itemTotalSellPrice}</Text></View>
      </View>
    );
  
    const getTotalBillAmount = (billing) =>
      billing.reduce(
        (total, item) => total + item.itemTotalSellPrice,
        0
      );
    
      const dateConvertor = (date) => {
        console.log(date);
        return date.split("T")[0];
    }
  
    return (
      <View style={styles.card}>
        <View style={{flexDirection: 'column'}}>
        <View>
        <Text style={styles.billCode}>Invoice # {bill.billCode}</Text>
        <Text style={styles.billCode}> Date:  {dateConvertor(bill.itemSaleDate)}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.itemContainer}>
        <View style={styles.itemTextHeading}><Text style={{fontWeight: 'bold'}}> Name</Text></View>
        <View style={styles.itemTextHeading}><Text style={{fontWeight: 'bold'}}> Quantity</Text></View>
        <View style={{}}><Text style={{fontWeight: 'bold'}}> Total Price</Text></View>
        </View>
        <ScrollView horizontal={true}>
        <FlatList
          data={bill.billing}
          renderItem={renderItem}
          keyExtractor={(item) => item.itemCode}
          listKey={`bill-${bill.billCode}`}
        />
        </ScrollView>
        <Text style={styles.totalAmount}>
          Total: {getTotalBillAmount(bill.billing)}
        </Text>
        </View>
      </View>
    );
  };

  const dateConvertor = (date) => {
    return date.split("T")[0];
}

const monthConvertor = (month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month-1];
}

    let flag = false;

  const renderBillList = () => {
    const billList = [];
    let currentYear = null;
    let currentMonth = null;
      for (let i = 0; i < bills.length; i++) {
        const bill = bills[i];
        const date = dateConvertor(bill.itemSaleDate).split('-');
        const year = date[0];
        const month = date[1];

        if (currentYear !== year) {
            billList.push(
            <View style={{flexDirection: 'row',  marginVertical: 10}}>
              <View>
            <View style={[styles.line, {borderBottomWidth: 1, width: (Dimensions.get("screen").width-(year.length^70))/2}]} />
            </View>
            <Text style={{fontWeight: 'bold', fontSize: 24, marginTop: -15, marginHorizontal: 10,}}   key={`year-${year}`}>
                {year}
            </Text>
            <View>
            <View style={[styles.line, {borderBottomWidth: 1, width: (Dimensions.get("screen").width-(year.length^50))/2}]} />
            </View>
            </View>
            );
            currentYear = year;
        }

        if (currentMonth !== month) {
            billList.push(
              <View style={{flexDirection: 'row', marginVertical: 20}}>
              <View>
            <View style={[styles.line, {borderBottomWidth: 1, width: (Dimensions.get("screen").width-(year.length^50))/2}]} />
            </View>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: -15, marginHorizontal: 10,}} key={`month-${year}-${month}`}>
                {monthConvertor(month)}
            </Text>
            <View>
            <View style={[styles.line, {borderBottomWidth: 1, width: (Dimensions.get("screen").width-(monthConvertor(month).length^50))/2}]} />
            </View>
            </View>
            );
            currentMonth = month;
        }
        
        billList.push(<BillCard bill={bill} key={bill.billCode}/>);
      }
    if (bills.length==0) {
      billList.push(
        <View style={styles.center}>
          <Text style={{marginBottom: 150, fontSize: 20,}}>No Items!!! :(</Text>
        </View>
      );
    }
    return billList;
  };

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
      console.log(response.data);
      setBills(response.data.reverse());
    } catch (error) {
       console.log(error)
    }   
  }
  

    return (
    <View style={{ height: '100%' }}>
      <NaviagtionScreen Title="Record"/>
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
                    <Text style={styles.title}>Records</Text>
                </ImageBackground>
            </View>
            <View style={styles.body}>
                <View style={{justifyContent: 'center',
                    alignItems: 'center',
                    margin: 20}}>
                    <View style={{flexDirection: 'row', marginTop: 40}}>
                        <Text style={{fontSize: 30, marginRight: Dimensions.get('screen').width/2.5 , fontWeight: 'bold'}}>Bills</Text>
                        <TouchableOpacity  style={[styles.button]} onPress={ () => {navigation.navigate("Billing")}}>
                            <Text style={styles.buttonText}>+ Add Bill</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* {bills.length > 0 ? (
                    // <FlatList style={styles.list}
                    //     data={bills}
                    //     keyExtractor={(bill) => bill.billCode}
                    //     renderItem={renderBillList}
                    // /> ) : ( 
                      {renderBillList} ) : ( 
                    <View style={styles.center}>
                        <Text style={{marginBottom: 150, fontSize: 20,}}>No Items!!! :(</Text>
                    </View>
                )} */}
                <ScrollView vertical={true} style={{marginTop: 20}}>
                {renderBillList()}
                </ScrollView>
            </View>
        </Animated.View>
    </View>  
  );
};

const styles = StyleSheet.create({
  
  button: {
    backgroundColor: 'darkgrey',
    padding: 10,
    borderRadius:15,
    alignItems: 'center',
    width: Dimensions.get('screen').width/3,
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
    billCode: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      line: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        marginBottom: 2,
      },
      itemContainer: {
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      itemText: {
        width: Dimensions.get("screen").width/2.8,
        textAlign: 'center',
        marginRight: 8,
      },
      itemTextHeading: {
        width: Dimensions.get("screen").width/3.2,
        textAlign: 'center',
        marginRight: 8,
        fontWeight: 'bold',
      },
      totalAmount: {
        marginTop: 8,
        fontWeight: 'bold',
      },  
});

export default BillRecords;
