import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoundSign } from '@fortawesome/free-solid-svg-icons';
import { faChartLine} from "@fortawesome/free-solid-svg-icons";
import { faPercent} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export default class PlayerCard extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let player = this.props.player;
        return (
            <div>
                <div key={player.full_name} className="card mx-4">
                    <img className="card-img-top player-card__img my-auto" src={"https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + player.code + ".png"} alt="Card image cap"/>
                    <div className="card-header">
                        {player.full_name}
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                            <div data-toggle="tooltip" data-placement="bottom" title="Cost">
                                <FontAwesomeIcon icon={faPoundSign} className="green-text mr-1"/>
                                <span className="grey-text">{player.cost}</span>
                            </div>
                            <div data-toggle="tooltip" data-placement="bottom" title="Form">
                                <FontAwesomeIcon icon={faChartLine} className="green-text mr-1"/>
                                <span className="grey-text">{player.form}</span>
                            </div>
                            <div data-toggle="tooltip" data-placement="bottom" title="Playing Chance">
                                <FontAwesomeIcon icon={faPercent} className="green-text mr-1"/>
                                <span className="grey-text">{player.playing_chance}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

PlayerCard.propTypes = {
    player: PropTypes.object.isRequired
};
