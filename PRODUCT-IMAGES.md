# Product image uploads

- Admin endpoint: `POST /api/v1/products/image`, Bearer token with existing admin authorization.
- Request: `multipart/form-data`, exactly one file field named `image`.
- Accepted: still JPEG, PNG and WebP, up to 5 MiB and 20 million pixels.
- Response: existing `{ status, message, data }` envelope with `data.imageUrl`.
- Files are decoded and encoded to WebP (maximum 1600 × 1600, inside fit, no enlargement).
  Metadata is not copied. Random UUID filenames avoid collisions and user-controlled paths.
- Public image route: `/uploads/products/<uuid>.webp`.
- Product create/update remains JSON with the existing `imageUrl` field; no database migration is required.
- `PUBLIC_API_URL` optionally sets the public backend origin (e.g. `https://api.example.com`).
  Default for this machine is `http://localhost:3000`.

The form previews files locally and uploads only when saving. If saving the product fails
after its image was uploaded, retry uses the returned URL instead of uploading the file again.

Uploaded files persist in `uploads/products/` and are excluded from Git. Include this folder
in backups alongside MongoDB, and mount persistent storage at this path when containerizing.
Cancelling or removing an image changes the form/reference; it does not physically delete files.
Old/unreferenced files are retained to avoid deleting images used by another product.
A separate reviewed cleanup job can be added later; no automatic cleanup is installed.

Implementation references: [Multer](https://expressjs.com/en/resources/middleware/multer/)
and [Sharp](https://sharp.pixelplumbing.com/api-output/).
No test, build, or lint commands were run for this change, per user preference.

