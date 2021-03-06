class HomeController < ApplicationController
  def index
    players_json = JSON.parse(RestClient.get('https://fantasy.premierleague.com/api/bootstrap-static/'))
    @players = players_json['elements'].map do |player|
      {
        full_name: "#{player['first_name']} #{player['second_name']}",
        form: player['form'],
        cost: player['now_cost'].to_f / 10,
        total_points: player['total_points'],
        playing_chance: player['chance_of_playing_next_round'] || 100,
        code: player['code'],
        position: player['element_type'],
        team: player['team'],
        id: player['id'],
        cost_change_event: player['cost_change_event'].to_f / 10,
        cost_change_start: player['cost_change_start'].to_f / 10,
        bookmarked: false
      }
    end.sort_by { |p| p[:form].to_f }.reverse

    teams_json = JSON.parse(RestClient.get('https://fantasy.premierleague.com/api/bootstrap-static/'))['teams']
    @teams = teams_json.map do |team|
      {
        id: team['id'],
        short_name: team['short_name'],
        name: team['name'],
        team_kit: ActionController::Base.helpers.image_path('team_jerseys/' + team['short_name'] + ".png")
      }
    end

    fixtures_json = JSON.parse(RestClient.get('https://fantasy.premierleague.com/api/fixtures/'))
    @fixtures = fixtures_json.map do |match|
      {
        team_a: match['team_a'],
        team_h: match['team_h'],
        team_a_difficulty: match['team_a_difficulty'],
        team_h_difficulty: match['team_h_difficulty'],
        kickoff_time: match['kickoff_time'],
        game_week: match['event']
      }
    end
  end

  def player_details
    render json: PointsPredictorService.new(params[:id].to_i).predicted_points
  end
end