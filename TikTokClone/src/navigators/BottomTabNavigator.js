import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  InnerFeedNavigator,
  InnerChatSearchNavigator,
  // InnerFriendsSearchNavigator,
  InnerDiscoverNavigator,
  InnerProfileNavigator,
} from './InnerStackNavigators';
// import {TabBarBuilder} from '../Core/ui';
import { CustomBottomTabs } from '../components';
import TikTokCloneConfig from '../TikTokCloneConfig';
import AppStyles from '../AppStyles';

const BottomTab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        title: route.name,
      })}
      tabBar={({ state, route, navigation }) => (
        <CustomBottomTabs
          tabIcons={TikTokCloneConfig.tabIcons}
          appStyles={AppStyles}
          route={route}
          state={state}
          navigation={navigation}
        />
      )}
      initialRouteName="Feed">
      <BottomTab.Screen name="Feed" component={InnerFeedNavigator} />
      <BottomTab.Screen name="Discover" component={InnerDiscoverNavigator} />
      <BottomTab.Screen name="Inbox" component={InnerChatSearchNavigator} />
      {/* <BottomTab.Screen
        name="Friends"
        component={InnerFriendsSearchNavigator}
      /> */}
      <BottomTab.Screen name="Profile" component={InnerProfileNavigator} />
    </BottomTab.Navigator>
  );
};
export default BottomTabNavigator;
