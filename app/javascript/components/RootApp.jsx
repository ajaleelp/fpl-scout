import React from "react"
import PropTypes from "prop-types"
import Slider from 'rc-slider';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import PlayerCarousel from "./PlayerCarousel";
import Picky from 'react-picky';
import 'react-picky/dist/picky.css';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH } from "@fortawesome/free-solid-svg-icons/faSlidersH";
import {faChevronCircleRight} from "@fortawesome/free-solid-svg-icons";


export default class RootApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxCost: this.globalMaxCost(),
            minCost: this.globalMinCost(),
            selectedTeams: [],
            selectedOption: "form",
            players: []
        };
        this.changeCostRange = this.changeCostRange.bind(this);
        this.updateSelectedTeams = this.updateSelectedTeams.bind(this);
        this.goToCarouselStart = this.goToCarouselStart.bind(this);
    }

    globalMaxCost() {
        return Math.max(...this.props.players.map((player) => { return player.cost }));
    }

    globalMinCost() {
        return Math.min(...this.props.players.map((player) => { return player.cost }));
    }

    filteredPlayers() {
        let teamFilteredPlayers = (this.state.selectedTeams.length === 0) ?
            this.props.players
            : (this.props.players.filter((player) => {
                return this.state.selectedTeams.map((t) => { return t.id; }).includes(player.team)
            }))
        let filteredPlayers = teamFilteredPlayers;
        if (this.state.selectedOption == "form") {
            filteredPlayers.sort((a, b) => b.form - a.form);
        }
        if (this.state.selectedOption == "cost") {
            filteredPlayers.sort((a, b) => b.cost - a.cost);
        }
        else if (this.state.selectedOption == "totalPoints") {
            filteredPlayers.sort((a, b) => b.total_points - a.total_points);
        }
        return filteredPlayers.filter((player) => {
            return ((player.cost <= this.state.maxCost) && (player.cost >= this.state.minCost));
        });
    }

    filterForPosition(players, position) {
        return players.filter((player) => player.position == position);
    }

    upComingMatches() {
        return this.props.fixtures.filter((match) => Date.parse(match.kickoff_time) > new Date());
    }

    goToCarouselStart() {
        this.forwardsCarousel.slider.slickGoTo(0);
        this.midFieldersCarousel.slider.slickGoTo(0);
        this.defendersCarousel.slider.slickGoTo(0);
        this.goalKeepersCarousel.slider.slickGoTo(0);
    }

    changeCostRange([newMinCost, newMaxCost]) {
        this.goToCarouselStart();
        this.setState({ minCost: newMinCost, maxCost: newMaxCost });
    }

    updateSelectedTeams(teams) {
        this.goToCarouselStart();
        this.setState({ selectedTeams: teams });
    }

    changeSortCriterion = changeEvent => {
        this.goToCarouselStart();
        this.setState({
            selectedOption: changeEvent.target.value
        });
    }

    render() {
        console.log(this.state.selectedOption);
        let costSliderMarks = {};
        costSliderMarks[this.globalMinCost()] = this.globalMinCost().toString();
        costSliderMarks[this.globalMaxCost()] = this.globalMaxCost().toString();
        let filteredPlayers = this.filteredPlayers();
        let forwards = this.filterForPosition(filteredPlayers, 4);
        let midFielders = this.filterForPosition(filteredPlayers, 3);
        let defenders = this.filterForPosition(filteredPlayers, 2);
        let goalKeepers = this.filterForPosition(filteredPlayers, 1);
        return (
            <div className="row root-container flex-row-reverse">
                <div className="card sidepanel-card col-lg-4 b-0">
                    <div className="card-body">
                        <div className="card filer-controls-card p-2">
                            <div className="card-header filer-controls-card__header">
                                <FontAwesomeIcon icon={faSlidersH} className="mr-1"/>
                                Settings
                            </div>
                            <div className="filter-controls-card__cost-slider px-3 d-flex flex-column align-items-center mb-4">
                                <div className="cost-slider__title">
                                    Cost
                                </div>
                                <Range className="mx-3"
                                       min={this.globalMinCost()}
                                       max={this.globalMaxCost()}
                                       marks={costSliderMarks}
                                       onChange={this.changeCostRange}
                                       value={[this.state.minCost, this.state.maxCost]}
                                       allowCross={false}
                                       tipFormatter={value => `${value}`}
                                       step={0.1}
                                       trackStyle={[{ backgroundColor: 'blueviolet' }]}
                                />
                            </div>
                            <div className="filter-controls-card__sort-by-picker px-2 d-flex flex-column align-items-center mb-2">
                                <div className="sort-by-picker__title">
                                    Sort by
                                </div>
                                <div className="sort-by-picker__radio-btns d-flex flex-row justify-content-between">
                                    <label>
                                        <input
                                            type="radio"
                                            value="form"
                                            checked={this.state.selectedOption === "form"}
                                            onChange={this.changeSortCriterion}
                                            className="form-check-input"
                                        />
                                        Form
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="cost"
                                            checked={this.state.selectedOption === "cost"}
                                            onChange={this.changeSortCriterion}
                                            className="form-check-input"
                                        />
                                        Cost
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="totalPoints"
                                            checked={this.state.selectedOption === "totalPoints"}
                                            onChange={this.changeSortCriterion}
                                            className="form-check-input"
                                        />
                                        Total Points
                                    </label>
                                </div>
                            </div>
                            <div className="filter-control-card__team-filter px-2 d-flex flex-column align-items-center">
                                <div>
                                    Teams
                                </div>
                                <Picky className='w-100 d-flex flex-column align-items-centre team-filter__picky'
                                   options={this.props.teams}
                                   value={this.state.selectedTeams}
                                   valueKey="id"
                                   labelKey="name"
                                   multiple={true}
                                   includeSelectAll={true}
                                   includeFilter={true}
                                   onChange={this.updateSelectedTeams}
                                   dropdownHeight={600}
                                   renderList={({ items, selected, multiple, selectValue, getIsSelected }) =>
                                       items.map(item => (
                                           <div key={item.id} onClick={() => selectValue(item)} className="team-filter__dropdown-item">
                                               {getIsSelected(item) ? <span className="team-filter__dropdown-item--selected">{item.name}</span> : item.name}
                                           </div>
                                       ))
                                   }
                                />
                            </div>
                        </div>
                        <div className="centerContent d-none d-md-block">
                            <div className="selfCenter standardWidth">
                                <TwitterTimelineEmbed
                                    sourceType="list"
                                    ownerScreenName="unbottler"
                                    slug="fantasy-premier-league"
                                    options={{ height: 400 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="accordion p-3 col-lg-8" id="accordionExample">
                    <div className="card">
                        <div className="card-header" id="headingOne">
                            <h5 className="mb-0">
                                <button className="btn btn-lg btn-block" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Forwards
                                    </button>
                            </h5>
                        </div>

                        <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                            <div className="card-body">
                                <ul className="list-group mb-4">
                                    <li className="list-group-item">
                                        <PlayerCarousel
                                            players={forwards}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                            ref={carousel => (this.forwardsCarousel = carousel)}
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
                                <ul className="list-group mb-4">
                                    <li className="list-group-item">
                                        <PlayerCarousel
                                            players={midFielders}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                            ref={carousel => (this.midFieldersCarousel = carousel)}
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
                                <ul className="list-group mb-4">
                                    <li className="list-group-item">
                                        <PlayerCarousel
                                            players={defenders}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                            ref={carousel => (this.defendersCarousel = carousel)}
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
                                <ul className="list-group mb-4">
                                    <li className="list-group-item">
                                        <PlayerCarousel players={goalKeepers}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                            ref={carousel => (this.goalKeepersCarousel = carousel)}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-3 px-4 d-md-none">
                    <div className="centerContent">
                        <div className="selfCenter standardWidth">
                            <TwitterTimelineEmbed
                                sourceType="list"
                                ownerScreenName="unbottler"
                                slug="fantasy-premier-league"
                                options={{ height: 400 }}
                            />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

RootApp.propTypes = {
    players: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    fixtures: PropTypes.array.isRequired
};