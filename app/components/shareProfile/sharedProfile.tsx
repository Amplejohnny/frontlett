import { useParams } from "react-router-dom";
import Footer from "../footer";
import Navbar from "../navbar";
import { LuInfo } from "react-icons/lu";
import ProfileDetails from "./profileDetails";
import useAuth from "~/stores/authStore";

const SharedDashboard = () => {
  const { userId, username } = useParams<{
    userId: string;
    username: string;
  }>();

  if (!userId || !username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-full shadow-sm max-w-xl">
          <LuInfo className="w-4 h-4 shrink-0" />
          <span>Invalid profile link. Please try again.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ProfileDetails userId={userId} username={username} />
      </main>
    </>
  );
};

const UnknownUserFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex items-center gap-2 bg-blue-50 text-blue-600 text-sm px-4 py-2 rounded-full shadow-sm max-w-xl">
        <LuInfo className="w-4 h-4 shrink-0" />
        <span>
          This Resource's profile is only available to Frontlett customers.
          Please{" "}
          <a href="/login" className="underline hover:text-blue-700">
            login
          </a>{" "}
          or{" "}
          <a href="/signup" className="underline hover:text-blue-700">
            sign up
          </a>{" "}
          to view their profile.
        </span>
      </div>
    </div>
  );
};

export const SharedProfile = () => {
  const { user } = useAuth();
  return user ? (
    <SharedDashboard />
  ) : (
    <>
      <Navbar />
      <UnknownUserFallback />
      <Footer />
    </>
  );
};
