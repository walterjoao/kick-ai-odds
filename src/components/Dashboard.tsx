import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Calendar, Users, Trophy, BarChart3, Target } from 'lucide-react';
import { useSportsData } from '@/hooks/useSportsData';
import OddsFilters from './OddsFilters';
import OddsTable from './OddsTable';
import TeamsPlayers from './TeamsPlayers';

// Mock data for standings (keeping existing mock data for standings tab)
const mockStandings = [
  { position: 1, team: "Manchester City", played: 8, won: 7, drawn: 1, lost: 0, points: 22, form: ["W", "W", "D", "W", "W"] },
  { position: 2, team: "Arsenal", played: 8, won: 6, drawn: 2, lost: 0, points: 20, form: ["W", "D", "W", "W", "D"] },
  { position: 3, team: "Liverpool", played: 8, won: 6, drawn: 1, lost: 1, points: 19, form: ["W", "W", "L", "W", "W"] },
  { position: 4, team: "Chelsea", played: 8, won: 5, drawn: 1, lost: 2, points: 16, form: ["W", "L", "W", "D", "W"] },
  { position: 5, team: "Tottenham", played: 8, won: 4, drawn: 2, lost: 2, points: 14, form: ["D", "L", "W", "W", "D"] },
  { position: 6, team: "Newcastle", played: 8, won: 4, drawn: 1, lost: 3, points: 13, form: ["L", "W", "W", "L", "W"] },
  { position: 7, team: "Brighton", played: 8, won: 3, drawn: 3, lost: 2, points: 12, form: ["D", "W", "D", "L", "D"] },
  { position: 8, team: "West Ham", played: 8, won: 3, drawn: 2, lost: 3, points: 11, form: ["L", "D", "W", "W", "L"] },
  { position: 9, team: "Fulham", played: 8, won: 3, drawn: 2, lost: 3, points: 11, form: ["W", "L", "D", "W", "L"] },
  { position: 10, team: "Brentford", played: 8, won: 2, drawn: 4, lost: 2, points: 10, form: ["D", "D", "L", "D", "W"] }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("odds");
  const { odds, loading, fetchOdds } = useSportsData();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sport: 'soccer_epl',
    region: 'uk',
    market: 'h2h'
  });

  useEffect(() => {
    fetchOdds({ 
      ...filters, 
      page: currentPage, 
      limit: 10 
    });
  }, [filters, currentPage, fetchOdds]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchOdds({ 
      ...filters, 
      page: currentPage, 
      limit: 10 
    });
  }, [filters, currentPage, fetchOdds]);

  const getFormIcon = (result: string) => {
    const baseClasses = "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white";
    if (result === 'W') return <span className={`${baseClasses} bg-green-500`}>W</span>;
    if (result === 'D') return <span className={`${baseClasses} bg-yellow-500`}>D</span>;
    if (result === 'L') return <span className={`${baseClasses} bg-red-500`}>L</span>;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Football Odds & Insights
          </h1>
          <p className="text-gray-300">
            Real-time betting odds, statistics, and AI-powered predictions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Live Matches</p>
                <p className="text-2xl font-bold">{odds?.total || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Best Odds</p>
                <p className="text-2xl font-bold">Live</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Leagues</p>
                <p className="text-2xl font-bold">50+</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Target className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Markets</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="odds" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Live Odds
            </TabsTrigger>
            <TabsTrigger value="fixtures" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fixtures
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Standings
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams & Players
            </TabsTrigger>
          </TabsList>

          <TabsContent value="odds">
            <OddsFilters 
              onFilterChange={handleFilterChange}
              onRefresh={handleRefresh}
              loading={loading}
            />
            <OddsTable 
              oddsData={odds}
              loading={loading}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="fixtures">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Fixtures & Results</p>
                  <p className="text-muted-foreground">Coming soon - Match fixtures, results, and detailed statistics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="standings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Premier League Table
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Pos</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">Played</TableHead>
                      <TableHead className="text-center">Won</TableHead>
                      <TableHead className="text-center">Drawn</TableHead>
                      <TableHead className="text-center">Lost</TableHead>
                      <TableHead className="text-center">Points</TableHead>
                      <TableHead>Form</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStandings.map((team) => (
                      <TableRow key={team.position}>
                        <TableCell className="font-medium">{team.position}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{team.team}</span>
                            {team.position <= 4 && (
                              <Badge variant="secondary" className="text-xs">UCL</Badge>
                            )}
                            {team.position === 5 && (
                              <Badge variant="outline" className="text-xs">UEL</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{team.played}</TableCell>
                        <TableCell className="text-center">{team.won}</TableCell>
                        <TableCell className="text-center">{team.drawn}</TableCell>
                        <TableCell className="text-center">{team.lost}</TableCell>
                        <TableCell className="text-center font-bold">{team.points}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {team.form.map((result, index) => (
                              <div key={index}>{getFormIcon(result)}</div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <TeamsPlayers />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
