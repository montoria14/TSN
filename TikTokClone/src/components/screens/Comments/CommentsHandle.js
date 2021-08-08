import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';
import AppStyles from '../../../AppStyles';

export default function CommentsHandle(props) {
  const { onDismiss, title } = props;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  return (
    <View style={styles.handleContainer}>
      <View style={styles.handleLeftContainer} />
      <View style={styles.handleTitleContainer}>
        <Text style={styles.handleTitle}>{title}</Text>
      </View>
      <View style={styles.handleRightContainer}>
        <TouchableOpacity onPress={onDismiss}>
          <Image
            style={styles.handleRightIcon}
            source={AppStyles.iconSet.delete}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
