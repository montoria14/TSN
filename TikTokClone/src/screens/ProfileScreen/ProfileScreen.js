import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSelector, ReactReduxContext, useDispatch } from 'react-redux';
import { Profile } from '../../components';
import { userAPIManager } from '../../Core/api/';
import { friendship } from '../../Core/socialgraph/friendships/api/';
import { storageAPI } from '../../Core/api/';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { setUserData } from '../../Core/onboarding/redux/auth';
import { FriendshipConstants } from '../../Core/socialgraph/friendships';
import { postAPIManager } from '../../Core/socialgraph/feed/api/';
import { FriendshipManager } from '../../Core/socialgraph/friendships/api';
import { FeedManager } from '../../Core/socialgraph/feed/api/';
import { Appearance } from 'react-native-appearance';
import appConfig from '../../TikTokCloneConfig';
import AppStyles from '../../AppStyles';

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

const ProfileScreen = (props) => {
  const { store } = useContext(ReactReduxContext);

  let colorScheme = Appearance.getColorScheme();
  let currentTheme = AppStyles.navThemeConstants[colorScheme];

  const otherUser = props.route?.params?.user;
  const hasBottomTab = props.route?.params?.hasBottomTab;

  const friends = useSelector((state) => state.friends.friends);
  const currentUser = useSelector((state) => state.auth.user);
  const friendships = useSelector((state) => state.friends.friendships);
  const currentUserFeedPosts = useSelector(
    (state) => state.feed.currentUserFeedPosts,
  );
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePosts, setProfilePosts] = useState(null);
  const [shouldAddFriend, setShouldAddFriend] = useState(null);
  const [inboundFriendsCount, setInboundFriendsCount] = useState('0');
  const [outboundFriendsCount, setOutboundFriendsCount] = useState('0');
  const [likesCount, setLikesCount] = useState('0');
  const [mainButtonTitle, setMainButtonTitle] = useState('');

  const feedManager = useRef(null);
  const friendshipManager = useRef(null);
  const currentProfileFeedUnsubscribe = useRef(null);
  const currentUserUnsubscribe = useRef(null);

  useEffect(() => {
    feedManager.current = new FeedManager(store, currentUser.id);
    feedManager.current.subscribeIfNeeded();

    friendshipManager.current = new FriendshipManager(
      false,
      onFriendshipsRetrieved,
    );
    if (otherUser && otherUser.id && otherUser.id != currentUser.id) {
      let profileUserID = otherUser.id;
      currentProfileFeedUnsubscribe.current = postAPIManager?.subscribeToProfileFeedPosts(
        profileUserID,
        onProfileFeedUpdate,
      );
      currentUserUnsubscribe.current = userAPIManager?.subscribeCurrentUser(
        profileUserID,
        onCurrentUserUpdate,
      );
      setIsLoading(true);
      friendshipManager.current.fetchFriendships(otherUser.id);
      setOutboundFriendsCount(otherUser.outboundFriendsCount ?? 0);
      setInboundFriendsCount(otherUser.inboundFriendsCount ?? 0);
    } else {
      currentProfileFeedUnsubscribe.current = postAPIManager?.subscribeToProfileFeedPosts(
        currentUser.id,
        onProfileFeedUpdate,
      );
      currentUserUnsubscribe.current = userAPIManager?.subscribeCurrentUser(
        currentUser.id,
        onCurrentUserUpdate,
      );
      friendshipManager.current.fetchFriendships(currentUser.id);

      const filteredFeed = filterNonVideoFeed(
        feedManager.current.hydratePostsWithReduxReactions(
          currentUserFeedPosts,
        ),
      );

      setProfilePosts(filteredFeed);
      setOutboundFriendsCount(currentUser.outboundFriendsCount ?? 0);
      setInboundFriendsCount(currentUser.inboundFriendsCount ?? 0);

      setIsLoading(true);
    }
    return () => {
      currentProfileFeedUnsubscribe.current &&
        currentProfileFeedUnsubscribe.current();
      currentUserUnsubscribe.current && currentUserUnsubscribe.current();
      friendshipManager.current && friendshipManager.current.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (otherUser && otherUser.id != currentUser.id) {
      return;
    }

    setOutboundFriendsCount(currentUser.outboundFriendsCount ?? 0);
    setInboundFriendsCount(currentUser.inboundFriendsCount ?? 0);
  }, [currentUser.outboundFriendsCount, currentUser.inboundFriendsCount]);

  useEffect(() => {
    if (!friendships) {
      return;
    }
    if (shouldAddFriend === null) {
      setShouldAddFriend(
        otherUser
          ? !friendships.find((friend) => friend?.user?.id === otherUser?.id)
          : false,
      );
    }
  }, [friendships]);

  useEffect(() => {
    if (!otherUser) {
      setMainButtonTitle(IMLocalized('Edit profile'));
      return;
    }
    if (otherUser && shouldAddFriend !== null) {
      if (shouldAddFriend) {
        setMainButtonTitle(IMLocalized('Follow'));
        return;
      }
      setMainButtonTitle(IMLocalized('Message'));
    }
  }, [shouldAddFriend]);

  useEffect(() => {
    if (!profilePosts?.length) {
      return;
    }
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const likes = profilePosts.map((profilePost) => profilePost.reactionsCount);

    setLikesCount(likes.reduce(reducer));
  }, [profilePosts]);

  const filterNonVideoFeed = (profileFeedPosts) => {
    if (!profileFeedPosts) {
      return [];
    }
    return profileFeedPosts.filter((profileFeedPost) => {
      return profileFeedPost?.postMedia?.mime?.includes('video');
    });
  };

  const onFriendshipsRetrieved = (
    mutualFriendships,
    inboundFriendships,
    outboundFriendships,
  ) => {
    setLoading(false);
    // setFriendsUi(mutualFriendships.map((friendship) => friendship.user));
  };

  const onCurrentUserUpdate = (currentUser) => {};

  const onProfileFeedUpdate = (profileFeedPosts) => {
    const filteredFeed = filterNonVideoFeed(
      feedManager.current.hydratePostsWithReduxReactions(profileFeedPosts),
    );

    setProfilePosts(filteredFeed);

    setLoading(false);
  };

  const onMainButtonPress = () => {
    if (shouldAddFriend) {
      onAddFriend();
      return;
    }
    if (otherUser) {
      onMessage();
      return;
    }
    props.navigation.navigate('ProfileSettings', {
      appStyles: AppStyles,
      appConfig: appConfig,
      // screenTitle: IMLocalized('Edit Profile'),
    });
  };

  const onMessage = () => {
    const viewer = currentUser;
    const viewerID = viewer.id || viewer.userID;
    const friendID = otherUser.id || otherUser.userID;
    let channel = {
      id: viewerID < friendID ? viewerID + friendID : friendID + viewerID,
      participants: [otherUser],
    };
    props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: AppStyles,
    });
  };

  const onAddFriend = () => {
    const newFriendId = otherUser.id || otherUser.userID;
    setShouldAddFriend(false);

    friendship.addFriendRequest(
      currentUser,
      otherUser,
      true,
      false,
      true,
      ({ success, error }) => {
        if (error) {
          alert(error);
          setShouldAddFriend(true);
        } else {
          const newFriendId = otherUser.id || otherUser.userID;
          const detectedFriendship = friendships.find(
            (friendship) =>
              friendship.user.id == newFriendId &&
              friendship.type == FriendshipConstants.FriendshipType.reciprocal,
          );
          if (detectedFriendship) {
            friendship.updateFeedsForNewFriends(currentUser.id, newFriendId);
          }
        }
      },
    );
  };

  const startUpload = async (source) => {
    dispatch(
      setUserData({
        user: { ...currentUser, profilePictureURL: source.sourceURL },
        profilePictureURL: source?.path || source.uri,
      }),
    );

    storageAPI.processAndUploadMediaFile(source).then((response) => {
      if (response.error) {
        alert(
          IMLocalized(
            'Oops! An error occured while trying to update your profile picture. Please try again.',
          ),
        );
      } else {
        const data = {
          profilePictureURL: response.downloadURL,
        };
        dispatch(
          setUserData({
            user: { ...currentUser, profilePictureURL: response.downloadURL },
          }),
        );

        userAPIManager?.updateUserData(currentUser.id, data);
      }
    });
  };

  const removePhoto = async () => {
    const res = await userAPIManager?.updateUserData(currentUser.id, {
      profilePictureURL: defaultAvatar,
    });
    if (res.success) {
      dispatch(
        setUserData({
          user: { ...currentUser, profilePictureURL: defaultAvatar },
        }),
      );
    } else {
      alert(
        IMLocalized(
          'Oops! An error occured while trying to remove your profile picture. Please try again.',
        ),
      );
    }
  };

  const onEmptyStatePress = () => {
    props.navigation.navigate('CreatePost');
  };

  const onFollowersButtonPress = () => {
    props.navigation.push('AllFriends', {
      title: IMLocalized('Followers'),
      otherUser: otherUser ?? currentUser,
      includeInbound: true,
      appStyles: AppStyles,
      followEnabled: true,
    });
  };

  const onFeedItemPress = (profileFeedItemIndex) => {
    props.navigation.push('DiscoverFeed', {
      altFeed: profilePosts,
      feedStartIndex: profileFeedItemIndex,
    });
  };

  const onFollowingButtonPress = () => {
    props.navigation.push('AllFriends', {
      // channels: this.props.channels,
      title: 'Following',
      otherUser: otherUser ?? currentUser,
      includeOutbound: true,
      appStyles: AppStyles,
      followEnabled: true,
    });
  };

  //
  return (
    <Profile
      profilePosts={profilePosts}
      user={otherUser ? otherUser : currentUser}
      onFollowingButtonPress={onFollowingButtonPress}
      onFollowersButtonPress={onFollowersButtonPress}
      followingCount={outboundFriendsCount}
      followersCount={inboundFriendsCount}
      likesCount={likesCount}
      mainButtonTitle={mainButtonTitle}
      onMainButtonPress={onMainButtonPress}
      isOtherUser={otherUser}
      hasBottomTab={hasBottomTab}
      onFeedItemPress={onFeedItemPress}
      startUpload={startUpload}
      removePhoto={removePhoto}
    />
  );
};

export default ProfileScreen;
