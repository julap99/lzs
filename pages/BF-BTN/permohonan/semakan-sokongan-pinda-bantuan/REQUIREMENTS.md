## Section 1 → Maklumat Permohonan (Read-only)

| Field                    | Access | Notes                        |
| ------------------------ | ------ | ---------------------------- |
| ID Permohonan            | V      | Auto                         |
| Nama Pemohon / Institusi | V      | Auto                         |
| Jenis Bantuan            | U/V    | Boleh pinda jika perlu       |
| Status Permohonan        | U/V    | Auto update selepas sokongan |

---

## Section 2 → BQ (U/V)

👉 **Access:** Button `[Lihat BQ]` → Open BQ Page / Tab

| Field                | Access | Notes             |
| -------------------- | ------ | ----------------- |
| BQ Table             | V      | View-only         |
| Tandatangan Sokongan | C/U/V  | Digital signature |

---

## Section 3 → Laporan Gambar (V)

👉 **Access:** Button `[Laporan Gambar]` → Open Page

| Field               | Access | Notes     |
| ------------------- | ------ | --------- |
| Semua gambar lokasi | V      | View-only |
| Catatan gambar      | V      | View-only |

---

## Section 4 → Laporan Teknikal (V)

👉 **Access:** Button `[Laporan Teknikal]` → Open Page

| Field                   | Access | Notes     |
| ----------------------- | ------ | --------- |
| Latar Belakang          | V      | View-only |
| Keperluan               | V      | View-only |
| Cadangan                | V      | View-only |
| Nilai kerja dicadangkan | V      | View-only |

---

## Section 5 → Catatan Sokongan / Ulasan (C/U/V)

| Field                     | Access | Notes                                                    |
| ------------------------- | ------ | -------------------------------------------------------- |
| Catatan Sokongan / Ulasan | C/U/V  | Textarea → Required jika pilih **Rework** atau **Pinda** |

---

## Section 6 → Button Actions

| Button            | Function                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| [Rework]          | Save → Insert Audit Trail → Trigger Rework ke ETD (`BF-NAS-BTN-PB-MB-BDST-09`) → Status: `Rework Required` |
| [Sahkan Sokongan] | Save → Insert Audit Trail → Update Status → Trigger ke peringkat Kelulusan                                 |

---

## Section 7 → SLA & Reminder

✅ Sistem akan trigger **SLA timer**  
Jika Panel Hartanah belum bertindak selepas tempoh tertentu → sistem akan hantar:

- **Reminder kepada:** Panel Hartanah
- **Escalation kepada:** Ketua Panel Hartanah

---

## Section 8 → Log Audit (V)

| Field                              | Access | Notes          |
| ---------------------------------- | ------ | -------------- |
| Semua tindakan, masa dan catatan   | V      | Full audit log |
| Status Rework cycle (jika berlaku) | V      | View-only      |
