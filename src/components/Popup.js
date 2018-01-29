import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hidePopup } from '../reducer/commonAction';
import shortid from 'shortid';
import '../css/popup.css';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this.onMaskingClick = this.onMaskingClick.bind(this);
        this.getPopupPanelLocation = this.getPopupPanelLocation.bind(this);
        this.getVisibility = this.getVisibility.bind(this);
        this.getButtons = this.getButtons.bind(this);
    }
    onClose(callback) {
        this.props.hidePopup();
        if (typeof callback === 'function') {
            callback();
        }
    }
    onMaskingClick(event) {
        if (this.props.show === false) {
            return;
        }
        const target = event.target || event.srcElement;
        const className = target.className;
        if (className.indexOf('popup-masking') !== -1) {
            this.onClose();
        }
    }
    onMouseEnterCloseButton(event) {
        const target = event.target || event.srcElement;
        target.className = 'popup-close enter';
    }
    onMouseOutCloseButton(event) {
        const target = event.target || event.srcElement;
        target.className = 'popup-close';
    }
    getPopupPanelLocation(index) {
        const item = this.props.items[index];
        const unit = 8;
        const marginLeft = (item.width ? (-1) * item.width / 2 : -220) - (index * unit);
        const marginTop = -100 - (index * unit);
        return {
            marginLeft: marginLeft + 'px',
            marginTop: marginTop + 'px'
        };
    }
    getVisibility() {
        const visibility = {};
        if (this.props.show === false) {
            visibility.display = 'none';
        } else {
            visibility.display = 'block';
        }
        return visibility;
    }
    getMaskingTransparency() {
        const style = {};
        if (this.props.items.length !== 0) {
            if (this.props.items[this.props.items.length - 1].isMaskingVisible === false) {
                style.backgroundColor = '#fff';
                style.opacity = 0;
            }
        }
        return style;
    }
    getButtons(buttons) {
        const ret = [];
        for (let i = 0; i < buttons.length; i++) {
            let text = buttons[i].text;
            const callback = buttons[i].callback;
            if (!text) {
                text = 'OK';
            }
            ret.push((
                <button
                    className="popup-button"
                    key={i}
                    onClick={() => { this.onClose(callback); }}
                >
                    {text}
                </button>
            ));
        }
        if (buttons.length === 0) {
            ret.push((
                <button
                    key={0}
                    className="popup-button"
                    onClick={this.onClose}
                >
                    OK
                </button>
            ));
        }
        return ret;
    }
    render() {
        return (
            <div
                id="popup"
                style={this.getVisibility()}
            >
                <div
                    className="popup-masking"
                    onClick={this.onMaskingClick}
                    style={this.getMaskingTransparency()}
                >
                </div>
                {
                    this.props.items.map((item, index) => {
                        return (
                            <div
                                className="popup-panel"
                                key={shortid.generate()}
                                style={this.getPopupPanelLocation(index)}
                            >
                                <div className="popup-wrapper">
                                    <div className="popup-title">
                                        {item.title}
                                        <i
                                            className="popup-close"
                                            onClick={this.onClose}
                                            onMouseEnter={this.onMouseEnterCloseButton}
                                            onMouseOut={this.onMouseOutCloseButton}
                                        />
                                    </div>
                                    <div className="popup-message">
                                        {item.message}
                                    </div>
                                    <div className="popup-button-wrapper">
                                        {this.getButtons(item.buttons || '')}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

Popup.propTypes = {
    hidePopup: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        title: PropTypes.string.isRequired,
        buttons: PropTypes.arrayOf(PropTypes.shape({
            callback: PropTypes.func,
            text: PropTypes.string
        })),
        closeCallback: PropTypes.func,
        height: PropTypes.number,
        isMaskingVisible: PropTypes.bool,
        isMaskingClickable: PropTypes.bool,
        width: PropTypes.number
    })).isRequired,
    show: PropTypes.bool.isRequired
};

Popup.defaultProps = {
    items: [],
    show: false
};

export default connect(
    (state) => {
        return state.common.popup;
    }, {
        hidePopup
    }
)(Popup);
