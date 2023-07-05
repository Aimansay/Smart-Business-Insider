import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, ScrollView,View, Text, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import { LineChart,BarChart, PieChart } from 'react-native-chart-kit';
import NaviagtionScreen from './NavigationScreen';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {printToFileAsync} from 'expo-print';
import {shareAsync} from 'expo-sharing';
import { set } from 'react-native-reanimated';
// import svm from 'svm-js';

const Analytics = () => {

  // Helper function to format the date
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  
  // Generate the report HTML
  function generateReport(bills) {
    // Calculate total earnings
    const totalEarnings = bills.reduce((total, bill) => total + bill.totalBill, 0);
  
    // Calculate total sales and find the most profitable item
    let totalSales = 0;
    let mostProfitableItem = null;
const itemProfits = {};

for(const bill of bills) {
  for (const item of bill.billing) {
    totalSales += item.itemQuantity;

    const itemProfit = item.itemTotalSellPrice - item.itemTotalPurchasePrice;
    if(itemProfits[item.itemName]){
      itemProfits[item.itemName] += itemProfit;
    } else {
      itemProfits[item.itemName] = itemProfit;
    }
  }
}

let maxValue = -Infinity;

for (const itemName in itemProfits) {
  if (itemProfits[itemName] > maxValue) {
    maxValue = itemProfits[itemName];
    mostProfitableItem = { itemName: itemProfits[itemName] };
  }
}
  
    // Sort bills by date in chronological order
    const sortedBills = bills.sort((a, b) => new Date(a.itemSaleDate) - new Date(b.itemSaleDate));
    let startDate = new Date(sortedBills[0].itemSaleDate);
    let endDate = new Date(sortedBills[sortedBills.length - 1].itemSaleDate);

    let reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }

        h1 {
          text-align: center;
        }

        p {
          margin-bottom: 10px;
        }

        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-top: 20px;
        }

        .bill-info {
          margin-bottom: 15px;
        }

        .bill-info strong {
          font-weight: bold;
        }

        .item-list {
          margin-top: 5px;
          padding-left: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Report Title</h1>
      <p>Report Period: ${formatDate(startDate)} - ${formatDate(endDate)}</p>
      <p>Report Generation Date: ${formatDate(new Date())}</p>
      <p><strong>Total Earnings:</strong> Rs. ${totalEarnings}</p>
      <p><strong>Total Sales:</strong> ${totalSales}</p>
      <p><strong>Most Profitable Item:</strong> ${Object.keys(mostProfitableItem)[0]} (Profit: Rs. ${Object.values(mostProfitableItem)[0]})</p>
      <div class="section-title">Bills:</div>
      ${sortedBills
        .map(
          (bill) => `
        <div class="bill-info">
          <strong>Bill Code:</strong> ${bill.billCode} &nbsp;
          <strong>Date:</strong> ${formatDate(bill.itemSaleDate)} |
          <strong>Total Bill:</strong> Rs. ${bill.totalBill}
          <ul class="item-list">
            ${bill.billing
              .map(
                (item) => `
              <li>
                <strong>Item Name:</strong> ${item.itemName} |
                <strong>Quantity:</strong> ${item.itemQuantity} |
                <strong>Sales Price:</strong> Rs. ${item.itemTotalSellPrice}
              </li>
            `
              )
              .join('')}
          </ul>
        </div>
        <hr>
      `
        )
        .join('')}
    </body>
    </html>
    `;
    return reportHTML;
  }

  let generatePdf=async()=>{

    const file = await printToFileAsync({
      html:generateReport(bills),
      base64:false
    });
    await shareAsync(file.uri);
  }

  const[bills,setBills] = useState([]);
  const[thisMonthEarning, setThisMonthEarning] = useState(0);
  const[thisMonthSales, setThisMonthSales] = useState(0);
  const[profitableItem, setProfitableItem] = useState("None");
 
  useEffect(() => {
    getThreeMonthBills();
  }, []);
  

  const getBarChartData = () => {
    const today = new Date();
    const monthlyEarning = [];

    // Iterate over the bill objects
    for (const bill of bills) {
      const date = new Date(bill.itemSaleDate);
      var month = date.toLocaleString('default', { month: 'short' });
      month = month.split(" ")[1];
      // If the sales data for that month already exists, add the totalBill to the existing value
      if (monthlyEarning[month]) {
        monthlyEarning[month] += bill.totalBill;
      }
      // If the sales data for that month does not exist, create a new entry
      else {
        monthlyEarning[month] = bill.totalBill;
      }
    }

    // Get the unique months from the bill objects
    const months = Object.keys(monthlyEarning);

    // Sort the months based on their index in the year
    months.sort((a, b) => new Date(Date.parse(`01 ${a} 2000`)) - new Date(Date.parse(`01 ${b} 2000`)));

    // Get the latest month
    const latestMonth = months[months.length - 1];

    // Calculate the total earning for the latest month
    setThisMonthEarning(monthlyEarning[latestMonth]);

    // Create the EarningData1 object using the gathered sales data
    const EarningData1 = {
      labels: months,
      datasets: [
        {
          data: months.map(month => monthlyEarning[month])
        },
      ],
    };

    setEarningData(EarningData1);
  } 

  const getLineChartData = () => {
    const monthlySales = [];

    // Iterate over the bill objects
    for (const bill of bills) {
      const date = new Date(bill.itemSaleDate);
      var month = date.toLocaleString('default', { month: 'short' });
      month = month.split(" ")[1];
      // If the sales data for that month already exists, add the totalBill to the existing value
      if (monthlySales[month]) {
        for(const item of bill.billing){
          monthlySales[month] += item.itemQuantity;
        }
      }
      // If the sales data for that month does not exist, create a new entry
      else {
        var i, sum = 0;
        for(const item of bill.billing){
          sum += item.itemQuantity;
        }
        monthlySales[month] = sum;
      }
    }

    // Get the unique months from the bill objects
    const months = Object.keys(monthlySales);

    // Sort the months based on their index in the year
    months.sort((a, b) => new Date(Date.parse(`01 ${a} 2000`)) - new Date(Date.parse(`01 ${b} 2000`)));

    // Get the latest month
    const latestMonth = months[months.length - 1];

    // Calculate the total earning for the latest month
    setThisMonthSales(monthlySales[latestMonth]);

    // Create the EarningData1 object using the gathered sales data
    const SalesData1 = {
      labels: months,
      datasets: [
        {
          data: months.map(month => monthlySales[month])
        },
      ],
    };

    setSalesData(SalesData1);
  }

  const getPieChartData = () => {

    if (bills.length>0){
    const totalSales = [];

    // Iterate over the bill objects
    for (const bill of bills) {
      // If the sales data for that month already exists, add the totalBill to the existing value
        for(const item of bill.billing){
          const profit = item.itemTotalSellPrice - item.itemTotalPurchasePrice;
          if(totalSales[item.itemName]){
            totalSales[item.itemName] += profit;
          } else {
            totalSales[item.itemName] = profit;
          }
        }
    }

    const salesArray = Object.entries(totalSales).map(([itemName, itemQuantity]) => ({
      itemName,
      itemQuantity
    }));
    
    salesArray.sort((a, b) => b.itemQuantity - a.itemQuantity);
    
    var topFiveItems;
    console.log(salesArray.length);
    if (salesArray.length<5){
      topFiveItems = salesArray.slice(0, salesArray.length);
    } else {
    topFiveItems = salesArray.slice(0, 5);
    }

    // Create the EarningData1 object using the gathered sales data
    var profitItemData = [
      {
        name: "",
        population: 0,
        color: "grey",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "",
        population: 0,
        color: "lightgrey",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "",
        population: 0,
        color: "rgb(160,160,160)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "",
        population: 0,
        color: "rgb(50,50,50)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "",
        population: 0,
        color: "rgb(0, 0, 0)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      }
    ];

    for(var i=0;i<topFiveItems.length;i++){
      profitItemData[i].name = topFiveItems[i].itemName;
      profitItemData[i].population = topFiveItems[i].itemQuantity;
      console.log(topFiveItems[i].itemQuantity);
    }

    profitItemData = profitItemData.slice(0,topFiveItems.length);

    setProfitItemData(profitItemData);
    setProfitableItem(topFiveItems[0].itemName);
    }
  }

  useEffect(() => {
    if ( bills.length>0) {
      getBarChartData();
      getLineChartData();
      getPieChartData();
    } 
  }, [bills]);


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
      setBills(response.data);
      console.log(bills);
    } catch (error) {
       console.log(error)
    }   
  }

  const handleGetBillsByDate = async (startDate, endDate) => {
    console.log("getting by date");
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');
      const formattedStartDate = startDate + "T00:00:00.000Z";
      const formattedEndDate = endDate + "T23:59:59.000Z";
      const response = await axios.get(`${ip}:3000/api/users/${userId}/billing`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      setBills(response.data);
      return Promise.resolve(); // Resolve the promise after data retrieval
    } catch (error) {
      console.log(error);
      return Promise.reject(error); // Reject the promise if an error occurs
    }
  };

  const getThreeMonthBills = async () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const todayFormatted = today.toISOString().split('T')[0];
    const threeMonthsAgoFormatted = threeMonthsAgo.toISOString().split('T')[0];
    handleGetBillsByDate(threeMonthsAgoFormatted, todayFormatted);
  }

  const getSixMonthBills = async () => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const todayFormatted = today.toISOString().split('T')[0];
    const threeMonthsAgoFormatted = sixMonthsAgo.toISOString().split('T')[0];
    handleGetBillsByDate(threeMonthsAgoFormatted, todayFormatted);
  }

  const getTwelveMonthBills = async () => {
    const today = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const todayFormatted = today.toISOString().split('T')[0];
    const threeMonthsAgoFormatted = twelveMonthsAgo.toISOString().split('T')[0];
    handleGetBillsByDate(threeMonthsAgoFormatted, todayFormatted);
  }
  

  const navigation = useNavigation();
  const EarningData1 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0]
      },
    ],
  };
  const [EarningData, setEarningData] = useState(EarningData1);
  const SalesData1 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0]
      },
    ],
  };
  const [SalesData, setSalesData] = useState(SalesData1);
  const [profitItemData, setProfitItemData] = useState([]);
  const [threeMonthFlag, setThreeMonthFlag] = useState(true);
  const [sixMonthFlag, setSixMonthFlag] = useState(false);
  const [twelveMonthFlag, setTwelveMonthFlag] = useState(false);
  
  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.45,
    useShadowColorFromDataset: false, // optional
    decimalPlaces: 0,
  };
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

  return (
    <View style={{ height: '100%' }}>
      <NaviagtionScreen Title="Analytics"/>
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
        <ScrollView> 
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
            <Text style={styles.title}>Analytics</Text>
            </ImageBackground>
          </View>
          <View style={styles.body}>
            <View style={{justifyContent: 'center',
        alignItems: 'center',
        margin: 20}}>
          <TouchableOpacity  style={[styles.button]} onPress={generatePdf}>
            <Text style={styles.buttonText}>Generate Report</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <TouchableOpacity  style={[styles.button, {width: 100, backgroundColor: threeMonthFlag ? "rgba(0,0,0,0.8)" : "white", borderColor: threeMonthFlag ? "white" : "rgba(0,0,0,0.8)"}]} onPress={() => {
              setThreeMonthFlag(true);
              setSixMonthFlag(false);
              setTwelveMonthFlag(false);
              getThreeMonthBills();
            }}>
              <Text style={[styles.buttonText, {color: threeMonthFlag ? "white" : "black"}]}>3 months</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.button, { marginHorizontal: 20 ,width: 100, backgroundColor: sixMonthFlag ? "rgba(0,0,0,0.8)" : "white", borderColor: sixMonthFlag ? "white" : "rgba(0,0,0,0.8)"}]} onPress={() => {
              setThreeMonthFlag(false);
              setSixMonthFlag(true);
              setTwelveMonthFlag(false);
              getSixMonthBills();
            }}>
              <Text style={[styles.buttonText, {color: sixMonthFlag ? "white" : "black"}]}>6 months</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.button, {width: 100, backgroundColor: twelveMonthFlag ? "rgba(0,0,0,0.8)" : "white", borderColor: twelveMonthFlag ? "white" : "rgba(0,0,0,0.8)"}]} onPress={() => {
              setThreeMonthFlag(false);
              setSixMonthFlag(false);
              setTwelveMonthFlag(true);
              getTwelveMonthBills();
            }}>
              <Text style={[styles.buttonText, {color: twelveMonthFlag ? "white" : "black"}]}>12 months</Text>
            </TouchableOpacity> 
          </View>
          </View>
            <View style={styles.card}>
                <View style={styles.inputContainer}>
                    <Text style={{fontWeight: 'bold', marginRight: 150,}}>Earning</Text>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}>
                        <Text style={styles.labels}>Rs {thisMonthEarning}</Text>
                    </View>
                </View> 
                { bills.length > 0 ? (
                <BarChart
                style={{marginTop: 20}}
                data={EarningData}
                width={Dimensions.get("window").width/1.2}
                height={250}
                chartConfig={chartConfig}
                fromZero={true}
                yAxisLabel="Rs "
                />
                ) : (
                  <View style={styles.center}>
                    <Text style={{margin: 60, fontSize: 12,}}>Generate Bills to get visualization</Text>
                  </View>
                )}
            </View>
            <View style={styles.card}>
                <View style={styles.inputContainer}>
                    <Text style={{fontWeight: 'bold', marginRight: 200,}}>Sales</Text>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}>
                        <Text style={styles.labels}>{thisMonthSales}</Text>
                    </View>
                </View>
                { bills.length > 0 ? (
                <LineChart
                withInnerLines={false}
                style={{marginTop: 20}}
                data={SalesData}
                width={Dimensions.get("window").width/1.2}
                height={250}
                chartConfig={chartConfig}
                fromZero={true}
                bezier
                />
                ) : (
                  <View style={styles.center}>
                    <Text style={{margin: 60, fontSize: 12,}}>Generate Bills to get visualization</Text>
                  </View>
                )}
            </View>
            <View style={styles.card}>
                <View style={styles.inputContainer}>
                    <Text style={{fontWeight: 'bold', marginRight: 100,}}>Most Profitable Item</Text>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}>
                        <Text style={styles.labels}>{profitableItem}</Text>
                    </View>
                </View>
                { bills.length > 0 ? (
                <PieChart
                data={profitItemData}
                width={Dimensions.get("window").width/1.2}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
                />
                ) : (
                  <View style={styles.center}>
                    <Text style={{margin: 60, fontSize: 12,}}>Generate Bills to get visualization</Text>
                  </View>
                )}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
      </View>  
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Overview: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
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
  chartsBody: {
    flex : 1,
    flexDirection: 'column',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  charts: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'space-between',
    marginLeft: -25,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius:15,
    alignItems: 'center',
    width: 340,
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
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
  cardContainer: {
    marginTop: 30,
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
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
});

export default Analytics;
