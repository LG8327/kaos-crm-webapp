"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
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

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", leads: 32, accounts: 18 },
  { date: "2024-04-02", leads: 28, accounts: 22 },
  { date: "2024-04-03", leads: 45, accounts: 19 },
  { date: "2024-04-04", leads: 38, accounts: 25 },
  { date: "2024-04-05", leads: 52, accounts: 31 },
  { date: "2024-04-06", leads: 41, accounts: 28 },
  { date: "2024-04-07", leads: 33, accounts: 20 },
  { date: "2024-04-08", leads: 58, accounts: 34 },
  { date: "2024-04-09", leads: 29, accounts: 16 },
  { date: "2024-04-10", leads: 47, accounts: 26 },
  { date: "2024-04-11", leads: 43, accounts: 29 },
  { date: "2024-04-12", leads: 36, accounts: 23 },
  { date: "2024-04-13", leads: 51, accounts: 32 },
  { date: "2024-04-14", leads: 39, accounts: 21 },
  { date: "2024-04-15", leads: 44, accounts: 27 },
  { date: "2024-04-16", leads: 35, accounts: 19 },
  { date: "2024-04-17", leads: 49, accounts: 30 },
  { date: "2024-04-18", leads: 56, accounts: 35 },
  { date: "2024-04-19", leads: 42, accounts: 24 },
  { date: "2024-04-20", leads: 31, accounts: 17 },
  { date: "2024-04-21", leads: 37, accounts: 20 },
  { date: "2024-04-22", leads: 46, accounts: 26 },
  { date: "2024-04-23", leads: 40, accounts: 23 },
  { date: "2024-04-24", leads: 54, accounts: 33 },
  { date: "2024-04-25", leads: 48, accounts: 29 },
  { date: "2024-04-26", leads: 35, accounts: 21 },
  { date: "2024-04-27", leads: 53, accounts: 34 },
  { date: "2024-04-28", leads: 41, accounts: 25 },
  { date: "2024-04-29", leads: 47, accounts: 28 },
  { date: "2024-04-30", leads: 59, accounts: 36 },
  { date: "2024-05-01", leads: 44, accounts: 26 },
  { date: "2024-05-02", leads: 50, accounts: 31 },
  { date: "2024-05-03", leads: 38, accounts: 22 },
  { date: "2024-05-04", leads: 55, accounts: 33 },
  { date: "2024-05-05", leads: 61, accounts: 37 },
  { date: "2024-05-06", leads: 63, accounts: 39 },
  { date: "2024-05-07", leads: 52, accounts: 30 },
  { date: "2024-05-08", leads: 42, accounts: 24 },
  { date: "2024-05-09", leads: 46, accounts: 27 },
  { date: "2024-05-10", leads: 49, accounts: 29 },
  { date: "2024-05-11", leads: 51, accounts: 31 },
  { date: "2024-05-12", leads: 43, accounts: 25 },
  { date: "2024-05-13", leads: 39, accounts: 23 },
  { date: "2024-05-14", leads: 57, accounts: 35 },
  { date: "2024-05-15", leads: 60, accounts: 36 },
  { date: "2024-05-16", leads: 48, accounts: 30 },
  { date: "2024-05-17", leads: 62, accounts: 38 },
  { date: "2024-05-18", leads: 54, accounts: 32 },
  { date: "2024-05-19", leads: 41, accounts: 24 },
  { date: "2024-05-20", leads: 45, accounts: 26 },
  { date: "2024-05-21", leads: 33, accounts: 19 },
  { date: "2024-05-22", leads: 32, accounts: 18 },
  { date: "2024-05-23", leads: 47, accounts: 28 },
  { date: "2024-05-24", leads: 50, accounts: 30 },
  { date: "2024-05-25", leads: 44, accounts: 26 },
  { date: "2024-05-26", leads: 40, accounts: 23 },
  { date: "2024-05-27", leads: 56, accounts: 34 },
  { date: "2024-05-28", leads: 43, accounts: 25 },
  { date: "2024-05-29", leads: 34, accounts: 20 },
  { date: "2024-05-30", leads: 51, accounts: 31 },
  { date: "2024-05-31", leads: 42, accounts: 24 },
  { date: "2024-06-01", leads: 38, accounts: 22 },
  { date: "2024-06-02", leads: 47, accounts: 28 },
  { date: "2024-06-03", leads: 33, accounts: 19 },
  { date: "2024-06-04", leads: 52, accounts: 32 },
  { date: "2024-06-05", leads: 29, accounts: 17 },
  { date: "2024-06-06", leads: 41, accounts: 24 },
  { date: "2024-06-07", leads: 45, accounts: 27 },
  { date: "2024-06-08", leads: 49, accounts: 30 },
  { date: "2024-06-09", leads: 54, accounts: 33 },
  { date: "2024-06-10", leads: 36, accounts: 21 },
  { date: "2024-06-11", leads: 31, accounts: 18 },
  { date: "2024-06-12", leads: 58, accounts: 35 },
  { date: "2024-06-13", leads: 28, accounts: 16 },
  { date: "2024-06-14", leads: 48, accounts: 29 },
  { date: "2024-06-15", leads: 43, accounts: 26 },
  { date: "2024-06-16", leads: 46, accounts: 28 },
  { date: "2024-06-17", leads: 55, accounts: 34 },
  { date: "2024-06-18", leads: 32, accounts: 19 },
  { date: "2024-06-19", leads: 42, accounts: 25 },
  { date: "2024-06-20", leads: 50, accounts: 31 },
  { date: "2024-06-21", leads: 37, accounts: 22 },
  { date: "2024-06-22", leads: 44, accounts: 27 },
  { date: "2024-06-23", leads: 56, accounts: 35 },
  { date: "2024-06-24", leads: 35, accounts: 20 },
  { date: "2024-06-25", leads: 39, accounts: 23 },
  { date: "2024-06-26", leads: 53, accounts: 32 },
  { date: "2024-06-27", leads: 57, accounts: 36 },
  { date: "2024-06-28", leads: 40, accounts: 24 },
  { date: "2024-06-29", leads: 34, accounts: 20 },
  { date: "2024-06-30", leads: 51, accounts: 31 },
]

const chartConfig = {
  leads: {
    label: "New Leads",
    color: "hsl(var(--chart-1))",
  },
  accounts: {
    label: "Active Accounts",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Lead Generation Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            New leads and active accounts for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Lead & Account Overview</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
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
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-leads)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-leads)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAccounts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-accounts)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-accounts)"
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
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="accounts"
              type="natural"
              fill="url(#fillAccounts)"
              stroke="var(--color-accounts)"
              stackId="a"
            />
            <Area
              dataKey="leads"
              type="natural"
              fill="url(#fillLeads)"
              stroke="var(--color-leads)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
