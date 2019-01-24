import React from "react"
import PropTypes from "prop-types"
import Slider from "react-slick";

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
            <div className="col-md-8 my-4">
            <Slider {...settings}>
                {
                    this.props.players.map((player) => {
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
                        )
                    })
                }
            </Slider>
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
