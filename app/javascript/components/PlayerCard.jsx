import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoundSign } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import ReactCardFlip from 'react-card-flip';

export default class PlayerCard extends React.Component {
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
                            <li className="list-group-item player-card__prediction-li p-0 d-flex justify-content-between" key={team.opponentName}>
                                <div className="p-2">{team.opponentName} {team.isHome ? ' (H)' : ' (A)'}</div>
                                <div className={"border-left p-2 player-card__difficulty-cell player-card__difficulty-cell--d" + team.difficulty}>{team.difficulty}</div>
                                <div className="border-left p-2">{score}</div>
                            </li>)
                    });
                    let backBody = <ul className="list-group p-1 d-flex flex-column align-items-stretch">{scoreList}</ul>
                    that.setState({ backBody: backBody });
                });
        }
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }


    render() {
        let player = this.props.player;
        return (
            <ReactCardFlip isFlipped={this.state.isFlipped}>
                <div key={player.full_name} className="card mx-4 player-card__container" key="front">
                    <div className="row">
                        <div className="col-6">
                            <img className="card-img-top player-card__img my-auto" src={"https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + player.code + ".png"} alt="Card image cap" />
                            <h2 className="text-center"><FontAwesomeIcon icon={faPoundSign} />{player.cost}</h2>
                        </div>
                        <div className="col-6 d-flex flex-column justify-content-center">
                            <ul className="list-group p-1">
                                {
                                    this.next5MatchDetails().map(team => {
                                        return (
                                            <li className="list-group-item player-card__fixture-cell d-flex p-0 justify-content-around" key={team.opponentName}>
                                                <div className="p-2">{team.gameWeek}</div>
                                                <div className="p-2">{team.opponentName} {team.isHome ? ' (H)' : ' (A)'}</div>
                                                <div className={"border-left p-2 player-card__difficulty-cell player-card__difficulty-cell--d" + team.difficulty}>{team.difficulty}</div>
                                            </li>);
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="card-header">
                        {player.full_name}
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                            <div data-toggle="tooltip" data-placement="bottom" title="Cost">
                                <FontAwesomeIcon icon={faPoundSign} className="green-text mr-1" />
                                <span className="grey-text">{player.cost}</span>
                            </div>
                            <div data-toggle="tooltip" data-placement="bottom" title="Form">
                                <FontAwesomeIcon icon={faChartLine} className="green-text mr-1" />
                                <span className="grey-text">{player.form}</span>
                            </div>
                            <div data-toggle="tooltip" data-placement="bottom" title="Total points">
                                <FontAwesomeIcon icon={faRocket} className="green-text mr-1" />
                                <span className="grey-text">{player.total_points}</span>
                            </div>
                        </li>
                    </ul>
                    <div className="p-2 d-flex player-card__flip-btn">
                        <FontAwesomeIcon icon={faChevronCircleRight} className="ml-auto" onClick={this.flip} />
                    </div>
                </div>
                <div key={player.full_name} className="card mx-4 player-card__container justify-content-between" key="back">
                    <div className="player-card__back-body d-flex">
                        {this.state.backBody}
                    </div>
                    <div className="p-2 d-flex player-card__flip-btn">
                        <FontAwesomeIcon icon={faChevronCircleLeft} className="ml-auto" onClick={this.flip} />
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
    fixtures: PropTypes.array.isRequired
};
