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
                    <div class="accordion" id="accordionExample">
                        <div class="card">
                            <div class="card-header" id="headingOne">
                                <h5 class="mb-0">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Forwards
                                    </button>
                                </h5>
                            </div>

                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div class="card-body">
                                    <ul className="list-group mb-4 root__player-carousel--forwards">
                                        <li className="list-group-item">
                                            <PlayerCarousel players={forwards} upComingMatches={this.upComingMatches()} teams={this.props.teams}/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingTwo">
                                <h5 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    Midfielders
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                <div class="card-body">
                                    <ul className="list-group mb-4 root__player-carousel--mid-fielders">
                                        <li className="list-group-item">
                                            <PlayerCarousel players={midFielders} upComingMatches={this.upComingMatches()} teams={this.props.teams}/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingThree">
                                <h5 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    Defenders
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                                <div class="card-body">
                                    <ul className="list-group mb-4 root__player-carousel--defenders">
                                        <li className="list-group-item">
                                            <PlayerCarousel players={defenders} upComingMatches={this.upComingMatches()} teams={this.props.teams}/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingThree">
                                <h5 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    Goalkeepers
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                                <div class="card-body">
                                    <ul className="list-group mb-4 root__player-carousel--goal-keepers">
                                        <li className="list-group-item">
                                            <PlayerCarousel players={goalKeepers} upComingMatches={this.upComingMatches()} teams={this.props.teams}/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
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