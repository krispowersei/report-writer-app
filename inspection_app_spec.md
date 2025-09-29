# Inspection App Specification (Markdown)

This document translates the whiteboard sketch into a structured, build‑ready specification you can hand to engineering. It defines **workflows**, **data schemas**, **UI behaviors**, and **question logic** to generate an app (Django backend + Supabase/Postgres DB + modern frontend).

---

## Workflow 1 — Tank Master Data

Create an app screen that captures tank metadata and writes to the database (Supabase/Postgres).

### Tank Schema (table: `tanks`)

Required unless noted.

- **tank_name** (string) — _Use your “Tank Number/name” field; e.g., “129”_
- **tank_unique_id** (string) — _Auto generated this is the primary key_
- **owner** (string)
- **facility_type** (enum/string)
- **city** (string)
- **state** (string)
- **year_built** (integer, nullable)
- **design_standard** (enum/string; e.g., API 650, API 12D)
- **manufacturer** (string, nullable)
- **product_stored** (string/enum)
- **nameplate_present** (boolean)
- **diameter_ft** (number, nullable)
- **height_ft** (number, nullable)
- **capacity_bbl** (number, nullable)
- **operating_height_ft** (number, nullable)
- **foundation** (enum/string)
- **anchors** (string/enum; include count if known)
- **shell_weld_type** (enum/string)
- **shell_number_of_courses** (integer, nullable)
- **insulation** (boolean/enum/string)
- **shell_manway** (string/enum)
- **drain** (string/enum, nullable)
- **level_gauge_type** (string/enum, nullable)
- **access_structure** (enum/string; e.g., stair, ladder, catwalk)
- **bottom_type** (enum/string; e.g., Cone up, cone down, shoveled)
- **bottom_weld** (enum/string, nullable)
- **annular_plate** (boolean/enum; N/A allowed)
- **fixed_roof_type** (enum/string; N/A allowed)
- **floating_roof_type** (enum/string; N/A allowed)
- **primary_seal** (string/enum, nullable)
- **secondary_seal** (string/enum, nullable)
- **anti_rotation_device** (boolean/enum, nullable)
- **vent_type_and_number** (string, nullable)
- **emergency_venting_type** (string, nullable)
- **roof_manway_or_hatch** (string/enum, nullable)
- **inlet_size_in** (number, nullable)
- **outlet_size_in** (number, nullable)
- **flow_rate_in_bph** (number, nullable)
- **flow_rate_out_bph** (number, nullable)
- **pressure** (string/number, nullable)
- **temperature** (string/number, nullable)
- **secondary_containment_type** (enum/string)
- **created_at** (timestamp)
- **updated_at** (timestamp)

> **Note:** Where “N/A” appears in the field description, allow `null` and provide an “N/A” toggle in the UI.

---

## Workflow 2 — Equipment & NDE Results

next screen that records survey and NDE outcomes. This app references `tanks.id`.

### 2.1 Shell Settlement Survey (table: `shell_settlement_surveys`)

- **tank_id** (fk → `tanks.id`)
- **station_count** (integer, required)
- **readings** (array of objects, required)  
  Each reading: `{ station_label: string, measurement_in: number }`
- **created_at**, **updated_at**

**UI Behavior:** Ask “How many stations?” Generate a two‑column grid:
`Station (A, B, C, …)` | `Measurement (in.)`

### 2.2 UT Results (table: `ut_results`)

- **tank_id** (fk)
- **category** (enum: `bottom`, `appurtenance`, `roof`, `shell`)
- **location** (string) — e.g., _“Bottom plate bay 4, grid C‑5”_, _“Nozzle N5 repad”_, _“Shell C2”_
- **course** (integer, nullable) — for shell UT; course numbering 1..N from `tanks.shell_number_of_courses`
- **thickness_in** (number) — measured thickness in inches
- **notes** (text, nullable)
- **created_at**, **updated_at**

**UI Behavior:**

- **Bottom UT** — add as many rows as the user needs.
- **Appurtenance UT** — pre‑seed picklist from tank schema appurtenances; allow free‑text too.
- **Roof UT** — free‑add rows.
- **Shell UT** — provide “Course” field; quick‑add rows per course. Example helper: “Course 1: 0.250, 0.249 in.”

### 2.3 Edge Settlement (table: `edge_settlement_checks`)

- **tank_id** (fk)
- **present** (boolean)
- **result** (text, nullable)
- **created_at**, **updated_at**

### 2.4 Column Plumbness (table: `column_plumbness_checks`)

- **tank_id** (fk)
- **column_id** (string/enum; e.g., `center`, `peripheral-1`)
- **plumbness_in_per_ft** (number)
- **direction** (string, nullable)
- **created_at**, **updated_at**
  > _Enter at least two readings per column._

### 2.5 Visual Inspection Results (table: `visual_findings`)

- **tank_id** (fk)
- **area** (enum/string; e.g., `shell`, `bottom extension`, `roof`, `nozzle`, `access structure`, `venting`, `coating`)
- **finding** (text) — concise statement per your phrasing guide
- **comment_type** (enum/string; e.g., `perform`, `consider`, `monitor`)
- **created_at**, **updated_at**

