import { SiteHeader } from '@/components/site-header'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MessageSquareIcon, 
  UsersIcon,
  BellIcon,
  CodeIcon,
  ArrowRightIcon,
  ShieldIcon,
  GlobeIcon
} from "lucide-react"

function Socketio() {
  return (
    <>
      <SiteHeader title="Socket.io Real-time Communication" />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Socket.io Real-time Features</h1>
            <p className="text-muted-foreground mt-1">
              Bidirectional real-time communication between clients and servers for instant messaging, notifications, and live updates.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5 text-blue-600" />
              Overview & Architecture
            </CardTitle>
            <CardDescription>
              Socket.io enables real-time, event-based communication with automatic fallbacks and connection management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-700 dark:text-blue-300">Server Setup</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Port:</strong> 3001 (shared with API)</p>
                    <p><strong>CORS:</strong> Configured for frontend</p>
                    <p><strong>Transports:</strong> WebSocket, Polling</p>
                    <p><strong>Ping Timeout:</strong> 60000ms</p>
                    <p><strong>Ping Interval:</strong> 25000ms</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <UsersIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-700 dark:text-green-300">Client Connection</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>URL:</strong> ws://localhost:3001</p>
                    <p><strong>Auto Connect:</strong> Enabled</p>
                    <p><strong>Reconnection:</strong> Automatic</p>
                    <p><strong>Max Reconnects:</strong> 5</p>
                    <p><strong>Auth:</strong> JWT token-based</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-700 dark:text-purple-300">Security</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Authentication:</strong> JWT middleware</p>
                    <p><strong>Rate Limiting:</strong> Per connection</p>
                    <p><strong>Room Access:</strong> User-based</p>
                    <p><strong>Message Validation:</strong> Schema-based</p>
                    <p><strong>Origin Check:</strong> CORS validation</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-4">Real-time Communication Flow</h4>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <GlobeIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium">Frontend</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <MessageSquareIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <span className="text-xs font-medium">Socket.io</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <CodeIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium">API Server</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <UsersIcon className="w-8 h-8 text-orange-600" />
                    </div>
                    <span className="text-xs font-medium">Connected Users</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CodeIcon className="w-5 h-5 text-green-600" />
              Server Implementation
            </CardTitle>
            <CardDescription>
              Socket.io server setup with authentication, rooms, and event handlers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Server Initialization</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Import Server from socket.io</p>
                  <p>• Configure CORS settings</p>
                  <p>• Set transport options</p>
                  <p>• Configure ping settings</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Authentication</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• JWT middleware setup</p>
                  <p>• Token validation</p>
                  <p>• User data attachment</p>
                  <p>• Error handling</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Event Handlers</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Connection handling</p>
                  <p>• Message events</p>
                  <p>• Room management</p>
                  <p>• Disconnection cleanup</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeIcon className="w-5 h-5 text-purple-600" />
              Client Implementation
            </CardTitle>
            <CardDescription>
              React client setup with Socket.io hooks and real-time event handling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Socket Hook</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Custom useSocket hook</p>
                  <p>• Token-based authentication</p>
                  <p>• Connection management</p>
                  <p>• Cleanup on unmount</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Event Listeners</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Message event handling</p>
                  <p>• State management</p>
                  <p>• Real-time updates</p>
                  <p>• Error handling</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Message Sending</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Emit message events</p>
                  <p>• Form handling</p>
                  <p>• User selection</p>
                  <p>• Message validation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-orange-600" />
              Real-time Features
            </CardTitle>
            <CardDescription>
              Comprehensive real-time functionality for social media platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Direct Messaging</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Real-time message delivery</p>
                  <p>• Typing indicators</p>
                  <p>• Message status tracking</p>
                  <p>• File attachments</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Live Notifications</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Like notifications</p>
                  <p>• Comment alerts</p>
                  <p>• Follow requests</p>
                  <p>• System announcements</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Presence System</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Online/offline status</p>
                  <p>• Last seen timestamps</p>
                  <p>• Active user indicators</p>
                  <p>• Connection quality</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20">
                <h4 className="font-medium text-sm text-yellow-700 dark:text-yellow-300 mb-2">Live Updates</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Real-time feed updates</p>
                  <p>• Live post interactions</p>
                  <p>• Comment threading</p>
                  <p>• Share notifications</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20">
                <h4 className="font-medium text-sm text-red-700 dark:text-red-300 mb-2">Group Features</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Group chat rooms</p>
                  <p>• Channel subscriptions</p>
                  <p>• Moderation controls</p>
                  <p>• Broadcast messages</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
                <h4 className="font-medium text-sm text-indigo-700 dark:text-indigo-300 mb-2">Performance</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Connection pooling</p>
                  <p>• Message queuing</p>
                  <p>• Rate limiting</p>
                  <p>• Error handling</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground border-l-2 border-muted pl-4">
          <p><strong>Real-time:</strong> Socket.io provides bidirectional communication with automatic fallbacks and connection management</p>
          <p><strong>Scalability:</strong> Room-based architecture enables efficient message routing and user presence management</p>
          <p><strong>Security:</strong> JWT-based authentication with rate limiting and message validation for secure real-time communication</p>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/socketio')({
  component: Socketio,
})