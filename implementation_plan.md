# Neon Inventory Audit: 12-Phase Visual Manifest

This plan outlines the systematic, manual audit of 120 image assets in the `product listing` directory. The objective is to move from unreliable automated mappings to a 100% verified SKU manifest.

## Goal
Establish a definitive ground-truth inventory of unique product SKUs (designs) and map all 120 files to their respective SKUs.

## Methodology

### 1. Batch-Based Audit
The 120 files will be processed in **12 sequential batches** of 10 files each.
- **Order:** Files will be sorted alphabetically by filename to ensure consistency.
- **Verification:** Every file will be opened and visually inspected to identify the actual product design.

### 2. Incremental Manifest
A file named `final_sku_manifest.md` will be created in the workspace root and updated after every batch.
- **SKU Definition:** A unique visual design (e.g., "Monaco Track") is 1 SKU, regardless of how many photos of it exist.
- **Mapping:** Each entry in the manifest will list the unique SKU name and all associated filenames found across all batches.

## Phase Schedule

| Phase | Files | Task |
|---|---|---|
| **Batch 1** | 1–10 | Initial SKUs identification & Manifest creation |
| **Batch 2** | 11–20 | Map to existing or add new SKUs |
| **Batch 3** | 21–30 | Map to existing or add new SKUs |
| **Batch 4** | 31–40 | Map to existing or add new SKUs |
| **Batch 5** | 41–50 | Map to existing or add new SKUs |
| **Batch 6** | 51–60 | Map to existing or add new SKUs |
| **Batch 7** | 61–70 | Map to existing or add new SKUs |
| **Batch 8** | 71–80 | Map to existing or add new SKUs |
| **Batch 9** | 81–90 | Map to existing or add new SKUs |
| **Batch 10** | 91–100 | Map to existing or add new SKUs |
| **Batch 11** | 101–110 | Map to existing or add new SKUs |
| **Batch 12** | 111–120 | Final Reconciliation & Exact SKU Count |

## Verification Plan
- **Duplicate Check:** Use filenames and visual hashes to ensure no image is left unmapped or mapped twice.
- **Physical Count:** The final manifest will conclude with a definitive "Total Unique SKUs" number.

---

**Please approve this plan to begin Batch 1 (Files 1-10).**
