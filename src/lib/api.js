const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
    this.token = localStorage.getItem('tradereferee_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('tradereferee_token', token);
    } else {
      localStorage.removeItem('tradereferee_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token && !options.skipAuth) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Public endpoints
  async gradeTrade(tradeData) {
    return this.request('/grade-trade', {
      method: 'POST',
      body: tradeData,
      skipAuth: true,
    });
  }

  async activateSubscription(email) {
    return this.request(`/activate?email=${encodeURIComponent(email)}`, {
      skipAuth: true,
    });
  }

  // Pro endpoints
  async simulateLeague(simulationData) {
    return this.request('/simulate-league', {
      method: 'POST',
      body: simulationData,
    });
  }

  async suggestCounterOffers(tradeData) {
    return this.request('/suggest-counteroffers', {
      method: 'POST',
      body: tradeData,
    });
  }

  async getInjuryNotes(playerIds) {
    const params = new URLSearchParams();
    playerIds.forEach(id => params.append('playerIds', id));
    return this.request(`/injury-notes?${params.toString()}`);
  }

  // Utility methods
  async loadDemoData() {
    try {
      const response = await fetch('/data/demo/league.json');
      return await response.json();
    } catch (error) {
      console.error('Failed to load demo data:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();

