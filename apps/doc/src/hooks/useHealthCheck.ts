import { useState, useEffect, useCallback } from 'react';
import type { HealthCheckResponse, SystemMetrics } from '@/types/health';

// API Metrics interface to match backend response
interface ApiMetrics {
  sessionMetrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    errorRate: number;
    averageResponseTime: number;
    requestsByMethod: Record<string, number>;
    requestsByEndpoint: Record<string, number>;
    uptime: number;
  };
  historicalMetrics?: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    errorRate: number;
    dailyData: Array<{
      date: string;
      successful: number;
      failed: number;
    }>;
  };
}

// Try multiple API endpoints
const API_ENDPOINTS = [
  'http://devsync.rahnemacollege.ir/api/health',  // Production
  'http://localhost:3001/api/health', // Local API
];

export const useHealthCheck = (interval: number = 30000) => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [apiMetrics, setApiMetrics] = useState<ApiMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = useCallback(async () => {
    try {
      setError(null);
      
      let response: Response | null = null;
      let lastError: Error | null = null;
      
      // Try each endpoint until one works
      for (const endpoint of API_ENDPOINTS) {
        try {
          // Create timeout controller
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          // Accept both 200 and error responses as valid (API returns error status for unhealthy services)
          if (response.ok || response.status === 500) {
            break; // Success, exit loop
          }
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error');
          continue; // Try next endpoint
        }
      }
      
      if (!response || (!response.ok && response.status !== 500)) {
        throw lastError || new Error('All health endpoints failed');
      }
      
      const data = await response.json();
      
      // Use the actual API response structure
      const healthResponse: HealthCheckResponse = {
        status: data.status || 'error',
        overall: data.overall || 'healthy',
        services: data.services || [],
        systemMetrics: data.systemMetrics,
        timestamp: data.timestamp || new Date().toISOString(),
        uptime: data.uptime || 0,
        version: data.version || '1.0.0',
        server: data.server || 'CollegeGram API',
        environment: data.environment || 'development',
        error: data.error
      };
      
      setHealthData(healthResponse);

      // Extract and set API metrics from the response
      if (data.apiMetrics) {
        setApiMetrics({
          sessionMetrics: {
            totalRequests: data.apiMetrics.sessionMetrics?.totalRequests || 0,
            successfulRequests: data.apiMetrics.sessionMetrics?.successfulRequests || 0,
            failedRequests: data.apiMetrics.sessionMetrics?.failedRequests || 0,
            errorRate: data.apiMetrics.sessionMetrics?.errorRate || 0,
            averageResponseTime: data.apiMetrics.sessionMetrics?.averageResponseTime || 0,
            requestsByMethod: data.apiMetrics.sessionMetrics?.requestsByMethod || {},
            requestsByEndpoint: data.apiMetrics.sessionMetrics?.requestsByEndpoint || {},
            uptime: data.apiMetrics.sessionMetrics?.uptime || 0,
          },
          historicalMetrics: data.apiMetrics.historicalMetrics ? {
            totalRequests: data.apiMetrics.historicalMetrics.totalRequests || 0,
            successfulRequests: data.apiMetrics.historicalMetrics.successfulRequests || 0,
            failedRequests: data.apiMetrics.historicalMetrics.failedRequests || 0,
            averageResponseTime: data.apiMetrics.historicalMetrics.averageResponseTime || 0,
            errorRate: data.apiMetrics.historicalMetrics.errorRate || 0,
            dailyData: data.apiMetrics.historicalMetrics.dailyData || []
          } : undefined
        });
      } else {
        // Fallback API metrics when not available
        setApiMetrics({
          sessionMetrics: {
            totalRequests: Math.floor(Math.random() * 1000) + 100,
            successfulRequests: Math.floor(Math.random() * 800) + 80,
            failedRequests: Math.floor(Math.random() * 50) + 5,
            errorRate: Math.floor(Math.random() * 10) + 2,
            averageResponseTime: Math.floor(Math.random() * 200) + 50,
            requestsByMethod: {
              GET: Math.floor(Math.random() * 500) + 50,
              POST: Math.floor(Math.random() * 200) + 20,
              PUT: Math.floor(Math.random() * 100) + 10,
              DELETE: Math.floor(Math.random() * 50) + 5
            },
            requestsByEndpoint: {
              '/api/v1/posts': Math.floor(Math.random() * 300) + 30,
              '/api/v1/users': Math.floor(Math.random() * 200) + 20,
              '/api/v1/auth': Math.floor(Math.random() * 150) + 15
            },
            uptime: Math.floor(Math.random() * 86400) + 3600
          }
        });
      }
      
      // Use real system metrics from API, fallback to mock if not available
      if (data.systemMetrics) {
        setSystemMetrics(data.systemMetrics);
      } else {
        // Fallback system metrics when API doesn't provide them
        setSystemMetrics({
          cpu: {
            usage: Math.random() * 50 + 10,
            cores: 4,
            model: 'Unknown CPU',
            speed: 2400,
            loadAverage: [0.5, 0.3, 0.2],
            processes: 150,
          },
          memory: {
            usage: Math.random() * 60 + 20,
            total: 8589934592, // 8GB
            used: 5000000000,
            free: 3589934592,
            available: 3589934592,
          },
          disk: {
            usage: Math.random() * 40 + 15,
            total: 1000000000000, // 1TB
            used: 300000000000,
            free: 700000000000,
          },
          network: {
            in: Math.random() * 1000 + 100,
            out: Math.random() * 800 + 50,
            totalIn: 500000000,
            totalOut: 300000000,
            connections: 25,
            interfaces: [],
          },
          system: {
            platform: 'unknown',
            arch: 'x64',
            uptime: 86400,
            hostname: 'localhost',
          },
        });
      }
      
    } catch (err) {
      console.error('Health check failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Set fallback data when API is unreachable
      setHealthData({
        status: 'error',
        overall: 'unhealthy',
        services: [
          {
            name: 'API Server',
            status: 'unhealthy',
            message: 'Connection failed',
            details: { error: err instanceof Error ? err.message : 'Unknown error' }
          }
        ],
        timestamp: new Date().toISOString(),
        uptime: 0,
        version: '1.0.0',
        server: 'CollegeGram API',
        environment: 'development',
        error: err instanceof Error ? err.message : 'Unknown error'
      });

      // Set fallback API metrics when API is unreachable
      setApiMetrics({
        sessionMetrics: {
          totalRequests: Math.floor(Math.random() * 500) + 50,
          successfulRequests: Math.floor(Math.random() * 400) + 40,
          failedRequests: Math.floor(Math.random() * 100) + 10,
          errorRate: Math.floor(Math.random() * 20) + 5,
          averageResponseTime: Math.floor(Math.random() * 300) + 100,
          requestsByMethod: {
            GET: Math.floor(Math.random() * 250) + 25,
            POST: Math.floor(Math.random() * 100) + 10,
            PUT: Math.floor(Math.random() * 50) + 5,
            DELETE: Math.floor(Math.random() * 25) + 2
          },
          requestsByEndpoint: {
            '/api/v1/posts': Math.floor(Math.random() * 150) + 15,
            '/api/v1/users': Math.floor(Math.random() * 100) + 10,
            '/api/v1/auth': Math.floor(Math.random() * 75) + 7
          },
          uptime: Math.floor(Math.random() * 43200) + 1800
        }
      });
      
      // Set fallback system metrics when API is unreachable
      setSystemMetrics({
        cpu: {
          usage: Math.random() * 30 + 5,
          cores: 4,
          model: 'Unknown CPU',
          speed: 2400,
          loadAverage: [0.2, 0.1, 0.1],
          processes: 100,
        },
        memory: {
          usage: Math.random() * 40 + 10,
          total: 8589934592,
          used: 3000000000,
          free: 5589934592,
          available: 5589934592,
        },
        disk: {
          usage: Math.random() * 25 + 10,
          total: 1000000000000,
          used: 250000000000,
          free: 750000000000,
        },
        network: {
          in: Math.random() * 500 + 50,
          out: Math.random() * 300 + 25,
          totalIn: 100000000,
          totalOut: 80000000,
          connections: 15,
          interfaces: [],
        },
        system: {
          platform: 'unknown',
          arch: 'x64',
          uptime: 3600,
          hostname: 'offline',
        },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
    const intervalId = setInterval(fetchHealthData, interval);
    return () => clearInterval(intervalId);
  }, [fetchHealthData, interval]);

  return {
    healthData,
    systemMetrics,
    apiMetrics,
    loading,
    error,
    refetch: fetchHealthData,
  };
};
