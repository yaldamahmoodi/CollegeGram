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

// Generate fallback data with 6-hour intervals for the last 7 days
const generateFallbackData = (): Array<{
  date: string;
  dateLabel: string;
  timeLabel: string;
  displayLabel: string;
  successful: number;
  failed: number;
}> => {
  const data: Array<{
    date: string;
    dateLabel: string;
    timeLabel: string;
    displayLabel: string;
    successful: number;
    failed: number;
  }> = []
  const now = new Date()
  
  // Generate data for the last 7 days, 4 intervals per day (6-hour intervals)
  for (let day = 6; day >= 0; day--) {
    const currentDay = new Date(now)
    currentDay.setDate(now.getDate() - day)
    
    // 4 intervals per day: 00:00, 06:00, 12:00, 18:00
    const intervals = [
      { hour: 0, label: "00:00" },
      { hour: 6, label: "06:00" },
      { hour: 12, label: "12:00" },
      { hour: 18, label: "18:00" }
    ]
    
    intervals.forEach(interval => {
      const dateTime = new Date(currentDay)
      dateTime.setHours(interval.hour, 0, 0, 0)
      
      data.push({
        date: dateTime.toISOString(),
        dateLabel: dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timeLabel: interval.label,
        displayLabel: `${dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${interval.label}`,
        successful: Math.floor(Math.random() * 200) + 50,
        failed: Math.floor(Math.random() * 20) + 2
      })
    })
  }
  
  return data
}

const fallbackChartData = generateFallbackData()

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
  const [timeRange, setTimeRange] = React.useState("7d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // Generate chart data with 6-hour intervals
  const generateChartData = React.useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const intervalsPerDay = 4 // 6-hour intervals
    const totalIntervals = days * intervalsPerDay
    
    // Priority 1: Use historical data from database if available
    if (apiMetrics?.historicalMetrics?.dailyData && apiMetrics.historicalMetrics.dailyData.length > 0) {
      const historicalData = apiMetrics.historicalMetrics.dailyData
      
      // Sort data by date to ensure chronological order
      const sortedData = [...historicalData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      // Convert daily data to 6-hour intervals
      const intervalData: Array<{
        date: string;
        dateLabel: string;
        timeLabel: string;
        displayLabel: string;
        successful: number;
        failed: number;
      }> = []
      sortedData.forEach(dailyItem => {
        const dayDate = new Date(dailyItem.date)
        const intervals = [
          { hour: 0, label: "00:00" },
          { hour: 6, label: "06:00" },
          { hour: 12, label: "12:00" },
          { hour: 18, label: "18:00" }
        ]
        
        intervals.forEach(interval => {
          const dateTime = new Date(dayDate)
          dateTime.setHours(interval.hour, 0, 0, 0)
          
          intervalData.push({
            date: dateTime.toISOString(),
            dateLabel: dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            timeLabel: interval.label,
            displayLabel: `${dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${interval.label}`,
            successful: Math.floor(dailyItem.successful / intervals.length),
            failed: Math.floor(dailyItem.failed / intervals.length)
          })
        })
      })
      
      // Return the last N intervals based on time range
      return intervalData.slice(-totalIntervals)
    }
    
    // Priority 2: Use session metrics to create current interval data
    if (apiMetrics?.sessionMetrics) {
      const now = new Date()
      const currentInterval = Math.floor(now.getHours() / 6) * 6 // Round to nearest 6-hour interval
      
      const dateTime = new Date(now)
      dateTime.setHours(currentInterval, 0, 0, 0)
      
      return [{
        date: dateTime.toISOString(),
        dateLabel: dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timeLabel: `${currentInterval.toString().padStart(2, '0')}:00`,
        displayLabel: `${dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${currentInterval.toString().padStart(2, '0')}:00`,
        successful: apiMetrics.sessionMetrics.successfulRequests,
        failed: apiMetrics.sessionMetrics.failedRequests
      }]
    }
    
    // Priority 3: Use fallback data with 6-hour intervals
    return fallbackChartData.slice(-totalIntervals)
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
        <CardTitle>API Calls (6-Hour Intervals) {
          (apiMetrics?.historicalMetrics?.dailyData?.length ?? 0) > 0 ? "(Real Historical Data)" : 
          apiMetrics?.sessionMetrics ? "(Real Live Data)" : 
          "(Demo Data)"
        }</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            {error ? "API metrics unavailable - showing demo data" : 
             (apiMetrics?.historicalMetrics?.dailyData?.length ?? 0) > 0 ? 
             `Real database data: ${apiMetrics?.historicalMetrics?.totalRequests ?? 0} total requests from ${apiMetrics?.historicalMetrics?.dailyData?.length ?? 0} days (4 intervals per day)` :
             apiMetrics?.sessionMetrics ?
             `Live session data: ${apiMetrics.sessionMetrics.totalRequests} requests (${apiMetrics.sessionMetrics.successfulRequests} successful, ${apiMetrics.sessionMetrics.failedRequests} failed)` :
             "Demo data - API not connected (6-hour intervals: 00:00, 06:00, 12:00, 18:00)"}
          </span>
          <span className="@[540px]/card:hidden">
            {error ? "Demo" : 
             (apiMetrics?.historicalMetrics?.dailyData?.length ?? 0) > 0 ? "Real DB Data" : 
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
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
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
              dataKey="displayLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              angle={-45}
              textAnchor="end"
              height={60}
              tickFormatter={(value) => {
                // Show only every 4th tick to avoid overcrowding (once per day)
                const parts = value.split(' ')
                return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : value
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    // value is now displayLabel like "Dec 15 18:00"
                    return value
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
