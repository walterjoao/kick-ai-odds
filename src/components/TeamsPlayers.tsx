import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ChevronDown, ChevronUp, Calendar, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import OddsFilters from './OddsFilters';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamData {
  team: string;
  nextMatches: Array<{
    opponent: string;
    date: string;
    homeTeam: string;
    awayTeam: string;
  }>;
  pastMatches: Array<{
    opponent: string;
    date: string;
    homeTeam: string;
    awayTeam: string;
    result?: string;
  }>;
}

interface TeamsPlayersProps {
  sport: string;
  region: string;
  market: string;
}

const TeamsPlayers: React.FC<TeamsPlayersProps> = ({ sport, region, market }) => {
  const [filters, setFilters] = useState({ sport, region, market });
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setFilters({ sport, region, market });
  }, [sport, region, market]);

  useEffect(() => {
    fetchTeamsData();
  }, [filters]);

  const fetchTeamsData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-fixtures', {
        body: { sport: filters.sport, region: filters.region }
      });

      if (error) throw error;

      // Process upcoming and past matches to extract teams
      const teamsMap = new Map<string, TeamData>();
      
      // Process upcoming matches
      data.upcoming?.forEach((match: any) => {
        const homeTeam = match.home_team;
        const awayTeam = match.away_team;
        
        // Add home team
        if (!teamsMap.has(homeTeam)) {
          teamsMap.set(homeTeam, { team: homeTeam, nextMatches: [], pastMatches: [] });
        }
        teamsMap.get(homeTeam)!.nextMatches.push({
          opponent: awayTeam,
          date: match.commence_time,
          homeTeam: match.home_team,
          awayTeam: match.away_team
        });

        // Add away team
        if (!teamsMap.has(awayTeam)) {
          teamsMap.set(awayTeam, { team: awayTeam, nextMatches: [], pastMatches: [] });
        }
        teamsMap.get(awayTeam)!.nextMatches.push({
          opponent: homeTeam,
          date: match.commence_time,
          homeTeam: match.home_team,
          awayTeam: match.away_team
        });
      });

      // Process past matches
      data.past?.forEach((match: any) => {
        const homeTeam = match.home_team;
        const awayTeam = match.away_team;
        
        if (teamsMap.has(homeTeam)) {
          teamsMap.get(homeTeam)!.pastMatches.push({
            opponent: awayTeam,
            date: match.commence_time,
            homeTeam: match.home_team,
            awayTeam: match.away_team
          });
        }

        if (teamsMap.has(awayTeam)) {
          teamsMap.get(awayTeam)!.pastMatches.push({
            opponent: homeTeam,
            date: match.commence_time,
            homeTeam: match.home_team,
            awayTeam: match.away_team
          });
        }
      });

      setTeams(Array.from(teamsMap.values()).sort((a, b) => a.team.localeCompare(b.team)));
    } catch (err) {
      console.error('Error fetching teams data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTeamExpansion = (teamName: string) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
    setExpandedSection({});
  };

  const toggleSection = (teamName: string, section: string) => {
    setExpandedSection(prev => ({
      ...prev,
      [teamName]: prev[teamName] === section ? '' : section
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <OddsFilters 
        onFilterChange={setFilters}
        onRefresh={fetchTeamsData}
        loading={loading}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teams Database ({teams.length} teams)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No teams found for the selected filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <Card key={team.team} className="overflow-hidden">
                  <Collapsible
                    open={expandedTeam === team.team}
                    onOpenChange={() => toggleTeamExpansion(team.team)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                              <h3 className="font-semibold text-lg">{team.team}</h3>
                              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {team.nextMatches.length} upcoming
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {team.pastMatches.length} past
                                </span>
                              </div>
                            </div>
                          </div>
                          {expandedTeam === team.team ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t bg-muted/30">
                        <Tabs defaultValue="next" className="w-full">
                          <TabsList className="w-full grid grid-cols-2 rounded-none">
                            <TabsTrigger value="next">
                              Next Matches ({team.nextMatches.length})
                            </TabsTrigger>
                            <TabsTrigger value="past">
                              Past Matches ({team.pastMatches.length})
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="next" className="p-4 space-y-2">
                            {team.nextMatches.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No upcoming matches
                              </p>
                            ) : (
                              team.nextMatches.map((match, idx) => (
                                <div 
                                  key={idx}
                                  className="p-3 bg-background rounded-lg border flex items-center justify-between"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {match.homeTeam} vs {match.awayTeam}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {formatDate(match.date)}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {match.homeTeam === team.team ? 'Home' : 'Away'}
                                  </Badge>
                                </div>
                              ))
                            )}
                          </TabsContent>

                          <TabsContent value="past" className="p-4 space-y-2">
                            {team.pastMatches.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No past matches available
                              </p>
                            ) : (
                              team.pastMatches.map((match, idx) => (
                                <div 
                                  key={idx}
                                  className="p-3 bg-background rounded-lg border flex items-center justify-between"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {match.homeTeam} vs {match.awayTeam}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {formatDate(match.date)}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {match.homeTeam === team.team ? 'Home' : 'Away'}
                                    </Badge>
                                  </div>
                                </div>
                              ))
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsPlayers;