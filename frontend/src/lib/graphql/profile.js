export const GET_MY_PROFILE = `
  query GetMyProfile {
    getMyProfile {
      id
      name
      phoneNumber
      profilePhoto
      languagePreference
      bankDetails {
        upiId
        bankAccountNumber
        ifscCode
        accountHolderName
      }
      notificationSettings {
        orderAlerts
        paymentAlerts
        bidUpdates
        weatherAlerts
      }
    }
  }
`;

export const CREATE_USER_PROFILE = `
  mutation CreateUserProfile($input: CreateProfileInput!) {
    createUserProfile(input: $input) {
      id
      name
      phoneNumber
      languagePreference
    }
  }
`;

export const UPDATE_USER_PROFILE = `
  mutation UpdateUserProfile($input: UpdateProfileInput!) {
    updateUserProfile(input: $input) {
      id
      name
      phoneNumber
      profilePhoto
      languagePreference
    }
  }
`;

export const UPDATE_USER_BANK_DETAILS = `
  mutation UpdateUserBankDetails($input: BankDetailsInput!) {
    updateUserBankDetails(input: $input) {
      id
      bankDetails {
        upiId
        bankAccountNumber
        ifscCode
        accountHolderName
      }
    }
  }
`;

export const UPDATE_USER_NOTIFICATION_SETTINGS = `
  mutation UpdateUserNotificationSettings($input: NotificationSettingsInput!) {
    updateUserNotificationSettings(input: $input) {
      id
      notificationSettings {
        orderAlerts
        paymentAlerts
        bidUpdates
        weatherAlerts
      }
    }
  }
`;
