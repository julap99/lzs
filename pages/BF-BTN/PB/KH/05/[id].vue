<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">
          Lihat Permohonan - {{ route.params.id }}
        </h2>
      </template>

      <template #body>
        <div v-if="!detail" class="p-6 text-center text-gray-600">
          Rekod dengan No Rujukan <span class="font-mono">{{ route.params.id }}</span> tidak ditemui.
        </div>

        <div v-else class="space-y-6">
          <!-- 3.1 Maklumat Bantuan -->
          <rs-fieldset title="3.1 Maklumat Bantuan">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Aid</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.maklumatBantuan.aid }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Aid Product</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.maklumatBantuan.aidProduct }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Product Package</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.maklumatBantuan.productPackage }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Entitlement Product</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.maklumatBantuan.entitlementProduct }}</div>
              </div>
              <div class="md:col-span-2">
                <div class="flex items-center gap-6">
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      :checked="detail.maklumatBantuan.segera" 
                      disabled
                      class="mr-2" 
                    />
                    <span class="text-sm font-medium">SEGERA</span>
                  </div>
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      :checked="detail.maklumatBantuan.kelulusanKhas" 
                      disabled
                      class="mr-2" 
                    />
                    <span class="text-sm font-medium">Kelulusan Khas</span>
                  </div>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Tarikh Permohonan</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.maklumatBantuan.tarikhPermohonan }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">SLA</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.maklumatBantuan.sla }}</div>
              </div>
              <div class="md:col-span-2">
                <label class="text-sm font-medium text-gray-700 mb-1 block">Situasi</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.maklumatBantuan.situasi.join(', ') }}</div>
              </div>
            </div>
          </rs-fieldset>

          <!-- 3.2 Penerima Manfaat -->
          <rs-fieldset title="3.2 Maklumat Penerima Manfaat">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Nama Penerima Manfaat</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.penerimaManfaat.nama }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">No. Kad Pengenalan</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.penerimaManfaat.noKp }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Hubungan</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.penerimaManfaat.hubungan }}</div>
              </div>
            </div>
          </rs-fieldset>

          <!-- 3.3 Dokumen Sokongan -->
          <rs-fieldset title="3.3 Dokumen Sokongan">
            <div class="overflow-x-auto">
              <table class="min-w-full border bg-white text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 text-left">No</th>
                    <th class="px-3 py-2 text-left">Dokumen</th>
                    <th class="px-3 py-2 text-left">Status Dokumen</th>
                    <th class="px-3 py-2 text-left">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="d in detail.dokumenSokongan" :key="d.no" class="border-t">
                    <td class="px-3 py-2">{{ d.no }}</td>
                    <td class="px-3 py-2">{{ d.dokumen }}</td>
                    <td class="px-3 py-2">
                      <rs-badge :variant="d.status === 'Lengkap' ? 'success' : 'warning'">
                        {{ d.status }}
                      </rs-badge>
                    </td>
                    <td class="px-3 py-2">{{ d.catatan }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </rs-fieldset>

          <!-- 3.4 Maklumat Kadar Bantuan -->
          <rs-fieldset title="3.4 Maklumat Kadar Bantuan">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Kadar Bantuan (RM)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.kadarBantuan.kadar }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Tempoh/Kekerapan (bulan)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.kadarBantuan.kekerapan }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Tarikh Mula</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.kadarBantuan.tarikhMula }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Tarikh Tamat</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.kadarBantuan.tarikhTamat }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Jumlah Keseluruhan (RM)</label>
                <div class="p-3 bg-gray-50 rounded border font-semibold">{{ detail.kadarBantuan.jumlahKeseluruhan }}</div>
              </div>
            </div>
          </rs-fieldset>

          <!-- 3.5 Maklumat Penerima Bayaran -->
          <rs-fieldset title="3.5 Maklumat Penerima Bayaran">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Kaedah Pembayaran</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.penerimaBayaran.kaedah }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">No KP / No Pendaftaran</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.penerimaBayaran.noKp }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Nama Penerima/Institusi/Syarikat</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.penerimaBayaran.namaPenerima }}</div>
              </div>
              <template v-if="detail.penerimaBayaran.kaedah !== 'Tunai' && !detail.penerimaBayaran.kaedah.startsWith('Tunai ')">
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1 block">Nama Pemegang Akaun</label>
                  <div class="p-3 bg-gray-50 rounded border">{{ detail.penerimaBayaran.namaPemegangAkaun }}</div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1 block">Bank</label>
                  <div class="p-3 bg-gray-50 rounded border">{{ detail.penerimaBayaran.bank }}</div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1 block">No. Akaun Bank</label>
                  <div class="p-3 bg-gray-50 rounded border">{{ detail.penerimaBayaran.noAkaun }}</div>
                </div>
              </template>
            </div>
          </rs-fieldset>

          <!-- 3.6 Maklumat Lawatan & Keputusan Siasatan -->
          <rs-fieldset title="3.6 Maklumat Lawatan & Keputusan Siasatan">
            <div v-if="detail.status === 'Menunggu'" class="p-4 text-center text-gray-500 bg-gray-50 rounded border">
              <Icon name="heroicons:clock" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Permohonan masih dalam proses. Maklumat lawatan dan siasatan akan dipaparkan setelah diproses oleh pegawai.</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Kaedah Siasatan (RO)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.lawatanSiasatan.kaedah }}</div>
              </div>
              <template v-if="detail.lawatanSiasatan.kaedah === 'Lapangan'">
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1 block">Tarikh Lawatan</label>
                  <div class="p-3 bg-gray-50 rounded border">{{ detail.lawatanSiasatan.tarikhLawatan }}</div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1 block">Masa Lawatan</label>
                  <div class="p-3 bg-gray-50 rounded border">{{ detail.lawatanSiasatan.masaLawatan }}</div>
                </div>
              </template>
              <div class="md:col-span-2">
                <label class="text-sm font-medium text-gray-700 mb-1 block">Catatan Penilaian Awal (RO)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.lawatanSiasatan.catatanAwal }}</div>
              </div>
              <div class="md:col-span-2">
                <label class="text-sm font-medium text-gray-700 mb-1 block">Catatan Lawatan EOAD</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.lawatanSiasatan.catatanEOAD }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Status Sokongan (RO)</label>
                <div class="p-3 bg-gray-50 rounded border">
                  <rs-badge :variant="detail.lawatanSiasatan.statusSokongan === 'Sokong' ? 'success' : 'danger'">
                    {{ detail.lawatanSiasatan.statusSokongan }}
                  </rs-badge>
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="text-sm font-medium text-gray-700 mb-1 block">Catatan Sokongan (RO)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.lawatanSiasatan.catatanSokongan }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Item Bantuan (jika berkaitan)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.lawatanSiasatan.itemBantuan }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Tarikh Sokongan (RO)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.lawatanSiasatan.tarikhsokongan }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Nama Pegawai (RO)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.lawatanSiasatan.namaPegawai }}</div>
              </div>
            </div>
          </rs-fieldset>

          <!-- 3.7 Maklumat Bajet -->
          <rs-fieldset title="3.7 Maklumat Bajet">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Nama Bajet (RO)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.bajet.nama }}</div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Jumlah Bajet Semasa (RO)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.bajet.jumlahSemasa }}</div>
              </div>
            </div>
          </rs-fieldset>

          <!-- 3.8 Maklumat Kelulusan -->
          <rs-fieldset title="3.8 Maklumat Kelulusan">
            <div v-if="detail.status === 'Menunggu'" class="p-4 text-center text-gray-500 bg-gray-50 rounded border">
              <Icon name="heroicons:clock" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Permohonan masih dalam proses. Keputusan kelulusan akan dipaparkan setelah disemak oleh pelulus.</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Keputusan Kelulusan</label>
                <div class="p-3 bg-gray-50 rounded border">
                  <rs-badge :variant="getStatusVariant(detail.kelulusan.keputusan)">
                    {{ detail.kelulusan.keputusan }}
                  </rs-badge>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Tarikh Kelulusan (RO)</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.kelulusan.tarikhKelulusan }}</div>
              </div>
              <div class="md:col-span-2">
                <label class="text-sm font-medium text-gray-700 mb-1 block">Catatan Kelulusan</label>
                <div class="p-3 bg-gray-50 rounded border">{{ detail.kelulusan.catatan }}</div>
              </div>
            </div>
          </rs-fieldset>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end mt-6 pt-4 border-t">
          <rs-button
            variant="secondary-outline"
            @click="goBack"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, navigateTo } from '#app'

