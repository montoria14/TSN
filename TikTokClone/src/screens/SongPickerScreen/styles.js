import { Dimensions, StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const { width } = Dimensions.get('window');

const avatarSize = 80;

const dynamicStyles = (colorScheme, appStyles) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    listContainer: {
      width: '90%',
      height: 300,
      alignSelf: 'center',
      paddingTop: 10,
    },
    itemContainer: {
      height: 80,
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'pink',
    },
    itemImageContainer: {
      flex: 1.4,
    },
    itemImage: {
      width: 65,
      height: 65,
      borderRadius: 4,
    },
    itemDecriptionContainer: {
      flex: 5,
    },
    itemTitle: {
      paddingLeft: 10,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 14,
      fontWeight: '600',
    },
    itemArtiste: {
      paddingLeft: 10,
      fontSize: 12,
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
      paddingTop: 4,
    },
    itemDuration: {
      paddingLeft: 10,
      fontSize: 12,
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
      paddingTop: 4,
    },
    selectIconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectIcon: {
      width: 35,
      height: 35,
    },
  });
};

export default dynamicStyles;
