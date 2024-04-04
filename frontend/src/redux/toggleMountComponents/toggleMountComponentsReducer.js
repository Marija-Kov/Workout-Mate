import * as a from "./toggleMountComponentsActionTypes";

const init = {
  isCreateWorkoutFormMounted: false,
  isEditWorkoutFormMounted: false,
  prepopulateEditWorkoutForm: {},
  isForgotPasswordFormMounted: false,
  isUserMenuMounted: false,
  isUserSettingsFormMounted: false,
  isDeleteAccountDialogueMounted: false,
  isSpunDownServerAlertMounted: false,
};

export const toggleMountComponentsReducer = (state = init, action) => {
  switch (action.type) {
    case a.TOGGLE_MOUNT_CREATE_WORKOUT_FORM:
      return {
        ...state,
        isCreateWorkoutFormMounted: !state.isCreateWorkoutFormMounted,
        isEditWorkoutFormMounted: false,
        isUserMenuMounted: false,
        isUserSettingsFormMounted: false,
        isDeleteAccountDialogueMounted: false,
      };
    case a.TOGGLE_MOUNT_EDIT_WORKOUT_FORM:
      return {
        ...state,
        isEditWorkoutFormMounted: !state.isEditWorkoutFormMounted,
        prepopulateEditWorkoutForm: action.payload || {},
        isCreateWorkoutFormMounted: false,
        isUserMenuMounted: false,
        isUserSettingsFormMounted: false,
        isDeleteAccountDialogueMounted: false,
      };
    case a.TOGGLE_MOUNT_FORGOT_PASSWORD_FORM:
      return {
        ...state,
        isForgotPasswordFormMounted: !state.isForgotPasswordFormMounted,
      };
    case a.TOGGLE_MOUNT_USER_MENU:
      return {
        isCreateWorkoutFormMounted: false,
        isEditWorkoutFormMounted: false,
        isUserMenuMounted: !state.isUserMenuMounted,
      };
    case a.TOGGLE_MOUNT_USER_SETTINGS_FORM:
      return {
        ...state,
        isUserMenuMounted: false,
        isUserSettingsFormMounted: !state.isUserSettingsFormMounted,
      };
    case a.TOGGLE_MOUNT_DELETE_ACCOUNT_DIALOGUE:
      return {
        ...state,
        isDeleteAccountDialogueMounted: !state.isDeleteAccountDialogueMounted,
      };
    case a.TOGGLE_MOUNT_SPUN_DOWN_SERVER_ALERT:
      return {
        ...state,
        isSpunDownServerAlertMounted: true,
      };
    case a.RESET_COMPONENTS_STATE:
      return init;
    default:
      return state;
  }
};
