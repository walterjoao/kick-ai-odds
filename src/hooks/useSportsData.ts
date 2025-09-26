import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Sport {
  key: string;
  title: string;
  active: boolean;
  has_outrights: boolean;
  friendlyName?: string;
  sportType?: string;
}

export interface League extends Sport {}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Array<{
    key: string;
    last_update: string;
    outcomes: Array<{
      name: string;
      price: number;
    }>;
  }>;
}

export interface OddsData {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface OddsResponse {
  odds: OddsData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useSportsData = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [odds, setOdds] = useState<OddsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-sports');
      
      if (error) throw error;
      
      setSports(data.sports || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sports');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeagues = async (sportType?: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-leagues', {
        body: { sportType }
      });
      
      if (error) throw error;
      
      setLeagues(data.leagues || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leagues');
    } finally {
      setLoading(false);
    }
  };

  const fetchOdds = async (params: {
    sport?: string;
    region?: string;
    market?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-odds', {
        body: params
      });
      
      if (error) throw error;
      
      setOdds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch odds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  return {
    sports,
    leagues,
    odds,
    loading,
    error,
    fetchSports,
    fetchLeagues,
    fetchOdds,
  };
};