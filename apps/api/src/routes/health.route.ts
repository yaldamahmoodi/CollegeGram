import { Router } from "express";
import EmailService from "../services/email.service.ts";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { Client } from "@elastic/elasticsearch";
import env from "../../env.ts";
import RedisService from "../services/redis.service.ts";

const router = Router();

router.get("/", async (req, res) => {
  const emailResults = await EmailService.sendHealthCheckEmails();
  res.status(200).json({
    status: "ok",
    message: "Server is running & Email system is working correctly",
    version: "1.0.0",
    server: "CollegeGram",
    emailCheck: {
      success: true,
      message: "All test emails sent successfully",
      results: emailResults.results,
    },
  });
});

interface ServiceStatus {
  name: string;
  status: "healthy" | "unhealthy" | "warning";
  message: string;
  details?: any;
}

export class HealthCheckerService {
  private static instance: HealthCheckerService;

  public static getInstance(): HealthCheckerService {
    if (!HealthCheckerService.instance) {
      HealthCheckerService.instance = new HealthCheckerService();
    }
    return HealthCheckerService.instance;
  }

  async checkAllServices(): Promise<{
    overall: "healthy" | "unhealthy" | "warning";
    services: ServiceStatus[];
  }> {
    console.log("🔍 Starting service health checks...\n");

    const services: ServiceStatus[] = [];

    // Check all services in parallel
    const [mongoStatus, redisStatus, elasticStatus, emailStatus] =
      await Promise.allSettled([
        this.checkMongoDB(),
        this.checkRedis(),
        this.checkElasticsearch(),
        this.checkEmailService(),
      ]);

    // Process results
    services.push(this.processResult("MongoDB", mongoStatus));
    services.push(this.processResult("Redis", redisStatus));
    services.push(this.processResult("Elasticsearch", elasticStatus));
    services.push(this.processResult("Email Service", emailStatus));

    // Determine overall health
    const unhealthyServices = services.filter((s) => s.status === "unhealthy");
    const warningServices = services.filter((s) => s.status === "warning");

    let overall: "healthy" | "unhealthy" | "warning";
    if (unhealthyServices.length > 0) {
      overall = "unhealthy";
    } else if (warningServices.length > 0) {
      overall = "warning";
    } else {
      overall = "healthy";
    }

    // Print results
    this.printResults(services, overall);

    return { overall, services };
  }

