# QuickEssentials — Backend API Endpoint Design

The frontend (`frontend/`) currently runs entirely against mock data and
`localStorage` (see `src/services/api/marketplace.ts` and `src/mocks/data.ts`).
Several call sites already carry `TODO(.NET API)` markers pointing at the
shape below. This doc defines the REST surface a backend should implement to
replace those mocks, based on what the UI actually consumes today.

Base path: `/api`. All responses JSON. Auth via `Authorization: Bearer <accessToken>`.

## Conventions

- **Pagination**: list endpoints that can grow (products, orders, reviews) accept
  `page`, `pageSize` and return the `Paginated<T>` envelope already defined in
  `frontend/src/types/common.ts`:
  ```json
  { "items": [...], "page": 1, "pageSize": 20, "total": 134, "totalPages": 7 }
  ```
- **Errors**: `{ "error": { "code": "string", "message": "string", "fields": { "fieldName": "message" } } }`
  with standard HTTP status (400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict).
- **IDs**: opaque strings (GUID/ULID), not sequential ints.
- **Auth model**: phone + password (see `AuthPages.tsx` — login/register both key off phone, not email). Two roles: `customer`, `farmer`. A separate hardcoded admin login exists client-side today (`ADMIN_PHONE`/`ADMIN_PASSWORD`) and should become a real `admin` role server-side, not a client-side check.

---

## 1. Auth

| Method | Path                        | Purpose                                     | Source                                          |
| ------ | --------------------------- | ------------------------------------------- | ----------------------------------------------- |
| POST   | `/api/auth/register`        | Create account (customer or farmer)         | `AuthPages.tsx` `RegisterPage`                  |
| POST   | `/api/auth/login`           | Phone + password login → tokens             | `AuthPages.tsx` `LoginPage`                     |
| POST   | `/api/auth/refresh`         | Exchange refresh token for new access token | `types/user.ts` `AuthTokens`                    |
| POST   | `/api/auth/logout`          | Invalidate refresh token                    | —                                               |
| POST   | `/api/auth/forgot-password` | Send reset code to phone                    | `ForgotPasswordPage`                            |
| POST   | `/api/auth/reset-password`  | Confirm code + set new password             | `ForgotPasswordPage` (code entry not yet built) |
| GET    | `/api/auth/me`              | Current user profile                        | implied by session-gated pages                  |

**Register body**

```json
{
  "role": "customer | farmer",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "address": "string",
  "password": "string",
  "farmName": "string?",
  "specialization": "string?"
}
```

`farmName`/`specialization` only apply when `role = "farmer"` and should create/attach a `Farmer` record server-side.

**Login body**: `{ "phone": "string", "password": "string" }` → `{ "user": User, "tokens": AuthTokens }`.

---

## 2. Products

Maps directly to `services/api/marketplace.ts`, which already labels the intended replacement per function.

