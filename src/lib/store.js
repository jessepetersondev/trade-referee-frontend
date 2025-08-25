import { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  // User and subscription
  user: {
    tier: 'free',
    token: localStorage.getItem('tradereferee_token'),
  },
  
  // League data
  league: null,
  leagueSource: 'demo', // 'demo', 'sleeper', 'manual'
  
  // Trade builder
  trade: {
    teamAOut: [],
    teamBOut: [],
  },
  
  // Results
  tradeGrade: null,
  simulationResult: null,
  counterOffers: null,
  
  // UI state
  loading: false,
  error: null,
  activeTab: 'build', // 'build', 'results', 'pro'
};

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LEAGUE: 'SET_LEAGUE',
  SET_LEAGUE_SOURCE: 'SET_LEAGUE_SOURCE',
  SET_TRADE: 'SET_TRADE',
  ADD_PLAYER_TO_TRADE: 'ADD_PLAYER_TO_TRADE',
  REMOVE_PLAYER_FROM_TRADE: 'REMOVE_PLAYER_FROM_TRADE',
  CLEAR_TRADE: 'CLEAR_TRADE',
  SET_TRADE_GRADE: 'SET_TRADE_GRADE',
  SET_SIMULATION_RESULT: 'SET_SIMULATION_RESULT',
  SET_COUNTER_OFFERS: 'SET_COUNTER_OFFERS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  CLEAR_RESULTS: 'CLEAR_RESULTS',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    case ACTIONS.SET_LEAGUE:
      return {
        ...state,
        league: action.payload,
      };
    
    case ACTIONS.SET_LEAGUE_SOURCE:
      return {
        ...state,
        leagueSource: action.payload,
        league: null,
        trade: { teamAOut: [], teamBOut: [] },
        tradeGrade: null,
        simulationResult: null,
        counterOffers: null,
      };
    
    case ACTIONS.SET_TRADE:
      return {
        ...state,
        trade: action.payload,
      };
    
    case ACTIONS.ADD_PLAYER_TO_TRADE:
      const { playerId, side } = action.payload;
      const currentSide = state.trade[side];
      if (!currentSide.includes(playerId)) {
        return {
          ...state,
          trade: {
            ...state.trade,
            [side]: [...currentSide, playerId],
          },
        };
      }
      return state;
    
    case ACTIONS.REMOVE_PLAYER_FROM_TRADE:
      const { playerId: removeId, side: removeSide } = action.payload;
      return {
        ...state,
        trade: {
          ...state.trade,
          [removeSide]: state.trade[removeSide].filter(id => id !== removeId),
        },
      };
    
    case ACTIONS.CLEAR_TRADE:
      return {
        ...state,
        trade: { teamAOut: [], teamBOut: [] },
        tradeGrade: null,
        simulationResult: null,
        counterOffers: null,
      };
    
    case ACTIONS.SET_TRADE_GRADE:
      return {
        ...state,
        tradeGrade: action.payload,
      };
    
    case ACTIONS.SET_SIMULATION_RESULT:
      return {
        ...state,
        simulationResult: action.payload,
      };
    
    case ACTIONS.SET_COUNTER_OFFERS:
      return {
        ...state,
        counterOffers: action.payload,
      };
    
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    case ACTIONS.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };
    
    case ACTIONS.CLEAR_RESULTS:
      return {
        ...state,
        tradeGrade: null,
        simulationResult: null,
        counterOffers: null,
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch, ACTIONS }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

