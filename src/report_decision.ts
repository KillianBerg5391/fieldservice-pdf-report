export type WorkOrder = { id: string; address: string; technician: string; status: "scheduled" | "in_progress" | "complete"; photos: string[]; followUp: string | null };

export function reportMarkdown(order: WorkOrder): string {
  const photoLine = order.photos.length ? order.photos.map((p) => `- ${p}`).join("\n") : "- No photos attached";
  const followUp = order.followUp ? `\n## Technician follow-up\n${order.followUp}\n` : "\n## Technician follow-up\nNo follow-up required.\n";
  return `# Field-service report: ${order.id}\n\n- Address: ${order.address}\n- Technician: ${order.technician}\n- Dispatch status: ${order.status}\n\n## Work-order photos\n${photoLine}\n${followUp}`;
}

export function needsFollowUp(order: WorkOrder): boolean {
  return order.status !== "complete" || order.followUp !== null;
}
