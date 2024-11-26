import { useAtom } from "jotai";
import { streakAtom, lastStreakUpdateAtom } from "@/state";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function Streak() {
  const [streak, setStreak] = useAtom(streakAtom);
  const [lastUpdate, setLastUpdate] = useAtom(lastStreakUpdateAtom);
  const [weeklyHistory, setWeeklyHistory] = useState<boolean[]>(Array(7).fill(false));

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

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 md:gap-12 py-4 md:py-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Daily Streak</h1>
          <Button 
            variant="default" 
            onClick={handleStreakIncrement}
            className="p-6 md:p-8 hover:scale-105 transition-transform"
          >
            <p className="text-3xl md:text-4xl font-bold">{streak}</p>
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3 md:gap-4">
          <p className="text-lg md:text-xl font-semibold text-gray-700">Last 7 Days</p>
          <div className="flex gap-2 md:gap-3">
            {weeklyHistory.map((completed, index) => (
              <div
                key={index}
                className={`w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center shadow-sm transition-colors ${
                  completed ? 'bg-green-500 text-white' : 'bg-white text-gray-400'
                }`}
              >
                {completed ? '✓' : ''}
              </div>
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
