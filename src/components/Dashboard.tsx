import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Clock, Users, Trophy, Target } from "lucide-react";

// Mock data
const mockOdds = [
  {
    id: 1,
    homeTeam: "Manchester City",
    awayTeam: "Arsenal", 
    kickoff: "2024-09-27 15:30",
    league: "Premier League",
    bookmakers: [
      { name: "Bet365", home: 2.10, draw: 3.40, away: 3.20 },
      { name: "William Hill", home: 2.05, draw: 3.50, away: 3.30 },
      { name: "Ladbrokes", home: 2.15, draw: 3.30, away: 3.15 }
    ]
  },
  {
    id: 2,
    homeTeam: "Liverpool",
    awayTeam: "Chelsea",
    kickoff: "2024-09-27 17:45", 
    league: "Premier League",
    bookmakers: [
      { name: "Bet365", home: 1.85, draw: 3.60, away: 4.20 },
      { name: "William Hill", home: 1.90, draw: 3.50, away: 4.00 },
      { name: "Ladbrokes", home: 1.80, draw: 3.70, away: 4.30 }
    ]
  }
];

const mockStandings = [
  { position: 1, team: "Manchester City", played: 8, won: 7, drawn: 1, lost: 0, points: 22, form: ["W", "W", "D", "W", "W"] },
  { position: 2, team: "Arsenal", played: 8, won: 6, drawn: 2, lost: 0, points: 20, form: ["W", "D", "W", "W", "D"] },
  { position: 3, team: "Liverpool", played: 8, won: 6, drawn: 1, lost: 1, points: 19, form: ["W", "W", "L", "W", "W"] },
  { position: 4, team: "Chelsea", played: 8, won: 5, drawn: 1, lost: 2, points: 16, form: ["W", "L", "W", "D", "W"] }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("odds");

  const getBestOdds = (bookmakers: any[], type: 'home' | 'draw' | 'away') => {
    return Math.max(...bookmakers.map(b => b[type]));
  };

  const getFormIcon = (result: string) => {
    switch (result) {
      case 'W': return <span className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-xs font-bold text-success-foreground">W</span>;
      case 'D': return <span className="w-6 h-6 bg-warning rounded-full flex items-center justify-center text-xs font-bold text-warning-foreground">D</span>;
      case 'L': return <span className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-xs font-bold text-destructive-foreground">L</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center animate-glow">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Football Odds & Insights
              </h1>
              <p className="text-muted-foreground">Real-time betting odds and AI-powered analysis</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Live Matches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">€2.4M</p>
                    <p className="text-sm text-muted-foreground">Volume</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-sm text-muted-foreground">Users Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="odds" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Odds
            </TabsTrigger>
            <TabsTrigger value="fixtures" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Fixtures
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Standings
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="odds" className="space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Live Betting Odds
                </CardTitle>
                <CardDescription>
                  Real-time odds from multiple bookmakers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOdds.map((match) => (
                    <div key={match.id} className="p-4 bg-secondary/50 rounded-lg border border-border/50">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">
                              {match.league}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{match.kickoff}</span>
                          </div>
                          <h3 className="text-lg font-semibold">
                            {match.homeTeam} vs {match.awayTeam}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 lg:gap-4 min-w-[300px]">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Home</p>
                            <div className="space-y-1">
                              {match.bookmakers.map((bookmaker, idx) => (
                                <div key={idx} className={`px-3 py-1 rounded text-sm font-medium ${
                                  bookmaker.home === getBestOdds(match.bookmakers, 'home') 
                                    ? 'odds-highlight' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {bookmaker.home}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Draw</p>
                            <div className="space-y-1">
                              {match.bookmakers.map((bookmaker, idx) => (
                                <div key={idx} className={`px-3 py-1 rounded text-sm font-medium ${
                                  bookmaker.draw === getBestOdds(match.bookmakers, 'draw') 
                                    ? 'odds-highlight' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {bookmaker.draw}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Away</p>
                            <div className="space-y-1">
                              {match.bookmakers.map((bookmaker, idx) => (
                                <div key={idx} className={`px-3 py-1 rounded text-sm font-medium ${
                                  bookmaker.away === getBestOdds(match.bookmakers, 'away') 
                                    ? 'odds-highlight' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {bookmaker.away}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="standings" className="space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Premier League Table
                </CardTitle>
                <CardDescription>
                  Current season standings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Pos</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Team</th>
                        <th className="text-center p-3 text-sm font-medium text-muted-foreground">P</th>
                        <th className="text-center p-3 text-sm font-medium text-muted-foreground">W</th>
                        <th className="text-center p-3 text-sm font-medium text-muted-foreground">D</th>
                        <th className="text-center p-3 text-sm font-medium text-muted-foreground">L</th>
                        <th className="text-center p-3 text-sm font-medium text-muted-foreground">Pts</th>
                        <th className="text-center p-3 text-sm font-medium text-muted-foreground">Form</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockStandings.map((team) => (
                        <tr key={team.position} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                          <td className="p-3">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              team.position <= 4 ? 'bg-success text-success-foreground' : 
                              team.position <= 6 ? 'bg-warning text-warning-foreground' : 
                              'bg-muted text-muted-foreground'
                            }`}>
                              {team.position}
                            </span>
                          </td>
                          <td className="p-3 font-semibold">{team.team}</td>
                          <td className="p-3 text-center">{team.played}</td>
                          <td className="p-3 text-center text-success font-medium">{team.won}</td>
                          <td className="p-3 text-center text-warning font-medium">{team.drawn}</td>
                          <td className="p-3 text-center text-destructive font-medium">{team.lost}</td>
                          <td className="p-3 text-center font-bold text-primary">{team.points}</td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-1">
                              {team.form.map((result, idx) => (
                                <div key={idx}>
                                  {getFormIcon(result)}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fixtures" className="space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Upcoming Fixtures
                </CardTitle>
                <CardDescription>
                  Next matches and schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Fixture data coming soon...</p>
                  <p className="text-sm">Integration with API-Football in progress</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Team Statistics
                </CardTitle>
                <CardDescription>
                  Detailed team and player data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Team statistics coming soon...</p>
                  <p className="text-sm">Comprehensive player and team analytics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;