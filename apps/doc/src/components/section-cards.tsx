import { TrendingUpIcon, CpuIcon, MemoryStickIcon, NetworkIcon, LoaderIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useHealthCheck } from "@/hooks/useHealthCheck"

export function SectionCards() {
  const { systemMetrics, apiMetrics, loading } = useHealthCheck(30000);

  // Helper functions to format data
  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };


  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader className="relative">
              <CardDescription>Loading...</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex items-center gap-2">
                <LoaderIcon className="size-5 animate-spin" />
                --
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>CPU Usage</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {systemMetrics?.cpu.usage.toFixed(1)}%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <CpuIcon className="size-3" />
              {(systemMetrics?.cpu.usage || 0) > 80 ? 'High' : (systemMetrics?.cpu.usage || 0) > 60 ? 'Normal' : 'Low'}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(systemMetrics?.cpu.usage || 0) > 80 ? 'High CPU usage' : 'CPU performance stable'} 
            {(systemMetrics?.cpu.usage || 0) > 80 ? <TrendingUpIcon className="size-4 text-red-500" /> : <TrendingUpIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {systemMetrics?.cpu.cores} cores, {systemMetrics?.cpu.processes} processes
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Memory Usage</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatBytes(systemMetrics?.memory.used || 0)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <MemoryStickIcon className="size-3" />
              {systemMetrics?.memory.usage.toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(systemMetrics?.memory.usage || 0) > 85 ? 'High memory usage' : 'Memory usage optimal'} 
            {(systemMetrics?.memory.usage || 0) > 85 ? <TrendingUpIcon className="size-4 text-orange-500" /> : <TrendingUpIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {formatBytes(systemMetrics?.memory.total || 0)} total available
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total API Calls</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatNumber(
              (apiMetrics?.historicalMetrics?.totalRequests || 0) + 
              (apiMetrics?.sessionMetrics?.totalRequests || 0)
            )}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <NetworkIcon className="size-3" />
              {apiMetrics?.sessionMetrics?.errorRate || 0}% errors
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(apiMetrics?.sessionMetrics?.errorRate || 0) > 10 ? 'High error rate' : 'API performance good'} 
            {(apiMetrics?.sessionMetrics?.errorRate || 0) > 10 ? 
              <TrendingUpIcon className="size-4 text-red-500" /> : 
              <TrendingUpIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {formatNumber(apiMetrics?.sessionMetrics?.successfulRequests || 0)} successful, {formatNumber(apiMetrics?.sessionMetrics?.failedRequests || 0)} failed
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Network Usage</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatBytes((systemMetrics?.network.in || 0) * 1024)}/s
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <NetworkIcon className="size-3" />
              {systemMetrics?.network.connections || 0} conn
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(systemMetrics?.network.in || 0) > 1000 ? 'High network activity' : 'Network performance good'} 
            {(systemMetrics?.network.in || 0) > 1000 ? 
              <TrendingUpIcon className="size-4 text-orange-500" /> : 
              <TrendingUpIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            ↓{formatBytes((systemMetrics?.network.in || 0) * 1024)}/s in, ↑{formatBytes((systemMetrics?.network.out || 0) * 1024)}/s out
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
