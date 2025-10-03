export interface ServiceStatus {
  name: string;
  status: "healthy" | "unhealthy" | "warning";
  message: string;
  details?: any;
  responseTime?: number;
  lastChecked?: string;
}

export interface HealthCheckResponse {
  status: "ok" | "error";
  overall: "healthy" | "unhealthy" | "warning";
  services: ServiceStatus[];
  systemMetrics?: SystemMetrics;
  timestamp: string;
  uptime: number;
  version: string;
  server: string;
  environment: string;
  error?: string;
}

export interface SystemMetrics {
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
    cached?: number;
    buffers?: number;
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
    interfaces: NetworkInterface[];
  };
  system: {
    platform: string;
    arch: string;
    uptime: number;
    hostname: string;
  };
}

export interface NetworkInterface {
  name: string;
  address: string;
  family: string;
  internal: boolean;
  mac: string;
}

// API Error Response
export interface ApiError {
  message: string;
  status?: number;
}
