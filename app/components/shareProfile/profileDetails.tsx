import { useEffect, useState } from "react";
import {
  LuMapPin,
  LuStar,
  LuCircleCheckBig,
  LuCircleAlert,
  LuExternalLink,
  LuCalendar,
  LuGraduationCap,
  LuLink,
} from "react-icons/lu";
import { MdWorkOutline } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { get } from "~/libs/axios";
import type { VisitorUser } from "~/stores/authStore";
import { ProfileSkeleton } from "../Skeleton";

interface Props {
  userId: string;
  username: string;
}

const ProfileDetails = ({ username, userId }: Props) => {
  const [loading, setLoading] = useState(true);
  const [visitor, setVisitor] = useState<VisitorUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    const fetchVisitorProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await get<{ user: VisitorUser }>(
          `/public/profile/${userId}/${username}`
        );
        const data = res.data.user;
        setVisitor(data);
      } catch (err) {
        console.error("Failed to fetch visitor profile", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorProfile();
  }, [username, userId]);

  if (loading) {
    return <ProfileSkeleton className="h-[200px] w-full rounded-lg" />;
  }

  if (error || !visitor) {
    return (
      <div className="w-full rounded-lg py-4 px-6 bg-white dark:bg-neutral-700 flex items-center justify-center gap-2 text-red-600">
        <LuCircleAlert className="w-5 h-5" />
        <p>{error || "Profile not found."}</p>
      </div>
    );
  }

  const { full_name, location, profile, availability } = visitor;
  const {
    profile_picture,
    professional_headline,
    hourly_rate,
    rating,
    job_success_rate,
    about,
    skills,
    portfolio,
    workExperience,
    currentWork,
    education,
    socialMedia,
  } = profile;

  const schedule = availability?.schedule || [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const availabilityByDay = days.map((day) => ({
    day,
    slots: schedule
      .filter((s) => s.day === day)
      .map((s) => `${formatTime(s.startTime)}-${formatTime(s.endTime)}`),
  }));

  const truncateLength = 150;
  const displayAbout = about || "About is empty.";
  const truncatedAbout = isAboutOpen
    ? displayAbout
    : `${displayAbout.slice(0, truncateLength)}${
        displayAbout.length > truncateLength ? "..." : ""
      }`;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg py-4 px-6 bg-white dark:bg-neutral-700 shadow-md flex flex-col gap-4 sm:gap-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0">
          {profile_picture ? (
            <img
              src={profile_picture}
              alt={`${full_name}'s profile`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center rounded-full">
              <span className="text-gray-500 dark:text-neutral-400 text-lg font-semibold">
                {full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <section className="flex flex-col gap-2 text-center sm:text-left">
          <h2 className="text-[#020817] dark:text-neutral-300 text-xl sm:text-2xl lg:text-3xl font-semibold">
            {full_name}
          </h2>
          <p className="text-[#64748B] dark:text-neutral-400 text-sm sm:text-base lg:text-lg">
            {professional_headline || "No Professional Headline"}
          </p>
          <p className="text-[#64748B] dark:text-neutral-400 text-sm sm:text-base inline-flex items-center gap-1 justify-center sm:justify-start">
            <LuMapPin className="text-[#64748B] w-4 h-4 sm:w-5 sm:h-5" />
            {location || "No location"}
          </p>
        </section>
      </div>
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          label="Hourly Rate"
          value={hourly_rate?.toString() ?? "0"}
          suffix="/hr"
        />
        <StatCard
          label="Rating"
          icon={<LuStar className="text-yellow-500 w-5 h-5" />}
          value={(rating ?? 0).toFixed(1)}
          suffix="/5"
        />
        <StatCard
          label="Job Success"
          icon={<LuCircleCheckBig className="text-blue-600 w-5 h-5" />}
          value={(job_success_rate ?? 0).toFixed(1)}
          suffix="%"
        />
      </div>

      {/* Availability Section */}
      <div className="bg-gray-50 dark:bg-neutral-600 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#020817] dark:text-neutral-200 mb-4">
          Availability
        </h3>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
          Resource is available for {availability?.totalHours || 0} hours this
          week
        </p>
        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-sm sm:text-base">
          {days.map((day) => {
            const dayData = availabilityByDay.find((d) => d.day === day);
            return (
              <div key={day} className="text-center">
                <p className="font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  {day}
                </p>
                {dayData?.slots.length ? (
                  dayData.slots.map((slot, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mt-1"
                    >
                      {slot}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 dark:text-neutral-500">
                    Not available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 dark:bg-neutral-600 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#020817] dark:text-neutral-200 mb-4">
          About
        </h3>
        <div className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
          <p>{truncatedAbout}</p>
        </div>
        {displayAbout.length > truncateLength && (
          <button
            onClick={() => setIsAboutOpen(!isAboutOpen)}
            className="w-full flex justify-between items-center px-4 py-2 text-left focus:outline-none mt-2"
          >
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {isAboutOpen ? "Show less" : "Show more"}
            </span>
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${
                isAboutOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Skill & Expertise Section */}
      <div className="bg-gray-50 dark:bg-neutral-600 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#020817] dark:text-neutral-200 mb-4">
          Skill & Expertise
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills && skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-200 text-blue-600 dark:text-neutral-200 px-2 py-1 rounded text-xs sm:text-sm hover:bg-blue-400 transition-colors"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              No skills listed.
            </p>
          )}
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="bg-gray-50 dark:bg-neutral-600 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#020817] dark:text-neutral-200 mb-4">
          <MdWorkOutline className="inline-block mr-2" />
          Portfolio
        </h3>
        {portfolio && portfolio.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.map((item, index) => (
              <div key={index} className="flex flex-col">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 dark:bg-neutral-500 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 dark:text-neutral-400 text-sm">
                      No portfolio picture
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-neutral-200">
                    {item.title}
                  </h4>
                  <a
                    href={item.projectUrl}
                    title={item.title}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LuExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </a>
                </div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            No portfolio project available.
          </p>
        )}
      </div>

      {/* Work Experience Section */}
      <div className="bg-gray-50 dark:bg-neutral-600 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#020817] dark:text-neutral-200 mb-4">
          <MdWorkOutline className="inline-block mr-2" />
          Work Experience
        </h3>
        {workExperience && workExperience.length > 0 ? (
          workExperience.map((job, index) => (
            <div key={index} className="mt-6 first:mt-0">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-semibold text-gray-800 dark:text-neutral-200">
                  {job.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  <LuCalendar className="w-4 h-4 inline-block mr-1" />
                  {job.startDate.slice(0, 4)} -{" "}
                  {job.endDate === "Present"
                    ? "Present"
                    : job.endDate.slice(0, 4)}
                </p>
              </div>
              <span className="inline-block bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm mt-1">
                {job.company}
              </span>
              <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 leading-relaxed">
                {job.description}
              </p>
              {index < workExperience.length - 1 && (
                <hr className="mt-6 border-t-2 border-gray-500 dark:border-neutral-800" />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            No work experience available.
          </p>
        )}
      </div>

      {/* Current Work Section */}
      <div className="bg-gray-50 dark:bg-neutral-600 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#020817] dark:text-neutral-200 mb-4">
          <MdWorkOutline className="inline-block mr-2" />
          Current Work
        </h3>
        {currentWork && currentWork.length > 0 ? (
          currentWork.map((work, index) => (
            <div key={index} className="mt-6 first:mt-0">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-semibold text-gray-800 dark:text-neutral-200">
                  {work.title}
                </h4>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    work.status === "In Progress"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  {work.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                {work.startDate.slice(0, 4)} -{" "}
                {work.endDate === "Present"
                  ? "Present"
                  : work.endDate.slice(0, 4)}
              </p>
              <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 leading-relaxed">
                {work.description}
              </p>
              {index < currentWork.length - 1 && (
                <hr className="mt-4 border-t border-gray-300 dark:border-neutral-500" />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            No current work available.
          </p>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-gray-50 dark:bg-neutral-600 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#020817] dark:text-neutral-200 mb-4">
          <LuGraduationCap className="inline-block mr-2" />
          Education
        </h3>
        {education && education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index} className="mt-6 first:mt-0">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-semibold text-gray-800 dark:text-neutral-200">
                  {edu.degree}
                </h4>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  <LuCalendar className="w-4 h-4 inline-block mr-1" />
                  {edu.startDate.slice(0, 4)} - {edu.endDate.slice(0, 4)}
                </p>
              </div>
              <p className=" bg-blue-100 dark:bg-gray-900 text-gray-500 dark:text-blue-200 text-sm mt-1">
                {edu.institution}
              </p>
              {edu.description && (
                <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  {edu.description}
                </p>
              )}
              {index < education.length - 1 && (
                <hr className="mt-4 border-t border-gray-300 dark:border-neutral-500" />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            No education history available.
          </p>
        )}
      </div>

      {/* Social Media Links Section */}
      <div className="bg-gray-50 dark:bg-neutral-600 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#020817] dark:text-neutral-200 mb-4">
          <LuLink className="inline-block mr-2" />
          Social Media Links
        </h3>
        {socialMedia && socialMedia.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {socialMedia.map((link, index) => {
              const platformIcons: { [key: string]: React.ReactNode } = {
                LinkedIn: <FaLinkedin className="w-6 h-6" />,
                GitHub: <FaGithub className="w-6 h-6" />,
              };
              const icon = platformIcons[link.platform] || null;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {icon}
                  <span className="text-sm">{link.platform}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            No social media links available.
          </p>
        )}
      </div>
    </div>
  );
};

// Helper function to format time (e.g., "09:00" to "9AM")
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}${minutes === "00" ? "" : ":" + minutes}${period}`;
};

const StatCard = ({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex flex-col p-3 rounded-md bg-gray-100 dark:bg-neutral-600 shadow-sm">
    <div className="flex items-center gap-2">
      {icon ? (
        <>
          {icon}
          <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-neutral-300">
            {value}
          </p>
          {suffix && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">
              {suffix}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-neutral-300">
            {value}
          </p>
          {suffix && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">
              {suffix}
            </p>
          )}
        </>
      )}
    </div>
    <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">{label}</p>
  </div>
);

export default ProfileDetails;

// {
//   "availability": {
//     "totalHours": 25,
//     "schedule": [
//       { "day": "Mon", "startTime": "09:00", "endTime": "12:00" },
//       { "day": "Mon", "startTime": "14:00", "endTime": "17:00" },
//       { "day": "Tue", "startTime": "09:00", "endTime": "12:00" },
//       { "day": "Tue", "startTime": "14:00", "endTime": "17:00" },
//       { "day": "Wed", "startTime": "09:00", "endTime": "12:00" },
//       { "day": "Wed", "startTime": "14:00", "endTime": "17:00" },
//       { "day": "Thu", "startTime": "09:00", "endTime": "12:00" },
//       { "day": "Thu", "startTime": "14:00", "endTime": "17:00" },
//       { "day": "Fri", "startTime": "09:00", "endTime": "12:00" },
//       { "day": "Fri", "startTime": "14:00", "endTime": "17:00" },
//       { "day": "Sat", "startTime": "09:00", "endTime": "12:00" },
//       { "day": "Sun", "startTime": "09:00", "endTime": "12:00" }
//     ]
//   }
// },
// {
//   "currentWork": [
//     {
//       "title": "E-commerce Website Redesign",
//       "status": "In Progress",
//       "startDate": "2023-06",
//       "endDate": "Present",
//       "description": "Leading the UI/UX redesign of RestShop’s e-commerce platform. Implementing responsive design principles and optimizing the checkout process to increase conversion rates."
//     },
//     {
//       "title": "E-commerce Website Redesign",
//       "status": "Completed",
//       "startDate": "2023-01",
//       "endDate": "2023-05",
//       "description": "Built a comprehensive admin dashboard using React and Chart.js. Designed and implemented data visualization components and real-time analytics features."
//     }
//   ]
// },
// {
//   "education": [
//     {
//       "degree": "Bachelor of Science in Computer Science",
//       "institution": "University of Lagos",
//       "startDate": "2012-09",
//       "endDate": "2016-06",
//       "description": "Specialized in software engineering with a focus on web development and database systems. Graduated with honors."
//     },
//     {
//       "degree": "Master of Science in Data Science",
//       "institution": "University of Ibadan",
//       "startDate": "2017-09",
//       "endDate": "2019-06",
//       "description": "Conducted research on machine learning applications in predictive analytics. Published a thesis on data optimization techniques."
//     }
//   ]
// },
// {
//   "socialMedia": [
//     { "platform": "Twitter", "url": "https://twitter.com/johndoe" },
//     { "platform": "LinkedIn", "url": "https://linkedin.com/in/johndoe" },
//     { "platform": "GitHub", "url": "https://github.com/johndoe" }
//   ]
// }
