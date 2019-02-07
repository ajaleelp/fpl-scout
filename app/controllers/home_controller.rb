class HomeController < ApplicationController
  def index
    players_json = JSON.parse(RestClient.get('https://fantasy.premierleague.com/drf/bootstrap-static'))
    @players = players_json['elements'].map do |player|
      {
          full_name: "#{player['first_name']} #{player['second_name']}",
          form: player['form'],
          cost: player['now_cost'].to_f / 10,
          total_points: player['total_points'],
          playing_chance: player['chance_of_playing_next_round'],
          code: player['code'],
          position: player['element_type'],
          team: player['team']
      }
    end.sort_by { |p| p[:form].to_f }.reverse

    teams_json = JSON.parse(RestClient.get('https://fantasy.premierleague.com/drf/teams'))
    @teams = teams_json.map do |team|
      {
          id: team['id'],
          short_name: team['short_name'],
          name: team['name']
      }
    end

    fixtures_json = JSON.parse(RestClient.get('https://fantasy.premierleague.com/drf/fixtures'))
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
end