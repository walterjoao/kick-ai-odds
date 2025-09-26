import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const url = new URL(req.url);
    const sport = url.searchParams.get('sport') || 'soccer_epl';
    const region = url.searchParams.get('region') || 'uk';
    const market = url.searchParams.get('market') || 'h2h';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const oddsApiKey = Deno.env.get('ODDS_API_KEY');
    
    if (!oddsApiKey) {
      throw new Error('ODDS_API_KEY not found');
    }

    const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${oddsApiKey}&regions=${region}&markets=${market}&oddsFormat=decimal&dateFormat=iso`;
    
    console.log('Fetching odds from:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const odds = await response.json();
    
    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOdds = odds.slice(startIndex, endIndex);
    
    console.log(`Successfully fetched ${odds.length} odds, returning ${paginatedOdds.length} for page ${page}`);

    return new Response(JSON.stringify({ 
      odds: paginatedOdds, 
      total: odds.length,
      page,
      limit,
      totalPages: Math.ceil(odds.length / limit)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching odds:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});