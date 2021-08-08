import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    tabContainer: {
      position: 'absolute',
      bottom: 0,
      ...ifIphoneX(
        {
          height: 68,
          marginBottom: 4
        },
        {
          height: 60,
        },
      ),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 0.2,
      borderTopColor: '#aaa',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      // backgroundColor: '#010101',
    },
    buttonContainer: {
      width: '20%',
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      ...ifIphoneX(
        {
          marginTop: -10
        },
      ),
    },
    title: {
      fontSize: 10,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      // color: '#fff',
      paddingTop: 2,
    },
    addContainer: {
      width: '70%',
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderLeftWidth: 4,
      borderRightWidth: 4,
      borderRadius: 10,
      borderLeftColor: '#69C9D0',
      borderRightColor: '#EE1D52',
      backgroundColor: '#FFF',
    },
    icon: {
      height: 28,
      width: 28,
    },
    addIcon: {
      height: 18,
      width: 18,
      tintColor: '#010101',
    },
    focusTintColor: {
      // tintColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      tintColor: '#010101',
      // tintColor: '#f5f5f5',
    },
    unFocusTintColor: {
      // tintColor: '#fff',
      tintColor: appStyles.colorSet[colorScheme].bottomTintColor,
    },
  });
};

export default dynamicStyles;
