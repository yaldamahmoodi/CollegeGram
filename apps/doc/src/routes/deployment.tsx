import { SiteHeader } from '@/components/site-header'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ServerIcon, 
  GitBranchIcon,
  GlobeIcon,
  DatabaseIcon,
  MailIcon,
  SearchIcon,
  LockIcon,
  FileTextIcon,
  ArrowRightIcon
} from "lucide-react"

function Deployment() {
  return (
    <>
      <SiteHeader title="Deployment Guide" />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DevSync Deployment Guide</h1>
            <p className="text-muted-foreground mt-1">
              Complete deployment infrastructure using Docker Compose, Nginx reverse proxy, and GitLab CI/CD for production-ready social media platform.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="w-5 h-5 text-blue-600" />
              Docker Compose Architecture
            </CardTitle>
            <CardDescription>
              Multi-container orchestration for all application services and dependencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Services Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <DatabaseIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-700 dark:text-blue-300">MongoDB</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Container:</strong> collagegram-mongo</p>
                    <p><strong>Port:</strong> 27017</p>
                    <p><strong>Image:</strong> mongo:4.4</p>
                    <p><strong>Database:</strong> collagegram</p>
                    <p><strong>Credentials:</strong> admin/admin</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <SearchIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-700 dark:text-green-300">Elasticsearch</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Container:</strong> collagegram-elasticsearch</p>
                    <p><strong>Port:</strong> 9200</p>
                    <p><strong>Image:</strong> elasticsearch:8.19.3</p>
                    <p><strong>Memory:</strong> 512MB</p>
                    <p><strong>Security:</strong> Disabled for dev</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MailIcon className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-red-700 dark:text-red-300">Mailpit</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Container:</strong> collagegram-mailpit</p>
                    <p><strong>SMTP:</strong> 1025</p>
                    <p><strong>Web UI:</strong> 8025</p>
                    <p><strong>Image:</strong> axllent/mailpit:latest</p>
                    <p><strong>Purpose:</strong> Email testing</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <DatabaseIcon className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-orange-700 dark:text-orange-300">Redis</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Container:</strong> collagegram-redis</p>
                    <p><strong>Port:</strong> 6379</p>
                    <p><strong>Image:</strong> redis:latest</p>
                    <p><strong>Purpose:</strong> Session storage</p>
                    <p><strong>Persistence:</strong> Enabled</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ServerIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-700 dark:text-purple-300">API Service</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Container:</strong> monorepo-api</p>
                    <p><strong>Port:</strong> 3001</p>
                    <p><strong>Build:</strong> ./apps/api</p>
                    <p><strong>Dependencies:</strong> mongo, elasticsearch</p>
                    <p><strong>Profile:</strong> production</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <GlobeIcon className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-indigo-700 dark:text-indigo-300">Web Service</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Container:</strong> monorepo-web</p>
                    <p><strong>Port:</strong> 3000</p>
                    <p><strong>Build:</strong> ./apps/web</p>
                    <p><strong>Dependencies:</strong> api</p>
                    <p><strong>Profile:</strong> production</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <FileTextIcon className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-bold text-yellow-700 dark:text-yellow-300">Doc Service</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Container:</strong> monorepo-doc</p>
                    <p><strong>Port:</strong> 3002:80</p>
                    <p><strong>Build:</strong> ./apps/doc</p>
                    <p><strong>Purpose:</strong> Health dashboard</p>
                    <p><strong>Profile:</strong> production</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <GlobeIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-bold text-gray-700 dark:text-gray-300">Nginx</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Container:</strong> monorepo-nginx</p>
                    <p><strong>Ports:</strong> 80, 443</p>
                    <p><strong>Image:</strong> nginx:1.25-alpine</p>
                    <p><strong>SSL:</strong> Let's Encrypt</p>
                    <p><strong>Profile:</strong> production</p>
                  </div>
                </div>
              </div>

              {/* Deployment Flow */}
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-4">Container Dependencies & Startup Flow</h4>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <DatabaseIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium">Infrastructure</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <ServerIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium">API Service</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                      <GlobeIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <span className="text-xs font-medium">Frontend</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                      <GlobeIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <span className="text-xs font-medium">Nginx Proxy</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeIcon className="w-5 h-5 text-green-600" />
              Nginx Reverse Proxy Configuration
            </CardTitle>
            <CardDescription>
              Production-ready reverse proxy with SSL termination, static file serving, and load balancing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Nginx Routes */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Static Assets</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Route:</strong> /uploads/</p>
                    <p><strong>Purpose:</strong> User uploaded files</p>
                    <p><strong>Features:</strong> CORS headers, 1-year cache</p>
                    <p><strong>Security:</strong> X-Content-Type-Options, X-Frame-Options</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Mailpit Interface</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Route:</strong> /mailpit/</p>
                    <p><strong>Backend:</strong> mailpit:8025</p>
                    <p><strong>Features:</strong> WebSocket support</p>
                    <p><strong>Purpose:</strong> Email testing interface</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Health Dashboard</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Route:</strong> /health-dashboard/</p>
                    <p><strong>Backend:</strong> doc:80</p>
                    <p><strong>Features:</strong> WebSocket upgrade</p>
                    <p><strong>Purpose:</strong> System monitoring</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
                  <h4 className="font-medium text-sm text-orange-700 dark:text-orange-300 mb-2">API Gateway</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Route:</strong> /api/</p>
                    <p><strong>Backend:</strong> api:3001</p>
                    <p><strong>Features:</strong> Upload protection</p>
                    <p><strong>Security:</strong> Header forwarding</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 col-span-2">
                  <h4 className="font-medium text-sm text-indigo-700 dark:text-indigo-300 mb-2">Frontend Application</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Route:</strong> / (catch-all)</p>
                    <p><strong>Backend:</strong> web:3000</p>
                    <p><strong>Features:</strong> SPA routing, WebSocket support</p>
                    <p><strong>Purpose:</strong> Main React application</p>
                  </div>
                </div>
              </div>

              {/* SSL Configuration */}
              <div className="p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20">
                <h4 className="font-medium text-sm text-yellow-700 dark:text-yellow-300 mb-2">SSL/TLS Configuration</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Certificate Provider:</strong> Let's Encrypt via acme.sh</p>
                  <p><strong>Domain:</strong> devsync.rahnemacollege.ir</p>
                  <p><strong>Certificate Path:</strong> /etc/letsencrypt/live/devsyncc.ir</p>
                  <p><strong>Auto-renewal:</strong> Enabled via acme.sh</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranchIcon className="w-5 h-5 text-orange-600" />
              GitLab CI/CD Pipeline
            </CardTitle>
            <CardDescription>
              Automated build and deployment pipeline for production releases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Pipeline Stages */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Build Stage</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Trigger:</strong> Push to 'prod' branch</p>
                    <p><strong>Environment:</strong> GitLab Runner with Docker</p>
                    <p><strong>Actions:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Create .env files from variables</li>
                      <li>• Build Docker images (no-cache)</li>
                      <li>• Save artifacts for deployment</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20">
                  <h4 className="font-medium text-sm text-yellow-700 dark:text-yellow-300 mb-2">Test Stage</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Dependencies:</strong> Build stage completion</p>
                    <p><strong>Actions:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Run unit tests</li>
                      <li>• API endpoint validation</li>
                      <li>• Docker health checks</li>
                      <li>• Security scans</li>
                    </ul>
                    <p><strong>Quality Gate:</strong> Must pass to deploy</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Deploy Stage</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Dependencies:</strong> Test stage completion</p>
                    <p><strong>Actions:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Stop existing containers</li>
                      <li>• Deploy new containers</li>
                      <li>• Remove orphaned containers</li>
                      <li>• Health check verification</li>
                    </ul>
                    <p><strong>Zero-downtime:</strong> Rolling deployment</p>
                  </div>
                </div>
              </div>

              {/* Environment Variables */}
              <div className="p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-950/20">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Environment Variables</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium">API Configuration</h5>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• ACCESS_TOKEN_SECRET</p>
                      <p>• MONGODB_URI</p>
                      <p>• REDIS_URL</p>
                      <p>• ELASTIC_URL</p>
                      <p>• SMTP_* variables</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium">Web Configuration</h5>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• VITE_BASE_URL</p>
                      <p>• VITE_SOCKET_URL</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium">Infrastructure</h5>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• NODE_ENV=production</p>
                      <p>• PORT=3001</p>
                      <p>• CORS_ORIGIN</p>
                      <p>• COOKIE_SECRET</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deployment Commands */}
              <div className="p-4 border rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
                <h4 className="font-medium text-sm text-indigo-700 dark:text-indigo-300 mb-2">Deployment Commands</h4>
                <div className="text-xs space-y-2">
                  <div className="bg-black text-green-400 p-2 rounded font-mono">
                    <div># Build stage</div>
                    <div>docker compose -f docker-compose.yaml -f docker-compose.prod.yml build --no-cache</div>
                  </div>
                  <div className="bg-black text-green-400 p-2 rounded font-mono">
                    <div># Deploy stage</div>
                    <div>docker compose -f docker-compose.yaml -f docker-compose.prod.yml down</div>
                    <div>docker compose -f docker-compose.yaml -f docker-compose.prod.yml up -d --remove-orphans</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="w-5 h-5 text-gray-600" />
              Ubuntu Server Setup & Configuration
            </CardTitle>
            <CardDescription>
              Complete server configuration including UFW firewall, Docker installation, and system optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Server Setup */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-950/20">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">System Requirements</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>OS:</strong> Ubuntu 20.04 LTS or 22.04 LTS</p>
                    <p><strong>RAM:</strong> Minimum 4GB, Recommended 8GB+</p>
                    <p><strong>Storage:</strong> 50GB+ SSD recommended</p>
                    <p><strong>CPU:</strong> 2+ cores</p>
                    <p><strong>Network:</strong> Static IP address</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Initial Setup</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>User:</strong> Create non-root user with sudo</p>
                    <p><strong>Updates:</strong> apt update && apt upgrade</p>
                    <p><strong>SSH:</strong> Configure key-based authentication</p>
                    <p><strong>Time Zone:</strong> Set correct timezone</p>
                    <p><strong>Swap:</strong> Configure swap if needed</p>
                  </div>
                </div>
              </div>

              {/* UFW Firewall Configuration */}
              <div className="p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20">
                <h4 className="font-medium text-sm text-red-700 dark:text-red-300 mb-2">UFW Firewall Configuration</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium">Basic UFW Setup</h5>
                    <div className="bg-black text-green-400 p-2 rounded font-mono text-xs">
                      <div># Reset UFW to defaults</div>
                      <div>sudo ufw --force reset</div>
                      <div># Set default policies</div>
                      <div>sudo ufw default deny incoming</div>
                      <div>sudo ufw default allow outgoing</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium">Allow Essential Ports</h5>
                    <div className="bg-black text-green-400 p-2 rounded font-mono text-xs">
                      <div># SSH access</div>
                      <div>sudo ufw allow 22/tcp</div>
                      <div># HTTP and HTTPS</div>
                      <div>sudo ufw allow 80/tcp</div>
                      <div>sudo ufw allow 443/tcp</div>
                      <div># Enable UFW</div>
                      <div>sudo ufw enable</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Docker Installation */}
              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Docker & Docker Compose Setup</h4>
                <div className="bg-black text-green-400 p-2 rounded font-mono text-xs">
                  <div># Install Docker</div>
                  <div>curl -fsSL https://get.docker.com -o get-docker.sh</div>
                  <div>sudo sh get-docker.sh</div>
                  <div>sudo usermod -aG docker $USER</div>
                  <div># Install Docker Compose</div>
                  <div>sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose</div>
                  <div>sudo chmod +x /usr/local/bin/docker-compose</div>
                  <div># Verify installation</div>
                  <div>docker --version && docker-compose --version</div>
                </div>
              </div>

              {/* GitLab Runner Setup */}
              <div className="p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
                <h4 className="font-medium text-sm text-orange-700 dark:text-orange-300 mb-2">GitLab Runner Installation</h4>
                <div className="bg-black text-green-400 p-2 rounded font-mono text-xs">
                  <div># Download and install GitLab Runner</div>
                  <div>curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash</div>
                  <div>sudo apt-get install gitlab-runner</div>
                  <div># Register runner with GitLab</div>
                  <div>sudo gitlab-runner register --url https://gitlab.com/ --registration-token YOUR_TOKEN</div>
                  <div># Start and enable service</div>
                  <div>sudo systemctl start gitlab-runner</div>
                  <div>sudo systemctl enable gitlab-runner</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockIcon className="w-5 h-5 text-red-600" />
              Production Security & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20">
                <h4 className="font-medium text-sm text-red-700 dark:text-red-300 mb-2">SSL/TLS Security</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Let's Encrypt certificates</p>
                  <p>• HTTPS enforcement</p>
                  <p>• Secure headers (HSTS, etc.)</p>
                  <p>• Certificate auto-renewal</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Container Security</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Non-root containers</p>
                  <p>• Minimal base images</p>
                  <p>• Read-only filesystems</p>
                  <p>• Resource limits</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Network Security</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Internal container networks</p>
                  <p>• Port exposure control</p>
                  <p>• CORS configuration</p>
                  <p>• Rate limiting</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Data Persistence</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Named Docker volumes</p>
                  <p>• Database backups</p>
                  <p>• Upload file storage</p>
                  <p>• Log aggregation</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
                <h4 className="font-medium text-sm text-orange-700 dark:text-orange-300 mb-2">Monitoring</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Health check endpoints</p>
                  <p>• Container status monitoring</p>
                  <p>• Log streaming</p>
                  <p>• Performance metrics</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
                <h4 className="font-medium text-sm text-indigo-700 dark:text-indigo-300 mb-2">CI/CD Security</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Environment variable protection</p>
                  <p>• Artifact retention</p>
                  <p>• Branch protection rules</p>
                  <p>• Automated testing</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground border-l-2 border-muted pl-4">
          <p><strong>Infrastructure:</strong> Docker Compose orchestration with 8 services including databases, search, email, and application containers</p>
          <p><strong>Deployment:</strong> GitLab CI/CD pipeline with automated builds and zero-downtime deployments to production server</p>
          <p><strong>Domain:</strong> devsync.rahnemacollege.ir with SSL/TLS encryption and Nginx reverse proxy for optimal performance</p>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/deployment')({
  component: Deployment,
})