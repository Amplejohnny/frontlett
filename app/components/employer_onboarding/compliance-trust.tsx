//// This code defines a React functional component named `ComplianceTrust` that is part of an employer profile onboarding process.

import Button from "~/components/ui/button";

interface ComplianceTrustProps {
  setPage: (page: number) => void;
}

const ComplianceTrust: React.FC<ComplianceTrustProps> = ({ setPage }) => {
  const accountOfficer = {
    name: "Michael Smith",
    image: null,
    role: "Business Support",
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <div className="w-full rounded-lg border bg-white dark:bg-neutral-900 shadow-sm p-6 md:p-8 flex flex-col gap-6">
      {/* Heading */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#0F1729] dark:text-neutral-200">
          Compliance & Trust
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Verification status and account officer
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm font-medium text-gray-700">KYB Status</p>
          <span className="inline-flex items-center gap-1 mt-2 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
            ⏳ Pending Verification
          </span>
          <p className="text-xs text-gray-500 mt-1">
            Pending documents review by compliance team
          </p>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm font-medium text-gray-700">RC Validation</p>
          <span className="inline-flex items-center gap-1 mt-2 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
            🕒 In Progress
          </span>
          <p className="text-xs text-gray-500 mt-1">
            Verification against corporate registry
          </p>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm font-medium text-gray-700">Account Officer</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
              {accountOfficer.image ? (
                <img
                  src={accountOfficer.image}
                  alt="Account Officer"
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                getInitials(accountOfficer.name)
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-[#0F1729]">
                {accountOfficer.name}
              </p>
              <span className="text-xs text-gray-500">
                {accountOfficer.role}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Button size="sm" variant="outline" className="text-xs">
              Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="mt-2">
        <h4 className="text-md font-semibold mb-2">Required Documents</h4>
        <ul className="flex flex-col gap-3">
          {[
            "Certificate of Incorporation",
            "Tax Identification Number",
            "Proof of Business Address",
          ].map((doc) => (
            <li
              key={doc}
              className="flex justify-between items-center px-4 py-3 border rounded-lg bg-white"
            >
              <div>
                <p className="text-sm font-medium text-[#0F1729]">{doc}</p>
                <p className="text-xs text-gray-500">(PDF or JPG, max 5MB)</p>
              </div>
              <Button size="sm">Upload</Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setPage(2)}>
          Back
        </Button>
        <Button onClick={() => setPage(4)}>Continue</Button>
      </div>
    </div>
  );
};

export default ComplianceTrust;
