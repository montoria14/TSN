import React, { useContext, useState, useEffect, useRef } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import { Discover } from '../../components';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { FeedManager } from '../../Core/socialgraph/feed/api';
import { Appearance } from 'react-native-appearance';

const DiscoverScreen = (props) => {
  const { store } = useContext(ReactReduxContext);
  let colorScheme = Appearance.getColorScheme();
  let currentTheme = AppStyles.navThemeConstants[colorScheme];

  const [isFetching, setIsFetching] = useState(false);
  const feedManager = useRef(null);

  const discoverFeedPosts = useSelector(
    (state) => state.feed.discoverFeedPosts,
  );
  const currentUser = useSelector((state) => state.auth.user);
  const friends = useSelector((state) => state.friends.friends);

  useEffect(() => {
    feedManager.current = new FeedManager(store, currentUser.id);
    feedManager.current.subscribeIfNeeded();
    return () => {
      feedManager.current.unsubscribe();
    };
  }, [feedManager]);

  const onCategoryPress = async (categoryFeed) => {
    props.navigation.navigate('DiscoverFeed', { altFeed: categoryFeed });
  };

  const onCategoryItemPress = async (categoryFeed, categoryFeedItemIndex) => {
    props.navigation.navigate('DiscoverFeed', {
      altFeed: categoryFeed,
      feedStartIndex: categoryFeedItemIndex,
    });
  };

  const filterOutRelatedPosts = (posts) => {
    // we filter out posts with no media from self & friends
    if (!posts) {
      return posts;
    }
    const defaultAvatar =
      'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';
    const filteredPosts = posts.filter((post) => {
      return (
        post &&
        // post.authorID != currentUser.id &&
        post.author &&
        post.postMedia &&
        post.postMedia?.mime?.includes('video')
      );
    });

    return groupByHashTags(filteredPosts);
  };

  const groupByHashTags = (filteredPosts) => {
    const postsMap = {};

    filteredPosts.forEach((filteredPost) => {
      if (
        filteredPost.hashtags?.length &&
        filteredPost.postMedia?.mime?.includes('video')
      ) {
        filteredPost.hashtags.forEach((hashtag) => {
          if (postsMap[hashtag]) {
            postsMap[hashtag].videos.unshift(filteredPost);
          } else {
            postsMap[hashtag] = { hashtag, videos: [filteredPost] };
          }
        });
      }
    });

    return Object.values(postsMap);
  };

  const emptyStateConfig = {
    title: IMLocalized('No Discover Posts'),
    description: IMLocalized(
      'There are currently no posts from people who are not your friends. Posts from non-friends will show up here.',
    ),
  };

  return (
    <Discover
      loading={discoverFeedPosts == null}
      feed={filterOutRelatedPosts(discoverFeedPosts) ?? []}
      isFetching={isFetching}
      onCategoryPress={onCategoryPress}
      onCategoryItemPress={onCategoryItemPress}
      user={currentUser}
      emptyStateConfig={emptyStateConfig}
    />
  );
};

export default DiscoverScreen;
