import {
  IconArrowRight,
  IconSearch,
  IconShoppingBag,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

import { ProductPhotoViewer } from "@/components/layout/ProductPhotoViewer";
import {
  categories,
  useCatalogProducts,
  useEnquiryCart,
} from "@/lib/store";
export function meta() {
  return [
    { title: "Products | Sharda Mica Palace" },
    {
      name: "description",
      content:
        "Browse plywood, laminates, doors, carpentry materials, modular kitchen products, louvers and adhesives.",
    },
  ];
}
export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const requestedCategory = params.get("category") ?? "All Products";
  const filter = categories.some((category) => category === requestedCategory)
    ? requestedCategory
    : "All Products";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [spec, setSpec] = useState("");
  const [notice, setNotice] = useState("");
  const products = useCatalogProducts();
  const cart = useEnquiryCart();
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = products.filter(
      (p) =>
        (filter === "All Products" || p.category === filter) &&
        (!q ||
          `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)),
    );
    return sort === "az"
      ? [...rows].sort((a, b) => a.name.localeCompare(b.name))
      : rows;
  }, [filter, query, sort]);
  function chooseFilter(value: string) {
    if (value === "All Products") setParams({});
    else setParams({ category: value });
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-6 text-xs text-[#77786f]">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="px-2">/</span>Products
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#e6dfd0] pb-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
            Browse materials
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#34452e] sm:text-4xl">
            Explore Our Product Collection
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#62635c]">
            Find plywood, laminates, doors, carpentry materials, and essential
            materials for furniture and interior projects.
          </p>
        </div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#34452e] underline underline-offset-4"
        >
          <IconShoppingBag size={18} /> Enquiry cart ({cart.count})
        </Link>
      </div>
      <div className="mt-7 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#34452e]">Categories</h2>
            <button
              onClick={() => {
                chooseFilter("All Products");
                setQuery("");
              }}
              className="text-xs text-[#745a32] underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {["All Products", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => chooseFilter(c)}
                className={`whitespace-nowrap border px-3 py-2 text-left text-sm ${filter === c ? "border-[#34452e] bg-[#34452e] font-semibold text-white" : "border-[#e3ddcf] bg-white text-[#55574f] hover:bg-[#f5f1e7]"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>
        <div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <IconSearch
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77786f]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="w-full border border-[#dcd6c9] bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#78945a] focus:ring-1 focus:ring-[#78945a]"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-[#65665f]">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-[#dcd6c9] bg-white px-3 py-3 text-sm text-[#34452e]"
              >
                <option value="featured">Relevance</option>
                <option value="az">Name A–Z</option>
              </select>
            </label>
          </div>
          {notice && (
            <div
              role="status"
              className="mt-3 flex flex-wrap items-center justify-between gap-3 border-l-2 border-[#78945a] bg-[#eff1e8] px-3 py-2 text-sm text-[#34452e]"
            >
              <span>{notice}</span>
              <Link to="/cart" className="font-semibold underline underline-offset-2">
                Review enquiry ({cart.count})
              </Link>
            </div>
          )}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((p) => (
              <article
                key={p.id}
                className="flex flex-col border border-[#e4dfd2] bg-white"
              >
                <ProductPhotoViewer photos={p.photos} name={p.name} />
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8a704a]">
                    {p.category}
                  </span>
                  <h2 className="mt-1 font-serif text-xl font-semibold text-[#34452e]">
                    {p.name}
                  </h2>
                  <p className="text-sm leading-5 text-[#66675f]">
                    {p.description}
                  </p>
                  <label className="mt-4 text-xs font-semibold text-[#55574f]">
                    Specification or requirement (optional)
                    <input
                      value={spec}
                      onChange={(e) => setSpec(e.target.value)}
                      placeholder="e.g. project requirement"
                      className="mt-1 w-full border border-[#ddd7ca] px-3 py-2 text-sm font-normal outline-none focus:border-[#78945a]"
                    />
                  </label>
                  <div className="mt-4 flex items-center justify-between border-t border-[#eee9de] pt-3">
                    <span className="text-sm font-semibold text-[#745a32]">
                      Price on Request
                    </span>
                    <span className="text-[11px] text-[#77786f]">
                      Details confirmed by store
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      cart.add(p.id, spec.trim());
                      setSpec("");
                      setNotice(`${p.name} added to your enquiry cart.`);
                      window.setTimeout(() => setNotice(""), 3500);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 bg-[#34452e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#263421]"
                  >
                    Add to Enquiry Cart
                    <IconArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {visible.length === 0 && (
            <div className="mt-6 border border-dashed border-[#d8d1c3] bg-[#faf8f1] px-5 py-14 text-center">
              <h2 className="font-serif text-xl font-semibold text-[#34452e]">
                No products match your search.
              </h2>
              <p className="mt-2 text-sm text-[#686960]">
                Try another product name or clear your filters.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  chooseFilter("All Products");
                }}
                className="mt-4 text-sm font-semibold text-[#745a32] underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-10 border-t border-[#e6dfd0] pt-5 text-xs leading-5 text-[#77786f]">
        Matching photos are shown where the store has supplied them. Product
        details, prices and availability are confirmed directly by Sharda Mica
        Palace.
      </p>
    </div>
  );
}
