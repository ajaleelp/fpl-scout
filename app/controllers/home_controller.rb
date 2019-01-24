class HomeController < ApplicationController
  def index
    json_data = JSON.parse(RestClient.get('https://fantasy.premierleague.com/drf/bootstrap-static'))
    @players = json_data['elements'].map do |player|
      {
          full_name: "#{player['first_name']} #{player['second_name']}",
          form: player['form'],
          cost: player['now_cost'],
          playing_chance: player['chance_of_playing_next_round']
      }
    end.sort_by { |p| p[:form].to_f }.reverse
  end
end