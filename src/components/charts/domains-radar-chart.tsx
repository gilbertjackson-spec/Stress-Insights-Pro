"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"
import type { DomainAnalysis } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChartContainer, ChartTooltipContent } from "../ui/chart"

interface DomainsRadarChartProps {
  data: DomainAnalysis[]
}

export default function DomainsRadarChart({ data }: DomainsRadarChartProps) {
  const chartData = data.map(d => ({
    name: d.domain_name,
    score: parseFloat(d.domain_score.toFixed(2)),
    fullMark: 5,
  }));
  
  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="h-[350px] w-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer>
                <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <Radar
                        name="Score"
                        dataKey="score"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.6}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </ChartContainer>
    </div>
  )
}
