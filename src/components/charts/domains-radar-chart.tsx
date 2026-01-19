"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import type { DomainAnalysis } from "@/lib/types"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

interface DomainsRadarChartProps {
  data: DomainAnalysis[]
}

export default function DomainsRadarChart({ data }: DomainsRadarChartProps) {
  const chartData = data.map(d => ({
    name: d.domain_name,
    score: parseFloat(d.domain_score.toFixed(2)),
    benchmark: parseFloat(d.benchmark_private_sector.toFixed(2)),
    fullMark: 5,
  }));

  const chartConfig = {
    score: {
      label: "Empresa",
      color: "hsl(var(--chart-1))",
    },
    benchmark: {
      label: "Benchmark (Setor Privado)",
      color: "hsl(var(--muted-foreground))",
    }
  };

  return (
    <div className="h-[350px] w-full flex justify-center">
      <ChartContainer config={chartConfig} className="w-full max-w-[450px] h-full">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <PolarGrid />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
          <Radar
            name="Empresa"
            dataKey="score"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.6}
          />
          <Radar
            name="Benchmark"
            dataKey="benchmark"
            stroke="hsl(var(--muted-foreground))"
            fill="hsl(var(--muted-foreground))"
            fillOpacity={0.1}
            strokeDasharray="4 4"
          />
        </RadarChart>
      </ChartContainer>
    </div>
  )
}
