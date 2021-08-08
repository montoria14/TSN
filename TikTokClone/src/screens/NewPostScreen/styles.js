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
    centerContainer: {
      alignSelf: 'center',
      width: '90%',
    },
    captionAvatarContainer: {
      flexDirection: 'row',
      paddingVertical: 20,
    },
    avatarContainer: {
      flex: 2,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
    },
    captionContainer: {
      flex: 6,
    },
    textInput: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 18,
      paddingTop: 10,
      textAlignVertical: 'top',
      height: avatarSize * 1.1,
    },

    locationContainer: {
      paddingVertical: 9,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].hairlineColor,
    },
    addLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addLocationContainerTitle: {
      flex: 6,
    },
    addLocationTitle: {
      fontSize: 17,
      paddingVertical: 8,
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    locationTitle: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 17,
      paddingVertical: 3,
    },
    locationDetail: {
      color: appStyles.colorSet[colorScheme].subTextColor,
      fontSize: 17,
    },
    suggestedLoationTitle: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    addLocationIconContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    addLocationIcon: {
      width: 16,
      height: 16,
    },
    cancelIcon: {
      width: 9,
      height: 9,
    },

    suggestedLocationConatainer: {
      marginTop: 19,
      paddingLeft: 20,
    },
    suggestedLoationItemContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].borderColor,
      borderRadius: 7,
      padding: 8,
      marginRight: 10,
    },
    buttonText: {
      fontSize: 17,
      paddingHorizontal: 18,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontWeight: '400',
    },
    blueText: {
      color: '#3d8fe1',
    },
  });
};

export default dynamicStyles;
