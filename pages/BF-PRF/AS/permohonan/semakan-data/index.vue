<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Data Permohonan</h2>
          <div class="flex items-center space-x-2">
            <rs-badge variant="success">Permohonan Dihantar</rs-badge>
            <span class="text-sm text-gray-500">Dihantar: 15 Jun 2024 14:30</span>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Section A: Maklumat Peribadi Asnaf -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            A. Maklumat Peribadi Asnaf
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Ketua Keluarga
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.nama_ketua_keluarga }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jenis ID
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.jenis_id }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombor ID
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.nombor_id }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.nama }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Selepas Islam (Muallaf)
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.nama_selepas_islam }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No Polis/No Tentera/No Sijil Lahir
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.no_pengenalan }}
          </div>
        </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Lahir
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.tarikh_lahir }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jantina
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.jantina }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Bangsa
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.bangsa }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Warganegara
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.warganegara }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pendidikan Tertinggi
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.pendidikan_tertinggi }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Masuk Islam
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.tarikh_masuk_islam }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Masuk KFAM
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.tarikh_masuk_kfam }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Perkahwinan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.status_perkahwinan }}
              </div>
            </div>
          </div>
        </div>

        <!-- Dokumen Berkaitan Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Dokumen Berkaitan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(doc, index) in documents"
              :key="index"
              class="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ doc.name }}</p>
                <p class="text-sm text-gray-500">{{ doc.type }}</p>
              </div>
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="downloadDocument(doc)"
              >
                <Icon name="mdi:download" class="mr-1" />
                Muat Turun
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Section B: Maklumat Kesihatan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            B. Maklumat Kesihatan
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tahap Kesihatan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.tahap_kesihatan }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Keadaan Kesihatan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.keadaan_kesihatan_sakit }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kos Penjagaan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.kos_penjagaan_sakit }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Perbelanjaan Bulanan (RM)
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.perbelanjaan_bulanan_sakit }}
              </div>
            </div>
          </div>
        </div>

        <!-- Dokumen Berkaitan Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Dokumen Berkaitan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(doc, index) in documents"
              :key="index"
              class="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ doc.name }}</p>
                <p class="text-sm text-gray-500">{{ doc.type }}</p>
              </div>
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="downloadDocument(doc)"
              >
                <Icon name="mdi:download" class="mr-1" />
                Muat Turun
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Section C: Kemahiran -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            C. Kemahiran
          </h3>
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kemahiran
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.kemahiran }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section D: Maklumat Kediaman -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            D. Maklumat Kediaman
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Kediaman
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.status_kediaman }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jenis Rumah
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.jenis_rumah }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Binaan Rumah
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.binaan_rumah }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Keadaan Kediaman
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.keadaan_kediaman }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Bekalan Air
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.bekalan_air }} (RM {{ formData.bil_air }})
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Bekalan Elektrik
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.bekalan_elektrik }} (RM {{ formData.bil_elektrik }})
              </div>
            </div>
          </div>
        </div>

        <!-- Dokumen Berkaitan Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Dokumen Berkaitan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(doc, index) in documents"
              :key="index"
              class="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ doc.name }}</p>
                <p class="text-sm text-gray-500">{{ doc.type }}</p>
              </div>
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="downloadDocument(doc)"
              >
                <Icon name="mdi:download" class="mr-1" />
                Muat Turun
              </rs-button>
            </div>
          </div>
        </div>  

        <!-- Section E: Maklumat Pinjaman -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            E. Maklumat Pinjaman
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pemberi Pinjaman
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.pemberi_pinjaman }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jenis Pinjaman
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.jenis_pinjaman }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Bayaran Bulanan (RM)
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.bayaran_bulanan }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Perbelanjaan (RM)
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.jumlah_perbelanjaan }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section F: Maklumat Pemilikan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            F. Maklumat Pemilikan
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Wang Simpanan (RM)
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.wang_simpanan }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Emas (gram)
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.emas }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Saham (RM)
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.saham }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kenderaan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.kenderaan }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section G: Maklumat Waris -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            G. Maklumat Waris
          </h3>
          <div v-for="(waris, index) in formData.waris" :key="index" class="mb-6">
            <h4 class="font-medium mb-3">Waris {{ index + 1 }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.nama }}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Hubungan
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.hubungan }}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  No ID
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.no_id }}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Lahir
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.tarikh_lahir }}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jantina
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.jantina }}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bangsa
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.bangsa }}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Warganegara
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.warganegara }}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status Perkahwinan
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.status_perkahwinan }}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pekerjaan
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.pekerjaan }}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pendapatan (RM)
                </label>
                <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {{ waris.pendapatan }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section H: Pengesahan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            G. Pengesahan
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dibantu Penolong Amil
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.dibantu_penolong_amil }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Penolong Amil
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.nama_penolong_amil_bantuan }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kariah
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.kariah_bantuan }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Bantuan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.tarikh_bantuan }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section H: Pengesahan Bermastautin -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            H. Pengesahan Bermastautin
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Pengesah
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.nama_pengesah }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jawatan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.jawatan_pengesah }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No Telefon
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.no_telefon_pengesah }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Pengesahan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.tarikh_pengesahan_permastautin }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section I: Maklumat Penolong Amil -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            I. Maklumat Penolong Amil
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Penolong Amil
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.nama_penolong_amil }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jenis Permohonan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.jenis_permohonan }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Proses
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.tarikh_proses }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section J: Penilaian Awal -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            J. Penilaian Awal
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Komitmen Tinggi
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.komitmen_tinggi }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Keperluan Mendesak
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.keperluan_mendesak.join(', ') }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dokumen Sokongan
              </label>
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                {{ formData.dokumen_sokongan.join(', ') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section K: Maklumat Peribadi Tanggungan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            K. Maklumat Peribadi Tanggungan
          </h3>
          <div v-for="(tanggungan, index) in formData.tanggungan" :key="index" class="mb-6">
            <h4 class="font-medium mb-3">Tanggungan {{ index + 1 }}</h4>
            
            <!-- Maklumat Peribadi -->
            <div class="mb-6">
              <h5 class="font-medium mb-3">Maklumat Peribadi</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nama
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.nama }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Jenis ID
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.jenis_id }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    No ID
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.no_id }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    No Polis/No Tentera/No Sijil Lahir
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.no_pengenalan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Jantina
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.jantina }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tarikh Lahir
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.tarikh_lahir }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tempat Lahir
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.tempat_lahir }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Bangsa
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.bangsa }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Warganegara
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.warganegara }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Status Perkahwinan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.status_perkahwinan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tarikh Masuk Islam
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.tarikh_masuk_islam }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tarikh Masuk KFAM
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.tarikh_masuk_kfam }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tempoh Menetap Di Selangor (Tahun)
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.tempoh_menetap_selangor }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    No Telefon/Telefon Bimbit
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.no_telefon }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Maklumat Perbankan -->
            <div class="mb-6">
              <h5 class="font-medium mb-3">Maklumat Perbankan</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pemegang Akaun
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.nama_pemegang_akaun }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Bank
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.bank }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    No Akaun Bank
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.no_akaun_bank }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Cara Pembayaran
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.cara_pembayaran }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Maklumat Pendidikan -->
            <div class="mb-6">
              <h5 class="font-medium mb-3">Maklumat Pendidikan</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Bersekolah
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.bersekolah }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Pendidikan Tertinggi
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.pendidikan_tertinggi }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nama Sekolah
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.nama_sekolah }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Sekolah
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.alamat_sekolah }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Daerah
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.daerah_sekolah }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Negeri
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.negeri_sekolah }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Poskod
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.poskod_sekolah }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Sekolah
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.jenis_sekolah }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Maklumat Kesihatan -->
            <div class="mb-6">
              <h5 class="font-medium mb-3">Maklumat Kesihatan</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tahap Kesihatan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.tahap_kesihatan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Keadaan Kesihatan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.keadaan_kesihatan_sakit }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Kos Penjagaan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.kos_penjagaan_sakit }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Perbelanjaan Bulanan (RM)
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.perbelanjaan_bulanan_sakit }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Maklumat Kemahiran -->
            <div class="mb-6">
              <h5 class="font-medium mb-3">Maklumat Kemahiran</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Kemahiran
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.kemahiran }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Maklumat Pekerjaan -->
            <div class="mb-6">
              <h5 class="font-medium mb-3">Maklumat Pekerjaan</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.pekerjaan_status }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Sektor
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.sektor_pekerjaan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nama Majikan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.nama_majikan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    No Tel Majikan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.no_tel_majikan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Majikan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.alamat_majikan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Bandar
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.bandar_majikan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Poskod
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.poskod_majikan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Daerah
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.daerah_majikan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Negeri
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.negeri_majikan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Jawatan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.jawatan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Negara
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.negara_pekerjaan }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Status Jawatan
                  </label>
                  <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {{ tanggungan.status_jawatan }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- Section L: SEMAKAN RADIO BUTTONS (Screenshot Style) -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h3 class="text-lg font-medium">SEMAKAN</h3>
            <rs-button 
              type="button" 
              variant="secondary" 
              size="sm"
              @click="setAllSemakanToYa"
              class="text-xs"
            >
              <Icon name="ph:check-circle" class="w-4 h-4 mr-1" />
              Set All to Ya
            </rs-button>
          </div>
          <table class="w-full border border-gray-400 text-sm mb-6" style="background:#fff;">
            <thead>
              <tr class="bg-gray-100">
                <th class="border px-2 py-1 text-left">Maklumat Lengkap?</th>
                <th class="border px-2 py-1 text-center">Ya</th>
                <th class="border px-2 py-1 text-center">Tidak</th>
                <th class="border px-2 py-1 text-center">Tidak Berkenaan</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border px-2 py-1">Peribadi</td><td class="border px-2 py-1 text-center"><input type="radio" name="peribadi" value="Ya" v-model="semakanData.peribadi" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="peribadi" value="Tidak" v-model="semakanData.peribadi" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="peribadi" value="Tidak Berkenaan" v-model="semakanData.peribadi" /></td></tr>
              <tr><td class="border px-2 py-1">Pendidikan</td><td class="border px-2 py-1 text-center"><input type="radio" name="pendidikan" value="Ya" v-model="semakanData.pendidikan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pendidikan" value="Tidak" v-model="semakanData.pendidikan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pendidikan" value="Tidak Berkenaan" v-model="semakanData.pendidikan" /></td></tr>
              <tr><td class="border px-2 py-1">Pengislaman</td><td class="border px-2 py-1 text-center"><input type="radio" name="pengislaman" value="Ya" v-model="semakanData.pengislaman" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pengislaman" value="Tidak" v-model="semakanData.pengislaman" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pengislaman" value="Tidak Berkenaan" v-model="semakanData.pengislaman" /></td></tr>
              <tr><td class="border px-2 py-1">Perbankan</td><td class="border px-2 py-1 text-center"><input type="radio" name="perbankan" value="Ya" v-model="semakanData.perbankan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="perbankan" value="Tidak" v-model="semakanData.perbankan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="perbankan" value="Tidak Berkenaan" v-model="semakanData.perbankan" /></td></tr>
              <tr><td class="border px-2 py-1">Kesihatan</td><td class="border px-2 py-1 text-center"><input type="radio" name="kesihatan" value="Ya" v-model="semakanData.kesihatan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="kesihatan" value="Tidak" v-model="semakanData.kesihatan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="kesihatan" value="Tidak Berkenaan" v-model="semakanData.kesihatan" /></td></tr>
              <tr><td class="border px-2 py-1">Kemahiran</td><td class="border px-2 py-1 text-center"><input type="radio" name="kemahiran" value="Ya" v-model="semakanData.kemahiran" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="kemahiran" value="Tidak" v-model="semakanData.kemahiran" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="kemahiran" value="Tidak Berkenaan" v-model="semakanData.kemahiran" /></td></tr>
              <tr><td class="border px-2 py-1">Alamat dan Tempat Tinggal</td><td class="border px-2 py-1 text-center"><input type="radio" name="alamat" value="Ya" v-model="semakanData.alamat" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="alamat" value="Tidak" v-model="semakanData.alamat" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="alamat" value="Tidak Berkenaan" v-model="semakanData.alamat" /></td></tr>
              <tr><td class="border px-2 py-1">Pinjaman</td><td class="border px-2 py-1 text-center"><input type="radio" name="pinjaman" value="Ya" v-model="semakanData.pinjaman" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pinjaman" value="Tidak" v-model="semakanData.pinjaman" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pinjaman" value="Tidak Berkenaan" v-model="semakanData.pinjaman" /></td></tr>
              <tr><td class="border px-2 py-1">Pemilikan Aset</td><td class="border px-2 py-1 text-center"><input type="radio" name="aset" value="Ya" v-model="semakanData.aset" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="aset" value="Tidak" v-model="semakanData.aset" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="aset" value="Tidak Berkenaan" v-model="semakanData.aset" /></td></tr>
              <tr><td class="border px-2 py-1">Pemilikan Barangan Rumah</td><td class="border px-2 py-1 text-center"><input type="radio" name="barang" value="Ya" v-model="semakanData.barang" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="barang" value="Tidak" v-model="semakanData.barang" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="barang" value="Tidak Berkenaan" v-model="semakanData.barang" /></td></tr>
              <tr><td class="border px-2 py-1">Pekerjaan Ketua Keluarga</td><td class="border px-2 py-1 text-center"><input type="radio" name="pekerjaan" value="Ya" v-model="semakanData.pekerjaan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pekerjaan" value="Tidak" v-model="semakanData.pekerjaan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pekerjaan" value="Tidak Berkenaan" v-model="semakanData.pekerjaan" /></td></tr>
              <tr><td class="border px-2 py-1">Pendapatan dan Perbelanjaan Seisi Rumah</td><td class="border px-2 py-1 text-center"><input type="radio" name="pendapatan" value="Ya" v-model="semakanData.pendapatan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pendapatan" value="Tidak" v-model="semakanData.pendapatan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pendapatan" value="Tidak Berkenaan" v-model="semakanData.pendapatan" /></td></tr>
              <tr><td class="border px-2 py-1">Waris</td><td class="border px-2 py-1 text-center"><input type="radio" name="waris" value="Ya" v-model="semakanData.waris" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="waris" value="Tidak" v-model="semakanData.waris" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="waris" value="Tidak Berkenaan" v-model="semakanData.waris" /></td></tr>
              <tr><td class="border px-2 py-1">Peribadi Tanggungan</td><td class="border px-2 py-1 text-center"><input type="radio" name="peribadi_tanggungan" value="Ya" v-model="semakanData.peribadi_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="peribadi_tanggungan" value="Tidak" v-model="semakanData.peribadi_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="peribadi_tanggungan" value="Tidak Berkenaan" v-model="semakanData.peribadi_tanggungan" /></td></tr>
              <tr><td class="border px-2 py-1">Pengislaman Tanggungan</td><td class="border px-2 py-1 text-center"><input type="radio" name="pengislaman_tanggungan" value="Ya" v-model="semakanData.pengislaman_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pengislaman_tanggungan" value="Tidak" v-model="semakanData.pengislaman_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pengislaman_tanggungan" value="Tidak Berkenaan" v-model="semakanData.pengislaman_tanggungan" /></td></tr>
              <tr><td class="border px-2 py-1">Pendidikan Tanggungan</td><td class="border px-2 py-1 text-center"><input type="radio" name="pendidikan_tanggungan" value="Ya" v-model="semakanData.pendidikan_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pendidikan_tanggungan" value="Tidak" v-model="semakanData.pendidikan_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pendidikan_tanggungan" value="Tidak Berkenaan" v-model="semakanData.pendidikan_tanggungan" /></td></tr>
              <tr><td class="border px-2 py-1">Kesihatan Tanggungan</td><td class="border px-2 py-1 text-center"><input type="radio" name="kesihatan_tanggungan" value="Ya" v-model="semakanData.kesihatan_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="kesihatan_tanggungan" value="Tidak" v-model="semakanData.kesihatan_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="kesihatan_tanggungan" value="Tidak Berkenaan" v-model="semakanData.kesihatan_tanggungan" /></td></tr>
              <tr><td class="border px-2 py-1">Kemahiran Tanggungan</td><td class="border px-2 py-1 text-center"><input type="radio" name="kemahiran_tanggungan" value="Ya" v-model="semakanData.kemahiran_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="kemahiran_tanggungan" value="Tidak" v-model="semakanData.kemahiran_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="kemahiran_tanggungan" value="Tidak Berkenaan" v-model="semakanData.kemahiran_tanggungan" /></td></tr>
              <tr><td class="border px-2 py-1">Pekerjaan Tanggungan</td><td class="border px-2 py-1 text-center"><input type="radio" name="pekerjaan_tanggungan" value="Ya" v-model="semakanData.pekerjaan_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pekerjaan_tanggungan" value="Tidak" v-model="semakanData.pekerjaan_tanggungan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pekerjaan_tanggungan" value="Tidak Berkenaan" v-model="semakanData.pekerjaan_tanggungan" /></td></tr>
              <tr><td class="border px-2 py-1">Perakuan Ketua Keluarga</td><td class="border px-2 py-1 text-center"><input type="radio" name="perakuan_ketua_keluarga" value="Ya" v-model="semakanData.perakuan_ketua_keluarga" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="perakuan_ketua_keluarga" value="Tidak" v-model="semakanData.perakuan_ketua_keluarga" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="perakuan_ketua_keluarga" value="Tidak Berkenaan" v-model="semakanData.perakuan_ketua_keluarga" /></td></tr>
              <tr><td class="border px-2 py-1">Pengesahan Permastautin</td><td class="border px-2 py-1 text-center"><input type="radio" name="pengesahan_permastautin" value="Ya" v-model="semakanData.pengesahan_permastautin" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pengesahan_permastautin" value="Tidak" v-model="semakanData.pengesahan_permastautin" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pengesahan_permastautin" value="Tidak Berkenaan" v-model="semakanData.pengesahan_permastautin" /></td></tr>
              <tr><td class="border px-2 py-1">Pengesahan Pendapatan</td><td class="border px-2 py-1 text-center"><input type="radio" name="pengesahan_pendapatan" value="Ya" v-model="semakanData.pengesahan_pendapatan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pengesahan_pendapatan" value="Tidak" v-model="semakanData.pengesahan_pendapatan" /></td><td class="border px-2 py-1 text-center"><input type="radio" name="pengesahan_pendapatan" value="Tidak Berkenaan" v-model="semakanData.pengesahan_pendapatan" /></td></tr>
            </tbody>
          </table>
          <!-- Komen Penyemak and Dokumen Lengkap outside table -->
          <div class="mb-4 flex flex-col gap-4">
            <div>
              <label class="font-bold block mb-1">Komen Penyemak</label>
              <textarea 
                class="w-full border rounded p-2" 
                rows="2"
                v-model="komenPenyemak"
                placeholder="Masukkan komen penyemak..."
              ></textarea>
            </div>
            <div>
              <label class="font-bold block mb-2">Dokumen Lengkap?</label>
              <div class="flex gap-6">
                                 <label class="flex items-center gap-2">
                   <input 
                     type="radio" 
                     name="dokumen_lengkap" 
                     value="Ya"
                     v-model="dokumenLengkap"
                     @change="handleDokumenLengkapChange"
                   />
                   <span>Ya</span>
                 </label>
                <label class="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="dokumen_lengkap" 
                    value="Tidak"
                    v-model="dokumenLengkap"
                    @change="handleDokumenLengkapChange"
                  />
                  <span>Tidak</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Popup Notification -->
        <div 
          v-if="showNotification" 
          class="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg z-50 transition-all duration-300"
          :class="{ 'opacity-0': notificationFading }"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">{{ notificationMessage }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <rs-button type="button" variant="outline" @click="handleKembali">
            Kembali
          </rs-button>
          <rs-button type="button" variant="secondary" @click="handleSimpanDraf">
            Simpan Draf
          </rs-button>
          <rs-button type="button" variant="primary" @click="handleHantar">
            Hantar
          </rs-button>
      

        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

definePageMeta({
  title: 'Semakan Data Permohonan',
});

const breadcrumb = ref([
  {
    name: 'Permohonan',
    type: 'current',
    path: '/BF-PRF/AS/permohonan',
  },
  {
    name: 'Semakan Data',
    type: 'current',
    path: '/BF-PRF/AS/permohonan/semakan-data',
  },
]);

// Sample form data - in real application, this would come from your API/backend
const formData = ref({
  // Section A - Maklumat Peribadi Asnaf
  nama_ketua_keluarga: 'Adnan bin Abu',
  jenis_id: 'Kad Pengenalan',
  nombor_id: '880101121234',
  nama: 'Adnan bin Abu',
  nama_selepas_islam: 'Adnan bin Abu',
  no_pengenalan: '880101121234',
  tarikh_lahir: '01/01/1988',
  jantina: 'Lelaki',
  bangsa: 'Melayu',
  warganegara: 'Warganegara',
  pendidikan_tertinggi: 'Ijazah',
  tarikh_masuk_islam: '01/01/2010',
  tarikh_masuk_kfam: '01/02/2010',
  status_perkahwinan: 'Berkahwin',
  
  // Section B - Maklumat Kesihatan
  tahap_kesihatan: 'Sihat',
  keadaan_kesihatan_sakit: 'Tidak Terlantar',
  kos_penjagaan_sakit: 'Berbayar',
  perbelanjaan_bulanan_sakit: '500.00',
  kesempurnaan_fizikal: 'Sempurna',
  sebab_kecacatan: '-',
  tahap_kecacatan: '-',
  perbelanjaan_bulanan_oku: '0.00',
  keadaan_kesihatan_uzur: 'Tidak Terlantar',
  kos_penjagaan_uzur: 'Berbayar',
  perbelanjaan_bulanan_uzur: '300.00',

  // Section C - Kemahiran
  kemahiran: 'Kemahiran Komputer, Kemahiran Memasak',

  // Section D - Maklumat Kediaman
  status_kediaman: 'Rumah Sendiri',
  tapak_rumah: '40000',
  jenis_rumah: 'Terrace',
  binaan_rumah: 'Batu',
  keadaan_kediaman: 'Baik/Sempurna',
  bekalan_air: 'Ada',
  bil_air: '50.00',
  bekalan_elektrik: 'Ada',
  bil_elektrik: '150.00',
  penyelenggaraan: 'Ada',
  bil_penyelenggaraan: '100.00',

  // Section E - Maklumat Pinjaman
  pemberi_pinjaman: 'Bank Islam',
  jenis_pinjaman: 'Perumahan',
  bayaran_bulanan: '1500.00',
  jumlah_perbelanjaan: '300000.00',
  tahun_mula_pinjaman: '2020-01-01',
  tahun_akhir_pinjaman: '2030-01-01',

  // Section F - Maklumat Pemilikan
  wang_simpanan: '5000.00',
  emas: '50.00',
  saham: '10000.00',
  kenderaan: 'Kereta 1, Motor 1',
  rumah_kedai: '0',
  tanah_sawah: '0',

  // Section G - Pengesahan
  dibantu_penolong_amil: 'Ya',
  nama_penolong_amil_bantuan: 'Ahmad bin Abdullah',
  kariah_bantuan: 'Masjid Al-Hidayah',
  tarikh_bantuan: '2024-01-15',
  hubungan_kakitangan_lzs: 'Tidak',
  nama_kakitangan: '-',
  jawatan_kakitangan: '-',
  pejabat_kakitangan: '-',
  hubungan_kakitangan: '-',
  tarikh_perakuan: '2024-01-15',

  // Section H - Pengesahan Bermastautin
  ulasan_pengesahan: 'Pengesahan Bermastautin',
  nama_pengesah: 'Mohd Yusof bin Ibrahim',
  jawatan_pengesah: 'Penghulu',
  no_telefon_pengesah: '0123456789',
  tarikh_pengesahan_permastautin: '2024-01-15',

  // Section I - Maklumat Penolong Amil
  nama_penolong_amil: 'Ahmad bin Abdullah',
  jenis_permohonan: 'Baru',
  tarikh_proses: '2024-01-15',

  // Section J - Penilaian Awal
  komitmen_tinggi: 'Ya',
  keperluan_mendesak: ['Perubatan', 'Pendidikan'],
  lain_keperluan: '-',
  dokumen_sokongan: ['Sijil Lahir', 'Kad Pengenalan', 'Slip Gaji'],

  // Section G: Maklumat Waris
  waris: [
    {
      nama: 'SITI BINTI MOHAMED',
      hubungan: 'Isteri',
      no_id: '880101121235',
      tarikh_lahir: '01/01/1988',
      jantina: 'Perempuan',
      bangsa: 'Melayu',
      warganegara: 'Warganegara',
      status_perkahwinan: 'Berkahwin',
      pekerjaan: 'Suri Rumah',
      pendapatan: '0.00'
    },
    {
      nama: 'MOHAMED BIN AHMAD',
      hubungan: 'Anak',
      no_id: '100101121236',
      tarikh_lahir: '01/01/2010',
      jantina: 'Lelaki',
      bangsa: 'Melayu',
      warganegara: 'Warganegara',
      status_perkahwinan: 'Bujang',
      pekerjaan: 'Pelajar',
      pendapatan: '0.00'
    }
  ],

  // Section K: Maklumat Peribadi Tanggungan
  tanggungan: [
    {
      // Maklumat Peribadi
      nama: 'ALI BIN AHMAD',
      jenis_id: 'Kad Pengenalan',
      no_id: '880101121237',
      no_pengenalan: '880101121237',
      jantina: 'Lelaki',
      tarikh_lahir: '01/01/1988',
      tempat_lahir: 'Kuala Lumpur',
      bangsa: 'Melayu',
      warganegara: 'Warganegara',
      status_perkahwinan: 'Berkahwin',
      tarikh_masuk_islam: '01/01/2010',
      tarikh_masuk_kfam: '01/02/2010',
      tempoh_menetap_selangor: '10',
      no_telefon: '0123456789',
      // Maklumat Perbankan
      nama_pemegang_akaun: 'ALI BIN AHMAD',
      bank: 'Bank Islam',
      no_akaun_bank: '1234567890',
      cara_pembayaran: 'Akaun',
      // Maklumat Pendidikan
      bersekolah: 'Ya',
      pendidikan_tertinggi: 'SPM',
      nama_sekolah: 'SMK Taman Melati',
      alamat_sekolah: 'Jalan Melati 1, Taman Melati',
      daerah_sekolah: 'Gombak',
      negeri_sekolah: 'Selangor',
      poskod_sekolah: '53100',
      jenis_sekolah: 'Sekolah Menengah Kebangsaan',
      // Maklumat Kesihatan
      tahap_kesihatan: 'Sihat',
      keadaan_kesihatan_sakit: 'Tidak Terlantar',
      kos_penjagaan_sakit: 'Berbayar',
      perbelanjaan_bulanan_sakit: '500.00',
      // Maklumat Pekerjaan
      pekerjaan_status: 'Bekerja',
      sektor_pekerjaan: 'Swasta',
      nama_majikan: 'ABC Sdn Bhd',
      no_tel_majikan: '0312345678',
      alamat_majikan: 'Jalan Industri 1, Taman Industri',
      bandar_majikan: 'Shah Alam',
      poskod_majikan: '40000',
      daerah_majikan: 'Petaling',
      negeri_majikan: 'Selangor',
      jawatan: 'Pekerja Am',
      negara_pekerjaan: 'Malaysia',
      status_jawatan: 'Tetap'
    }
  ],

  // Section L: Penilaian Awal
  penilaian_awal: {
    komitmen_tinggi: 'Ya',
    keperluan_mendesak: ['Makanan', 'Pendidikan', 'Kesihatan'],
    lain_keperluan: 'Bantuan kewangan untuk perubatan',
    dokumen_sokongan: [
      'Penyata bank.pdf',
      'Slip gaji.pdf',
      'Surat pengesahan.pdf'
    ]
  }
});

// Fake documents array (follow QB/03)
const documents = [
  {
    name: 'Sijil Nikah',
    type: 'PDF',
    url: '#',
  },
  {
    name: 'Salinan Kad Pengenalan',
    type: 'PDF',
    url: '#',
  },
  {
    name: 'Slip Gaji',
    type: 'PDF',
    url: '#',
  },
];

// Handle document download (demo)
function downloadDocument(doc) {
  // For demo, just log the document info
  // In production, you would trigger a real download
  // eslint-disable-next-line no-console
  console.log('Download document:', doc);
}

const handleHantar = () => {
  // Check if dokumen lengkap is "Tidak" before proceeding
  if (dokumenLengkap.value === 'Tidak') {
    // Show notification when "Tidak" is selected and Hantar is clicked
    showNotificationMessage('Notifikasi sudah dihantar ke pemohon.');
    return; // Don't proceed with navigation
  }
  
  // TODO: Implement send/hantar logic
  router.push('/BF-PRF/AS/FR/04');
};

const handleSimpanDraf = () => {
  // TODO: Implement save draft logic
  alert('Permohonan disimpan sebagai draf.');
};

const handleKembali = () => {
  // TODO: Implement back/kembali logic
  router.back();
};

// State for document completeness
const dokumenLengkap = ref(null);

// New state for komen penyemak
const komenPenyemak = ref('');

// Function to handle document completeness change
const handleDokumenLengkapChange = () => {
  try {
    // Validate that dokumenLengkap has a value
    if (!dokumenLengkap.value) {
      console.warn('Dokumen Lengkap value is undefined or null');
      return;
    }
    
    // This function is called when the radio button changes
    // The popup will now only show when Hantar button is clicked
    // eslint-disable-next-line no-console
    console.log('Dokumen Lengkap changed to:', dokumenLengkap.value);
    
    // Automatically update komen penyemak based on selection
    if (dokumenLengkap.value === 'Tidak') {
      komenPenyemak.value = 'Tidak Lengkap';
    } else if (dokumenLengkap.value === 'Ya') {
      komenPenyemak.value = '';
    }
  } catch (error) {
    console.error('Error handling dokumen lengkap change:', error);
  }
};

// State for notification
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationFading = ref(false);

// Function to show notification
const showNotificationMessage = (message) => {
  notificationMessage.value = message;
  showNotification.value = true;
  setTimeout(() => {
    notificationFading.value = true;
    setTimeout(() => {
      showNotification.value = false;
      notificationFading.value = false;
    }, 300); // Transition duration
  }, 5000); // Show for 5 seconds
};

// New state for semakan data
const semakanData = ref({
  peribadi: 'Ya',
  pendidikan: 'Ya',
  pengislaman: 'Ya',
  perbankan: 'Ya',
  kesihatan: 'Ya',
  kemahiran: 'Ya',
  alamat: 'Ya',
  pinjaman: 'Ya',
  aset: 'Ya',
  barang: 'Ya',
  pekerjaan: 'Ya',
  pendapatan: 'Ya',
  waris: 'Ya',
  peribadi_tanggungan: 'Ya',
  pengislaman_tanggungan: 'Ya',
  pendidikan_tanggungan: 'Ya',
  kesihatan_tanggungan: 'Ya',
  kemahiran_tanggungan: 'Ya',
  pekerjaan_tanggungan: 'Ya',
  perakuan_ketua_keluarga: 'Ya',
  pengesahan_permastautin: 'Ya',
  pengesahan_pendapatan: 'Ya',
});

// Function to set all semakan radio buttons to "Ya"
const setAllSemakanToYa = () => {
  try {
    // Validate that semakanData exists
    if (!semakanData.value) {
      console.error('Semakan data is not initialized');
      return;
    }
    
    // Set all fields to "Ya"
    semakanData.value.peribadi = 'Ya';
    semakanData.value.pendidikan = 'Ya';
    semakanData.value.pengislaman = 'Ya';
    semakanData.value.perbankan = 'Ya';
    semakanData.value.kesihatan = 'Ya';
    semakanData.value.kemahiran = 'Ya';
    semakanData.value.alamat = 'Ya';
    semakanData.value.pinjaman = 'Ya';
    semakanData.value.aset = 'Ya';
    semakanData.value.barang = 'Ya';
    semakanData.value.pekerjaan = 'Ya';
    semakanData.value.pendapatan = 'Ya';
    semakanData.value.waris = 'Ya';
    semakanData.value.peribadi_tanggungan = 'Ya';
    semakanData.value.pengislaman_tanggungan = 'Ya';
    semakanData.value.pendidikan_tanggungan = 'Ya';
    semakanData.value.kesihatan_tanggungan = 'Ya';
    semakanData.value.kemahiran_tanggungan = 'Ya';
    semakanData.value.pekerjaan_tanggungan = 'Ya';
    semakanData.value.perakuan_ketua_keluarga = 'Ya';
    semakanData.value.pengesahan_permastautin = 'Ya';
    semakanData.value.pengesahan_pendapatan = 'Ya';
    
    // Show success notification
    showNotificationMessage('Semua pilihan semakan telah diubah ke Ya.');
  } catch (error) {
    console.error('Error setting all semakan to Ya:', error);
    showNotificationMessage('Ralat berlaku semasa mengubah pilihan semakan.');
  }
};

</script>

<style scoped>
@media print {
  .rs-button {
    display: none;
  }
}
</style>
