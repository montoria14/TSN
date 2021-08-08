import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import VideoPlayer from '../VideoPlayer';
import { IMLocalized } from '../../../../Core/localization/IMLocalization';
import IMRichTextView from '../../../../Core/mentions/IMRichTextView/IMRichTextView';
import styles from './styles';
import AppStyles from '../../../../AppStyles';
import { useIsFocused } from '@react-navigation/native';

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

export default function FeedItem(props) {
  const {
    video,
    paused,
    selected,
    index,
    onReaction,
    onFeedUserItemPress,
    onCommentPress,
    setPaused,
    onSharePost,
    onTextFieldUserPress,
    onTextFieldHashTagPress,
    user,
    onDeletePost,
    onUserReport,
  } = props;

  let defaultReaction = 'heartUnfilled';

  const isFocused = useIsFocused();

  const [selectedIcon, setSelectedIcon] = useState(
    video.myReaction ? 'filledHeart' : defaultReaction,
  );
  const [reactionCount, setReactionCount] = useState(video.reactionsCount);

  useEffect(() => {
    if (!isFocused) {
      setPaused(true);
    }
  }, [isFocused]);

  useEffect(() => {
    setSelectedIcon(video.myReaction ? 'filledHeart' : defaultReaction);
  }, [video?.myReaction]);

  useEffect(() => {
    setReactionCount(video.reactionsCount);
  }, [video?.reactionsCount]);

  const moreRef = useRef();
  const moreArray = useRef([IMLocalized('Share Post')]);
  const isUserAuthor = video.authorID === user.id;

  useEffect(() => {
    if (isUserAuthor) {
      moreArray.current.push(IMLocalized('Delete Post'));
    } else {
      moreArray.current.push(IMLocalized('Block User'));
      moreArray.current.push(IMLocalized('Report Post'));
    }

    moreArray.current.push(IMLocalized('Cancel'));
  }, []);

  const onMorePress = () => {
    moreRef.current.show();
  };

  const onMoreDialogDone = (index) => {
    if (index === moreArray.current.indexOf(IMLocalized('Share Post'))) {
      onSharePost(video);
    }

    if (
      index === moreArray.current.indexOf(IMLocalized('Report Post')) ||
      index === moreArray.current.indexOf(IMLocalized('Block User'))
    ) {
      onUserReport(video, moreArray.current[index]);
    }

    if (index === moreArray.current.indexOf(IMLocalized('Delete Post'))) {
      onDeletePost(video);
    }
  };

  const onReactionPress = () => {
    if (video.myReaction) {
      setSelectedIcon('heartUnfilled');
      if (reactionCount > 0) {
        setReactionCount(reactionCount - 1);
      }
    } else {
      setSelectedIcon('filledHeart');
      setReactionCount(reactionCount + 1);
    }
    onReaction('like', video);
  };

  const onUserItemPress = (author) => {
    setPaused(true);
    onFeedUserItemPress(author);
  };

  const onComment = (video) => {
    setPaused(true);
    onCommentPress(video);
  };

  const onTextFieldUser = (textFieldUser) => {
    setPaused(true);
    onTextFieldUserPress(textFieldUser);
  };

  const onTextFieldHashTag = (hashTag) => {
    setPaused(true);
    onTextFieldHashTagPress(hashTag);
  };

  const firstname = video.author?.firstName ?? '';
  const lastname = video.author?.lastName ?? '';

  const username = video.author?.username
    ? `@${video.author?.username}`
    : `@${firstname?.toLowerCase()}${lastname?.toLowerCase()}`;

  return (
    <TouchableOpacity
      activeOpacity={1}
      key={video.id}
      onPress={() => setPaused((prevPaused) => !prevPaused)}
      style={styles.videoContent}>
      <VideoPlayer
        video={video.postMedia}
        paused={paused}
        isMounted={selected === index}
      />
      <View style={styles.contentRight}>
        <View style={styles.contentRightUser}>
          <TouchableOpacity
            onPress={() => onUserItemPress(video.author)}
            style={styles.contentRightUserImageContainer}>
            <Image
              style={styles.contentRightUserImage}
              resizeMode="cover"
              source={{ uri: video.author.profilePictureURL || defaultAvatar }}
            />
          </TouchableOpacity>
          <View style={styles.contentRightUserPlus}>
            <Image style={styles.plusIcon} source={AppStyles.iconSet.add} />
          </View>
        </View>

        <TouchableOpacity
          onPress={onReactionPress}
          style={styles.iconRightContainer}>
          <Image
            style={[
              styles.iconRight,
              selectedIcon !== 'heartUnfilled' && styles.iconLike,
            ]}
            source={AppStyles.iconSet.heartFilled}
          />

          <Text style={styles.contentRightText}>
            {reactionCount > 1000 ? `${reactionCount}K` : reactionCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onComment(video)}
          style={styles.iconRightContainer}>
          <Image
            style={styles.iconRight}
            source={AppStyles.iconSet.commentFilled}
          />
          <Text style={styles.contentRightText}>
            {video.commentCount > 1000
              ? `${video.commentCount}K`
              : video.commentCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onMorePress(video)}
          style={styles.iconRightContainer}>
          <Image
            style={styles.iconRight}
            source={
              isUserAuthor ? AppStyles.iconSet.more : AppStyles.iconSet.share
            }
          />
        </TouchableOpacity>
      </View>
      <View style={styles.contentLeftBottom}>
        <TouchableOpacity onPress={() => onUserItemPress(video.author)}>
          <Text style={styles.contentLeftBottomNameUserText} numberOfLines={1}>
            {username}
          </Text>
        </TouchableOpacity>
        <IMRichTextView
          defaultTextStyle={styles.contentLeftBottomDescription}
          usernameStyle={styles.username}
          hashTagStyle={styles.hashTag}
          onUserPress={onTextFieldUser}
          onHashTagPress={onTextFieldHashTag}>
          {video.postText || ' '}
        </IMRichTextView>
        {video.song && (
          <View style={styles.contentLeftBottomMusicContainer}>
            <Image
              source={AppStyles.iconSet.musicalNotes}
              style={styles.musicIcon}
            />
            <Text style={styles.contentLeftBottomMusic} numberOfLines={1}>
              {video.song?.title}
            </Text>
          </View>
        )}
      </View>
      <ActionSheet
        ref={moreRef}
        title={IMLocalized('More')}
        options={moreArray.current}
        destructiveButtonIndex={moreArray.current.indexOf('Delete Post')}
        cancelButtonIndex={moreArray.current.length - 1}
        onPress={onMoreDialogDone}
      />
    </TouchableOpacity>
  );
}
