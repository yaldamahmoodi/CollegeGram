import { SiteHeader } from '@/components/site-header'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  SearchIcon, 
  DatabaseIcon,
  ZapIcon,
  BarChartIcon,
  CodeIcon,
  GlobeIcon,
  ArrowRightIcon,
  ShieldIcon
} from "lucide-react"

function Elasticsearch() {
  return (
    <>
      <SiteHeader title="Elasticsearch Integration" />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Elasticsearch Search Engine</h1>
            <p className="text-muted-foreground mt-1">
              Distributed search and analytics engine for real-time data processing, full-text search, and advanced analytics in our social media platform.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="w-5 h-5 text-blue-600" />
              Overview & Configuration
            </CardTitle>
            <CardDescription>
              Elasticsearch powers our search functionality with distributed indexing and real-time querying capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <DatabaseIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-700 dark:text-blue-300">Container Setup</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Image:</strong> elasticsearch:8.19.3</p>
                    <p><strong>Port:</strong> 9200 (HTTP)</p>
                    <p><strong>Memory:</strong> 512MB allocated</p>
                    <p><strong>Security:</strong> Disabled for development</p>
                    <p><strong>Network:</strong> Internal Docker network</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ZapIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-700 dark:text-green-300">Performance</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Shards:</strong> Auto-configured</p>
                    <p><strong>Replicas:</strong> 0 (single node)</p>
                    <p><strong>Refresh:</strong> 1s default</p>
                    <p><strong>Cache:</strong> Query cache enabled</p>
                    <p><strong>Compression:</strong> LZ4 enabled</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-700 dark:text-purple-300">Configuration</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Environment:</strong> development</p>
                    <p><strong>Discovery:</strong> Single-node</p>
                    <p><strong>SSL:</strong> Disabled</p>
                    <p><strong>Authentication:</strong> Disabled</p>
                    <p><strong>Logging:</strong> INFO level</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-4">Data Indexing Flow</h4>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <DatabaseIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium">MongoDB</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <CodeIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium">API Service</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <SearchIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <span className="text-xs font-medium">Elasticsearch</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <GlobeIcon className="w-8 h-8 text-orange-600" />
                    </div>
                    <span className="text-xs font-medium">Frontend</span>
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
              Node.js Integration
            </CardTitle>
            <CardDescription>
              Official Elasticsearch client implementation with automatic instrumentation and performance monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Client Setup</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Official Elasticsearch client for Node.js</p>
                  <p>• Connection to elasticsearch:9200</p>
                  <p>• Authentication configuration</p>
                  <p>• Retry and timeout settings</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Index Management</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Dynamic index creation</p>
                  <p>• Field mapping configuration</p>
                  <p>• Document indexing operations</p>
                  <p>• Bulk operations support</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Search Queries</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Full-text search implementation</p>
                  <p>• Boolean queries with filters</p>
                  <p>• Highlighting and suggestions</p>
                  <p>• Aggregation queries</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon className="w-5 h-5 text-purple-600" />
              Analytics & Monitoring
            </CardTitle>
            <CardDescription>
              Elastic APM integration for performance monitoring and query optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">APM Integration</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Automatic query instrumentation</p>
                  <p>• Performance metrics tracking</p>
                  <p>• Error rate monitoring</p>
                  <p>• Slow query identification</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Search Analytics</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Query performance metrics</p>
                  <p>• Search result click rates</p>
                  <p>• Popular search terms</p>
                  <p>• Zero-result queries</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Optimization</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Index optimization strategies</p>
                  <p>• Query caching configuration</p>
                  <p>• Shard allocation tuning</p>
                  <p>• Memory usage monitoring</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeIcon className="w-5 h-5 text-orange-600" />
              Use Cases in DevSync
            </CardTitle>
            <CardDescription>
              Specific implementation details for social media platform features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Post Search</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Index:</strong> posts</p>
                  <p><strong>Fields:</strong> content, tags, userId, createdAt</p>
                  <p><strong>Features:</strong> Full-text search, highlighting, filters</p>
                  <p><strong>Analytics:</strong> Search popularity, click-through rates</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">User Discovery</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Index:</strong> users</p>
                  <p><strong>Fields:</strong> username, bio, interests</p>
                  <p><strong>Features:</strong> Fuzzy matching, suggestions</p>
                  <p><strong>Analytics:</strong> User search patterns</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Content Analytics</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Aggregations:</strong> Popular tags, trending topics</p>
                  <p><strong>Time Series:</strong> Content creation patterns</p>
                  <p><strong>Insights:</strong> Engagement metrics, viral content</p>
                  <p><strong>Reports:</strong> Daily/weekly analytics</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20">
                <h4 className="font-medium text-sm text-yellow-700 dark:text-yellow-300 mb-2">Real-time Features</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Auto-complete:</strong> Search suggestions</p>
                  <p><strong>Related Posts:</strong> Content recommendations</p>
                  <p><strong>Trending:</strong> Hot topics detection</p>
                  <p><strong>Notifications:</strong> Mention alerts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground border-l-2 border-muted pl-4">
          <p><strong>Performance:</strong> Elasticsearch provides sub-second search responses with distributed indexing and real-time querying capabilities</p>
          <p><strong>Scalability:</strong> Horizontal scaling support with automatic sharding and replica management for high availability</p>
          <p><strong>Integration:</strong> Seamless Node.js client with Elastic APM for comprehensive monitoring and performance optimization</p>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/elasticsearch')({
  component: Elasticsearch,
})