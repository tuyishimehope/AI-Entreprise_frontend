import createCache from "@emotion/cache";

const insertionPoint =
  typeof document !== "undefined"
    ? ((document.querySelector(
        'meta[name="emotion-insertion-point"]',
      ) as HTMLElement | null) ?? undefined)
    : undefined;

export const muiCache = createCache({
  key: "mui",
  insertionPoint,
  prepend: true, // VERY important
});
