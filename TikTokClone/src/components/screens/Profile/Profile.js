import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';
import AppStyles from '../../../AppStyles';
import { TNStoryItem } from '../../../Core/truly-native';
import TNVideo from '../../../Core/truly-native/TNVideo/TNVideo';
import { IMLocalized } from '../../../Core/localization/IMLocalization';

export default function Profile(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const currentTheme = AppStyles.navThemeConstants[colorScheme];

  const {
    profilePosts,
    isOtherUser,
    hasBottomTab,
    user,
    followingCount,
    followersCount,
    likesCount,
    mainButtonTitle,
    onMainButtonPress,
    onFollowingButtonPress,
    onFollowersButtonPress,
    startUpload,
    removePhoto,
    onFeedItemPress,
  } = props;

  const navigation = useNavigation();

  const updatePhotoDialogActionSheet = useRef();
  const photoUploadDialogActionSheet = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, [navigation, colorScheme]);

  const onProfilePicturePress = () => {
    if (isOtherUser) {
      return;
    }
    updatePhotoDialogActionSheet.current.show();
  };

  const onUpdatePhotoDialogDone = (index) => {
    if (index === 0) {
      photoUploadDialogActionSheet.current.show();
    }

    if (index === 1) {
      removePhoto();
    }
  };

  const onPhotoUploadDialogDone = (index) => {
    if (index === 0) {
      onLaunchCamera();
    }

    if (index === 1) {
      onOpenPhotos();
    }
  };

  const onLaunchCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then((image) => {
      startUpload(image);
    });
  };

  const onOpenPhotos = () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then((image) => {
      startUpload(image);
    });
  };

  const firstname = user?.firstName ?? '';
  const lastname = user?.lastName ?? '';

  const username = user?.username
    ? `@${user?.username}`
    : `@${firstname?.toLowerCase()}${lastname?.toLowerCase()}`;

  const renderListHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TNStoryItem
          item={user}
          imageStyle={styles.userImage}
          imageContainerStyle={styles.userImageContainer}
          containerStyle={styles.userImageMainContainer}
          activeOpacity={1}
          onPress={onProfilePicturePress}
          appStyles={AppStyles}
        />
        <Text style={styles.userName}>{username}</Text>
        <View style={styles.userFollowers}>
          <TouchableOpacity
            onPress={onFollowingButtonPress}
            style={styles.userFollowersText}>
            <Text style={styles.userFollowersTextNumber}>{followingCount}</Text>
            <Text style={styles.userFollowersTextDesc}>
              {IMLocalized('Following')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onFollowersButtonPress}
            style={styles.userFollowersText}>
            <Text style={styles.userFollowersTextNumber}>{followersCount}</Text>
            <Text style={styles.userFollowersTextDesc}>
              {IMLocalized('Followers')}
            </Text>
          </TouchableOpacity>
          <View style={styles.userFollowersText}>
            <Text style={styles.userFollowersTextNumber}>{likesCount}</Text>
            <Text style={styles.userFollowersTextDesc}>
              {IMLocalized('Likes')}
            </Text>
          </View>
        </View>
        <View style={styles.editProfile}>
          <TouchableOpacity
            onPress={onMainButtonPress}
            style={styles.buttonEditProfile}>
            <Text style={styles.buttonEditProfileText}>{mainButtonTitle}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index + ''}
        onPress={() => onFeedItemPress(index)}
        style={styles.videoContainer}>
        <TNVideo
          style={styles.video}
          rate={1.0}
          volume={1.0}
          shouldPlay={false}
          useNativeControls={false}
          source={{ uri: item?.postMedia?.url }}
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={profilePosts}
        style={hasBottomTab ? styles.scrollContainer : styles.container}
        keyExtractor={(item, index) => item.id ?? index?.toString()}
        ListHeaderComponent={renderListHeader}
        numColumns={3}
        renderItem={renderItem}
      />
      <ActionSheet
        ref={updatePhotoDialogActionSheet}
        title={IMLocalized('Profile Picture')}
        options={[
          IMLocalized('Change Photo'),
          IMLocalized('Remove'),
          IMLocalized('Cancel'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={onUpdatePhotoDialogDone}
      />
      <ActionSheet
        ref={photoUploadDialogActionSheet}
        title={IMLocalized('Select Photo')}
        options={[
          IMLocalized('Camera'),
          IMLocalized('Library'),
          IMLocalized('Cancel'),
        ]}
        cancelButtonIndex={2}
        onPress={onPhotoUploadDialogDone}
      />
    </SafeAreaView>
  );
}
