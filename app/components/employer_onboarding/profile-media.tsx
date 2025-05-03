// This code defines a React functional component named `ProfileMedia` that is part of an employer profile onboarding process.

import { useRef, useState } from "react";
import Button from "~/components/ui/button";
import useEmployerOnboardingStore from "~/stores/employerOnboardingStore";

interface ProfileMediaProps {
  setPage: (page: number) => void;
}

const ProfileMedia: React.FC<ProfileMediaProps> = ({ setPage }) => {
  const updateMedia = useEmployerOnboardingStore((s) => s.updateMedia);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null, type: "logo" | "coverPhoto") => {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, or SVG files are allowed.");
      return;
    }

    const previewURL = URL.createObjectURL(file);

    if (type === "logo") {
      setLogoFile(file);
      setLogoPreview(previewURL);
    } else {
      setCoverFile(file);
      setCoverPreview(previewURL);
    }
  };

  const handleContinue = () => {
    updateMedia({
      logo: logoFile ?? undefined,
      coverPhoto: coverFile ?? undefined,
    });
    setPage(4);
  };

  return (
    <div className="w-full rounded-lg border bg-white dark:bg-neutral-900 shadow-sm p-6 md:p-8 flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#0F1729] dark:text-neutral-200">
          <img
            src="/images/profile-upload.png"
            alt="profileUpload"
            className=""
          />{" "}
          Profile Media
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Upload your business logo and cover photo for your profile
        </p>
      </div>

      {/* Cover Photo Upload */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="coverPhoto"
            className="text-sm font-medium text-[#0F1729]"
          >
            Cover Photo
          </label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => coverInputRef.current?.click()}
          >
            <img src="/images/upload-icon.png" alt="uploadIcon" className="" />{" "}
            Upload
          </Button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleFileChange(e.target.files?.[0] ?? null, "coverPhoto")
            }
          />
        </div>
        <p className="text-xs text-gray-500">
          Recommended size: 1500×500px (JPG, PNG)
        </p>
        <div className="border border-dashed rounded-md bg-gray-50 text-center py-16 text-sm text-gray-400">
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover Preview"
              className="w-full h-40 object-cover rounded"
            />
          ) : (
            "No cover photo uploaded"
          )}
        </div>
      </div>

      {/* Company Logo Upload */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="companyLogo"
            className="text-sm font-medium text-[#0F1729]"
          >
            Company Logo
          </label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => logoInputRef.current?.click()}
          >
            <img src="/images/upload-icon.png" alt="uploadIcon" className="" />{" "}
            Upload
          </Button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleFileChange(e.target.files?.[0] ?? null, "logo")
            }
          />
        </div>
        <p className="text-xs text-gray-500">
          Recommended size: 500×500px (PNG, SVG)
        </p>
        <div className="border border-dashed rounded-md bg-gray-50 py-10 flex justify-center items-center">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="w-24 h-24 object-contain rounded"
            />
          ) : (
            <div className="text-4xl text-gray-400">
              <img
                src="/images/upload-files.png"
                alt="uploadFile"
                className=""
              />
            </div>
          )}
        </div>
      </div>

      {/* Media Guidelines */}
      <div className="border-t pt-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-medium mb-1">Media Guidelines:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Logo: Square format (PNG, transparent background preferred)</li>
          <li>Cover photo: Landscape format (JPG, high resolution)</li>
          <li>
            Avoid text on cover photo as it may be cropped on smaller screens
          </li>
          <li>Maximum file size: 5MB per image</li>
        </ul>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setPage(2)}>
          Back
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default ProfileMedia;
