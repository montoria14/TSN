import React, { useEffect, useContext, useState, useRef } from 'react';
import { View, Share, StatusBar } from 'react-native';
import { useSelector, ReactReduxContext } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { Feed } from '../../components';
import { FeedManager } from '../../Core/socialgraph/feed/api/';
import { FriendshipAPITracker } from '../../Core/socialgraph/friendships/api/';
import { commentAPIManager } from '../../Core/socialgraph/feed/api/';
import { postAPIManager } from '../../Core/socialgraph/feed/api/';
import styles from './styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { reportingManager } from '../../Core/user-reporting';
import CommentsScreen from '../CommentsScreen/CommentsScreen';

const FeedScreen = (props) => {
  const altFeed = props.route?.params?.altFeed;
  const feedStartIndex = props.route?.params?.feedStartIndex;

  const isFocused = useIsFocused();

  const currentUser = useSelector((state) => state.auth.user);
  const friends = useSelector((state) => state.friends.friends);
  const friendships = useSelector((state) => state.friends.friendships);
  const mainFeedPosts = useSelector((state) => state.feed.mainFeedPosts);
  const discoverFeedPosts = useSelector(
    (state) => state.feed.discoverFeedPosts,
  );

  const { store } = useContext(ReactReduxContext);
  const followTracker = useRef(
    new FriendshipAPITracker(
      store,
      currentUser.id || currentUser.userID,
      true,
      true,
      true,
    ),
  ).current;
  const feedManager = useRef(new FeedManager(store, currentUser.id)).current;

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [feedType, setFeedType] = useState('following');
  const [feed, setFeed] = useState({
    following: null,
    forYou: null,
  });

  useEffect(() => {
    if (isFocused) {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('default');
    }
  }, [isFocused]);

  useEffect(() => {
    followTracker.subscribeIfNeeded();

    return () => {
      followTracker && followTracker.unsubscribe();
      feedManager && feedManager.unsubscribe();
    };
  }, []);

  useEffect(() => {
    feedManager.subscribeIfNeeded();
  }, [friends]);

  useEffect(() => {
    if (mainFeedPosts) {
      const filteredFeed = filterNonVideoFeed(mainFeedPosts);

      setFeed((prevFeed) => ({
        ...prevFeed,
        following: filteredFeed,
      }));
    }
  }, [mainFeedPosts]);

  useEffect(() => {
    if (discoverFeedPosts) {
      const filterOutPost = filterOutUserPost(discoverFeedPosts);
      const filteredFeed = filterNonVideoFeed(filterOutPost);
      setFeed((prevFeed) => ({
        ...prevFeed,
        forYou: filteredFeed,
      }));
    }
  }, [discoverFeedPosts]);

  useEffect(() => {
    const followingFeedLength = feed?.following?.length;

    if (followingFeedLength === 0) {
      setFeedType('forYou');
    }
    // setLoading(false);
    // setIsFetching(false);
  }, [feed]);

  useEffect(() => {
    if (selectedItem) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedItem]);

  const filterOutUserPost = (feedPosts) => {
    return feedPosts.filter((post) => {
      return (
        post &&
        post.authorID != currentUser.id &&
        post.author &&
        (!friends || !friends.find((friend) => friend.id == post.authorID))
      );
    });
  };

  const filterNonVideoFeed = (feedPosts) => {
    return feedPosts.filter((feedPost) => {
      return feedPost?.postMedia?.mime?.includes('video');
    });
  };

  const onCommentPress = (item) => {
    setSelectedItem(item);
    // props.navigation.navigate('Comments', {
    //   item: item,
    // });
  };

  const handleUserPress = (userInfo) => {
    if (userInfo.id === currentUser.id) {
      props.navigation.push('Profile');
    } else {
      props.navigation.push('Profile', {
        user: userInfo,
      });
    }
  };

  const onFeedUserItemPress = async (item) => {
    handleUserPress(item);
  };

  const onTextFieldUserPress = (userInfo) => {
    handleUserPress(userInfo);
  };

  const onTextFieldHashTagPress = (hashtag) => {
    props.navigation.push('FeedSearch', { hashtag });
  };

  const onReaction = async (reaction, item) => {
    feedManager.applyReaction(reaction, item);
    await commentAPIManager.handleReaction(reaction, currentUser, item, true);
  };

  const onSharePost = async (item) => {
    let url = '';
    if (item.postMedia) {
      url = item.postMedia.url;
    }
    try {
      const result = await Share.share(
        {
          title: IMLocalized('Share Instamobile post.'),
          url,
        },
        {
          dialogTitle: IMLocalized('Share Instamobile post.'),
        },
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const onDeletePost = async (item) => {
    const res = await postAPIManager?.deletePost(item, true);
    if (res.error) {
      alert(res.error);
    }
  };

  const onUserReport = async (item, type) => {
    reportingManager.markAbuse(currentUser.id, item.authorID, type);
  };

  const onDismiss = () => {
    setSelectedItem(null);
  };

  const onForYouFeedPress = () => {
    setFeedType('forYou');
  };

  const onFollowingFeedPress = () => {
    setFeedType('following');
  };

  return (
    <View style={styles.container}>
      <Feed
        loading={loading}
        feed={altFeed ?? feed[feedType]}
        onCommentPress={onCommentPress}
        user={currentUser}
        onFeedUserItemPress={onFeedUserItemPress}
        onReaction={onReaction}
        isFetching={isFetching}
        onSharePost={onSharePost}
        onDeletePost={onDeletePost}
        onUserReport={onUserReport}
        navigation={props.navigation}
        startIndex={feedStartIndex}
        onTextFieldUserPress={onTextFieldUserPress}
        onTextFieldHashTagPress={onTextFieldHashTagPress}
        onFollowingFeedPress={onFollowingFeedPress}
        onForYouFeedPress={onForYouFeedPress}
        isForYouFeed={feedType === 'forYou'}
        isFollowingDisabled={(feed.following ?? []).length < 1}
      />
      <CommentsScreen
        item={selectedItem}
        onDismiss={onDismiss}
        isVisible={isVisible}
      />
    </View>
  );
};

export default FeedScreen;
