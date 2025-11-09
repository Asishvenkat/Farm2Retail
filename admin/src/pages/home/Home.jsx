import "./home.css";
import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function Home() {

    const [userStats, setUserStats] = useState([]);

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

useEffect(() => {
  const getStats = async () => {
    try {
      const res = await userRequest.get("/users/stats");
      const sortedStats = res.data
        .sort((a, b) => a._id - b._id) // Sort by month number
        .map((item) => ({
          name: MONTHS[item._id - 1], // Convert month number to name
          "Active User": item.total,
        }));

      setUserStats(sortedStats); // Set once
    } catch (err) {
      console.error("Error fetching user stats:", err);
    }
  };
  getStats();
}, [MONTHS]);


  
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart 
        data={userStats} 
        title="User Analytics" 
        grid 
        dataKey="Active User" 
      />
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
}
