import { SiteHeader } from '@/components/site-header'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BellIcon, 
  SmartphoneIcon,
  CodeIcon,
  ZapIcon,
  ArrowRightIcon,
  ShieldIcon,
  GlobeIcon,
  DatabaseIcon
} from "lucide-react"

function ServiceWorkers() {
  return (
    <>
      <SiteHeader title="Service Workers & Notifications" />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Service Workers & Push Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Background scripts for push notifications, offline functionality, and enhanced user experience in progressive web applications.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-blue-600" />
              Overview & Architecture
            </CardTitle>
            <CardDescription>
              Service Workers enable background processing, push notifications, and offline capabilities for enhanced user experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg ">
                  <div className="flex items-center gap-2 mb-3">
                    <BellIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-700 dark:text-blue-300">Push Notifications</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Registration:</strong> Automatic on install</p>
                    <p><strong>Permissions:</strong> User consent required</p>
                    <p><strong>Background:</strong> Works when app closed</p>
                    <p><strong>Actions:</strong> Custom buttons</p>
                    <p><strong>Badge:</strong> App icon count</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <GlobeIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-700 dark:text-green-300">Offline Support</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Cache API:</strong> Static assets</p>
                    <p><strong>Network Strategy:</strong> Cache-first</p>
                    <p><strong>Fallbacks:</strong> Offline pages</p>
                    <p><strong>Sync:</strong> Background sync</p>
                    <p><strong>Storage:</strong> IndexedDB</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ZapIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-700 dark:text-purple-300">Performance</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Preloading:</strong> Critical resources</p>
                    <p><strong>Compression:</strong> Gzip/Brotli</p>
                    <p><strong>CDN:</strong> Static asset delivery</p>
                    <p><strong>Lazy Loading:</strong> On-demand resources</p>
                    <p><strong>Updates:</strong> Automatic refresh</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-4">Push Notification Flow</h4>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <DatabaseIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium">API Server</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <GlobeIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <span className="text-xs font-medium">Push Service</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <BellIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium">Service Worker</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <SmartphoneIcon className="w-8 h-8 text-orange-600" />
                    </div>
                    <span className="text-xs font-medium">User Device</span>
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
              Service Worker Implementation
            </CardTitle>
            <CardDescription>
              Complete Service Worker setup with push notifications, caching, and offline functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg ">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Registration</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Check service worker support</p>
                  <p>• Register sw.js file</p>
                  <p>• Request notification permission</p>
                  <p>• Handle registration errors</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Push Setup</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Request notification permission</p>
                  <p>• Subscribe to push manager</p>
                  <p>• Generate VAPID keys</p>
                  <p>• Save subscription to server</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Service Worker Script</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Install event handling</p>
                  <p>• Cache management</p>
                  <p>• Push event processing</p>
                  <p>• Notification display</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="w-5 h-5 text-purple-600" />
              Backend Integration
            </CardTitle>
            <CardDescription>
              Node.js server setup for sending push notifications using Web Push protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg ">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Web Push Setup</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Install web-push package</p>
                  <p>• Configure VAPID keys</p>
                  <p>• Set application details</p>
                  <p>• Generate key pairs</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Subscription Storage</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• MongoDB subscription model</p>
                  <p>• User association</p>
                  <p>• Endpoint and key storage</p>
                  <p>• Active status tracking</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Send Notifications</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Notification payload creation</p>
                  <p>• Subscription validation</p>
                  <p>• Error handling</p>
                  <p>• Expired subscription cleanup</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="w-5 h-5 text-red-600" />
              Security & Best Practices
            </CardTitle>
            <CardDescription>
              Security considerations and best practices for Service Workers and push notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg ">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">VAPID Security</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Unique VAPID keys per environment</p>
                  <p>• Private key protection</p>
                  <p>• Email contact validation</p>
                  <p>• Key rotation strategy</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Subscription Management</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• User consent verification</p>
                  <p>• Subscription expiration handling</p>
                  <p>• Duplicate prevention</p>
                  <p>• Cleanup inactive subscriptions</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Rate Limiting</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Per-user notification limits</p>
                  <p>• Time-based throttling</p>
                  <p>• Frequency controls</p>
                  <p>• Spam prevention</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20">
                <h4 className="font-medium text-sm text-yellow-700 dark:text-yellow-300 mb-2">Content Security</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Input sanitization</p>
                  <p>• XSS prevention</p>
                  <p>• Content validation</p>
                  <p>• Safe URL handling</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20">
                <h4 className="font-medium text-sm text-red-700 dark:text-red-300 mb-2">Privacy</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• User preference controls</p>
                  <p>• Opt-out mechanisms</p>
                  <p>• Data minimization</p>
                  <p>• GDPR compliance</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
                <h4 className="font-medium text-sm text-indigo-700 dark:text-indigo-300 mb-2">Performance</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Efficient caching strategies</p>
                  <p>• Minimal payload sizes</p>
                  <p>• Background processing</p>
                  <p>• Resource optimization</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground border-l-2 border-muted pl-4">
          <p><strong>Background Processing:</strong> Service Workers enable push notifications and offline functionality even when the app is closed</p>
          <p><strong>User Experience:</strong> Instant notifications and offline capabilities provide seamless user experience across all devices</p>
          <p><strong>Security:</strong> VAPID authentication and proper subscription management ensure secure and reliable push notification delivery</p>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/service-workers')({
  component: ServiceWorkers,
})