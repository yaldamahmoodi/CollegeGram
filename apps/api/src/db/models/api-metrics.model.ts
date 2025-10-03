import mongoose, { Schema, Document } from 'mongoose';

// Interface for API Request Log
export interface IApiRequestLog extends Document {
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ip: string;
  timestamp: Date;
  error?: string;
  userId?: string;
}

// Interface for Daily API Metrics
export interface IDailyApiMetrics extends Document {
  date: Date;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsByMethod: {
    GET: number;
    POST: number;
    PUT: number;
    DELETE: number;
    PATCH: number;
    OPTIONS: number;
  };
  requestsByEndpoint: Map<string, number>;
  errorsByEndpoint: Map<string, number>;
  statusCodes: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for System Metrics Log
export interface ISystemMetricsLog extends Document {
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
    loadAverage: number[];
  };
  memory: {
    usage: number;
    total: number;
    used: number;
    free: number;
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
    connections: number;
  };
  uptime: number;
}

// API Request Log Schema
const ApiRequestLogSchema = new Schema<IApiRequestLog>({
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
  },
  endpoint: {
    type: String,
    required: true,
    index: true
  },
  statusCode: {
    type: Number,
    required: true,
    index: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  userAgent: {
    type: String,
    default: null
  },
  ip: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  error: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    default: null,
    index: true
  }
}, {
  timestamps: true,
  collection: 'api_request_logs'
});

// Daily API Metrics Schema
const DailyApiMetricsSchema = new Schema<IDailyApiMetrics>({
  date: {
    type: Date,
    required: true,
    unique: true,
    index: true
  },
  totalRequests: {
    type: Number,
    default: 0
  },
  successfulRequests: {
    type: Number,
    default: 0
  },
  failedRequests: {
    type: Number,
    default: 0
  },
  averageResponseTime: {
    type: Number,
    default: 0
  },
  requestsByMethod: {
    GET: { type: Number, default: 0 },
    POST: { type: Number, default: 0 },
    PUT: { type: Number, default: 0 },
    DELETE: { type: Number, default: 0 },
    PATCH: { type: Number, default: 0 },
    OPTIONS: { type: Number, default: 0 }
  },
  requestsByEndpoint: {
    type: Map,
    of: Number,
    default: new Map()
  },
  errorsByEndpoint: {
    type: Map,
    of: Number,
    default: new Map()
  },
  statusCodes: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true,
  collection: 'daily_api_metrics'
});

// System Metrics Log Schema
const SystemMetricsLogSchema = new Schema<ISystemMetricsLog>({
  timestamp: {
    type: Date,
    default: Date.now
  },
  cpu: {
    usage: { type: Number, required: true },
    cores: { type: Number, required: true },
    loadAverage: [{ type: Number }]
  },
  memory: {
    usage: { type: Number, required: true },
    total: { type: Number, required: true },
    used: { type: Number, required: true },
    free: { type: Number, required: true }
  },
  disk: {
    usage: { type: Number, required: true },
    total: { type: Number, required: true },
    used: { type: Number, required: true },
    free: { type: Number, required: true }
  },
  network: {
    in: { type: Number, required: true },
    out: { type: Number, required: true },
    connections: { type: Number, required: true }
  },
  uptime: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  collection: 'system_metrics_logs'
});

// Add indexes for better query performance
ApiRequestLogSchema.index({ endpoint: 1, timestamp: -1 });
ApiRequestLogSchema.index({ statusCode: 1, timestamp: -1 });

DailyApiMetricsSchema.index({ date: -1 });

// Add TTL index to automatically delete old logs (keep for 30 days)
ApiRequestLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
SystemMetricsLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Create models
export const ApiRequestLog = mongoose.model<IApiRequestLog>('ApiRequestLog', ApiRequestLogSchema);
export const DailyApiMetrics = mongoose.model<IDailyApiMetrics>('DailyApiMetrics', DailyApiMetricsSchema);
export const SystemMetricsLog = mongoose.model<ISystemMetricsLog>('SystemMetricsLog', SystemMetricsLogSchema);

export default {
  ApiRequestLog,
  DailyApiMetrics,
  SystemMetricsLog
};
