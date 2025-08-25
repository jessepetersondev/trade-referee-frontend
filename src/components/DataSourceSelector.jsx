import { useState } from 'react';
import { useApp } from '../lib/store';
import { apiClient } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, Upload, Zap } from 'lucide-react';

export function DataSourceSelector() {
  const { state, dispatch, ACTIONS } = useApp();
  const [sleeperLeagueId, setSleeperLeagueId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSourceChange = (value) => {
    dispatch({ type: ACTIONS.SET_LEAGUE_SOURCE, payload: value });
    setError(null);
  };

  const loadDemoData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const demoLeague = await apiClient.loadDemoData();
      dispatch({ type: ACTIONS.SET_LEAGUE, payload: demoLeague });
    } catch (err) {
      setError('Failed to load demo data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSleeperLeague = async () => {
    if (!sleeperLeagueId.trim()) {
      setError('Please enter a Sleeper League ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll simulate loading Sleeper data
      // In a real implementation, this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const mockSleeperLeague = {
        id: sleeperLeagueId,
        name: `Sleeper League ${sleeperLeagueId}`,
        teams: [
          {
            id: 'sleeper_team1',
            name: 'Team Alpha',
            owner: 'Manager 1',
            roster: [
              { id: 'sp1', name: 'Josh Allen', position: 'QB', team: 'BUF', projectedPoints: 24.8 },
              { id: 'sp2', name: 'Christian McCaffrey', position: 'RB', team: 'SF', projectedPoints: 22.3 },
            ]
          },
          {
            id: 'sleeper_team2',
            name: 'Team Beta',
            owner: 'Manager 2',
            roster: [
              { id: 'sp3', name: 'Patrick Mahomes', position: 'QB', team: 'KC', projectedPoints: 25.2 },
              { id: 'sp4', name: 'Derrick Henry', position: 'RB', team: 'BAL', projectedPoints: 16.7 },
            ]
          }
        ],
        scoring: {
          passingYards: 0.04,
          passingTouchdowns: 4,
          interceptions: -2,
          rushingYards: 0.1,
          rushingTouchdowns: 6,
          receivingYards: 0.1,
          receivingTouchdowns: 6,
          receptions: 0.5,
          fumbles: -2
        },
        settings: {
          rosterPositions: [
            { position: 'QB', count: 1, isRequired: true },
            { position: 'RB', count: 2, isRequired: true },
            { position: 'WR', count: 2, isRequired: true },
            { position: 'TE', count: 1, isRequired: true },
          ],
          playoffTeams: 4,
          regularSeasonWeeks: 14,
          currentWeek: 5
        }
      };

      dispatch({ type: ACTIONS.SET_LEAGUE, payload: mockSleeperLeague });
    } catch (err) {
      setError('Failed to load Sleeper league: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const leagueData = JSON.parse(e.target.result);
        dispatch({ type: ACTIONS.SET_LEAGUE, payload: leagueData });
      } catch (err) {
        setError('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your League Data Source
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select how you want to import your fantasy league data for trade analysis.
        </p>
      </div>

      <RadioGroup
        value={state.leagueSource}
        onValueChange={handleSourceChange}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Demo Data */}
        <Card className={`cursor-pointer transition-all hover:shadow-md ${
          state.leagueSource === 'demo' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="demo" id="demo" />
              <Zap className="w-5 h-5 text-blue-600" />
              <Label htmlFor="demo" className="font-semibold cursor-pointer">
                Demo Data
              </Label>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Try TradeReferee with sample league data. Perfect for testing and learning how the tool works.
            </CardDescription>
            {state.leagueSource === 'demo' && (
              <Button 
                onClick={loadDemoData} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load Demo League'
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Sleeper Import */}
        <Card className={`cursor-pointer transition-all hover:shadow-md ${
          state.leagueSource === 'sleeper' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sleeper" id="sleeper" />
              <Database className="w-5 h-5 text-green-600" />
              <Label htmlFor="sleeper" className="font-semibold cursor-pointer">
                Sleeper League
              </Label>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Import your league directly from Sleeper using your League ID. Real-time data and player information.
            </CardDescription>
            {state.leagueSource === 'sleeper' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="leagueId" className="text-sm font-medium">
                    League ID
                  </Label>
                  <Input
                    id="leagueId"
                    placeholder="Enter your Sleeper League ID"
                    value={sleeperLeagueId}
                    onChange={(e) => setSleeperLeagueId(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={loadSleeperLeague} 
                  disabled={loading || !sleeperLeagueId.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Import League'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Upload */}
        <Card className={`cursor-pointer transition-all hover:shadow-md ${
          state.leagueSource === 'manual' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Upload className="w-5 h-5 text-purple-600" />
              <Label htmlFor="manual" className="font-semibold cursor-pointer">
                Manual Upload
              </Label>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Upload a JSON file with your league data. Works with any fantasy platform or custom format.
            </CardDescription>
            {state.leagueSource === 'manual' && (
              <div className="space-y-3">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleManualUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500">
                  Upload a JSON file containing your league data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </RadioGroup>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {state.league && (
        <Alert>
          <AlertDescription>
            ✅ League loaded: <strong>{state.league.name}</strong> with {state.league.teams.length} teams
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

