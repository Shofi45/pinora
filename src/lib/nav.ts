import { useCallback } from "react";
import { useNavigate } from "react-router";

export type PageId =
  | "home"
  | "learn"
  | "sc-btn"
  | "calculate"
  | "profile"
  | "faq"
  | "documentation"
  | "admin";

export const PAGE_PATHS: Record<PageId, string> = {
  home: "/",
  learn: "/learn",
  "sc-btn": "/learn/sc-btn",
  calculate: "/calculate",
  profile: "/profile",
  faq: "/faq",
  documentation: "/dokumentasi",
  admin: "/admin",
};

export function pathToPage(pathname: string): PageId {
  if (pathname.startsWith("/learn/")) return "learn";
  if (pathname.startsWith("/dokumentasi")) return "documentation";
  const hit = (Object.entries(PAGE_PATHS) as [PageId, string][]).find(
    ([, path]) => path === pathname,
  );
  return hit ? hit[0] : "home";
}

/** Pindah halaman lalu gulir ke atas (menggantikan scrollTo di Site.tsx lama). */
export function useGo() {
  const navigate = useNavigate();
  return useCallback(
    (id: PageId) => {
      navigate(PAGE_PATHS[id] ?? "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate],
  );
}
