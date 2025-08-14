# Date Formatter Utility

Smart date formatting utility that solves JavaScript's inability to parse `DD-MM-YYYY` format and ensures consistent output.

## 🎯 Problem Solved

JavaScript's `Date()` constructor cannot parse `DD-MM-YYYY` format:

```javascript
// ❌ This returns "Invalid Date"
new Date("27-10-2023"); // Invalid Date!

// ✅ Our utility handles it correctly
formatDate("27-10-2023"); // "27-10-2023"
```

## 🚀 Functions

### `formatDate(dateString)`

Formats any date string to `DD-MM-YYYY` (not `DD/MM/YYYY`)

**Input Formats Supported:**

- `"27-10-2023"` → `"27-10-2023"` (our standard)
- `"2023-10-27"` → `"27-10-2023"` (ISO format)
- `"10/27/2023"` → `"27-10-2023"` (US format)
- `"2023-10-27T14:30:00"` → `"27-10-2023"` (ISO with time)

### `formatDateTime(dateTimeString)`

Formats date-time strings to `DD-MM-YYYY HH:MM`

### `convertToHTMLDateInput(dateString)`

Converts `DD-MM-YYYY` to `YYYY-MM-DD` for HTML date inputs

## 💻 Usage

```javascript
import { formatDate, convertToHTMLDateInput } from "~/utils/dateFormatter";

// Display dates in UI
<p>Tarikh: {{ formatDate(userData.tarikhLahir) }}</p>

// HTML date inputs
<FormKit
  type="date"
  :value="convertToHTMLDateInput(formData.tarikhKuatkuasa)"
/>
```

## 🛡️ Error Handling

- **Invalid dates**: Returns original string + console warning
- **Empty/null**: Returns empty string
- **Never throws errors**: Always safe to use

## 🔧 Why This Matters

1. **JavaScript Limitation**: `Date()` only understands `YYYY-MM-DD`, `MM/DD/YYYY`, etc.
2. **Our Standard**: BF-PA uses `DD-MM-YYYY` format
3. **Solution**: Utility automatically detects and converts formats
4. **Output**: Always returns `DD-MM-YYYY` (with hyphens, not slashes)