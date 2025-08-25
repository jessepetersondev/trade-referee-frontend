import { useState } from 'react';
import { useApp } from '../lib/store';
import { apiClient } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeftRight, Trash2, Plus, Minus } from 'lucide-react';

export function TradeBuilder() {
  const { state, dispatch, ACTIONS } = useApp();
  const [loading, setLoading] = useState(false);

  if (!state.league) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Please select and load a league data source to start building trades.
        </p>
      </Card>
    );
  }

  const handleAddPlayer = (playerId, side) => {
    dispatch({
      type: ACTIONS.ADD_PLAYER_TO_TRADE,
      payload: { playerId, side }
    });
  };

  const handleRemovePlayer = (playerId, side) => {
    dispatch({
      type: ACTIONS.REMOVE_PLAYER_FROM_TRADE,
      payload: { playerId, side }
    });
  };

  const handleClearTrade = () => {
    dispatch({ type: ACTIONS.CLEAR_TRADE });
  };

  const handleAnalyzeTrade = async () => {
    if (state.trade.teamAOut.length === 0 || state.trade.teamBOut.length === 0) {
      alert('Please add players to both sides of the trade');
      return;
    }

    setLoading(true);
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });

    try {
      const tradeData = {
        leagueSource: state.leagueSource,
        trade: state.trade,
        ...(state.leagueSource === 'manual' && {
          teams: state.league.teams,
          scoring: state.league.scoring
        }),
        ...(state.leagueSource === 'sleeper' && {
          sleeperLeagueId: state.league.id
        })
      };

      const result = await apiClient.gradeTrade(tradeData);
      dispatch({ type: ACTIONS.SET_TRADE_GRADE, payload: result });
      dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: 'results' });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getPlayerById = (playerId) => {
    for (const team of state.league.teams) {
      const player = team.roster.find(p => p.id === playerId);
      if (player) return { ...player, teamName: team.name };
    }
    return null;
  };

  const getTeamPlayers = (teamId) => {
    const team = state.league.teams.find(t => t.id === teamId);
    return team ? team.roster : [];
  };

  const isPlayerInTrade = (playerId) => {
    return state.trade.teamAOut.includes(playerId) || state.trade.teamBOut.includes(playerId);
  };

  return (
    <div className="space-y-6">
      {/* Trade Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" />
              Trade Builder
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearTrade} size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button 
                onClick={handleAnalyzeTrade}
                disabled={loading || state.trade.teamAOut.length === 0 || state.trade.teamBOut.length === 0}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Trade'
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team A Side */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-center">Team A Gives</h3>
              <div className="min-h-[120px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
                {state.trade.teamAOut.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Add players from Team A
                  </p>
                ) : (
                  <div className="space-y-2">
                    {state.trade.teamAOut.map(playerId => {
                      const player = getPlayerById(playerId);
                      return player ? (
                        <div key={playerId} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-gray-500">
                              {player.position} - {player.team} | {player.teamName}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePlayer(playerId, 'teamAOut')}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Team B Side */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-center">Team B Gives</h3>
              <div className="min-h-[120px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                {state.trade.teamBOut.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Add players from Team B
                  </p>
                ) : (
                  <div className="space-y-2">
                    {state.trade.teamBOut.map(playerId => {
                      const player = getPlayerById(playerId);
                      return player ? (
                        <div key={playerId} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-gray-500">
                              {player.position} - {player.team} | {player.teamName}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePlayer(playerId, 'teamBOut')}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Rosters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {state.league.teams.map((team, index) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <p className="text-sm text-gray-500">Owner: {team.owner}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {team.roster.map(player => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isPlayerInTrade(player.id)
                        ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-50'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{player.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {player.position}
                        </Badge>
                        {player.isInjured && (
                          <Badge variant="destructive" className="text-xs">
                            INJ
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {player.team} | Proj: {player.projectedPoints?.toFixed(1) || 'N/A'} pts
                        {player.byeWeek && ` | Bye: ${player.byeWeek}`}
                      </div>
                    </div>
                    
                    {!isPlayerInTrade(player.id) && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddPlayer(player.id, index === 0 ? 'teamAOut' : 'teamBOut')}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

