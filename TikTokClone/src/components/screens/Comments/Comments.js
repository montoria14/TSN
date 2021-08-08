import React from 'react';
import {
  ScrollView,
  ActivityIndicator,
  View,
  SafeAreaView,
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from 'react-native-appearance';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import dynamicStyles from './styles';

function Comments(props) {
  const {
    commentItems,
    onCommentSend,
    scrollViewRef,
    commentsLoading,
    navigation,
    insets,
  } = props;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  return (
    <View
      style={[
        styles.detailPostContainer,
        { paddingBottom: Math.max(insets?.bottom, 16) },
      ]}>
      <KeyboardAwareView style={styles.detailPostContainer}>
        <BottomSheetScrollView ref={scrollViewRef}>
          {commentsLoading ? (
            <ActivityIndicator style={{ marginVertical: 7 }} size="small" />
          ) : (
            commentItems.map((comment) => (
              <CommentItem item={comment} key={comment.id} />
            ))
          )}
        </BottomSheetScrollView>
        <CommentInput onCommentSend={onCommentSend} />
      </KeyboardAwareView>
    </View>
  );
}

export default Comments;
