import { ApiRequestLog, DailyApiMetrics, SystemMetricsLog, type IApiRequestLog, type IDailyApiMetrics, type ISystemMetricsLog } from '../db/models/api-metrics.model.ts';
import logger from '../utils/logger.ts';

class MetricsDbService {
  // Log individual API request
  async logApiRequest(requestData: {
    method: string;
    endpoint: string;
    statusCode: number;
    responseTime: number;
    userAgent?: string;
    ip: string;
    error?: string;
    userId?: string;
  }): Promise<void> {
    try {
      await ApiRequestLog.create({
        ...requestData,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Failed to log API request:', error);
    }
  }

  // Update daily metrics
  async updateDailyMetrics(date: Date, updateData: {
    totalRequests?: number;
    successfulRequests?: number;
    failedRequests?: number;
    responseTime?: number;
    method?: string;
    endpoint?: string;
    statusCode?: number;
    isError?: boolean;
  }): Promise<void> {
    try {
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      const update: any = {
        $inc: {}
      };

      if (updateData.totalRequests) {
        update.$inc.totalRequests = updateData.totalRequests;
      }
      
      if (updateData.successfulRequests) {
        update.$inc.successfulRequests = updateData.successfulRequests;
      }
      
      if (updateData.failedRequests) {
        update.$inc.failedRequests = updateData.failedRequests;
      }

      if (updateData.method) {
        update.$inc[`requestsByMethod.${updateData.method}`] = 1;
      }

      if (updateData.endpoint) {
        update.$inc[`requestsByEndpoint.${updateData.endpoint}`] = 1;
        
        if (updateData.isError) {
          update.$inc[`errorsByEndpoint.${updateData.endpoint}`] = 1;
        }
      }

      if (updateData.statusCode) {
        update.$inc[`statusCodes.${updateData.statusCode}`] = 1;
      }

      await DailyApiMetrics.findOneAndUpdate(
        { date: dateOnly },
        update,
        { upsert: true, new: true }
      );

      // Update average response time if provided
      if (updateData.responseTime) {
        await this.updateAverageResponseTime(dateOnly, updateData.responseTime);
      }
    } catch (error) {
      logger.error('Failed to update daily metrics:', error);
    }
  }

  // Update average response time
  private async updateAverageResponseTime(date: Date, responseTime: number): Promise<void> {
    try {
      const metrics = await DailyApiMetrics.findOne({ date });
      if (metrics) {
        const currentAvg = metrics.averageResponseTime || 0;
        const totalRequests = metrics.totalRequests || 1;
        const newAvg = ((currentAvg * (totalRequests - 1)) + responseTime) / totalRequests;
        
        await DailyApiMetrics.updateOne(
          { date },
          { $set: { averageResponseTime: Math.round(newAvg) } }
        );
      }
    } catch (error) {
      logger.error('Failed to update average response time:', error);
    }
  }

  // Log system metrics
  async logSystemMetrics(metricsData: {
    cpu: { usage: number; cores: number; loadAverage: number[] };
    memory: { usage: number; total: number; used: number; free: number };
    disk: { usage: number; total: number; used: number; free: number };
    network: { in: number; out: number; connections: number };
    uptime: number;
  }): Promise<void> {
    try {
      await SystemMetricsLog.create({
        ...metricsData,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Failed to log system metrics:', error);
    }
  }

  // Get API metrics for a date range
  async getApiMetrics(startDate: Date, endDate: Date): Promise<IDailyApiMetrics[]> {
    try {
      return await DailyApiMetrics.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 });
    } catch (error) {
      logger.error('Failed to get API metrics:', error);
      return [];
    }
  }

  // Get recent API request logs
  async getRecentApiLogs(limit: number = 100): Promise<IApiRequestLog[]> {
    try {
      return await ApiRequestLog.find()
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      logger.error('Failed to get recent API logs:', error);
      return [];
    }
  }

  // Get system metrics for a date range
  async getSystemMetrics(startDate: Date, endDate: Date): Promise<ISystemMetricsLog[]> {
    try {
      return await SystemMetricsLog.find({
        timestamp: { $gte: startDate, $lte: endDate }
      }).sort({ timestamp: -1 });
    } catch (error) {
      logger.error('Failed to get system metrics:', error);
      return [];
    }
  }

  // Get API metrics summary for dashboard
  async getApiMetricsSummary(days: number = 7): Promise<{
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
  }> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const metrics = await this.getApiMetrics(startDate, endDate);
      
      const totalRequests = metrics.reduce((sum, m) => sum + m.totalRequests, 0);
      const successfulRequests = metrics.reduce((sum, m) => sum + m.successfulRequests, 0);
      const failedRequests = metrics.reduce((sum, m) => sum + m.failedRequests, 0);
      const avgResponseTime = metrics.length > 0 
        ? Math.round(metrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / metrics.length)
        : 0;
      
      const errorRate = totalRequests > 0 ? Math.round((failedRequests / totalRequests) * 100) : 0;

      const dailyData = metrics.map(m => ({
        date: m.date.toISOString().split('T')[0],
        successful: m.successfulRequests,
        failed: m.failedRequests
      }));

      return {
        totalRequests,
        successfulRequests,
        failedRequests,
        averageResponseTime: avgResponseTime,
        errorRate,
        dailyData
      };
    } catch (error) {
      logger.error('Failed to get API metrics summary:', error);
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        errorRate: 0,
        dailyData: []
      };
    }
  }

  // Clean up old logs (called periodically)
  async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const apiLogsDeleted = await ApiRequestLog.deleteMany({
        timestamp: { $lt: cutoffDate }
      });

      const systemLogsDeleted = await SystemMetricsLog.deleteMany({
        timestamp: { $lt: cutoffDate }
      });

      logger.info(`Cleaned up old logs: ${apiLogsDeleted.deletedCount} API logs, ${systemLogsDeleted.deletedCount} system logs`);
    } catch (error) {
      logger.error('Failed to cleanup old logs:', error);
    }
  }

  // Get top endpoints by request count
  async getTopEndpoints(days: number = 7, limit: number = 10): Promise<Array<{
    endpoint: string;
    requests: number;
    errors: number;
    errorRate: number;
  }>> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const metrics = await this.getApiMetrics(startDate, endDate);
      const endpointStats = new Map<string, { requests: number; errors: number }>();

      metrics.forEach(metric => {
        if (metric.requestsByEndpoint) {
          for (const [endpoint, count] of metric.requestsByEndpoint) {
            const current = endpointStats.get(endpoint) || { requests: 0, errors: 0 };
            current.requests += count;
            
            if (metric.errorsByEndpoint && metric.errorsByEndpoint.has(endpoint)) {
              current.errors += metric.errorsByEndpoint.get(endpoint) || 0;
            }
            
            endpointStats.set(endpoint, current);
          }
        }
      });

      return Array.from(endpointStats.entries())
        .map(([endpoint, stats]) => ({
          endpoint,
          requests: stats.requests,
          errors: stats.errors,
          errorRate: stats.requests > 0 ? Math.round((stats.errors / stats.requests) * 100) : 0
        }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, limit);
    } catch (error) {
      logger.error('Failed to get top endpoints:', error);
      return [];
    }
  }
}

export default new MetricsDbService();
