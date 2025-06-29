import { useState, useEffect, useCallback } from 'react';
import { healthService } from '../services/healthService';

interface HealthCheckResult {
  isHealthy: boolean | null;
  isChecking: boolean;
  healthMessage: string | null;
  healthMessageType: 'success' | 'warning' | 'error' | 'info' | null;
}

export const useBackendHealth = (checkImmediately: boolean = false) => {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult>(() =>
    healthService.getLastResult()
  );

  useEffect(() => {
    try {
      // Subscribe to health service updates
      const unsubscribe = healthService.subscribe(setHealthStatus);

      // Trigger initial check if requested
      if (checkImmediately) {
        healthService.checkHealth().catch(error => {
          console.error('Initial health check failed:', error);
        });
      }

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up health check:', error);
      return () => {}; // Return empty cleanup function
    }
  }, [checkImmediately]);

  const checkHealth = useCallback(() => {
    return healthService.forceRefresh().catch(error => {
      console.error('Manual health check failed:', error);
    });
  }, []);

  return {
    ...healthStatus,
    checkHealth,
  };
};
