import { SiteHeader } from '@/components/site-header'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MailIcon, 
  GlobeIcon,
  WebhookIcon,
  CodeIcon,
  SettingsIcon,
  ArrowRightIcon,
  TestTubeIcon,
  DatabaseIcon
} from "lucide-react"

function Mailpit() {
  return (
    <>
      <SiteHeader title="Mailpit Email Testing" />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mailpit Email Testing Platform</h1>
            <p className="text-muted-foreground mt-1">
              Development email testing tool for capturing, displaying, and testing emails without sending them to real recipients.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailIcon className="w-5 h-5 text-red-600" />
              Overview & Configuration
            </CardTitle>
            <CardDescription>
              Mailpit provides a complete email testing environment with SMTP server and web interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MailIcon className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-red-700 dark:text-red-300">Container Setup</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Image:</strong> axllent/mailpit:latest</p>
                    <p><strong>SMTP Port:</strong> 1025</p>
                    <p><strong>Web UI Port:</strong> 8025</p>
                    <p><strong>Container:</strong> collagegram-mailpit</p>
                    <p><strong>Purpose:</strong> Email testing & development</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <WebhookIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-700 dark:text-green-300">API Endpoints</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Web UI:</strong> http://localhost:8025</p>
                    <p><strong>API Base:</strong> /api/v1/</p>
                    <p><strong>WebSocket:</strong> /api/events</p>
                    <p><strong>Messages:</strong> /api/v1/messages</p>
                    <p><strong>Delete:</strong> /api/v1/messages/id</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <SettingsIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-700 dark:text-purple-300">Features</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Real-time:</strong> WebSocket events</p>
                    <p><strong>Attachments:</strong> File support</p>
                    <p><strong>HTML/Text:</strong> Multi-part emails</p>
                    <p><strong>Search:</strong> Message filtering</p>
                    <p><strong>Export:</strong> EML format</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-4">Email Testing Flow</h4>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <CodeIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium">API Service</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      <MailIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <span className="text-xs font-medium">SMTP (1025)</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <DatabaseIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <span className="text-xs font-medium">Mailpit Storage</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <GlobeIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium">Web UI (8025)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CodeIcon className="w-5 h-5 text-blue-600" />
              Node.js SMTP Configuration
            </CardTitle>
            <CardDescription>
              Email service setup using Nodemailer with Mailpit for development testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Nodemailer Setup</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Import nodemailer package</p>
                  <p>• Configure SMTP transporter</p>
                  <p>• Set host to mailpit:1025</p>
                  <p>• Configure authentication</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Email Templates</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Welcome email templates</p>
                  <p>• Password reset emails</p>
                  <p>• Email verification</p>
                  <p>• Notification alerts</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Email Service</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Send email method</p>
                  <p>• Error handling</p>
                  <p>• Message ID tracking</p>
                  <p>• Retry mechanisms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WebhookIcon className="w-5 h-5 text-green-600" />
              WebSocket API Integration
            </CardTitle>
            <CardDescription>
              Real-time email monitoring using Mailpit's WebSocket API for live email notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">WebSocket Client</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Connect to ws://localhost:8025/api/events</p>
                  <p>• Handle connection events</p>
                  <p>• Parse incoming messages</p>
                  <p>• Error handling and reconnection</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Event Types</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Message:</strong> New email received</p>
                  <p><strong>Update:</strong> Email updated</p>
                  <p><strong>Delete:</strong> Email deleted</p>
                  <p><strong>Purge:</strong> All emails cleared</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTubeIcon className="w-5 h-5 text-purple-600" />
              Testing & Development Features
            </CardTitle>
            <CardDescription>
              Comprehensive email testing capabilities for development and quality assurance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Email Templates</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Welcome emails</p>
                  <p>• Password reset</p>
                  <p>• Email verification</p>
                  <p>• Notification alerts</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Testing Scenarios</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• User registration flow</p>
                  <p>• Password reset process</p>
                  <p>• Email format validation</p>
                  <p>• Attachment handling</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Quality Assurance</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Email content validation</p>
                  <p>• Link functionality testing</p>
                  <p>• Responsive design check</p>
                  <p>• Spam score analysis</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground border-l-2 border-muted pl-4">
          <p><strong>Development:</strong> Mailpit provides a complete email testing environment without sending emails to real recipients</p>
          <p><strong>Real-time:</strong> WebSocket API enables live monitoring of incoming emails with instant notifications</p>
          <p><strong>Integration:</strong> Seamless SMTP integration with Node.js applications using Nodemailer for reliable email testing</p>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/mailpit')({
  component: Mailpit,
})