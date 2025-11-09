import "./featuredInfo.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function FeaturedInfo() {
  const [data, setData] = useState({ income: [], sales: [] });
  const [percentages, setPercentages] = useState({ income: 0, sales: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, salesRes] = await Promise.all([
          userRequest.get("orders/income"),
          userRequest.get("orders/sales")
        ]);

        const incomeData = incomeRes.data;
        const salesData = salesRes.data;

        setData({ income: incomeData, sales: salesData });

        // Calculate percentages
        const calcPercentage = (data, key) => {
          if (data.length < 2) return 0;
          const [prev, current] = data;
          const prevVal = prev[key] || 0;
          const currentVal = current[key] || 0;
          return prevVal > 0 ? ((currentVal - prevVal) / prevVal) * 100 : (currentVal > 0 ? 100 : 0);
        };

        setPercentages({
          income: calcPercentage(incomeData, 'total'),
          sales: calcPercentage(salesData, 'count')
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="featured"><div className="featuredItem"><span className="featuredTitle">Loading...</span></div></div>;
  if (error) return <div className="featured"><div className="featuredItem"><span className="featuredTitle">Error: {error}</span></div></div>;

  const currentIncome = data.income[data.income.length - 1];
  const currentSales = data.sales[data.sales.length - 1];

  const PercentageDisplay = ({ value }) => (
    <span className="featuredMoneyRate">
      %{Math.floor(Math.abs(value))}
      {value < 0 ? 
        <ArrowDownwardIcon className="featuredIcon negative" /> : 
        <ArrowUpwardIcon className="featuredIcon" />
      }
    </span>
  );

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">₹{currentIncome?.total || 0}</span>
          <PercentageDisplay value={percentages.income} />
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{currentSales?.count || 0} Orders</span>
          <PercentageDisplay value={percentages.sales} />
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}