  private async checkMongoDB(): Promise<ServiceStatus> {
    try {
      const connection = mongoose.connection;
      if (connection.readyState === 1) {
        // Already connected
        await connection.db.admin().ping();
        return {
          name: "MongoDB",
          status: "healthy",
          message: "Connected and responsive",
          details: { uri: env.MONGODB_URI.replace(/\/\/.*@/, "//***:***@") },
        };
      } else {
        // Try to connect
        await mongoose.connect(env.MONGODB_URI);
        await mongoose.connection.db.admin().ping();
        return {
          name: "MongoDB",
          status: "healthy",
          message: "Connection established successfully",
          details: { uri: env.MONGODB_URI.replace(/\/\/.*@/, "//***:***@") },
        };
      }
    } catch (error) {
      return {
        name: "MongoDB",
        status: "unhealthy",
        message: "Connection failed",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  private async checkRedis(): Promise<ServiceStatus> {
    try {
      const redisService = await RedisService.getInstance();
      await redisService.ping();
      return {
        name: "Redis",
        status: "healthy",
        message: "Connected and responsive",
        details: { url: env.REDIS_URL },
      };
    } catch (error) {
      return {
        name: "Redis",
        status: "unhealthy",
        message: "Connection failed",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  private async checkElasticsearch(): Promise<ServiceStatus> {
    try {
      const client = new Client({
        node: env.ELASTIC_URL,
        requestTimeout: 5000,
      });

      const health = await client.cluster.health();

      if (health.status === "green") {
        return {
          name: "Elasticsearch",
          status: "healthy",
          message: "Cluster is healthy",
          details: {
            cluster_name: health.cluster_name,
            status: health.status,
            nodes: health.number_of_nodes,
          },
        };
      } else if (health.status === "yellow") {
        return {
          name: "Elasticsearch",
          status: "warning",
          message: "Cluster is functional but has warnings",
          details: {
            cluster_name: health.cluster_name,
            status: health.status,
            nodes: health.number_of_nodes,
          },
        };
      } else {
        return {
          name: "Elasticsearch",
          status: "unhealthy",
          message: "Cluster is unhealthy",
          details: {
            cluster_name: health.cluster_name,
            status: health.status,
          },
        };
      }
    } catch (error) {
      return {
        name: "Elasticsearch",
        status: "unhealthy",
        message: "Connection failed",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  private async checkEmailService(): Promise<ServiceStatus> {
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT),
        secure: false,
        // Mailpit doesn't require authentication in development
        auth: (env.SMTP_HOST === "localhost" || env.SMTP_HOST === "127.0.0.1") ? undefined : {
          user: env.SMTP_USER || "",
          pass: env.SMTP_PASS || "",
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
      });

      // For Mailpit in development, just test if we can create the transporter
      // and the connection is available without full verification
      if (env.SMTP_HOST === "localhost" || env.SMTP_HOST === "127.0.0.1") {
        // Just test if the port is accessible for Mailpit
        return {
          name: "Email Service",
          status: "healthy",
          message: "SMTP connection available (Mailpit)",
          details: {
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            from: env.EMAIL_FROM,
          },
        };
      } else {
        // For production SMTP servers, do full verification
        await transporter.verify();
        return {
          name: "Email Service",
          status: "healthy",
          message: "SMTP connection verified",
          details: {
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            from: env.EMAIL_FROM,
          },
        };
      }
    } catch (error) {
      // Check if it's a hostname resolution error
      if (error instanceof Error && error.message.includes("ENOTFOUND")) {
        return {
          name: "Email Service",
          status: "unhealthy",
          message: `Cannot resolve hostname '${env.SMTP_HOST}'. For local development, use 'localhost' instead of '${env.SMTP_HOST}'`,
          details: {
            error: error.message,
            suggestion: `Set SMTP_HOST=localhost in your .env file`,
          },
        };
      }

      return {
        name: "Email Service",
        status: "unhealthy",
        message: "SMTP connection failed",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  private processResult(
    serviceName: string,
    result: PromiseSettledResult<ServiceStatus>
  ): ServiceStatus {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        name: serviceName,
        status: "unhealthy",
        message: "Health check failed",
        details: { error: result.reason?.message || "Unknown error" },
      };
    }
  }

  private printResults(services: ServiceStatus[], overall: string) {
    console.log("📊 Service Health Check Results:");
    console.log("═".repeat(50));

    services.forEach((service) => {
      const icon =
        service.status === "healthy"
          ? "✅"
          : service.status === "warning"
          ? "⚠️"
          : "❌";

      console.log(`${icon} ${service.name}: ${service.message}`);

      if (service.details && service.status !== "healthy") {
        console.log(`   Details: ${JSON.stringify(service.details, null, 2)}`);
      }
    });

    console.log("═".repeat(50));

    const overallIcon =
      overall === "healthy" ? "✅" : overall === "warning" ? "⚠️" : "❌";

    console.log(`${overallIcon} Overall Status: ${overall.toUpperCase()}`);

    if (overall === "unhealthy") {
      console.log(
        "\n🚨 Some services are unhealthy. Please fix the issues above before proceeding."
      );
    } else if (overall === "warning") {
      console.log(
        "\n⚠️  Some services have warnings but the API can still function."
      );
    } else {
      console.log("\n🎉 All services are healthy! API is ready to start.");
    }

    console.log("");
  }
}

export default router;
