export const SHOW_POPUP = 'SHOW_POPUP';
export const HIDE_POPUP = 'HIDE_POPUP';
export const HIDE_ALL_POPUP = 'HIDE_ALL_POPUP';

export const showPopup = (options) => {
    return {
        type: SHOW_POPUP,
        options
    };
};

export const hidePopup = () => {
    return {
        type: HIDE_POPUP
    };
};

export const hideAllPopup = () => {
    return {
        type: HIDE_ALL_POPUP
    };
};