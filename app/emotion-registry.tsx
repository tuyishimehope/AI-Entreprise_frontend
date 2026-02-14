"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { ReactNode, useState } from "react";

export default function EmotionRegistry({ children }: { children: ReactNode }) {
  const [cache] = useState(() =>
    createCache({
      key: "mui",
      prepend: true,
    }),
  );

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
