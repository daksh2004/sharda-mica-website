import { Link } from "react-router";

import { STORE } from "@/lib/store";

export function meta() {
  return [
    { title: "About Us | Sharda Mica Palace" },
    {
      name: "description",
      content:
        "Learn about Sharda Mica Palace, a retail and wholesale business in Jabalpur with 30+ years of experience.",
    },
  ];
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="mb-6 text-xs text-[#77786f]">
        <Link to="/">Home</Link>
        <span className="px-2">/</span>About Us
      </nav>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
        About the store
      </p>
      <h1 className="mt-2 max-w-3xl font-serif text-4xl font-semibold leading-tight text-[#34452e]">
        A Trusted Name in Plywood, Laminates & Hardware for 30+ Years.
      </h1>
      <div className="mt-7 space-y-5 text-base leading-7 text-[#55574f]">
        <p>
          Sharda Mica Palace is an established retail and wholesale business
          located at Ukhari Chowk, MR 4 Road, Jabalpur, Madhya Pradesh. With
          more than 30 years of experience, the business serves customers
          looking for plywood, laminates, doors, carpentry materials, and modular
          kitchen products.
        </p>
        <p>
          The focus is to help customers find suitable materials for furniture,
          interiors and related projects. Product specifications, current
          pricing and availability are confirmed directly by the store.
        </p>
        <p>
          <strong className="text-[#34452e]">Proprietor:</strong>{" "}
          {STORE.proprietor}
        </p>
      </div>

      <section className="mt-12 grid gap-8 border-y border-[#e4dfd2] py-10 md:grid-cols-[.9fr_1.1fr] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
            Business recognition
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-[#34452e]">
            Justdial certificate
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#62635c]">
            The supplied certificate image shows Sharda Mica Palace (Vijay
            Nagar) and is dated 2023. The store address listed on this website
            is Ukhari Chowk, MR 4 Road, Jabalpur.
          </p>
          <p className="mt-3 text-xs leading-5 text-[#77786f]">
            Displayed from the business image provided to us. The certificate
            photo is not a current rating or a live review count.
          </p>
        </div>
        <img
          src="/brand/justdial-recognition-2023.png"
          alt="Photo of a Justdial certificate for Sharda Mica Palace, Vijay Nagar, dated 2023"
          className="mx-auto max-h-[600px] w-full max-w-sm border border-[#e4dfd2] bg-white object-contain shadow-sm"
          loading="lazy"
        />
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/products"
          className="bg-[#34452e] px-5 py-3 text-sm font-semibold text-white"
        >
          Explore Products
        </Link>
        <Link
          to="/contact"
          className="border border-[#b5b6a9] px-5 py-3 text-sm font-semibold text-[#34452e]"
        >
          Contact Us
        </Link>
      </div>
      <div className="mt-10 border-t border-[#e4dfd2] pt-6 text-sm text-[#62635c]">
        {STORE.address}
      </div>
    </div>
  );
}




