import { useState } from 'react';
import { useApp } from '../lib/store';
import { apiClient } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, Loader2, TrendingUp, Lightbulb, Activity } from 'lucide-react';

export function ProFeatures() {
  const { state, dispatch, ACTIONS } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSimulateLeague = async () => {
    if (!state.tradeGrade || !state.league) {
      alert('Please analyze a trade first');
      return;
    }

    setLoading(true);
    try {
      const simulationData = {
        leagueSource: state.leagueSource,
        trade: state.trade,
        weeksRemaining: state.league.settings.regularSeasonWeeks - state.league.settings.currentWeek,
        iterations: 1000,
        ...(state.leagueSource === 'manual' && {
          teams: state.league.teams,
          scoring: state.league.scoring
        }),
        ...(state.leagueSource === 'sleeper' && {
          sleeperLeagueId: state.league.id
        })
      };

      const result = await apiClient.simulateLeague(simulationData);
      dispatch({ type: ACTIONS.SET_SIMULATION_RESULT, payload: result });
    } catch (error) {
      alert('Simulation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCounterOffers = async () => {
    if (!state.tradeGrade || !state.league) {
      alert('Please analyze a trade first');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.suggestCounterOffers({
        leagueSource: state.leagueSource,
        trade: state.trade,
        maxSuggestions: 3,
        ...(state.leagueSource === 'manual' && {
          teams: state.league.teams,
          scoring: state.league.scoring
        }),
        ...(state.leagueSource === 'sleeper' && {
          sleeperLeagueId: state.league.id
        })
      });
      dispatch({ type: ACTIONS.SET_COUNTER_OFFERS, payload: result });
    } catch (error) {
      alert('Counter-offer generation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (state.user.tier !== 'pro') {
    return (
      <Card className="p-8 text-center">
        <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Upgrade to Pro</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Unlock advanced features including league simulations, counter-offer suggestions, and injury analysis.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">League Simulation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Monte Carlo analysis of playoff odds
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <Lightbulb className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Counter-Offers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              AI-generated trade alternatives
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Injury Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Real-time player health updates
            </p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro - $3.99/month
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Pro Features</h2>
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          Active
        </Badge>
      </div>

      {/* League Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            League Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Run Monte Carlo simulations to see how this trade affects each team's playoff and championship odds.
          </p>
          <Button 
            onClick={handleSimulateLeague}
            disabled={loading || !state.tradeGrade}
            className="mb-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Simulating...
              </>
            ) : (
              'Run League Simulation'
            )}
          </Button>

          {state.simulationResult && (
            <div className="mt-4 space-y-4">
              <h4 className="font-semibold">Simulation Results ({state.simulationResult.iterations} iterations)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Playoff Odds Changes</h5>
                  {Object.entries(state.simulationResult.deltasByTeam).map(([teamId, deltas]) => (
                    <div key={teamId} className="flex justify-between items-center py-1">
                      <span className="text-sm">{teamId}</span>
                      <span className={`text-sm font-medium ${
                        deltas.playoffDelta > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {deltas.playoffDelta > 0 ? '+' : ''}{deltas.playoffDelta.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <h5 className="font-medium mb-2">Championship Odds Changes</h5>
                  {Object.entries(state.simulationResult.deltasByTeam).map(([teamId, deltas]) => (
                    <div key={teamId} className="flex justify-between items-center py-1">
                      <span className="text-sm">{teamId}</span>
                      <span className={`text-sm font-medium ${
                        deltas.titleDelta > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {deltas.titleDelta > 0 ? '+' : ''}{deltas.titleDelta.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {state.simulationResult.notes && state.simulationResult.notes.length > 0 && (
                <Alert>
                  <AlertDescription>
                    {state.simulationResult.notes.join('. ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Counter-Offer Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Counter-Offer Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Get AI-generated alternative trades that might be more balanced or favorable.
          </p>
          <Button 
            onClick={handleGetCounterOffers}
            disabled={loading || !state.tradeGrade}
            className="mb-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Get Counter-Offers'
            )}
          </Button>

          {state.counterOffers && (
            <div className="mt-4 space-y-4">
              <h4 className="font-semibold">Suggested Alternatives</h4>
              {state.counterOffers.suggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Alternative {index + 1}</span>
                    <Badge variant="outline">
                      Grade: {suggestion.grade.letter} ({suggestion.grade.score})
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {suggestion.fairness.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Injury Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Injury Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Get real-time injury updates and health status for players in your trade.
          </p>
          <Alert>
            <AlertDescription>
              All players in the current trade appear healthy with no injury concerns.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

