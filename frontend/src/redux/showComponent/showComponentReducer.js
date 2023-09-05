import * as a from "./showComponentActionTypes"

const init = {
    showCreateWorkoutForm: false,
    showEditWorkoutForm: false,
    showForgotPasswordForm: false,
    showUserMenu: false,
    showUserSettingsForm: false,
    showDeleteAccountDialogue: false
}

export const showComponentReducer = (state = init, action) => {
    switch (action.type) {
        case a.SHOW_CREATE_WORKOUT_FORM:
            return {
                ...state,
                showCreateWorkoutForm: !state.showCreateWorkoutForm,
                showEditWorkoutForm: false,
                showUserMenu: false,
                showUserSettingsForm: false,
                showDeleteAccountDialogue: false  
            };
        case a.SHOW_EDIT_WORKOUT_FORM:
            return {
                ...state,
                showEditWorkoutForm: !state.showEditWorkoutForm,
                showCreateWorkoutForm: false,
                showUserMenu: false,
                showUserSettingsForm: false,
                showDeleteAccountDialogue: false  
            };
        case a.SHOW_FORGOT_PASSWORD_FORM:
            return {
                ...state,
                showForgotPasswordForm: !state.showForgotPasswordForm,
            };
        case a.SHOW_USER_MENU:
            return {
                showCreateWorkoutForm: false,
                showEditWorkoutForm: false,
                showUserMenu: !state.showUserMenu,
            };
        case a.SHOW_USER_SETTINGS_FORM:
            return {
                ...state,
                showUserMenu: false,
                showUserSettingsForm: !state.showUserSettingsForm,
            };
        case a.SHOW_DELETE_ACCOUNT_DIALOGUE:
            return {
                ...state,
                showDeleteAccountDialogue: !state.showDeleteAccountDialogue  
            };
        case a.HIDE_ALL_COMPONENTS:
            return {
                showCreateWorkoutForm: false,
                showEditWorkoutForm: false,
                showForgotPasswordForm: false,
                showUserMenu: false,
                showUserSettingsForm: false,
                showDeleteAccountDialogue: false  
            };
        default:
            return state;
        
    }
}