# Flowcharting Plugin — Complete Setup Guide

## Step 1: Create a Diagram in Draw.io

1. Go to [app.diagrams.net](https://app.diagrams.net) (Draw.io)
2. Create your floor plan, network diagram, or any schematic
3. **Important**: Note the shape names/labels you use — these become your cell identifiers
4. Export: **File → Export as → XML** (uncompressed) or just **Ctrl+C** the XML

## Step 2: Create the Dashboard

1. In Grafana: **+ → New Dashboard → Add visualization**
2. Select the **Flowcharting** panel type
3. Add your **data source** (CSV, InfluxDB, Prometheus, etc.)

## Step 3: Paste the Diagram

In the panel editor sidebar:
- Find **Flowchart Source → Content**
- Paste your Draw.io XML

## Step 4: Add Rules

Each rule connects a **metric** to **diagram cells**. Click **Add Rule** to create one.

### Rule Structure:

```
Rule
├── Metric (which data to use)
│   ├── Name: display name
│   ├── Alias/Pattern: regex to match the metric/series name
│   └── Aggregation: last, first, min, max, avg, sum, count
│
├── Thresholds (when to change colors)
│   ├── OK color (green): below threshold 1
│   ├── Warning color (orange): between threshold 1 and 2
│   └── Critical color (red): above threshold 2
│
├── Shape Maps (change cell colors)
│   ├── Pattern: cell ID or label to target
│   ├── Target: fillColor, strokeColor, fontColor, bgColor
│   └── When: always, ok, warning, critical, never
│
├── Text Maps (replace cell text with values)
│   ├── Pattern: cell ID or label to target
│   └── Template: /.*/ (replace all) or ${_formattedValue}
│
├── Link Maps (make cells clickable)
│   ├── Pattern: cell ID or label to target
│   ├── URL: destination link
│   └── Target: _blank (new tab) or _self (same tab)
│
└── Event Maps (animations)
    ├── Pattern: cell ID or label
    └── Animation: blink, fade, rotate
```

---

## Example: Temperature Monitoring Room

**Scenario**: You have a room "Server Room" in your diagram and a metric `server_room_temp` returning `32.5`.

### Rule Configuration:

| Field | Value |
|---|---|
| **Name** | Server Room Temperature |
| **Alias** | `server_room_temp` |
| **Aggregation** | `last` |
| **Unit** | `celsius` |
| **Thresholds** | `25` (warning), `35` (critical) |
| **Colors** | Green → Orange → Red |

### Shape Map:

| Pattern | Target | When |
|---|---|---|
| `Server Room` | `fillColor` | `always` |

This makes the room shape turn **green** (<25°C), **orange** (25-35°C), or **red** (>35°C).

### Text Map:

| Pattern | Template |
|---|---|
| `Server Room` | `/.*/` |

This replaces the room label text with `32.5 celsius`.

### Link Map:

| Pattern | URL | Target |
|---|---|---|
| `Server Room` | `https://grafana.example.com/d/server-details` | `_blank` |

Clicking the room opens the detailed dashboard.

---

## Finding Cell IDs

**Method 1**: Open your Draw.io XML and search for `id=`:
```xml
<mxCell id="zbHL4nb-8s-5tmxz17gR-137" value="Server Room" .../>
```
Here `zbHL4nb-8s-5tmxz17gR-137` is the cell ID, `Server Room` is the label.

**Method 2**: Use the cell **label text** as the pattern — the plugin matches both cell IDs and labels:
- Pattern `Server Room` → matches the cell with that label
- Pattern `Server.*` → matches any cell whose ID or label starts with "Server"
- Pattern `.*` → matches ALL cells

---

## Pattern Matching Reference

| Pattern | Matches |
|---|---|
| `Server Room` | Exact cell ID or label "Server Room" |
| `/Server.*/` | Regex: any cell containing "Server..." |
| `/EB0[0-9]+/` | Regex: EB0 followed by digits |
| `42` | Cell with ID "42" |
| `.*` | All cells |

---

## All Shape Map Targets

| Target | Effect |
|---|---|
| `fillColor` | Background fill color of the shape |
| `strokeColor` | Border/outline color |
| `fontColor` | Text color inside the shape |
| `bgColor` | Background behind text |

---

## All "When" Conditions

| When | Applies if... |
|---|---|
| `always` | Always applied regardless of threshold |
| `ok` | Value is in OK range (green/level 0) |
| `warning` | Value is in Warning range (orange/level 1) |
| `critical` | Value is in Critical range (red/level 2) |
| `never` | Never applied (disabled) |

---

## Text Map Templates

| Template | Result |
|---|---|
| `/.*/` | Replace all text with metric value (e.g., "32.5 celsius") |
| `${_formattedValue}` | Just the formatted value |
| `Temp: ${_formattedValue}` | "Temp: 32.5 celsius" |
| `${_value}` | Raw numeric value |
| `${_level}` | Threshold level (0, 1, 2) |
| `${_color}` | Current color hex |
| `${_ruleName}` | Rule name |

---

## Tooltip Options

In the panel options under **Tooltip**:

| Option | Effect |
|---|---|
| `enabled` | Show/hide tooltip on hover |
| `showMetric` | Show rule name |
| `showValue` | Show formatted value |
| `showGraph` | Show sparkline mini-graph |
| `showTimestamp` | Show last update time |

---

## Quick-Start Recipe: Multi-Room Floor Plan

1. **Draw rooms** in Draw.io, label each one (e.g., "Room A", "Room B")
2. **Export XML**, paste into the panel
3. **Add data source** with temperature metrics per room
4. **For each room**, create a rule:
   - Alias = metric name (e.g., `room_a_temp`)
   - Shape Map: pattern=`Room A`, target=`fillColor`, when=`always`
   - Text Map: pattern=`Room A`, template=`/.*/`
   - Link Map: pattern=`Room A`, url=`/d/room-details?var-room=A`
   - Thresholds: 22 (warning), 28 (critical)
5. **For buttons**, create rules with no metric alias:
   - Shape Map: pattern=`MyButton`, target=`fillColor`, when=`always`
   - Link Map: pattern=`MyButton`, url=`https://example.com`, when=`always`

---

## Tips

- Rules are processed **in order** — later rules override earlier ones for the same cell
- Use **Ctrl+Shift+R** after deploying plugin updates to clear browser cache
- **Edit mode** intercepts clicks — always test interactions in **view mode**
- Each cell can have multiple shape maps (e.g., fillColor + strokeColor from different rules)
- Button-only rules (no data) work if link/shape maps use `when: always`
