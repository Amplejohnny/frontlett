// This code defines a React functional component named `ContactPerson` that is part of an employer profile onboarding process.

import Button from "~/components/ui/button";
import Input from "~/components/dashboard/input";
import useEmployerOnboardingStore from "~/stores/employerOnboardingStore";
import { useState } from "react";
import useAuth from "~/stores/authStore";

interface ContactPersonProps {
  setPage: (page: number) => void;
}

const ContactPerson: React.FC<ContactPersonProps> = ({ setPage }) => {
  const updateContact = useEmployerOnboardingStore((s) => s.updateContact);
  const user = useAuth((s) => s.user);

  const [name, setName] = useState(user?.full_name || "");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");

  const handleContinue = () => {
    updateContact({ name, role, email, phone });
    setPage(3);
  };

  return (
    <div className="w-full rounded-lg border bg-white dark:bg-neutral-900 shadow-sm p-6 md:p-8 flex flex-col gap-6">
      {/* Heading */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#0F1729] dark:text-neutral-200">
          <img
            src="/images/contact-person.png"
            alt="contactPerson"
            className=""
          />{" "}
          Contact Person Details
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Who should talents reach out to?
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium" htmlFor="contactName">
            Contact Person Name
          </label>
          <Input
            id="contactName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Input name here"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="role">
            Role
          </label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Eg: HR Manager"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="email">
            Work Email
          </label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@yourdomain.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must match your business domain
          </p>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="phone">
            Phone Number
          </label>
          <div className="flex gap-2">
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
            <Button>Verify</Button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setPage(1)}>
          Back
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default ContactPerson;
