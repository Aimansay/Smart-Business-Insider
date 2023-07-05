import React, {useRef, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NaviagtionScreen from './NavigationScreen';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import regression from 'regression';
import User from './User';

const HomePage = () => {

  const navigation = useNavigation();
  

const EarningData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0 ]
    },
  ],
};

  const[monthlyProfit, setMonthlyProfit] = useState(0);
  const[monthlyEarning, setMonthlyEarning] = useState(0);
  const[profitRatio, setProfitRation] = useState(0);
  const[forcastedMonth, setForcastedMonth] = useState();
  const[forcastedEarning, setForcastedEarning] = useState(0);
  const[profitableItem, setMostProfitableItem] = useState("No Items");
  const[leastProfitItem, setLeastProfitItem] = useState("No Items");
  const [lineData, setlineData] = useState(EarningData);
  const[bills, setBills] = useState([]);

  useEffect(()=>{
    if (bills.length>0){
      getBarChartData();
    } else {

    }
  }, [bills]);

  const getBarChartData = () => {
    const monthlyEarning = [];
    var monthlyProfits = {};
    var profitItems = {};
    var totalSellPrice = 0;
    var totalPurchasePrice = 0;
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
      let profit = 0;
      for(const item of bill.billing) {
        profit += item.itemTotalSellPrice - item.itemTotalPurchasePrice; 
        totalSellPrice += item.itemTotalSellPrice;
        totalPurchasePrice += item.itemTotalPurchasePrice;
        if (profitItems[item.itemName]) {
          profitItems[item.itemName] += item.itemTotalSellPrice - item.itemTotalPurchasePrice; 
        } else {
          profitItems[item.itemName] = item.itemTotalSellPrice - item.itemTotalPurchasePrice; 
        }
      }
      if (monthlyProfits[month]) {
        monthlyProfits[month] += profit;
      } else {
        monthlyProfits[month] = profit;
      }
    }
    let maxValue = -Infinity;
    let minValue = Infinity;
    let mostProfitableItem = null, leastProfitableItem = null;  

    for (const itemName in profitItems) {
      if (profitItems[itemName] > maxValue) {
        maxValue = profitItems[itemName];
        mostProfitableItem = itemName;
      } 
      if (profitItems[itemName] < minValue) {
        minValue = profitItems[itemName];
        leastProfitableItem = itemName;
      }
    }
    setMostProfitableItem(mostProfitableItem);
    setLeastProfitItem(leastProfitableItem);
    setProfitRation(Math.floor((totalPurchasePrice/totalSellPrice) * 100));

    if (bills.length>0){
      //   console.log(predictTotalEarning(bills));
      const data = bills.map(bill => {
        const month = new Date(bill.itemSaleDate).getMonth() + 1; // Adding 1 to get month in the range 1-12
        const totalBill = bill.totalBill;
        const billingTotalSellPrice = bill.billing.reduce((sum, item) => sum + item.itemTotalSellPrice, 0);
        return [month, totalBill, billingTotalSellPrice];
      }); 
  
      // Perform linear regression
      const result = regression.linear(data);
      const slope = result.equation[0];
      const intercept = result.equation[1];
  
      // Forecast the total earnings for the next month
      const currentMonth = new Date().getMonth() + 1;
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const forecastedTotalEarnings = slope * nextMonth + intercept;
  
      const nextMonthString = new Date(new Date().getFullYear(), nextMonth - 1, 1).toLocaleString('en-US', { month: 'long' });
      monthlyEarning[nextMonthString.split(" ")[1]] = forecastedTotalEarnings;
      const shortToFullMonthNames = {
        'Jan': 'January',
        'Feb': 'February',
        'Mar': 'March',
        'Apr': 'April',
        'May': 'May',
        'Jun': 'June',
        'Jul': 'July',
        'Aug': 'August',
        'Sep': 'September',
        'Oct': 'October',
        'Nov': 'November',
        'Dec': 'December'
      };
      setForcastedMonth(shortToFullMonthNames[nextMonthString.split(" ")[1]]);
      setForcastedEarning(Math.floor(forecastedTotalEarnings));
      }

      // Get the unique months from the bill objects
    const months = Object.keys(monthlyEarning);

    // Sort the months based on their index in the year
    months.sort((a, b) => new Date(Date.parse(`01 ${a} 2000`)) - new Date(Date.parse(`01 ${b} 2000`)));

    // Get the latest month
    var latestMonth = months[months.length - 2];

    

    // Calculate the total earning for the latest month
    setMonthlyEarning(monthlyEarning[latestMonth]);
    latestMonth = months[months.length-2];
    setMonthlyProfit(monthlyProfits[latestMonth]);

    // Create the EarningData1 object using the gathered sales data
    const EarningData1 = {
      labels: months,
      datasets: [
        {
          data: months.map(month => monthlyEarning[month])
        },
      ],
    };
    setlineData(EarningData1);
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
    } catch (error) {
      console.log(error + 1);
    }
  };

  const [showMenu, setShowMenu] = useState(false);
  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;

  const check = async () => {
    User.Name = await AsyncStorage.getItem("username");
  }

  useEffect(()=>{
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const todayFormatted = today.toISOString().split('T')[0];
    const sixMonthsAgoFormatted = sixMonthsAgo.toISOString().split('T')[0];
  
    handleGetBillsByDate(sixMonthsAgoFormatted, todayFormatted);
    check();
  }, []);

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

  return (
    <View style = {{height: '100%'}}>
      <NaviagtionScreen Title="Homepage"/>
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
        <ImageBackground source={require('../assets/background.png')}
        style={{ flex: 1, height: Dimensions.get('window').height }}>
          <View style={styles.header}>
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
              
              source = { showMenu ? require('../assets/closeMenu.png'): require('../assets/menu.png')}
              
              style={{
                width: showMenu ? 60: 40,
                height: showMenu ? 60: 40,
                marginLeft: 0,
                marginBottom: 30,
                marginRight: 20,
              }}
            />
            </TouchableOpacity>
            <Text style={styles.title}>Hello, {User.Name}</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.Overview}>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 20,
              }}>Overview</Text>
              <View style={styles.inputContainer}>
                <Text style={{fontWeight: 'bold'}}>Monthly Earning</Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}>
                <Text style={styles.labels}>Rs {monthlyEarning}</Text>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={{fontWeight: 'bold'}}>Monthly Profit</Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}>
                <Text style={styles.labels}>Rs {monthlyProfit}</Text>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={{fontWeight: 'bold'}}>Profit Ratio</Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}>
                <Text style={styles.labels}>{profitRatio}%</Text>
                </View>
              </View>
            </View>
            <View style={styles.chartsBody}>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 20,
                marginBottom: -10,
                marginTop: 25,
              }}>Forcasted Earning</Text>
              <View style={styles.inputContainer}>
                <Text style={{fontWeight: 'bold'}}>{forcastedMonth} Forcasted Earning: </Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}>
                <Text style={styles.labels}>Rs {forcastedEarning}</Text>
                </View>
              </View>
              <View style={styles.charts}>
              { bills.length > 0 ? (
              <LineChart
                withInnerLines={false}
                style={{marginTop: 20}}
                data={lineData}
                width={Dimensions.get("window").width/1.2}
                height={200}
                chartConfig={chartConfig}
                fromZero={true}
                bezier
                /> ) : (
                  <View style={styles.center}>
                    <Text style={{marginHorizontal: Dimensions.get("screen").width/8, marginBottom: 80, marginTop: 80, fontSize: 12,}}>Generate Bills to see forcasted earnings</Text>
                  </View>
                )}
              </View>
              {bills.length>0 ?(<Text style={{fontSize: 8}}>Note: Forcasted Earnings are not 100% accurate and its accuracy depends on the amount of data/bills it has.</Text>):(<View></View>)}
            </View>
            <View style={[styles.cardContainer, {marginTop: bills.length>0 ? 150: 0}]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.card}>
                    <Text style = {{fontSize: 12}}>Most Profitable Item</Text>
                    <Text style={{fontSize: 10}}>{profitableItem}</Text>
                  </View>
                  <View style={styles.card}>
                    <Text style = {{fontSize: 12}}>Least Profitable Item</Text>
                    <Text style={{fontSize: 10}}>{leastProfitItem}</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
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
    alignItems: 'center',
    paddingTop: 20,
    justifyContent: 'space-between'
  },
  labels: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartsBody: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  charts: {
    flexDirection: 'row',
    // alignItems: 'center',
    // alignContent: 'space-between',
    marginLeft: 20,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(0, 0, 0, 0)",
    padding: 20,
    marginTop: 20,
  },
  menuIcon: {
    width: 40,
    height: 40,
    marginRight: 30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    marginTop: '-8%'
  },
  body: {
    flex: 8,
    backgroundColor: "rgba(0, 0, 0, 0)",
    flexDirection: 'column',
  },
  cardContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    padding: 20,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
});

export default HomePage;
