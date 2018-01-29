import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Popup from '../components/Popup';
import '../css/common.css';
import * as CA from '../reducer/commonAction';

class Root extends React.Component {
    render() {
        return (
            <div>
                <main
                    id="content"
                >
                    {
                        React.cloneElement(this.props.children, {
                            // props to be sent
                            hidePopup: this.props.hidePopup,
                            showPopup: this.props.showPopup
                        })
                    }
                </main>
                <Popup />
            </div>
        )
    }
}

Root.propTypes = {
    hidePopup: PropTypes.func.isRequired,
    showPopup: PropTypes.func.isRequired,
    children: PropTypes.element
};

export default connect(
    null, {
        hidePopup: CA.hidePopup,
        showPopup: CA.showPopup
    }
)(Root);
