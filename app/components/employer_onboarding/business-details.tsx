// This code defines a React functional component named `BuisnessDetails` that is part of an employer profile onboarding process.

import Button from "~/components/ui/button";
import Input from "~/components/dashboard/input";
import Textarea from "~/components/dashboard/textarea";
import Select from "~/components/dashboard/select";
import useEmployerOnboardingStore from "~/stores/employerOnboardingStore";
import { useState } from "react";
import useAuth from "~/stores/authStore";

interface BusinessDetailsProps {
  setPage: (page: number) => void;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ setPage }) => {
  const updateBusiness = useEmployerOnboardingStore((s) => s.updateBusiness);
  const user = useAuth((s) => s.user);

  const [businessName, setBusinessName] = useState(user?.company_name ?? "");
  const [rcNumber, setRcNumber] = useState(user?.rc_number ?? "");
  const rcVerified = user?.rc_verified ?? false;

  const [industry, setIndustry] = useState("");
  const [organisationSize, setOrganisationSize] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const handleContinue = () => {
    updateBusiness({
      industry,
      organisationSize,
      description,
      address,
      country,
      state,
      email,
      website,
    });
    setPage(2);
  };

  return (
    <div className="w-full rounded-lg border bg-white dark:bg-neutral-900 shadow-sm p-6 md:p-8 flex flex-col gap-6">
      {/* Heading Section */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#0F1729] dark:text-neutral-200">
          <img
            src="/images/business-icon.png"
            alt="businessName"
            className=""
          />{" "}
          Business Details
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Basic information about your business
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="businessName" className="text-sm font-medium">
            Business Name*
          </label>
          <Input
            id="businessName"
            value={businessName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBusinessName(e.target.value)
            }
            disabled={!!user?.company_name}
          />
        </div>
        <div>
          <label htmlFor="RCNumber" className="text-sm font-medium">
            RC Number
          </label>
          {rcVerified && (
            <div className="text-green-600 text-sm mb-1">✔ Verified</div>
          )}
          <Input
            id="RCNumber"
            value={rcNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRcNumber(e.target.value)
            }
            disabled={!!user?.rc_number}
          />
        </div>
        <div>
          <label htmlFor="industry" className="text-sm font-medium">
            Industry/Sector
          </label>
          <Select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Select Industry"
            data={[
              { label: "Technology", value: "tech" },
              { label: "Finance", value: "finance" },
              { label: "Healthcare", value: "health" },
            ]}
          />
        </div>
        <div>
          <label htmlFor="organisation" className="text-sm font-medium">
            Organization Size
          </label>
          <Select
            id="organisation"
            value={organisationSize}
            onChange={(e) => setOrganisationSize(e.target.value)}
            placeholder="Select Size"
            data={[
              { label: "1–10 employees", value: "1-10" },
              { label: "11–50 employees", value: "11-50" },
              { label: "51–200 employees", value: "51-500" },
              { label: "501+ employees", value: "501+" },
            ]}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="businessDescription">
          Business Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="businessDescription"
          maxLength={280}
          placeholder="Tell talents about your business (280 characters max)"
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="officeAddress">
          Office Address
        </label>
        <Input
          value={address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress(e.target.value)
          }
          placeholder="Start typing your address..."
          id="officeAddress"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium" htmlFor="country">
            Country
          </label>
          <Input
            value={country}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCountry(e.target.value)
            }
            id="country"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="state">
            State
          </label>
          <Input
            value={state}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setState(e.target.value)
            }
            id="state"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="officialEmail">
            Official Email
          </label>
          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              id="officialEmail"
            />
            <Button>Verify</Button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="website">
            Website URL
          </label>
          <Input
            value={website}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWebsite(e.target.value)
            }
            placeholder="https://..."
            id="website"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default BusinessDetails;
