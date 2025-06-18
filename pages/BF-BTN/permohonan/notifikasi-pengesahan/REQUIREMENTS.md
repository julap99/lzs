## Section 1 → Notifikasi (Dashboard / Tab Notifikasi)

| Field / Item              | Access | Notes                                                                 |
|---------------------------|--------|-----------------------------------------------------------------------|
| Ringkasan Notifikasi      | V      | "BQ untuk permohonan anda telah disokong. Sila semak dan beri pengesahan dalam tempoh [SLA Days]." |
| Tarikh / Masa Notifikasi  | V      | Auto display                                                          |
| Status Notifikasi         | V      | Auto track → `Belum Disahkan` / `Telah Disahkan` / `Dibatalkan`       |

👉 **Button:**  
- `[Semak & Sahkan BQ]` → Open Page **Pengesahan BQ**

---

## Section 2 → Paparan Pengesahan BQ (View after clicking Notifikasi)

| Field / Item              | Access | Notes                                                                 |
|---------------------------|--------|-----------------------------------------------------------------------|
| Ringkasan BQ              | V      | Display dalam page                                                    |
| Button `[Lihat Penuh]`    | V      | Open modal/page → paparkan full table BQ (Keterangan Kerja, Unit, Kuantiti) |
| Tarikh Sokongan           | V      | Auto display                                                          |

---

## Section 3 → Pengesahan / Catatan Maklum Balas

| Field / Item              | Access | Notes                                                                 |
|---------------------------|--------|-----------------------------------------------------------------------|
| Button "Setuju"           | C      | Klik → Update status to `Menunggu Kelulusan`                         |
| Catatan Maklum Balas      | C/U/V  | Textarea → **Required jika pilih "Tidak Setuju"**                     |
| Button "Tidak Setuju"     | C      | Klik → Update status to `Rework Required (to ETD)` → Trigger rework cycle |

---

## Section 4 → Status Pengesahan (Auto-update selepas pengesahan)

| Field                      | Access | Notes                                                  |
|----------------------------|--------|--------------------------------------------------------|
| Status Pengesahan          | U/V    | Auto update → `Menunggu Kelulusan` / `Rework Required` / `Dibatalkan` |
| Masa / Tarikh Pengesahan   | V      | Auto capture                                           |
| Catatan Maklum Balas       | V      | View-only selepas submit                               |

---

## Section 5 → SLA & Pembatalan Automatik

✅ **Sistem akan trigger SLA timer**  
Jika Pemohon tidak bertindak selepas tempoh tertentu (contoh: 30 hari):

- Update `Status Permohonan` → `Dibatalkan`
- Insert Audit Trail
- Hantar notifikasi kepada:
  - Pemohon
  - ETD
  - Panel Hartanah

---

## Section 6 → Log Audit (V)

| Field               | Access | Notes                |
|---------------------|--------|----------------------|
| Semua tindakan, masa dan catatan | V | Full audit log     |
| SLA action log      | V      | Auto captured        |
