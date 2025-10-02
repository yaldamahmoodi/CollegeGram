"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { useHealthCheck } from "@/hooks/useHealthCheck"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const fallbackChartData = [
  { date: "2024-04-01", successful: 222, failed: 15 },
  { date: "2024-04-02", successful: 97, failed: 8 },
  { date: "2024-04-03", successful: 167, failed: 12 },
  { date: "2024-04-04", successful: 242, failed: 18 },
  { date: "2024-04-05", successful: 373, failed: 25 },
  { date: "2024-04-06", successful: 301, failed: 22 },
  { date: "2024-04-07", successful: 245, failed: 18 },
  { date: "2024-04-08", successful: 409, failed: 28 },
  { date: "2024-04-09", successful: 59, failed: 6 },
  { date: "2024-04-10", successful: 261, failed: 19 },
  { date: "2024-04-11", successful: 327, failed: 24 },
  { date: "2024-04-12", successful: 292, failed: 21 },
  { date: "2024-04-13", successful: 342, failed: 26 },
  { date: "2024-04-14", successful: 137, failed: 11 },
  { date: "2024-04-15", successful: 120, failed: 9 },
  { date: "2024-04-16", successful: 138, failed: 10 },
  { date: "2024-04-17", successful: 446, failed: 32 },
  { date: "2024-04-18", successful: 364, failed: 27 },
  { date: "2024-04-19", successful: 243, failed: 18 },
  { date: "2024-04-20", successful: 89, failed: 7 },
  { date: "2024-04-21", successful: 137, failed: 10 },
  { date: "2024-04-22", successful: 224, failed: 16 },
  { date: "2024-04-23", successful: 138, failed: 11 },
  { date: "2024-04-24", successful: 387, failed: 28 },
  { date: "2024-04-25", successful: 215, failed: 16 },
  { date: "2024-04-26", successful: 75, failed: 6 },
  { date: "2024-04-27", successful: 383, failed: 29 },
  { date: "2024-04-28", successful: 122, failed: 9 },
  { date: "2024-04-29", successful: 315, failed: 23 },
  { date: "2024-04-30", successful: 454, failed: 34 },
  { date: "2024-05-01", successful: 165, failed: 12 },
  { date: "2024-05-02", successful: 293, failed: 22 },
  { date: "2024-05-03", successful: 247, failed: 18 },
  { date: "2024-05-04", successful: 385, failed: 29 },
  { date: "2024-05-05", successful: 481, failed: 36 },
  { date: "2024-05-06", successful: 498, failed: 37 },
  { date: "2024-05-07", successful: 388, failed: 29 },
  { date: "2024-05-08", successful: 149, failed: 11 },
  { date: "2024-05-09", successful: 227, failed: 17 },
  { date: "2024-05-10", successful: 293, failed: 22 },
  { date: "2024-05-11", successful: 335, failed: 25 },
  { date: "2024-05-12", successful: 197, failed: 15 },
  { date: "2024-05-13", successful: 197, failed: 15 },
  { date: "2024-05-14", successful: 448, failed: 34 },
  { date: "2024-05-15", successful: 473, failed: 35 },
  { date: "2024-05-16", successful: 338, failed: 25 },
  { date: "2024-05-17", successful: 499, failed: 37 },
  { date: "2024-05-18", successful: 315, failed: 24 },
  { date: "2024-05-19", successful: 235, failed: 18 },
  { date: "2024-05-20", successful: 177, failed: 13 },
  { date: "2024-05-21", successful: 82, failed: 6 },
  { date: "2024-05-22", successful: 81, failed: 6 },
  { date: "2024-05-23", successful: 252, failed: 19 },
  { date: "2024-05-24", successful: 294, failed: 22 },
  { date: "2024-05-25", successful: 201, failed: 15 },
  { date: "2024-05-26", successful: 213, failed: 16 },
  { date: "2024-05-27", successful: 420, failed: 31 },
  { date: "2024-05-28", successful: 233, failed: 17 },
  { date: "2024-05-29", successful: 78, failed: 6 },
  { date: "2024-05-30", successful: 340, failed: 25 },
  { date: "2024-05-31", successful: 178, failed: 13 },
  { date: "2024-06-01", successful: 178, failed: 13 },
  { date: "2024-06-02", successful: 470, failed: 35 },
  { date: "2024-06-03", successful: 103, failed: 8 },
  { date: "2024-06-04", successful: 439, failed: 33 },
  { date: "2024-06-05", successful: 88, failed: 7 },
  { date: "2024-06-06", successful: 294, failed: 22 },
  { date: "2024-06-07", successful: 323, failed: 24 },
  { date: "2024-06-08", successful: 385, failed: 29 },
  { date: "2024-06-09", successful: 438, failed: 33 },
  { date: "2024-06-10", successful: 155, failed: 12 },
  { date: "2024-06-11", successful: 92, failed: 7 },
  { date: "2024-06-12", successful: 492, failed: 37 },
  { date: "2024-06-13", successful: 81, failed: 6 },
  { date: "2024-06-14", successful: 426, failed: 32 },
  { date: "2024-06-15", successful: 307, failed: 23 },
  { date: "2024-06-16", successful: 371, failed: 28 },
  { date: "2024-06-17", successful: 475, failed: 36 },
  { date: "2024-06-18", successful: 107, failed: 8 },
  { date: "2024-06-19", successful: 341, failed: 26 },
  { date: "2024-06-20", successful: 408, failed: 31 },
  { date: "2024-06-21", successful: 169, failed: 13 },
  { date: "2024-06-22", successful: 317, failed: 24 },
  { date: "2024-06-23", successful: 480, failed: 36 },
  { date: "2024-06-24", successful: 132, failed: 10 },
  { date: "2024-06-25", successful: 141, failed: 11 },
  { date: "2024-06-26", successful: 434, failed: 33 },
  { date: "2024-06-27", successful: 448, failed: 34 },
  { date: "2024-06-28", successful: 149, failed: 11 },
  { date: "2024-06-29", successful: 103, failed: 8 },
  { date: "2024-06-30", successful: 446, failed: 34 },
]

