type ProfileSkeletonProps = {
  count?: number;
  className?: string;
};
export const ProfileSkeleton = ({
  count = 3,
  className = "",
}: ProfileSkeletonProps) => {
  return (
    <div
      className={`mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap animate-pulse ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
        >
          <div className="w-full h-80 bg-gray-100 rounded-md" />
          <div className="w-full flex justify-between">
            <div className="w-36 h-8 bg-gray-100 rounded-md" />
            <div className="w-16 h-8 bg-gray-100 rounded-md ml-auto" />
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-md" />
          <div className="w-1/2 h-4 bg-gray-100 rounded-md" />
          <div className="w-1/2 h-12 bg-gray-100 rounded-2xl" />
        </div>
      ))}
    </div>
  );
};


{/* JobSkeleton component */}
type JobSkeletonProps = {
  count?: number;
  className?: string;
  variant?: "grid" | "table";
  width?: string;
  height?: string;
};

export const JobSkeleton = ({
  count = 3,
  className = "",
  variant = "grid",
  width = "w-full",
  height = "h-80",
}: JobSkeletonProps) => {
  return (
    <div className={`mt-6 animate-pulse ${className}`} aria-hidden="true">
      {variant === "grid" ? (
        // Grid View Skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: count }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-neutral-800 rounded-lg border p-4 space-y-4"
            >
              {/* Employer Image and Title */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-neutral-600 rounded-4xl" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                  <div className="w-1/2 h-4 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                </div>
              </div>
              {/* Application Details */}
              <div className="space-y-2">
                <div className="w-1/2 h Ascentuated h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                <div className="w-1/3 h-4 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                <div className="w-1/4 h-4 bg-gray-200 dark:bg-neutral-600 rounded-md" />
              </div>
              {/* Status */}
              <div className="w-1/3 h-6 bg-gray-200 dark:bg-neutral-600 rounded-full" />
              {/* Buttons */}
              <div className="flex gap-2">
                <div className="w-20 h-8 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                <div className="w-20 h-8 bg-gray-200 dark:bg-neutral-600 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table View Skeleton
        <div className="bg-white dark:bg-neutral-700 rounded-lg border border-[#e2e8f0] dark:border-neutral-500 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e2e8f0] dark:border-neutral-500">
                <th className="p-4">
                  <div className="w-20 h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                </th>
                <th className="p-4">
                  <div className="w-20 h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                </th>
                <th className="p-4">
                  <div className="w-20 h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                </th>
                <th className="p-4">
                  <div className="w-20 h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                </th>
                <th className="p-4">
                  <div className="w-20 h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: count }).map((_, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#e2e8f0] dark:border-neutral-500"
                >
                  <td className="p-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-600 rounded-lg" />
                    <div className="w-24 h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                  </td>
                  <td className="p-4">
                    <div className="w-32 h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                  </td>
                  <td className="p-4">
                    <div className="w-24 h-5 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                  </td>
                  <td className="p-4">
                    <div className="w-20 h-6 bg-gray-200 dark:bg-neutral-600 rounded-full" />
                  </td>
                  <td className="p-4 flex gap-2">
                    <div className="w-16 h-8 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                    <div className="w-16 h-8 bg-gray-200 dark:bg-neutral-600 rounded-md" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
