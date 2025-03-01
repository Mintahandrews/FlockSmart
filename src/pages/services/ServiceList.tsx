import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useServices } from "../../contexts/ServiceContext";
import ServiceCard from "../../components/services/ServiceCard";
import {
  Clock,
  DollarSign,
  Filter,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

const ServiceList = () => {
  const { filteredServices, filters, setFilter, resetFilters } = useServices();

  const subjectAreas = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Engineering",
    "Literature",
    "History",
    "Economics",
    "Business",
    "Psychology",
    "Sociology",
    "Art",
    "Music",
    "Language",
    "Other",
  ];

  // Reset filters when component unmounts
  useEffect(() => {
    return () => resetFilters();
  }, [resetFilters]);

  // Show a welcome toast when component mounts
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem("hasShownServicesWelcome");
    if (!hasShownWelcome) {
      toast.success("Welcome to the services marketplace!");
      sessionStorage.setItem("hasShownServicesWelcome", "true");
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Browse Services</h1>
        <Link
          to="/services/create"
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Post New Request
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Filter size={20} className="text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={resetFilters}
              className="ml-auto text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by keyword..."
                value={filters.query}
                onChange={(e) => setFilter("query", e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filters.subjectArea}
                onChange={(e) => setFilter("subjectArea", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Subjects</option>
                {subjectAreas.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <select
                value={filters.complexity}
                onChange={(e) => setFilter("complexity", e.target.value as any)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Complexity Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-2 items-center">
              <div className="flex-1 flex items-center">
                <DollarSign size={16} className="text-gray-400 mr-1" />
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.minPrice !== null ? filters.minPrice : ""}
                  onChange={(e) =>
                    setFilter(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <span className="text-gray-400">-</span>
              <div className="flex-1 flex items-center">
                <DollarSign size={16} className="text-gray-400 mr-1" />
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.maxPrice !== null ? filters.maxPrice : ""}
                  onChange={(e) =>
                    setFilter(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilter("status", e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilter("sortBy", e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="latest">Latest First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Clock className="mx-auto text-gray-400 mb-2" size={48} />
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            No services found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or create a new service request.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
