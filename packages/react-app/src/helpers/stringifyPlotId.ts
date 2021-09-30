export function stringifyPlotId(plotId: number): string {
  return "0".repeat(4 - (plotId.toString().length ?? 0)) + plotId.toString();
}
