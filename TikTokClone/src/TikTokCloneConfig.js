import AppStyles from './AppStyles';
import { IMLocalized, setI18nConfig } from './Core/localization/IMLocalization';
import { Platform } from 'react-native';

setI18nConfig();

const regexForNames = /^[a-zA-Z]{2,25}$/;
const regexForPhoneNumber = /\d{9}$/;

const TikTokCloneConfig = {
  isSMSAuthEnabled: true,
  appIdentifier: 'rn-tik-tok-android',
  facebookIdentifier: '285315185217069',
  webClientId:
    '525472070731-mg8m3q8v9vp1port7nkbq9le65hp917t.apps.googleusercontent.com',
  videoMaxDuration: 15,
  onboardingConfig: {
    welcomeTitle: IMLocalized('Welcome to your app'),
    welcomeCaption: IMLocalized(
      'Use this codebase to build your own a Tik Tok clone in minutes.',
    ),
    walkthroughScreens: [
      {
        icon: require('../assets/images/photo.png'),
        title: IMLocalized('Tik Toks'),
        description: IMLocalized(
          'Compose videos with songs in the background just like Tik Tok.',
        ),
      },
      {
        icon: require('../assets/images/file.png'),
        title: IMLocalized('Watch'),
        description: IMLocalized('Watch Tik Toks from your followers.'),
      },
      {
        icon: require('../assets/images/like.png'),
        title: IMLocalized('Likes'),
        description: IMLocalized('Like the videos that amuse you!'),
      },
      {
        icon: require('../assets/images/chat.png'),
        title: IMLocalized('Chat'),
        description: IMLocalized(
          'Communicate with your friends via private messages.',
        ),
      },
      {
        icon: require('../assets/icons/friends-unfilled.png'),
        title: IMLocalized('Group Chats'),
        description: IMLocalized('Have fun with your gang in group chats.'),
      },
      {
        icon: require('../assets/images/instagram.png'),
        title: IMLocalized('Send Photos & Videos'),
        description: IMLocalized(
          'Have fun with your connections by sending photos and videos to each other.',
        ),
      },
      {
        icon: require('../assets/images/notification.png'),
        title: IMLocalized('Get Notified'),
        description: IMLocalized(
          'Receive notifications when you get new messages.',
        ),
      },
    ],
  },
  tabIcons: {
    Feed: {
      focus: AppStyles.iconSet.homefilled,
      unFocus: AppStyles.iconSet.homeUnfilled,
    },
    Discover: {
      focus: AppStyles.iconSet.search,
      unFocus: AppStyles.iconSet.search,
    },
    Inbox: {
      focus: AppStyles.iconSet.commentFilled,
      unFocus: AppStyles.iconSet.commentUnfilled,
    },
    Friends: {
      focus: AppStyles.iconSet.friendsFilled,
      unFocus: AppStyles.iconSet.friendsUnfilled,
    },
    Profile: {
      focus: AppStyles.iconSet.profileFilled,
      unFocus: AppStyles.iconSet.profileUnfilled,
    },
  },
  drawerMenu: {
    upperMenu: [
      {
        title: IMLocalized('Home'),
        icon: AppStyles.iconSet.homeUnfilled,
        navigationPath: 'Feed',
      },
      {
        title: IMLocalized('Discover'),
        icon: AppStyles.iconSet.search,
        navigationPath: 'Discover',
      },
      {
        title: IMLocalized('Chat'),
        icon: AppStyles.iconSet.commentUnfilled,
        navigationPath: 'Chat',
      },
      {
        title: IMLocalized('Friends'),
        icon: AppStyles.iconSet.friendsUnfilled,
        navigationPath: 'Friends',
      },
      {
        title: IMLocalized('Profile'),
        icon: AppStyles.iconSet.search,
        navigationPath: 'Profile',
      },
    ],
    lowerMenu: [
      {
        title: IMLocalized('Logout'),
        icon: AppStyles.iconSet.logout,
        action: 'logout',
      },
    ],
  },
  tosLink: 'https://www.instamobile.io/eula-instachatty/',
  isUsernameFieldEnabled: true,
  smsSignupFields: [
    {
      displayName: IMLocalized('First Name'),
      type: 'ascii-capable',
      editable: true,
      regex: regexForNames,
      key: 'firstName',
      placeholder: 'First Name',
    },
    {
      displayName: IMLocalized('Last Name'),
      type: 'ascii-capable',
      editable: true,
      regex: regexForNames,
      key: 'lastName',
      placeholder: 'Last Name',
    },
    {
      displayName: IMLocalized('Username'),
      type: 'default',
      editable: true,
      regex: regexForNames,
      key: 'username',
      placeholder: 'Username',
    },
  ],
  signupFields: [
    {
      displayName: IMLocalized('First Name'),
      type: 'ascii-capable',
      editable: true,
      regex: regexForNames,
      key: 'firstName',
      placeholder: 'First Name',
    },
    {
      displayName: IMLocalized('Last Name'),
      type: 'ascii-capable',
      editable: true,
      regex: regexForNames,
      key: 'lastName',
      placeholder: 'Last Name',
    },
    {
      displayName: IMLocalized('Username'),
      type: 'default',
      editable: true,
      regex: regexForNames,
      key: 'username',
      placeholder: 'Username',
    },
    {
      displayName: IMLocalized('E-mail Address'),
      type: 'email-address',
      editable: true,
      regex: regexForNames,
      key: 'email',
      placeholder: 'E-mail Address',
      autoCapitalize: 'none',
    },
    {
      displayName: IMLocalized('Password'),
      type: 'default',
      secureTextEntry: true,
      editable: true,
      regex: regexForNames,
      key: 'password',
      placeholder: 'Password',
      autoCapitalize: 'none',
    },
  ],
  editProfileFields: {
    sections: [
      {
        title: IMLocalized('PUBLIC PROFILE'),
        fields: [
          {
            displayName: IMLocalized('First Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'firstName',
            placeholder: 'Your first name',
          },
          {
            displayName: IMLocalized('Last Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'lastName',
            placeholder: 'Your last name',
          },
          {
            displayName: IMLocalized('Username'),
            type: 'text',
            editable: false,
            regex: regexForNames,
            key: 'username',
            placeholder: 'Your username',
          },
        ],
      },
      {
        title: IMLocalized('PRIVATE DETAILS'),
        fields: [
          {
            displayName: IMLocalized('E-mail Address'),
            type: 'text',
            editable: true,
            key: 'email',
            placeholder: 'Your email address',
          },
          {
            displayName: IMLocalized('Phone Number'),
            type: 'text',
            editable: true,
            regex: regexForPhoneNumber,
            key: 'phone',
            placeholder: 'Your phone number',
          },
        ],
      },
    ],
  },
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized('GENERAL'),
        fields: [
          {
            displayName: IMLocalized('Allow Push Notifications'),
            type: 'switch',
            editable: true,
            key: 'push_notifications_enabled',
            value: true,
          },
          {
            ...(Platform.OS === 'ios'
              ? {
                displayName: IMLocalized('Enable Face ID / Touch ID'),
                type: 'switch',
                editable: true,
                key: 'face_id_enabled',
                value: false,
              }
              : {}),
          },
        ],
      },
      {
        title: IMLocalized('Feed'),
        fields: [
          {
            displayName: IMLocalized('Autoplay Videos'),
            type: 'switch',
            editable: true,
            key: 'autoplay_video_enabled',
            value: true,
          },
          {
            displayName: IMLocalized('Always Mute Videos'),
            type: 'switch',
            editable: true,
            key: 'mute_video_enabled',
            value: true,
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Save'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsFields: {
    sections: [
      {
        title: IMLocalized('CONTACT'),
        fields: [
          {
            displayName: IMLocalized('Address'),
            type: 'text',
            editable: false,
            key: 'push_notifications_enabled',
            value: '142 Steiner Street, San Francisco, CA, 94115',
          },
          {
            displayName: IMLocalized('E-mail us'),
            value: 'florian@instamobile.io',
            type: 'text',
            editable: false,
            key: 'email',
            placeholder: 'Your email address',
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Call Us'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsPhoneNumber: '+16504850000',
  adsConfig: {
    facebookAdsPlacementID:
      Platform.OS === 'ios'
        ? '834318260403282_834914470343661'
        : '834318260403282_834390467062728',
    adSlotInjectionInterval: 10,
  },
};

export default TikTokCloneConfig;
