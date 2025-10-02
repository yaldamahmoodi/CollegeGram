import { type Request, type Response, type NextFunction } from 'express';
import logger from '../utils/logger.ts';
import metricsDbService from './metrics-db.service.ts';

interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  requestsByEndpoint: Record<string, number>;
  errorsByEndpoint: Record<string, number>;
  responseTimesByEndpoint: Record<string, number[]>;
  requestsByMethod: Record<string, number>;
  statusCodes: Record<string, number>;
  lastReset: Date;
}

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    model: string;
    speed: number;
    loadAverage: number[];
    processes: number;
  };
  memory: {
    usage: number;
    total: number;
    used: number;
    free: number;
    available: number;
  };
  disk: {
    usage: number;
    total: number;
    used: number;
    free: number;
  };
  network: {
    in: number;
    out: number;
    totalIn: number;
    totalOut: number;
    connections: number;
    interfaces: any[];
  };
  system: {
    platform: string;
    arch: string;
    uptime: number;
    hostname: string;
  };
}

class MetricsService {
  private metrics: ApiMetrics;
  private startTime: Date;

  constructor() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      requestsByEndpoint: {},
      errorsByEndpoint: {},
      responseTimesByEndpoint: {},
      requestsByMethod: {},
      statusCodes: {},
      lastReset: new Date(),
    };
    this.startTime = new Date();
  }

  // Middleware to collect API metrics
  collectMetrics() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const endpoint = `${req.method} ${req.route?.path || req.path}`;
      const method = req.method;

      // Increment total requests
      this.metrics.totalRequests++;

      // Track requests by endpoint
      this.metrics.requestsByEndpoint[endpoint] = 
        (this.metrics.requestsByEndpoint[endpoint] || 0) + 1;

      // Track requests by method
      this.metrics.requestsByMethod[method] = 
        (this.metrics.requestsByMethod[method] || 0) + 1;

      // Override res.end to capture response metrics
      const originalEnd = res.end;
      res.end = function(chunk?: any, encoding?: any) {
        const responseTime = Date.now() - startTime;
        const statusCode = res.statusCode.toString();

        // Track status codes
        metricsService.metrics.statusCodes[statusCode] = 
          (metricsService.metrics.statusCodes[statusCode] || 0) + 1;

        // Track successful vs failed requests
        if (res.statusCode >= 200 && res.statusCode < 400) {
          metricsService.metrics.successfulRequests++;
        } else {
          metricsService.metrics.failedRequests++;
          
          // Track errors by endpoint
          metricsService.metrics.errorsByEndpoint[endpoint] = 
            (metricsService.metrics.errorsByEndpoint[endpoint] || 0) + 1;
        }

        // Track response times by endpoint
        if (!metricsService.metrics.responseTimesByEndpoint[endpoint]) {
          metricsService.metrics.responseTimesByEndpoint[endpoint] = [];
        }
        metricsService.metrics.responseTimesByEndpoint[endpoint].push(responseTime);

        // Keep only last 100 response times per endpoint to prevent memory issues
        if (metricsService.metrics.responseTimesByEndpoint[endpoint].length > 100) {
          metricsService.metrics.responseTimesByEndpoint[endpoint] = 
            metricsService.metrics.responseTimesByEndpoint[endpoint].slice(-100);
        }

        // Log the request
        logger.http(`${method} ${req.originalUrl} ${statusCode} - ${responseTime}ms`);

        // Save to database
        metricsDbService.logApiRequest({
          method,
          endpoint: req.originalUrl,
          statusCode: res.statusCode,
          responseTime,
          userAgent: req.get('User-Agent'),
          ip: req.ip || req.connection.remoteAddress || 'unknown',
          error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : undefined,
          userId: (req as any).user?.id || undefined
        });

        // Update daily metrics
        metricsDbService.updateDailyMetrics(new Date(), {
          totalRequests: 1,
          successfulRequests: res.statusCode >= 200 && res.statusCode < 400 ? 1 : 0,
          failedRequests: res.statusCode >= 400 ? 1 : 0,
          responseTime,
          method,
          endpoint: req.originalUrl,
          statusCode: res.statusCode,
          isError: res.statusCode >= 400
        });

        // Call original end method
        originalEnd.call(this, chunk, encoding);
      };

      next();
    };
  }

  // Get API metrics
  getApiMetrics(): ApiMetrics {
    return { ...this.metrics };
  }

  // Get system metrics and optionally save to database
  async getSystemMetrics(saveToDb: boolean = false): Promise<SystemMetrics> {
    const os = await import('os');
    const fs = await import('fs');
    
    // Calculate memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100;

    // Get disk usage (simplified - for production use a proper disk usage library)
    let diskTotal = 0;
    let diskUsed = 0;
    let diskFree = 0;
    let diskUsage = 0;

    try {
      const stats = fs.statSync(process.cwd());
      // This is a simplified approach - in production, use a proper disk usage library
      diskTotal = 1000000000000; // 1TB placeholder
      diskUsed = 300000000000;   // 300GB placeholder
      diskFree = diskTotal - diskUsed;
      diskUsage = (diskUsed / diskTotal) * 100;
    } catch (error) {
      logger.warn('Could not get disk stats:', error);
    }

    // Get CPU info
    const cpus = os.cpus();
    const cpuCount = cpus.length;
    const cpuModel = cpus[0]?.model || 'Unknown';
    const cpuSpeed = cpus[0]?.speed || 0;
    
    // Calculate CPU usage (simplified)
    const loadAvg = os.loadavg();
    const cpuUsage = Math.min((loadAvg[0] / cpuCount) * 100, 100);

    // Network stats (simplified - in production use proper network monitoring)
    const networkIn = Math.random() * 1000 + 100; // MB/s
    const networkOut = Math.random() * 800 + 50;  // MB/s

    const systemMetrics = {
      cpu: {
        usage: cpuUsage,
        cores: cpuCount,
        model: cpuModel,
        speed: cpuSpeed,
        loadAverage: loadAvg,
        processes: 150, // Placeholder - use proper process counting in production
      },
      memory: {
        usage: memoryUsage,
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
        available: freeMemory,
      },
      disk: {
        usage: diskUsage,
        total: diskTotal,
        used: diskUsed,
        free: diskFree,
      },
      network: {
        in: networkIn,
        out: networkOut,
        totalIn: networkIn * 3600, // Rough hourly estimate
        totalOut: networkOut * 3600,
        connections: Math.floor(Math.random() * 50) + 10,
        interfaces: os.networkInterfaces(),
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        uptime: os.uptime(),
        hostname: os.hostname(),
      },
    };

    // Save to database if requested
    if (saveToDb) {
      metricsDbService.logSystemMetrics({
        cpu: {
          usage: cpuUsage,
          cores: cpuCount,
          loadAverage: loadAvg
        },
        memory: {
          usage: memoryUsage,
          total: totalMemory,
          used: usedMemory,
          free: freeMemory
        },
        disk: {
          usage: diskUsage,
          total: diskTotal,
          used: diskUsed,
          free: diskFree
        },
        network: {
          in: networkIn,
          out: networkOut,
          connections: Math.floor(Math.random() * 50) + 10
        },
        uptime: os.uptime()
      });
    }

    return systemMetrics;
  }

  // Reset metrics
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      requestsByEndpoint: {},
      errorsByEndpoint: {},
      responseTimesByEndpoint: {},
      requestsByMethod: {},
      statusCodes: {},
      lastReset: new Date(),
    };
    logger.info('API metrics reset');
  }

  // Get uptime
  getUptime(): number {
    return Math.floor((Date.now() - this.startTime.getTime()) / 1000);
  }

  // Get average response time for an endpoint
  getAverageResponseTime(endpoint: string): number {
    const times = this.metrics.responseTimesByEndpoint[endpoint];
    if (!times || times.length === 0) return 0;
    
    const sum = times.reduce((a, b) => a + b, 0);
    return Math.round(sum / times.length);
  }

  // Get error rate for an endpoint
  getErrorRate(endpoint: string): number {
    const totalRequests = this.metrics.requestsByEndpoint[endpoint] || 0;
    const errorRequests = this.metrics.errorsByEndpoint[endpoint] || 0;
    
    if (totalRequests === 0) return 0;
    return Math.round((errorRequests / totalRequests) * 100);
  }
}

// Create singleton instance
const metricsService = new MetricsService();

export default metricsService;
