import React from "react"
import PropTypes from "prop-types"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import PlayerCarousel from "./PlayerCarousel";

export default class RootApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxCost: 150,
            players: this.props.players
        };

        this.filteredPlayers = this.filteredPlayers.bind(this);
    }

    filteredPlayers() {
        return this.state.players.filter((player) => {return parseInt(player.cost) < this.state.maxCost;});
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8 root-container px-4">
                    <Slider className="slider-root mx-auto" min={0} max={150} marks={{0: '0', 150: '150'}}/>
                    <PlayerCarousel players={this.filteredPlayers()}/>
                </div>
                <div className="col-md-2"></div>
            </div>
        );
    }
}

RootApp.propTypes = {
    players: PropTypes.array.isRequired
};