### 2.6 Other NDE (table: `other_nde`)

- **tank_id** (fk)
- **nde_type** (string; e.g., `MFL`, `MT`, `PT`, `RT`, `AE`)
- **result** (text)
- **created_at**, **updated_at**

---

## Workflow 3 — Executive Summary Generator

Next screen. Create a template that renders a three‑column table.

- **Column 1 — Inspection Goal** (fixed list)
- **Column 2 — Methods Employed** (select multiple from controlled list)
- **Column 3 — Results** (answers to dynamic questions; free‑text allowed)

### 3.1 Inspection Goals (fixed order)

1. Identify any current leak paths resulting from corrosion, internal or external, and identify any potential hazards.
2. Identify any risk areas for future leak path development.
3. Foundation settlement.
4. Access structure.
5. Fixed roof.
6. Floating roof (if present).
7. Venting.
8. Coating.

### 3.2 Methods Employed (controlled choices)

- 100% Visual Examination (VE) of bottom plates, corner weld, and all bottom welds for defects or corrosion.
- 100% VE of base of tank, bottom extension, and shell for corrosion, product stains, or other signs of product seepage.
- Document with digital camera.
- Ultrasonic Thickness Testing (UT) to find general or local corrosion loss.
- Note any brittle‑fracture concerns (including nozzle weld spacing) if applicable.
- Document potential findings that could affect structural or hydraulic integrity.
- Survey of the shell for settlement.
- Survey of the fixed‑roof supports for plumbness.
- VE of shell for bulges, distortion, or other verticality issues.
- Document potential findings that could affect foundation or bottom integrity.
- Thorough VE of access structure and its appurtenances.
- Thorough VE of roof (deck) and appurtenances.
- UT readings of accessible roof plates.
- VE of floating roof (if present) and appurtenances.
- VE of existing venting system.
- VE of coatings.

### 3.3 Dynamic “Results” Questions

Render yes/no with conditional text inputs as described.

#### For Goal 1

1. **Was MFL performed?** (yes/no) → If _yes_, record MFL result summary.
2. **External inspection interval:** If typical, record; if not typical, require comment “why?”
3. **Internal inspection interval:** If typical, record; if not typical, require comment “why?”
4. **UT inspection interval:** If typical, record; if not typical, require comment “why?”
5. **Add custom Q&A?** If _yes_, open a small form to append additional goal‑1 questions/answers; otherwise continue to Goal 2.

#### For Goal 2 (and Goals 3–8 use the same short pattern)

1. **Is shell UT nominal?** If _no_, require “why?”
2. **Any corroded or damaged appurtenances?** (yes/no + notes)
3. **Add custom Q&A?** If _yes_, show the same small form to append more questions/answers.

> The app should allow adding the same short question set for Goals 1–8 for speed, while still supporting goal‑specific notes. next time when a new form is created it should show the added questions

---

## Workflow 4 — Reporting View

Provide a **“Results”** page that displays information from Workflows 1–3 in a clean, modern layout (print/PDF friendly).

**Recommended layout:**

1. **Tank Summary Card** (key fields from `tanks`).
2. **Survey & NDE** accordion:
   - Shell Settlement table (station vs measurement).
   - Edge Settlement summary.
   - Column Plumbness table.
   - UT Results tables (grouped by category and course).
   - Other NDE notes.
3. **Executive Summary Table** (Goals × Methods × Results).
4. **Download** buttons: PDF, CSV (summary tables), JSON (raw records).

---

## JSON Examples (Optional)

### Tank (POST)

```json
{
  "tank_name": "129",
  "owner": "Zenis",
  "facility_type": "Terminal",
  "city": "Portland",
  "state": "OR",
  "design_standard": "API 650",
  "product_stored": "Diesel",
  "nameplate_present": true,
  "shell_number_of_courses": 8,
  "secondary_containment_type": "Concrete wall"
}
```

### Shell Settlement Readings

```json
{
  "tank_id": 1,
  "station_count": 8,
  "readings": [
    { "station_label": "A", "measurement_in": 0.45 },
    { "station_label": "B", "measurement_in": 0.43 }
  ]
}
```

### UT Result (Shell Course 1)

```json
{
  "tank_id": 1,
  "category": "shell",
  "location": "Shell C1 — north",
  "course": 1,
  "thickness_in": 0.249,
  "notes": "Within nominal; monitor at next UT interval."
}
```

---

## Acceptance Checklist

- [ ] Database tables created as above (Supabase migrations).
- [ ] CRUD screens for **tanks**, **surveys**, **UT**, **edge settlement**, **plumbness**, **visual findings**, **other NDE**.
- [ ] Executive Summary generator with fixed goals, selectable methods, and dynamic Q&A.
- [ ] Results page with export to PDF/CSV/JSON.
- [ ] “N/A” toggles and helpful examples in the UI.
- [ ] All records reference `tank_id` and show breadcrumbs back to Tank Summary.

---

### Notes

- All lists labeled “N/A allowed” should include an “N/A” chip in the UI and persist as `null` in the DB.
- For shells with multiple courses, seed the **course** picklist from `tanks.shell_number_of_courses`.
- Keep phrasing aligned with your internal style: **perform / consider / monitor**.
