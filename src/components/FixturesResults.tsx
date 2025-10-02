import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp, Trophy, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
    const [isOpen, setIsOpen] = useState(false);
    const homeProb = getWinProbability(fixture, fixture.home_team);
    const awayProb = getWinProbability(fixture, fixture.away_team);
    const homeOdds = getAverageOdds(fixture, fixture.home_team);
    const awayOdds = getAverageOdds(fixture, fixture.away_team);

    const getDrawOdds = () => {
      if (!fixture.bookmakers || fixture.bookmakers.length === 0) return null;
      const odds: number[] = [];
      fixture.bookmakers.forEach(bookmaker => {
        const h2hMarket = bookmaker.markets?.find(m => m.key === 'h2h');
        const drawOutcome = h2hMarket?.outcomes.find(o => o.name === 'Draw');
        if (drawOutcome) odds.push(drawOutcome.price);
      });
      if (odds.length === 0) return null;
      return (odds.reduce((a, b) => a + b, 0) / odds.length).toFixed(2);
    };

    const getBestOdds = (team: string) => {
      if (!fixture.bookmakers || fixture.bookmakers.length === 0) return null;
      const odds: number[] = [];
      fixture.bookmakers.forEach(bookmaker => {
        const h2hMarket = bookmaker.markets?.find(m => m.key === 'h2h');
        const outcome = h2hMarket?.outcomes.find(o => o.name === team);
        if (outcome) odds.push(outcome.price);
      });
      if (odds.length === 0) return null;
      return Math.max(...odds).toFixed(2);
    };

    const drawOdds = getDrawOdds();
    const bestHomeOdds = getBestOdds(fixture.home_team);
    const bestAwayOdds = getBestOdds(fixture.away_team);

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

          <div className="grid grid-cols-3 gap-4 items-center mb-4">
            {/* Home Team */}
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">{fixture.home_team}</h3>
              {homeProb && (
                <Badge variant="secondary" className="mb-1">
                  {homeProb}% Win
                </Badge>
              )}
              <div className="mt-2 space-y-1">
                {homeOdds && (
                  <p className="text-sm text-muted-foreground">
                    Avg: {homeOdds}
                  </p>
                )}
                {bestHomeOdds && (
                  <p className="text-sm font-semibold text-primary">
                    Best: {bestHomeOdds}
                  </p>
                )}
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                <span className="text-sm font-bold text-primary">VS</span>
              </div>
              <Badge className="mt-2" variant="outline">
                {fixture.sport_title}
              </Badge>
              {drawOdds && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Draw</p>
                  <p className="text-sm font-semibold">{drawOdds}</p>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">{fixture.away_team}</h3>
              {awayProb && (
                <Badge variant="secondary" className="mb-1">
                  {awayProb}% Win
                </Badge>
              )}
              <div className="mt-2 space-y-1">
                {awayOdds && (
                  <p className="text-sm text-muted-foreground">
                    Avg: {awayOdds}
                  </p>
                )}
                {bestAwayOdds && (
                  <p className="text-sm font-semibold text-primary">
                    Best: {bestAwayOdds}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Match Statistics Summary */}
          <div className="grid grid-cols-3 gap-4 py-3 border-y">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Home Win Prob</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${homeProb || 0}%` }}
                  />
                </div>
                <span className="text-sm font-bold min-w-[3rem]">{homeProb}%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Bookmakers</p>
              <p className="text-lg font-bold">{fixture.bookmakers?.length || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Away Win Prob</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-bold min-w-[3rem]">{awayProb}%</span>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${awayProb || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Bookmaker Odds */}
          {fixture.bookmakers && fixture.bookmakers.length > 0 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Detailed Odds from {fixture.bookmakers.length} Bookmakers
                  </span>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-3">
                  {fixture.bookmakers.map((bookmaker) => {
                    const h2hMarket = bookmaker.markets?.find(m => m.key === 'h2h');
                    if (!h2hMarket) return null;

                    const homeOutcome = h2hMarket.outcomes.find(o => o.name === fixture.home_team);
                    const awayOutcome = h2hMarket.outcomes.find(o => o.name === fixture.away_team);
                    const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'Draw');

                    return (
                      <Card key={bookmaker.key} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{bookmaker.title}</h4>
                          {fixture.is_past && (
                            <Badge variant="outline" className="text-xs">Historical</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Home</p>
                            <p className="text-lg font-bold">{homeOutcome?.price.toFixed(2) || 'N/A'}</p>
                          </div>
                          {drawOutcome && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Draw</p>
                              <p className="text-lg font-bold">{drawOutcome.price.toFixed(2)}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Away</p>
                            <p className="text-lg font-bold">{awayOutcome?.price.toFixed(2) || 'N/A'}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {fixture.is_past && (
            <div className="mt-4 pt-4 border-t">
              <Badge variant="outline" className="w-full justify-center">
                Match Concluded
              </Badge>
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
