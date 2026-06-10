---
name: account-customerclass-meaning
description: Meaning of accounts.customerClass codes — how to tell new vs existing customers in the BI dashboard
metadata:
  type: project
---

In `accounts` (CRM), `customerClass` is the source of truth for "đã mua sản phẩm / khách hàng cũ" — the `deals` table is empty test data (4 rows) and `customerSince` is blank everywhere, so neither can be used.

Code meanings (confirmed by user 2026-06-02):
- `C`, `C_VIP` = **Khách hàng** — the ONLY customer classes (paying/existing, has bought). `activeServiceLines` is set almost only on these.
- `P` = Partner — explicitly NOT a customer (user: "chỉ C/C_VIP mới là khách hàng").
- `L_SMALL`, `L_BIG` = still just a Lead (not yet bought).
- empty = account exists but unclassified.

A lead links to a company via `leads.accountId`. Derived `crm_status` (webapp/server.py `build_view`) has just 3 buckets: accountId null → "Chưa có account"; class C/C_VIP → "Khách hàng"; everything else with an account (incl. P) → "Có account" (prospect, chưa mua). Surfaced in the person list (index.html) as a colored badge + a clickable "CRM" breakdown dimension.
