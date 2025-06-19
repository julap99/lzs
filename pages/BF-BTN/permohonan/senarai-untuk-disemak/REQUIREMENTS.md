## Section 1 → Maklumat Permohonan (Read-only)

| Field                         | Access | Notes                                                       |
|------------------------------|--------|-------------------------------------------------------------|
| ID Permohonan                | V      | Display                                                     |
| Nama Pemohon (Hab/Cawangan) | V      | Display                                                     |
| Jenis Bantuan                | V      | Display                                                     |
| SEGERA                       | U/V    | Checkbox                                                    |
| Tarikh Permohonan            | V      | Display                                                     |
| Status Permohonan           | V      | Display (Baru / Dalam Semakan / Tidak Lengkap / Lengkap)   |

---

## Section 2 → Semakan Permohonan (Read-only)

👉 Papar semua field dari Permohonan (View-only).

| Field                  | Access | Notes      |
|------------------------|--------|------------|
| Nama Pemohon           | V      | Display    |
| Alamat                 | V      | Display    |
| No IC                  | V      | Display    |
| Jenis Bantuan          | V      | Display    |
| Kaedah Pembayaran      | V      | Display    |
| Jumlah Bantuan         | V      | Display    |
| Keterangan Permohonan  | V      | Display    |

---

## Section 3 → Semakan Dokumen Sokongan (Form)

| Field / Dokumen            | Access | Notes                                                   |
|----------------------------|--------|----------------------------------------------------------|
| Senarai Dokumen            | V      | Paparan Preview dokumen (inline atau modal)             |
| Status Setiap Dokumen      | C/U    | Dropdown → Lengkap / Tidak Lengkap / SEGERA             |
| Catatan Pegawai per dokumen| C/U    | Textarea, jika SEGERA → wajib isi catatan              |

✅ **Contoh baris:**

| Jenis Dokumen       | Status (Dropdown)       | Catatan Pegawai (Textarea) |
|---------------------|-------------------------|-----------------------------|
| Geran Tanah         | Lengkap / Tidak Lengkap | …                           |
| Carian Rasmi Tanah  | Lengkap / Tidak Lengkap | …                           |
| Akuan Sumpah        | Lengkap / Tidak Lengkap | …                           |

---

## Section 4 → Kemaskini Status Permohonan (Form Section)

| Field                   | Access | Notes                           |
|-------------------------|--------|---------------------------------|
| Status Permohonan       | C/U    | Dropdown: Lengkap / Tidak Lengkap |
| Catatan Umum Pegawai    | C/U    | Textarea (optional)            |

---

## Section 5 → Action Button

| Button                    | Function                                                                 |
|---------------------------|--------------------------------------------------------------------------|
| [Simpan & Kemaskini Status] | Save → insert Audit Trail → trigger Workflow → update Flag → Close/Refresh |
| [Batal]                   | Close tanpa save apa-apa                                                |

---

## Selepas klik [Simpan & Kemaskini Status]:

✅ **Sistem akan:**

- **Insert Audit Trail:**
  - ID Permohonan
  - Nama Pegawai (Hab/Cawangan)
  - Tarikh & Masa tindakan
  - Status Dokumen (per dokumen)
  - Status Permohonan
  - Catatan Pegawai

- **Update Flag dalam Permohonan:**
  - Field: `Status Permohonan = Lengkap / Tidak Lengkap`
  - Jika `SEGERA`: Flag ETD → tray prioriti

- **Trigger Notifikasi:**
  - Jika `Tidak Lengkap` → hantar kepada Pemohon

- **Close Page / Refresh Page:**
  - Papar label:
    - `"Permohonan telah disemak oleh [Nama Pegawai] pada [Tarikh & Masa]"`
    - `"Status: [Lengkap / Tidak Lengkap / SEGERA]"`
  - Butang `[Semak Permohonan]` akan hilang / disable jika status = Lengkap

---

## Special Validations

✅ Jika ada **SEGERA** → wajib **catatan per dokumen**.
