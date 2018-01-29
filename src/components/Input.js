import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/input.css'

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {
                lat: undefined,
                lng: undefined
            },
            places: undefined,
            isSet: false
        };
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            const { SearchBox } = window.google.maps.places;
            const originSearch = new SearchBox(this.refs.input);
            originSearch.addListener('places_changed', () => {
                const places = originSearch.getPlaces();
                const location = places[0].geometry.location.toJSON();
                this.setState({
                    location,
                    places,
                    isSet: true
                }, () => {
                    this.props.setGeoLocation(this.props.type, this.state.location, places, this.refs.input.value);
                });
            });
        }, 100);
    }

    onChange(e) {
        this.setState({
            isSet: false
        });
        this.props.resetSteps();
    }

    onBlur(e) {
        setTimeout(() => {
            if (!this.state.isSet) {
                this.refs.input.value = '';
                this.setState({
                    location: {
                        lat: undefined,
                        lng: undefined
                    },
                    places: undefined
                }, () => {
                    this.props.setGeoLocation(this.props.type, this.state.location, this.state.places, '');
                });
            }
        }, 150);
    }

    render() {
        return (
            <div className="input-item-wrapper">
                <input
                    ref="input"
                    className="input"
                    placeholder={this.props.placeholder}
                    onBlur={ this.onBlur }
                    onChange={ this.onChange }
                />
                <label
                    className="label"
                >
                    { this.props.label }
                </label>
            </div>
        );
    }
}

Input.propTypes = {
    resetSteps: PropTypes.func.isRequired,
    setGeoLocation: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string
};

export default Input;
