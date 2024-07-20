import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Chart = ({ statsData }) => {
  // Receving statsData from backend and formatting it in object format
  const statsInfo = statsData?.map((stats) => {
    return {
      month: months[stats?._id - 1],
      total: Number(stats?.sales.toFixed(2)),
    };
  });

  // Gives current month number
  let currentMonth = new Date().getMonth();

  // Calculating last six months sales
  const chartData = [...Array(6)]
    .map(() => {
      const presentMonth = currentMonth;

      // Checking if current month stats data is present in statsInfo
      const doesDataExist = statsInfo.find(
        (data) => data?.month === months[presentMonth]
      );

      // Decrease the current month to calculate last six months stats
      currentMonth = (currentMonth - 1 + 12) % 12;

      // Adding month name and total: 0, as there are no sales done in this particular month
      if (!doesDataExist) {
        return { month: months[presentMonth], total: 0 };
      } else {
        // As statsData exist for this month in backend, we are simply returning
        return { ...doesDataExist };
      }
    })
    .reverse();

  // Displaying last 6 months sales in form of chart
  return (
    <ResponsiveContainer width="100%" height="100%" aspect={3 / 1.08}>
      <AreaChart
        width={730}
        height={250}
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        className="font-inter text-sm"
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          wrapperStyle={{
            outline: "none",
          }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
