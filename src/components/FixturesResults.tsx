import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Fixture {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  is_past: boolean;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

interface FixturesResultsProps {
  sport?: string;
  region?: string;
}

const FixturesResults: React.FC<FixturesResultsProps> = ({ 
  sport = 'soccer_epl', 
  region = 'uk' 
}) => {
  const [upcomingFixtures, setUpcomingFixtures] = useState<Fixture[]>([]);
  const [pastMatches, setPastMatches] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchFixtures = async (timeframe: 'upcoming' | 'past') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-fixtures', {
        body: { sport, region, timeframe }
      });

      if (error) throw error;

      if (timeframe === 'upcoming') {
        setUpcomingFixtures(data.fixtures || []);
      } else {
        setPastMatches(data.fixtures || []);
      }
    } catch (err) {
      console.error(`Error fetching ${timeframe} fixtures:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures('upcoming');
    fetchFixtures('past');
  }, [sport, region]);

  const getWinProbability = (fixture: Fixture, team: string) => {
    if (!fixture.bookmakers || fixture.bookmakers.length === 0) return null;
    
    const h2hMarket = fixture.bookmakers[0]?.markets?.find(m => m.key === 'h2h');
    if (!h2hMarket) return null;

    const outcome = h2hMarket.outcomes.find(o => o.name === team);
    if (!outcome) return null;

    // Convert odds to implied probability
    const probability = (1 / outcome.price) * 100;
    return probability.toFixed(1);
  };

  const getAverageOdds = (fixture: Fixture, team: string) => {
    if (!fixture.bookmakers || fixture.bookmakers.length === 0) return null;

    const odds: number[] = [];
    fixture.bookmakers.forEach(bookmaker => {
      const h2hMarket = bookmaker.markets?.find(m => m.key === 'h2h');
      const outcome = h2hMarket?.outcomes.find(o => o.name === team);
      if (outcome) odds.push(outcome.price);
    });

    if (odds.length === 0) return null;
    return (odds.reduce((a, b) => a + b, 0) / odds.length).toFixed(2);
  };

  const MatchCard: React.FC<{ fixture: Fixture }> = ({ fixture }) => {
    const homeProb = getWinProbability(fixture, fixture.home_team);
    const awayProb = getWinProbability(fixture, fixture.away_team);
    const homeOdds = getAverageOdds(fixture, fixture.home_team);
    const awayOdds = getAverageOdds(fixture, fixture.away_team);

    return (
      <Card className="mb-4 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {format(new Date(fixture.commence_time), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {format(new Date(fixture.commence_time), 'HH:mm')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Home Team */}
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">{fixture.home_team}</h3>
              {homeProb && (
                <Badge variant="secondary" className="mb-1">
                  {homeProb}% Win
                </Badge>
              )}
              {homeOdds && (
                <p className="text-sm text-muted-foreground">
                  Avg Odds: {homeOdds}
                </p>
              )}
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                <span className="text-sm font-bold text-primary">VS</span>
              </div>
              <Badge className="mt-2" variant="outline">
                {fixture.sport_title}
              </Badge>
            </div>

            {/* Away Team */}
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">{fixture.away_team}</h3>
              {awayProb && (
                <Badge variant="secondary" className="mb-1">
                  {awayProb}% Win
                </Badge>
              )}
              {awayOdds && (
                <p className="text-sm text-muted-foreground">
                  Avg Odds: {awayOdds}
                </p>
              )}
            </div>
          </div>

          {/* Bookmakers Info */}
          {fixture.bookmakers && fixture.bookmakers.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {fixture.bookmakers.length} Bookmakers offering odds
                </span>
                {fixture.is_past && (
                  <Badge variant="outline">Match Concluded</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Fixtures & Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">
              Upcoming Matches ({upcomingFixtures.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Matches ({pastMatches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading upcoming fixtures...</p>
              </div>
            ) : upcomingFixtures.length > 0 ? (
              <div className="space-y-4">
                {upcomingFixtures.map((fixture) => (
                  <MatchCard key={fixture.id} fixture={fixture} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming fixtures found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading past matches...</p>
              </div>
            ) : pastMatches.length > 0 ? (
              <div className="space-y-4">
                {pastMatches.map((fixture) => (
                  <MatchCard key={fixture.id} fixture={fixture} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No past matches found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FixturesResults;
