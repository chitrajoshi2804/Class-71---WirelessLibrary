import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
//type 'npm install react-navigation' in the terminal to install and use the library in the code
import {createAppContainer} from 'react-navigation';
//type 'npm install react-navigation-tabs' in the terminal to install and use the library in the code
import {createBottomTabNavigator} from 'react-navigation-tabs';

import BookTransactionScreen from './Screens/BookTransactionScreen';
import SearchScreen from './Screens/SearchScreen';


export default class App extends React.Component {
  render()
  {
    return(
      <AppContainer/>
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Transaction : {screen : BookTransactionScreen},
  Search : {screen : SearchScreen}
},
{
  defaultNavigationOptions : ({navigation}) => ({
    tabBarIcon : ({}) => {
      const routeName = navigation.state.routeName;
      if(routeName === "Transaction"){
        return (
          <Image
          source = {require('./assets/transactionIcon.png')}
          style  = {styles.image}/>
        )
      }
      else if(routeName === "Search"){
        return (
          <Image
          source = {require('./assets/searchIcon.png')}
          style  = {styles.image}/>
        )
      }
    }
  })
})

const AppContainer = createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  image : {
    height : 40,
    width : 40
  }
})
