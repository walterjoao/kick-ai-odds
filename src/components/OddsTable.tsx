import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Clock, TrendingUp, Users } from 'lucide-react';
import { OddsData, OddsResponse } from '@/hooks/useSportsData';

interface OddsTableProps {
  oddsData: OddsResponse | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const OddsTable: React.FC<OddsTableProps> = ({ oddsData, loading, onPageChange }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading live odds...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!oddsData || oddsData.odds.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No odds available</p>
            <p className="text-muted-foreground">Try changing your filters or check back later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getBestOdds = (bookmakers: any[], outcomeType: string) => {
    let bestOdds = 0;
    let bestBookmaker = '';
    
    bookmakers.forEach(bookmaker => {
      bookmaker.markets?.forEach((market: any) => {
        if (market.key === 'h2h') {
          market.outcomes?.forEach((outcome: any) => {
            if ((outcomeType === 'home' && outcome.name === bookmakers[0]?.markets[0]?.outcomes[0]?.name) ||
                (outcomeType === 'away' && outcome.name === bookmakers[0]?.markets[0]?.outcomes[1]?.name) ||
                (outcomeType === 'draw' && outcome.name === 'Draw')) {
              if (outcome.price > bestOdds) {
                bestOdds = outcome.price;
                bestBookmaker = bookmaker.title;
              }
            }
          });
        }
      });
    });
    
    return { odds: bestOdds.toFixed(2), bookmaker: bestBookmaker };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Betting Odds
            <Badge variant="secondary" className="ml-auto">
              {oddsData.total} matches
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match</TableHead>
                <TableHead className="text-center">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Kick-off
                </TableHead>
                <TableHead className="text-center">Home Win</TableHead>
                <TableHead className="text-center">Draw</TableHead>
                <TableHead className="text-center">Away Win</TableHead>
                <TableHead className="text-center">
                  <Users className="h-4 w-4 inline mr-1" />
                  Bookmakers
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {oddsData.odds.map((match: OddsData) => {
                const { date, time } = formatDateTime(match.commence_time);
                const homeOdds = getBestOdds(match.bookmakers, 'home');
                const drawOdds = getBestOdds(match.bookmakers, 'draw');
                const awayOdds = getBestOdds(match.bookmakers, 'away');

                return (
                  <TableRow key={match.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {match.home_team} vs {match.away_team}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {match.sport_title}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-medium">{time}</div>
                        <div className="text-xs text-muted-foreground">{date}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-bold text-lg text-green-600">
                          {homeOdds.odds !== '0.00' ? homeOdds.odds : 'N/A'}
                        </div>
                        {homeOdds.bookmaker && (
                          <div className="text-xs text-muted-foreground">
                            {homeOdds.bookmaker}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-bold text-lg text-blue-600">
                          {drawOdds.odds !== '0.00' ? drawOdds.odds : 'N/A'}
                        </div>
                        {drawOdds.bookmaker && (
                          <div className="text-xs text-muted-foreground">
                            {drawOdds.bookmaker}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-bold text-lg text-orange-600">
                          {awayOdds.odds !== '0.00' ? awayOdds.odds : 'N/A'}
                        </div>
                        {awayOdds.bookmaker && (
                          <div className="text-xs text-muted-foreground">
                            {awayOdds.bookmaker}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {match.bookmakers.length} sources
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {oddsData.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => oddsData.page > 1 && onPageChange(oddsData.page - 1)}
                className={oddsData.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: oddsData.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => onPageChange(pageNum)}
                  isActive={pageNum === oddsData.page}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => oddsData.page < oddsData.totalPages && onPageChange(oddsData.page + 1)}
                className={oddsData.page >= oddsData.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default OddsTable;