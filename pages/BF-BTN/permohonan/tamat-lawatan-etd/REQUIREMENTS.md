## Section 1 → Ringkasan Notifikasi (Dashboard / Tab Notifikasi)

| Field / Item          | Access | Notes                                                                                                            |
| --------------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| Ringkasan Notifikasi  | V      | "Pegawai ETD telah melengkapkan lawatan ke lokasi permohonan anda. Sila sahkan bahawa lawatan telah dijalankan." |
| Tarikh / Masa Lawatan | V      | Auto display                                                                                                     |
| Nama Pegawai ETD      | V      | Auto display                                                                                                     |
| Lokasi Lawatan        | V      | Auto display                                                                                                     |
| Status Notifikasi     | V      | Auto track (Belum Disahkan / Telah Disahkan)                                                                     |

👉 **Button:**  
`[Sahkan Lawatan]` → Open page Paparan Pengesahan

---

## Section 2 → Paparan Pengesahan Lawatan (Penuh selepas klik Notifikasi)

| Field / Item      | Access | Notes                                |
| ----------------- | ------ | ------------------------------------ |
| Tarikh Lawatan    | V      | Auto                                 |
| Masa Lawatan      | V      | Auto                                 |
| Nama Pegawai ETD  | V      | Auto                                 |
| Lokasi Lawatan    | V      | Auto                                 |
| Maklumat Tambahan | V      | Optional (e.g. Catatan ETD jika ada) |

👉 **Tandatangan Digital (C):**  
Pemohon turunkan tandatangan (touchscreen / mouse / signature pad)

👉 **Button:**  
`[Sahkan Lawatan]` → Commit pengesahan

---

## Section 3 → Status Pengesahan Lawatan (Auto update selepas pengesahan)

| Field                     | Access | Notes                                                       |
| ------------------------- | ------ | ----------------------------------------------------------- |
| Status Pengesahan Lawatan | U/V    | Auto update → `Lawatan Lapangan Selesai` selepas pengesahan |
| Masa / Tarikh Pengesahan  | V      | Auto capture                                                |
| Nama Pemohon              | V      | Auto capture                                                |
| Log Audit                 | V      | Auto log pengesahan untuk audit & SLA monitoring            |

---

## Section 4 → Action Button

| Button           | Function                                                               |
| ---------------- | ---------------------------------------------------------------------- |
| [Sahkan Lawatan] | Save → Insert Audit Trail → Update Status Pengesahan → Close page / UI |
| [Batal]          | Close page tanpa buat pengesahan                                       |

---

## ✅ After User Clicks `[Sahkan Lawatan]`

### Sistem akan:

- **Insert Audit Trail:**

  - ID Permohonan
  - Nama Pemohon
  - Tarikh & Masa Pengesahan
  - Tandatangan digital (captured)

- **Update Status Permohonan:**

  - `Lawatan Lapangan Selesai`
  - Visible to **Pemohon**, **ETD**, and **Pegawai**

- **Log dalam Log Audit:**
  - For audit purposes and SLA tracking
