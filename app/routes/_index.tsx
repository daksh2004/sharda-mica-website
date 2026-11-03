import {
  IconArrowRight,
  IconBuildingStore,
  IconCheck,
  IconChevronRight,
  IconDoor,
  IconLeaf,
  IconLayersIntersect,
  IconTools,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import { Link } from "react-router";

import { categories, STORE, whatsappHref } from "@/lib/store";

export function meta() {
  return [
    { title: "Sharda Mica Palace | Plywood, Laminates & Hardware in Jabalpur" },
    {
      name: "description",
      content:
        "Plywood, laminates, doors, carpentry materials, and modular kitchen accessories in Jabalpur. Retail and wholesale enquiries welcome.",
    },
  ];
}
const categoryData = [
  {
    title: categories[0],
    desc: "Commercial plywood, block board and other board materials.",
    icon: IconLayersIntersect,
  },
  {
    title: categories[1],
    desc: "Decorative laminates and Sunmica. Ask about current designs.",
    icon: IconLeaf,
  },
  {
    title: categories[2],
    desc: "Flush doors, ISI doors and door skin options.",
    icon: IconDoor,
  },
  {
    title: categories[3],
    desc: "Hinges, door fittings and cabinet hardware.",
    icon: IconTools,
  },
  {
    title: categories[4],
    desc: "Wire baskets, tandem boxes, shutters, appliances and storage accessories.",
    icon: IconToolsKitchen2,
  },
  {
    title: categories[5],
    desc: "Charcoal and PVC louver designs for interior projects.",
    icon: IconLayersIntersect,
  },
  {
    title: categories[6],
    desc: "Wood adhesive options for carpentry and furniture work.",
    icon: IconBuildingStore,
  },
];
export default function HomeRoute() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#f4f1e6]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
              <span className="h-px w-8 bg-[#c8a779]" />
              Ukhari Chowk · Jabalpur
            </div>
            <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-tight text-[#34452e] sm:text-6xl">
              Quality Materials.
              <br />
              <span className="text-[#745a32]">Trusted for 30+ Years.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#55574f]">
              Your trusted partner for plywood, laminates, doors and hardware.
              Serving Jabalpur with materials for furniture, interior and
              building projects.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-md bg-[#34452e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#263421]"
              >
                Explore Products
                <IconArrowRight size={17} />
              </Link>
              <Link
                to="/kitchen-hardware"
                className="rounded-md border border-[#9ca28f] bg-[#fffdf5] px-5 py-3 text-sm font-semibold text-[#34452e] hover:bg-white"
              >
                Modular Kitchen & Hardware
              </Link>
              <a
                href={whatsappHref(
                  "Namaste, I would like to enquire about products from Sharda Mica Palace.",
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-3 py-3 text-sm font-semibold text-[#34452e] underline decoration-[#c8a779] underline-offset-4"
              >
                WhatsApp enquiry
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#ddd6c5] pt-6 text-sm text-[#55574f]">
              <span>
                <strong className="text-[#34452e]">30+ years</strong> of
                experience
              </span>
              <span>
                <strong className="text-[#34452e]">Retail & wholesale</strong>{" "}
                enquiries
              </span>
              <span>
                <strong className="text-[#34452e]">Jabalpur</strong> local
                business
              </span>
            </div>
          </div>
          <div className="relative min-h-[300px] overflow-hidden border border-[#ded6c4] bg-[#e7dfcb] p-5 sm:min-h-[420px]">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent 49%, #c8b896 50%, transparent 51%), linear-gradient(0deg, transparent 49%, #c8b896 50%, transparent 51%)",
                backgroundSize: "74px 74px",
              }}
            />
            <div className="absolute inset-5 flex flex-col justify-between border border-[#fffdf5]/80 p-5 sm:inset-8 sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[.2em] text-[#34452e]">
                Materials for the craft of building
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="aspect-[4/3] bg-[#a88354] p-3 text-xs font-semibold text-white sm:p-4">
                  PLYWOOD
                  <br />& BOARDS
                </div>
                <div className="aspect-[4/3] bg-[#f7f5c8] p-3 text-xs font-semibold text-[#34452e] sm:p-4">
                  LAMINATES
                  <br />& FINISHES
                </div>
                <div className="aspect-[4/3] bg-[#d8c7a8] p-3 text-xs font-semibold text-[#34452e] sm:p-4">
                  DOORS
                  <br />& MATERIALS
                </div>
                <div className="aspect-[4/3] bg-[#78945a] p-3 text-xs font-semibold text-white sm:p-4">
                  KITCHEN
                  <br />& HARDWARE
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#c5b798] pt-3 text-xs text-[#4c4d43]">
                <span>SHARDA MICA PALACE</span>
                <span>JABALPUR, M.P.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
              Explore the range
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#34452e] sm:text-4xl">
              Materials for Every Project
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#62635c]">
              Browse the categories we serve. Product details and current
              options are confirmed by our team.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#34452e] underline underline-offset-4"
          >
            All products <IconArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-px border border-[#e2ddcf] bg-[#e2ddcf] sm:grid-cols-2 lg:grid-cols-3">
          {categoryData.map(({ title, desc, icon: Icon }, index) => (
            <Link
              key={title}
              to={
                title === "Modular Kitchen"
                  ? "/kitchen-hardware"
                  : `/products?category=${encodeURIComponent(title)}`
              }
              className="group flex min-h-[185px] flex-col bg-[#fffdf5] p-6 transition hover:bg-[#f7f5ec] sm:p-7"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex size-11 items-center justify-center ${index % 2 ? "bg-[#f1ead9] text-[#745a32]" : "bg-[#e7ebdf] text-[#34452e]"}`}
                >
                  <Icon size={22} />
                </span>
                <IconChevronRight
                  size={17}
                  className="text-[#aa9c7e] transition-transform group-hover:translate-x-1"
                />
              </div>
              <h3 className="mt-5 font-serif text-xl font-semibold text-[#34452e]">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-[#66675f]">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-[#f4f1e6] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[.7fr_1.3fr] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
              Established local business
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[#34452e]">
              Experience that helps you choose with confidence.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3">
              <IconCheck className="mt-1 text-[#78945a]" size={20} />
              <div>
                <h3 className="font-semibold text-[#34452e]">
                  30+ years of experience
                </h3>
                <p className="mt-1 text-sm text-[#606158]">
                  Serving customers in Jabalpur.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <IconCheck className="mt-1 text-[#78945a]" size={20} />
              <div>
                <h3 className="font-semibold text-[#34452e]">
                  Retail & wholesale
                </h3>
                <p className="mt-1 text-sm text-[#606158]">
                  Enquiries for personal and project requirements.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <IconCheck className="mt-1 text-[#78945a]" size={20} />
              <div>
                <h3 className="font-semibold text-[#34452e]">
                  Materials for interiors
                </h3>
                <p className="mt-1 text-sm text-[#606158]">
                  Plywood, laminates, doors and more.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <IconCheck className="mt-1 text-[#78945a]" size={20} />
              <div>
                <h3 className="font-semibold text-[#34452e]">Local presence</h3>
                <p className="mt-1 text-sm text-[#606158]">
                  Ukhari Chowk, MR 4 Road, Jabalpur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col justify-between gap-5 bg-[#34452e] p-7 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#e7d8af]">
              For your next project
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
              Need materials for your next project?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
              Share your requirements for plywood, doors, laminates, carpenter
              hardware or Modular Kitchen accessories and contact our team for current
              pricing.
            </p>
          </div>
          <a
            href={whatsappHref(
              "Namaste, I would like to request a quote for my project. Please help me with current pricing and availability.",
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#f7f5c8] px-5 py-3 text-sm font-semibold text-[#34452e] hover:bg-white"
          >
            Request a quote
            <IconArrowRight size={17} />
          </a>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="border-t border-[#e4dece] pt-8 text-sm text-[#686960]">
          <h2 className="font-serif text-2xl font-semibold text-[#34452e]">
            Visit Sharda Mica Palace
          </h2>
          <p className="mt-2">{STORE.address}</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href={whatsappHref(
                "Namaste, I would like to contact Sharda Mica Palace. Please help me with my requirement.",
              )}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#34452e] underline underline-offset-4"
            >
              Contact our team on WhatsApp
            </a>
            <Link
              to="/about"
              className="font-semibold text-[#34452e] underline underline-offset-4"
            >
              About the store
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}




