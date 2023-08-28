import * as a from "./pageActionTypes";

const init = 0;

export const pageReducer = (state = init, action) => {
    switch (action.type) {
        case a.NEXT_PAGE:
            return state + 1;
        case a.PREV_PAGE:
            return state - 1;
        case a.GO_TO_PAGE_NUMBER:
            return action.payload;
    default:
        return state
    }
}