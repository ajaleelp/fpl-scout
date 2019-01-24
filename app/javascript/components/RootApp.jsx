import React from "react"
import PropTypes from "prop-types"
import Slider from 'rc-slider';
const Range = Slider.Range;
import 'rc-slider/assets/index.css';
import PlayerCarousel from "./PlayerCarousel";

export default class RootApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxCost: this.globalMaxCost(),
            minCost: this.globalMinCost(),
            players: this.props.players
        };

        this.filteredPlayers = this.filteredPlayers.bind(this);
        this.changeRange = this.changeRange.bind(this);
    }

    globalMaxCost() {
        return Math.max(...this.props.players.map((player) => {return player.cost}));
    }

    globalMinCost() {
        return Math.min(...this.props.players.map((player) => {return player.cost}));
    }

    filteredPlayers() {
        return this.state.players.filter((player) => {
            return ((player.cost <= this.state.maxCost) && (player.cost >= this.state.minCost));
        });
    }

    changeRange([newMinCost, newMaxCost]) {
        this.setState({minCost: newMinCost, maxCost: newMaxCost});
    }

    render() {
        let sliderMarks = {};
        sliderMarks[this.globalMinCost()] = this.globalMinCost().toString();
        sliderMarks[this.globalMaxCost()] = this.globalMaxCost().toString();
        return (
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8 root-container px-4">
                    <Range className="slider-root mx-auto"
                            min={this.globalMinCost()}
                            max={this.globalMaxCost()}
                            marks={sliderMarks}
                            onChange={this.changeRange}
                            value={[this.state.minCost, this.state.maxCost]}
                            allowCross={false}
                    />
                    <PlayerCarousel players={this.filteredPlayers()}/>
                </div>
                <div className="col-md-2"></div>
            </div>
        );
    }
}

RootApp.propTypes = {
    players: PropTypes.array.isRequired
};