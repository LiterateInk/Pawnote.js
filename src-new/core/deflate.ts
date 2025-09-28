export const deflate = async (input: Uint8Array): Promise<Uint8Array> => {
  if (typeof process !== "undefined") {
    if (process.versions.bun) {
      return Bun.deflateSync(input, { library: "libdeflate" });
    }
    else if (process.versions.node) {
      const { deflateRawSync } = await import("node:zlib");
      return new Uint8Array(deflateRawSync(input));
    }
  }

  const { deflateSync } = await import("fflate");
  return deflateSync(input);
};
