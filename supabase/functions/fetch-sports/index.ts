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
    const oddsApiKey = Deno.env.get('ODDS_API_KEY');
    
    if (!oddsApiKey) {
      throw new Error('ODDS_API_KEY not found');
    }

    const response = await fetch(`https://api.the-odds-api.com/v4/sports?apiKey=${oddsApiKey}`);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const sports = await response.json();
    
    console.log('Successfully fetched sports:', sports.length);

    return new Response(JSON.stringify({ sports }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sports:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});