export default async function Home() {
  // Import the data from the JSON file
  const gridData = require('../data/github_grid_data.json');

  // Define colors for each contribution level (0-4)
  const levelColors = {
    0: '#ebedf0', // No contributions 
    1: '#9be9a8', // Light green
    2: '#40c463', // Medium green  
    3: '#30a14e', // Darker green
    4: '#216e39'  // Darkest green
  };

  // Group data by months (approximately 4 weeks each)
  const monthlyData = Array.from({ length: 12 }, (_, monthIndex) => {
    const startDay = monthIndex * 30; // Approximate days per month
    return gridData.slice(startDay, startDay + 30);
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GitHub Contribution Grid</h1>
      
      <div className="flex gap-4"> {/* Container for all months */}
        {monthlyData.map((month, monthIndex) => (
          <div key={monthIndex} className="grid grid-cols-7 gap-1"> {/* 7 days per week */}
            {month.map((day, dayIndex) => (
              <div 
                key={`${monthIndex}-${dayIndex}`}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: levelColors[day.metadata.level],
                  cursor: 'pointer'
                }}
                title={`Date: ${day.date}
Contributions: ${day.value}
Note: ${day.metadata.note}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-2 mt-4">
        <span>Less</span>
        {Object.values(levelColors).map((color, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
