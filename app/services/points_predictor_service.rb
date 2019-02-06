# Returns a player's 'Unbottler' predicted scores
class PointsPredictorService
  def initialize(player_id)
    @player_id = player_id
  end

  def predicted_points
    {
      a: (1..5).map { |fdr| points(fdr, false) },
      h: (1..5).map { |fdr| points(fdr, true) }
    }
  end

  private

  def points(fdr, home)
    points_from_history = last_5_similar_points_avg(fdr, home)
    points_from_history ? (0.5 * (form + points_from_history)).round(1) : 'n/a'
  end

  def form
    player_element['form'].to_i
  end

  def team_id
    player_element['team']
  end

  def last_5_similar_points_avg(fdr, home)
    match_ids = last_5_similar_matches_played(fdr, home).map { |m| m['id'] }
    return nil if match_ids.blank?

    points = element_summary_response['history'].filter { |match| match_ids.include? match['fixture'] }
      .map { |match| match['total_points'] }

    points.sum / points.size.to_f
  end

  def last_5_similar_matches_played(fdr, home)
    matches = completed_matches_by_team
      .filter { |match| (home ? (team_id == match['team_h']) : (team_id == match['team_a'])) }
      .filter { |match| (home ? (fdr == match['team_h_difficulty']) : (fdr == match['team_a_difficulty'])) }
      .filter { |match| matches_played.include? match['id'] }
    matches.length < 5 ? matches : matches[-5..-1]
  end

  def matches_played
    history = element_summary_response['history']
    history.filter { |match| match['minutes'].to_i.positive? }.map { |match| match['fixture'] }
  end

  def completed_matches_by_team
    completed_matches.filter { |match| match['team_a'] == team_id || match['team_h'] == team_id }
  end

  def completed_matches
    fixtures.filter { |match| match['kickoff_time'].present? && Date.parse(match['kickoff_time']) < Time.now }
  end

  def fixtures
    @fixtures ||= begin
      JSON.parse(RestClient.get('https://fantasy.premierleague.com/drf/fixtures'))
    end
  end

  def bootstrap_static_response
    @bootstrap_static_response ||= JSON.parse(RestClient.get('https://fantasy.premierleague.com/drf/bootstrap-static'))
  end

  def player_element
    @player_element ||= bootstrap_static_response['elements'].find { |p| p['id'] == @player_id }
  end

  def element_summary_response
    @element_summary_response ||= JSON.parse(RestClient.get("https://fantasy.premierleague.com/drf/element-summary/#{@player_id}"))
  end
end