import React, { Component } from 'react';
import PropTypes from 'prop-types';
import findRoutes from '../routing/findRoutes';
import Input from './Input';
import '../css/viewbox.css';
import { lines } from '../routing/mrt.json';

// This is only a placeholder to demonstrate the Google Maps API.
// You should reorganize and improve it.

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            from: {
                location: {
                    lat: undefined,
                    lng: undefined,
                },
                places: undefined,
                text: ''
            },
            to: {
                location: {
                    lat: undefined,
                    lng: undefined,
                },
                places: undefined,
                text: ''
            },
            steps: [],
            listViewStatus: []
        };
        this.search = this.search.bind(this);
        this.setGeoLocation = this.setGeoLocation.bind(this);
        this.resetSteps = this.resetSteps.bind(this);
        this.renderBriefItem = this.renderBriefItem.bind(this);
        this.renderDetailedItem = this.renderDetailedItem.bind(this);
    }

    setGeoLocation(point, location, places, text) {
        if (point === 'from') {
            this.setState({
                from: {
                    location,
                    places,
                    text
                }
            });
        }
        if (point === 'to') {
            this.setState({
                to: {
                    location,
                    places,
                    text
                }
            });
        }
    }

    resetSteps() {
        this.setState({
            steps: [],
            listViewStatus: []
        });
    }

    search() {
        let errorMessage = '';
        let isFromSingapore = false;
        let isDestSingapore = false;
        if (typeof this.state.from.places === 'undefined' ||
            typeof this.state.to.places === 'undefined') {
            errorMessage = 'You have not filled in the origin or destination field.';
            this.props.showPopup({
                title: 'Grrrr...',
                message: errorMessage
            });
            return;
        }
        if (!errorMessage) {
            this.state.from.places.forEach((place) => {
                place.address_components.forEach((address) => {
                    if (address.short_name === 'SG' || address.short_name === 'Singapore') {
                        isFromSingapore = true;
                    }
                });
            });
            this.state.to.places.forEach((place) => {
                place.address_components.forEach((address) => {
                    if (address.short_name === 'SG' || address.short_name === 'Singapore') {
                        isDestSingapore = true;
                    }
                });
            });
        }
        if (!isFromSingapore || !isDestSingapore) {
            errorMessage = 'You have chosen outside of Singapore region';
            this.props.showPopup({
                title: 'Grrrr...',
                message: errorMessage
            });
            return;
        }
        const steps = findRoutes(this.state.from.location, this.state.to.location);
        const listViewStatus = [];
        steps.forEach(() => {
            listViewStatus.push(false);
        });
        this.setState({
            steps,
            listViewStatus
        });
    }
    onRouteListClick(idx) {
        this.setState({
            listViewStatus: [
                ...this.state.listViewStatus.slice(0, idx),
                !this.state.listViewStatus[idx],
                ...this.state.listViewStatus.slice(idx + 1)
            ]
        });
    }
    renderBriefItem(item, idx) {
        const routeLines = [];
        item.steps.forEach((i) => {
            if (i.type === 'ride') {
                routeLines.push(i.line);
            }
        });
        return (
            <div
                className="route-list brief"
                key={ idx }
                onClick={ this.onRouteListClick.bind(this, idx) }
            >
                {
                    <div
                        className="route-list-item walk"
                    >
                        <strong>
                            { 'Start by walking ' + ('' + item.steps[0].distance).split('.')[0] + 'm' }
                        </strong>
                        { ' towards ' + item.steps[0].to }
                    </div>
                }
                {
                    <div
                        className="route-list-item ride"
                    >
                        {
                            routeLines.map((line, idx) => {
                                return (
                                    <span key={ idx }>
                                        <span
                                            className="line-info"
                                            style={{
                                                backgroundColor: lines[line].color,
                                            }}
                                        >
                                            { line }
                                        </span>
                                        { idx !== routeLines.length - 1 ?
                                            <span className="bull">&#8226;</span> : ''
                                        }
                                    </span>
                                );
                            })
                        }
                    </div>
                }
                {
                    <div
                        className="route-list-item walk"
                    >
                        <strong>
                            { 'Start by walking ' + ('' + item.steps[item.steps.length - 1].distance).split('.')[0] + 'm' }
                        </strong>
                        { ' towards ' + this.state.to.text }
                    </div>
                }
            </div>
        );
    }
    renderDetailedItem(items, idx) {
        return (
            <div
                className="route-list detailed"
                onClick={ this.onRouteListClick.bind(this, idx) }
                key={ idx }
            >
                {
                    items.steps.map((item, itemIdx) => {
                        if (item.type === 'walk') {
                            return (
                                <div
                                    className="route-list-item walk"
                                    key={ itemIdx }
                                >
                                    <strong>
                                        { 'Start by walking ' + ('' + item.distance).split('.')[0] + 'm' }
                                    </strong>
                                    { ' towards ' + (item.to === 'destination' ? this.state.to.text : item.to) }
                                </div>
                            );
                        } else if (item.type === 'ride') {
                            return (
                                <div
                                    className="route-list-item ride"
                                    key={ itemIdx }
                                >
                                    <span
                                        className="line-info"
                                        style={{
                                            backgroundColor: lines[item.line].color,
                                        }}
                                    >
                                        { item.line }
                                    </span>
                                    <span className="stops">
                                        { item.from + ' > (After ' + item.stops + ' Stops) > ' +  item.to }
                                    </span>
                                </div>
                            );
                        } else {
                            return '';
                        }
                    })
                }
            </div>
        );
    }
    render() {
        return (
            <div id='app'>
                <div className="viewbox">
                    <div className="title-wrapper">
                        <h3>MRT Routes Finder</h3>
                    </div>
                    <div className="content-wrapper">
                        <Input
                            label="From"
                            placeholder="Origin"
                            resetSteps={ this.resetSteps }
                            setGeoLocation={ this.setGeoLocation }
                            type="from"
                        />
                        <Input
                            label="To"
                            placeholder="Destination"
                            resetSteps={ this.resetSteps }
                            setGeoLocation={ this.setGeoLocation }
                            type="to"
                        />
                        <button
                            className="btn"
                            onClick={ this.search }
                        >
                            Search
                        </button>
                    </div>
                    <div
                        className="subtitle-wrapper"
                        style={{
                            display: this.state.steps.length > 0 ? 'block' : 'none'
                        }}
                    >
                        <h3>Suggested routes</h3>
                    </div>
                    <div
                        className="content-wrapper bottom"
                        style={{
                            display: this.state.steps.length > 0 ? 'block' : 'none'
                        }}
                    >
                        {
                            this.state.steps ? this.state.steps.map((item, idx) => {
                                    return this.state.listViewStatus[idx] === false ?
                                        this.renderBriefItem(item, idx) : this.renderDetailedItem(item, idx)
                                })
                                :
                                ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}

App.propTypes = {
    hidePopup: PropTypes.func,
    showPopup: PropTypes.func
};

export default App;
