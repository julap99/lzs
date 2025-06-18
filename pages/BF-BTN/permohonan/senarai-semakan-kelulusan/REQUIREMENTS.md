## Section 1 → Maklumat Permohonan (Read-only)

| Field                      | Access | Notes                                |
|---------------------------|--------|--------------------------------------|
| ID Permohonan             | V      | Auto                                 |
| Nama Pemohon / Institusi  | V      | Auto                                 |
| Jenis Bantuan             | V      | Auto                                 |
| Status Permohonan         | U/V    | Auto update selepas keputusan        |

---

## Section 2 → Dokumen & Catatan (Read-only)

| Field                     | Access | Notes                                 |
|--------------------------|--------|---------------------------------------|
| BQ                       | V      | View-only → Button to BQ page         |
| Laporan Gambar           | V      | View-only → Button to Laporan Gambar  |
| Laporan Teknikal         | V      | View-only → Button to Laporan Teknikal|
| Catatan Pengesyoran ETD  | V      | View-only                             |
| Catatan Sokongan Hartanah| V      | View-only                             |

---

## Section 3 → Keputusan Kelulusan / Tindakan

| Field                             | Access | Notes                                                                 |
|----------------------------------|--------|-----------------------------------------------------------------------|
| Keputusan Kelulusan              | C/U/V  | Dropdown: `Lulus` / `Tolak` / `Tindakan Lanjut`                      |
| Catatan Kelulusan / Alasan Tolak | C/U/V  | **Wajib jika pilih "Tolak" atau "Tindakan Lanjut"**. Optional untuk "Lulus". |

---

## Section 4 → Button Actions

| Button    | Function                                                                 |
|-----------|--------------------------------------------------------------------------|
| [Simpan]  | Save → Insert Audit Trail → Update Status → Trigger next process         |
| [Batal]   | Close page tanpa buat perubahan                                          |

---

## Section 5 → Status & Log

| Field                  | Access | Notes                                               |
|------------------------|--------|-----------------------------------------------------|
| Status Permohonan      | U/V    | Auto update → `Lulus` / `Ditolak` / `Tangguh`       |
| Masa / Tarikh Kelulusan| V      | Auto capture                                        |
| Nama Penyemak / Pelulus| V      | Auto capture                                        |
| Log Audit              | V      | Full audit log → Dapat dilihat oleh semua pihak     |
