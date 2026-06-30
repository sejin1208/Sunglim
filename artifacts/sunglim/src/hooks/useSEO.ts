import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description: string;
  canonical?: string;
}

export function useSEO({ title, description, canonical }: SEOOptions) {
  useEffect(() => {
    document.title = title;

    let desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", description);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && canonical) ogUrl.setAttribute("content", canonical);

    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canon && canonical) canon.href = canonical;
  }, [title, description, canonical]);
}
