import { useEffect } from 'react';
import { AppProvider } from './lib/store';
import { Header } from './components/Header';
import { DataSourceSelector } from './components/DataSourceSelector';
import { TradeBuilder } from './components/TradeBuilder';
import { ResultsCard } from './components/ResultsCard';
import { ProFeatures } from './components/ProFeatures';
import { UpgradeModal } from './components/UpgradeModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import './App.css';

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              TradeReferee
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              AI-Powered Fantasy Football Trade & League Politics Analyzer
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Objective Trade Grades
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Fairness Analysis
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                League Impact Simulation
              </span>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="build" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
              <TabsTrigger value="build">Build Trade</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="pro">Pro Features</TabsTrigger>
            </TabsList>

            <TabsContent value="build" className="space-y-6">
              <Card className="p-6">
                <DataSourceSelector />
              </Card>
              <TradeBuilder />
            </TabsContent>

            <TabsContent value="results">
              <ResultsCard />
            </TabsContent>

            <TabsContent value="pro">
              <ProFeatures />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <UpgradeModal />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
