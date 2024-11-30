import { useAtom } from "jotai";
import { streakAtom, lastStreakUpdateAtom } from "@/state";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import {
  RadialBarChart,
  PolarGrid,
  RadialBar,
  PolarRadiusAxis,
  Label,
} from "recharts";
import { Checkbox } from "@/components/ui/checkbox";

export default function Streak() {
  const [streak, setStreak] = useAtom(streakAtom);
  const [lastUpdate, setLastUpdate] = useAtom(lastStreakUpdateAtom);
  const [weeklyHistory, setWeeklyHistory] = useState<boolean[]>(
    Array(7).fill(false)
  );

  useEffect(() => {
    const today = new Date();
    const newHistory = Array(7).fill(false);

    for (let i = 0; i < Math.min(streak, 7); i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      if (date.toDateString() === lastUpdate || i > 0) {
        newHistory[i] = true;
      }
    }
    setWeeklyHistory(newHistory);
  }, [lastUpdate, streak]);

  const handleStreakIncrement = () => {
    const today = new Date().toDateString();

    if (lastUpdate !== today) {
      setStreak((streak) => streak + 1);
      setLastUpdate(today);
      toast({
        title: "Streak updated!",
        description: "You've updated your streak today!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "You've already updated your streak today!",
        description: "Come back tomorrow to continue your streak.",
      });
    }
  };

  const chartData = [
    {
      name: "streak",
      value: (streak / 365) * 100,
      fill: "var(--color-safari)",
    },
  ];
  const chartConfig = {
    value: {
      label: "Days",
    },
    streak: {
      label: "Streak",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 md:gap-12 py-4 md:py-8">
        {/* <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Daily Streak
          </h1>
          <Button
            variant="default"
            onClick={handleStreakIncrement}
            className="p-6 md:p-8 hover:scale-105 transition-transform"
          >
            <p className="text-3xl md:text-4xl font-bold">{streak}</p>
          </Button>
        </div> */}

        <Card className="flex flex-col" onClick={handleStreakIncrement}>
          <CardHeader className="items-center pb-0">
            <CardTitle>Daily Streak</CardTitle>
            <CardDescription>Keep up the streak!</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={(streak / 365) * 360}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar
                  dataKey="value"
                  background
                  cornerRadius={10}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {streak}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Days
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by {((streak / 365) * 100).toFixed(2)}% this month{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing streak for the last 365 days
            </div>
          </CardFooter>
        </Card>

        <div className="flex flex-col items-center gap-3 md:gap-4">
          <p className="text-lg md:text-xl font-semibold text-gray-700">
            Last 7 Days
          </p>
          <div className="flex gap-2 md:gap-3">
            {weeklyHistory.map((completed, index) => (
              <Checkbox
                key={index}
                className="h-8 w-8 md:h-12 md:w-12 rounded-lg"
                checked={completed}
                onCheckedChange={(checked) => {
                  const newHistory = [...weeklyHistory];
                  newHistory[index] = checked === true;
                  setWeeklyHistory(newHistory);
                }}
              />
            ))}
          </div>
          <div className="flex gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
            {weeklyHistory.map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - index);
              return (
                <div key={index} className="w-8 md:w-12 text-center">
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
