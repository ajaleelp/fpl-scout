import React from "react"
import PropTypes from "prop-types"
import Slider from 'rc-slider';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import PlayerCarousel from "./PlayerCarousel";

export default class RootApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxCost: this.globalMaxCost(),
            minCost: this.globalMinCost()
        };
        this.changeRange = this.changeRange.bind(this);
    }

    globalMaxCost() {
        return Math.max(...this.props.players.map((player) => {return player.cost}));
    }

    globalMinCost() {
        return Math.min(...this.props.players.map((player) => {return player.cost}));
    }

    filteredPlayers() {
        return this.props.players.filter((player) => {
            return ((player.cost <= this.state.maxCost) && (player.cost >= this.state.minCost));
        });
    }

    filterForPosition(players, position) {
        return players.filter((player) => player.position == position);
    }

    upComingMatches() {
        return this.props.fixtures.filter((match) => Date.parse(match.kickoff_time) > new Date());
    }

    changeRange([newMinCost, newMaxCost]) {
        this.setState({minCost: newMinCost, maxCost: newMaxCost});
    }

    render() {
        let sliderMarks = {};
        sliderMarks[this.globalMinCost()] = this.globalMinCost().toString();
        sliderMarks[this.globalMaxCost()] = this.globalMaxCost().toString();
        let filteredPlayers = this.filteredPlayers();
        let forwards = this.filterForPosition(filteredPlayers, 4);
        let midFielders = this.filterForPosition(filteredPlayers, 3);
        let defenders = this.filterForPosition(filteredPlayers, 2);
        let goalKeepers = this.filterForPosition(filteredPlayers, 1);
        return (
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8 root-container px-4">
                    <div className="d-flex flex-column align-items-center">
                        <div className="my-2">
                            Cost: &#xa3;{this.state.minCost} - &#xa3;{this.state.maxCost}
                        </div>
                        <Range className="slider-root mx-auto"
                                min={this.globalMinCost()}
                                max={this.globalMaxCost()}
                                marks={sliderMarks}
                                onChange={this.changeRange}
                                value={[this.state.minCost, this.state.maxCost]}
                                allowCross={false}
                                tipFormatter={value => `${value}`}
                        />
                    </div>
                    <ul className="list-group mb-4 root__player-carousel--forwards">
                        <li className="list-group-item">Forwards</li>
                        <li className="list-group-item">
                            <PlayerCarousel players={forwards} upComingMatches={this.upComingMatches()} teams={this.props.teams}/>
                        </li>
                    </ul>
                    <ul className="list-group mb-4 root__player-carousel--mid-fielders">
                        <li className="list-group-item">Mid-Fielders</li>
                        <li className="list-group-item">
                            <PlayerCarousel players={midFielders} upComingMatches={this.upComingMatches()} teams={this.props.teams}/>
                        </li>
                    </ul>
                    <ul className="list-group mb-4 root__player-carousel--defenders">
                        <li className="list-group-item">Defenders</li>
                        <li className="list-group-item">
                            <PlayerCarousel players={defenders} upComingMatches={this.upComingMatches()} teams={this.props.teams}/>
                        </li>
                    </ul>
                    <ul className="list-group mb-4 root__player-carousel--goal-keepers">
                        <li className="list-group-item">Goal-Keepers</li>
                        <li className="list-group-item">
                            <PlayerCarousel players={goalKeepers} upComingMatches={this.upComingMatches()} teams={this.props.teams}/>
                        </li>
                    </ul>
                </div>
                <div className="col-md-2"></div>
            </div>
        );
    }
}

RootApp.propTypes = {
    players: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    fixtures: PropTypes.array.isRequired
};