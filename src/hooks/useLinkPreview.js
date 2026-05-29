import { useState, useEffect } from "react";

export function useLinkPreview(url) {
  const [image, setImage] = useState(undefined); // undefined = not yet resolved
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    const cacheKey = `lp_img_${url}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached !== null) {
      setImage(cached === "__none__" ? null : cached);
      return;
    }

    setLoading(true);
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((data) => {
        const img = data?.data?.image?.url ?? null;
        setImage(img);
        sessionStorage.setItem(cacheKey, img ?? "__none__");
      })
      .catch(() => {
        setImage(null);
        sessionStorage.setItem(cacheKey, "__none__");
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { image, loading };
}