definePageMeta({
  title: 'Lihat Permohonan',
  description: 'Lihat maklumat permohonan bantuan khas'
})

const route = useRoute()

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN",
  },
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB",
  },
  {
    name: "Kelulusan Khas",
    type: "link",
    path: "/BF-BTN/PB/KH/01",
  },
  {
    name: "Lihat Permohonan",
    type: "current",
    path: `/BF-BTN/PB/KH/05/${route.params.id}`,
  },
])

// Mock data - matches KH-01 status exactly
const details = [
  {
    noRujukan: 'KH20250721001',
    maklumatBantuan: {
      aid: 'Barangan Dapur Asas',
      aidProduct: 'Pakej Asas',
      productPackage: 'Pakej A',
      entitlementProduct: 'Entitlement A',
      segera: true,
      kelulusanKhas: true,
      tarikhPermohonan: '21-07-2025',
      situasi: ['Melebihi Had Kifayah'],
      sla: 'SLA-24h',
    },
    penerimaManfaat: { nama: 'Fatimah Bt Ali', noKp: '850101-10-1234', hubungan: 'Anak' },
    dokumenSokongan: [{ no:1, dokumen:'Kad Pengenalan', status:'Lengkap', catatan:'OK', url:'#' }],
    kadarBantuan: { kadar: 300, kekerapan: 6, tarikhMula: '2025-08-01', tarikhTamat: '2026-01-31', jumlahKeseluruhan: 1800 },
    penerimaBayaran: { kaedah:'EFT', noKp:'850101-10-1234', namaPenerima:'Ahmad Bin Ali', namaPemegangAkaun:'Ahmad Bin Ali', bank:'Maybank', noAkaun:'1234567890' },
    lawatanSiasatan: { kaedah:'', tarikhLawatan:'', masaLawatan:'', catatanAwal:'', gambar:[], catatanEOAD:'', statusSokongan:'', catatanSokongan:'', itemBantuan:'', tarikhsokongan:'', namaPegawai:'' },
    bajet: { nama:'Bajet Operasi 2025', jumlahSemasa: 100000 },
    kelulusan: { keputusan:'', catatan:'', tarikhKelulusan:'' },
    status: 'Menunggu'
  },
  {
    noRujukan: 'KH20250722005',
    maklumatBantuan: {
      aid: 'Sewa Rumah',
      aidProduct: 'Sewa Bulanan',
      productPackage: 'Pakej B',
      entitlementProduct: 'Entitlement B',
      segera: false,
      kelulusanKhas: true,
      tarikhPermohonan: '22-07-2025',
      situasi: ['Tidak memenuhi syarat minimum'],
      sla: 'SLA-48h',
    },
    penerimaManfaat: { nama: 'Tiada', noKp: '', hubungan: '' },
    dokumenSokongan: [{ no:1, dokumen:'Penyata Gaji', status:'Tidak Lengkap', catatan:'Perlu salinan terkini', url:'#' }],
    kadarBantuan: { kadar: 500, kekerapan: 1, tarikhMula: '2025-08-05', tarikhTamat: '2025-08-05', jumlahKeseluruhan: 500 },
    penerimaBayaran: { kaedah:'Tunai', noKp:'900303-10-9999', namaPenerima:'Siti Aminah' },
    lawatanSiasatan: { kaedah:'', tarikhLawatan:'', masaLawatan:'', catatanAwal:'', gambar:[], catatanEOAD:'', statusSokongan:'', catatanSokongan:'', itemBantuan:'', tarikhsokongan:'', namaPegawai:'' },
    bajet: { nama:'Bajet Kebajikan 2025', jumlahSemasa: 50000 },
    kelulusan: { keputusan:'', catatan:'', tarikhKelulusan:'' },
    status: 'Menunggu'
  },
  {
    noRujukan: 'KH20250723003',
    maklumatBantuan: {
      aid: 'Bantuan Perubatan',
      aidProduct: 'Rawatan Khas',
      productPackage: 'Pakej C',
      entitlementProduct: 'Entitlement C',
      segera: true,
      kelulusanKhas: true,
      tarikhPermohonan: '23-07-2025',
      situasi: ['Kecemasan Perubatan'],
      sla: 'SLA-12h',
    },
    penerimaManfaat: { nama: 'Mohd Razak bin Ibrahim', noKp: '780315-08-5678', hubungan: 'Suami' },
    dokumenSokongan: [{ no:1, dokumen:'Laporan Perubatan', status:'Lengkap', catatan:'Dokumen lengkap', url:'#' }],
    kadarBantuan: { kadar: 1000, kekerapan: 1, tarikhMula: '2025-08-01', tarikhTamat: '2025-08-01', jumlahKeseluruhan: 1000 },
    penerimaBayaran: { kaedah:'EFT', noKp:'780315-08-5678', namaPenerima:'Mohd Razak bin Ibrahim', namaPemegangAkaun:'Mohd Razak bin Ibrahim', bank:'CIMB', noAkaun:'9876543210' },
    lawatanSiasatan: { kaedah:'Lapangan', tarikhLawatan:'2025-07-24', masaLawatan:'14:00', catatanAwal:'Keperluan perubatan disahkan.', gambar:[], catatanEOAD:'Disyorkan Lulus', statusSokongan:'Sokong', catatanSokongan:'Layak mengikut kriteria', itemBantuan:'Rawatan Hospital', tarikhsokongan:'2025-07-24T15:30:00', namaPegawai:'Aminah' },
    bajet: { nama:'Bajet Kesihatan 2025', jumlahSemasa: 75000 },
    kelulusan: { keputusan:'Lulus', catatan:'Diluluskan untuk rawatan kecemasan', tarikhKelulusan:'2025-07-24T16:00:00' },
    status: 'Lulus'
  },
  {
    noRujukan: 'KH20250724004',
    maklumatBantuan: {
      aid: 'Bantuan Pendidikan',
      aidProduct: 'Yuran Sekolah',
      productPackage: 'Pakej D',
      entitlementProduct: 'Entitlement D',
      segera: false,
      kelulusanKhas: true,
      tarikhPermohonan: '24-07-2025',
      situasi: ['Pendapatan tidak mencukupi'],
      sla: 'SLA-72h',
    },
    penerimaManfaat: { nama: 'Fatimah binti Omar', noKp: '920505-12-3456', hubungan: 'Anak' },
    dokumenSokongan: [{ no:1, dokumen:'Penyata Pendapatan', status:'Tidak Lengkap', catatan:'Perlu dokumen terkini', url:'#' }],
    kadarBantuan: { kadar: 200, kekerapan: 12, tarikhMula: '2025-08-01', tarikhTamat: '2026-07-31', jumlahKeseluruhan: 2400 },
    penerimaBayaran: { kaedah:'EFT', noKp:'920505-12-3456', namaPenerima:'Fatimah binti Omar', namaPemegangAkaun:'Fatimah binti Omar', bank:'RHB', noAkaun:'5555666677' },
    lawatanSiasatan: { kaedah:'Telefon', tarikhLawatan:'', masaLawatan:'', catatanAwal:'Semakan telefon.', gambar:[], catatanEOAD:'Perlu dokumen tambahan', statusSokongan:'Tidak Sokong', catatanSokongan:'Dokumen tidak lengkap', itemBantuan:'', tarikhsokongan:'2025-07-25T10:00:00', namaPegawai:'Zul' },
    bajet: { nama:'Bajet Pendidikan 2025', jumlahSemasa: 120000 },
    kelulusan: { keputusan:'Tidak Lulus', catatan:'Dokumen tidak lengkap', tarikhKelulusan:'2025-07-25T11:00:00' },
    status: 'Tidak Lulus'
  },
  {
    noRujukan: 'KH20250725001',
    maklumatBantuan: {
      aid: 'Bantuan Makanan',
      aidProduct: 'Pakej Makanan',
      productPackage: 'Pakej E',
      entitlementProduct: 'Entitlement E',
      segera: true,
      kelulusanKhas: true,
      tarikhPermohonan: '25-07-2025',
      situasi: ['Kehilangan pekerjaan'],
      sla: 'SLA-24h',
    },
    penerimaManfaat: { nama: 'Rashid Bin Omar', noKp: '880912-05-7890', hubungan: 'Suami' },
    dokumenSokongan: [{ no:1, dokumen:'Surat Pengesahan', status:'Lengkap', catatan:'OK', url:'#' }],
    kadarBantuan: { kadar: 150, kekerapan: 3, tarikhMula: '2025-08-01', tarikhTamat: '2025-10-31', jumlahKeseluruhan: 450 },
    penerimaBayaran: { kaedah:'Tunai', noKp:'880912-05-7890', namaPenerima:'Rashid Bin Omar' },
    lawatanSiasatan: { kaedah:'', tarikhLawatan:'', masaLawatan:'', catatanAwal:'', gambar:[], catatanEOAD:'', statusSokongan:'', catatanSokongan:'', itemBantuan:'', tarikhsokongan:'', namaPegawai:'' },
    bajet: { nama:'Bajet Makanan 2025', jumlahSemasa: 80000 },
    kelulusan: { keputusan:'', catatan:'', tarikhKelulusan:'' },
    status: 'Menunggu'
  },
  {
    noRujukan: 'KH20250726002',
    maklumatBantuan: {
      aid: 'Bantuan Rumah',
      aidProduct: 'Baik Pulih Rumah',
      productPackage: 'Pakej F',
      entitlementProduct: 'Entitlement F',
      segera: false,
      kelulusanKhas: true,
      tarikhPermohonan: '26-07-2025',
      situasi: ['Rumah rosak teruk'],
      sla: 'SLA-48h',
    },
    penerimaManfaat: { nama: 'Aishah Bt Abdullah', noKp: '850203-11-2468', hubungan: 'Isteri' },
    dokumenSokongan: [{ no:1, dokumen:'Laporan Kerosakan', status:'Lengkap', catatan:'Dokumen lengkap', url:'#' }],
    kadarBantuan: { kadar: 2000, kekerapan: 1, tarikhMula: '2025-08-01', tarikhTamat: '2025-08-01', jumlahKeseluruhan: 2000 },
    penerimaBayaran: { kaedah:'EFT', noKp:'850203-11-2468', namaPenerima:'Aishah Bt Abdullah', namaPemegangAkaun:'Aishah Bt Abdullah', bank:'Public Bank', noAkaun:'1122334455' },
    lawatanSiasatan: { kaedah:'Lapangan', tarikhLawatan:'2025-07-27', masaLawatan:'09:00', catatanAwal:'Kerosakan rumah disahkan.', gambar:[], catatanEOAD:'Disyorkan Lulus', statusSokongan:'Sokong', catatanSokongan:'Layak mengikut kriteria', itemBantuan:'Baik Pulih Asas', tarikhsokongan:'2025-07-27T11:00:00', namaPegawai:'Hafiz' },
    bajet: { nama:'Bajet Perumahan 2025', jumlahSemasa: 200000 },
    kelulusan: { keputusan:'Lulus', catatan:'Diluluskan untuk baik pulih', tarikhKelulusan:'2025-07-27T12:00:00' },
    status: 'Lulus'
  },
  {
    noRujukan: 'KH20250727003',
    maklumatBantuan: {
      aid: 'Bantuan Kenderaan',
      aidProduct: 'Baik Pulih Motor',
      productPackage: 'Pakej G',
      entitlementProduct: 'Entitlement G',
      segera: false,
      kelulusanKhas: true,
      tarikhPermohonan: '27-07-2025',
      situasi: ['Pendapatan tidak mencukupi'],
      sla: 'SLA-72h',
    },
    penerimaManfaat: { nama: 'Ismail Bin Ahmad', noKp: '900101-03-1357', hubungan: 'Suami' },
    dokumenSokongan: [{ no:1, dokumen:'Penyata Pendapatan', status:'Tidak Lengkap', catatan:'Perlu dokumen terkini', url:'#' }],
    kadarBantuan: { kadar: 800, kekerapan: 1, tarikhMula: '2025-08-01', tarikhTamat: '2025-08-01', jumlahKeseluruhan: 800 },
    penerimaBayaran: { kaedah:'EFT', noKp:'900101-03-1357', namaPenerima:'Ismail Bin Ahmad', namaPemegangAkaun:'Ismail Bin Ahmad', bank:'Hong Leong', noAkaun:'9988776655' },
    lawatanSiasatan: { kaedah:'Telefon', tarikhLawatan:'', masaLawatan:'', catatanAwal:'Semakan telefon.', gambar:[], catatanEOAD:'Perlu dokumen tambahan', statusSokongan:'Tidak Sokong', catatanSokongan:'Dokumen tidak lengkap', itemBantuan:'', tarikhsokongan:'2025-07-28T09:00:00', namaPegawai:'Zul' },
    bajet: { nama:'Bajet Kenderaan 2025', jumlahSemasa: 60000 },
    kelulusan: { keputusan:'Tidak Lulus', catatan:'Dokumen tidak lengkap', tarikhKelulusan:'2025-07-28T10:00:00' },
    status: 'Tidak Lulus'
  }
]

const detail = computed(() => details.find(d => d.noRujukan === String(route.params.id)) || null)

const getStatusVariant = (status) => {
  const variants = {
    'Lulus': 'success',
    'Tidak Lulus': 'danger',
    'Menunggu': 'warning',
  };
  return variants[status] || 'secondary';
}

function goBack() { 
  navigateTo('/BF-BTN/PB/KH/01') 
}
</script>
