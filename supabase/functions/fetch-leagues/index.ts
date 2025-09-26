import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sport mappings to show organized leagues
const SPORT_LEAGUES = {
  'soccer_epl': 'English Premier League',
  'soccer_efl_champ': 'English Championship', 
  'soccer_spain_la_liga': 'Spanish La Liga',
  'soccer_italy_serie_a': 'Italian Serie A',
  'soccer_germany_bundesliga': 'German Bundesliga',
  'soccer_france_ligue_one': 'French Ligue 1',
  'soccer_uefa_champs_league': 'UEFA Champions League',
  'soccer_uefa_europa_league': 'UEFA Europa League',
  'soccer_fifa_world_cup': 'FIFA World Cup',
  'soccer_uefa_euros': 'UEFA European Championship',
  'basketball_nba': 'NBA',
  'basketball_euroleague': 'EuroLeague Basketball',
  'americanfootball_nfl': 'NFL',
  'icehockey_nhl': 'NHL',
  'tennis_wta': 'WTA Tennis',
  'tennis_atp': 'ATP Tennis'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sportType = url.searchParams.get('sportType');
    
    const oddsApiKey = Deno.env.get('ODDS_API_KEY');
    
    if (!oddsApiKey) {
      throw new Error('ODDS_API_KEY not found');
    }

    // Fetch all sports to get active leagues
    const response = await fetch(`https://api.the-odds-api.com/v4/sports?apiKey=${oddsApiKey}`);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const sports = await response.json();
    
    // Filter leagues based on sport type if provided
    let filteredLeagues = sports;
    if (sportType && sportType !== 'all') {
      filteredLeagues = sports.filter((sport: any) => 
        sport.key.toLowerCase().includes(sportType.toLowerCase())
      );
    }
    
    // Add friendly names and organize by sport type
    const organizedLeagues = filteredLeagues.map((sport: any) => ({
      ...sport,
      friendlyName: SPORT_LEAGUES[sport.key as keyof typeof SPORT_LEAGUES] || sport.title,
      sportType: sport.key.split('_')[0]
    }));

    console.log(`Successfully fetched ${organizedLeagues.length} leagues for sport type: ${sportType || 'all'}`);

    return new Response(JSON.stringify({ leagues: organizedLeagues }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});