import React, { useLayoutEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native-appearance';
import TNVideo from '../../../Core/truly-native/TNVideo/TNVideo';
import dynamicStyles from './styles';
import AppStyles from '../../../AppStyles';

export default function Discover(props) {
  const { onCategoryPress, onCategoryItemPress, feed } = props;

  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const currentTheme = AppStyles.navThemeConstants[colorScheme];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {feed.map((category, index) => (
          <View key={index.toString()} style={styles.categoryPrimary}>
            <View style={styles.categoryMain}>
              <View style={styles.categoryHashtagIcon}>
                <Image
                  style={styles.icon}
                  source={AppStyles.iconSet.hashtagSymbol}
                />
              </View>
              <View style={styles.categoryDetail}>
                <Text style={styles.categoryName}>{category.hashtag}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description ?? 'Trending'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onCategoryPress(category.videos)}
                style={styles.categoryRightIcon}>
                <Image
                  style={styles.icon}
                  source={AppStyles.iconSet.rightArrow}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.categoryVideo}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {category.videos.map((video, key) => (
                  <TouchableOpacity
                    key={video.id ?? key}
                    onPress={() => onCategoryItemPress(category.videos, key)}>
                    <TNVideo
                      style={styles.video}
                      rate={1.0}
                      volume={1.0}
                      shouldPlay={false}
                      useNativeControls={false}
                      source={{ uri: video.postMedia.url }}
                      resizeMode={'cover'}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
