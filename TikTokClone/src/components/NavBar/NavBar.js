import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';
import AppStyles from '../../AppStyles';

export default function NavBar(props) {
  const {
    headerTitle,
    headerLeftTitle,
    headerRightTitle,
    onHeaderLeftPress,
    onHeaderRightPress,
  } = props;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme, AppStyles);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={headerLeftTitle && onHeaderLeftPress}
        activeOpacity={0.8}
        style={[styles.leftContainer, styles.textContainer]}>
        <Text style={styles.text}>{headerLeftTitle}</Text>
      </TouchableOpacity>
      <View style={[styles.titleContainer, styles.textContainer]}>
        <Text style={styles.text}>{headerTitle}</Text>
      </View>
      <TouchableOpacity
        onPress={headerRightTitle && onHeaderRightPress}
        activeOpacity={0.8}
        style={[styles.rightContainer, styles.textContainer]}>
        <Text style={[styles.text, styles.nextText]}>{headerRightTitle}</Text>
      </TouchableOpacity>
    </View>
  );
}
