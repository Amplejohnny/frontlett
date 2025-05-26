import React, { Suspense } from "react";
import {
  LuBriefcase,
  LuTable,
  LuCheck,
  LuClock3,
  LuCircleUser,
} from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { BsFillGridFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { JobSkeleton } from "~/components/Skeleton";
import Button from "~/components/ui/button";
import { useJobStore } from "~/stores/jobStore";

export default function JobHistory() {
  const navigate = useNavigate();
  const {
    viewMode,
    applications,
    loading,
    error,
    setViewMode,
    fetchApplications,
    acceptOffer,
    withdrawApplication,
  } = useJobStore();

  // Fetch applications on mount
  React.useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="max-w-5xl mx-auto bg-[#f8fafc] dark:bg-neutral-800 min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4">
        <h1 className="text-2xl font-bold text-[#0f1729] dark:text-neutral-200">
          Application History
        </h1>
        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <select className="border border-[#e2e8f0] dark:border-neutral-500 rounded-lg px-3 py-1 bg-white dark:bg-neutral-700 text-[#0f1729] dark:text-neutral-300">
            <option>All Applications</option>
          </select>
          {/* View Mode Toggle */}
          <div className="flex gap-1 border border-[#e2e8f0] dark:border-neutral-500 rounded-lg p-1 bg-white dark:bg-neutral-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-[#e5edff] dark:bg-neutral-600 text-gray-900 dark:text-white"
                  : "text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-600"
              }`}
            >
              <BsFillGridFill className="w-6 h-6" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded ${
                viewMode === "table"
                  ? "bg-[#e5edff] dark:bg-neutral-600 text-gray-900 dark:text-neutral-300"
                  : "text-[#64748b] dark:text-neutral-400 hover:bg-gray-200"
              }`}
            >
              <LuTable className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Suspense with Skeleton Fallback */}
      <Suspense fallback={<JobSkeleton variant={viewMode} />}>
        {error ? (
          <div className="text-red-600 dark:text-red-400 p-4 text-center">
            {error}
          </div>
        ) : loading ? (
          <JobSkeleton variant={viewMode} />
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-40 h-40 bg-gray-200 dark:bg-neutral-600 rounded-lg flex items-center justify-center mb-4">
              <LuBriefcase className="w-16 h-16 text-gray-400 dark:text-neutral-400" />
            </div>
            <p className="text-[#64748b] dark:text-neutral-400 mb-4">
              You haven't applied for any jobs yet!
            </p>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate("/dashboard/job")}
            >
              Search for Jobs
            </Button>
          </div>
        ) : (
          <>
            {/* Boost Profile Banner (Only for Table View) */}
            {viewMode === "table" && applications.length > 0 && (
              <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-bold">Get Hired 3X Faster</h3>
                  <p>
                    Stand out in employer searches with our AI-powered profile
                    enhancement
                  </p>
                </div>
                <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                  Boost My Profile Now!
                </Button>
              </div>
            )}

            {/* Grid or Table View */}
            {viewMode === "grid" ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-neutral-800 rounded-lg border p-4 space-y-4"
                  >
                    <div className="flex items-center space-x-3">
                      {app.employer.profile_picture ? (
                        <img
                          src={app.employer.profile_picture}
                          alt="Employer"
                          className="w-12 h-12 rounded-4xl object-cover"
                        />
                      ) : (
                        <LuCircleUser className="w-12 h-12 text-gray-400" />
                      )}
                      <div>
                        <h2 className="font-bold text-gray-900 dark:text-white">
                          {app.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {app.employer.name}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-neutral-400">
                      <p className="text-sm text-[#64748b] dark:text-neutral-400">
                        Applied on:{" "}
                        {new Date(app.applied_date).toLocaleDateString()}
                      </p>
                      {app.response_received && (
                        <p className="text-sm text-[#64748b] dark:text-neutral-400">
                          Response received:{" "}
                          {new Date(app.response_received).toLocaleDateString()}
                        </p>
                      )}
                      {app.interview_scheduled && (
                        <p className="text-sm text-[#64748b] dark:text-neutral-400">
                          Interview scheduled:{" "}
                          {new Date(
                            app.interview_scheduled
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {app.feedback && (
                        <p className="text-sm text-[#64748b] dark:text-neutral-400 mt-2">
                          Feedback: {app.feedback}
                        </p>
                      )}
                    </div>
                    <div className="mt-3">
                      <button
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                          app.status
                        )}`}
                      >
                        {app.status === "Selected" && (
                          <LuCheck className="w-4 h-4" />
                        )}
                        {app.status === "In Review" && (
                          <LuClock3 className="w-4 h-4" />
                        )}
                        {app.status === "Not Selected" && (
                          <IoMdClose className="w-4 h-4" />
                        )}
                        {app.status === "Posting Expired" && (
                          <LuBriefcase className="w-4 h-4" />
                        )}
                        {app.status}
                      </button>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="bg-white dark:bg-neutral-600 border border-[#e2e8f0] dark:border-neutral-500 text-[#0f1729] dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-500"
                        onClick={() => console.log("View Job", app.id)}
                      >
                        View Job
                      </Button>
                      {app.status === "Selected" ? (
                        <Button
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => acceptOffer(app.id)}
                        >
                          Accept Offer
                        </Button>
                      ) : app.status !== "Not Selected" ? (
                        <Button
                          className="bg-white dark:bg-neutral-600 border border-[#e2e8f0] dark:border-neutral-500 text-[#0f1729] dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-500"
                          onClick={() => withdrawApplication(app.id)}
                        >
                          Withdraw
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="bg-white dark:bg-neutral-700 rounded-lg border border-[#e2e8f0] dark:border-neutral-500 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] dark:border-neutral-500">
                      <th className="p-4 text-[#0f1729] dark:text-neutral-200">
                        Company
                      </th>
                      <th className="p-4 text-[#0f1729] dark:text-neutral-200">
                        Role
                      </th>
                      <th className="p-4 text-[#0f1729] dark:text-neutral-200">
                        Applied Date
                      </th>
                      <th className="p-4 text-[#0f1729] dark:text-neutral-200">
                        Status
                      </th>
                      <th className="p-4 text-[#0f1729] dark:text-neutral-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#e2e8f0] dark:border-neutral-500"
                      >
                        <td className="p-4 flex items-center gap-2">
                          <div className="bg-[#4f46e5] w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                            {app.employer.profile_picture ? (
                              <img
                                src={app.employer.profile_picture}
                                alt="Employer"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <LuCircleUser className="w-10 h-10 text-gray-400" />
                            )}
                          </div>
                          <span className="text-[#0f1729] dark:text-neutral-200">
                            {app.employer.name}
                          </span>
                        </td>
                        <td className="p-4 text-[#64748b] dark:text-neutral-400">
                          {app.title}
                        </td>
                        <td className="p-4 text-[#64748b] dark:text-neutral-400">
                          {new Date(app.applied_date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <button
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                              app.status
                            )}`}
                          >
                            {app.status === "Selected" && (
                              <LuCheck className="w-4 h-4" />
                            )}
                            {app.status === "In Review" && (
                              <LuClock3 className="w-4 h-4" />
                            )}
                            {app.status === "Not Selected" && (
                              <IoMdClose className="w-4 h-4" />
                            )}
                            {app.status === "Posting Expired" && (
                              <LuBriefcase className="w-4 h-4" />
                            )}
                            {app.status}
                          </button>
                        </td>
                        <td className="p-4 flex gap-2">
                          <Button
                            className="bg-white dark:bg-neutral-600 border border-[#e2e8f0] dark:border-neutral-500 text-[#0f1729] dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-500"
                            onClick={() => console.log("View Job", index)}
                          >
                            View
                          </Button>
                          {app.status === "Selected" ? (
                            <Button
                              className="bg-green-600 text-white hover:bg-green-700"
                              onClick={() => acceptOffer(index)}
                            >
                              Accept
                            </Button>
                          ) : app.status !== "Not Selected" ? (
                            <Button
                              className="bg-white dark:bg-neutral-600 border border-[#e2e8f0] dark:border-neutral-500 text-[#0f1729] dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-500"
                              onClick={() => withdrawApplication(index)}
                            >
                              Withdraw
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Suspense>
    </div>
  );
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Selected":
      return "bg-green-100 text-green-800 border-green-500";
    case "In Review":
      return "bg-yellow-100 text-yellow-800 border-yellow-500";
    case "Not Selected":
      return "bg-red-100 text-red-800 border-red-500";
    case "Posting Expired":
      return "bg-gray-100 text-gray-800 border-gray-500";
    default:
      return "bg-gray-100 text-gray-800 border-gray-500";
  }
};
