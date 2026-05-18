"use client";

import { useState } from "react";

type CompanySize = "1-50" | "51-200" | "201-500" | "501-1000" | "1001+";
type Department =
  | "Finance"
  | "Engineering"
  | "People Ops"
  | "Sales"
  | "Marketing"
  | "Other";
type Product = "C.A.R.B. Fleet" | "PantryOS" | "CrumbTrail Analytics";

type FormState = {
  firstName: string;
  lastName: string;
  workEmail: string;
  companySize: CompanySize | "";
  department: Department | "";
  productInterest: Product[];
  financeDisclaimer: boolean;
  flatFloorsConfirmed: boolean;
};

type LeadPayload = Omit<
  FormState,
  "financeDisclaimer" | "flatFloorsConfirmed"
> & {
  sales_routing_pods: string[];
};

const ENTERPRISE_SIZES: CompanySize[] = ["501-1000", "1001+"];

const computeRoutingPods = (state: FormState): string[] => {
  const pods: string[] = [];
  const isLargeCompany = ENTERPRISE_SIZES.includes(
    state.companySize as CompanySize,
  );
  const wantsCrumbTrail = state.productInterest.includes(
    "CrumbTrail Analytics",
  );
  const wantsCarbFleet = state.productInterest.includes("C.A.R.B. Fleet");
  if (isLargeCompany || wantsCrumbTrail) {
    pods.push("enterprise_pod");
  } else {
    pods.push("smb_pod");
  }
  if (wantsCarbFleet) pods.push("hardware_specialist_pod");
  return pods;
};

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  workEmail: "",
  companySize: "",
  department: "",
  productInterest: [],
  financeDisclaimer: false,
  flatFloorsConfirmed: false,
};

const inputClass =
  "w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-red-600";

const selectClass =
  "w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-900 border border-transparent focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none";

const LeadCaptureForm = () => {
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const isFinance = formState.department === "Finance";
  const wantsCarbFleet = formState.productInterest.includes("C.A.R.B. Fleet");

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setFormState((prev) => ({ ...prev, [key]: value }));

  const toggleProduct = (product: Product) =>
    setFormState((prev) => ({
      ...prev,
      productInterest: prev.productInterest.includes(product)
        ? prev.productInterest.filter((p) => p !== product)
        : [...prev.productInterest, product],
    }));

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!formState.firstName.trim()) errs.push("First name is required.");
    if (!formState.lastName.trim()) errs.push("Last name is required.");
    if (!formState.workEmail.trim()) errs.push("Work email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.workEmail))
      errs.push("Work email must be a valid email address.");
    if (!formState.companySize) errs.push("Company size is required.");
    if (!formState.department) errs.push("Department is required.");
    if (formState.productInterest.length === 0)
      errs.push("Please select at least one product.");
    if (isFinance && !formState.financeDisclaimer)
      errs.push(
        "Finance teams must acknowledge the sugar rush liability disclaimer.",
      );
    if (wantsCarbFleet && !formState.flatFloorsConfirmed)
      errs.push(
        "C.A.R.B. Fleet requires confirmation that office floors are flat and accessible.",
      );
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    const payload: LeadPayload = {
      firstName: formState.firstName,
      lastName: formState.lastName,
      workEmail: formState.workEmail,
      companySize: formState.companySize,
      department: formState.department,
      productInterest: formState.productInterest,
      sales_routing_pods: computeRoutingPods(formState),
    };
    console.log("Lead payload:", JSON.stringify(payload, null, 2));
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      {submitted ? (
        <div className="py-8 text-center">
          <h3 className="text-xl font-extrabold text-red-900 uppercase mb-3">
            Thanks! We&apos;ll Be In Touch.
          </h3>
          <p className="text-sm text-gray-600">
            Your information has been sent to the right team.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-extrabold text-[#570000] uppercase leading-tight mb-5">
            Feed your team. Close your deals.
          </h3>

          {errors.length > 0 && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 bg-[#ffe8f3] border border-[#570000] rounded-lg px-4 py-3 text-sm text-[#570000]"
            >
              <p className="font-semibold mb-1">Please fix the following:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                id="firstName"
                type="text"
                placeholder="First name"
                value={formState.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                autoComplete="given-name"
                required
                className={inputClass}
              />
              <input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={formState.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                autoComplete="family-name"
                required
                className={inputClass}
              />
            </div>

            <input
              id="workEmail"
              type="email"
              placeholder="Work email"
              value={formState.workEmail}
              onChange={(e) => setField("workEmail", e.target.value)}
              autoComplete="email"
              required
              className={inputClass}
            />

            <div className="relative">
              <select
                id="companySize"
                value={formState.companySize}
                onChange={(e) =>
                  setField("companySize", e.target.value as CompanySize)
                }
                required
                className={selectClass}
              >
                <option value="" disabled>
                  Select company size
                </option>
                <option value="1-50">1–50 employees</option>
                <option value="51-200">51–200 employees</option>
                <option value="201-500">201–500 employees</option>
                <option value="501-1000">501–1,000 employees</option>
                <option value="1001+">1,001+ employees</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-red-600">
                ▾
              </span>
            </div>

            <div className="relative">
              <select
                id="department"
                value={formState.department}
                onChange={(e) =>
                  setField("department", e.target.value as Department)
                }
                required
                className={selectClass}
              >
                <option value="" disabled>
                  Select department
                </option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="People Ops">People Ops</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-red-600">
                ▾
              </span>
            </div>

            <fieldset>
              <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Product Interest
              </legend>
              <div className="flex flex-col gap-1.5">
                {(
                  [
                    "C.A.R.B. Fleet",
                    "PantryOS",
                    "CrumbTrail Analytics",
                  ] as Product[]
                ).map((product) => (
                  <label
                    key={product}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formState.productInterest.includes(product)}
                      onChange={() => toggleProduct(product)}
                      className="accent-red-600"
                    />
                    {product}
                  </label>
                ))}
              </div>
            </fieldset>

            {isFinance && (
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.financeDisclaimer}
                  onChange={(e) =>
                    setField("financeDisclaimer", e.target.checked)
                  }
                  className="mt-0.5 accent-red-600"
                  required
                />
                I acknowledge that SnackOverflow is not liable for audit errors
                caused by sugar rushes.
              </label>
            )}

            {wantsCarbFleet && (
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.flatFloorsConfirmed}
                  onChange={(e) =>
                    setField("flatFloorsConfirmed", e.target.checked)
                  }
                  className="mt-0.5 accent-red-600"
                  required
                />
                I confirm that our office floors are entirely flat and
                wheelchair accessible.
              </label>
            )}

            <p className="text-xs text-gray-400 leading-snug">
              By clicking &ldquo;Get Started,&rdquo; I agree to receive
              marketing communications.
            </p>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="bg-[#eb1700ff] text-white font-semibold rounded-full px-6 py-2.5 hover:bg-[#d91400ff] transition-colors text-sm cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default LeadCaptureForm;
