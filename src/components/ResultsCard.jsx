import { useApp } from '../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

export function ResultsCard() {
  const { state } = useApp();

  if (!state.tradeGrade) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Build a trade and click "Analyze Trade" to see results here.
        </p>
      </Card>
    );
  }

  const { tradeGrade } = state;
  
  const getGradeColor = (letter) => {
    switch (letter) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getGradeTextColor = (letter) => {
    switch (letter) {
      case 'A': return 'text-green-600 dark:text-green-400';
      case 'B': return 'text-blue-600 dark:text-blue-400';
      case 'C': return 'text-yellow-600 dark:text-yellow-400';
      case 'D': return 'text-orange-600 dark:text-orange-400';
      case 'F': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Grade */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Trade Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full ${getGradeColor(tradeGrade.letter)} flex items-center justify-center mx-auto mb-2`}>
                <span className="text-3xl font-bold text-white">{tradeGrade.letter}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Overall Grade</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <span className={getGradeTextColor(tradeGrade.letter)}>
                  {tradeGrade.score}
                </span>
                <span className="text-gray-400">/100</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Trade Score</p>
            </div>
          </div>
          
          <Progress value={tradeGrade.score} className="w-full max-w-md mx-auto" />
        </CardContent>
      </Card>

      {/* Fairness Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Fairness Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Trade Balance</span>
              <Badge variant={tradeGrade.fairness.deltaPercent < 10 ? 'default' : 'destructive'}>
                {tradeGrade.fairness.deltaPercent < 10 ? 'Fair' : 'Unbalanced'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {tradeGrade.fairness.explanation}
            </p>
            {tradeGrade.fairness.deltaPercent >= 10 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This trade favors {tradeGrade.fairness.towardsTeamId} by {tradeGrade.fairness.deltaPercent.toFixed(1)}%
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Impacts */}
      <Card>
        <CardHeader>
          <CardTitle>Team Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tradeGrade.teamImpacts.map((impact, index) => (
              <div key={impact.teamId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{impact.teamId}</span>
                  {impact.deltaValue > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${impact.deltaValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {impact.deltaValue > 0 ? '+' : ''}{impact.deltaValue.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {impact.deltaPercent > 0 ? '+' : ''}{(impact.deltaPercent * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tradeGrade.rationale.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">{item.factor}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {item.text}
                </p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Impact:</span>
                    <Progress value={item.impact * 100} className="w-24 h-2" />
                    <span className="text-xs text-gray-500">{(item.impact * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Tags */}
      {tradeGrade.riskTags && tradeGrade.riskTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tradeGrade.riskTags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-yellow-600 border-yellow-300">
                  {tag.replace('-', ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

