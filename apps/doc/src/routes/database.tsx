import { SiteHeader } from '@/components/site-header'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DatabaseIcon, 
  UsersIcon,
  MessageSquareIcon,
  HeartIcon,
  BookmarkIcon,
  BellIcon,
  ShieldIcon,
  UserCheckIcon,
  HashIcon
} from "lucide-react"

function Database() {
  return (
    <>
      <SiteHeader title="Database Schema" />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DevSync Database Schema</h1>
            <p className="text-muted-foreground mt-1">
              Entity Relationship Diagram showing our MongoDB database structure and relationships for the social media platform.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="w-5 h-5 text-blue-600" />
              Entity Relationship Diagram
            </CardTitle>
            <CardDescription>
              Visual representation of our database entities and their relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Main Entities Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* User Entity */}
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <UsersIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-700 dark:text-blue-300">User</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• email (unique)</li>
                      <li>• username (unique)</li>
                      <li>• password (hashed)</li>
                      <li>• firstname, lastname</li>
                      <li>• biography</li>
                      <li>• isPrivate (boolean)</li>
                      <li>• emailVerified</li>
                      <li>• follower_count</li>
                      <li>• following_count</li>
                      <li>• post_count</li>
                    </ul>
                    <p><strong>Relationships:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• 1:1 ProfilePhoto</li>
                      <li>• 1:M Posts</li>
                      <li>• 1:M Comments</li>
                      <li>• M:M Follows (self-referencing)</li>
                      <li>• M:M Blocks (self-referencing)</li>
                      <li>• M:M CloseFriends (self-referencing)</li>
                    </ul>
                  </div>
                </div>

                {/* Post Entity */}
                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-700 dark:text-green-300">Post</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• user_id (ObjectId, FK)</li>
                      <li>• urls (Array of strings)</li>
                      <li>• caption (string, max 500)</li>
                      <li>• photo_length (number)</li>
                      <li>• like_count (number)</li>
                      <li>• save_count (number)</li>
                      <li>• mentions (Array of objects)</li>
                      <li>• hashtag_array (Array of strings)</li>
                      <li>• createdAt, updatedAt</li>
                    </ul>
                    <p><strong>Relationships:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• M:1 User (creator)</li>
                      <li>• 1:M Comments</li>
                      <li>• 1:M Likes</li>
                      <li>• 1:M Saves</li>
                      <li>• M:1 Notifications</li>
                    </ul>
                  </div>
                </div>

                {/* Comment Entity */}
                <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-700 dark:text-purple-300">Comment</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• post_id (ObjectId, FK)</li>
                      <li>• user_id (ObjectId, FK)</li>
                      <li>• content (string, max 1000)</li>
                      <li>• like_count (number)</li>
                      <li>• parent_comment (ObjectId, FK)</li>
                      <li>• createdAt, updatedAt</li>
                    </ul>
                    <p><strong>Relationships:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• M:1 Post</li>
                      <li>• M:1 User (author)</li>
                      <li>• 1:M Comment (replies)</li>
                      <li>• M:1 Comment (parent)</li>
                      <li>• 1:M CommentLikes</li>
                      <li>• M:1 Notifications</li>
                    </ul>
                  </div>
                </div>

                {/* Like Entity */}
                <div className="p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <HeartIcon className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-red-700 dark:text-red-300">Like</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• post_id (ObjectId, FK)</li>
                      <li>• user_id (ObjectId, FK)</li>
                      <li>• createdAt</li>
                    </ul>
                    <p><strong>Relationships:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• M:1 Post</li>
                      <li>• M:1 User</li>
                    </ul>
                  </div>
                </div>

                {/* Save Entity */}
                <div className="p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <BookmarkIcon className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-orange-700 dark:text-orange-300">Save</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• post_id (ObjectId, FK)</li>
                      <li>• user_id (ObjectId, FK)</li>
                      <li>• createdAt</li>
                    </ul>
                    <p><strong>Constraints:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Unique index: (user_id, post_id)</li>
                    </ul>
                    <p><strong>Relationships:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• M:1 Post</li>
                      <li>• M:1 User</li>
                    </ul>
                  </div>
                </div>

                {/* Follow Entity */}
                <div className="p-4 border rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheckIcon className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-indigo-700 dark:text-indigo-300">Follow</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• follower_id (ObjectId, FK)</li>
                      <li>• following_id (ObjectId, FK)</li>
                      <li>• status (enum: pending, accepted)</li>
                      <li>• createdAt, updatedAt</li>
                    </ul>
                    <p><strong>Relationships:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• M:1 User (follower)</li>
                      <li>• M:1 User (following)</li>
                    </ul>
                  </div>
                </div>

                {/* Notification Entity */}
                <div className="p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <BellIcon className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-bold text-yellow-700 dark:text-yellow-300">Notification</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• recipientId (ObjectId, FK)</li>
                      <li>• senderId (ObjectId, FK)</li>
                      <li>• type (enum: like, comment, mention, follow, reply, save)</li>
                      <li>• postId (ObjectId, FK, optional)</li>
                      <li>• commentId (ObjectId, FK, optional)</li>
                      <li>• isRead (boolean)</li>
                      <li>• data (object with metadata)</li>
                      <li>• createdAt, updatedAt</li>
                    </ul>
                    <p><strong>Indexes:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• (recipientId, isRead)</li>
                      <li>• (recipientId, createdAt)</li>
                      <li>• (senderId, type)</li>
                    </ul>
                  </div>
                </div>

                {/* Block Entity */}
                <div className="p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-bold text-gray-700 dark:text-gray-300">Block</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• user_id (ObjectId, FK)</li>
                      <li>• blocked_id (ObjectId, FK)</li>
                      <li>• createdAt</li>
                    </ul>
                    <p><strong>Relationships:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• M:1 User (blocker)</li>
                      <li>• M:1 User (blocked)</li>
                    </ul>
                  </div>
                </div>

                {/* ProfilePhoto Entity */}
                <div className="p-4 border rounded-lg bg-pink-50/50 dark:bg-pink-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <UsersIcon className="w-5 h-5 text-pink-600" />
                    <h3 className="font-bold text-pink-700 dark:text-pink-300">ProfilePhoto</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• path (string)</li>
                      <li>• user_id (ObjectId, FK)</li>
                      <li>• uploadedAt</li>
                    </ul>
                    <p><strong>Relationships:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• 1:1 User</li>
                    </ul>
                  </div>
                </div>

                {/* CommentLike Entity */}
                <div className="p-4 border rounded-lg bg-cyan-50/50 dark:bg-cyan-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <HeartIcon className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-bold text-cyan-700 dark:text-cyan-300">CommentLike</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• comment_id (ObjectId, FK)</li>
                      <li>• user_id (ObjectId, FK)</li>
                      <li>• createdAt</li>
                    </ul>
                    <p><strong>Relationships:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• M:1 Comment</li>
                      <li>• M:1 User</li>
                    </ul>
                  </div>
                </div>

                {/* ApiRequestLog Entity */}
                <div className="p-4 border rounded-lg bg-teal-50/50 dark:bg-teal-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareIcon className="w-5 h-5 text-teal-600" />
                    <h3 className="font-bold text-teal-700 dark:text-teal-300">ApiRequestLog</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• method (enum: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)</li>
                      <li>• endpoint (string, indexed)</li>
                      <li>• statusCode (number, indexed)</li>
                      <li>• responseTime (number)</li>
                      <li>• userAgent (string, optional)</li>
                      <li>• ip (string)</li>
                      <li>• timestamp (date)</li>
                      <li>• error (string, optional)</li>
                      <li>• userId (string, indexed, optional)</li>
                    </ul>
                    <p><strong>TTL Index:</strong> 30 days auto-deletion</p>
                  </div>
                </div>

                {/* DailyApiMetrics Entity */}
                <div className="p-4 border rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareIcon className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-emerald-700 dark:text-emerald-300">DailyApiMetrics</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• date (Date, unique, indexed)</li>
                      <li>• totalRequests (number)</li>
                      <li>• successfulRequests (number)</li>
                      <li>• failedRequests (number)</li>
                      <li>• averageResponseTime (number)</li>
                      <li>• requestsByMethod (object with GET, POST, PUT, DELETE, PATCH, OPTIONS)</li>
                      <li>• requestsByEndpoint (Map)</li>
                      <li>• errorsByEndpoint (Map)</li>
                      <li>• statusCodes (Map)</li>
                    </ul>
                  </div>
                </div>

                {/* SystemMetricsLog Entity */}
                <div className="p-4 border rounded-lg bg-lime-50/50 dark:bg-lime-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareIcon className="w-5 h-5 text-lime-600" />
                    <h3 className="font-bold text-lime-700 dark:text-lime-300">SystemMetricsLog</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Primary Key:</strong> _id (ObjectId)</p>
                    <p><strong>Fields:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• timestamp (Date)</li>
                      <li>• cpu: usage, cores, loadAverage[]</li>
                      <li>• memory: usage, total, used, free</li>
                      <li>• disk: usage, total, used, free</li>
                      <li>• network: in, out, connections</li>
                      <li>• uptime (number)</li>
                    </ul>
                    <p><strong>TTL Index:</strong> 30 days auto-deletion</p>
                  </div>
                </div>
              </div>

              {/* Relationship Diagram */}
              <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-4 text-center">Key Relationships Overview</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="text-center p-3 border rounded bg-white dark:bg-gray-900">
                    <h5 className="font-medium text-xs mb-2">User → Post</h5>
                    <p className="text-xs text-muted-foreground">One-to-Many: A user can create multiple posts</p>
                  </div>
                  <div className="text-center p-3 border rounded bg-white dark:bg-gray-900">
                    <h5 className="font-medium text-xs mb-2">Post → Comment</h5>
                    <p className="text-xs text-muted-foreground">One-to-Many: A post can have multiple comments</p>
                  </div>
                  <div className="text-center p-3 border rounded bg-white dark:bg-gray-900">
                    <h5 className="font-medium text-xs mb-2">User → Follow</h5>
                    <p className="text-xs text-muted-foreground">Many-to-Many: Self-referencing relationship</p>
                  </div>
                  <div className="text-center p-3 border rounded bg-white dark:bg-gray-900">
                    <h5 className="font-medium text-xs mb-2">Comment → Comment</h5>
                    <p className="text-xs text-muted-foreground">Self-referencing: Comments can have replies</p>
                  </div>
                  <div className="text-center p-3 border rounded bg-white dark:bg-gray-900">
                    <h5 className="font-medium text-xs mb-2">User → Notification</h5>
                    <p className="text-xs text-muted-foreground">One-to-Many: Users receive multiple notifications</p>
                  </div>
                  <div className="text-center p-3 border rounded bg-white dark:bg-gray-900">
                    <h5 className="font-medium text-xs mb-2">Post → Like/Save</h5>
                    <p className="text-xs text-muted-foreground">One-to-Many: Posts can be liked/saved multiple times</p>
                  </div>
                  <div className="text-center p-3 border rounded bg-white dark:bg-gray-900">
                    <h5 className="font-medium text-xs mb-2">Comment → CommentLike</h5>
                    <p className="text-xs text-muted-foreground">One-to-Many: Comments can be liked multiple times</p>
                  </div>
                  <div className="text-center p-3 border rounded bg-white dark:bg-gray-900">
                    <h5 className="font-medium text-xs mb-2">API → Metrics</h5>
                    <p className="text-xs text-muted-foreground">Logging: Request logs and daily metrics collection</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HashIcon className="w-5 h-5 text-green-600" />
              Database Design Patterns
            </CardTitle>
            <CardDescription>
              Key design decisions and patterns used in our MongoDB schema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Embedded vs Referenced</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>Embedded:</strong> Mentions in posts, notification data</p>
                  <p>• <strong>Referenced:</strong> User relationships, post ownership</p>
                  <p>• <strong>Hybrid:</strong> Post with embedded mentions + referenced user</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Indexing Strategy</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>Unique:</strong> email, username, (user_id, post_id) for saves</p>
                  <p>• <strong>Compound:</strong> (recipientId, isRead) for notifications</p>
                  <p>• <strong>Performance:</strong> createdAt, user_id for queries</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-2">Data Consistency</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>Counters:</strong> like_count, save_count, follower_count</p>
                  <p>• <strong>Validation:</strong> Zod schemas for data integrity</p>
                  <p>• <strong>Constraints:</strong> Unique indexes prevent duplicates</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
                <h4 className="font-medium text-sm text-orange-700 dark:text-orange-300 mb-2">Scalability Considerations</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>Denormalization:</strong> Cached counts for performance</p>
                  <p>• <strong>Sharding:</strong> User-based partitioning ready</p>
                  <p>• <strong>Archiving:</strong> Timestamp-based data lifecycle</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20">
                <h4 className="font-medium text-sm text-red-700 dark:text-red-300 mb-2">Security & Privacy</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>Private Accounts:</strong> isPrivate flag for content visibility</p>
                  <p>• <strong>Blocking:</strong> Block model for user restrictions</p>
                  <p>• <strong>Close Friends:</strong> Selective content sharing</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
                <h4 className="font-medium text-sm text-indigo-700 dark:text-indigo-300 mb-2">Real-time Features</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>Notifications:</strong> Event-driven notification system</p>
                  <p>• <strong>Mentions:</strong> Embedded user references in posts</p>
                  <p>• <strong>Activity:</strong> Timestamp tracking for feeds</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-teal-50/50 dark:bg-teal-950/20">
                <h4 className="font-medium text-sm text-teal-700 dark:text-teal-300 mb-2">Monitoring & Logging</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>API Logs:</strong> Request/response tracking with TTL</p>
                  <p>• <strong>Daily Metrics:</strong> Aggregated performance data</p>
                  <p>• <strong>System Metrics:</strong> CPU, memory, disk, network</p>
                  <p>• <strong>Auto-cleanup:</strong> 30-day retention policy</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground border-l-2 border-muted pl-4">
          <p><strong>Database:</strong> MongoDB with Mongoose ODM for type safety and schema validation</p>
          <p><strong>Models:</strong> 15 core entities with 30+ relationships supporting social media functionality and monitoring</p>
          <p><strong>Performance:</strong> Optimized indexes, TTL indexes for auto-cleanup, and denormalized counters for real-time social features</p>
          <p><strong>Monitoring:</strong> Comprehensive API logging, daily metrics aggregation, and system resource tracking with 30-day retention</p>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/database')({
  component: Database,
})