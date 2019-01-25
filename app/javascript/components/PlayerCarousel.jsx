import React from "react";
import PropTypes from "prop-types";
import PlayerCard from "./PlayerCard";
import {default as Carousel} from "react-slick/lib";

export default class PlayerCarousel extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        var settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            lazyLoad: 'ondemand'
        };
        return (
            <Carousel {...settings} className="m-4">
                {
                    this.props.players.map((player) => <PlayerCard player={player} key={player.full_name}/>)
                }
            </Carousel>
        );
    }
}

PlayerCarousel.propTypes = {
    players: PropTypes.array.isRequired
};
