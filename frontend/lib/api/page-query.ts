export type PageQuery = {
  offset: number;
  limit: number;
  orderBy?: string;
  direction?: string;
  publicada?: boolean;
};

export function toPageParams(query: PageQuery): URLSearchParams {
  const params = new URLSearchParams({
    offset: String(query.offset),
    limit: String(query.limit),
  });
  if (query.orderBy) params.set("orderBy", query.orderBy);
  if (query.direction) params.set("direction", query.direction);
  if (query.publicada !== undefined)
    params.set("publicada", String(query.publicada));
  return params;
}
