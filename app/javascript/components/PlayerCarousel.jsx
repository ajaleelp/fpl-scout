import React from "react";
import PropTypes from "prop-types";
import PlayerCard from "./PlayerCard";
import { default as Carousel } from "react-slick/lib";

export default class PlayerCarousel extends React.Component {
    constructor(props) {
        super(props);
    }

    nextMatches(player) {
        return this.props.upComingMatches.filter((match) => {
            return (match.team_a === player.team) || (match.team_h === player.team);
        });
    }

    next5Matches(player) {
        return this.nextMatches(player).sort((match) => { return Date.parse(match.kickoff_time); }).slice(0, 5)
    }


    render() {
        var settings = {
            dots: false,
            infinite: false,
            speed: 500,
            lazyLoad: 'ondemand',
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 0,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };
        return (
            <Carousel ref={slider => this.slider = slider} {...settings} className="m-4">
                {
                    this.props.players.map((player) => <PlayerCard player={player} key={player.full_name} next5Matches={this.next5Matches(player)} teams={this.props.teams} fixtures={this.props.fixtures} />)
                }
            </Carousel>
        );
    }
}

PlayerCarousel.propTypes = {
    players: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    upComingMatches: PropTypes.array.isRequired,
    fixtures: PropTypes.array.isRequired
};
