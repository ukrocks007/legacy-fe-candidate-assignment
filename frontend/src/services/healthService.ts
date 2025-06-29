import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG,
  isRenderUrl,
} from '../config';

class HealthService {
  private static instance: HealthService;
  private isChecking = false;
  private lastCheckTime = 0;
  private lastResult: {
    isHealthy: boolean | null;
    message: string | null;
    messageType: 'success' | 'warning' | 'error' | 'info' | null;
  } = {
    isHealthy: null,
    message: null,
    messageType: null,
  };
  private subscribers: Array<(result: any) => void> = [];
  private currentPromise: Promise<any> | null = null;

  // Cache duration in milliseconds (from config)
  private readonly CACHE_DURATION = API_CONFIG.HEALTH_CHECK_CACHE_DURATION;

  public static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  private constructor() {}

  public subscribe(callback: (result: any) => void): () => void {
    this.subscribers.push(callback);

    // Immediately notify with current state
    try {
      callback({
        isHealthy: this.lastResult.isHealthy,
        isChecking: this.isChecking,
        healthMessage: this.lastResult.message,
        healthMessageType: this.lastResult.messageType,
      });
    } catch (error) {
      console.error('Error in initial health status callback:', error);
    }

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers() {
    const result = {
      isHealthy: this.lastResult.isHealthy,
      isChecking: this.isChecking,
      healthMessage: this.lastResult.message,
      healthMessageType: this.lastResult.messageType,
    };

    this.subscribers.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        console.error('Error notifying health status subscriber:', error);
      }
    });
  }

  private isCacheValid(): boolean {
    return Date.now() - this.lastCheckTime < this.CACHE_DURATION;
  }

  public async checkHealth(forceCheck = false): Promise<void> {
    // Return cached result if still valid and not forced
    if (
      !forceCheck &&
      this.isCacheValid() &&
      this.lastResult.isHealthy !== null
    ) {
      return;
    }

    // If already checking, return the existing promise
    if (this.currentPromise) {
      return this.currentPromise;
    }

    this.isChecking = true;
    this.notifySubscribers();

    this.currentPromise = this.performHealthCheck();

    try {
      await this.currentPromise;
    } catch (error) {
      // Log error but don't rethrow to prevent unhandled promise rejection
      console.error('Health check error:', error);
    } finally {
      this.currentPromise = null;
      this.isChecking = false;
      this.lastCheckTime = Date.now();
      this.notifySubscribers();
    }
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, API_CONFIG.TIMEOUT);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HEALTH}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      // Clear timeout if request completes successfully
      clearTimeout(timeoutId);

      if (response.ok) {
        this.lastResult = {
          isHealthy: true,
          message: 'Backend is healthy and ready to process requests.',
          messageType: 'success',
        };
      } else {
        throw new Error(`Health check failed with status: ${response.status}`);
      }
    } catch (error) {
      console.warn('Backend health check failed:', error);

      // Handle abort/timeout error specifically
      if (error instanceof Error && error.name === 'AbortError') {
        this.lastResult = {
          isHealthy: false,
          message:
            'Backend health check timed out. The server may be slow to respond.',
          messageType: 'warning',
        };
        return;
      }

      if (isRenderUrl()) {
        this.lastResult = {
          isHealthy: false,
          message:
            'Backend is currently unavailable. Render spins down inactive services and it may take 50+ seconds to spin up. Please wait a moment and try again.',
          messageType: 'warning',
        };
      } else {
        this.lastResult = {
          isHealthy: false,
          message:
            'Backend is not available. Please check with the administrator or try again later.',
          messageType: 'error',
        };
      }
    }
  }

  public getLastResult() {
    return {
      isHealthy: this.lastResult.isHealthy,
      isChecking: this.isChecking,
      healthMessage: this.lastResult.message,
      healthMessageType: this.lastResult.messageType,
    };
  }

  public forceRefresh(): Promise<void> {
    return this.checkHealth(true);
  }
}

export const healthService = HealthService.getInstance();
