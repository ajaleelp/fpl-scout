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
import { faList } from "@fortawesome/free-solid-svg-icons/";


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

    costIncreasedPlayers() {
        return this.props.players.filter((player) => Number(player.cost_change_event) > 0)
    }

    costDecreasedPlayers() {
        return this.props.players.filter((player) => Number(player.cost_change_event) < 0)
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
            <div>
                <div className="page-header">
                    <div className="row d-flex shadow-lg">
                        <div className="m-auto">
                            <img className="logo-image" src={this.props.logoURL} />
                        </div>
                    </div>
                </div>
                <div className="root-container flex-row-reverse">
                    <div className="card sidepanel-card col-lg-4">
                        <div className="card-body px-0 px-lg-2 d-flex flex-column">
                            <div className="card filter-controls-card shadow-lg p-2 rounded align-items-stretch">
                                <div className="card-header filter-controls-card__header rounded-top">
                                    <FontAwesomeIcon icon={faSlidersH} className="mr-1" />
                                    Filters
                                </div>
                                <div className="filter-controls-card__cost-slider px-3 d-flex flex-column align-items-center mb-4">
                                    <div className="cost-slider__title">
                                        Cost: &#xa3;{this.state.minCost} - &#xa3;{this.state.maxCost}
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
                                        trackStyle={[{ backgroundColor: '#38003c' }]}
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
                        </div>
                    </div>
                    <div className="card player-carousel-card pb-lg-3 col-lg-8">
                        <div className="card-body px-0 px-lg-2 w-100 d-flex flex-column justify-content-start">
                            <div className="nav-tab__content shadow-lg rounded">
                                <ul className="nav nav-tabs" id="playerCarouselTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="forwards-tab" data-toggle="tab" href="#forwards" role="tab">
                                            <span className="d-none d-lg-block">Forwards</span>
                                            <span className="d-block d-lg-none">FWD</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="mid-fielders-tab" data-toggle="tab" href="#mid-fielders" role="tab">
                                            <span className="d-none d-lg-block">Mid-Fielders</span>
                                            <span className="d-block d-lg-none">MDF</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="defenders-tab" data-toggle="tab" href="#defenders" role="tab">
                                            <span className="d-none d-lg-block">Defenders</span>
                                            <span className="d-block d-lg-none">DFD</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="goal-keepers-tab" data-toggle="tab" href="#goal-keepers" role="tab">
                                            <span className="d-none d-lg-block">Goal-Keepers</span>
                                            <span className="d-block d-lg-none">GKP</span>
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content px-2" id="playerCarouselTabContent">
                                    <div className="tab-pane fade show active" id="forwards" role="tabpanel">
                                        <PlayerCarousel
                                            players={forwards}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                            ref={carousel => (this.forwardsCarousel = carousel)}
                                        />
                                    </div>
                                    <div className="tab-pane fade" id="mid-fielders" role="tabpanel">
                                        <PlayerCarousel
                                            players={midFielders}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                            ref={carousel => (this.midFieldersCarousel = carousel)}
                                        />
                                    </div>
                                    <div className="tab-pane fade" id="defenders" role="tabpanel">
                                        <PlayerCarousel
                                            players={defenders}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                            ref={carousel => (this.defendersCarousel = carousel)}
                                        />
                                    </div>
                                    <div className="tab-pane fade" id="goal-keepers" role="tabpanel">
                                        <PlayerCarousel
                                            players={goalKeepers}
                                            upComingMatches={this.upComingMatches()}
                                            teams={this.props.teams}
                                            fixtures={this.props.fixtures}
                                            ref={carousel => (this.goalKeepersCarousel = carousel)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card twitter-feed-card-2 col-lg-4">
                        <div className="card-body px-0 px-lg-2">
                            <div className="twitter-feed-card-2__body-content shadow-lg">
                                <TwitterTimelineEmbed
                                    sourceType="list"
                                    ownerScreenName="unbottler"
                                    slug="fantasy-premier-league"
                                    options={{ height: 400 }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card bg-transparent border-0 col-lg-8">
                        <div className="card-body px-0 px-lg-2">
                            <div className="card price-change-card p-2 shadow-lg rounded">
                                <div className="card-header filter-controls-card__header">
                                    <FontAwesomeIcon icon={faList} className="mr-1" />
                                    Latest Price Changes
                                </div>
                                <div className="pt-3 d-flex flex-column">
                                    <div className="nav-tab__content border-0">
                                        <ul className="nav nav-tabs ml-3" id="priceChangeTab" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="price-rise-tab" data-toggle="tab" href="#pricerise" role="tab">
                                                    Rise
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="price-fall-tab" data-toggle="tab" href="#pricefall" role="tab">
                                                    Fall
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content px-2" id="priceChangeTabContent">
                                            <div className="tab-pane fade show active" id="pricerise" role="tabpanel">
                                                <ul className="list-group list-group-flush p-2">
                                                    {
                                                        this.costIncreasedPlayers().map((player) => {
                                                            return (<li className="list-group-item d-flex justify-content-between pr-5">
                                                                <div>{player.full_name}</div>
                                                                <div className="d-flex col-1 justify-content-between">
                                                                    <span className="green-text">
                                                                        +{player.cost_change_event}
                                                                    </span>
                                                                    <span className="grey-text small">&nbsp;({player.cost_change_start})</span>
                                                                </div>
                                                            </li>);
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                            <div className="tab-pane fade" id="pricefall" role="tabpanel">
                                                <ul className="list-group list-group-flush p-2">
                                                    {
                                                        this.costDecreasedPlayers().map((player) => {
                                                            return (<li className="list-group-item d-flex justify-content-between pr-5">
                                                                <div>{player.full_name}</div>
                                                                <div className="d-flex col-1 justify-content-between">
                                                                    <span className="red-text">
                                                                        {player.cost_change_event}
                                                                    </span>
                                                                    <span className="grey-text small">&nbsp;({player.cost_change_start})</span>
                                                                </div>
                                                            </li>);
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        );
    }
}

RootApp.propTypes = {
    players: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    fixtures: PropTypes.array.isRequired,
    logoURL: PropTypes.string.isRequired
};