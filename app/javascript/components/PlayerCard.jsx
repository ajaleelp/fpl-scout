import React from "react";
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
                        <li className="list-group-item">Form: <span className="grey-text">{player.form}</span></li>
                        <li className="list-group-item">Cost: <span className="grey-text">{player.cost}</span></li>
                        <li className="list-group-item">Playing Chance: <span className="grey-text">{player.playing_chance}</span></li>
                    </ul>
                </div>
            </div>
        );
    }
}

PlayerCard.propTypes = {
    player: PropTypes.object.isRequired
};