| Method | Path                       | Purpose                                                                                                                                                                                  |
| ------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/products`            | Public catalog list, `status=active` only. Query: `search, categories[], priceMin, priceMax, location, organicOnly, sort, page, pageSize` (mirrors `ProductQuery` in `types/product.ts`) |
| GET    | `/api/products/{idOrSlug}` | Single active product                                                                                                                                                                    |
| GET    | `/api/admin/products`      | Owner's (or all, if admin) products incl. inactive/out-of-stock — same query params, no `status` filter                                                                                  |
| GET    | `/api/admin/products/{id}` | Single product regardless of status (owner/admin only)                                                                                                                                   |
| POST   | `/api/admin/products`      | Create listing (`CreateListingPage`)                                                                                                                                                     |
| PATCH  | `/api/admin/products/{id}` | Partial update — used for full edits and for quick status toggles (`ManageListingsPage` show/hide)                                                                                       |
| DELETE | `/api/admin/products/{id}` | Delete listing                                                                                                                                                                           |

`sort` values: `featured | price-asc | price-desc | newest | rating` (see `ProductSort`).

**Product shape** — matches `types/product.ts` `Product`: `id, slug, name, description, category, price, unit, stock, images[], features[], rating{average,count,distribution?}, farmerId, farmName, location, harvestDate?, status, purchaseCount, createdAt`.

Authorization: farmers can only mutate their own products (`farmerId == currentUser.id`); admin can mutate any.

### Product images

`CreateListingPage`/`EditListingPage` upload files. Add:

| Method | Path                              | Purpose                                          |
| ------ | --------------------------------- | ------------------------------------------------ |
| POST   | `/api/admin/products/{id}/images` | Multipart upload, returns image URL(s) to attach |

(Edit form currently accepts a raw image URL as a stopgap — real upload endpoint should replace that field.)

---

## 3. Categories

`DashboardPages.tsx` `ManageCategoriesPage` does full CRUD via a local `useCategories()` hook — needs a backing store.

| Method | Path                         | Purpose                                                                      |
| ------ | ---------------------------- | ---------------------------------------------------------------------------- |
| GET    | `/api/categories`            | List all categories (public, used for filters + product create/edit selects) |
| POST   | `/api/admin/categories`      | Create (admin only)                                                          |
| PATCH  | `/api/admin/categories/{id}` | Rename                                                                       |
| DELETE | `/api/admin/categories/{id}` | Delete (reject with 409 if products still reference it, or reassign)         |

Shape from `types/common.ts`/`product.ts` `Category`: `slug, name, icon, colorScheme, productCount` (`productCount` is server-computed).

---

## 4. Farmers

| Method | Path                         | Purpose                                                             |
| ------ | ---------------------------- | ------------------------------------------------------------------- |
| GET    | `/api/farmers`               | List farmers (`getFarmers()` in marketplace.ts)                     |
| GET    | `/api/farmers/{id}`          | Farmer profile                                                      |
| GET    | `/api/farmers/{id}/products` | A farmer's active listings (used from product detail / farmer page) |

Shape from `types/farmer.ts`: `id, name, avatar, location, rating, description, farmSize, productCount, specialties[{label,color}], certified, since, phone`.

---

## 5. Cart

Cart is currently pure client state (`CartContext.tsx`, in-memory, not even persisted to `localStorage`). Recommend keeping cart client-side (localStorage) for guests, but add optional server sync so a logged-in customer's cart survives across devices:

| Method | Path        | Purpose                                                              |
| ------ | ----------- | -------------------------------------------------------------------- |
| GET    | `/api/cart` | Get signed-in user's saved cart                                      |
| PUT    | `/api/cart` | Replace cart with client's current items (sync on login / on change) |

Not required for v1 — only add if cross-device cart persistence is a goal.

---

## 6. Orders / Checkout

`PaymentPage` collects delivery info and "places" an order (currently just clears cart and navigates). `OrdersPage` lists past orders from mock data.

| Method | Path                      | Purpose                                                                             |
| ------ | ------------------------- | ----------------------------------------------------------------------------------- |
| POST   | `/api/orders`             | Place an order from current cart                                                    |
| GET    | `/api/orders`             | Current user's order history (`getOrders()`)                                        |
| GET    | `/api/orders/{id}`        | Order detail / receipt (`PaymentSuccessPage` receipt view)                          |
| PATCH  | `/api/orders/{id}/status` | Farmer/admin updates status (`pending→confirmed→shipped→delivered`, or `cancelled`) |
| POST   | `/api/orders/{id}/cancel` | Customer-initiated cancellation, while still `pending`                              |

**Create order body**:

```json
{
  "items": [{ "productId": "string", "quantity": 1 }],
  "deliveryAddress": "string",
  "customerName": "string",
  "customerPhone": "string",
  "paymentMethod": "cash-on-delivery"
}
```

Server recomputes `unitPrice`/`subtotal`/`deliveryFee`/`serviceFee`/`total` from live product data — never trust client-submitted prices. Response matches `types/order.ts` `Order`: `id, reference, items[], status, subtotal, deliveryFee, serviceFee, total, deliveryAddress, paymentMethod, placedAt`. Only `cash-on-delivery` exists today; keep `paymentMethod` as an enum so other methods can be added later without a breaking change.

---

## 7. Reviews

`ReviewPage` submits product reviews after an order; there's no read/list UI yet, but `types/review.ts` defines the full shape, so the read side is clearly intended.

| Method | Path                         | Purpose                                                                                                             |
| ------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/products/{id}/reviews` | List reviews for a product (paginated)                                                                              |
| POST   | `/api/products/{id}/reviews` | Submit a review (`{ rating: 1-5, comment: string }`), tied to `currentUser` and ideally scoped to a completed order |
| POST   | `/api/reviews/{id}/helpful`  | Increment `helpfulCount`                                                                                            |

Product's `rating.average`/`rating.count`/`rating.distribution` should be recalculated server-side whenever a review is added.

---

## 8. Notifications (admin sliding-bar messages)

`ManageNotificationsPage` does full CRUD on marketing/notice messages shown site-wide — currently a local hook, needs a backing store.

| Method | Path                            | Purpose                                                       |
| ------ | ------------------------------- | ------------------------------------------------------------- |
| GET    | `/api/notifications`            | Public: enabled notifications, for the storefront sliding bar |
| GET    | `/api/admin/notifications`      | Admin: all notifications incl. disabled                       |
| POST   | `/api/admin/notifications`      | Create                                                        |
| PATCH  | `/api/admin/notifications/{id}` | Update message/icon/enabled                                   |
| DELETE | `/api/admin/notifications/{id}` | Delete                                                        |

Shape: `{ id, message, icon, enabled }` where `icon` is one of `info | truck | bolt | leaf | shield` (`NotificationIcon`).

---

## 9. Support

`SupportPage` currently just builds a WhatsApp deep link client-side — no backend call today. If ticket tracking is wanted later:

| Method | Path                    | Purpose                                                               |
| ------ | ----------------------- | --------------------------------------------------------------------- |
| POST   | `/api/support/requests` | Log a support request server-side (optional; currently WhatsApp-only) |

Not needed for parity with the current app — listed for completeness only.

---

## Suggested build order

1. **Auth** (register/login/me) — everything else needs `currentUser`.
2. **Products + Categories** — the core browse/manage flows, and the biggest chunk of existing `TODO(.NET API)` markers.
3. **Orders** — checkout is the other primary user journey.
4. **Farmers, Reviews, Notifications** — supporting data, lower risk.
5. **Cart sync, Support tickets** — only if cross-device/ticketing is actually wanted; not required for current UI parity.