const chartConfig = {
  apiCalls: {
    label: "API Calls",
  },
  successful: {
    label: "Successful Calls",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed Calls",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const { apiMetrics, loading, error } = useHealthCheck(30000);
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // Generate chart data using REAL API metrics data
  const generateChartData = React.useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    
    // Priority 1: Use historical data from database if available
    if (apiMetrics?.historicalMetrics?.dailyData && apiMetrics.historicalMetrics.dailyData.length > 0) {
      const historicalData = apiMetrics.historicalMetrics.dailyData
      
      // Sort data by date to ensure chronological order
      const sortedData = [...historicalData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      // If we have enough historical data, use it directly
      if (sortedData.length >= days) {
        return sortedData.slice(-days)
      }
      
      // If we have some historical data, extend it with today's session data
      const data = [...sortedData]
      const today = new Date().toISOString().split('T')[0]
      
      // Add today's session data if not already included
      const hasToday = sortedData.some(item => item.date === today)
      if (!hasToday && apiMetrics.sessionMetrics) {
        data.push({
          date: today,
          successful: apiMetrics.sessionMetrics.successfulRequests,
          failed: apiMetrics.sessionMetrics.failedRequests
        })
      }
      
      // Return the real data we have (don't pad with fake data)
      return data.slice(-days)
    }
    
    // Priority 2: Use session metrics to create today's data point
    if (apiMetrics?.sessionMetrics) {
      const today = new Date().toISOString().split('T')[0]
      return [{
        date: today,
        successful: apiMetrics.sessionMetrics.successfulRequests,
        failed: apiMetrics.sessionMetrics.failedRequests
      }]
    }
    
    // Priority 3: Only use fallback if no real data is available
    return fallbackChartData.slice(-Math.min(days, fallbackChartData.length))
  }, [timeRange, apiMetrics])

  const filteredData = generateChartData

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>Total API Calls</CardTitle>
          <CardDescription>Loading API metrics...</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Total API Calls {
          apiMetrics?.historicalMetrics?.dailyData?.length > 0 ? "(Real Historical Data)" : 
          apiMetrics?.sessionMetrics ? "(Real Live Data)" : 
          "(Demo Data)"
        }</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            {error ? "API metrics unavailable - showing demo data" : 
             apiMetrics?.historicalMetrics?.dailyData?.length > 0 ? 
             `Real database data: ${apiMetrics.historicalMetrics.totalRequests} total requests from ${apiMetrics.historicalMetrics.dailyData.length} days` :
             apiMetrics?.sessionMetrics ?
             `Live session data: ${apiMetrics.sessionMetrics.totalRequests} requests (${apiMetrics.sessionMetrics.successfulRequests} successful, ${apiMetrics.sessionMetrics.failedRequests} failed)` :
             "Demo data - API not connected"}
          </span>
          <span className="@[540px]/card:hidden">
            {error ? "Demo" : 
             apiMetrics?.historicalMetrics?.dailyData?.length > 0 ? "Real DB Data" : 
             apiMetrics?.sessionMetrics ? "Live Data" : "Demo"}
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSuccessful" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-successful)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-successful)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-failed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-failed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="failed"
              type="natural"
              fill="url(#fillFailed)"
              stroke="var(--color-failed)"
              stackId="a"
            />
            <Area
              dataKey="successful"
              type="natural"
              fill="url(#fillSuccessful)"
              stroke="var(--color-successful)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
