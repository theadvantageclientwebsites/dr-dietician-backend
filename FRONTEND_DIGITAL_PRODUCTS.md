# Frontend update — Digital products (library, preview, 12-month freebies)

Send this to the frontend team.

## What changed

| Before | Now |
|--------|-----|
| Detail returned full `fileUrl` to everyone | Full file only if `hasAccess` |
| No preview | `previewUrl` = first **2 pages** of the PDF (anyone can open) |
| After pay, nothing on home | **My library** + dashboard `library` |
| 12-month package had no extras | Admin attaches freebie products; those appear in library |

Dummy pay is still:

```http
POST /patient/payments/dummy-checkout
{ "itemType": "DIGITAL_PRODUCT", "itemId": "product_id" }
```

---

# Patient app

## Browse

`GET /patient/digital-products`  
`GET /patient/digital-products/:id`

New fields on every product:

```json
{
  "id": "product_id",
  "title": "Thyroid Diet Guide",
  "price": 299,
  "isFree": false,
  "thumbnailUrl": "/uploads/...",
  "previewUrl": "/uploads/digital-products/previews/preview-123.pdf",
  "fileUrl": null,
  "hasAccess": false,
  "accessType": null
}
```

| Field | Use |
|-------|-----|
| `previewUrl` | Always show **Preview (2 pages)** — even before buy |
| `fileUrl` | Full PDF. `null` until they own it |
| `hasAccess` | `true` → show **Open / Download** |
| `accessType` | `PURCHASED` \| `PACKAGE_FREEBIE` \| `FREE` \| `null` |

**Buy** only if `hasAccess === false` and `isFree === false`.

**Free product:** `isFree === true` → `hasAccess === true`, `fileUrl` present, no payment.

---

## My library (new screen)

```http
GET /patient/library
GET /patient/library?page=1&limit=10
```

Purchased items **plus** 12-month package freebies. Each item has `fileUrl` and `accessType`.

Put this on **profile** and a home shortcut.

## Dashboard

`GET /patient/dashboard` now includes:

```json
"library": {
  "items": [ /* up to 4 owned products */ ],
  "pagination": { "totalItems": 6, "page": 1, "limit": 4, "totalPages": 2 }
}
```

---

## Buy (dummy)

```http
POST /patient/payments/dummy-checkout
{
  "itemType": "DIGITAL_PRODUCT",
  "itemId": "product_id"
}
```

Then refresh library / product detail. `hasAccess` becomes true.

If they already own it (purchase or 12-month freebie):

```json
{ "success": false, "message": "You already have access to this product" }
```

---

# Admin

## 12-month freebies on a package

When creating/updating a package, send product IDs that 12-month buyers get free:

```http
PUT /admin/packages/:id
```

```json
{
  "freebieProductIds": ["product_id_1", "product_id_2"]
}
```

Patient `GET /patient/packages/:id` includes `freebies` (title, thumbnail, preview — **no** full file).

Show on 12-month card: “Includes: Thyroid Guide, Recipe Book”.

## PDF upload

`POST /upload/digital-product/file` now also returns `previewUrl`. Save both `fileUrl` and `previewUrl` on the product.

If they only send `fileUrl` on create/update, the backend generates a 2-page preview automatically.

---

# UI rules

1. Catalog card: thumbnail + **Preview** (`previewUrl`) + price / Free  
2. If `hasAccess` → **Read full PDF** (`fileUrl`)  
3. Else → **Buy** (dummy checkout)  
4. Library: only owned items  
5. 12-month package: after dummy pay, freebies land in library (even before doctor assignment)

---

# Endpoints

```text
GET  /patient/digital-products
GET  /patient/digital-products/:id
GET  /patient/library
GET  /patient/dashboard                 (+ library)
POST /patient/payments/dummy-checkout   (DIGITAL_PRODUCT)

PUT  /admin/packages/:id                (freebieProductIds)
POST /upload/digital-product/file       (+ previewUrl)
```
