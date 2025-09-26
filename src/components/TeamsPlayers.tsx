import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, User, Trophy, Target, Calendar } from 'lucide-react';

// Mock data for teams and players
const mockTeams = [
  {
    id: '1',
    name: 'Manchester City',
    league: 'Premier League',
    founded: 1880,
    stadium: 'Etihad Stadium',
    manager: 'Pep Guardiola',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      position: 1,
      played: 20,
      won: 15,
      drawn: 3,
      lost: 2,
      points: 48,
      goalsFor: 45,
      goalsAgainst: 15
    }
  },
  {
    id: '2',
    name: 'Arsenal',
    league: 'Premier League',
    founded: 1886,
    stadium: 'Emirates Stadium',
    manager: 'Mikel Arteta',
    form: ['W', 'L', 'W', 'W', 'D'],
    stats: {
      position: 2,
      played: 20,
      won: 14,
      drawn: 4,
      lost: 2,
      points: 46,
      goalsFor: 42,
      goalsAgainst: 18
    }
  },
  {
    id: '3',
    name: 'Liverpool',
    league: 'Premier League',
    founded: 1892,
    stadium: 'Anfield',
    manager: 'Jürgen Klopp',
    form: ['W', 'W', 'W', 'L', 'W'],
    stats: {
      position: 3,
      played: 20,
      won: 13,
      drawn: 5,
      lost: 2,
      points: 44,
      goalsFor: 40,
      goalsAgainst: 20
    }
  }
];

const mockPlayers = [
  {
    id: '1',
    name: 'Erling Haaland',
    team: 'Manchester City',
    position: 'Forward',
    age: 23,
    nationality: 'Norway',
    stats: {
      appearances: 18,
      goals: 22,
      assists: 5,
      yellowCards: 2,
      redCards: 0,
      minutesPlayed: 1620
    }
  },
  {
    id: '2',
    name: 'Bukayo Saka',
    team: 'Arsenal',
    position: 'Winger',
    age: 22,
    nationality: 'England',
    stats: {
      appearances: 19,
      goals: 8,
      assists: 9,
      yellowCards: 3,
      redCards: 0,
      minutesPlayed: 1710
    }
  },
  {
    id: '3',
    name: 'Mohamed Salah',
    team: 'Liverpool',
    position: 'Forward',
    age: 31,
    nationality: 'Egypt',
    stats: {
      appearances: 20,
      goals: 18,
      assists: 7,
      yellowCards: 1,
      redCards: 0,
      minutesPlayed: 1800
    }
  }
];

const TeamsPlayers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('teams');

  const filteredTeams = mockTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPlayers = mockPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFormIcon = (result: string) => {
    const baseClasses = "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white";
    if (result === 'W') return <span className={`${baseClasses} bg-green-500`}>W</span>;
    if (result === 'D') return <span className={`${baseClasses} bg-yellow-500`}>D</span>;
    if (result === 'L') return <span className={`${baseClasses} bg-red-500`}>L</span>;
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teams & Players Database
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search teams, players, positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teams ({filteredTeams.length})
              </TabsTrigger>
              <TabsTrigger value="players" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Players ({filteredPlayers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teams" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map((team) => (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {team.league}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-lg font-bold">
                          #{team.stats.position}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Manager:</span>
                          <div className="font-medium">{team.manager}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stadium:</span>
                          <div className="font-medium">{team.stadium}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Founded:</span>
                          <div className="font-medium">{team.founded}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Points:</span>
                          <div className="font-bold text-primary">{team.stats.points}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">Recent Form:</span>
                        <div className="flex gap-1 mt-1">
                          {team.form.map((result, index) => (
                            <div key={index}>{getFormIcon(result)}</div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold text-green-600">{team.stats.won}</div>
                          <div className="text-muted-foreground">Won</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold text-yellow-600">{team.stats.drawn}</div>
                          <div className="text-muted-foreground">Drawn</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold text-red-600">{team.stats.lost}</div>
                          <div className="text-muted-foreground">Lost</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="players" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlayers.map((player) => (
                  <Card key={player.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{player.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {player.team}
                          </Badge>
                        </div>
                        <Badge variant="outline">
                          Age {player.age}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Position:</span>
                          <div className="font-medium">{player.position}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Nationality:</span>
                          <div className="font-medium">{player.nationality}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold text-primary flex items-center justify-center gap-1">
                            <Target className="h-3 w-3" />
                            {player.stats.goals}
                          </div>
                          <div className="text-muted-foreground">Goals</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold text-blue-600">{player.stats.assists}</div>
                          <div className="text-muted-foreground">Assists</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold text-green-600">{player.stats.appearances}</div>
                          <div className="text-muted-foreground">Apps</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold text-orange-600">{Math.round(player.stats.minutesPlayed / player.stats.appearances)}</div>
                          <div className="text-muted-foreground">Avg Min</div>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Yellow: {player.stats.yellowCards}</span>
                        <span>Red: {player.stats.redCards}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsPlayers;