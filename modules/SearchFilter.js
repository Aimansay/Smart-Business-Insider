import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import React from "react";

const SearchFilter = ({data, input, setSelectedItems, setClicked, selectedItems}) => {

    const addSelectedItem = ( barcode, itemName, itemCode, itemQuantity, itemSellPrice, itemPurchasePrice) => {
        const newItem = { barcode, itemName, itemCode, itemQuantity, itemSellPrice, itemPurchasePrice };
        setSelectedItems([...selectedItems, newItem]);
      };

    const handleSelection = (item) => {
        console.log(item.itemPurchasePrice);
        addSelectedItem(item.barcode,item.itemName,item.itemCode,1,item.itemSellPrice, item.itemPurchasePrice);
        setClicked(false);
      };
    return (
        <View style={{marginTop: 0, paddingHorizontal: 10, borderWidth: 1, width: '95%', marginLeft: 5, borderTopWidth: 0, borderRadius: 10, zIndex: 1, height: 150,}}>
            <FlatList
            data={data} renderItem={({item}) => {
                if(input=== "") {
                    return (
                        <TouchableOpacity onPress={() => {handleSelection(item)}}>
                        <View style={{marginVertical:10}}>
                            <Text style={{fontSize:14, fontWeight:'bold'}}>{item.itemName}</Text>
                            <Text style={{borderColor:"gray",borderWidth:1, height:1, marginTop:5}}/>
                        </View>
                        </TouchableOpacity>
                    )
                }
                if(item.name.toLowerCase().includes(input.toLowerCase())){
                    return (
                        <TouchableOpacity onPress={() => {handleSelection(item)}}>
                        <View style={{marginVertical:10}}>
                            <Text style={{fontSize:14, fontWeight:'bold'}}>{item.itemName}</Text>
                            <Text style={{borderColor:"gray",borderWidth:1, height:1, marginTop:5}}/>
                        </View>
                        </TouchableOpacity>
                    )
                } 
            }}/>
        </View>
    )
}

export default SearchFilter;