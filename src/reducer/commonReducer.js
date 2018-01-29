import * as CA from './commonAction';

const INITIAL_STATE = {
    popup: {
        show: false,
        items: []
    }
};

function commonReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case CA.SHOW_POPUP: {
            return Object.assign({}, state, {
                popup: {
                    items: [...state.popup.items, action.options],
                    show: true
                }
            });
        }
        case CA.HIDE_POPUP: {
            const newItems = state.popup.items.slice(0, state.popup.items.length - 1);
            return Object.assign({}, state, {
                popup: {
                    show: newItems.length !== 0,
                    items: newItems
                }
            });
        }
        case CA.HIDE_ALL_POPUP: {
            return Object.assign({}, state, {
                popup: {
                    show: false,
                    items: []
                }
            });
        }
        default:
            return state;
    }
}

export default commonReducer;
