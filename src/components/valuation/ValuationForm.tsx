"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatNaira } from "@/lib/format";
import {
  NIGERIAN_STATES,
  buildValuationWhatsAppMessage,
  isValidNigerianPhone,
  isValidOptionalEmail,
  normalizeNigerianPhone,
  type ValuationFormData,
} from "@/lib/valuation";

const INITIAL_DATA: ValuationFormData = {
  propertyType: "detached",
  state: "Lagos",
  city: "",
  area: "",
  bedrooms: "4",
  sizeSqm: "",
  condition: "good",
  expectedPrice: "",
  timeline: "1-3 months",
  notes: "",
  name: "",
  phone: "",
  email: "",
  consent: false,
};

const STEPS = [
  { id: 1, title: "Property" },
  { id: 2, title: "Details" },
  { id: 3, title: "Contact" },
  { id: 4, title: "Review" },
] as const;

export function ValuationForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ValuationFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const updateField = <K extends keyof ValuationFormData>(
    key: K,
    value: ValuationFormData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep = (targetStep: number): boolean => {
    const nextErrors: Record<string, string> = {};

    if (targetStep === 1) {
      if (!data.state.trim()) nextErrors.state = "Please select a state.";
      if (!data.city.trim()) nextErrors.city = "Please enter the city.";
      if (!data.area.trim())
        nextErrors.area = "Please enter the neighbourhood or area.";
    }

    if (targetStep === 2) {
      if (
        data.expectedPrice.trim() &&
        (!Number.isFinite(Number(data.expectedPrice)) ||
          Number(data.expectedPrice) <= 0)
      ) {
        nextErrors.expectedPrice = "Enter a valid amount in Naira.";
      }
    }

    if (targetStep === 3) {
      if (!data.name.trim()) nextErrors.name = "Please enter your full name.";
      if (!isValidNigerianPhone(data.phone)) {
        nextErrors.phone =
          "Enter a valid Nigerian phone number (e.g. +234 803 123 4567 or 08031234567).";
      }
      if (!isValidOptionalEmail(data.email)) {
        nextErrors.email = "Enter a valid email address or leave blank.";
      }
      if (!data.consent) {
        nextErrors.consent =
          "Please confirm consent before opening WhatsApp.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(4, s + 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    const message = buildValuationWhatsAppMessage(data);
    const url = buildWhatsAppUrl(message);
    setSubmittedMessage(message);
    setSubmittedUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    if (!submittedMessage) return;
    try {
      await navigator.clipboard.writeText(submittedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  if (submittedUrl) {
    return (
      <div className="space-y-6 rounded-[28px] border border-sand bg-ivory p-8 md:p-12">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-dusk text-ivory">
          <Check className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-3xl tracking-tight text-basalt md:text-4xl">
            Valuation brief ready in WhatsApp
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-stone">
            Your structured property details have been prepared for WhatsApp. No
            copy of your submission was stored on this website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={submittedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ember px-6 text-sm font-medium text-basalt"
          >
            <span>Open WhatsApp</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-sand bg-ivory px-6 text-sm font-medium text-basalt hover:border-basalt"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            <span>{copied ? "Copied details" : "Copy details"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubmittedUrl(null);
              setStep(1);
            }}
            className="min-h-[48px] px-4 text-sm text-dusk underline-offset-4 hover:underline"
          >
            Start another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8 rounded-[28px] border border-sand bg-ivory p-6 md:p-10"
    >
      {/* Progress indicator */}
      <nav aria-label="Valuation form steps">
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((item) => {
            const active = item.id === step;
            const completed = item.id < step;
            return (
              <li key={item.id} className="space-y-2">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    active || completed ? "bg-ember" : "bg-sand"
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    active ? "text-basalt" : "text-stone"
                  }`}
                >
                  <span className="sr-only">Step </span>
                  {item.id}. {item.title}
                </p>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step 1: Property */}
      {step === 1 && (
        <fieldset className="space-y-5">
          <legend className="font-display text-3xl tracking-tight text-basalt">
            Tell us about the property
          </legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="val-type"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Property Type
              </label>
              <select
                id="val-type"
                value={data.propertyType}
                onChange={(e) => updateField("propertyType", e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt"
              >
                <option value="detached">Detached House</option>
                <option value="duplex">Duplex</option>
                <option value="terrace">Terrace</option>
                <option value="apartment">Apartment / Penthouse</option>
                <option value="land">Titled Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="val-state"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                State
              </label>
              <select
                id="val-state"
                value={data.state}
                onChange={(e) => updateField("state", e.target.value)}
                aria-invalid={Boolean(errors.state)}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt"
              >
                {NIGERIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-xs text-red-700">{errors.state}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="val-city"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                City *
              </label>
              <input
                id="val-city"
                type="text"
                required
                placeholder="e.g. Lagos or Abuja"
                value={data.city}
                onChange={(e) => updateField("city", e.target.value)}
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? "err-city" : undefined}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt placeholder:text-stone"
              />
              {errors.city && (
                <p id="err-city" className="mt-1 text-xs text-red-700">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="val-area"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Area / Neighbourhood *
              </label>
              <input
                id="val-area"
                type="text"
                required
                placeholder="e.g. Ikoyi, Maitama, Lekki Phase 1"
                value={data.area}
                onChange={(e) => updateField("area", e.target.value)}
                aria-invalid={Boolean(errors.area)}
                aria-describedby={errors.area ? "err-area" : undefined}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt placeholder:text-stone"
              />
              {errors.area && (
                <p id="err-area" className="mt-1 text-xs text-red-700">
                  {errors.area}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="val-bedrooms"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Bedrooms
              </label>
              <select
                id="val-bedrooms"
                value={data.bedrooms}
                onChange={(e) => updateField("bedrooms", e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt"
              >
                <option value="">Not applicable (Land / Commercial)</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6+">6+</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="val-size"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Approximate Size (m²)
              </label>
              <input
                id="val-size"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="e.g. 650"
                value={data.sizeSqm}
                onChange={(e) => updateField("sizeSqm", e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt placeholder:text-stone"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="val-condition"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Condition
              </label>
              <select
                id="val-condition"
                value={data.condition}
                onChange={(e) => updateField("condition", e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt"
              >
                <option value="newly-built">Newly built</option>
                <option value="renovated">Recently renovated</option>
                <option value="good">Well maintained</option>
                <option value="needs-work">Requires renovation / redevelopment</option>
              </select>
            </div>
          </div>
        </fieldset>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <fieldset className="space-y-5">
          <legend className="font-display text-3xl tracking-tight text-basalt">
            Valuation context
          </legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="val-price"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Expected Price in ₦ (optional)
              </label>
              <input
                id="val-price"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="e.g. 450000000"
                value={data.expectedPrice}
                onChange={(e) => updateField("expectedPrice", e.target.value)}
                aria-invalid={Boolean(errors.expectedPrice)}
                aria-describedby={
                  errors.expectedPrice ? "err-price" : undefined
                }
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt placeholder:text-stone"
              />
              {errors.expectedPrice && (
                <p id="err-price" className="mt-1 text-xs text-red-700">
                  {errors.expectedPrice}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="val-timeline"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Selling Timeline / Reason
              </label>
              <select
                id="val-timeline"
                value={data.timeline}
                onChange={(e) => updateField("timeline", e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt"
              >
                <option value="within 30 days">Ready to sell within 30 days</option>
                <option value="1-3 months">Planning sale in 1–3 months</option>
                <option value="3-6 months">Exploring sale in 3–6 months</option>
                <option value="portfolio review">Portfolio / refinancing appraisal</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="val-notes"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Additional Notes (optional)
              </label>
              <textarea
                id="val-notes"
                rows={4}
                placeholder="Title document type (e.g. C of O, Governor's Consent), recent upgrades, or preferred viewing hours..."
                value={data.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className="w-full rounded-xl border border-sand bg-ivory p-4 text-sm text-basalt placeholder:text-stone"
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* Step 3: Contact */}
      {step === 3 && (
        <fieldset className="space-y-5">
          <legend className="font-display text-3xl tracking-tight text-basalt">
            Your contact details
          </legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="val-name"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Full Name *
              </label>
              <input
                id="val-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your full name"
                value={data.name}
                onChange={(e) => updateField("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "err-name" : undefined}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt placeholder:text-stone"
              />
              {errors.name && (
                <p id="err-name" className="mt-1 text-xs text-red-700">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="val-phone"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                WhatsApp / Phone (+234) *
              </label>
              <input
                id="val-phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+234 803 000 0000"
                value={data.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "err-phone" : undefined}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt placeholder:text-stone"
              />
              {errors.phone && (
                <p id="err-phone" className="mt-1 text-xs text-red-700">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="val-email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
              >
                Email (optional)
              </label>
              <input
                id="val-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "err-email" : undefined}
                className="min-h-[48px] w-full rounded-xl border border-sand bg-ivory px-4 text-sm text-basalt placeholder:text-stone"
              />
              {errors.email && (
                <p id="err-email" className="mt-1 text-xs text-red-700">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl border border-sand p-4">
                <input
                  id="val-consent"
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => updateField("consent", e.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "err-consent" : undefined}
                  className="mt-1 h-4 w-4 accent-ember"
                />
                <span className="text-xs leading-relaxed text-basalt/85">
                  I consent to MAVQESTRA PROPERTIES using these details in
                  WhatsApp to prepare my valuation in accordance with the
                  Nigeria Data Protection Act (NDPA).{" "}
                  <strong>
                    No data is stored on this website or sent to any server.
                  </strong>
                </span>
              </label>
              {errors.consent && (
                <p id="err-consent" className="mt-1 text-xs text-red-700">
                  {errors.consent}
                </p>
              )}
            </div>
          </div>
        </fieldset>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl tracking-tight text-basalt">
            Review your valuation brief
          </h2>

          <dl className="grid gap-4 rounded-[20px] border border-sand bg-sand/20 p-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone">
                Property
              </dt>
              <dd className="mt-1 font-medium text-basalt">
                {data.propertyType} · {data.condition}
                {data.bedrooms ? ` · ${data.bedrooms} bed` : ""}
                {data.sizeSqm ? ` · ${data.sizeSqm} m²` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone">
                Location
              </dt>
              <dd className="mt-1 font-medium text-basalt">
                {data.area}, {data.city}, {data.state}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone">
                Expected Price
              </dt>
              <dd className="mt-1 font-medium text-basalt">
                {data.expectedPrice.trim()
                  ? formatNaira(Number(data.expectedPrice))
                  : "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone">
                Timeline
              </dt>
              <dd className="mt-1 font-medium text-basalt">{data.timeline}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone">
                Contact
              </dt>
              <dd className="mt-1 font-medium text-basalt">
                {data.name} · {normalizeNigerianPhone(data.phone)}
                {data.email ? ` · ${data.email}` : ""}
              </dd>
            </div>
            {data.notes.trim() && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wider text-stone">
                  Notes
                </dt>
                <dd className="mt-1 text-basalt/85">{data.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between border-t border-sand pt-6">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-sand bg-ivory px-6 text-sm font-medium text-basalt hover:border-basalt"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ember px-7 text-sm font-medium text-basalt transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ember px-7 text-sm font-medium text-basalt transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span>Send via WhatsApp</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );
}
