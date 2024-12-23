const MonthLabels = ({ monthLabels, className }: { 
  monthLabels: Array<{ month: string; weekIndex: number }>;
  className?: string;
}) => (
  <div className={`relative h-5 ${className ?? ''}`}>
    {monthLabels.map(({ month, weekIndex }) => (
      <div 
        key={month}
        className="absolute text-sm text-gray-500"
        style={{ 
          left: `${weekIndex * 16}px` // Removed the +24px offset
        }}
      >
        {month}
      </div>
    ))}
  </div>
);

const ContributionSquare = ({ day, levelColors, className }: { 
  day: { date: string; value: number; metadata: { level: number } };
  levelColors: Record<number, string>;
  className?: string;
}) => (
  <div
    key={day.date}
    className={`h-3 w-3 rounded-sm ${className ?? ''}`}
    style={{
      backgroundColor: levelColors[day.metadata.level],
    }}
    title={`${day.date}: ${day.value} contributions`}
  />
);

const ContributionGrid = ({ weeks, levelColors, className }: {
  weeks: Array<Array<{ date: string; value: number; metadata: { level: number } }>>;
  levelColors: Record<number, string>;
  className?: string;
}) => (
  <div className={`${className ?? ''}`}>
    {weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="flex flex-col gap-1">
        {week.map((day) => (
          <ContributionSquare key={day.date} day={day} levelColors={levelColors} />
        ))}
      </div>
    ))}
  </div>
);

export default async function Home() {
  // Import the data from the JSON file, 365 records for the 365 days.
  const gridData = await import('../data/github_grid_data.json').then(m => m.default);

  // Define colors for each contribution level (0-4)
  const levelColors = {
    0: '#ebedf0', // No contributions 
    1: '#9be9a8', // Light green
    2: '#40c463', // Medium green  
    3: '#30a14e', // Darker green
    4: '#216e39'  // Darkest green
  };

  // Group data by weeks
  const weeks: Array<typeof gridData> = [];
  let currentWeek: typeof gridData = [];
  
  gridData.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Add remaining days to last week
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Get months with their starting week index
  const monthLabels = weeks.reduce((acc, week, weekIndex) => {
    const firstDay = week[0];
    if (!firstDay) return acc;
    
    const firstDayOfWeek = new Date(firstDay.date);
    const month = firstDayOfWeek.toLocaleString('default', { month: 'short' });
    
    // If this is the first week of a new month, record it
    if (!acc.find(m => m.month === month)) {
      acc.push({ month, weekIndex });
    }
    return acc;
  }, [] as Array<{ month: string; weekIndex: number }>);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        <MonthLabels monthLabels={monthLabels} />
        <div className="flex">
          <ContributionGrid 
            weeks={weeks} 
            levelColors={levelColors}
            className="flex gap-1" 
          />
        </div>
      </div>
    </div>
  );
}
