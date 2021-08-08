import React, { useRef, useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { Video } from 'expo-av';
import { useColorScheme } from 'react-native-appearance';
import { useSelector } from 'react-redux';
import TNActivityIndicator from '../../Core/truly-native/TNActivityIndicator';
import { storageAPI } from '../../Core/api/';
import { postAPIManager } from '../../Core/socialgraph/feed/api/';
import { IMRichTextInput, IMMentionList, EU } from '../../Core/mentions';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { friendshipUtils } from '../../Core/socialgraph/friendships';
import { NavBar } from '../../components';
import dynamicStyles from './styles';
import AppStyles from '../../AppStyles';

export default function NewPost(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme, AppStyles);
  const route = props.route.params;
  const media = route.media;
  const song = route.song;

  const friends = useSelector((state) => state.friends.friends);
  const friendships = useSelector((state) => state.friends.friendships);
  const currentUser = useSelector((state) => state.auth.user);

  const [keyword, setKeyword] = useState('');
  const [isTrackingStarted, setIsTrackingStarted] = useState(false);
  const [friendshipData, setFriendshipData] = useState([]);
  const [showUsersMention, setShowUsersMention] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(true);
  const [loading, setLoading] = useState(false);

  const textInputRef = useRef();
  const editorRef = useRef();
  const newPost = useRef();

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const formattedFriends = friends.map((friend) => {
      const name = `${friend.firstName} ${friend.lastName}`;
      const username = `${friend.firstName}.${friend.lastName}`;
      const id = friend.id || friend.userID;

      return { id, name, username, ...friend };
    });
    setFriendshipData(formattedFriends);
  }, []);

  const findHashtags = (post) => {
    const regexp = /(\s|^)\#\w\w+\b/gm;
    let result = post?.match(regexp);
    if (result) {
      result = result.map((text) => text.trim());
      return result;
    } else {
      return [];
    }
  };

  const onDismiss = () => {
    props.navigation.goBack();
  };

  const onShare = () => {
    setLoading(true);
    const hashtags = findHashtags(newPost.current.postText);
    const tempPost = {
      ...newPost.current,
      authorID: currentUser.id,
      hashtags,
      postMedia: media,
    };
    if (song) {
      tempPost.song = song;
    }

    startPostUpload(tempPost);
  };

  const startPostUpload = async (postToUpload) => {
    storageAPI
      .processAndUploadMediaFile(postToUpload.postMedia)
      .then(async (response) => {
        if (!response.error) {
          postToUpload.postMedia = {
            url: response.downloadURL,
            thumbnailURL: response.thumbnailURL,
            mime: postToUpload.postMedia.mime,
            rate: postToUpload.postMedia.rate,
          };
          await postAPIManager?.addPost(
            postToUpload,
            friendshipUtils.getFollowerIDs(friendships, friends, false),
            currentUser,
          );
          setLoading(false);
          onDismiss();
        } else {
          alert(
            IMLocalized(
              'Oops! An error occured while uploading your post. Please try again.',
            ),
          );
        }
      });
  };

  const onChangeText = ({ displayText, text }) => {
    const mentions = EU.findMentions(text);
    newPost.current = {
      ...newPost.current,
      postText: text,
      displayText,
      commentCount: 0,
      reactionsCount: 0,
      reactions: {
        like: 0,
      },
      mentions,
    };
  };

  const onVideoLoad = () => {
    setShouldPlayVideo(false);
  };

  const editorStyles = {
    input: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
    },
    mainContainer: {
      width: '100%',
    },
  };

  return (
    <View style={styles.container}>
      <NavBar
        headerTitle={IMLocalized('New post')}
        headerLeftTitle={IMLocalized('Cancel')}
        headerRightTitle={IMLocalized('Share')}
        onHeaderLeftPress={onDismiss}
        onHeaderRightPress={onShare}
      />
      <View style={[styles.captionAvatarContainer, styles.centerContainer]}>
        <View style={styles.avatarContainer}>
          <Video
            style={styles.avatar}
            source={{ uri: media?.uri }}
            shouldPlay={shouldPlayVideo}
            isMuted={true}
            resizeMode={'cover'}
            onLoad={onVideoLoad}
          />
        </View>
        <View style={styles.captionContainer}>
          <IMRichTextInput
            richTextInputRef={editorRef}
            inputRef={textInputRef}
            list={friendshipData}
            mentionListPosition={'bottom'}
            // initialValue={initialValue}
            // clearInput={this.state.clearInput}
            onChange={onChangeText}
            showEditor={true}
            toggleEditor={() => {}}
            editorStyles={editorStyles}
            showMentions={showUsersMention}
            onHideMentions={() => setShowUsersMention(false)}
            onUpdateSuggestions={setKeyword}
            onTrackingStateChange={setIsTrackingStarted}
            appStyles={AppStyles}
          />
        </View>
        <IMMentionList
          containerStyle={styles.container}
          list={friendshipData}
          keyword={keyword}
          isTrackingStarted={isTrackingStarted}
          onSuggestionTap={editorRef.current?.onSuggestionTap}
          appStyles={AppStyles}
        />
      </View>
      {loading && <TNActivityIndicator appStyles={AppStyles} />}
    </View>
  );
}
