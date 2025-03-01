import { Link } from "react-router-dom";
import { AppData } from "../types";
import StatCard from "../components/StatCard";
import AlertCard from "../components/AlertCard";
import {
  ArrowUpRight,
  Egg,
  Users,
  ChartPie,
  CircleDollarSign,
} from "lucide-react";
import {
  formatCurrency,
  calculateEggProductionRate,
  calculateAge,
} from "../utils";

interface DashboardProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const Dashboard = ({ data, setData }: DashboardProps) => {
  // Calculate total birds
  const totalBirds = data.flocks.reduce((sum, flock) => sum + flock.count, 0);

  // Calculate daily egg production (last record)
  const lastEggRecord = data.eggProduction[0];
  const dailyEggs = lastEggRecord ? lastEggRecord.quantity : 0;

  // Calculate egg production rate
  const layerFlocks = data.flocks.filter((flock) => flock.birdType === "Layer");
  const totalLayers = layerFlocks.reduce((sum, flock) => sum + flock.count, 0);
  const productionRate =
    totalLayers > 0 ? calculateEggProductionRate(dailyEggs, totalLayers) : "0%";

  // Calculate monthly revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentSales = data.salesRecords.filter(
    (sale) => new Date(sale.date) >= thirtyDaysAgo
  );

  const monthlyRevenue = recentSales.reduce(
    (sum, sale) => sum + sale.quantity * sale.unitPrice,
    0
  );

  const markAlertAsRead = (alertId: string) => {
    setData((prev) => ({
      ...prev,
      healthAlerts: prev.healthAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ),
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/flocks"
          className="text-sm flex items-center text-blue-600 hover:text-blue-800"
        >
          Manage flocks
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Birds"
          value={totalBirds}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Egg Production"
          value={dailyEggs}
          icon={<Egg className="h-6 w-6 text-blue-600" />}
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatCard
          title="Production Rate"
          value={productionRate}
          icon={<ChartPie className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(monthlyRevenue)}
          icon={<CircleDollarSign className="h-6 w-6 text-blue-600" />}
          trend={{ value: 5.1, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Flock Overview</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Flock Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Count
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Age (weeks)
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Health
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.flocks.map((flock) => (
                    <tr key={flock.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <Link
                          to="/flocks"
                          className="text-blue-600 hover:underline"
                        >
                          {flock.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2">{flock.birdType}</td>
                      <td className="px-4 py-2">{flock.count}</td>
                      <td className="px-4 py-2">{flock.ageWeeks}</td>
                      <td className="px-4 py-2">
                        <Link to="/health" className="no-underline">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium
                            ${
                              flock.healthStatus === "Excellent"
                                ? "bg-green-100 text-green-800"
                                : flock.healthStatus === "Good"
                                ? "bg-blue-100 text-blue-800"
                                : flock.healthStatus === "Fair"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {flock.healthStatus}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {calculateAge(flock.lastUpdated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Health Alerts</h2>
            {data.healthAlerts.length > 0 ? (
              <div>
                {data.healthAlerts
                  .filter((alert) => !alert.isRead)
                  .slice(0, 3)
                  .map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onMarkAsRead={markAlertAsRead}
                    />
                  ))}
                {data.healthAlerts.filter((alert) => !alert.isRead).length >
                  3 && (
                  <div className="text-center mt-2">
                    <Link
                      to="/health"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View{" "}
                      {data.healthAlerts.filter((alert) => !alert.isRead)
                        .length - 3}{" "}
                      more alerts
                    </Link>
                  </div>
                )}
                {data.healthAlerts.filter((alert) => !alert.isRead).length ===
                  0 && (
                  <p className="text-gray-500 text-center py-4">
                    No unread alerts at this time
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No alerts at this time
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 mt-6">
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/feed"
                className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center text-sm font-medium text-blue-700"
              >
                Add Feed Record
              </Link>
              <Link
                to="/production"
                className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition text-center text-sm font-medium text-green-700"
              >
                Record Eggs
              </Link>
              <Link
                to="/mortality"
                className="p-3 bg-red-50 rounded-lg hover:bg-red-100 transition text-center text-sm font-medium text-red-700"
              >
                Log Mortality
              </Link>
              <Link
                to="/sales"
                className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center text-sm font-medium text-purple-700"
              >
                Add Sale
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
