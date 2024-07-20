import MetaData from "../../MetaData";
import DetailCard from "./DetailCard";
import { detailCardCategories } from "../../../utils/dashboard/detailCardCategories";
import { motion } from "framer-motion";
import Chart from "./Chart";
import LatestOrders from "./LatestOrders";
import TotalRevenue from "./TotalRevenue";
import Layout from "../Layout";
import { useGetStatsQuery } from "../../../redux/features/stats/statsApiSlice";
import Loader from "../../UI/Loader";
import ErrorBoundaryComponent from "../../ErrorBoundary/ErrorBoundaryComponent";
import ErrorUI from "../../UI/ErrorUI";

const Dashboard = () => {
  // Fetching product statsData
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: statsError,
  } = useGetStatsQuery();

  // Displaying Loading screen while productStatsData is being fetched
  if (isStatsLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <Layout>
      <div className="space-y-8 h-full overflow-y-scroll">
        <MetaData title="Dashboard" />

        {/* Showing errMsg, if an error occured while fetching revenue stats */}
        {statsError && (
          <ErrorUI message="Unable to fetch revenue stats due to some error!" />
        )}

        {!statsError && (
          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4">
            {/* Displaying Products, Users, Orders, Revenue detail cards  */}
            {detailCardCategories.map((category, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
              >
                <DetailCard
                  i={i}
                  {...category}
                  statsData={{
                    title: category?.title,
                    value: statsData?.stats[category?.title],
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {!statsError && (
          <div className="grid md:grid-cols-6 sm:grid-cols-1 gap-4">
            {/* Displaying today and last week sales of ecommerce */}
            <TotalRevenue statsData={statsData?.stats} />

            {/* Displaying last 6 months sales of ecommerce in form of chart */}
            <div className="p-3 drop-shadow-xl rounded-xl bg-neutral-50 md:col-span-4 w-full space-y-3 h-auto">
              <p className="font-semibold font-inter text-neutral-500">
                Last 6 Months (₹ Revenue)
              </p>
              <div className="h-full">
                <Chart statsData={statsData?.stats?.pastSixMonthsSales} />
              </div>
            </div>
          </div>
        )}

        {/* Displaying 10 LatestOrders of the customers */}
        <div className="shadow-xl rounded-xl bg-neutral-50">
          <ErrorBoundaryComponent errorMessage="Sorry, unable to show customer orders due to some error, please try again later!">
            <LatestOrders />
          </ErrorBoundaryComponent>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
