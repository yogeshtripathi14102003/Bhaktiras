import slugify from "slugify";

export function toSlug(text) {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export function ok(data, init = {}) {
  return Response.json({ success: true, data }, { status: 200, ...init });
}

export function created(data) {
  return Response.json({ success: true, data }, { status: 201 });
}

export function fail(message, status = 400, details) {
  return Response.json(
    { success: false, message, details },
    { status }
  );
}

export function paginate(searchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
