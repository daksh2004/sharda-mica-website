import { StorefrontLayout } from "@/components/layout/Storefront";
export function Layout({ children }: { children: React.ReactNode }) {
  return <StorefrontLayout>{children}</StorefrontLayout>;
}
