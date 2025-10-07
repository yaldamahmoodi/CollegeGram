import Docker from 'dockerode';
import logger from '../utils/logger.ts';

export interface ServiceHealthStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'warning';
  message: string;
  details?: any;
  port?: string;
  uptime?: string;
}

export class ServiceHealthService {
  private static instance: ServiceHealthService;
  private docker: Docker | null = null;

  public static getInstance(): ServiceHealthService {
    if (!ServiceHealthService.instance) {
      ServiceHealthService.instance = new ServiceHealthService();
    }
    return ServiceHealthService.instance;
  }

  private constructor() {
    try {
      this.docker = new Docker();
    } catch (error) {
      logger.warn('Docker not available:', error);
      this.docker = null;
    }
  }

  // Check if Swagger documentation is accessible
  async checkSwagger(): Promise<ServiceHealthStatus> {
    try {
      // Try the actual Swagger endpoint first
      const ac = new AbortController();
      setTimeout(() => ac.abort(), 3000);
      const response = await fetch('http://devsync.rahnemacollege.ir/api/docs', {
        method: 'GET',
        signal: ac.signal
      });
      
      if (response.ok) {
        return {
          name: 'Swagger API Docs',
          status: 'healthy',
          message: 'API documentation accessible',
          port: '3001/api/docs',
          details: {
            url: 'http://devsync.rahnemacollege.ir/api/docs',
            statusCode: response.status
          }
        };
      } else {
        return {
          name: 'Swagger API Docs',
          status: 'unhealthy',
          message: `Documentation not accessible (${response.status})`,
          port: '3001/api/docs',
          details: {
            url: 'http://devsync.rahnemacollege.ir/api/docs',
            statusCode: response.status,
            error: 'Documentation endpoint not found'
          }
        };
      }
    } catch (error) {
      return {
        name: 'Swagger API Docs',
        status: 'unhealthy',
        message: 'Documentation service unavailable',
        port: '/api/docs',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  // Check if Frontend (React dev server) is running
  async checkFrontend(): Promise<ServiceHealthStatus> {
    // Try multiple common frontend ports
    const frontendPorts = [3000, 3001, 3002, 3003, 5173, 4173];
    
    for (const port of frontendPorts) {
      try {
        const ac = new AbortController();
        setTimeout(() => ac.abort(), 3000);
        const response = await fetch(`https://devsync.rahnemacollege.ir`, {
          method: 'GET',
          signal: ac.signal
        });
        
        if (response.ok) {
          return {
            name: 'Frontend (React)',
            status: 'healthy',
            message: 'React development server running',
            port: port.toString(),
            details: {
              url: `https://devsync.rahnemacollege.ir`,
              statusCode: response.status,
              server: 'React Dev Server'
            }
          };
        }
      } catch (error) {
        continue; // Try next port
      }
    }
    
    // If no port worked, return unhealthy
    return {
      name: 'Frontend (React)',
      status: 'unhealthy',
      message: 'Frontend server unavailable',
      port: 'N/A',
      details: {
        error: 'No React dev server found on common ports (3000-3003, 5173, 4173)'
      }
    };
  }

  // Check Docker containers status
  async checkDockerServices(): Promise<ServiceHealthStatus> {
    if (!this.docker) {
      return {
        name: 'Docker Services',
        status: 'warning',
        message: 'Docker not available',
        details: {
          error: 'Docker daemon not accessible'
        }
      };
    }

    try {
      const containers = await this.docker.listContainers({ all: true });
      
      // Find containers related to our services
      const relevantContainers = containers.filter(container => {
        const names = container.Names.join(' ').toLowerCase();
        return names.includes('mongo') || 
               names.includes('redis') || 
               names.includes('elasticsearch') ||
               names.includes('mailpit') ||
               names.includes('collegegram');
      });

      if (relevantContainers.length === 0) {
        return {
          name: 'Docker Services',
          status: 'warning',
          message: 'No relevant containers found',
          details: {
            totalContainers: containers.length,
            relevantContainers: 0
          }
        };
      }

      const runningContainers = relevantContainers.filter(c => c.State === 'running');
      const healthyContainers = runningContainers.length;
      const totalContainers = relevantContainers.length;

      if (healthyContainers === totalContainers && totalContainers > 0) {
        return {
          name: 'Docker Services',
          status: 'healthy',
          message: `All ${totalContainers} containers running`,
          details: {
            running: healthyContainers,
            total: totalContainers,
            containers: relevantContainers.map(c => ({
              name: c.Names[0]?.replace('/', '') || 'unknown',
              state: c.State,
              status: c.Status
            }))
          }
        };
      } else if (healthyContainers > 0) {
        return {
          name: 'Docker Services',
          status: 'warning',
          message: `${healthyContainers}/${totalContainers} containers running`,
          details: {
            running: healthyContainers,
            total: totalContainers,
            containers: relevantContainers.map(c => ({
              name: c.Names[0]?.replace('/', '') || 'unknown',
              state: c.State,
              status: c.Status
            }))
          }
        };
      } else {
        return {
          name: 'Docker Services',
          status: 'unhealthy',
          message: 'No containers running',
          details: {
            running: 0,
            total: totalContainers,
            containers: relevantContainers.map(c => ({
              name: c.Names[0]?.replace('/', '') || 'unknown',
              state: c.State,
              status: c.Status
            }))
          }
        };
      }
    } catch (error) {
      return {
        name: 'Docker Services',
        status: 'unhealthy',
        message: 'Failed to check Docker containers',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  // Check system resources
  async checkSystemResources(): Promise<ServiceHealthStatus> {
    try {
      const os = await import('os');
      
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;
      
      const cpus = os.cpus();
      const loadAvg = os.loadavg();
      
      const status = memoryUsagePercent > 90 ? 'warning' : 
                   memoryUsagePercent > 95 ? 'unhealthy' : 'healthy';

      return {
        name: 'System Resources',
        status,
        message: `Memory usage: ${memoryUsagePercent.toFixed(1)}%`,
        details: {
          memory: {
            total: Math.round(totalMemory / 1024 / 1024 / 1024 * 100) / 100 + ' GB',
            used: Math.round(usedMemory / 1024 / 1024 / 1024 * 100) / 100 + ' GB',
            free: Math.round(freeMemory / 1024 / 1024 / 1024 * 100) / 100 + ' GB',
            usagePercent: Math.round(memoryUsagePercent * 100) / 100
          },
          cpu: {
            cores: cpus.length,
            model: cpus[0]?.model || 'Unknown',
            loadAverage: loadAvg.map(load => Math.round(load * 100) / 100)
          }
        }
      };
    } catch (error) {
      return {
        name: 'System Resources',
        status: 'unhealthy',
        message: 'Failed to check system resources',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
}

export default ServiceHealthService.getInstance();
