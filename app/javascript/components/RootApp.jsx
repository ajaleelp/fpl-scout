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
            minCost: this.globalMinCost(),
            maxForm: this.globalMaxForm(),
            minForm: this.globalMinForm()
        };
        this.changeCostRange = this.changeCostRange.bind(this);
        this.changeFormRange = this.changeFormRange.bind(this);
    }

    globalMaxCost() {
        return Math.max(...this.props.players.map((player) => { return player.cost }));
    }

    globalMinCost() {
        return Math.min(...this.props.players.map((player) => { return player.cost }));
    }

    globalMaxForm() {
        return Math.max(...this.props.players.map((player) => { return player.form }));
    }

    globalMinForm() {
        return Math.min(...this.props.players.map((player) => { return player.form }));
    }

    filteredPlayers() {
        return this.props.players.filter((player) => {
            return ((player.cost <= this.state.maxCost) && (player.cost >= this.state.minCost) && (player.form <= this.state.maxForm) && (player.form >= this.state.minForm));
        });
    }

    filterForPosition(players, position) {
        return players.filter((player) => player.position == position);
    }

    upComingMatches() {
        return this.props.fixtures.filter((match) => Date.parse(match.kickoff_time) > new Date());
    }

    changeCostRange([newMinCost, newMaxCost]) {
        this.setState({ minCost: newMinCost, maxCost: newMaxCost });
    }

    changeFormRange([newMinForm, newMaxForm]) {
        this.setState({ maxForm: newMaxForm, minForm: newMinForm });
    }

    render() {
        let costSliderMarks = {};
        let formSliderMarks = {};
        costSliderMarks[this.globalMinCost()] = this.globalMinCost().toString();
        costSliderMarks[this.globalMaxCost()] = this.globalMaxCost().toString();
        formSliderMarks[this.globalMinForm()] = this.globalMinForm().toString();
        formSliderMarks[this.globalMaxForm()] = this.globalMaxForm().toString();
        let filteredPlayers = this.filteredPlayers();
        let forwards = this.filterForPosition(filteredPlayers, 4);
        let midFielders = this.filterForPosition(filteredPlayers, 3);
        let defenders = this.filterForPosition(filteredPlayers, 2);
        let goalKeepers = this.filterForPosition(filteredPlayers, 1);
        return (
            <div className="row root-container">
                <div className="accordion col-md-8 p-3" id="accordionExample">
                    <div className="card">
                        <div className="card-header" id="headingOne">
                            <h5 className="mb-0">
                                <button className="btn btn-outline-success btn-lg btn-block" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Forwards
                                    </button>
                            </h5>
                        </div>

                        <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                            <div className="card-body">
                                <ul className="list-group mb-4 root__player-carousel--forwards">
                                    <li className="list-group-item">
                                        <PlayerCarousel
                                            players={forwards}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header" id="headingTwo">
                            <h5 className="mb-0">
                                <button className="btn btn-outline-secondary btn-lg btn-block collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    Midfielders
                                    </button>
                            </h5>
                        </div>
                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                            <div className="card-body">
                                <ul className="list-group mb-4 root__player-carousel--mid-fielders">
                                    <li className="list-group-item">
                                        <PlayerCarousel
                                            players={midFielders}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header" id="headingThree">
                            <h5 className="mb-0">
                                <button className="btn btn-outline-danger btn-lg btn-block collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    Defenders
                                    </button>
                            </h5>
                        </div>
                        <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                            <div className="card-body">
                                <ul className="list-group mb-4 root__player-carousel--defenders">
                                    <li className="list-group-item">
                                        <PlayerCarousel
                                            players={defenders}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header" id="headingFour">
                            <h5 className="mb-0">
                                <button className="btn btn-outline-info btn-lg btn-block collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                    Goalkeepers
                                    </button>
                            </h5>
                        </div>
                        <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                            <div className="card-body">
                                <ul className="list-group mb-4 root__player-carousel--goal-keepers">
                                    <li className="list-group-item">
                                        <PlayerCarousel players={goalKeepers}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 py-3 px-1 d-flex flex-column align-items-center">
                    <div>
                        <div className="my-2">
                            Cost: &#xa3;{this.state.minCost} - &#xa3;{this.state.maxCost}
                        </div>
                        <Range className="slider-root mx-auto"
                            min={this.globalMinCost()}
                            max={this.globalMaxCost()}
                            marks={costSliderMarks}
                            onChange={this.changeCostRange}
                            value={[this.state.minCost, this.state.maxCost]}
                            allowCross={false}
                            tipFormatter={value => `${value}`}
                        />
                    </div>
                    <div>
                        <div className="my-2">
                            Form: &#xa3;{this.state.minForm} - &#xa3;{this.state.maxForm}
                        </div>
                        <Range className="slider-root mx-auto"
                            min={this.globalMinForm()}
                            max={this.globalMaxForm()}
                            marks={formSliderMarks}
                            onChange={this.changeFormRange}
                            value={[this.state.minForm, this.state.maxForm]}
                            allowCross={false}
                            tipFormatter={value => `${value}`}
                        />
                    </div>
                </div>

            </div>
        );
    }
}

RootApp.propTypes = {
    players: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    fixtures: PropTypes.array.isRequired
};