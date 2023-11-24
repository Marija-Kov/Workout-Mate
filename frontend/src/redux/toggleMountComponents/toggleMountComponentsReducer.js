import * as a from "./toggleMountComponentsActionTypes";

const init = {
  isCreateWorkoutFormMounted: false,
  isEditWorkoutFormMounted: false,
  prepopulateEditWorkoutForm: null,
  isForgotPasswordFormMounted: false,
  isUserMenuMounted: false,
  isUserSettingsFormMounted: false,
  isDeleteAccountDialogueMounted: false,
  isSpunDownServerAlertMounted: false,
};

export const toggleMountComponentsReducer = (state = init, action) => {
  switch (action.type) {
    case a.MOUNT_CREATE_WORKOUT_FORM:
      return {
        ...state,
        isCreateWorkoutFormMounted: !state.isCreateWorkoutFormMounted,
        isEditWorkoutFormMounted: false,
        isUserMenuMounted: false,
        isUserSettingsFormMounted: false,
        isDeleteAccountDialogueMounted: false,
      };
    case a.MOUNT_EDIT_WORKOUT_FORM:
      return {
        ...state,
        isEditWorkoutFormMounted: !state.isEditWorkoutFormMounted,
        prepopulateEditWorkoutForm: action.payload || null,
        isCreateWorkoutFormMounted: false,
        isUserMenuMounted: false,
        isUserSettingsFormMounted: false,
        isDeleteAccountDialogueMounted: false,
      };
    case a.MOUNT_FORGOT_PASSWORD_FORM:
      return {
        ...state,
        isForgotPasswordFormMounted: !state.isForgotPasswordFormMounted,
      };
    case a.MOUNT_USER_MENU:
      return {
        isCreateWorkoutFormMounted: false,
        isEditWorkoutFormMounted: false,
        isUserMenuMounted: !state.isUserMenuMounted,
      };
    case a.MOUNT_USER_SETTINGS_FORM:
      return {
        ...state,
        isUserMenuMounted: false,
        isUserSettingsFormMounted: !state.isUserSettingsFormMounted,
      };
    case a.MOUNT_DELETE_ACCOUNT_DIALOGUE:
      return {
        ...state,
        isDeleteAccountDialogueMounted: !state.isDeleteAccountDialogueMounted,
      };
    case a.MOUNT_SPUN_DOWN_SERVER_ALERT:
      return {
        ...state,
        isSpunDownServerAlertMounted: true,
      };
    case a.UNMOUNT_ALL_COMPONENTS:
      return init;
    default:
      return state;
  }
};
