import React from "react"
import PropTypes from "prop-types"
import {default as Carousel} from "react-slick";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import PlayerCard from "./PlayerCard";

class RootApp extends React.Component {
    render() {
        var settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };
        return (
            <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8 root-container px-4">
            <Slider className="slider-root mx-auto" min={0} max={150} marks={{0: '0', 150: '150'}}/>
            <Carousel {...settings}>
                {
                    this.props.players.map((player) => <PlayerCard player={player} key={player.full_name}/>)
                }
            </Carousel>
            </div>
            <div className="col-md-2"></div>
            </div>
        );
    }
};

RootApp.propTypes = {
    players: PropTypes.array
};
export default RootApp
