import {
  IconArrowRight,
  IconBrandWhatsapp,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { actionErrorMessage, useActionMutation } from "@agent-native/core/client/hooks";

import { STORE, whatsappHref } from "@/lib/store";
export function meta() {
  return [
    { title: "Contact Us | Sharda Mica Palace" },
    {
      name: "description",
      content:
        "Contact Sharda Mica Palace at Ukhari Chowk, MR 4 Road, Jabalpur for retail and wholesale enquiries.",
    },
  ];
}
const types = [
  "Homeowner",
  "Carpenter",
  "Furniture Maker",
  "Contractor",
  "Interior Professional",
  "Retailer / Wholesale Buyer",
  "Other",
];
export default function ContactPage() {
  const [ready, setReady] = useState("");
  const [fallbackDraft, setFallbackDraft] = useState("");
  const [error, setError] = useState("");
  const saveEnquiry = useActionMutation("create-store-enquiry");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (key: string) => String(form.get(key) || "").trim();
    const message = `Namaste, I would like to enquire with Sharda Mica Palace.\n\nName: ${get("name")}\nMobile: ${get("mobile")}\nCustomer type: ${get("type")}\nProduct/category: ${get("category")}\nRequired quantity: ${get("quantity")}\nSize/specification: ${get("specification") || "Not specified"}\nAdditional requirements: ${get("requirements") || "None"}`;
    setError("");
    try {
      await saveEnquiry.mutateAsync({
        source: "contact",
        customerName: get("name"),
        customerPhone: get("mobile"),
        customerType: get("type"),
        message,
        consent: get("consent") === "on",
        website: get("website"),
      });
      setReady(message);
      setFallbackDraft("");
    } catch (caught) {
      setFallbackDraft(message);
      setError(actionErrorMessage(caught) ?? "We could not save your enquiry. Please try again or contact the store directly.");
    }
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-6 text-xs text-[#77786f]">
        <Link to="/">Home</Link>
        <span className="px-2">/</span>Contact
      </nav>
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <section>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
            Talk to our team
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-[#34452e]">
            Contact Sharda Mica Palace
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#62635c]">
            Get in touch for product details, current pricing and retail or
            wholesale enquiries.
          </p>
          <div className="mt-8 space-y-5">
            <div className="flex gap-3">
              <IconMapPin className="mt-0.5 text-[#78945a]" size={20} />
              <div>
                <h2 className="text-sm font-semibold text-[#34452e]">
                  Address
                </h2>
                <p className="mt-1 text-sm leading-5 text-[#62635c]">
                  {STORE.address}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <IconPhone className="mt-0.5 text-[#78945a]" size={20} />
              <div>
                <h2 className="text-sm font-semibold text-[#34452e]">
                  Telephone & mobile
                </h2>
                <div className="mt-1 grid gap-1 text-sm">
                  <a
                    className="text-[#55574f] underline underline-offset-2"
                    href="tel:+917614921170"
                  >
                    Telephone: {STORE.phone}
                  </a>
                  <a
                    className="text-[#55574f] underline underline-offset-2"
                    href="tel:+919424312979"
                  >
                    Mobile: {STORE.mobile}
                  </a>
                  <a
                    className="text-[#55574f] underline underline-offset-2"
                    href="tel:+919039012979"
                  >
                    Additional mobile: {STORE.alternateMobile}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <IconMail className="mt-0.5 text-[#78945a]" size={20} />
              <div>
                <h2 className="text-sm font-semibold text-[#34452e]">Email</h2>
                <a
                  className="mt-1 block text-sm text-[#55574f] underline underline-offset-2"
                  href="mailto:shardamicapalace@gmail.com"
                >
                  {STORE.email}
                </a>
              </div>
            </div>
            <a
              href={whatsappHref(
                "Namaste, I would like to contact Sharda Mica Palace.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#34452e] px-4 py-3 text-sm font-semibold text-white"
            >
              <IconBrandWhatsapp size={18} /> WhatsApp the store
            </a>
          </div>
        </section>
        <section className="border border-[#e4dfd2] bg-white p-5 sm:p-7">
          <h2 className="font-serif text-2xl font-semibold text-[#34452e]">
            Retail & wholesale enquiry
          </h2>
          <p className="mt-1 text-sm text-[#62635c]">
            Your enquiry is saved for the store team. Review the message and send it in WhatsApp to complete the handoff.
          </p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label>Leave this field blank<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold">
                Full Name *
                <input
                  name="name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="mt-1 block w-full border border-[#ddd7ca] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#78945a]"
                />
              </label>
              <label className="text-xs font-semibold">
                Mobile Number *
                <input
                  name="mobile"
                  required
                  type="tel"
                  inputMode="tel"
                  pattern="[+0-9 ()-]{8,18}"
                  title="Enter a valid phone number"
                  autoComplete="tel"
                  className="mt-1 block w-full border border-[#ddd7ca] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#78945a]"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold">
                Customer Type *
                <select
                  name="type"
                  required
                  defaultValue=""
                  className="mt-1 block w-full border border-[#ddd7ca] bg-white px-3 py-2.5 text-sm font-normal"
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {types.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold">
                Product or Category *
                <input
                  name="category"
                  required
                  maxLength={120}
                  placeholder="e.g. plywood, laminates"
                  className="mt-1 block w-full border border-[#ddd7ca] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#78945a]"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold">
                Required Quantity *
                <input
                  name="quantity"
                  required
                  maxLength={80}
                  placeholder="Enter quantity or approximate requirement"
                  className="mt-1 block w-full border border-[#ddd7ca] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#78945a]"
                />
              </label>
              <label className="text-xs font-semibold">
                Size or Specification{" "}
                <span className="font-normal">(optional)</span>
                <input
                  name="specification"
                  maxLength={160}
                  className="mt-1 block w-full border border-[#ddd7ca] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#78945a]"
                />
              </label>
            </div>
            <label className="block text-xs font-semibold">
              Additional Requirements
              <textarea
                name="requirements"
                rows={3}
                maxLength={500}
                className="mt-1 block w-full resize-y border border-[#ddd7ca] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#78945a]"
              />
            </label>
            <label className="flex items-start gap-2 text-xs leading-5 text-[#55574f]">
              <input name="consent" type="checkbox" required className="mt-1 accent-[#34452e]" />
              <span>I agree that Sharda Mica Palace stores these details to review and respond to my enquiry. See the <Link to="/privacy" className="font-semibold underline">Privacy Policy</Link>.</span>
            </label>
            {error && <p role="alert" className="border-l-2 border-[#a44d38] bg-[#fbefeb] px-3 py-2 text-sm text-[#783a2b]">{error}</p>}
            <button disabled={saveEnquiry.isPending} className="bg-[#34452e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#263421] disabled:cursor-wait disabled:opacity-60">
              {saveEnquiry.isPending ? "Saving enquiry…" : "Save enquiry and prepare WhatsApp"}
            </button>
          </form>
          {ready && (
            <div
              role="status"
              className="mt-5 border-l-2 border-[#78945a] bg-[#eff1e8] p-4"
            >
              <p className="text-sm font-semibold text-[#34452e]">
                Your enquiry is saved in the store inbox. Review the draft and send it in WhatsApp; saving here does not send the WhatsApp message.
              </p>
              <a
                href={whatsappHref(ready)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#34452e] underline underline-offset-4"
              >
                Review and open WhatsApp
                <IconArrowRight size={16} />
              </a>
            </div>
          )}
          {fallbackDraft && error && (
            <a href={whatsappHref(fallbackDraft)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#34452e] underline underline-offset-4">
              Open WhatsApp without saving <IconArrowRight size={16} />
            </a>
          )}
        </section>
      </div>
    </div>
  );
}
