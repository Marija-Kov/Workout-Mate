const SET_LOADER = "SET_LOADER";
const UNSET_LOADER = "UNSET_LOADER";

const init = false;

export const loaderReducer = (state = init, action) => {
    switch(action.type) {
        case SET_LOADER: return true;
        case UNSET_LOADER: return false;
        default: return init
    }
}