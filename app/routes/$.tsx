import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { Link } from "react-router";
export function meta() {
  return [{ title: "Page Not Found | Sharda Mica Palace" }];
}
export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
        404 · Page not found
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-[#34452e]">
        This page isn't available.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#62635c]">
        The link may be out of date, or the page may have moved. Browse products
        or return to the Sharda Mica Palace home page.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#34452e] px-5 py-3 text-sm font-semibold text-white"
        >
          <IconArrowLeft size={16} />
          Back to Home
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 border border-[#b5b6a9] px-5 py-3 text-sm font-semibold text-[#34452e]"
        >
          <IconSearch size={16} />
          Browse Products
        </Link>
      </div>
    </div>
  );
}
