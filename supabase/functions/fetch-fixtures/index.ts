import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sport = 'soccer_epl', region = 'uk', timeframe = 'upcoming' } = await req.json();
    const apiKey = Deno.env.get('ODDS_API_KEY');

    if (!apiKey) {
      throw new Error('ODDS_API_KEY is not configured');
    }

    console.log(`Fetching ${timeframe} fixtures for sport: ${sport}, region: ${region}`);

    // Fetch odds data which includes match information
    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=${region}&markets=h2h`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const now = new Date();

    // Separate upcoming and past matches
    let matches = data.map((match: any) => ({
      id: match.id,
      sport_key: match.sport_key,
      sport_title: match.sport_title,
      commence_time: match.commence_time,
      home_team: match.home_team,
      away_team: match.away_team,
      bookmakers: match.bookmakers || [],
      is_past: new Date(match.commence_time) < now
    }));

    // Filter based on timeframe
    if (timeframe === 'upcoming') {
      matches = matches.filter((m: any) => !m.is_past);
      matches.sort((a: any, b: any) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());
    } else {
      matches = matches.filter((m: any) => m.is_past);
      matches.sort((a: any, b: any) => new Date(b.commence_time).getTime() - new Date(a.commence_time).getTime());
    }

    console.log(`Found ${matches.length} ${timeframe} matches`);

    return new Response(
      JSON.stringify({ 
        fixtures: matches,
        total: matches.length,
        timeframe 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
