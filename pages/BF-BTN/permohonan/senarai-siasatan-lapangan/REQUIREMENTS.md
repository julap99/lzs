## Section 1 → Maklumat Permohonan (Read-only)

| Field                        | Access | Notes                                                                 |
|-----------------------------|--------|-----------------------------------------------------------------------|
| ID Permohonan               | V      | Display                                                               |
| Nama Pemohon / Institusi    | V      | Display                                                               |
| Alamat                      | V      | Display                                                               |
| No IC                       | V      | Display                                                               |
| Jenis Bantuan               | V      | Display                                                               |
| SEGERA                      | V      | Checkbox                                                              |
| Tarikh Permohonan           | V      | Display                                                               |
| Status Permohonan           | V      | Display (Baru / Dalam Semakan / Tidak Lengkap / Lengkap / Menunggu Siasatan Lapangan / Lawatan Dijadualkan) |
| Tarikh Dijadualkan Lawatan  | V      | Display                                                               |
| Status Lawatan              | U/V    | Dropdown: Belum Selesai / Selesai Lawatan Lapangan                   |

---

## Section 2 → Dokumen Sokongan (Read-only)

| Field                        | Access | Notes             |
|-----------------------------|--------|-------------------|
| Quotation (baik pulih)      | V      | Preview/download  |
| Geran Tanah (bina rumah)    | V      | Preview/download  |
| Carian Rasmi Pejabat Tanah  | V      | Preview/download  |

---

## Section 3 → Draf BQ (C/U/V)

**Button:** `Tambah Baru`

| No BQ | Nama BQ                   | Status            | Action |
|-------|---------------------------|-------------------|--------|
| BQ01  | BQ MOHD ROSLI BIN SAAD    | Dalam Kelulusan   | Edit   |
| BQ02  | BQ MOHD ROSLI BIN SAAD 2  | Dalam Proses      | Edit   |

👉 **Access:** Button `[Draf BQ]` → open form page/modal

### Draf BQ Form Fields

| Field                      | Access | Notes                                             |
|---------------------------|--------|---------------------------------------------------|
| No Borang BQ / Rujukan    | V      | Auto                                              |
| Nama Pemohon & Institusi  | V      | Auto                                              |
| Alamat                    | V      | Auto                                              |
| Tarikh Siasatan           | C/U/V  | Manual input, default today                      |
| Table Senarai Item Kerja  | C/U/V  | Input editable                                   |
| Jumlah Keseluruhan BQ     | V      | Auto calculate                                   |
| Ringgit Malaysia (Perkataan) | V   | Auto generate                                    |
| Catatan Pengesyoran       | V      | Auto generate                                    |
| Disediakan Oleh           | V      | Auto capture login user                          |
| Disemak 1 / Disemak 2 / Disahkan Oleh | C/U/V | Digital signature flow                     |
| Tarikh Disemak / Disahkan | C/U/V  | Auto capture after approval                      |
| No BR                     | V      | Auto link                                        |

---

## Section 4 → Laporan Gambar (C/U/V)

👉 **Access:** Button `[Laporan Gambar]` → open page

| Field               | Access | Notes                 |
|---------------------|--------|-----------------------|
| Upload Gambar Lokasi| C/U    | Multiple file upload  |
| Catatan Gambar      | C/U    | Per gambar            |
| Masa Upload         | V      | Auto capture          |

---

## Section 5 → Laporan Teknikal (C/U/V)

👉 **Access:** Button `[Laporan Teknikal]` → open page

| Field                   | Access      | Notes                                 |
|-------------------------|-------------|---------------------------------------|
| Latar Belakang          | V (auto), C/U| From profiling, editable if needed   |
| Keperluan               | C/U         | Observation at site                  |
| Cadangan                | C/U         | Summary & proposal                   |
| Nilai Kerja Dicadangkan | V           | Auto calculate from BQ               |

---

## Section 6 → Catatan Lapangan (C/U/V)

| Field             | Access | Notes                     |
|-------------------|--------|---------------------------|
| Catatan Lapangan  | C/U    | General notes, findings   |
| Masa/Tarikh       | V      | Auto capture              |

---

## Section 7 → Status Lawatan (U/V)

| Field           | Access | Notes                              |
|------------------|--------|------------------------------------|
| Status Lawatan   | U/V    | Update to `Selesai Lawatan Lapangan` |

---

## Section 8 → Jumlah Bantuan & Catatan Pengesyoran (U/V)

| Field                | Access | Notes                                |
|----------------------|--------|--------------------------------------|
| Jumlah Bantuan       | U/V    | Ambil daripada BQ                    |
| Catatan Pengesyoran  | U/V    | Ambil daripada BQ                    |
| Arahan Kerja         | V      | 👉 Access: Button `[Lihat Arahan Kerja]` → open page <br>**Only after approval** |
| Pemantauan           | C/U/V  | 👉 Access: Button `[Urus Pemantauan]` → open page <br>**Only after approval** |

---

## Section 9 → Action Button

| Button                                      | Function                                                                                      |
|---------------------------------------------|-----------------------------------------------------------------------------------------------|
| [Simpan Draf]                               | Save partial progress                                                                         |
| [Simpan Draf & Sahkan Selesai Lawatan]      | Save all + update Status Lawatan + insert Audit Trail + trigger flow                         |
| [Selesai dan Hantar ke Kelulusan]           | Save all + update Status Lawatan + insert Audit Trail + trigger flow ke kelulusan            |
| [Batal]                                     | Close page without saving                                                                     |
