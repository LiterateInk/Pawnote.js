export const inflate = async (input: Uint8Array): Promise<Uint8Array> => {
  if (typeof process !== "undefined") {
    if (process.versions.bun) {
      return Bun.inflateSync(input, { library: "libdeflate" });
    }
    else if (process.versions.node) {
      const { inflateRawSync } = await import("node:zlib");
      return new Uint8Array(inflateRawSync(input));
    }
  }

  const { inflateSync } = await import("fflate");
  return inflateSync(input);
};
