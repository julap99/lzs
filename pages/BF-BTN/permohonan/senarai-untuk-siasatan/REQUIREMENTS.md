## Section 1 → Maklumat Permohonan (Read-only)

| Field              | Access | Notes                                                    |
|--------------------|--------|----------------------------------------------------------|
| ID Permohonan      | V      | Display                                                  |
| Nama Pemohon       | V      | Display                                                  |
| Jenis Bantuan      | V      | Display                                                  |
| SEGERA             | V      | Checkbox                                                 |
| Tarikh Permohonan  | V      | Display                                                  |
| Status Permohonan  | V      | Display (Baru / Dalam Semakan / Tidak Lengkap / Lengkap) |

---

## Section 2 → Semakan Permohonan (Read-only)

👉 Papar semua field dari Permohonan (View-only).

| Field                 | Access | Notes     |
|-----------------------|--------|-----------|
| Nama Pemohon          | V      | Display   |
| Alamat                | V      | Display   |
| No IC                 | V      | Display   |
| Jenis Bantuan         | V      | Display   |
| Kaedah Pembayaran     | V      | Display   |
| Jumlah Bantuan        | U/V    | Display   |
| Keterangan Permohonan | V      | Display   |

---

## Section 3 → Semakan Dokumen Sokongan (Form)

| Field / Dokumen            | Access | Notes                                                   |
|----------------------------|--------|----------------------------------------------------------|
| Senarai Dokumen            | V      | Paparan Preview dokumen (inline atau modal)             |
| Status Setiap Dokumen      | V      | Dropdown → Lengkap / Tidak Lengkap                      |
| Catatan Pegawai per dokumen| V      | Textarea, jika SEGERA → wajib isi catatan              |

✅ **Contoh baris:**

| Jenis Dokumen       | Status (Dropdown)       | Catatan Pegawai (Textarea) |
|---------------------|-------------------------|-----------------------------|
| Geran Tanah         | Lengkap / Tidak Lengkap | …                           |
| Carian Rasmi Tanah  | Lengkap / Tidak Lengkap | …                           |
| Akuan Sumpah        | Lengkap / Tidak Lengkap | …                           |

---

## Section 4 → Kemaskini Permohonan (Form Section)

| Field                        | Access | Notes                                                                  |
|------------------------------|--------|------------------------------------------------------------------------|
| Catatan Penilaian Awal       | C/U    | Textarea (optional)                                                   |
| Kaedah Siasatan              | C/U    | Dropdown: Telefon / Semak Dokumen Sahaja / Lawatan                    |
| Tarikh Lawatan               | C/U    | Date                                                                   |
| Masa Lawatan                 | C/U    | Dropdown: 9:00–9:30 / 9:30–10:00 / ... (hingga 6:00PM, setiap 30 minit) |
| Status Pengesahan Lawatan    | C/U    | Dropdown: Sah / Belum Sah                                              |
| Status Permohonan            | C/U    | Dropdown: Menunggu Siasatan Lapangan / Lawatan Dijadualkan            |

---

## Section 5 → Action Button

| Button                      | Function                                                                 |
|-----------------------------|--------------------------------------------------------------------------|
| [Simpan & Kemaskini Status] | Save → insert Audit Trail → trigger Workflow → update Flag → Close/Refresh |
| [Batal]                     | Close tanpa save apa-apa                                                |
