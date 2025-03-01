import { useState } from "react";
import { AppData, VaccinationRecord } from "../types";
import { formatDate, generateId } from "../utils";
import { Squircle, CalendarClock, Plus, Syringe } from "lucide-react";
// Vaccination recommendations based on bird age and type
const getVaccinationRecommendations = (_birdType: string, ageWeeks: number) => {
  const recommendations = [
    { age: 1, name: "Newcastle Disease", type: "Vaccination" },
    { age: 2, name: "Infectious Bronchitis", type: "Vaccination" },
    { age: 3, name: "Gumboro Disease", type: "Vaccination" },
    { age: 4, name: "Fowl Pox", type: "Vaccination" },
    { age: 8, name: "Newcastle Disease (Booster)", type: "Vaccination" },
    { age: 12, name: "Infectious Bronchitis (Booster)", type: "Vaccination" },
  ];

  return recommendations.filter((rec) => rec.age >= ageWeeks);
};

interface VaccinationTrackerProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const VaccinationTracker = ({ data, setData }: VaccinationTrackerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<VaccinationRecord>>({
    flockId: data.flocks.length > 0 ? data.flocks[0].id : "",
    type: "Vaccination",
    name: "",
    dosage: "",
    notes: "",
    nextDueDate: null,
  });

  const handleAddRecord = () => {
    if (!formData.flockId || !formData.name) {
      alert("Please fill in required fields");
      return;
    }

    const selectedFlock = data.flocks.find(
      (flock) => flock.id === formData.flockId
    );

    const newRecord: VaccinationRecord = {
      id: generateId(),
      date: new Date().toISOString(),
      flockId: formData.flockId,
      flockName: selectedFlock ? selectedFlock.name : "Unknown Flock",
      type: formData.type as "Vaccination" | "Medication",
      name: formData.name,
      dosage: formData.dosage || "",
      notes: formData.notes || "",
      nextDueDate: formData.nextDueDate || null,
      completed: false,
    };

    setData((prev) => ({
      ...prev,
      vaccinationRecords: [newRecord, ...prev.vaccinationRecords],
    }));

    // Reset form
    setFormData({
      flockId: formData.flockId,
      type: "Vaccination",
      name: "",
      dosage: "",
      notes: "",
      nextDueDate: null,
    });
    setShowForm(false);
  };

  // Get upcoming vaccinations/medications (next 14 days)
  const today = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(today.getDate() + 14);

  const upcomingTreatments = data.vaccinationRecords
    .filter(
      (record) =>
        record.nextDueDate &&
        new Date(record.nextDueDate) >= today &&
        new Date(record.nextDueDate) <= twoWeeksFromNow
    )
    .sort(
      (a, b) =>
        new Date(a.nextDueDate!).getTime() - new Date(b.nextDueDate!).getTime()
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Vaccination & Medication Tracker
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold">Treatment Records</h2>
              <button
                className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Record
              </button>
            </div>

            {showForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">New Treatment Record</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flock*
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.flockId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          flockId: e.target.value,
                        }))
                      }
                      required
                    >
                      {data.flocks.map((flock) => (
                        <option key={flock.id} value={flock.id}>
                          {flock.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value as "Vaccination" | "Medication",
                        }))
                      }
                    >
                      <option value="Vaccination">Vaccination</option>
                      <option value="Medication">Medication</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name*
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g. Newcastle Disease Vaccine"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.dosage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dosage: e.target.value,
                        }))
                      }
                      placeholder="e.g. 1ml per bird"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Due Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={
                        formData.nextDueDate
                          ? new Date(formData.nextDueDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nextDueDate: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : null,
                        }))
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Additional details..."
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    onClick={handleAddRecord}
                  >
                    Save Record
                  </button>
                  <button
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Flock
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Dosage
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Next Due
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.vaccinationRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-2">{formatDate(record.date)}</td>
                      <td className="px-4 py-2">{record.flockName}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            record.type === "Vaccination"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {record.type}
                        </span>
                      </td>
                      <td className="px-4 py-2">{record.name}</td>
                      <td className="px-4 py-2">{record.dosage}</td>
                      <td className="px-4 py-2">
                        {record.nextDueDate
                          ? formatDate(record.nextDueDate)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  {data.vaccinationRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        No vaccination or medication records found. Add your
                        first record.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6">
            <div className="flex items-center mb-4">
              <CalendarClock className="h-5 w-5 mr-2 text-blue-500" />
              <h2 className="text-lg font-semibold">Upcoming Treatments</h2>
            </div>

            {upcomingTreatments.length > 0 ? (
              <div className="space-y-3">
                {upcomingTreatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg"
                  >
                    <div className="flex items-start">
                      <Syringe className="h-5 w-5 mr-2 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium">{treatment.name}</h3>
                        <p className="text-sm">{treatment.flockName}</p>
                        <div className="flex items-center mt-1 text-sm text-yellow-700">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          <span>Due: {formatDate(treatment.nextDueDate!)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No upcoming treatments scheduled
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center mb-4">
              <Syringe className="h-5 w-5 mr-2 text-blue-500" />
              <h2 className="text-lg font-semibold">
                Recommended Vaccinations
              </h2>
            </div>

            <div className="space-y-3">
              {data.flocks.map((flock) => (
                <div key={flock.id} className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-sm">{flock.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {flock.birdType} • {flock.ageWeeks} weeks
                  </p>
                  <ul className="text-sm space-y-1">
                    {getVaccinationRecommendations(
                      flock.birdType,
                      flock.ageWeeks
                    ).map((rec, idx) => (
                      <li key={idx} className="flex items-start">
                        <Squircle className="h-4 w-4 mr-1 mt-0.5 text-blue-500" />
                        <span>
                          {rec.name} ({rec.age} weeks)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationTracker;
