import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Comments, CommentsHandle } from '../../components';
import {
  postAPIManager,
  commentAPIManager,
} from '../../Core/socialgraph/feed/api/';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { Appearance } from 'react-native-appearance';

const CommentsScreen = (props) => {
  const colorScheme = Appearance.getColorScheme();
  let currentTheme = AppStyles.navThemeConstants[colorScheme];

  const { item, onDismiss, isVisible } = props;

  const insets = useSafeAreaInsets();

  const [feedItem, setFeedItem] = useState(item);
  const [comments, setComments] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const scrollViewRef = useRef();
  const unsubscribeComments = useRef(null);
  const unsubscribeSinglePost = useRef(null);
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['30%', '60%'], []);

  const myReactions = useSelector((state) => state.feed.feedPostReactions);
  const currentUser = useSelector((state) => state.auth.user);

  const commentCountHeader = `${comments?.length} comment${
    comments?.length > 1 ? 's' : ''
  }`;

  useEffect(() => {
    if (!item?.id) {
      return;
    }
    unsubscribeSinglePost.current = postAPIManager.subscribeToSinglePost(
      item.id,
      onFeedItemUpdate,
    );
    unsubscribeComments.current = commentAPIManager.subscribeComments(
      item.id,
      onCommentsUpdate,
    );
  }, [item?.id, isVisible]);

  useEffect(() => {
    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
      setComments([]);
      unSubscribe();
    }
  }, [isVisible]);

  const unSubscribe = () => {
    unsubscribeComments.current && unsubscribeComments.current();
    unsubscribeSinglePost.current && unsubscribeSinglePost.current();
  };

  const onFeedItemUpdate = (feedItem) => {
    const myReaction = myReactions?.find(
      (reaction) => reaction.postID == feedItem.id,
    );
    if (myReaction) {
      setFeedItem({ ...feedItem, myReaction: myReaction.reaction });
    } else {
      setFeedItem({ ...feedItem, myReaction: null });
    }
  };

  const onCommentsUpdate = (comments) => {
    setComments(comments);
    setCommentsLoading(false);
  };

  const onCommentSend = async (value) => {
    const commentObject = {
      postID: feedItem.id,
      commentText: value,
      authorID: currentUser.id,
    };
    commentAPIManager.addComment(commentObject, currentUser, feedItem, false);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
      handleComponent={() => (
        <CommentsHandle
          onDismiss={onDismiss}
          title={IMLocalized(commentCountHeader)}
        />
      )}>
      <Comments
        scrollViewRef={scrollViewRef}
        commentItems={comments}
        commentsLoading={commentsLoading}
        onCommentSend={onCommentSend}
        insets={insets}
      />
    </BottomSheetModal>
  );
};

export default CommentsScreen;
