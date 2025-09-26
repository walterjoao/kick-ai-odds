import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, RefreshCw } from 'lucide-react';
import { useSportsData, Sport, League } from '@/hooks/useSportsData';

interface OddsFiltersProps {
  onFilterChange: (filters: {
    sport: string;
    region: string;
    market: string;
  }) => void;
  onRefresh: () => void;
  loading?: boolean;
}

const REGIONS = [
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'Europe' },
  { value: 'au', label: 'Australia' },
];

const MARKETS = [
  { value: 'h2h', label: 'Head to Head (1X2)' },
  { value: 'spreads', label: 'Point Spreads' },
  { value: 'totals', label: 'Over/Under Totals' },
  { value: 'outrights', label: 'Tournament Winner' },
];

const OddsFilters: React.FC<OddsFiltersProps> = ({ onFilterChange, onRefresh, loading }) => {
  const { sports, leagues, fetchLeagues } = useSportsData();
  const [selectedSport, setSelectedSport] = useState('soccer_epl');
  const [selectedRegion, setSelectedRegion] = useState('uk');
  const [selectedMarket, setSelectedMarket] = useState('h2h');

  // Group sports by type
  const sportTypes = sports.reduce((acc, sport) => {
    const type = sport.key.split('_')[0];
    if (!acc[type]) acc[type] = [];
    acc[type].push(sport);
    return acc;
  }, {} as Record<string, Sport[]>);

  useEffect(() => {
    if (selectedSport) {
      const sportType = selectedSport.split('_')[0];
      fetchLeagues(sportType);
    }
  }, [selectedSport, fetchLeagues]);

  useEffect(() => {
    onFilterChange({
      sport: selectedSport,
      region: selectedRegion,
      market: selectedMarket,
    });
  }, [selectedSport, selectedRegion, selectedMarket, onFilterChange]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Betting Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sport & League</label>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Select sport..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {Object.entries(sportTypes).map(([type, sportsList]) => (
                  <div key={type}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {type}
                    </div>
                    {sportsList.map((sport) => (
                      <SelectItem key={sport.key} value={sport.key}>
                        <div className="flex items-center justify-between w-full">
                          <span>{sport.title}</span>
                          {sport.active && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Live
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select region..." />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Market</label>
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger>
                <SelectValue placeholder="Select market..." />
              </SelectTrigger>
              <SelectContent>
                {MARKETS.map((market) => (
                  <SelectItem key={market.value} value={market.value}>
                    {market.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">&nbsp;</label>
            <Button 
              onClick={onRefresh} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OddsFilters;