// This component is a modal for sharing a user's profile link. It fetches the link from an API, allows the user to copy it, and share.
// The modal also handles errors and provides feedback when the link is copied.
import { useEffect, useState } from "react";
import Button from "~/components/ui/button";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { get } from "~/libs/axios";
import { LuX, LuMail } from "react-icons/lu";
import { FaXTwitter, FaSquareWhatsapp } from "react-icons/fa6";

type ShareProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [profileLink, setProfileLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isNativeSharing, setIsNativeSharing] = useState(!!navigator.share);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      return;
    }

    const fetchProfileLink = async () => {
      try {
        const response = await get<{ link: string }>("/api/profile-link");
        const link = response.data?.link || "";
        setProfileLink(link);
        if (isNativeSharing) {
          try {
            await navigator.share({
              title: "Check out my profile",
              text: "Here’s my professional profile!",
              url: link,
            });
            onClose();
          } catch (err) {
            setError("Sharing failed. Please try another method.");
            setIsNativeSharing(false);
          }
        }
      } catch (error) {
        console.error("Error fetching profile link:", error);
        setError("Failed to fetch profile link. Please try again.");
        setIsNativeSharing(false);
      }
    };

    fetchProfileLink();
  }, [isOpen, onClose, isNativeSharing]);

  const handleCopy = () => {
    if (!profileLink) return;
    navigator.clipboard
      .writeText(profileLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => setError("Copy failed: " + err.message));
  };

  const encodedLink = encodeURIComponent(profileLink);
  const emailURL = `mailto:?subject=Check out my profile&body=${encodedLink}`;
  const twitterURL = `https://x.com/intent/tweet?url=${encodedLink}`;
  const whatsappURL = `https://wa.me/?text=${encodedLink}`;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <DialogPanel className="relative max-w-md w-full bg-white p-6 rounded-2xl shadow-lg z-50">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-semibold">
              Share Your Profile
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
              aria-label="Close modal"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <div className="mb-4">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <input
                type="text"
                readOnly
                value={profileLink}
                aria-label="Profile link"
                className="w-full px-3 py-2 text-sm bg-gray-50 border-none focus:outline-none"
              />
              <Button
                onClick={handleCopy}
                size="sm"
                className="rounded-none rounded-r-lg"
                disabled={!profileLink}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your profile link is private until shared. Don’t share it unless
              you’re sure!
            </p>
          </div>

          {!isNativeSharing && (
            <>
              <p className="text-sm text-gray-600 text-center mb-4">Share To</p>
              <div className="grid grid-cols-3 gap-4">
                <a
                  href={emailURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LuMail className="mb-1 w-6 h-6 text-gray-600 hover:text-blue-600" />
                  Email
                </a>
                <a
                  href={twitterURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaXTwitter className="mb-1 w-6 h-6 text-gray-600 hover:text-blue-600" />
                  X
                </a>
                <a
                  href={whatsappURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-sm text-gray-700 hover:text-green-600 transition-colors"
                >
                  <FaSquareWhatsapp className="mb-1 w-6 h-6 text-gray-600 hover:text-blue-600" />
                  WhatsApp
                </a>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ShareProfileModal;
