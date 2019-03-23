import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoundSign } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";
import {faHandPointRight} from "@fortawesome/free-solid-svg-icons";
import {faHandPointLeft} from "@fortawesome/free-regular-svg-icons";
import PropTypes from "prop-types";
import ReactCardFlip from 'react-card-flip';
import onClickOutside from "react-onclickoutside";

class PlayerCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isFlipped: false };
        this.flip = this.flip.bind(this);
        this.next5MatchDetails = this.next5MatchDetails.bind(this);
        this.state = { isFlipped: false, backBody: <FontAwesomeIcon icon={faSpinner} className="fa-spin m-auto fa-6x" /> };
    }

    next5MatchDetails() {
        return this.props.next5Matches.map((match) => {
            let isHome = (match.team_a === this.props.player.team ? false : true);
            let opponentId = (isHome ? match.team_a : match.team_h);

            let opponentName = this.props.teams.find((t) => { return (t.id == opponentId); }).short_name;

            let fixture = this.props.fixtures.find((match) => {
                let awayTeamId = (isHome ? opponentId : this.props.player.team);
                let homeTeamId = (isHome ? this.props.player.team : opponentId);
                return (match.team_a == awayTeamId && match.team_h == homeTeamId);
            });

            let difficulty = (isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty)
            return { opponentName: opponentName, isHome: isHome, difficulty: difficulty, gameWeek: fixture.game_week };
        });
    }

    flip() {
        let that = this;
        if (!this.state.isFlipped) {
            fetch('/player_details/' + this.props.player.id)
                .then(function (response) {
                    return response.json();
                })
                .then(function (scores) {
                    console.log(JSON.stringify(scores));
                    let scoreList = that.next5MatchDetails().map(team => {
                        let score = team.isHome ? scores.h[team.difficulty - 1] : scores.a[team.difficulty - 1];
                        return (
                            <div className="prediction-bar border d-flex flex-column p-1 justify-content-between align-items-center" key={team.opponentName}>
                                <div className="p-2 prediction-bar__opponent-name">{team.opponentName}</div>
                                <div className={"w-100 text-center prediction-bar__prediction prediction-bar__prediction--d" + team.difficulty}>{score}</div>
                            </div>)
                    });
                    let backBody = (<div className="d-flex flex-column">
                        <div className="d-flex prediction-bar__title">
                            <img className="prediction-bar__title-logo" src={that.props.logoURL} />
                            <div className="align-self-center ml-1 prediction-bar__title-text">Score Predictions</div>
                        </div>
                        <div className="d-flex prediction-bar__predictions-conatiner">
                            {scoreList}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-5 mx-3">
                            <div className="player-card__flip-btn" onClick={that.flip}>
                                <FontAwesomeIcon transform="grow-3" icon={faHandPointLeft}/>
                            </div>
                        </div>
                    </div>)
                    that.setState({ backBody: backBody });
                });
        }
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }

    handleClickOutside() {
        this.setState({ isFlipped: false });
    }


    render() {
        let player = this.props.player;
        return (
            <ReactCardFlip isFlipped={this.state.isFlipped}>
                <div key={player.full_name} className="card mx-1 player-card__container shadow mt-2 mb-4" key="front">
                    <div className="d-flex flex-column">
                        <div className="player-card__front-body p-3">
                            <div className="player-card-body__top d-flex align-items-end">
                                <div className="pc-body-top__jersey">
                                    <img className="card-img-top player-card__img my-auto"
                                         src={"https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + player.code + ".png"}/>
                                </div>
                                <div className="pc-body-top__matches d-flex flex-column justify-content-end mb-2 ml-2">
                                    {
                                    this.next5MatchDetails().map(team => {
                                    return (
                                    <div key={team.opponentName} className="d-flex justify-content-between align-items-center my-1">
                                        <div>{team.gameWeek}</div>
                                        <div>{team.opponentName} {team.isHome ? ' (H)' : ' (A)'}</div>
                                        <div className={"player-card__difficulty-cell px-2 py-1 rounded player-card__difficulty-cell--d" + team.difficulty}>{team.difficulty}</div>
                                    </div>);
                                    })
                                    }
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <div className="d-flex flex-column">
                                    <div className="player-card-__player-name">{player.full_name}</div>
                                    <div className="player-card-__team-name">{this.props.teams.find((t) => {return t.id == player.team}).name}</div>
                                </div>
                                <div className="player-card-__player-cost">
                                    &pound;{player.cost}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                <div className="player-card__bookmark-container d-flex shadow" onClick={_e => this.props.toggleBookmarkCB(player)}>
                                    {
                                        player.bookmarked ?
                                            <FontAwesomeIcon icon={faHeartSolid} className="red-text m-auto"/>
                                            :
                                            <FontAwesomeIcon icon={faHeart} className="red-text m-auto"/>
                                    }
                                </div>
                                <div className="player-card__flip-btn" onClick={this.flip}>
                                    <FontAwesomeIcon transform="grow-3" icon={faHandPointRight}/>
                                </div>
                            </div>
                        </div>
                        <div className="player-card__front-footer d-flex justify-content-between align-items-center px-2">
                            <div data-toggle="tooltip" data-placement="bottom" title="Cost">
                                <FontAwesomeIcon icon={faPoundSign} className="green-text mr-1" />
                                <span>{player.cost}</span>
                            </div>
                            <div data-toggle="tooltip" data-placement="bottom" title="Form">
                                <FontAwesomeIcon icon={faChartLine} className="green-text mr-1" />
                                <span>{player.form}</span>
                            </div>
                            <div data-toggle="tooltip" data-placement="bottom" title="Total points">
                                <FontAwesomeIcon icon={faRocket} className="green-text mr-1" />
                                <span>{player.total_points}</span>
                            </div>
                        </div>
                    </div>
                    {/*<div className="row">*/}
                        {/*<div className="col-6">*/}
                            {/*<img className="card-img-top player-card__img my-auto" src={"https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + player.code + ".png"} alt="Card image cap" />*/}
                            {/*<h2 className="text-center"><FontAwesomeIcon icon={faPoundSign} />{player.cost}</h2>*/}
                        {/*</div>*/}
                        {/*<div className="col-6 d-flex flex-column justify-content-center">*/}
                            {/*<ul className="list-group p-1">*/}
                                {/*{*/}
                                    {/*this.next5MatchDetails().map(team => {*/}
                                        {/*return (*/}
                                            {/*<li className="list-group-item player-card__fixture-cell d-flex p-0 justify-content-around" key={team.opponentName}>*/}
                                                {/*<div className="p-2">{team.gameWeek}</div>*/}
                                                {/*<div className="p-2">{team.opponentName} {team.isHome ? ' (H)' : ' (A)'}</div>*/}
                                                {/*<div className={"border-left p-2 player-card__difficulty-cell player-card__difficulty-cell--d" + team.difficulty}>{team.difficulty}</div>*/}
                                            {/*</li>);*/}
                                    {/*})*/}
                                {/*}*/}
                            {/*</ul>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="player-card__card-header card-header d-flex justify-content-between align-items-center pl-2">*/}
                        {/*<div>{player.full_name}</div>*/}
                        {/*<div className={"pr-2 player-card-header__availability " + "player-card-header__availability--" + player.playing_chance}>{player.playing_chance}</div>*/}
                    {/*</div>*/}
                    {/*<ul className="list-group list-group-flush">*/}
                        {/*<li className="list-group-item d-flex justify-content-between">*/}
                            {/*<div data-toggle="tooltip" data-placement="bottom" title="Cost">*/}
                                {/*<FontAwesomeIcon icon={faPoundSign} className="green-text mr-1" />*/}
                                {/*<span className="grey-text">{player.cost}</span>*/}
                            {/*</div>*/}
                            {/*<div data-toggle="tooltip" data-placement="bottom" title="Form">*/}
                                {/*<FontAwesomeIcon icon={faChartLine} className="green-text mr-1" />*/}
                                {/*<span className="grey-text">{player.form}</span>*/}
                            {/*</div>*/}
                            {/*<div data-toggle="tooltip" data-placement="bottom" title="Total points">*/}
                                {/*<FontAwesomeIcon icon={faRocket} className="green-text mr-1" />*/}
                                {/*<span className="grey-text">{player.total_points}</span>*/}
                            {/*</div>*/}
                        {/*</li>*/}
                    {/*</ul>*/}
                    {/*<div className="p-2 d-flex player-card__flip-btn">*/}
                        {/*<FontAwesomeIcon icon={faChevronCircleRight} className="ml-auto" onClick={this.flip} />*/}
                    {/*</div>*/}
                </div>
                <div key={player.full_name} className="card mx-1 player-card__container shadow mt-2 mb-4" key="back">
                    <div className="player-card__back-body p-3 d-flex flex-column align-items-center">
                        {this.state.backBody}
                    </div>
                </div>
            </ReactCardFlip>
        );
    }
}

PlayerCard.propTypes = {
    player: PropTypes.object.isRequired,
    next5Matches: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    fixtures: PropTypes.array.isRequired,
    logoURL: PropTypes.string.isRequired,
    toggleBookmarkCB: PropTypes.func.isRequired
};

export default onClickOutside(PlayerCard);
