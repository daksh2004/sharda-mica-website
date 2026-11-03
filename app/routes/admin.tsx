import {
  IconArrowUpRight,
  IconBuildingStore,
  IconCheck,
  IconClipboardList,
  IconDownload,
  IconLayoutDashboard,
  IconPackage,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { actionErrorMessage, useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { uploadEditorImage } from "@agent-native/core/client/uploads";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { STORE, categories, useCatalogProducts } from "@/lib/store";
import { downloadEnquiryPdf, type EnquiryPdfRecord } from "@/lib/enquiry-pdf";

const sections = [
  { id: "overview", label: "Overview", icon: IconLayoutDashboard },
  { id: "catalog", label: "Product catalog", icon: IconPackage },
  { id: "enquiries", label: "Enquiries", icon: IconClipboardList },
  { id: "store-profile", label: "Store profile", icon: IconBuildingStore },
];

export function meta() {
  return [
    { title: "Admin Dashboard | Sharda Mica Palace" },
    {
      name: "description",
      content: "Preview the Sharda Mica Palace product catalog and store details.",
    },
  ];
}

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState<(typeof categories)[number]>(categories[0]);
  const [productDescription, setProductDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [productError, setProductError] = useState("");
  const [productSaved, setProductSaved] = useState("");
  const [productToRemove, setProductToRemove] = useState<{ id: string; name: string } | null>(null);
  const [productDeleteError, setProductDeleteError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState<"all" | "new" | "reviewed">("all");
  const [enquiryPage, setEnquiryPage] = useState(0);
  const [enquiryError, setEnquiryError] = useState("");
  const [exportDate, setExportDate] = useState("");
  const [exportJob, setExportJob] = useState<{
    id: number;
    date: string;
    status: "all" | "new" | "reviewed";
  } | null>(null);
  const [exportOffset, setExportOffset] = useState(0);
  const [exportRows, setExportRows] = useState<EnquiryPdfRecord[]>([]);
  const [exportError, setExportError] = useState("");
  const exportJobId = useRef(0);
  const processedExportPage = useRef("");
  const catalog = useCatalogProducts();
  const productQuery = useActionQuery("list-store-products", {});
  const enquiryQuery = useActionQuery("list-store-enquiries", {
    limit: 50,
    offset: enquiryPage * 50,
    status: enquiryStatus,
  });
  const exportQuery = useActionQuery(
    "list-store-enquiries-by-date",
    {
      date: exportJob?.date ?? "1970-01-01",
      status: exportJob?.status ?? "all",
      limit: 100,
      offset: exportOffset,
    },
    {
      enabled: Boolean(exportJob),
      queryKeyScope: [exportJob?.id, exportOffset],
    },
  );
  const addProduct = useActionMutation("create-store-product");
  const removeProduct = useActionMutation("delete-store-product");
  const updateEnquiry = useActionMutation("update-store-enquiry-status");
  const enquiryRows = enquiryQuery.data?.records ?? [];
  const enquiryTotal = enquiryQuery.data?.total ?? 0;
  const newEnquiryCount = enquiryQuery.data?.newTotal ?? 0;
  useEffect(() => {
    if (!photoPreview.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  useEffect(() => {
    setExportDate(
      new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date()),
    );
  }, []);

  useEffect(() => {
    if (
      !exportJob ||
      exportQuery.isPending ||
      exportQuery.isFetching ||
      !exportQuery.data
    ) {
      return;
    }

    const pageKey = `${exportJob.id}:${exportOffset}`;
    if (processedExportPage.current === pageKey) return;
    processedExportPage.current = pageKey;

    const { records, total } = exportQuery.data;
    if (total === 0) {
      setExportError("There are no enquiries for the selected date and status.");
      setExportJob(null);
      setExportRows([]);
      return;
    }

    const allRows = [...exportRows, ...records];
    if (allRows.length >= total || records.length === 0) {
      void downloadEnquiryPdf(allRows.slice(0, total), exportJob.date, exportJob.status)
        .then(() => {
          setExportJob(null);
          setExportRows([]);
          setExportOffset(0);
        })
        .catch((error: unknown) => {
          setExportError(
            error instanceof Error
              ? error.message
              : "The PDF could not be prepared. Please try again.",
          );
          setExportJob(null);
          setExportRows([]);
          setExportOffset(0);
        });
      return;
    }

    setExportRows(allRows);
    setExportOffset(allRows.length);
  }, [exportJob, exportOffset, exportQuery.data, exportQuery.isFetching, exportQuery.isPending, exportRows]);

  useEffect(() => {
    if (!exportJob || !exportQuery.error) return;
    setExportError(
      actionErrorMessage(exportQuery.error) ?? "The enquiries could not be loaded for this date. Please try again.",
    );
    setExportJob(null);
    setExportRows([]);
    setExportOffset(0);
  }, [exportJob, exportQuery.error]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return catalog.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      return (
        matchesSearch &&
        (category === "All categories" || product.category === category)
      );
    });
  }, [search, category, catalog]);

  async function uploadProductPhoto(file: File | undefined) {
    setPhotoError("");
    setPhotoUrl("");
    setPhotoPreview("");
    if (!file) return;
    if (!/(image\/jpeg|image\/png|image\/webp)/i.test(file.type)) {
      setPhotoError("Choose a JPG, PNG, or WebP product photo.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError("Choose a photo smaller than 8 MB.");
      return;
    }
    const localPreview = URL.createObjectURL(file);
    setPhotoPreview(localPreview);
    setUploadingPhoto(true);
    try {
      const uploaded = await uploadEditorImage(file);
      setPhotoUrl(uploaded.src);
      setPhotoPreview(uploaded.src);
    } catch (error) {
      setPhotoError(actionErrorMessage(error) ?? (error instanceof Error ? error.message : "Photo upload failed. Connect managed image storage and try again."));
      setPhotoPreview("");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProductError("");
    setProductSaved("");
    try {
      await addProduct.mutateAsync({
        name: productName.trim(),
        category: productCategory,
        description: productDescription.trim(),
        imageUrl: photoUrl,
      });
      setProductName("");
      setProductDescription("");
      setPhotoPreview("");
      setPhotoUrl("");
      setProductSaved("Product added to the customer catalog.");
      setShowAddProduct(false);
    } catch (error) {
      setProductError(actionErrorMessage(error) ?? "The product could not be saved. Check the details and try again.");
    }
  }

  async function markReviewed(id: string) {
    setEnquiryError("");
    try {
      await updateEnquiry.mutateAsync({ id, status: "reviewed" });
    } catch (error) {
      setEnquiryError(actionErrorMessage(error) ?? "This enquiry could not be updated. Please refresh and try again.");
    }
  }

  async function confirmRemoveProduct() {
    if (!productToRemove) return;
    setProductDeleteError("");
    try {
      await removeProduct.mutateAsync({ id: productToRemove.id });
      setProductSaved(`${productToRemove.name} was removed from the customer catalog.`);
      setProductToRemove(null);
    } catch (error) {
      setProductDeleteError(actionErrorMessage(error) ?? "The product could not be removed. Refresh the page and try again.");
    }
  }

  function startEnquiryExport() {
    if (!exportDate || exportJob) return;
    setExportError("");
    setExportRows([]);
    setExportOffset(0);
    exportJobId.current += 1;
    setExportJob({
      id: exportJobId.current,
      date: exportDate,
      status: enquiryStatus,
    });
  }

  return (
    <main className="min-h-screen bg-[#f5f3ec] text-[#292b25]">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col md:flex-row">
        <aside className="w-full border-b border-[#e5e1d6] bg-[#fffdf7] md:w-64 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-5 py-5 md:block md:px-6 md:py-7">
            <Link to="/" className="flex items-center gap-3" aria-label="Sharda Mica Palace home">
              <img
                src="/brand/sharda-mica-palace-logo.png"
                alt="Sharda Mica Palace"
                className="h-12 w-32 object-contain sm:w-40"
              />
            </Link>
            <span className="rounded-full bg-[#f3eee1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#745a32] md:mt-6 md:inline-flex">
              Private admin
            </span>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3 md:pb-0" aria-label="Admin sections">
            {sections.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#65665f] transition hover:bg-[#f2efe6] hover:text-[#34452e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9a7b4f]"
              >
                <Icon size={18} stroke={1.8} />
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden px-6 py-8 md:block">
            <div className="border-t border-[#e7e2d6] pt-5">
              <p className="text-xs leading-5 text-[#77786f]">
                Need the customer view?
              </p>
              <Link to="/" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#34452e] hover:text-[#745a32]">
                Open storefront <IconArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          <header id="overview" className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8a704a]">
                Store workspace
              </p>
              <h1 className="mt-1 font-serif text-3xl font-semibold text-[#34452e] sm:text-4xl">
                Admin dashboard
              </h1>
            </div>
            <Link
              to="/"
              className="inline-flex min-h-10 items-center gap-2 border border-[#d8d2c4] bg-[#fffdf7] px-3.5 text-sm font-semibold text-[#34452e] hover:bg-[#f3eee1]"
            >
              View storefront <IconArrowUpRight size={16} />
            </Link>
          </header>

          <section className="mt-6 border border-[#e8d9b7] bg-[#fbf7e9] px-4 py-3.5 text-sm leading-6 text-[#5d503b] sm:px-5">
            <strong className="font-semibold text-[#443b2d]">Private dashboard.</strong>{" "}
            Review website enquiries, mark them reviewed, and add photographed products to the public catalog. WhatsApp drafts still need to be sent by the customer.
          </section>

          <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Store overview">
            <StatCard label="Products in catalog" value={String(catalog.length)} detail="Shown on the customer storefront" icon={IconPackage} />
            <StatCard label="Product categories" value={String(categories.length)} detail="Available to browse" icon={IconBuildingStore} />
            <StatCard label="New enquiries" value={String(newEnquiryCount)} detail={`${enquiryTotal} inbox records in this filter`} icon={IconClipboardList} />
          </section>

          <section id="catalog" className="mt-8 scroll-mt-5 border border-[#e6e1d5] bg-[#fffdf7]">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#eee9de] px-4 py-5 sm:px-6">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#34452e]">Product catalog</h2>
                <p className="mt-1 text-sm text-[#77786f]">Add photographed products or remove any active product from the customer catalog.</p>
              </div>
              <button type="button" onClick={() => setShowAddProduct((open) => !open)} className="inline-flex min-h-10 items-center gap-2 bg-[#34452e] px-4 text-sm font-semibold text-white hover:bg-[#263421]">
                {showAddProduct ? <IconPhoto size={17} /> : <IconPlus size={17} />}
                {showAddProduct ? "Close form" : "Add product"}
              </button>
            </div>
            {productSaved && <p role="status" className="border-b border-[#d8e0ce] bg-[#eff4e9] px-5 py-3 text-sm text-[#34452e]">{productSaved}</p>}
            {showAddProduct && (
              <form onSubmit={submitProduct} className="grid gap-5 border-b border-[#eee9de] bg-[#fbfaf5] p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-[#55574f]">Product name *
                    <input required minLength={2} maxLength={120} value={productName} onChange={(event) => setProductName(event.target.value)} className="mt-1 min-h-10 w-full border border-[#dcd7ca] bg-white px-3 text-sm font-normal outline-none focus:border-[#8b7047]" placeholder="Enter the product name" />
                  </label>
                  <label className="block text-xs font-semibold text-[#55574f]">Category *
                    <select value={productCategory} onChange={(event) => setProductCategory(event.target.value as (typeof categories)[number])} className="mt-1 min-h-10 w-full border border-[#dcd7ca] bg-white px-3 text-sm font-normal outline-none focus:border-[#8b7047]">
                      {categories.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-[#55574f]">Description
                    <textarea rows={3} maxLength={500} value={productDescription} onChange={(event) => setProductDescription(event.target.value)} className="mt-1 w-full border border-[#dcd7ca] bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#8b7047]" placeholder="Short details customers should see" />
                  </label>
                  {photoError && <p role="alert" className="border-l-2 border-[#a44d38] bg-[#fbefeb] px-3 py-2 text-sm text-[#783a2b]">{photoError}</p>}
                  {productError && <p role="alert" className="border-l-2 border-[#a44d38] bg-[#fbefeb] px-3 py-2 text-sm text-[#783a2b]">{productError}</p>}
                  <button type="submit" disabled={!photoUrl || uploadingPhoto || addProduct.isPending} className="inline-flex min-h-10 items-center gap-2 bg-[#34452e] px-4 text-sm font-semibold text-white hover:bg-[#263421] disabled:cursor-not-allowed disabled:opacity-55">
                    {addProduct.isPending ? "Adding product…" : <><IconCheck size={17} /> Add to customer catalog</>}
                  </button>
                </div>
                <div>
                  <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border border-dashed border-[#b9b29f] bg-white text-center text-sm text-[#62635c] hover:border-[#8b7047]">
                    {photoPreview ? <img src={photoPreview} alt="Selected product preview" className="h-full w-full object-cover" /> : <><IconPhoto size={28} className="text-[#8a704a]" /><span className="font-semibold text-[#34452e]">{uploadingPhoto ? "Uploading photo…" : "Click to upload a real product photo"}</span><span className="px-3 text-xs">JPG, PNG, or WebP · up to 8 MB</span></>}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => void uploadProductPhoto(event.currentTarget.files?.[0])} />
                  </label>
                  <p className="mt-2 text-xs leading-5 text-[#77786f]">The photo is uploaded to managed image storage; only its hosted URL is saved with this product.</p>
                </div>
              </form>
            )}
            {productQuery.error && <p role="alert" className="border-b border-[#f0d2c9] bg-[#fbefeb] px-5 py-3 text-sm text-[#783a2b]">Additional products could not be loaded: {actionErrorMessage(productQuery.error) ?? "Please refresh the page and try again."}</p>}
            <div className="flex flex-col gap-3 border-b border-[#eee9de] p-4 sm:flex-row sm:px-6">
              <label className="relative block min-w-0 flex-1">
                <span className="sr-only">Search products</span>
                <IconSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85867d]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products or categories"
                  className="min-h-10 w-full border border-[#dcd7ca] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#8b7047] focus:ring-2 focus:ring-[#8b7047]/15"
                />
              </label>
              <label>
                <span className="sr-only">Filter by category</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="min-h-10 w-full border border-[#dcd7ca] bg-white px-3 text-sm text-[#45473f] outline-none focus:border-[#8b7047] sm:w-56"
                >
                  <option>All categories</option>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#faf8f2] text-xs font-semibold uppercase tracking-wide text-[#77786f]">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Pricing</th>
                    <th className="px-6 py-3">Availability</th>
                    <th className="px-4 py-3">Admin actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee9de]">
                  {visibleProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#fdfbf6]">
                      <td className="px-6 py-3.5 font-semibold text-[#34362f]"><span className="flex items-center gap-3">{product.photos[0]?.src ? <img src={product.photos[0].src} alt="" className="size-10 border border-[#e6e1d5] object-cover" /> : <span className="flex size-10 items-center justify-center border border-[#e6e1d5] bg-[#faf8f2] text-[#8a704a]"><IconPackage size={17} /></span>}{product.name}</span></td>
                      <td className="px-4 py-3.5 text-[#65665f]">{product.category}</td>
                      <td className="px-4 py-3.5 text-[#65665f]">Confirm by enquiry</td>
                      <td className="px-6 py-3.5 text-[#65665f]">Confirm with store</td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            setProductDeleteError("");
                            setProductToRemove({ id: product.id, name: product.name });
                          }}
                          className="inline-flex min-h-9 items-center gap-1.5 border border-[#d8bcb3] px-2.5 text-xs font-semibold text-[#8b3d2d] hover:bg-[#fbefeb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9a7b4f]"
                          aria-label={`Remove ${product.name} from the catalog`}
                        >
                          <IconTrash size={15} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visibleProducts.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-[#77786f]">No products match this search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <AlertDialog
            open={Boolean(productToRemove)}
            onOpenChange={(open) => {
              if (!open && !removeProduct.isPending) {
                setProductToRemove(null);
                setProductDeleteError("");
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this product?</AlertDialogTitle>
                <AlertDialogDescription>
                  {productToRemove?.name} will no longer appear in the customer catalog. The change applies to the storefront after it is saved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {productDeleteError && <p role="alert" className="border-l-2 border-[#a44d38] bg-[#fbefeb] px-3 py-2 text-sm text-[#783a2b]">{productDeleteError}</p>}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={removeProduct.isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={removeProduct.isPending}
                  onClick={(event) => {
                    event.preventDefault();
                    void confirmRemoveProduct();
                  }}
                  className="bg-[#9b3d2d] text-white hover:bg-[#823225]"
                >
                  {removeProduct.isPending ? "Removing…" : "Remove product"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <section id="enquiries" className="mt-6 scroll-mt-5 border border-[#e6e1d5] bg-[#fffdf7] p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#34452e]">Enquiry inbox</h2>
                <p className="mt-1 text-sm text-[#686960]">Website form submissions and product or cart requests appear here. A WhatsApp draft is not proof that a message was sent.</p>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <label className="text-xs font-semibold text-[#686960]">Show
                  <select value={enquiryStatus} onChange={(event) => { setEnquiryStatus(event.target.value as typeof enquiryStatus); setEnquiryPage(0); }} className="ml-2 min-h-10 border border-[#dcd7ca] bg-white px-3 text-sm font-normal text-[#34362f]">
                    <option value="all">All enquiries</option>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-[#686960]">Date
                  <input
                    aria-label="Date for enquiry PDF"
                    type="date"
                    value={exportDate}
                    onChange={(event) => setExportDate(event.target.value)}
                    disabled={Boolean(exportJob)}
                    className="ml-2 min-h-10 border border-[#dcd7ca] bg-white px-3 text-sm font-normal text-[#34362f] disabled:opacity-60"
                  />
                </label>
                <button
                  type="button"
                  onClick={startEnquiryExport}
                  disabled={!exportDate || Boolean(exportJob)}
                  className="inline-flex min-h-10 items-center gap-2 bg-[#34452e] px-3.5 text-sm font-semibold text-white hover:bg-[#263421] disabled:cursor-wait disabled:opacity-60"
                >
                  <IconDownload size={16} />
                  {exportJob ? "Preparing PDF…" : "Download PDF"}
                </button>
              </div>
            </div>
            {exportError && <p role="alert" className="mt-4 border-l-2 border-[#a44d38] bg-[#fbefeb] px-3 py-2 text-sm text-[#783a2b]">{exportError}</p>}
            {exportJob && <p role="status" className="mt-4 text-sm text-[#77786f]">Loading all {exportJob.status === "all" ? "matching" : exportJob.status} enquiries for {exportJob.date}…</p>}
            {enquiryError && <p role="alert" className="mt-4 border-l-2 border-[#a44d38] bg-[#fbefeb] px-3 py-2 text-sm text-[#783a2b]">{enquiryError}</p>}
            {enquiryQuery.error && <p role="alert" className="mt-4 border-l-2 border-[#a44d38] bg-[#fbefeb] px-3 py-2 text-sm text-[#783a2b]">The inbox could not be loaded: {actionErrorMessage(enquiryQuery.error) ?? "Refresh the page and try again."}</p>}
            {enquiryQuery.isPending && <p role="status" className="mt-5 text-sm text-[#77786f]">Loading inbox…</p>}
            {!enquiryQuery.isPending && enquiryRows.length === 0 && !enquiryQuery.error && <p className="mt-5 border border-dashed border-[#d8d1c3] bg-[#faf8f1] px-4 py-8 text-center text-sm text-[#686960]">No {enquiryStatus === "all" ? "website enquiries" : `${enquiryStatus} enquiries`} yet.</p>}
            {enquiryRows.length > 0 && (
              <>
                <div className="mt-5 space-y-3">
                  {enquiryRows.map((enquiry) => (
                    <article key={enquiry.id} className="border border-[#e6e1d5] bg-white p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-[#34452e]">{enquiry.customerName || (enquiry.source === "cart" ? "Enquiry cart request" : "Product enquiry")}</h3>
                          <p className="mt-1 text-xs text-[#77786f]">{enquiry.source === "contact" ? "Contact form" : enquiry.source === "cart" ? "Enquiry cart" : "Product request"} · {formatDate(enquiry.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${enquiry.status === "new" ? "bg-[#fbf0d8] text-[#795d2e]" : "bg-[#edf0e8] text-[#34452e]"}`}>{enquiry.status === "new" ? "New" : "Reviewed"}</span>
                          {enquiry.status === "new" && <button type="button" onClick={() => void markReviewed(enquiry.id)} disabled={updateEnquiry.isPending} className="text-xs font-semibold text-[#34452e] underline underline-offset-2 disabled:opacity-50">Mark reviewed</button>}
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        {enquiry.customerPhone ? <a className="w-fit text-[#34452e] underline underline-offset-2" href={`tel:${enquiry.customerPhone}`}>{enquiry.customerPhone}</a> : <span className="text-xs text-[#77786f]">No phone number provided</span>}
                        {enquiry.customerType && <span className="text-[#686960]">{enquiry.customerType}</span>}
                      </div>
                      <p className="mt-3 whitespace-pre-wrap break-words border-t border-[#eee9de] pt-3 text-sm leading-6 text-[#42443d]">{enquiry.message}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#77786f]">
                  <span>Showing {enquiryPage * 50 + 1}–{enquiryPage * 50 + enquiryRows.length} of {enquiryTotal}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEnquiryPage((page) => Math.max(0, page - 1))} disabled={enquiryPage === 0} className="border border-[#d8d2c4] px-3 py-2 text-[#34452e] disabled:opacity-40">Previous</button>
                    <button type="button" onClick={() => setEnquiryPage((page) => page + 1)} disabled={enquiryPage * 50 + enquiryRows.length >= enquiryTotal} className="border border-[#d8d2c4] px-3 py-2 text-[#34452e] disabled:opacity-40">Next</button>
                  </div>
                </div>
              </>
            )}
          </section>

          <section id="store-profile" className="mt-6 scroll-mt-5 border border-[#e6e1d5] bg-[#fffdf7] p-5 sm:p-6">
            <h2 className="font-serif text-xl font-semibold text-[#34452e]">Store profile</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <ProfileItem label="Business name" value={STORE.name} />
              <ProfileItem label="Proprietor" value={STORE.proprietor} />
              <ProfileItem label="Phone" value={STORE.phone} />
              <ProfileItem label="Mobile" value={STORE.mobile} />
              <ProfileItem label="Additional mobile" value={STORE.alternateMobile} />
              <ProfileItem label="Email" value={STORE.email} />
              <ProfileItem label="Address" value={STORE.address} />
            </dl>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 py-6 text-xs text-[#77786f]">
            <span>Sharda Mica Palace · Private admin</span>
            <Link to="/" className="inline-flex items-center gap-1 font-semibold text-[#34452e]">Back to customer storefront <IconArrowUpRight size={14} /></Link>
          </footer>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof IconPackage }) {
  return (
    <article className="border border-[#e6e1d5] bg-[#fffdf7] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#686960]">{label}</p>
        <Icon size={19} stroke={1.8} className="text-[#8a704a]" />
      </div>
      <p className="mt-3 font-serif text-3xl font-semibold text-[#34452e]">{value}</p>
      <p className="mt-1 text-xs leading-5 text-[#77786f]">{detail}</p>
    </article>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#8a704a]">{label}</dt>
      <dd className="mt-1 break-words text-sm leading-6 text-[#42443d]">{value}</dd>
    </div>
  );
}

