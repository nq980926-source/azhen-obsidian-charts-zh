declare module "markdown-tables-to-json" {
  export const Extractor: {
    extractObject(
      table: string,
      layout: "columns" | "rows",
      strict: boolean,
    ): Record<string, Record<string, unknown>>;
  };
}
