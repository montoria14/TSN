import React, { useState, useEffect, useRef, useContext } from 'react';
import { View } from 'react-native';
import { connect, ReactReduxContext, useSelector } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import SearchBar from '../../Core/ui/SearchBar/SearchBar';
import { Discover } from '../../components';
import dynamicStyles from './styles';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { FeedManager } from '../../Core/socialgraph/feed/api';

const emptyStateConfig = {
  title: IMLocalized('No Posts'),
  description: IMLocalized(''),
};

function FeedSearchScreen(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(AppStyles, colorScheme);
  const hashtag = props.route.params.hashtag;

  const { store } = useContext(ReactReduxContext);

  const currentUser = useSelector((state) => state.auth.user);

  const [feed, setFeed] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [willBlur, setWillBlur] = useState(false);

  const feedManager = useRef(new FeedManager(store, props.user.id));
  const searchBarRef = useRef(null);
  const unsubscribeFeed = useRef(null);
  const willBlurSubscription = useRef(null);
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) => {
      setWillBlur(false);
    }),
  );

  useEffect(() => {
    setTimeout(() => {
      searchBarRef.current?.focus(hashtag);
    }, 1500);
    willBlurSubscription.current = props.navigation.addListener(
      'blur',
      (payload) => {
        setWillBlur(true);
      },
    );
    feedManager.current.subscribeUserFeedRelatedActions();
    feedManager.current.subscribeHashtagFeedPosts(hashtag, (posts) => {
      const groupedPost = groupByHashTags(posts);
      setFeed(groupedPost);
    });

    return () => {
      feedManager.current.unsubscribeHashtagFeedPosts();
      feedManager.current.unsubscribe();
      willBlurSubscription.current && willBlurSubscription.current();
      didFocusSubscription.current && didFocusSubscription.current();
    };
  }, []);

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

  const onSearchTextChange = (text) => {};

  const onSearchBarCancel = () => {
    props.navigation.goBack();
  };

  const onSearch = (text) => {
    setFeed(null);
    feedManager.current.unsubscribeHashtagFeedPosts();
    feedManager.current.subscribeHashtagFeedPosts(text, (posts) => {
      const groupedPost = groupByHashTags(posts);
      setFeed(groupedPost);
    });
  };

  const onSearchClear = () => {};

  const onCategoryPress = async (categoryFeed) => {
    props.navigation.navigate('DiscoverFeed', { altFeed: categoryFeed });
  };

  const onCategoryItemPress = async (categoryFeed, categoryFeedItemIndex) => {
    props.navigation.navigate('DiscoverFeed', {
      altFeed: categoryFeed,
      feedStartIndex: categoryFeedItemIndex,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder={IMLocalized('Search hashtags')}
          onChangeText={onSearchTextChange}
          onSearchBarCancel={onSearchBarCancel}
          searchRef={searchBarRef}
          onSearchClear={onSearchClear}
          appStyles={AppStyles}
          defaultValue={hashtag}
          onSearch={onSearch}
        />
      </View>

      <Discover
        loading={feed == null}
        feed={feed ?? []}
        isFetching={isFetching}
        onCategoryPress={onCategoryPress}
        onCategoryItemPress={onCategoryItemPress}
        user={currentUser}
        emptyStateConfig={emptyStateConfig}
      />
    </View>
  );
}

const mapStateToProps = ({ feed, auth, friends }) => {
  return {
    discoverFeedPosts: feed.discoverFeedPosts,
    user: auth.user,
    friends: friends.friends,
  };
};

export default connect(mapStateToProps)(FeedSearchScreen);
