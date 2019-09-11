import React from "react"
import PropTypes from "prop-types"
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import PlayerCarousel from "./PlayerCarousel";
import Picky from 'react-picky';
import 'react-picky/dist/picky.css';
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSlidersH} from "@fortawesome/free-solid-svg-icons/faSlidersH";
import {faList} from "@fortawesome/free-solid-svg-icons/";
import {faHeart} from "@fortawesome/free-solid-svg-icons/";


export default class RootApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maxCost: this.globalMaxCost(),
      minCost: this.globalMinCost(),
      selectedTeams: [],
      selectedOption: "form",
      players: props.players
    };
    this.changeCostRange = this.changeCostRange.bind(this);
    this.updateSelectedTeams = this.updateSelectedTeams.bind(this);
    this.goToCarouselStart = this.goToCarouselStart.bind(this);
    this.toggleBookmark = this.toggleBookmark.bind(this);
  }

  globalMaxCost() {
    return Math.max(...this.props.players.map((player) => {
      return player.cost
    }));
  }

  globalMinCost() {
    return Math.min(...this.props.players.map((player) => {
      return player.cost
    }));
  }

  filteredPlayers() {
    let teamFilteredPlayers = (this.state.selectedTeams.length === 0) ?
      this.state.players
      : (this.state.players.filter((player) => {
        return this.state.selectedTeams.map((t) => {
          return t.id;
        }).includes(player.team)
      }))
    let filteredPlayers = teamFilteredPlayers;
    if (this.state.selectedOption == "form") {
      filteredPlayers.sort((a, b) => b.form - a.form);
    }
    if (this.state.selectedOption == "cost") {
      filteredPlayers.sort((a, b) => b.cost - a.cost);
    } else if (this.state.selectedOption == "totalPoints") {
      filteredPlayers.sort((a, b) => b.total_points - a.total_points);
    }
    return filteredPlayers.filter((player) => {
      return ((player.cost <= this.state.maxCost) && (player.cost >= this.state.minCost));
    });
  }

  filterForPosition(players, position) {
    return players.filter((player) => player.position == position);
  }

  bookmarkedPlayers() {
    return this.state.players.filter((player) => player.bookmarked);
  }

  upComingMatches() {
    return this.props.fixtures.filter((match) => Date.parse(match.kickoff_time) > new Date());
  }

  goToCarouselStart() {
    if (this.forwards().length > 0) this.forwardsCarousel.slider.slickGoTo(0);
    if (this.midFielders().length > 0) this.midFieldersCarousel.slider.slickGoTo(0);
    if (this.defenders().length > 0) this.defendersCarousel.slider.slickGoTo(0);
    if (this.goalKeepers().length > 0) this.goalKeepersCarousel.slider.slickGoTo(0);
    if (this.bookmarkedPlayers().length > 0) this.bookmarkedCarousel.slider.slickGoTo(0);
  }

  changeCostRange([newMinCost, newMaxCost]) {
    this.goToCarouselStart();
    this.setState({minCost: newMinCost, maxCost: newMaxCost});
  }

  updateSelectedTeams(teams) {
    this.goToCarouselStart();
    this.setState({selectedTeams: teams});
  }

  changeSortCriterion = changeEvent => {
    this.goToCarouselStart();
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }

  costIncreasedPlayers() {
    return this.state.players.filter((player) => Number(player.cost_change_event) > 0)
  }

  costDecreasedPlayers() {
    return this.state.players.filter((player) => Number(player.cost_change_event) < 0)
  }

  toggleBookmark(player) {
    let players = this.state.players;
    let playerIndex = players.findIndex(p => p.id == player.id);
    players[playerIndex].bookmarked = !players[playerIndex].bookmarked;
    this.setState({players: players});
  }

  forwards() {
    return this.filterForPosition(this.filteredPlayers(), 4);
  }

  midFielders() {
    return this.filterForPosition(this.filteredPlayers(), 3);
  }

  defenders() {
    return this.filterForPosition(this.filteredPlayers(), 2);
  }

  goalKeepers() {
    return this.filterForPosition(this.filteredPlayers(), 1);
  }

  render() {
    let costSliderMarks = {};
    costSliderMarks[this.globalMinCost()] = this.globalMinCost().toString();
    costSliderMarks[this.globalMaxCost()] = this.globalMaxCost().toString();
    return (
      <div>
        <div className="page-header">
          <div className="row d-flex shadow-lg">
            <div className="offset-1 py-4">
              <img className="logo-image" src={this.props.logoURL}/>
            </div>
          </div>
        </div>
        <div className="root-container">
          <div className="row carousel-panel py-2">
            <div className="offset-1 col-10 p-0 d-flex flex-row-reverse flex-wrap">
              <div className="filter-container col-lg-3 d-flex flex-column p-2 justify-content-between shadow my-2">
                <span className="filter-container__title">Filters</span>
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
                         trackStyle={[{backgroundColor: '#38003c'}]}
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
                         renderList={({items, selected, multiple, selectValue, getIsSelected}) =>
                           items.map(item => (
                             <div key={item.id} onClick={() => selectValue(item)}
                                  className="team-filter__dropdown-item">
                               {getIsSelected(item) ?
                                 <span className="team-filter__dropdown-item--selected">{item.name}</span> : item.name}
                             </div>
                           ))
                         }
                  />
                </div>
              </div>
              <div className="col-md-9 d-flex flex-column p-0">
                <div className="d-flex nav nav-tabs border-bottom-0 mt-2" id="playerCarouselTab" role="tablist">
                  <div className="active mr-3 mr-md-4 nav-link carousel-tab p-0" id="forwards-tab" data-toggle="tab"
                        href="#forwards" role="tab">
                    <span className="d-none d-md-block">Forwards</span>
                    <span className="d-block d-md-none">FWD</span>
                  </div>
                  <div className="carousel-tab mr-3 mr-md-4 nav-link p-0" id="mid-fielders-tab" data-toggle="tab"
                        href="#mid-fielders" role="tab">
                    <span className="d-none d-md-block">Mid-Fielders</span>
                    <span className="d-block d-md-none">MDF</span>
                  </div>
                  <div className="carousel-tab mr-3 mr-md-4 nav-link p-0" id="defenders-tab" data-toggle="tab" href="#defenders"
                        role="tab">
                    <span className="d-none d-md-block">Defenders</span>
                    <span className="d-block d-md-none">DFD</span>
                  </div>
                  <div className="carousel-tab mr-3 mr-md-4 nav-link p-0" id="goal-keepers-tab" data-toggle="tab" href="#goal-keepers"
                        role="tab">
                    <span className="d-none d-md-block">Goal-Keepers</span>
                    <span className="d-block d-md-none">GKP</span>
                  </div>
                  <div className="carousel-tab nav-link p-0" id="bookmarked-tab" data-toggle="tab" href="#bookmarked"
                        role="tab">
                    <span className="d-none d-md-block">Favourites</span>
                    <span className="d-block d-md-none">FAV</span>
                  </div>
                </div>
                <div className="mt-md-4 mr-md-4 tab-content" id="playerCarouselTabContent">
                  <div className="tab-pane fade show active" id="forwards" role="tabpanel">
                    <PlayerCarousel
                      players={this.forwards()}
                      upComingMatches={this.upComingMatches()}
                      teams={this.props.teams}
                      fixtures={this.props.fixtures}
                      logoURL={this.props.logoURL}
                      toggleBookmarkCB={this.toggleBookmark}
                      ref={carousel => (this.forwardsCarousel = carousel)}
                    />
                  </div>
                  <div className="tab-pane fade" id="mid-fielders" role="tabpanel">
                    <PlayerCarousel
                      players={this.midFielders()}
                      upComingMatches={this.upComingMatches()}
                      teams={this.props.teams}
                      fixtures={this.props.fixtures}
                      logoURL={this.props.logoURL}
                      toggleBookmarkCB={this.toggleBookmark}
                      ref={carousel => (this.midFieldersCarousel = carousel)}
                    />
                  </div>
                  <div className="tab-pane fade" id="defenders" role="tabpanel">
                    <PlayerCarousel
                      players={this.defenders()}
                      upComingMatches={this.upComingMatches()}
                      teams={this.props.teams}
                      fixtures={this.props.fixtures}
                      logoURL={this.props.logoURL}
                      toggleBookmarkCB={this.toggleBookmark}
                      ref={carousel => (this.defendersCarousel = carousel)}
                    />
                  </div>
                  <div className="tab-pane fade" id="goal-keepers" role="tabpanel">
                    <PlayerCarousel
                      players={this.goalKeepers()}
                      upComingMatches={this.upComingMatches()}
                      teams={this.props.teams}
                      fixtures={this.props.fixtures}
                      logoURL={this.props.logoURL}
                      toggleBookmarkCB={this.toggleBookmark}
                      ref={carousel => (this.goalKeepersCarousel = carousel)}
                    />
                  </div>
                  <div className="tab-pane fade" id="bookmarked" role="tabpanel">
                    <PlayerCarousel
                      players={this.bookmarkedPlayers()}
                      upComingMatches={this.upComingMatches()}
                      teams={this.props.teams}
                      fixtures={this.props.fixtures}
                      logoURL={this.props.logoURL}
                      toggleBookmarkCB={this.toggleBookmark}
                      ref={carousel => (this.bookmarkedCarousel = carousel)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row offset-md-1 col-md-10 f-flex flex-wrap mt-5 p-0">
            <div className="price-change-panel col-md-8 pr-5">
              <div className="price-change-title">Latest Price Changes</div>
              <div className="d-flex my-3 nav nav-tabs border-bottom-0" id="priceChangeTab" role="tablist">
                <div className="price-change-pill px-2 py-1 mr-2 nav-link active" id="price-rise-tab" data-toggle="tab"
                     href="#pricerise" role="tab">RISE
                </div>
                <div className="price-change-pill px-2 py-1 nav-link" id="price-fall-tab" data-toggle="tab"
                     href="#pricefall" role="tab">FALL
                </div>
              </div>
              <div className="tab-content" id="priceChangeTabContent">
                <div className="tab-pane fade show active" id="pricerise" role="tabpanel">
                  {
                    this.costIncreasedPlayers().map((player) => {
                      return (<div className="player-cost-change-card d-flex justify-content-between p-2 mb-1"
                                   key={player.id}>
                        <div>{player.full_name}</div>
                        <div className="d-flex align-items-center">
                          <span className="lime-green-text">
                              +{player.cost_change_event.toFixed(1)}
                          </span>
                          <span className="grey-text small">&nbsp;({player.cost_change_start.toFixed(1)})</span>
                        </div>
                      </div>);
                    })
                  }
                </div>
                <div className="tab-pane fade" id="pricefall" role="tabpanel">
                  {
                    this.costDecreasedPlayers().map((player) => {
                      return (<div className="player-cost-change-card d-flex justify-content-between p-2 mb-1"
                                   key={player.id}>
                        <div>{player.full_name}</div>
                        <div className="d-flex align-items-center">
                          <span className="red-text">
                              {player.cost_change_event.toFixed(1)}
                          </span>
                          <span className="grey-text small">&nbsp;({player.cost_change_start >= 0 ? "+" : ""}{player.cost_change_start.toFixed(1)})</span>
                        </div>
                      </div>);
                    })
                  }
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <TwitterTimelineEmbed
                sourceType="list"
                ownerScreenName="unbottler"
                slug="fantasy-premier-league"
                options={{height: 800}}
              />
            </div>
          </div>
        </div>
        <div className="m-4">
          <div className="footer__text">
            with <FontAwesomeIcon icon={faHeart} className="red-text"/> from&nbsp;
            <a href="/humans.txt" target="_blank">team unbottler</a>
          </div>
          <div className="footer__subtext">
            do tweet your suggestions/feedback to&nbsp;
            <a href="https://twitter.com/unbottler" target="_blank">
              @unbottler
            </a>
          </div>
        </div>
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