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
                showCreateWorkoutForm: true,
                showEditWorkoutForm: false,
                showForgotPasswordForm: false,
                showUserMenu: false,
                showUserSettingsForm: false,
                showDeleteAccountDialogue: false  
            };
        case a.SHOW_EDIT_WORKOUT_FORM:
            return {
                showCreateWorkoutForm: false,
                showEditWorkoutForm: true,
                showForgotPasswordForm: false,
                showUserMenu: false,
                showUserSettingsForm: false,
                showDeleteAccountDialogue: false  
            };
        case a.SHOW_FORGOT_PASSWORD_FORM:
            return {
                showCreateWorkoutForm: false,
                showEditWorkoutForm: false,
                showForgotPasswordForm: true,
                showUserMenu: false,
                showUserSettingsForm: false,
                showDeleteAccountDialogue: false  
            };
        case a.SHOW_USER_MENU:
            return {
                showCreateWorkoutForm: false,
                showEditWorkoutForm: false,
                showForgotPasswordForm: false,
                showUserMenu: true,
                showUserSettingsForm: false,
                showDeleteAccountDialogue: false  
            };
        case a.SHOW_USER_SETTINGS_FORM:
            return {
                showCreateWorkoutForm: false,
                showEditWorkoutForm: false,
                showForgotPasswordForm: false,
                showUserMenu: false,
                showUserSettingsForm: true,
                showDeleteAccountDialogue: false  
            };
        case a.SHOW_DELETE_ACCOUNT_DIALOGUE:
            return {
                showCreateWorkoutForm: false,
                showEditWorkoutForm: false,
                showForgotPasswordForm: false,
                showUserMenu: false,
                showUserSettingsForm: false,
                showDeleteAccountDialogue: true  
            };
        case a.HIDE_COMPONENT:
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