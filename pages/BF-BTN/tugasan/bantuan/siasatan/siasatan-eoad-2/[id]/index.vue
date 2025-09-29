																	  

<template>
    <div>
        <LayoutsBreadcrumb :items="breadcrumb" />
  
      
  
      <div class="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div class="col-span-1">
          <rs-card class="">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">
              {{ shouldHideSections ? 'Maklumat Organisasi' : 'Maklumat Pemohon' }}
            </h2>
            <rs-badge
              v-if="formData.status"
              :variant="getStatusVariant(formData.status)"
            >
              {{ formData.status }}
            </rs-badge>
          </div>
        </template>
  
        <template #body>
          <!-- Organization Data for NAS-2025-0005 -->
          <div v-if="shouldHideSections" class="space-y-4">
            <rs-collapse>
              <!-- Organization Fields - Always Visible -->
              <rs-card class="mb-4">
                <template #body>
                  <div class="p-4 space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        type="text"
                        name="organizationName"
                        label="Nama Organisasi"
                        value="Masjid At-Taqwa"
                        readonly
                      />
                      <FormKit
                        type="text"
                        name="registrationNumber"
                        label="Nombor Pendaftaran Organisasi (SSM/ROS)"
                        value="PPM-001-10-14032020"
                        readonly
                      />
                      <FormKit
                        type="text"
                        name="organizationType"
                        label="Jenis Organisasi"
                        value="Masjid"
                        readonly
                      />
                      <FormKit
                        type="text"
                        name="kawasanZon"
                        label="Kawasan / Zon (jika berkaitan)"
                        value="Zon Utara Selangor"
                        readonly
                      />
                    </div>
                  </div>
                </template>
              </rs-card>

              <!-- Alamat -->
              <rs-collapse-item type="card" title="Alamat">
                <div class="p-4 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit
                      type="text"
                      name="country"
                      label="Negara"
                      value="Malaysia"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="addressLine1"
                      label="Alamat 1"
                      value="Jalan Masjid At-Taqwa"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="state"
                      label="Negeri"
                      value="Selangor"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="addressLine2"
                      label="Alamat 2"
                      value="Taman Harmoni"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="district"
                      label="Daerah"
                      value="Kuala Selangor"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="addressLine3"
                      label="Alamat 3"
                      value="Seksyen 7"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="city"
                      label="Bandar"
                      value="Shah Alam"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="postcode"
                      label="Poskod"
                      value="40100"
                      readonly
                    />
                  </div>
                </div>
              </rs-collapse-item>

              <!-- Maklumat Perhubungan -->
              <rs-collapse-item type="card" title="Maklumat Perhubungan">
                <div class="p-4 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit
                      type="text"
                      name="contactPerson"
                      label="Nama Orang Hubungan"
                      value="Ustaz Ahmad bin Ibrahim"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="contactPosition"
                      label="Jawatan"
                      value="Imam"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="phoneNumber"
                      label="Nombor Telefon"
                      value="03-55123456"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="mobileNumber"
                      label="Nombor Telefon Bimbit"
                      value="012-3456789"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="email"
                      label="Alamat E-mel"
                      value="info@masjidattaqwa.org.my"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="faxNumber"
                      label="Nombor Faks"
                      value="03-55123457"
                      readonly
                    />
                  </div>
                </div>
              </rs-collapse-item>

              <!-- Maklumat Bank -->
              <rs-collapse-item type="card" title="Maklumat Bank">
                <div class="p-4 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit
                      type="text"
                      name="bankName"
                      label="Nama Bank"
                      value="Maybank"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="bankAccountNumber"
                      label="Nombor Akaun Bank"
                      value="512345678901"
                      readonly
                    />
                    <FormKit
                      type="text"
                      name="accountHolderName"
                      label="Nama Pemegang Akaun"
                      value="Masjid At-Taqwa"
                      readonly
                    />
                  </div>
                </div>
              </rs-collapse-item>

              <!-- Dokumen Sokongan -->
              <rs-collapse-item type="card" title="Dokumen Sokongan">
                <div class="p-4 space-y-4">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span class="text-sm">Sijil Pendaftaran Organisasi</span>
                      <rs-badge variant="success">Lengkap</rs-badge>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span class="text-sm">Penyata Bank Terkini</span>
                      <rs-badge variant="success">Lengkap</rs-badge>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span class="text-sm">Surat Kebenaran Pengerusi/Imam</span>
                      <rs-badge variant="success">Lengkap</rs-badge>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span class="text-sm">Minit Mesyuarat</span>
                      <rs-badge variant="success">Lengkap</rs-badge>
                    </div>
                  </div>
                </div>
              </rs-collapse-item>
            </rs-collapse>
          </div>
              <!-- Step 1: Maklumat Peribadi -->
              <FormKit v-if="currentStepA === 1" type="form" :actions="false" @submit="nextStepA">
                <!-- <rs-collapse ref="peribadiCollapse" class="mb-4">
                  <rs-collapse-item :open="isPeribadiAsnafOpen" type="card" title="A. Maklumat Peribadi Asnaf">
                    <div> -->
                <h3 v-if="!shouldHideSections" class="text-lg font-semibold mb-4">A. Maklumat Peribadi Asnaf</h3>
                <h3 v-if="!shouldHideSections" class="text-lg font-semibold mb-4">Maklumat Peribadi</h3>

                <div v-if="!shouldHideSections">
                <FormKit type="text" name="kategori_asnaf" label="Kategori Asnaf" value="Miskin" readonly="true" />

                <div class="mb-6">
                  <h4 class="text-md font-medium mb-3">Maklumat Peribadi</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit readonly="true" type="select" name="jenis_id" label="Jenis ID" :options="[
                      { label: 'MyKad', value: 'mykad' },
                      { label: 'Foreign ID', value: 'foreign_id' },
                    ]" v-model="formDataPRF.jenis_id" />

                    <FormKit readonly="true" type="text" name="id_pengenalan" label="ID Pengenalan" v-model="formDataPRF.no_pengenalan" />

                    <FormKit v-if="formDataPRF.jenis_id" readonly="true" type="file" name="dokumen_id" :label="`Upload ${formDataPRF.jenis_id}`" accept=".pdf,.jpg,.jpeg,.png" v-model="formDataPRF.dokumen_id" />

                    <FormKit type="text" name="nama" label="Nama" v-model="formDataPRF.nama" />

                    <FormKit type="select" name="warganegara" label="Warganegara" :options="['Malaysia', 'Lain-lain']" v-model="formDataPRF.warganegara" />

                    <FormKit v-if="formDataPRF.warganegara === 'Lain-lain'" type="file" name="lain_warganegara" label="Lain-lain Warganegara" accept=".pdf,.jpg,.jpeg,.png" v-model="formDataPRF.lain_warganegara" />

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="formDataPRF.warganegara === 'Lain-lain'">
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-black-700">Taraf Penduduk Tetap</label>
                        <FormKit type="radio" name="taraf_penduduk" :options="[{ label: 'Ya', value: 'Y' }, { label: 'Tidak', value: 'N' }]" v-model="formDataPRF.taraf_penduduk" />
                  </div>
                </div>

                    <FormKit v-if="formDataPRF.warganegara === 'Lain-lain'" type="text" name="nopassportlama" label="No Passport Lama" v-model="formDataPRF.nopassportlama" />

                    <FormKit v-if="formDataPRF.warganegara === 'Lain-lain' && formDataPRF.jenis_id === 'foreign_id'" type="date" name="passportStartDate" label="Tarikh mula passport" v-model="formDataPRF.passportStartDate" />
                    <FormKit v-if="formDataPRF.warganegara === 'Lain-lain' && formDataPRF.jenis_id === 'foreign_id'" type="date" name="passportEndDate" label="Tarikh tamat passport" v-model="formDataPRF.passportEndDate" />
                </div>
              </div>

                <div class="mb-6">
                  <h4 class="text-md font-medium mb-3">Butiran Peribadi</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="date" name="tarikh_lahir" label="Tarikh Lahir" v-model="formDataPRF.tarikh_lahir" />
                    <FormKit type="text" name="umur" label="Umur" v-model="formDataPRF.umur" readonly />
                    <FormKit type="text" name="tempat_lahir" label="Tempat Lahir" v-model="formDataPRF.tempat_lahir" />
                    <FormKit type="select" name="jantina" label="Jantina" :options="['Lelaki', 'Perempuan']" v-model="formDataPRF.jantina" />
                    <FormKit type="select" name="agama" label="Agama" :options="['Islam', 'Kristian', 'Buddha', 'Hindu', 'Lain-lain']" v-model="formDataPRF.agama" />
                    <FormKit v-if="formDataPRF.agama === 'Lain-lain'" type="text" name="agama_lain" label="Agama Lain" v-model="formDataPRF.agama_lain" />
                    <FormKit type="select" name="bangsa" label="Bangsa" :options="['Melayu', 'Cina', 'India', 'Lain-lain']" v-model="formDataPRF.bangsa" />
                    <FormKit v-if="formDataPRF.bangsa === 'Lain-lain'" type="text" name="bangsa_lain" label="Bangsa Lain" v-model="formDataPRF.bangsa_lain" />
                    <FormKit type="text" name="no_telefon_bimbit" label="No Telefon Bimbit" v-model="formDataPRF.no_telefon_bimbit" />
                    <FormKit type="email" name="emel" label="Emel" v-model="formDataPRF.emel" />
                  </div>
                </div>

                <div class="mb-6">
                  <h4 class="text-md font-medium mb-3">Status Perkahwinan</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="select" name="status_perkahwinan" label="Status Perkahwinan" :options="['Berkahwin','Bujang','Janda','Ibu Tinggal','Bapa Tinggal','Duda','Balu']" v-model="formDataPRF.status_perkahwinan" />
                    <FormKit type="select" name="status_poligami" label="Status Poligami" :options="[{ label: 'Tidak', value: 'tidak' },{ label: 'Ya', value: 'ya' }]" v-model="formDataPRF.status_poligami" />
                    <div v-if="formDataPRF.status_poligami === 'ya'" class="md:col-span-2">
                      <FormKit type="select" name="bilangan_isteri" label="Bilangan Isteri" :options="[{ label: '2', value: 2 },{ label: '3', value: 3 },{ label: '4', value: 4 }]" v-model="formDataPRF.bilangan_isteri" />
                      <div v-for="(isteri, idx) in isteriList" :key="idx" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormKit type="text" :name="`no_kp_isteri_${idx}`" :label="`No Kp Pasangan #${idx + 1}`" v-model="formDataPRF.isteri_list[idx].no_kp" />
                        <FormKit type="text" :name="`nama_isteri_${idx}`" :label="`Nama Pasangan #${idx + 1}`" v-model="formDataPRF.isteri_list[idx].nama" />
                  </div>
                </div>
                  </div>
                </div>

                </div> <!-- End of shouldHideSections conditional -->
              <!-- </div>
                  </rs-collapse-item>
                </rs-collapse> -->
              </FormKit>

              <rs-collapse v-if="!shouldHideSections" class="mt-6">

              <!-- Section A Form - Step 2: Maklumat Pendidikan -->
              <rs-collapse-item type="card" title="Maklumat Pendidikan">
                <FormKit
                  type="form"
                  @submit="nextStepA"
                  :actions="false"
                  id="sectionA3"
                >

                <div class="mb-8">
                  <h4 class="text-lg font-semibold mb-4">Maklumat Pendidikan Asas</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-black-700">Masih Bersekolah</label>
                      <FormKit type="radio" name="masih_bersekolah" :options="[{ label: 'Ya', value: 'Y' },{ label: 'Tidak', value: 'T' }]" v-model="formDataPRF.masih_bersekolah" />
          </div>
                    <FormKit type="select" name="pendidikan_tertinggi" label="Pendidikan Tertinggi" :options="['Peringkat Rendah','SRP/PMR','SPM','Sijil','Diploma','STPM','Ijazah','Lain-lain']" v-model="formDataPRF.pendidikan_tertinggi" />
              </div>
                  <div v-if="formDataPRF.pendidikan_tertinggi === 'Lain-lain'" class="mt-4">
                    <FormKit type="text" name="lain_pendidikan_tertinggi" label="Lain-lain Pendidikan Tertinggi" v-model="formDataPRF.lain_pendidikan_tertinggi" />
            </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-black-700">Tahap Pendidikan yang Dicapai</label>
                    <FormKit type="checkbox" name="tahap_pendidikan" :options="['Peringkat Rendah','SRP/PMR','SPM','Sijil','Diploma','STPM','Ijazah','Lain-lain']" v-model="formDataPRF.tahap_pendidikan" />
                </div>
                </div>

                <div v-if="formDataPRF.tahap_pendidikan && formDataPRF.tahap_pendidikan.includes('Lain-lain')" class="mt-4">
                  <FormKit type="text" name="lain_tahap_pendidikan" label="Lain-lain Tahap Pendidikan yang Dicapai" v-model="formDataPRF.lain_tahap_pendidikan" />
                        </div>
  
                <div class="mt-6">
                        <FormKit
                    type="file"
                    name="sijil_pendidikan"
                    label="Upload Sijil Pendidikan yang Diperolehi"
                    multiple="true"
                    accept=".pdf,.jpg,.jpeg,.png"
                    help="Format yang diterima: PDF, JPG, JPEG, PNG"
                    v-model="formDataPRF.sijil_pendidikan"
                        />
                      </div>

                <div v-if="formDataPRF.masih_bersekolah === 'Y'" class="mb-8">
                  <h4 class="text-lg font-semibold mb-4">Maklumat Sekolah / Institusi</h4>
                  <div v-if="formDataPRF.education_entries && formDataPRF.education_entries.length > 0">
                    <div v-for="(edu, index) in formDataPRF.education_entries" :key="index" class="mb-8 p-4 border border-gray-200 rounded-lg">
                      <div class="flex justify-between items-center mb-4">
                        <h5 class="text-md font-medium">Sekolah / Institusi #{{ index + 1 }}</h5>
                        <button type="button" @click="removeEducationEntry(index)" class="text-red-500 hover:text-red-700">
                          <Icon name="mdi:delete" size="1.1rem" />
                        </button>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormKit type="select" :name="`edu${index}JenisSekolah`" label="Jenis Sekolah / Institusi" :options="[{ label: 'Peringkat Rendah', value: 'rendah' },{ label: 'Peringkat Tinggi', value: 'tinggi' }]" v-model="edu.jenis_sekolah" />
                        <FormKit type="select" :name="`edu${index}KategoriSekolah`" label="Kategori Sekolah / Institusi" :options="['SEK.MEN','SRK','IPT','SRA','KAFA']" v-model="edu.kategori_sekolah" />
                      </div>
                      <div v-if="edu.kategori_sekolah === 'IPT'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormKit type="date" :name="`edu${index}TarikhMulaPengajian`" label="Tarikh Mula Pengajian" v-model="edu.tarikh_mula_pengajian" />
                        <FormKit type="date" :name="`edu${index}TarikhTamatPengajian`" label="Tarikh Tamat Pengajian" v-model="edu.tarikh_tamat_pengajian" />
                      </div>
                      <div v-if="edu.kategori_sekolah" class="mt-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormKit type="text" :name="`edu${index}TahunBersekolah`" label="Tahun Bersekolah (YYYY)" v-model="edu.tahun_bersekolah" />
                          <FormKit type="text" :name="`edu${index}Tingkatan`" label="Tahun / Tingkatan / Tahun Pengajian / Semester" v-model="edu.tahun_tingkatan" />
                        </div>
                        <div class="mt-4">
                          <FormKit type="select" :name="`edu${index}NamaSekolah`" label="Nama Sekolah / Institusi" :options="getFilteredSchoolOptions(edu.kategori_sekolah)" v-model="edu.nama_sekolah" @input="onSelectSchool(index, $event)" />
                        </div>
                        <div v-if="edu.kategori_sekolah === 'SRA' || edu.kategori_sekolah === 'SRK'" class="mt-4">
                          <label class="block text-sm font-medium text-black-700 mb-4">Kategori Sekolah Rendah</label>
                          <FormKit type="checkbox" :name="`edu${index}KategoriRendah`" :options="[{ label: 'Sekolah Agama', value: 'agama' },{ label: 'Sekolah Kebangsaan', value: 'kebangsaan' }]" v-model="edu.sekolah_rendah_kategori" />
                        </div>
                        <div class="mt-4">
                          <FormKit type="text" :name="`edu${index}Alamat1`" label="Alamat 1" v-model="edu.alamat_sekolah_1" />
                          <FormKit type="text" :name="`edu${index}Alamat2`" label="Alamat 2" v-model="edu.alamat_sekolah_2" v-if="edu.alamat_sekolah_1" />
                          <div class="mt-4">
                            <FormKit type="text" :name="`edu${index}Alamat3`" label="Alamat 3" v-model="edu.alamat_sekolah_3" v-if="edu.alamat_sekolah_1" />
                          </div>
                          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <FormKit type="text" :name="`edu${index}Daerah`" label="Daerah" v-model="edu.daerah_sekolah" />
                            <FormKit type="text" :name="`edu${index}Bandar`" label="Bandar" v-model="edu.bandar_sekolah" />
                            <FormKit type="text" :name="`edu${index}Poskod`" label="Poskod" v-model="edu.poskod_sekolah" />
                          </div>
                        </div>
                        <div class="mt-6">
                          <FormKit type="select" :name="`edu${index}BidangKursus`" label="Bidang / Kursus Pengajian" :options="['Sijil','SKM','Diploma','Ijazah Sarjana Muda']" v-model="edu.bidang_kursus" />
                        </div>
                        <div v-if="edu.bidang_kursus" class="mt-4">
                          <FormKit type="text" :name="`edu${index}JurusanBidang`" label="Jurusan / Bidang" v-model="edu.jurusan_bidang" />
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-black-700">Pembiayaan Pengajian</label>
                            <FormKit type="checkbox" :name="`edu${index}PembiayaanPengajian`" :options="['JPA','PTPTN','LZS','Tiada','Lain-lain']" v-model="edu.pembiayaan_pengajian" />
                          </div>
                        </div>
                        <div v-if="edu.pembiayaan_pengajian && edu.pembiayaan_pengajian.includes('Lain-lain')" class="mt-4">
                          <FormKit type="text" :name="`edu${index}LainPembiayaan`" label="Lain-lain Pembiayaan Pengajian" v-model="edu.lain_pembiayaan" />
                        </div>
                        <div class="mt-6">
                          <FormKit type="textarea" :name="`edu${index}Catatan`" label="Catatan" v-model="edu.catatan" rows="3" />
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-center mt-4">
                      <rs-button variant="secondary" @click="addEducationEntry" type="button">
                        <Icon name="mdi:plus" class="mr-1" size="1rem" />
                        Tambah Sekolah / Institusi
                      </rs-button>
                    </div>
                  </div>
                  <div class="mb-8 mt-8">
                    <h4 class="text-lg font-semibold mb-4">Lain-lain Maklumat</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-black-700">Tinggal Bersama Keluarga</label>
                        <FormKit type="radio" name="tinggal_bersama_keluarga" :options="[{ label: 'Ya', value: 'Y' },{ label: 'Tidak', value: 'T' }]" v-model="formDataPRF.tinggal_bersama_keluarga" />
                      </div>
                      <div v-if="formDataPRF.tinggal_bersama_keluarga === 'T'">
                        <FormKit type="text" name="asrama_rumah_sewa" label="Asrama/Rumah Sewa" v-model="formDataPRF.asrama_rumah_sewa" />
                        <FormKit class="mt-4" type="text" name="nama_baitul" label="Nama Baitul" v-model="formDataPRF.nama_baitul" />
                      </div>
                    </div>
                    </div>
                  </div>		   
  
                </FormKit>
              </rs-collapse-item>

              <!-- Section A Form - Step 3: Maklumat Islam -->
              <rs-collapse-item type="card" title="Maklumat Pengislaman">
                <FormKit type="form" @submit="nextStepA" :actions="false" id="sectionA4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-black-700">Adakah anda seorang Muallaf?</label>
                    <FormKit type="radio" name="adakah_muallaf" :options="[{ label: 'Ya', value: 'Y' },{ label: 'Tidak', value: 'T' }]" v-model="formDataPRF.adakah_muallaf" />
                      </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="formDataPRF.adakah_muallaf === 'Y'">
                    <FormKit type="date" name="tarikh_masuk_islam" label="Tarikh Masuk Islam" v-model="formDataPRF.tarikh_masuk_islam" />
                  </div>
                  <div v-if="formDataPRF.adakah_muallaf === 'Y'">
                    <FormKit type="date" name="tarikh_masuk_kfam" label="Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)" v-model="formDataPRF.tarikh_masuk_kfam" />
                  </div>
                  <div v-if="formDataPRF.adakah_muallaf === 'Y' && !islamicDatesValidation.isValid" class="md:col-span-2 p-3 bg-red-50 border border-red-200 rounded">
                    <div class="text-red-600 text-sm"><strong>Ralat:</strong> {{ islamicDatesValidation.message }}</div>
                  </div>
                  <div v-if="formDataPRF.adakah_muallaf === 'Y'">
                    <FormKit type="text" name="nama_lain" label="Nama Lain" v-model="formDataPRF.nama_lain" />
                  </div>
                  <div v-if="formDataPRF.adakah_muallaf === 'Y'">
                          <FormKit
                      type="file"
                      name="dokumen_pengislaman"
                      label="Dokumen Pengislaman"
                      help="Salinan dokumen rasmi pengislaman. Format: PDF, JPG, PNG. Saiz maksimum: 5MB"
                      accept=".pdf,.jpg,.jpeg,.png"
                      v-model="formDataPRF.dokumen_pengislaman"
                    />
                  </div>
                </div>
                
                </FormKit>
              </rs-collapse-item>

              <!-- Section A Form - Step 4: Maklumat Bank -->
              <rs-collapse-item type="card" title="Maklumat Perbankan">
                <FormKit type="form" @submit="nextStepA" :actions="false" id="sectionA5">
                <div class="mb-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-black-700">Adakah anda mempunyai akaun bank?</label>
                      <div class="mb-6">
                        <FormKit type="radio" name="kaedah_pembayaran" :options="paymentMethodOptionsMain" v-model="formDataPRF.kaedah_pembayaran" />
                    </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-black-700">Adakah anda muflis/disenarai hitam oleh bank?</label>
                      <div class="mb-6">
                        <FormKit type="radio" name="muflis_disenarai_hitam" :options="[{ label: 'Ya', value: 'Y' },{ label: 'Tidak', value: 'T' }]" v-model="formDataPRF.muflis_disenarai_hitam" />
                      </div>
                    </div>
                  </div>
                  <div v-if="formDataPRF.kaedah_pembayaran === 'ya'" class="mb-6">
                    <h5 class="text-md font-medium mb-4">Maklumat Akaun Bank</h5>
                    <div v-for="(account, index) in formDataPRF.bank_accounts" :key="index" class="mb-6 p-4 border border-gray-200 rounded-lg">
                      <div class="flex justify-between items-center mb-4">
                        <h6 class="text-sm font-medium">Akaun Bank #{{ index + 1 }}</h6>
                        <button disabled type="button" @click="removeBankAccount(index)" class="text-red-500 hover:text-red-700">
                          <Icon name="mdi:delete" size="1.1rem" />
                        </button>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormKit type="select" :name="`bank${index}NamaBank`" label="Nama Bank" :options="bankOptions" v-model="account.nama_bank" />
                        <FormKit v-if="account.nama_bank" type="text" :name="`bank${index}SwiftCode`" label="Swift Code" :value="getSwiftCodeForBank(account.nama_bank)" readonly />
                        <FormKit type="text" :name="`bank${index}NoAkaun`" label="No. Akaun Bank" v-model="account.no_akaun_bank" />
                        <FormKit type="text" :name="`bank${index}NamaPemegang`" label="Nama Pemegang Akaun " v-model="account.nama_pemegang_akaun" />
                        <FormKit type="select" :name="`bank${index}JenisAkaun`" label="Jenis Akaun " :options="[{ label: 'Individu', value: 'individu' },{ label: 'Bersama', value: 'bersama' }]" v-model="account.jenis_akaun" />
                        <FormKit v-if="account.jenis_akaun === 'bersama'" type="text" :name="`bank${index}IdPengenalan`" label="Pengenalan Id " v-model="account.id_pengenalan" />
                        <FormKit v-if="account.jenis_akaun === 'bersama'" type="text" :name="`bank${index}NamaBersama`" label="Nama " v-model="account.nama_bersama" />
                        <FormKit v-if="account.jenis_akaun === 'bersama'" type="text" :name="`bank${index}Hubungan`" label="Hubungan " v-model="account.hubungan" />
                      </div>
                    </div>
                    <div class="flex justify-center mt-4">
                      <rs-button disabled variant="secondary" @click="addBankAccount" type="button">
                        <Icon name="mdi:plus" class="mr-1" size="1rem" />
                        Tambah Akaun Bank
                      </rs-button>
                    </div>
                  </div>
                  <div v-if="formDataPRF.kaedah_pembayaran === 'tidak'" class="mb-6">
                    <h5 class="text-md font-medium mb-4">Sebab Tiada Akaun Bank</h5>
                    <div class="md:col-span-2">
                      <FormKit type="select" name="sebab_tiada_akaun" label="Sebab " :options="noPaymentReasonOptions" v-model="formDataPRF.sebab_tiada_akaun" />
                    </div>
                    <div v-if="showLainLainSebabTiadaAkaun" class="mt-4">
                      <FormKit type="text" name="lain_lain_sebab_tiada_akaun" label="Lain-lain Sebab Tiada Akaun" placeholder="Sila nyatakan sebab lain" v-model="formDataPRF.lain_lain_sebab_tiada_akaun" />
                    </div>
                  </div>
                </div>
                
                </FormKit>
              </rs-collapse-item>

              <!-- Section A Form - Step 5: Maklumat Kesihatan -->
              <rs-collapse-item type="card" title="Maklumat Kesihatan">
                <FormKit type="form" @submit="nextStepA" :actions="false" id="sectionA6">
                <div class="mb-6">
                  <FormKit type="select" name="tahap_kesihatan" label="Tahap Kesihatan " :options="['Sihat','Sakit Kronik','OKU','Uzur']" v-model="formDataPRF.tahap_kesihatan" />
                    </div>
                <div v-if="formDataPRF.tahap_kesihatan === 'Sakit Kronik'" class="mb-8">
                  <h5 class="text-lg font-semibold mb-4">Maklumat Sakit Kronik</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="select" name="keadaan_kesihatan_sakit" label="Keadaan Kesihatan " :options="['Terlantar','Tidak Terlantar']" v-model="formDataPRF.keadaan_kesihatan_sakit" />
                    <FormKit type="select" name="kos_penjagaan_sakit" label="Kos Penjagaan " :options="['Berbayar','Tidak Berbayar']" v-model="formDataPRF.kos_penjagaan_sakit" />
                  </div>
                  <div class="mt-4">
                    <FormKit type="text" name="perbelanjaan_bulanan_sakit" label="Jumlah Perbelanjaan Bulanan (RM) " v-model="formDataPRF.perbelanjaan_bulanan_sakit" />
                  </div>
                </div>
                <div v-if="formDataPRF.tahap_kesihatan === 'OKU'" class="mb-8">
                  <h5 class="text-lg font-semibold mb-4">Maklumat OKU</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="select" name="kesempurnaan_fizikal" label="Kesempurnaan Fizikal " :options="['Sempurna','Cacat Mental','Cacat Fizikal']" v-model="formDataPRF.kesempurnaan_fizikal" />
                    <FormKit type="select" name="sebab_kecacatan" label="Sebab Kecacatan (Jika Cacat) " :options="['Sejak Lahir','Musibah']" v-model="formDataPRF.sebab_kecacatan" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormKit type="select" name="tahap_kecacatan" label="Tahap Kecacatan " :options="['Terlantar','Tidak Terlantar']" v-model="formDataPRF.tahap_kecacatan" />
                    <FormKit type="text" name="perbelanjaan_bulanan_oku" label="Jumlah Perbelanjaan Bulanan (RM) " v-model="formDataPRF.perbelanjaan_bulanan_oku" />
                  </div>
                </div>
                <div v-if="formDataPRF.tahap_kesihatan === 'Uzur'" class="mb-8">
                  <h5 class="text-lg font-semibold mb-4">Maklumat Uzur</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="select" name="keadaan_kesihatan_uzur" label="Keadaan Kesihatan " :options="['Terlantar','Tidak Terlantar']" v-model="formDataPRF.keadaan_kesihatan_uzur" />
                    <FormKit type="select" name="kos_penjagaan_uzur" label="Kos Penjagaan " :options="['Berbayar','Tidak Berbayar']" v-model="formDataPRF.kos_penjagaan_uzur" />
                  </div>
                  <div class="mt-4">
                    <FormKit type="text" name="perbelanjaan_bulanan_uzur" label="Jumlah Perbelanjaan Bulanan (RM) " v-model="formDataPRF.perbelanjaan_bulanan_uzur" />
                  </div>
                </div>
                <div v-if="formDataPRF.tahap_kesihatan && formDataPRF.tahap_kesihatan !== 'Sihat'" class="mb-6">
                  <h5 class="text-lg font-semibold mb-4">Dokumen Sokongan</h5>
                              <FormKit
                    type="file"
                    name="dokumen_sokongan_kesihatan"
                    label="Upload Dokumen Sokongan Berkaitan Kesihatan "
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple="true"
                    help="Format yang dibenarkan: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB"
                    v-model="formDataPRF.dokumen_sokongan_kesihatan"
                  />
                </div>
                
                </FormKit>
              </rs-collapse-item>

              <!-- Section A Form - Step 6: Kemahiran -->
              <rs-collapse-item type="card" title="Kemahiran">
                <FormKit type="form" @submit="nextStepA" :actions="false" id="sectionA7">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-black-700">Kemahiran</label>
                    <FormKit type="checkbox" name="kemahiran" :options="['Nelayan','Penternakan','Pertanian','Menjahit','Kraftangan','Memasak','Mengasuh','Perkhidmatan','Pertukangan','Perniagaan','Lain-lain']" v-model="formDataPRF.kemahiran" />
                          </div>
                    </div>
                <FormKit type="text" name="lain_lain_kemahiran" label="Lain-lain Kemahiran" v-if="formDataPRF.kemahiran && formDataPRF.kemahiran.includes('Lain-lain')" v-model="formDataPRF.lain_lain_kemahiran" />
                
                </FormKit>
              </rs-collapse-item>

              <!-- Section A Form - Step 7: Maklumat Alamat -->
              <rs-collapse-item type="card" title="Maklumat Alamat">
                <FormKit type="form" @submit="nextStepA" :actions="false" id="sectionA8">
                <div class="mb-6">
                  <h4 class="text-md font-medium mb-3">Alamat</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                      <FormKit type="textarea" name="alamat1" label="Alamat 1" v-model="formDataPRF.addressInfo.alamat1" />
                      <FormKit type="textarea" name="alamat2" label="Alamat 2" v-model="formDataPRF.addressInfo.alamat2" v-if="formDataPRF.addressInfo.alamat1" />
                      <FormKit type="textarea" name="alamat3" label="Alamat 3" v-model="formDataPRF.addressInfo.alamat3" v-if="formDataPRF.addressInfo.alamat1" />
                    </div>
                    <FormKit type="select" name="negeri" label="Negeri" :options="negeriOptions" v-model="formDataPRF.addressInfo.negeri" />
                    <FormKit type="select" name="daerah" label="Daerah" :options="daerahOptions" v-model="formDataPRF.addressInfo.daerah" />
                    <FormKit type="select" name="bandar" label="Bandar" :options="bandarOptions" v-model="formDataPRF.addressInfo.bandar" />
                    <FormKit type="select" name="poskod" label="Poskod" :options="poskodOptions" v-model="formDataPRF.addressInfo.poskod" />
                    <FormKit type="select" name="kariah" label="Kariah" :options="kariahOptions" v-model="formDataPRF.addressInfo.kariah" />
                    <div class="flex gap-2">
                      <FormKit v-model="formDataPRF.addressInfo.geolokasi" label="Geolokasi" type="text" class="flex-1" />
                      <rs-button disabled type="button" variant="primary-outline" @click="getLocation('addressInfo')" class="whitespace-nowrap mt-7">
                        <i class="fas fa-location-dot mr-2"></i>
                        Dapatkan Lokasi
                      </rs-button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit type="number" name="tempoh_menetap_selangor_nilai" label="Tempoh Menetap di Selangor" placeholder="0" min="0" v-model="formDataPRF.addressInfo.tempoh_menetap_selangor_nilai" />
                      <FormKit type="select" name="tempoh_menetap_selangor_unit" label="Unit Tempoh" :options="[{ label: 'Hari', value: 'hari' },{ label: 'Bulan', value: 'bulan' },{ label: 'Tahun', value: 'tahun' }]" v-model="formDataPRF.addressInfo.tempoh_menetap_selangor_unit" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit type="select" name="kategori_menetap" label="Kategori" :options="[{ label: 'Musafir', value: 'musafir' },{ label: 'Mukim', value: 'mukim' },{ label: 'Bermastautin', value: 'bermastautin' }]" v-model="formDataPRF.addressInfo.kategori_menetap" />
                      <div v-if="['musafir','mukim'].includes(formDataPRF.addressInfo.kategori_menetap)" class="space-y-2">
                        <label class="block text-sm font-medium text-black-700">Kelulusan Khas</label>
                        <FormKit type="radio" name="kelulusan_khas" :options="[{ label: 'Ya', value: 'Y' },{ label: 'Tidak', value: 'T' }]" v-model="formDataPRF.addressInfo.kelulusan_khas" />
                      </div>
                    </div>
                  </div>
                  <div v-if="formDataPRF.adakah_muallaf === 'Y'" class="flex gap-2">
                    <FormKit type="text" name="kursus_terpilih" label="Kursus Terpilih" readonly class="flex-1" v-model="formDataPRF.addressInfo.kursus_terpilih" />
                    <rs-button type="button" variant="secondary" @click="openKursusModal" class="whitespace-nowrap mt-7">
                      <i class="fas fa-list mr-2"></i>
                      Pilih Kursus
                    </rs-button>
                  </div>
                </div>
                <div class="mb-6">
                  <h4 class="text-md font-medium mb-3">Maklumat Tempat Tinggal</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="select" name="status_kediaman" label="Status Kediaman Tempat Tinggal" :options="['Milik Sendiri Tidak Berbayar','Milik Sendiri Berbayar','Sewa','Kuarters Majikan','Tumpang Rumah Ibu/Bapa/Mertua','Pusaka','Sumbangan LZS / PPRT / RISDA','Lain-lain']" v-model="formDataPRF.addressInfo.status_kediaman" />
                    <FormKit type="text" name="lain_lain_status_kediaman" label="Lain-lain Status Kediaman Tempat Tinggal" v-if="formDataPRF.addressInfo.status_kediaman === 'Lain-lain'" v-model="formDataPRF.addressInfo.lain_lain_status_kediaman" />
                    <FormKit type="select" name="keadaan_kediaman" label="Keadaan Kediaman" :options="['Baik','Sempurna','Uzur','Separa Uzur']" v-model="formDataPRF.addressInfo.keadaan_kediaman" />
                  </div>
                  <div class="mt-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit type="number" name="kadar_bayaran_bulanan" label="Status Kediaman jika Milik Sendiri Berbayar" step="0.01" min="0" v-if="formDataPRF.addressInfo.status_kediaman === 'Milik Sendiri Berbayar'" v-model="formDataPRF.addressInfo.kadar_bayaran_bulanan" />
                      <FormKit type="number" name="kadar_sewa_bulanan" label="Status Kediaman jika Sewa" step="0.01" min="0" v-if="formDataPRF.addressInfo.status_kediaman === 'Sewa'" v-model="formDataPRF.addressInfo.kadar_sewa_bulanan" />
                      <FormKit type="file" name="dokumen_perjanjian_sewa" label="Dokumen Perjanjian Sewa" accept=".pdf,.jpg,.jpeg,.png" v-if="formDataPRF.addressInfo.status_kediaman === 'Sewa'" v-model="formDataPRF.addressInfo.dokumen_perjanjian_sewa" />
                    </div>
                  </div>
                </div>
                
                </FormKit>
              </rs-collapse-item>

              <!-- Section A Form - Step 8: Maklumat Pinjaman Harta -->
              <rs-collapse-item type="card" title="Maklumat Pinjaman Harta">
                <FormKit type="form" @submit="nextStepA" :actions="false" id="sectionA9">
                <div class="mb-6">
                  <h4 class="text-md font-medium mb-3">Maklumat Pinjaman</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="text" name="nama_institusi_pemberi_pinjaman" label="Nama Institusi / Individu Pemberi Pinjaman" v-model="formDataPRF.nama_institusi_pemberi_pinjaman" />
                    <div v-if="formDataPRF.nama_institusi_pemberi_pinjaman" class="md:col-span-2">
                      <h4 class="text-md font-medium mb-3">Maklumat Pinjaman</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormKit type="text" name="jenis_pinjaman" label="Jenis Pinjaman" v-model="formDataPRF.jenis_pinjaman" />
                        <FormKit type="number" name="amaun_bayaran_bulanan" label="Amaun Bayaran Bulanan (RM)" step="0.01" min="0" v-model="formDataPRF.amaun_bayaran_bulanan" />
                        <FormKit type="number" name="jumlah_keseluruhan_perbelanjaan" label="Jumlah Keseluruhan Perbelanjaan (RM)" step="0.01" min="0" v-model="formDataPRF.jumlah_keseluruhan_perbelanjaan" />
                        <FormKit type="date" name="tahun_mula_pinjaman" label="Tahun Mula Pinjaman" v-model="formDataPRF.tahun_mula_pinjaman" />
                        <FormKit type="date" name="tahun_akhir_pinjaman" label="Tahun Akhir Pinjaman" v-model="formDataPRF.tahun_akhir_pinjaman" />
                        <div class="md:col-span-2">
                              <FormKit
                            type="file"
                            name="dokumen_perjanjian_pinjaman"
                            label="Dokumen Perjanjian Pinjaman"
                            accept=".pdf,.jpg,.jpeg,.png"
                            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                            v-model="formDataPRF.dokumen_perjanjian_pinjaman"
                          />
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                </FormKit>
              </rs-collapse-item>

              <!-- Section A Form - Step 9: Maklumat Pemilikan -->
              <rs-collapse-item type="card" title="Maklumat Pemilikan">
                <FormKit type="form" @submit="nextStepA" :actions="false" id="sectionA10">
                <h4 class="font-medium mb-2">Aset Cair</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit type="number" name="wang_simpanan" label="Jumlah wang simpanan (RM)" step="0.01" min="0" v-model="formDataPRF.wang_simpanan" />
                  <FormKit type="number" name="emas" label="Emas (gram)" step="0.01" min="0" v-model="formDataPRF.emas" />
                  <FormKit type="number" name="saham" label="Saham (RM)" step="0.01" min="0" v-model="formDataPRF.saham" />
                </div>
                <h4 class="font-medium mb-2 mt-4">Aset Tidak Cair</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-black-700">Jenis Kenderaan</label>
                    <FormKit type="checkbox" name="jenis_kenderaan" :options="['Basikal','Kereta','Motosikal','Van','Lori']" v-model="formDataPRF.jenis_kenderaan" />
                  </div>
                </div>
                <FormKit v-if="formDataPRF.jenis_kenderaan && formDataPRF.jenis_kenderaan.length > 0" type="number" name="kenderaan_total" label="Kenderaan (total unit)" min="0" v-model="formDataPRF.kenderaan_total" />
                <FormKit type="number" name="rumah_kedai" label="Rumah Kedai (unit)" min="0" v-model="formDataPRF.rumah_kedai" />
                <FormKit type="number" name="tanah_sawah" label="Tanah/Sawah (ekar)" step="0.01" min="0" v-model="formDataPRF.tanah_sawah" />
                          <FormKit
                  type="file"
                  name="dokumen_pemilikan"
                  label="Upload dokumen pemilikan"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Jika ada wang simpanan > 0, rumah kedai > 0, atau tanah/sawah > 0, dokumen adalah wajib"
                  v-model="formDataPRF.dokumen_pemilikan"
                />
                
                </FormKit>
              </rs-collapse-item>

              <!-- Section A Form - Step 10: Maklumat Pekerjaan -->
              <rs-collapse-item type="card" title="Maklumat Pekerjaan">
                <FormKit type="form" @submit="nextStepA" :actions="false" id="sectionA11">
                <div class="mb-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-black-700">Status Pekerjaan</label>
                      <FormKit type="radio" name="status_pekerjaan" :options="[{ label: 'Bekerja', value: 'bekerja' },{ label: 'Tidak Bekerja', value: 'tidak_bekerja' }]" v-model="formDataPRF.status_pekerjaan" />
                    </div>
                  </div>
                </div>
                <div v-if="formDataPRF.status_pekerjaan === 'bekerja'" class="mb-6">
                  <h4 class="text-md font-medium mb-3">Butiran Pekerjaan</h4>
                  <div class="mb-6">
                    <h5 class="text-sm font-medium mb-3">Sumber Pendapatan</h5>
                    <FormKit type="checkbox" name="sumber_pendapatan" :options="['Pengajian','Sumbangan keluarga','Individu','Institusi','Sumbangan Agensi','Lain-lain']" v-model="formDataPRF.sumber_pendapatan" />
                    <div v-if="formDataPRF.sumber_pendapatan && formDataPRF.sumber_pendapatan.includes('Lain-lain')" class="mt-4">
                      <FormKit type="text" name="lain_lain_sumber_pendapatan" label="Lain-lain Sumber Pendapatan" v-model="formDataPRF.lain_lain_sumber_pendapatan" />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="text" name="jenis_pekerjaan" label="Jenis Pekerjaan" v-model="formDataPRF.jenis_pekerjaan" />
                    <FormKit type="select" name="sektor_pekerjaan" label="Sektor Pekerjaan" :options="['Kerajaan','Swasta','Badan Berkanun','Kerja Sendiri','Lain-lain']" v-model="formDataPRF.sektor_pekerjaan" />
                    <FormKit v-if="showLainLainSektor" type="text" name="lain_lain_sektor" label="Lain-lain Sektor Pekerjaan" v-model="formDataPRF.lain_lain_sektor" />
                    <FormKit type="text" name="jawatan" label="Jawatan" v-model="formDataPRF.jawatan" />
                    <FormKit type="select" name="status_jawatan" label="Status Jawatan" :options="['Tetap','Kontrak','Sementara']" v-model="formDataPRF.status_jawatan" />
                    <FormKit type="number" name="pendapatan_kasar" label="Pendapatan Kasar (RM)" step="0.01" min="0" v-model="formDataPRF.pendapatan_kasar" />
                    <div class="md:col-span-2">
                      <FormKit type="file" name="pengesahan_pendapatan" label="Muat naik pengesahan pendapatan / penyata gaji ketua keluarga" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>
                        </div>
  
                </FormKit>
              </rs-collapse-item>

              <!-- Section A Form - Step 11: Maklumat Pendapatan & Perbelanjaan -->
              <rs-collapse-item type="card" title="Maklumat Pendapatan & Perbelanjaan">
                <FormKit type="form" @submit="nextStepA" :actions="false" id="sectionA12">
                <div class="mb-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="number" name="gaji_elaun_pendapatan" label="Gaji / Elaun / Pendapatan Diperoleh (RM)" step="0.01" min="0" v-model="formDataPRF.gaji_elaun_pendapatan" />
                    <FormKit type="number" name="pendapatan_isteri_suami_ibubapa_penjaga" label="Pendapatan Isteri/Suami/Ibubapa/Penjaga (RM)" step="0.01" min="0" v-model="formDataPRF.pendapatan_isteri_suami_ibubapa_penjaga" />
                    <FormKit type="number" name="pencen_perkeso" label="Pencen / PERKESO (RM)" step="0.01" min="0" v-model="formDataPRF.pencen_perkeso" />
                    <FormKit type="number" name="sumbangan_anak_anak" label="Sumbangan Anak-anak (RM)" step="0.01" min="0" v-model="formDataPRF.sumbangan_anak_anak" />
                    <FormKit type="number" name="bantuan_jkm" label="Bantuan Jabatan Kebajikan Masyarakat (RM)" step="0.01" min="0" v-model="formDataPRF.bantuan_jkm" />
                    <FormKit type="number" name="takaful" label="Takaful (RM)" step="0.01" min="0" v-model="formDataPRF.takaful" />
                    <FormKit type="number" name="sewa_rumah_tanah_kedai" label="Sewa Rumah / Tanah / Kedai (RM)" step="0.01" min="0" v-model="formDataPRF.sewa_rumah_tanah_kedai" />
                    <FormKit type="number" name="pendapatan_tanggungan_serumah" label="Pendapatan Tanggungan yang Tinggal Serumah (RM)" step="0.01" min="0" v-model="formDataPRF.pendapatan_tanggungan_serumah" />
                    <FormKit type="number" name="pendapatan_lain_lain" label="Pendapatan Lain-lain (RM)" step="0.01" min="0" v-model="formDataPRF.pendapatan_lain_lain" />
                    <FormKit type="number" name="perbelanjaan_makanan_minuman" label="Perbelanjaan Makanan dan Minuman (RM)" step="0.01" min="0" v-model="formDataPRF.perbelanjaan_makanan_minuman" />
                    <FormKit type="number" name="sewa_bayaran_pinjaman_perumahan" label="Sewa / Bayaran Pinjaman Perumahan (RM)" step="0.01" min="0" v-model="formDataPRF.sewa_bayaran_pinjaman_perumahan" />
                    <FormKit type="number" name="perbelanjaan_persekolahan_anak" label="Perbelanjaan Persekolahan Anak (RM)" step="0.01" min="0" v-model="formDataPRF.perbelanjaan_persekolahan_anak" />
                    <FormKit type="number" name="pengangkutan_tambang_bas_sekolah" label="Pengangkutan / Tambang Bas Sekolah (RM)" step="0.01" min="0" v-model="formDataPRF.pengangkutan_tambang_bas_sekolah" />
                    <FormKit type="number" name="bil_utiliti" label="Bil Utiliti (RM)" step="0.01" min="0" v-model="formDataPRF.bil_utiliti" />
                    <FormKit type="number" name="jumlah_bantuan_diterima" label="Jumlah Bantuan Diterima (RM)" step="0.01" min="0" value="2000" readonly="true" />
                        </div>
                      </div>
                
                </FormKit>
              </rs-collapse-item>

              <!-- Syor Status -->
              <rs-collapse-item type="card" title="Syor Status">
                <div class="p-4 space-y-6">
                  <h4 class="text-md font-semibold text-gray-900 mb-2 flex items-center">
                    <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2 text-green-600" />
                    Maklumat Syor
                  </h4>
                  <!-- Summary Information -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label class="block text-xs uppercase tracking-wide font-bold">Peratusan Perbezaan</label>
                      <p class="text-gray-900 font-medium">{{ profilingData.peratusanPerbezaan }}</p>
                    </div>
                    <div>
                      <label class="block text-xs uppercase tracking-wide font-bold">Kategori Keluarga Asnaf</label>
                      <p class="text-gray-900 font-medium">{{ profilingData.kategoriKeluargaAsnaf }}</p>
                    </div>
                    <div>
                      <label class="block text-xs uppercase tracking-wide font-bold">Kategori Asnaf</label>
                      <p class="text-gray-900 font-medium">{{ profilingData.kategoriAsnaf }}</p>
                    </div>
                  </div>

                  <!-- Table for Individual Data -->
                  <rs-table
                    :headers="tableHeaders"
                    :data="tableData"
                    :classes="{
                      table: 'min-w-full',
                      thead: 'bg-gray-50',
                      tbody: 'bg-white divide-y divide-gray-200',
                      th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                      td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                    }"
                  />

                  <!-- Ringkasan Keluarga (Syor) -->
                  <div class="mt-4">
                    <label class="block text-xs uppercase tracking-wide font-bold">Merit Keluarga(Syor)</label>
                    <p class="text-gray-900 font-medium">{{ profilingData.meritKeluargaSyor }}</p>

                    <label class="block text-xs uppercase tracking-wide mt-4 font-bold">Status Multidimensi Keluarga(Syor)</label>
                    <p class="text-gray-900 font-medium">{{ profilingData.statusMultidimensiKeluargaSyor }}</p>

                    <label class="block text-xs uppercase tracking-wide mt-4 font-bold">Quadrant Multidimensi Keluarga(Syor)</label>
                    <p class="text-gray-900 font-medium">{{ profilingData.quadrantMultidimensiKeluargaSyor }}</p>
                  </div>
                </div>
              </rs-collapse-item>

              <!-- Pengesahan Status (relocated to Maklumat Pemohon) -->
              <rs-collapse-item type="card" title="Pengesahan Status">
                <div class="p-4">
                  <rs-table
                    :data="pengesahanRows"
                    :columns="pengesahanColumns"
                    :showNoColumn="true"
                    :options="{ variant: 'default', striped: false, hover: false }"
                    :options-advanced="{ sortable: false, filterable: false }"
                    advanced
                  >
                    <template v-slot:nama="{ value }">
                      <FormKit type="text" v-model="value.nama" outer-class="mb-0" />
                    </template>
                    <template v-slot:kategori="{ value }">
                      <FormKit type="select" :options="kategoriIndividuOptions" v-model="value.kategori" outer-class="mb-0" />
                    </template>
                    <template v-slot:meritIndividu="{ value }">
                      <FormKit type="text" v-model="value.meritIndividu" outer-class="mb-0" />
                    </template>
                    <template v-slot:statusMultidimensi="{ value }">
                      <FormKit type="select" :options="statusMultidimensiOptions" v-model="value.statusMultidimensi" outer-class="mb-0" />
                    </template>
                    <template v-slot:pelarasan="{ value }">
                      <FormKit type="checkbox" v-model="value.pelarasan" outer-class="mb-0" />
                    </template>
                  </rs-table>
                </div>
              </rs-collapse-item>

              <!-- Had Kifayah & Multidimensi (relocated to Maklumat Pemohon) -->
              <rs-collapse-item type="card" title="Had Kifayah & Multidimensi">
                <div class="p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Had Kifayah Summary -->
                    <div class="bg-white rounded-lg shadow-md p-6">
                      <h3 class="text-lg font-semibold mb-2">Had Kifayah</h3>
                      <div class="mb-2">Baki Pendapatan: <span class="font-bold">RM-968</span></div>
                      <div class="mb-2">Peratusan Perbezaan: <span class="font-bold">50.81%</span></div>
                      <div class="mb-2">Kategori Keluarga Asnaf: <span class="font-bold">Miskin</span></div>
                      <div class="mb-2">Kategori Asnaf: <span class="font-bold">Miskin</span></div>
                      <div class="mb-2">Jumlah Had Kifayah: <span class="font-bold">RM1968.00</span></div>
                    </div>
                    <!-- Multidimensi Summary -->
                    <div class="bg-white rounded-lg shadow-md p-6">
                      <h3 class="text-lg font-semibold mb-2">Multidimensi</h3>
                      <div class="mb-2">Merit Keluarga: <span class="font-bold">0.55</span></div>
                      <div class="mb-2">Status Multidimensi: <span class="font-bold">Produktif C</span></div>
                      <div class="mb-2">Quadrant: <span class="font-bold">Asnaf Produktif Sementara</span></div>
                    </div>
                  </div>
                </div>
              </rs-collapse-item>

              </rs-collapse>
              <!-- END: Section A stepper -->
              </template>
            </rs-card>
          </div>
  
          <div class="col-span-1">
          <rs-card class="">
              <template #header>
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold">
                  {{ shouldShowSimpleTitle ? 'Maklumat Siasatan' : 'Maklumat Lawatan & Siasatan' }}
                </h2>
                </div>
              </template>
  
              <template #body>
                  <FormKit
                type="form"
                :actions="false"
                @submit="handleSubmitLawatan"
                v-model="investigationData"
              >
                <div class="space-y-8">
                  <!-- Ringkasan Profil -->
                  <div v-if="!shouldHideSections" class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-sm font-medium text-gray-700 mb-3">
                      Ringkasan Profil
                    </h3>
                    <ul class="text-sm space-y-1 text-gray-600">
                      <li>
                        • Jenis Pekerjaan:
                        {{
                          investigationData.jenisPekerjaan ||
                          "Bekerja sebagai tukang sapu di sekolah"
                        }}
                      </li>
                      <li>
                        • Status Kediaman:
                        {{ investigationData.statusKediaman || "Rumah Sewa" }}
                      </li>
                      <li>
                        • Jumlah bayaran rumah:
                        {{ investigationData.jumlahBayaranRumah || "RM500" }}
                      </li>
                      <li>
                        • Bil Tanggungan:
                        {{ investigationData.bilTanggungan || "2 Orang (Anak)" }}
                      </li>
                      <li>
                        • Status Tanggungan:
                        {{
                          investigationData.statusTanggungan ||
                          "Masih Bersekolah, Tidak Bekerja"
                        }}
                      </li>
                    </ul>
                    
                  </div>
  
                  <!-- Bantuan daripada Agensi (moved under Maklumat Lawatan & Siasatan) -->
                  <div>
                    <rs-collapse>
                      <rs-collapse-item v-if="!shouldHideSections" type="card" title="Bantuan daripada Agensi">
                        <div class="p-4">
                          <rs-table
                            :data="otherAgencyAssistance"
                            :columns="otherAgencyColumns"
                            :showNoColumn="true"
                            :options="{ variant: 'default', striped: true, hover: true }"
                            :options-advanced="{ sortable: true, filterable: false }"
                            advanced
                          >
                            <template v-slot:jumlah="{ text }">RM {{ text }}</template>
                          </rs-table>
                        </div>
                      </rs-collapse-item>
  
                      <rs-collapse-item type="card" title="Bantuan Sedia Ada">
                        <div class="p-4">
                          <rs-table
                            :data="existingAssistance"
                            :columns="existingAssistanceColumns"
                            :showNoColumn="true"
                            :options="{ variant: 'default', striped: true, hover: true }"
                            :options-advanced="{ sortable: true, filterable: false }"
                            advanced
                          >
                            <template v-slot:kadar="{ text }">RM {{ text }}</template>
                            <template v-slot:jumlah="{ text }">RM {{ text }}</template>
                            <template v-slot:status="{ text }">
                              <rs-badge :variant="getAssistanceStatusVariant(text)">{{ text }}</rs-badge>
                            </template>
                          </rs-table>
                        </div>
                      </rs-collapse-item>

                      <!-- Syor -->
                      <rs-collapse-item v-if="!shouldHideSections" type="card" title="Syor AI" v-model="isSyorOpen">
                        <div class="p-4 space-y-4" @click.stop @change.stop @input.stop>
                          <div @click.stop @change.stop @input.stop @focus.stop @blur.stop>
                          <rs-table
                            :data="recommendedAid"
                            :columns="recommendedAidColumns"
                            :showNoColumn="true"
                            :options="{ variant: 'default', striped: true, hover: true }"
                            :options-advanced="{ sortable: true, filterable: false }"
                            advanced
                              @click.stop
                              @change.stop
                              @input.stop
                          >
                            <template #header-terimaCadangan>
                              <div class="flex items-center gap-2" @click.stop>
                                <FormKit
                                  type="checkbox"
                                  v-model="selectAllSyor"
                                  @change="toggleSelectAllSyor"
                                  outer-class="mb-0"
                                />
                                <span class="text-sm">Pilih Semua</span>
                              </div>
                            </template>
                            <template v-slot:kadarDicadangkan="{ text }">RM {{ text }}</template>
                            <template v-slot:skorAI="{ text }">
                              <rs-badge :variant="getScoreVariant(text)">{{ text }}%</rs-badge>
                            </template>
                            <template v-slot:terimaCadangan="{ value }">
                              <div @click.stop @change.stop @input.stop @focus.stop @blur.stop>
                                <FormKit 
                                  type="checkbox" 
                                  v-model="value.terimaCadangan" 
                                  outer-class="mb-0"
                                  @click.stop
                                  @change.stop
                                  @input.stop
                                  @focus.stop
                                  @blur.stop
                                />
                              </div>
                            </template>
                          </rs-table>
                          </div>
                          <div class="flex justify-end">
                            <rs-button variant="primary" @click="confirmRecommendedAid">Sahkan</rs-button>
                          </div>
                        </div>
                      </rs-collapse-item>

                      <!-- Perubahan Bantuan -->
                      <rs-collapse-item v-if="!shouldHideSections" type="card" title="Perubahan Bantuan" v-model="isPerubahanBantuanOpen">
                        <div class="p-4 space-y-8" @click.stop @change.stop @input.stop>
                          <div class="space-y-3">
                            <h3 class="text-md font-semibold text-gray-900">Perubahan Status: Miskin > Fakir</h3>
                            <h4 class="text-md font-semibold text-gray-900">Senarai Bantuan yang mengalami Perubahan Kadar</h4>
                            <div @click.stop @change.stop @input.stop @focus.stop @blur.stop>
                            <rs-table
                              :data="bantuanPerubahanKadar"
                              :columns="perubahanColumns"
                              :showNoColumn="true"
                              :options="{ variant: 'default', striped: true, hover: true }"
                              :options-advanced="{ sortable: true, filterable: false }"
                              advanced
                                @click.stop
                                @change.stop
                                @input.stop
                            >
                              <template #header-terimaCadangan>
                                <div class="flex items-center gap-2" @click.stop>
                                  <FormKit
                                    type="checkbox"
                                    v-model="selectAllPerubahan"
                                    @change="toggleSelectAllPerubahan"
                                    outer-class="mb-0"
                                  />
                                  <span class="text-sm">Pilih Semua</span>
                                </div>
                              </template>
                              <template v-slot:terimaCadangan="{ value }">
                              <div @click.stop @change.stop @input.stop @focus.stop @blur.stop>
                                <FormKit 
                                  type="checkbox" 
                                  v-model="value.terimaCadangan" 
                                  outer-class="mb-0"
                                  @click.stop
                                  @change.stop
                                  @input.stop
                                  @focus.stop
                                  @blur.stop
                                />
                              </div>
                              </template>
                            </rs-table>
                            </div>
                            <div class="flex justify-end">
                              <rs-button variant="primary" @click="confirmPerubahanAid">Sahkan</rs-button>
                            </div>
                          </div>

                          <hr class="my-4" />

                          <div class="space-y-3">
                            <h4 class="text-md font-semibold text-gray-900">Senarai Bantuan Sedia Ada yang akan dibatalkan</h4>
                            <rs-table
                              :data="bantuanPembatalan"
                              :columns="pembatalanColumns"
                              :showNoColumn="true"
                              :options="{ variant: 'default', striped: true, hover: true }"
                              :options-advanced="{ sortable: true, filterable: false }"
                              advanced
                            >
                              <template #header-batalBantuan>
                                <div class="flex items-center gap-2" @click.stop>
                                  <FormKit
                                    type="checkbox"
                                    v-model="selectAllPembatalan"
                                    @change="toggleSelectAllPembatalan"
                                    outer-class="mb-0"
                                  />
                                  <span class="text-sm">Pilih Semua</span>
                                </div>
                              </template>
                              <template v-slot:batalBantuan="{ value }">
                                <FormKit type="checkbox" v-model="value.batalBantuan" outer-class="mb-0" />
                              </template>
                            </rs-table>
                            <div v-if="anyPembatalanSelected" class="mt-4">
                              <FormKit type="textarea" label="Justifikasi Pembatalan" placeholder="Nyatakan justifikasi pembatalan..." v-model="justifikasiPembatalan" />
                            </div>
                            <div class="flex justify-end">
                              <rs-button variant="primary" :disabled="!canConfirmPembatalan">Sahkan</rs-button>
                            </div>
                          </div>
                        </div>
                      </rs-collapse-item>

                      <!-- Bantuan Baru -->
                      <rs-card class="mb-4">
                        <template #header>
                          <div class="flex items-center justify-between">
                            <h3 class="text-lg font-medium text-gray-900">Bantuan Baru</h3>
                          </div>
                        </template>
                        <template #body>
                          <div>
                          <rs-table
                            :data="assistanceApplications"
                            :columns="assistanceColumns"
                            :showNoColumn="true"
                            :options="{ variant: 'default', striped: true, hover: true }"
                            :options-advanced="{ sortable: true, filterable: false }"
                            advanced
                          >
                            <template v-slot:status="{ text }">
                              <rs-badge :variant="getAssistanceStatusVariant(text)">{{ text }}</rs-badge>
                            </template>
                            <template v-slot:actions="{ value }">
                              <rs-button variant="primary" @click="editAssistance(value)">Edit</rs-button>
                            </template>
                          </rs-table>
                        </div>
                        </template>
                      </rs-card>

                      
  
                    </rs-collapse>
                  </div>
  
                  <!-- Keadaan Siasatan -->
                  <div>
                    <FormKit
                      type="select"
                      name="keadaanSiasatan"
                      label="Kaedah Siasatan"
                      :options="keadaanSiasatanOptions"
                      placeholder="--Sila Pilih--"
                      validation="required"
                      :validation-messages="{
                        required: 'Sila pilih kaedah siasatan untuk meneruskan',
                      }"
                    />
                </div>
  
                  <!-- Lapangan Fields (show when "Lapangan" is selected) -->
                  <div v-if="showLawatanFields" class="flex gap-4">
                    <!-- Tarikh Lawatan -->
                    <div class="flex-1">
                      <FormKit
                        type="date"
                        name="tarikhLawatan"
                        label="Tarikh Lawatan"
                        :validation="showLawatanFields ? 'required' : ''"
                        :validation-messages="{
                          required: 'Sila pilih tarikh lawatan',
                        }"
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
  
                    <!-- Masa Lawatan -->
                    <div class="flex-1">
                      <FormKit
                        type="time"
                        name="masaLawatan"
                        label="Masa Lawatan"
                        :validation="showLawatanFields ? 'required' : ''"
                        :validation-messages="{
                          required: 'Sila pilih masa lawatan',
                        }"
                        placeholder="--:--:--"
                      />
                  </div>
                  </div>
  
                  <div v-if="showLawatanFields">
                    <FormKit
                      type="select"
                      name="StatusPengesahanLawatan"
                      label="Status Pengesahan Lawatan"
                      :options="statuspengesahanlawatanOptions"
                      :validation="showLawatanFields ? 'required' : ''"
                      :validation-messages="{
                        required: 'Sila pilih status pengesahan lawatan',
                      }"
                    />
                </div>
  
                  <!-- Gambar Lokasi/Bukti Visual - Original Design -->
                  <div v-if="showLawatanFields">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Lokasi/Bukti Visual
                    </label>
  
                    <!-- Custom File Upload Area -->
                <div class="space-y-4">
                      <!-- Upload Dropzone -->
                      <div
                        @click="triggerFileInput"
                        @dragover.prevent
                        @dragenter.prevent
                        @drop.prevent="handleFileDrop"
                        class="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 group"
                      >
                        <div class="space-y-2">
                        <Icon
                            name="ph:upload"
                            class="w-12 h-12 text-blue-400 group-hover:text-blue-500 transition-colors duration-300 group-hover:scale-110 transform mx-auto"
                        />
                          <div>
                            <p class="text-sm text-gray-600">
                              <span
                                class="font-medium text-blue-600 hover:text-blue-500"
                                >Klik untuk pilih fail</span
                              >
                              atau seret dan lepas di sini
                            </p>
                            <p class="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF sehingga 5MB setiap fail
                            </p>
                          </div>
                          </div>
                          </div>
  
                      <!-- Hidden File Input -->
                      <input
                        ref="fileInputRef"
                        type="file"
                        accept="image/*"
                        multiple
                        @change="handleFileInputChange"
                        class="hidden"
                      />
  
                      <!-- Upload Progress -->
                      <div v-if="uploadProgress.length > 0" class="space-y-2">
                        <div
                          v-for="(progress, index) in uploadProgress"
                          :key="index"
                          class="bg-white rounded-lg border border-gray-200 p-3"
                        >
                          <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700">{{
                              progress.filename
                            }}</span>
                            <span class="text-xs text-gray-500">{{
                              formatFileSize(progress.size)
                            }}</span>
                          </div>
                          <div class="w-full bg-gray-200 rounded-full h-2">
                            <div
                              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              :style="{ width: `${progress.progress}%` }"
                            ></div>
                        </div>
                      </div>
                    </div>
  
                      <!-- Image Preview Gallery -->
                      <div
                        v-if="uploadedImages.length > 0"
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                      >
                        <div
                          v-for="(image, index) in uploadedImages"
                          :key="index"
                          class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm scroll-indicator hover:shadow-md transition-shadow"
                        >
                          <!-- Image Preview -->
                          <div class="aspect-square bg-gray-100 relative">
                            <img
                              :src="image.url"
                              :alt="`Gambar ${index + 1}`"
                              class="w-full h-full object-cover cursor-pointer"
                              @click="previewImage(image)"
                            />
  
                            <!-- Overlay Actions -->
                            <div
                              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                            >
                              <div
                                class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2"
                              >
                      <button
                                  @click.stop="previewImage(image)"
                                  class="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-md transition-all"
                        type="button"
                                  title="Preview"
                                >
                                  <Icon name="ph:eye" class="w-4 h-4" />
                      </button>
                                <button
                                  @click.stop="removeImage(index)"
                                  class="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white p-2 rounded-full shadow-md transition-all"
                                  type="button"
                                  title="Padam"
                                >
                                  <Icon name="ph:trash" class="w-4 h-4" />
                                </button>
                          </div>
                          </div>
  
                            <!-- Loading Indicator -->
                            <div
                              v-if="image.loading"
                              class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center"
                            >
                              <Icon
                                name="ph:spinner"
                                class="w-6 h-6 text-blue-600 animate-spin"
                              />
                          </div>
                          </div>
  
                          <!-- Image Info -->
                          <div class="p-3 space-y-2">
                            <!-- File Name -->
                            <div class="flex items-center justify-between">
                              <span
                                class="text-xs text-gray-500 truncate flex-1"
                                :title="image.filename"
                              >
                                {{ image.filename }}
                              </span>
                              <span class="text-xs text-gray-400 ml-2">
                                {{ formatFileSize(image.size) }}
                              </span>
                          </div>
  
                            <!-- Image Caption -->
                            <FormKit
                              type="text"
                              :name="`imageCaption_${index}`"
                              v-model="image.caption"
                              placeholder="Tambah keterangan..."
                              :classes="{
                                outer: 'mb-0',
                                input: 'text-xs !py-1.5 !text-gray-700',
                              }"
                            />
                        </div>
                      </div>
                  </div>
  
                      <!-- Sample Image Placeholder -->
                      <div
                        v-if="uploadedImages.length === 0"
                        class="mt-6 border border-gray-300 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 shadow-sm scroll-indicator"
                      >
                        <div
                          class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                        >
                          <div class="text-center">
                      <Icon
                              name="ph:image"
                              class="w-12 h-12 text-gray-400 mx-auto mb-2"
                            />
                    <p class="text-sm text-gray-500">
                              Tiada gambar dimuat naik lagi
                            </p>
                            <p class="text-xs text-gray-400 mt-1">
                              Gambar anda akan dipaparkan di sini
                    </p>
                  </div>
                </div>
                      </div>
                    </div>
                  </div>

                  <!-- Sejarah Tingkah Laku Asnaf -->
                  <div v-if="!shouldHideSections">
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                      Sejarah Tingkah Laku Asnaf
                    </label>
                    
                    <div class="overflow-x-auto">
                      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead class="bg-gray-50">
                          <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Tingkah Laku Asnaf
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Masa
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Tarikh
                            </th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                          <tr v-for="(record, index) in asnafHistoryData" :key="index" class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                              {{ record.tingkahLaku }}
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                              {{ record.masa }}
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                              {{ record.tarikh }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Tingkah Laku Asnaf -->
                  <div v-if="!shouldHideSections">
                    <FormKit
                      type="text"
                      name="tingkahLakuAsnaf"
                      label="Tingkah Laku Asnaf"
                      placeholder="Masukkan tingkah laku asnaf..."
                      validation="required"
                      :validation-messages="{
                        required: 'Sila masukkan tingkah laku asnaf untuk meneruskan',
                      }"
                    />
                  </div>
  
  
                  <!-- Catatan Penilaian Awal -->
                  <!-- <div>
                    <FormKit
                      type="textarea"
                      name="catatanPenilaianAwal"
                      label="Catatan Penilaian Awal"
                      rows="4"
                      placeholder="Enter text..."
                      :classes="{
                        input: '!py-2',
                      }"
                    />
                  </div> -->
  
  
                  <!-- Catatan Lawatan ETD -->
                  <div>
                <FormKit
                      type="textarea"
                      name="catatanLawatanETD"
                      label="Catatan Siasatan"
                      rows="4"
                      placeholder="Enter text..."
                      :classes="{
                        input: '!py-2',
                      }"
                    />
                  </div>
  
                  <!-- <div>
                  <FormKit
                      type="select"
                      name="statusSiasatan"
                      label="Status Siasatan"
                      :options="statusSiasatanOptions"
                      placeholder="--Sila Pilih--"
                      validation="required"
                      :validation-messages="{
                        required: 'Sila pilih status siasatan untuk meneruskan',
                      }"
                    />
                  </div> -->
  
                  <!-- Status Lawatan -->
                  <!-- <div>
                  <FormKit
                  type="select"
                      name="statusLawatan"
                      label="Status Lawatan"
                      :options="statusLawatanOptions"
                      placeholder="--Sila Pilih--"
                      validation="required"
                      :validation-messages="{
                        required: 'Sila pilih status lawatan',
                      }"
                    />
                  </div> -->
  
                  <!-- Action Buttons -->
                  <div
                    class="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200"
                  >
                <rs-button
                  variant="success"
                  @click="handleSimpan"
                  :disabled="processing"
                      :loading="processing && actionType === 'save'"
                      class="flex-1 !py-3 text-sm font-medium"
                >
                      <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                  Simpan
                </rs-button>
  
                <rs-button
                  variant="primary"
                      @click="handleHantarKelulusan"
                      :disabled="processing || !canSubmitForApproval"
                      :loading="processing && actionType === 'submit'"
                      class="flex-1 !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:paper-plane-tilt" class="w-5 h-5 mr-2" />
                  Hantar Kelulusan
                </rs-button>
  
                <rs-button
                  variant="danger"
                      @click="handleKembali"
                      class="flex-1 !py-3 text-sm font-medium"
                >
                      <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                  Kembali
                </rs-button>
              </div>
                </div>
              </FormKit>
            </template>
            </rs-card>
        </div>
      
        <!-- Second column placeholder (if needed) -->
        <div class="col-span-1">
          <!-- Second card content would go here -->
      </div>
      </div> <!-- Close grid -->
  
      <!-- Image Preview Modal -->
      <rs-modal v-model="showPreviewModal" size="xl" :closable="true">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Preview Gambar</h3>
            <div v-if="previewingImage" class="flex items-center gap-3">
              <span class="text-sm text-gray-500">{{
                formatFileSize(previewingImage.size)
              }}</span>
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="downloadImage(previewingImage)"
              >
                <Icon name="ph:download" class="w-4 h-4 mr-1" />
                Muat Turun
              </rs-button>
            </div>
          </div>
        </template>
        <template #body>
          <div v-if="previewingImage" class="space-y-4">
            <!-- Image Container -->
            <div class="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                :src="previewingImage.url"
                :alt="previewingImage.filename"
                class="w-full h-auto max-h-96 object-contain mx-auto"
                style="max-height: 70vh"
              />
            </div>
  
            <!-- Image Details -->
            <div
              class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 space-y-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Nama Fail</label
                  >
                  <p class="text-sm text-gray-900 bg-white p-2 rounded border">
                    {{ previewingImage.filename }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Saiz Fail</label
                  >
                  <p class="text-sm text-gray-900 bg-white p-2 rounded border">
                    {{ formatFileSize(previewingImage.size) }}
                  </p>
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Keterangan</label
                >
                <FormKit
                  type="textarea"
                  v-model="previewingImage.caption"
                  placeholder="Tambah keterangan untuk gambar ini..."
                  rows="3"
                  :classes="{
                    outer: 'mb-0',
                    input: 'text-sm !py-2',
                  }"
                />
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-3">
            <rs-button variant="secondary" @click="showPreviewModal = false">
              Tutup
            </rs-button>
            <rs-button variant="primary" @click="saveImageCaption">
              Simpan Keterangan
            </rs-button>
          </div>
        </template>
      </rs-modal>
  
      <!-- Maklumat Terperinci Pemohon Modal -->
      <rs-modal v-model="showMaklumatModal" size="xl" :closable="true">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Maklumat Terperinci Pemohon</h3>
          </div>
        </template>
        <template #body>
          <div class="h-96 overflow-y-auto">
            <div class="form-readonly">
              <!-- Progress indicator -->
              <div class="mb-6">
                <div class="flex justify-between mb-2">
                  <div
                    v-for="step in modalStepsA"
                    :key="step.id"
                    class="text-center flex-1 cursor-pointer"
                    :class="{ 'font-semibold': modalCurrentStepA >= step.id }"
                    @click="modalGoToStepA(step.id)"
                  >
                    {{ step.label }}
                  </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-primary h-2.5 rounded-full transition-all duration-300"
                    :style="`width: ${
                      modalCurrentStepA >= modalTotalStepsA
                        ? 100
                        : (modalCurrentStepA / modalTotalStepsA) * 100
                    }%`"
                  ></div>
                </div>
              </div>
  
              <!-- Tab Content -->
              <div class="min-h-64">
                <!-- Step 1: Peribadi -->
                <div v-if="modalCurrentStepA === 1">
                  <h3 class="text-lg font-semibold mb-4">A. Maklumat Peribadi Asnaf</h3>
                  <h3 class="text-lg font-semibold mb-4">Maklumat Peribadi</h3>
  
                  <FormKit
                    type="text"
                    name="kategori_asnaf"
                    label="Kategori Asnaf"
                    value="Miskin"
                    readonly="true"
                  />
  
                  <!-- Personal Information Section -->
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Maklumat Peribadi</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="select"
                        name="jenis_id"
                        label="Jenis ID"
                        placeholder="Pilih jenis ID"
                        :options="[
                          { label: 'MyKad', value: 'mykad' },
                          { label: 'Foreign ID', value: 'foreign_id' },
                        ]"
                        value="mykad"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="id_pengenalan"
                        label="ID Pengenalan"
                        help="Mengikut Dokumen Pengenalan"
                        :value="formData.noPengenalan"
                      />
  
                      <FormKit
                        readonly="true"
                        type="file"
                        name="dokumen_id"
                        :label="`Upload MyKad`"
                        accept=".pdf,.jpg,.jpeg,.png"
                        help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                        value="mykad_document.pdf"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="nama"
                        label="Nama"
                        help="Mengikut Dokumen Pengenalan"
                        :value="formData.nama"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="warganegara"
                        label="Warganegara"
                        placeholder="Pilih Warganegara"
                        :options="['Malaysia', 'Lain-lain']"
                        value="Malaysia"
                      />
  
                    </div>
                  </div>
  
                  <!-- Personal Details Section -->
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Butiran Peribadi</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="date"
                        name="tarikh_lahir"
                        label="Tarikh Lahir"
                        help="Format: dd-mm-yyyy"
                        value="1980-01-01"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="umur"
                        label="Umur"
                        value="44 tahun"
                        help="Auto dikira daripada Tarikh Lahir"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="tempat_lahir"
                        label="Tempat Lahir"
                        value="Kuala Lumpur"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="jantina"
                        label="Jantina"
                        :options="['Lelaki', 'Perempuan']"
                        placeholder="Pilih Jantina"
                        value="Lelaki"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="agama"
                        label="Agama"
                        :options="['Islam', 'Kristian', 'Buddha', 'Hindu', 'Lain-lain']"
                        placeholder="Pilih Agama"
                        value="Islam"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="bangsa"
                        label="Bangsa"
                        :options="['Melayu', 'Cina', 'India', 'Lain-lain']"
                        placeholder="Pilih Bangsa"
                        value="Melayu"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="no_telefon_bimbit"
                        label="No Telefon Bimbit"
                        :value="formData.noTelefon"
                      />
  
                      <FormKit
                        readonly="true"
                        type="email"
                        name="emel"
                        label="Emel"
                        :value="formData.email"
                      />
                    </div>
                  </div>
  
                  <!-- Marital Status Section -->
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Status Perkahwinan</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="select"
                        name="status_perkahwinan"
                        placeholder="Pilih Status Perkahwinan"
                        label="Status Perkahwinan"
                        :options="[
                          'Berkahwin',
                          'Bujang',
                          'Janda',
                          'Ibu Tinggal',
                          'Bapa Tinggal',
                          'Duda',
                          'Balu',
                        ]"
                        value="Berkahwin"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="status_poligami"
                        label="Status Poligami"
                        :options="['Ya', 'Tidak']"
                        value="Tidak"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Step 2: Pendidikan -->
                <div v-if="modalCurrentStepA === 2">
  
                  <!-- A. Maklumat Pendidikan Asas -->
                  <div class="mb-8">
                    <h4 class="text-lg font-semibold mb-4">Maklumat Pendidikan Asas</h4>
  
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- Masih Bersekolah -->
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-black-700">Masih Bersekolah</label>
                        <FormKit
                          readonly="true"
                          type="radio"
                          name="masih_bersekolah"
                          :options="[
                            { label: 'Ya', value: 'Y' },
                            { label: 'Tidak', value: 'T' },
                          ]"
                          value="T"
                        />
                      </div>
  
                      <!-- Pendidikan Tertinggi -->
                      <FormKit
                        readonly="true"
                        type="select"
                        name="pendidikan_tertinggi"
                        label="Pendidikan Tertinggi"
                        placeholder="Pilih Pendidikan Tertinggi"
                        :options="[
                          'Peringkat Rendah',
                          'SRP/PMR',
                          'SPM',
                          'Sijil',
                          'Diploma',
                          'STPM',
                          'Ijazah',
                          'Lain-lain',
                        ]"
                        value="SPM"
                      />
                    </div>
                  </div>
  
                  <!-- Tahap Pendidikan yang Dicapai -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-black-700">Tahap Pendidikan yang Dicapai</label>
                      <FormKit
                        readonly="true"
                        type="checkbox"
                        name="tahap_pendidikan"
                        placeholder="Pilih Tahap Pendidikan yang Dicapai"
                        :options="[
                          'Peringkat Rendah',
                          'SRP/PMR',
                          'SPM',
                          'Sijil',
                          'Diploma',
                          'STPM',
                          'Ijazah',
                          'Lain-lain',
                        ]"
                        :value="['SPM']"
                      />
                    </div>
                  </div>
  
                  <!-- Upload Sijil Pendidikan -->
                  <div class="mt-6">
                    <FormKit
                      readonly="true"
                      type="file"
                      name="sijil_pendidikan"
                      label="Upload Sijil Pendidikan yang Diperolehi"
                      multiple="true"
                      accept=".pdf,.jpg,.jpeg,.png"
                      help="Format yang diterima: PDF, JPG, JPEG, PNG"
                      value="sijil_pendidikan_sample.pdf"
                    />
                  </div>
                </div>
  
                <!-- Step 3: Pengislaman -->
                <div v-if="modalCurrentStepA === 3">
  
                  <!-- Status Muallaf & Tarikh Masuk Islam -->
                  <div class="mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="radio"
                        name="adakah_muallaf"
                        label="Status Muallaf"
                        :options="[
                          { label: 'Ya', value: 'Y' },
                          { label: 'Tidak', value: 'N' }
                        ]"
                        value="Y"
                      />
  
                      <FormKit
                        readonly="true"
                        type="date"
                        name="tarikh_masuk_islam"
                        label="Tarikh Masuk Islam"
                        value="2010-03-15"
                      />
                    </div>
                  </div>
  
                  <!-- Tarikh Masuk KFAM & Tarikh Had Taklif -->
                  <div class="mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="date"
                        name="tarikh_masuk_kfam"
                        label="Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)"
                        value="2010-03-20"
                      />
  
                      <FormKit
                        readonly="true"
                        type="date"
                        name="tarikh_had_taklif"
                        label="Tarikh Had Taklif"
                        value="2015-03-15"
                      />
                    </div>
                  </div>
  
                  <!-- Nama Selepas/Sebelum Islam & Nama Lain -->
                  <div class="mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="text"
                        name="nama_selepas_islam"
                        label="Nama Selepas Islam"
                        :value="formData.nama"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="nama_sebelum_islam"
                        label="Nama Sebelum Islam"
                        value="John Smith"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="nama_lain"
                        label="Nama Lain"
                        value="-"
                      />
                    </div>
                  </div>
  
                  <!-- Tarikh Keluar Muallaf & Dokumen Pengislaman -->
                  <div class="mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="date"
                        name="tarikh_keluar_muallaf"
                        label="Tarikh Keluar Muallaf"
                        value=""
                      />
  
                      <FormKit
                        readonly="true"
                        type="file"
                        name="dokumen_pengislaman"
                        label="Dokumen Pengislaman"
                        help="Salinan dokumen rasmi pengislaman. Format: PDF, JPG, PNG. Saiz maksimum: 5MB"
                        accept=".pdf,.jpg,.jpeg,.png"
                        value="dokumen_pengislaman.pdf"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Step 4: Perbankan -->
                <div v-if="modalCurrentStepA === 4">
                  <h3 class="text-lg font-semibold mb-4">D. Maklumat Perbankan</h3>
                  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Maklumat Akaun Bank</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="select"
                        name="nama_bank"
                        label="Nama Bank"
                        :options="[
                          'Bank Islam Malaysia Berhad',
                          'Maybank Islamic Berhad',
                          'CIMB Islamic Bank Berhad',
                          'RHB Islamic Bank Berhad',
                          'Public Islamic Bank Berhad',
                          'Lain-lain'
                        ]"
                        value="Bank Islam Malaysia Berhad"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="no_akaun_bank"
                        label="No. Akaun Bank"
                        value="1234567890"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="nama_pemegang_akaun"
                        label="Nama Pemegang Akaun"
                        :value="formData.nama"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="kaedah_pembayaran"
                        label="Kaedah Pembayaran"
                        :options="['EFT', 'Tunai', 'Cek']"
                        value="EFT"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="swift_code"
                        label="SWIFT Code"
                        value="BIMBMYKL"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Step 5: Kesihatan -->
                <div v-if="modalCurrentStepA === 5">
                  <h3 class="text-lg font-semibold mb-4">E. Maklumat Kesihatan</h3>
                  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Tahap Kesihatan</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="select"
                        name="tahap_kesihatan"
                        label="Tahap Kesihatan"
                        :options="['Sihat', 'Sakit', 'Uzur', 'OKU']"
                        value="Sihat"
                      />
  
                      <FormKit
                        readonly="true"
                        type="textarea"
                        name="keadaan_kesihatan_sakit"
                        label="Keadaan Kesihatan"
                        value="Tiada masalah kesihatan"
                      />
                    </div>
                  </div>
  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Kesempurnaan Fizikal</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="select"
                        name="kesempurnaan_fizikal"
                        label="Kesempurnaan Fizikal"
                        :options="['Sempurna', 'Tidak Sempurna']"
                        value="Sempurna"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="keadaan_kesihatan_uzur"
                        label="Keadaan Uzur"
                        :options="['Tidak Uzur', 'Uzur']"
                        value="Tidak Uzur"
                      />
  
                      <FormKit
                        readonly="true"
                        type="file"
                        name="dokumen_sokongan_kesihatan"
                        label="Upload Dokumen Sokongan Berkaitan Kesihatan"
                        help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                        accept=".pdf,.jpg,.jpeg,.png"
                        value="dokumen_kesihatan.pdf"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Step 6: Kemahiran -->
                <div v-if="modalCurrentStepA === 6">
                  <h3 class="text-lg font-semibold mb-4">F. Maklumat Kemahiran</h3>
                  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Kemahiran</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="checkbox"
                        name="kemahiran"
                        label="Kemahiran"
                        :options="['Membaca', 'Menulis', 'Mengira', 'Komputer', 'Bahasa', 'Lain-lain']"
                        value="['Membaca', 'Menulis', 'Mengira']"
                      />
  
                      <FormKit
                        readonly="true"
                        type="textarea"
                        name="lain_lain_kemahiran"
                        label="Lain-lain Kemahiran"
                        value="Kemahiran komputer asas"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Step 7: Alamat -->
                <div v-if="modalCurrentStepA === 7">
                  <h3 class="text-lg font-semibold mb-4">G. Maklumat Alamat</h3>
                  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Alamat Kediaman</h4>
                    <div class="grid grid-cols-1 gap-4">
                      <FormKit
                        readonly="true"
                        type="textarea"
                        name="alamat1"
                        label="Alamat"
                        :value="formData.alamat"
                      />
  
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormKit
                          readonly="true"
                          type="select"
                          name="negeri"
                          label="Negeri"
                          :options="['Selangor', 'Kuala Lumpur', 'Putrajaya', 'Lain-lain']"
                          value="Selangor"
                        />
  
                        <FormKit
                          readonly="true"
                          type="text"
                          name="daerah"
                          label="Daerah"
                          :value="formData.daerah"
                        />
  
                        <FormKit
                          readonly="true"
                          type="text"
                          name="bandar"
                          label="Bandar"
                          value="Kuala Selangor"
                        />
  
                        <FormKit
                          readonly="true"
                          type="text"
                          name="poskod"
                          label="Poskod"
                          value="45800"
                        />
                      </div>
                    </div>
                  </div>
  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Maklumat Tempat Tinggal</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="select"
                        name="status_kediaman"
                        label="Status Kediaman"
                        :options="['Rumah Sendiri', 'Rumah Sewa', 'Rumah Keluarga', 'Lain-lain']"
                        value="Rumah Sewa"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="keadaan_kediaman"
                        label="Keadaan Kediaman"
                        :options="['Baik', 'Sederhana', 'Buruk']"
                        value="Baik"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="kadar_sewa_bulanan"
                        label="Kadar Sewa Bulanan"
                        value="RM 500"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="tempoh_menetap"
                        label="Tempoh Menetap"
                        value="5 tahun"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Step 8: Pinjaman Harta -->
                <div v-if="modalCurrentStepA === 8">
                  <h3 class="text-lg font-semibold mb-4">H. Maklumat Pinjaman Harta</h3>
                  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Maklumat Pinjaman</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="text"
                        name="nama_institusi_pemberi_pinjaman"
                        label="Nama Institusi Pemberi Pinjaman"
                        value="Bank Islam Malaysia Berhad"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="jenis_pinjaman"
                        label="Jenis Pinjaman"
                        :options="['Pinjaman Perumahan', 'Pinjaman Kenderaan', 'Pinjaman Peribadi', 'Lain-lain']"
                        value="Pinjaman Perumahan"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="amaun_bayaran_bulanan"
                        label="Amaun Bayaran Bulanan"
                        value="RM 800"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="jumlah_keseluruhan_perbelanjaan"
                        label="Jumlah Keseluruhan Perbelanjaan"
                        value="RM 150,000"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="tahun_mula_pinjaman"
                        label="Tahun Mula Pinjaman"
                        value="2020"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="tahun_akhir_pinjaman"
                        label="Tahun Akhir Pinjaman"
                        value="2030"
                      />
  
                      <FormKit
                        readonly="true"
                        type="file"
                        name="dokumen_perjanjian_pinjaman"
                        label="Dokumen Perjanjian Pinjaman"
                        help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                        accept=".pdf,.jpg,.jpeg,.png"
                        value="dokumen_pinjaman.pdf"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Step 9: Pemilikan -->
                <div v-if="modalCurrentStepA === 9">
                  <h3 class="text-lg font-semibold mb-4">I. Maklumat Pemilikan</h3>
                  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Harta & Aset</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="text"
                        name="wang_simpanan"
                        label="Wang Simpanan"
                        value="RM 1,000"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="emas"
                        label="Emas"
                        value="Tiada"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="saham"
                        label="Saham"
                        value="Tiada"
                      />
  
                      <FormKit
                        readonly="true"
                        type="checkbox"
                        name="jenis_kenderaan"
                        label="Jenis Kenderaan"
                        :options="['Motor', 'Kereta', 'Basikal', 'Tiada']"
                        value="['Motor']"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="rumah_kedai"
                        label="Rumah/Kedai"
                        value="Tiada"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="tanah_sawah"
                        label="Tanah/Sawah"
                        value="Tiada"
                      />
  
                      <FormKit
                        readonly="true"
                        type="file"
                        name="dokumen_pemilikan"
                        label="Dokumen Pemilikan"
                        help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                        accept=".pdf,.jpg,.jpeg,.png"
                        value="dokumen_pemilikan.pdf"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Step 10: Pekerjaan -->
                <div v-if="modalCurrentStepA === 10">
                  <h3 class="text-lg font-semibold mb-4">J. Maklumat Pekerjaan</h3>
                  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Status Pekerjaan</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="select"
                        name="status_pekerjaan"
                        label="Status Pekerjaan"
                        :options="['Bekerja', 'Tidak Bekerja', 'Pesara', 'Pelajar']"
                        value="Bekerja"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="jenis_pekerjaan"
                        label="Jenis Pekerjaan"
                        :options="['Pekerja Swasta', 'Pekerja Kerajaan', 'Pekerja Sendiri', 'Lain-lain']"
                        value="Pekerja Swasta"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="sektor_pekerjaan"
                        label="Sektor Pekerjaan"
                        :options="['Perkhidmatan', 'Pembuatan', 'Pertanian', 'Lain-lain']"
                        value="Perkhidmatan"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="jawatan"
                        label="Jawatan"
                        value="Pembantu Am"
                      />
                    </div>
                  </div>
  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Maklumat Majikan</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="text"
                        name="nama_majikan"
                        label="Nama Majikan"
                        value="Syarikat ABC Sdn Bhd"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="no_telefon_majikan"
                        label="No. Telefon Majikan"
                        value="03-12345678"
                      />
  
                      <FormKit
                        readonly="true"
                        type="textarea"
                        name="alamat_majikan"
                        label="Alamat Majikan"
                        value="Jalan Industri 1, Taman Perindustrian"
                      />
  
                      <FormKit
                        readonly="true"
                        type="select"
                        name="status_jawatan"
                        label="Status Jawatan"
                        :options="['Tetap', 'Kontrak', 'Sementara']"
                        value="Tetap"
                      />
  
                      <FormKit
                        readonly="true"
                        type="file"
                        name="dokumen_pengesahan_pendapatan"
                        label="Dokumen Pengesahan Pendapatan"
                        help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                        accept=".pdf,.jpg,.jpeg,.png"
                        value="slip_gaji.pdf"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Step 11: Pendapatan & Perbelanjaan -->
                <div v-if="modalCurrentStepA === 11">
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Pendapatan</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="text"
                        name="gaji_elaun_pendapatan"
                        label="Gaji/Elaun/Pendapatan"
                        value="RM 1,500"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="pendapatan_isteri_suami_ibubapa_penjaga"
                        label="Pendapatan Isteri/Suami/Ibu Bapa/Penjaga"
                        value="RM 0"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="pencen_perkeso"
                        label="Pencen/PERKESO"
                        value="RM 0"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="sumbangan_anak_anak"
                        label="Sumbangan Anak-anak"
                        value="RM 0"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="bantuan_jkm"
                        label="Bantuan JKM"
                        value="RM 0"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="pendapatan_lain_lain"
                        label="Pendapatan Lain-lain"
                        value="RM 0"
                      />
                    </div>
                  </div>
  
                  <div class="mb-6">
                    <h4 class="text-md font-medium mb-3">Perbelanjaan</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        readonly="true"
                        type="text"
                        name="perbelanjaan_makanan_minuman"
                        label="Perbelanjaan Makanan/Minuman"
                        value="RM 600"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="sewa_bayaran_pinjaman_perumahan"
                        label="Sewa/Bayaran Pinjaman Perumahan"
                        value="RM 500"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="perbelanjaan_persekolahan_anak"
                        label="Perbelanjaan Persekolahan Anak"
                        value="RM 200"
                      />
  
                      <FormKit
                        readonly="true"
                        type="text"
                        name="bil_utiliti"
                        label="Bil Utiliti"
                        value="RM 150"
                      />
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Navigation Buttons -->
              <div class="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <rs-button 
                  variant="secondary" 
                  @click="modalPrevStepA"
                  :disabled="modalCurrentStepA === 1"
                >
                  Sebelumnya
                </rs-button>
                <rs-button 
                  variant="primary" 
                  @click="modalNextStepA"
                  :disabled="modalCurrentStepA === modalTotalStepsA"
                >
                  Seterusnya
                </rs-button>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-3">
            <rs-button variant="secondary" @click="showMaklumatModal = false">
              Tutup
            </rs-button>
          </div>
        </template>
      </rs-modal>
    </div> <!-- Close main template div -->
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch, nextTick } from "vue";
  import { useRouter, useRoute } from "vue-router";
  
  // Section A (PRF) stepper state
  const currentStepA = ref(1);
  const totalStepsA = 11;
    // Accordion state management - only one can be open except Bantuan Baru and A. Maklumat Peribadi Asnaf
    const isPeribadiAsnafOpen = ref(true); // Always open
  const isPendidikanOpen = ref(false);
  const isPengislamanOpen = ref(false);
  const isPerbankanOpen = ref(false);
  const isKesihatanOpen = ref(false);
  const isKemahiranOpen = ref(false);
  const isAlamatOpen = ref(false);
  const isPinjamanHartaOpen = ref(false);
  const isPemilikanOpen = ref(false);
  const isPekerjaanOpen = ref(false);
  const isPendapatanOpen = ref(false);
  const isSyorStatusOpen = ref(false);
  const isPengesahanStatusOpen = ref(false);
  const isHadKifayahOpen = ref(false);
  const isBantuanAgensiOpen = ref(false);
  const isBantuanSediaAdaOpen = ref(false);
  //const isSyorOpen = ref(false);
  //const isPerubahanBantuanOpen = ref(false);
  const isBantuanBaruOpen = ref(true); // Always open
  
  // Prevent infinite loops with a flag
  let isUpdatingAccordions = false;

  // Function to close all accordions except the specified one
  const closeOtherAccordions = (exceptAccordion) => {
    if (isUpdatingAccordions) return;
    isUpdatingAccordions = true;

    if (exceptAccordion !== 'pendidikan') isPendidikanOpen.value = false;
    if (exceptAccordion !== 'pengislaman') isPengislamanOpen.value = false;
    if (exceptAccordion !== 'perbankan') isPerbankanOpen.value = false;
    if (exceptAccordion !== 'kesihatan') isKesihatanOpen.value = false;
    if (exceptAccordion !== 'kemahiran') isKemahiranOpen.value = false;
    if (exceptAccordion !== 'alamat') isAlamatOpen.value = false;
    if (exceptAccordion !== 'pinjamanHarta') isPinjamanHartaOpen.value = false;
    if (exceptAccordion !== 'pemilikan') isPemilikanOpen.value = false;
    if (exceptAccordion !== 'pekerjaan') isPekerjaanOpen.value = false;
    if (exceptAccordion !== 'pendapatan') isPendapatanOpen.value = false;
    if (exceptAccordion !== 'syorStatus') isSyorStatusOpen.value = false;
    if (exceptAccordion !== 'pengesahanStatus') isPengesahanStatusOpen.value = false;
    if (exceptAccordion !== 'hadKifayah') isHadKifayahOpen.value = false;
    if (exceptAccordion !== 'bantuanAgensi') isBantuanAgensiOpen.value = false;
    if (exceptAccordion !== 'bantuanSediaAda') isBantuanSediaAdaOpen.value = false;
    if (exceptAccordion !== 'syor') isSyorOpen.value = false;
    if (exceptAccordion !== 'perubahanBantuan') isPerubahanBantuanOpen.value = false;

    nextTick(() => {
      isUpdatingAccordions = false;
    });
  };

  // Watchers removed - accordions will stay open until manually closed

  // Watch for when currentStepA changes to 1 and force open accordion
  watch(currentStepA, (newStep) => {
    if (newStep === 1) {
      nextTick(() => {
        isPeribadiAsnafOpen.value = true;
        setTimeout(() => {
          openPeribadiAsnafAccordion();
        }, 100);
      });
    }
  });
  
  // Open "A. Maklumat Peribadi Asnaf" accordion by default
  const peribadiCollapse = ref(null);
  const openPeribadiAsnafAccordion = () => {
    try {
      // Try multiple approaches to find and open the accordion
      const root = peribadiCollapse?.value?.$el || peribadiCollapse?.value || null;
      if (!root) return;
      
      // Method 1: Look for rs-collapse-item structure
      const collapseItems = root.querySelectorAll('[data-rs-collapse-item]');
      if (collapseItems.length > 0) {
        const firstItem = collapseItems[0];
        const button = firstItem.querySelector('button, .rs-collapse-item-header, [role="button"]');
        if (button && !firstItem.classList.contains('rs-collapse-item--open')) {
          button.click();
          return;
        }
      }
      
      // Method 2: Look for any clickable header elements
      const headers = root.querySelectorAll('button, [role="button"], .collapse-header, .accordion-header');
      if (headers.length > 0) {
        const firstHeader = headers[0];
        firstHeader.click();
        return;
      }
      
      // Method 3: Force open by setting the open state directly
      isPeribadiAsnafOpen.value = true;
      
    } catch (e) {
      console.log('Accordion opening error:', e);
      // Fallback: just set the reactive property
      isPeribadiAsnafOpen.value = true;
    }
  };
  const stepsA = [
    { id: 1, label: "Peribadi" },
    { id: 2, label: "Pendidikan" },
    { id: 3, label: "Pengislaman" },
    { id: 4, label: "Perbankan" },
    { id: 5, label: "Kesihatan" },
    { id: 6, label: "Kemahiran" },
    { id: 7, label: "Alamat" },
    { id: 8, label: "Pinjaman Harta" },
    { id: 9, label: "Pemilikan" },
    { id: 10, label: "Pekerjaan" },
    { id: 11, label: "Pendapatan & Perbelanjaan" },
  ];
  const goToStepA = (stepNumber) => {
    currentStepA.value = stepNumber;
  };
  const nextStepA = () => {
    if (currentStepA.value < totalStepsA) {
      currentStepA.value++;
    }
  };
  const prevStepA = () => {
    if (currentStepA.value > 1) {
      currentStepA.value--;
    }
  };
  
  // Minimal PRF form model for prototype rendering
  const formDataPRF = ref({
    jenis_id: "mykad",
    no_pengenalan: "",
    dokumen_id: null,
    nama: "",
    warganegara: "Malaysia",
    taraf_penduduk: "N",
    nopassportlama: "",
    passportStartDate: "",
    passportEndDate: "",
    tarikh_lahir: "",
    umur: "",
    tempat_lahir: "",
    jantina: "",
    agama: "Islam",
    agama_lain: "",
    bangsa: "Melayu",
    bangsa_lain: "",
    no_telefon_bimbit: "",
    emel: "",
    status_perkahwinan: "",
    status_poligami: "tidak",
    bilangan_isteri: 2,
    isteri_list: [
      { no_kp: "", nama: "" },
      { no_kp: "", nama: "" },
    ],
    // Step 2
    masih_bersekolah: "T",
    pendidikan_tertinggi: "",
    lain_pendidikan_tertinggi: "",
    tahap_pendidikan: [],
    lain_tahap_pendidikan: "",
    sijil_pendidikan: [],
    education_entries: [],
    tinggal_bersama_keluarga: "Y",
    asrama_rumah_sewa: "",
    nama_baitul: "",
    // Step 3
    adakah_muallaf: "T",
    tarikh_masuk_islam: "",
    tarikh_masuk_kfam: "",
    nama_lain: "",
    dokumen_pengislaman: null,
    // Step 4
    kaedah_pembayaran: "ya",
    muflis_disenarai_hitam: "T",
    bank_accounts: [],
    sebab_tiada_akaun: "",
    lain_lain_sebab_tiada_akaun: "",
    // Step 5
    tahap_kesihatan: "Sihat",
    keadaan_kesihatan_sakit: "",
    kos_penjagaan_sakit: "",
    perbelanjaan_bulanan_sakit: "",
    kesempurnaan_fizikal: "",
    sebab_kecacatan: "",
    tahap_kecacatan: "",
    perbelanjaan_bulanan_oku: "",
    keadaan_kesihatan_uzur: "",
    kos_penjagaan_uzur: "",
    perbelanjaan_bulanan_uzur: "",
    dokumen_sokongan_kesihatan: [],
    // Step 6
    kemahiran: [],
    lain_lain_kemahiran: "",
    // Step 7
    addressInfo: {
      alamat1: "",
      alamat2: "",
      alamat3: "",
      negeri: "Selangor",
      daerah: "",
      bandar: "",
      poskod: "",
      kariah: "",
      geolokasi: "",
      tempoh_menetap_selangor_nilai: 0,
      tempoh_menetap_selangor_unit: "bulan",
      kategori_menetap: "",
      kelulusan_khas: "T",
      status_kediaman: "",
      lain_lain_status_kediaman: "",
      keadaan_kediaman: "",
      kadar_bayaran_bulanan: "",
      kadar_sewa_bulanan: "",
      dokumen_perjanjian_sewa: null,
      kursus_terpilih: "",
    },
    // Step 8
    nama_institusi_pemberi_pinjaman: "",
    jenis_pinjaman: "",
    amaun_bayaran_bulanan: "",
    jumlah_keseluruhan_perbelanjaan: "",
    tahun_mula_pinjaman: "",
    tahun_akhir_pinjaman: "",
    dokumen_perjanjian_pinjaman: null,
    // Step 9
    wang_simpanan: "",
    emas: "",
    saham: "",
    jenis_kenderaan: [],
    kenderaan_total: "",
    rumah_kedai: "",
    tanah_sawah: "",
    dokumen_pemilikan: null,
    // Step 10
    status_pekerjaan: "tidak_bekerja",
    sumber_pendapatan: [],
    lain_lain_sumber_pendapatan: "",
    jenis_pekerjaan: "",
    sektor_pekerjaan: "",
    lain_lain_sektor: "",
    jawatan: "",
    status_jawatan: "",
    pendapatan_kasar: "",
    // Step 11
    gaji_elaun_pendapatan: "",
    pendapatan_isteri_suami_ibubapa_penjaga: "",
    pencen_perkeso: "",
    sumbangan_anak_anak: "",
    bantuan_jkm: "",
    takaful: "",
    sewa_rumah_tanah_kedai: "",
    pendapatan_tanggungan_serumah: "",
    pendapatan_lain_lain: "",
    perbelanjaan_makanan_minuman: "",
    sewa_bayaran_pinjaman_perumahan: "",
    perbelanjaan_persekolahan_anak: "",
    pengangkutan_tambang_bas_sekolah: "",
    bil_utiliti: "",
  });
  
  const isteriList = computed(() => Array.from({ length: Number(formDataPRF.value.bilangan_isteri) || 0 }));
  
  // Keep isteri_list length in sync with bilangan_isteri
  watch(
    () => formDataPRF.value.bilangan_isteri,
    (newVal) => {
      const target = Number(newVal) || 0;
      const cur = formDataPRF.value.isteri_list.length;
      if (cur < target) {
        for (let i = cur; i < target; i++) {
          formDataPRF.value.isteri_list.push({ no_kp: "", nama: "" });
        }
      } else if (cur > target) {
        formDataPRF.value.isteri_list.splice(target);
      }
    }
  );
  
  // Helpers for Steps 2–11
  const islamicDatesValidation = computed(() => {
    // Minimal always-valid placeholder for prototype
    return { isValid: true, message: "" };
  });
  
  // Step 2: Education helpers
  const addEducationEntry = () => {
    if (!formDataPRF.value.education_entries) formDataPRF.value.education_entries = [];
    formDataPRF.value.education_entries.push({
      jenis_sekolah: "",
      kategori_sekolah: "",
      tarikh_mula_pengajian: "",
      tarikh_tamat_pengajian: "",
      tahun_bersekolah: "",
      tahun_tingkatan: "",
      nama_sekolah: "",
      daerah_sekolah: "",
      bandar_sekolah: "",
      poskod_sekolah: "",
      alamat_sekolah_1: "",
      alamat_sekolah_2: "",
      alamat_sekolah_3: "",
      sekolah_rendah_kategori: [],
      bidang_kursus: "",
      jurusan_bidang: "",
      pembiayaan_pengajian: [],
      lain_pembiayaan: "",
      catatan: "",
    });
  };
  const removeEducationEntry = (index) => {
    if (formDataPRF.value.education_entries && index > -1) {
      formDataPRF.value.education_entries.splice(index, 1);
    }
  };
  const getFilteredSchoolOptions = (kategori) => {
    const options = {
      "SEK.MEN": ["SMK Bukit Jelutong", "SMK Seri Kembangan"],
      SRK: ["SK Bukit Jelutong", "SK Bandar Sunway"],
      IPT: ["UiTM Shah Alam", "UKM", "UM"],
      SRA: ["SRA Bukit Jelutong", "SRA Seksyen 7"],
      KAFA: ["KAFA Al-Hidayah", "KAFA Al-Falah"],
    };
    return (options[kategori] || []).map((o) => ({ label: o, value: o }));
  };
  const onSelectSchool = (index, value) => {
    // placeholder to keep data binding consistent
  };
  
  // Step 4: Banking helpers
  const paymentMethodOptionsMain = [
    { label: "Ya", value: "ya" },
    { label: "Tidak", value: "tidak" },
  ];
  const noPaymentReasonOptions = [
    { label: "Tiada dokumen", value: "tiada_dokumen" },
    { label: "Akaun dibekukan", value: "akaun_bekukan" },
    { label: "Lain-lain", value: "lain_lain" },
  ];
  const bankOptions = [
    { label: "Maybank", value: "MAYBANK" },
    { label: "CIMB", value: "CIMB" },
    { label: "Bank Islam", value: "BIMB" },
  ];
  const getSwiftCodeForBank = (bank) => {
    const map = { MAYBANK: "MBBEMYKAXXX", CIMB: "CIBBMYKLXXX", BIMB: "BIMBMYKLXXX" };
    return map[bank] || "";
  };
  const addBankAccount = () => {
    if (!formDataPRF.value.bank_accounts) formDataPRF.value.bank_accounts = [];
    formDataPRF.value.bank_accounts.push({
      nama_bank: "",
      no_akaun_bank: "",
      nama_pemegang_akaun: "",
      jenis_akaun: "individu",
      id_pengenalan: "",
      nama_bersama: "",
      hubungan: "",
    });
  };
  const removeBankAccount = (index) => {
    if (formDataPRF.value.bank_accounts && index > -1) {
      formDataPRF.value.bank_accounts.splice(index, 1);
    }
  };
  const showLainLainSebabTiadaAkaun = computed(() => formDataPRF.value.sebab_tiada_akaun === "lain_lain");
  const showLainLainSektor = computed(() => formDataPRF.value.sektor_pekerjaan === "Lain-lain");
  
  // Step 7: Address helpers
  const negeriOptions = ["Selangor", "Wilayah Persekutuan", "Perak"].map((n) => ({ label: n, value: n }));
  const daerahOptions = ["Kuala Selangor", "Petaling", "Gombak"].map((n) => ({ label: n, value: n }));
  const bandarOptions = ["Shah Alam", "Subang Jaya", "Rawang"].map((n) => ({ label: n, value: n }));
  const poskodOptions = ["40100", "40000", "47810"].map((n) => ({ label: n, value: n }));
  const kariahOptions = ["Masjid Al-Taqwa", "Masjid Negeri", "Masjid Al-Ikhlas"].map((n) => ({ label: n, value: n }));
  const kategoriTanggunganOptions = [
    { label: "Tanggungan Utama", value: "Tanggungan Utama" },
    { label: "Tanggungan Sekunder", value: "Tanggungan Sekunder" },
    { label: "Lain-lain", value: "Lain-lain" },
  ];
  const statusMultidimensiOptions = [
    { label: "Tidak Produktif", value: "Tidak Produktif" },
    { label: "Produktif C", value: "Produktif C" },
    { label: "Produktif B", value: "Produktif B" },
    { label: "Produktif A", value: "Produktif A" },
  ];
  const quadrantMultidimensiOptions = [
    { label: "Asnaf Produktif Sementara", value: "Asnaf Produktif Sementara" },
    { label: "Asnaf Produktif", value: "Asnaf Produktif" },
    { label: "Bukan Asnaf", value: "Bukan Asnaf" },
  ];
  const kategoriKeluargaOptions = [
    { label: "Fakir", value: "Fakir" },
    { label: "Miskin", value: "Miskin" },
    { label: "Mampu", value: "Mampu" },
  ];
  const kategoriAsnafOptions = [
    { label: "Fakir", value: "Fakir" },
    { label: "Miskin", value: "Miskin" },
    { label: "Amil", value: "Amil" },
  ];
  const kategoriIndividuOptions = [
    { label: "Miskin", value: "Miskin" },
    { label: "Fakir", value: "Fakir" },
  ];
  const tableHeaders = [
    { key: 'pengenalanId', label: 'Pengenalan Id' },
    { key: 'nama', label: 'Nama' },
    { key: 'kategori', label: 'Kategori Asnaf(Syor)' },
    { key: 'meritIndividu', label: 'Merit Individu(Syor)' },
    { key: 'statusMultidimensi', label: 'Status Multidimensi(Syor)' },
  ];
  const tableData = [
    {
      pengenalanId: '060802030272',
      nama: 'NUR NAJWA BINTI ADNAN',
      kategori: 'Miskin',
      meritIndividu: '0.38',
      statusMultidimensi: 'Tidak Produktif',
    },
    {
      pengenalanId: '091108030442',
      nama: 'NUR QISTINA BINTI ADNAN',
      kategori: 'Miskin',
      meritIndividu: '0.40',
      statusMultidimensi: 'Tidak Produktif',
    },
    {
      pengenalanId: '770319035991',
      nama: 'Adnan bin Abu',
      kategori: 'Miskin',
      meritIndividu: '0.69',
      statusMultidimensi: 'Produktif C',
    },
    {
      pengenalanId: '801004035672',
      nama: 'ROHANA BINTI AHMAD',
      kategori: 'Miskin',
      meritIndividu: '0.64',
      statusMultidimensi: 'Produktif C',
    },
  ];

  // Pengesahan Status table schema & data
  const pengesahanColumns = [
    { key: 'pengenalanId', label: 'Pengenalan ID' },
    { key: 'nama', label: 'Nama' },
    { key: 'kategori', label: 'Kategori' },
    { key: 'meritIndividu', label: 'Merit Individu' },
    { key: 'statusMultidimensi', label: 'Status Multidimensi' },
    { key: 'pelarasan', label: 'Pelarasan' },
  ];
  const pengesahanRows = [
    { pengenalanId: '060802030272', nama: 'NUR NAJWA BINTI ADNAN', kategori: 'Miskin', meritIndividu: '0.38', statusMultidimensi: 'Tidak Produktif', pelarasan: false },
    { pengenalanId: '091108030442', nama: 'NUR QISTINA BINTI ADNAN', kategori: 'Miskin', meritIndividu: '0.40', statusMultidimensi: 'Tidak Produktif', pelarasan: false },
    { pengenalanId: '770319035991', nama: 'Adnan bin Abu', kategori: 'Miskin', meritIndividu: '0.69', statusMultidimensi: 'Produktif C', pelarasan: false },
    { pengenalanId: '801004035672', nama: 'ROHANA BINTI AHMAD', kategori: 'Miskin', meritIndividu: '0.64', statusMultidimensi: 'Produktif C', pelarasan: false },
  ];
  const getLocation = () => {};
  
  const router = useRouter();
  const route = useRoute();

  // Check if this is the specific page where sections should be hidden
  const shouldHideSections = computed(() => {
    return route.params.id === 'NAS-2025-0005';
  });

  // Check if this page should show simplified title
  const shouldShowSimpleTitle = computed(() => {
    return route.params.id === 'NAS-2025-0005' || route.params.id === 'NAS-2025-0003' || route.params.id === 'NAS-2025-0004' || route.params.id === 'NAS-2025-0001' || route.params.id === 'NAS-2025-0002';
  });
  
  definePageMeta({
    title: "Maklumat Pemohon - Siasatan EOAD",
  });
  
  const breadcrumb = ref([
    {
      name: "Tugasan",
      type: "link",
      path: "/BF-BTN/tugasan",
    },
    // {
    //   name: "Siasatan",
    //   type: "link",
    //   path: "/BF-BTN/tugasan",
    // },
    {
      name: "Siasatan",
      type: "current",
      path: `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}`,
    },
  ]);
  
  // Mock data for different records
  const mockByNoBantuan = {
    "NAS-2025-0001": {
      // Personal Information
      noBantuan: "NAS-2025-0001",
      nama: "Mohd Rosli bin Saad",
      alamat: "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram",
      kariah: "Masjid Al-Taqwa",
      daerah: "Kuala Selangor",
      jenisPengenalan: "MyKad",
      noPengenalan: "810101121234",
      noTelefon: "0123456789",
      email: "rosli@gmail.com",
      statusKeluarga: "Fakir",
      statusIndividu: "Fakir",
      statusMultidimensi: "Asnaf Tidak Produktif",
      status: "Dalam Siasatan",
  
      // Investigation fields
      keputusanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      catatanPenilaianAwal: "Pemohon telah menceritakan masalah mengenai keadaan rumahnya yang semakin uzur akibat dimakan anai-anai dan keadaan bumbung yang bocor. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan ini",
      gambarLokasi: null,
    },
    "NAS-2025-0002": {
      // Personal Information
      noBantuan: "NAS-2025-0002",
      nama: "Siti binti Hassan",
      alamat: "Jalan Merdeka, Taman Seri Indah, 45600 Selangor",
      kariah: "Masjid Al-Ikhlas",
      daerah: "Selangor",
      jenisPengenalan: "MyKad",
      noPengenalan: "850505055678",
      noTelefon: "0198765432",
      email: "siti.hassan@gmail.com",
      statusKeluarga: "Miskin",
      statusIndividu: "Miskin",
      statusMultidimensi: "Asnaf Produktif",
      status: "Dalam Siasatan",
  
      // Investigation fields
      keputusanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      catatanPenilaianAwal: "Pemohon memerlukan bantuan untuk kos perubatan anak yang menghidap penyakit kronik. Keadaan kewangan keluarga sangat teruk dan memerlukan bantuan segera.",
      gambarLokasi: null,
    },
    "NAS-2025-0003": {
      // Personal Information
      noBantuan: "NAS-2025-0001",
      nama: "Mohd Amin bin Ali",
      alamat: "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram",
      kariah: "Masjid Al-Taqwa",
      daerah: "Kuala Selangor",
      jenisPengenalan: "MyKad",
      noPengenalan: "650101121234",
      noTelefon: "0193456789",
      email: "amin@gmail.com",
      statusKeluarga: "Fakir",
      statusIndividu: "Fakir",
      statusMultidimensi: "Asnaf Tidak Produktif",
      status: "Dalam Siasatan",
  
      // Investigation fields
      keputusanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      catatanPenilaianAwal: "Pemohon telah menceritakan masalah mengenai pembayaran rumah sewa bulanan yang tidak mampu dibayarnya. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan ini",
      gambarLokasi: null,
    },
    
    "NAS-2025-0004": {
      // Personal Information
      noBantuan: "NAS-2025-0004",
      nama: "Amirul Hakim bin Zainuddin",
      alamat: "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram",
      kariah: "Masjid Al-Taqwa",
      daerah: "Kuala Selangor",
      jenisPengenalan: "MyKad",
      noPengenalan: "791230104321",
      noTelefon: "0193456789",
      email: "hakim@gmail.com",
      statusKeluarga: "Fakir",
      statusIndividu: "Fakir",
      statusMultidimensi: "Asnaf Tidak Produktif",
      status: "Dalam Siasatan",
  
      // Investigation fields
      keputusanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      catatanPenilaianAwal: "Pemohon telah menceritakan masalah mengenai keadaan kesihatannya yang mengalami sakit buah pinggang dan memerlukan rawatan dialisis. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan ini",
      gambarLokasi: null,
    },
    
    "NAS-2025-0005": {
      // Personal Information
      noBantuan: "NAS-2025-0005",
      nama: "Faridah binti Rahman",
      alamat: "Jalan Seri Melati, Kampung Baru, 45800 Kuala Selangor",
      kariah: "Masjid At-Taqwa",
      daerah: "Kuala Selangor",
      jenisPengenalan: "MyKad",
      noPengenalan: "881015127890",
      noTelefon: "0198765431",
      email: "faridah.rahman@gmail.com",
      statusKeluarga: "Miskin",
      statusIndividu: "Miskin",
      statusMultidimensi: "Asnaf Produktif",
      status: "Dalam Siasatan",
  
      // Investigation fields
      keputusanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      catatanPenilaianAwal: "Permohonan baru untuk siasatan lapangan. Pemohon memerlukan bantuan untuk keperluan asas keluarga.",
      gambarLokasi: null,
    },
    
  };
  
  // Mock investigation data
  const mockInvestigationData = {
    "NAS-2025-0001": {
      jenisPekerjaan: "Bekerja sebagai tukang sapu di sekolah",
      statusKediaman: "Rumah Sewa",
      jumlahBayaranRumah: "RM500",
      bilTanggungan: "2 Orang (Anak)",
      statusTanggungan: "Masih Bersekolah, Tidak Bekerja",
      keadaanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      StatusPengesahanLawatan: "belum_sah",
      catatanPenilaianAwal: "Pemohon telah menceritakan masalah mengenai keadaan rumahnya yang semakin uzur akibat dimakan anai-anai dan keadaan bumbung yang bocor. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan ini",
      gambarLokasi: [],
      catatanLawatanETD: "",
      statusLawatan: "",
      assistanceApplications: [
        {
          id: "B102",
          jenisBantuan: "B102 - BANTUAN BINAAN RUMAH (Fakir)",
          status: "Perlu Diproses",
          sla: "3 hari lagi",
          actions: "/",
        }
      ]
    },
    "NAS-2025-0002": {
      jenisPekerjaan: "Suri rumah sepenuh masa",
      statusKediaman: "Rumah Sendiri",
      jumlahBayaranRumah: "RM0",
      bilTanggungan: "3 Orang (2 Anak + Suami)",
      statusTanggungan: "Anak sakit kronik, Suami tidak bekerja",
      keadaanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      StatusPengesahanLawatan: "belum_sah",
      catatanPenilaianAwal: "Pemohon memerlukan bantuan untuk kos perubatan anak yang menghidap penyakit kronik. Keadaan kewangan keluarga sangat teruk dan memerlukan bantuan segera.",
      gambarLokasi: [],
      catatanLawatanETD: "",
      statusLawatan: "",
      assistanceApplications: [
        {
          id: "B300",
          jenisBantuan: "B300 - (HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA} (FAKIR)",
          status: "Perlu Diproses",
          sla: "5 hari lagi",
          actions: "/",
        },
        {
          id: "B307",
          jenisBantuan: "B307 - (HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS",
          status: "Perlu Diproses",
          sla: "2 hari lagi",
          actions: "/",
        }
      ]
    },
     "NAS-2025-0003": {
      jenisPekerjaan: "Pesara guru",
      statusKediaman: "Rumah Sendiri",
      jumlahBayaranRumah: "RM0",
      bilTanggungan: "3 Orang (2 Anak + Isteri )",
      statusTanggungan: "Anak sakit kronik , Isteri tidak bekerja",
      keadaanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      StatusPengesahanLawatan: "belum_sah",
      catatanPenilaianAwal: "Pemohon memerlukan bantuan untuk kos perubatan anak yang menghidap penyakit kronik. Keadaan kewangan keluarga sangat teruk dan memerlukan bantuan segera.",
      gambarLokasi: [],
      catatanLawatanETD: "",
      statusLawatan: "",
      assistanceApplications: [
        {
          id: "B112",
          jenisBantuan: "B112 - Bantuan Sewaan/Ansuran Rumah (Fakir)",
          status: "Perlu Diproses",
          sla: "5 hari lagi",
          actions: "/",
        },
        // {
        //   id: "B307",
        //   jenisBantuan: "B307 - (HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS",
        //   status: "Perlu Diproses",
        //   sla: "2 hari lagi",
        //   actions: "/",
        // }
      ]
    },
     "NAS-2025-0004": {
      jenisPekerjaan: "Pesara guru",
      statusKediaman: "Rumah Sendiri",
      jumlahBayaranRumah: "RM0",
      bilTanggungan: "3 Orang (2 Anak + Isteri )",
      statusTanggungan: "Anak sakit kronik , Isteri tidak bekerja",
      keadaanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      StatusPengesahanLawatan: "belum_sah",
      catatanPenilaianAwal: "Pemohon memerlukan bantuan untuk kos perubatan anak yang menghidap penyakit kronik. Keadaan kewangan keluarga sangat teruk dan memerlukan bantuan segera.",
      gambarLokasi: [],
      catatanLawatanETD: "",
      statusLawatan: "",
      assistanceApplications: [
        {
          id: "B103",
          jenisBantuan: "B103 - Bantuan Perubatan Dialisis (Fakir)",
          status: "Perlu Diproses",
          sla: "5 hari lagi",
          actions: "/",
        },
        // {
        //   id: "B307",
        //   jenisBantuan: "B307 - (HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS",
        //   status: "Perlu Diproses",
        //   sla: "2 hari lagi",
        //   actions: "/",
        // }
      ]
    },
    "NAS-2025-0005": {
      jenisPekerjaan: "Tidak Bekerja (Janda)",
      statusKediaman: "Rumah Sewa",
      jumlahBayaranRumah: "RM600",
      bilTanggungan: "2 Orang (Anak)",
      statusTanggungan: "Masih Bersekolah",
      keadaanSiasatan: "",
      tarikhLawatan: "",
      masaLawatan: "",
      StatusPengesahanLawatan: "belum_sah",
      catatanPenilaianAwal: "Permohonan bantuan untuk pembinaan/baik pulih institusi agama. Pemohon memerlukan bantuan untuk masjid tempatan yang memerlukan penyelenggaraan.",
      gambarLokasi: [],
      catatanLawatanETD: "",
      statusLawatan: "",
      assistanceApplications: [
        {
          id: "B400",
          jenisBantuan: "B400 - BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
          status: "Perlu Diproses",
          sla: "7 hari lagi",
          actions: "/",
        }
      ]
    }
  };
  
  // Form data
  const formData = ref({
    // Personal Information
    noBantuan: "",
    nama: "",
    alamat: "",
    kariah: "",
    daerah: "",
    jenisPengenalan: "",
    noPengenalan: "",
    noTelefon: "",
    email: "",
    statusKeluarga: "",
    statusIndividu: "",
    statusMultidimensi: "",
    status: "",
  
    // Investigation fields
    keputusanSiasatan: "",
    tarikhLawatan: "",
    masaLawatan: "",
    catatanPenilaianAwal: "",
    gambarLokasi: null,
  });
  
  // Investigation form data
  const investigationData = ref({
    jenisPekerjaan: "",
    statusKediaman: "",
    jumlahBayaranRumah: "",
    bilTanggungan: "",
    statusTanggungan: "",
    keadaanSiasatan: "",
    tarikhLawatan: "",
    masaLawatan: "",
    StatusPengesahanLawatan: "belum_sah",
    catatanPenilaianAwal: "",
    gambarLokasi: [],
    catatanLawatanETD: "",
    statusLawatan: "",
  });
  
  // Profiling form data
  const profilingData = ref({
    pengenalanId: "",
    nama: "",
    hadKifayahSyor: "",
    kategoriKeluargaAsnafSyor: "",
    kategoriAsnafSyor: "",
    tarikhPengesyoran: "",
    pengenalanIdTanggungan1: "",
    pengenalanIdTanggungan2: "",
    kategoriTanggunganSyor: "",
    assignSiasatan: "",
    hadKifayahSah: "",
    kategoriKeluargaAsnafSah: "",
    kategoriAsnafSah: "",
    pengenalanIdTanggunganSah1: "",
    pengenalanIdTanggunganSah2: "",
    kategoriTanggunganSah1: "",
    kategoriTanggunganSah2: "",
    komenPengesahan: "",
    tarikhPengesyoranBottom: "",
  });
  
  // State for image handling
  const uploadedImages = ref([]);
  const showPreviewModal = ref(false);
  const previewingImage = ref(null);
  const processing = ref(false);
  const actionType = ref("");
  const uploadProgress = ref([]);
  const fileInputRef = ref(null);
  
  // State for Maklumat Terperinci Pemohon modal
  const showMaklumatModal = ref(false);
  const isSyorOpen = ref(true);
  const isPerubahanBantuanOpen = ref(true);
  
  // Simple aggressive approach - keep accordions open
  watch(isSyorOpen, (newValue) => {
    // Allow user to close it manually, but prevent auto-closing from form interactions
    // We'll use a small delay to distinguish between manual and automatic changes
    if (!newValue) {
      setTimeout(() => {
        if (!isSyorOpen.value) {
          isSyorOpen.value = true;
        }
      }, 100);
    }
  });
  
  watch(isPerubahanBantuanOpen, (newValue) => {
    // Same protection for Perubahan Bantuan accordion
    if (!newValue) {
      setTimeout(() => {
        if (!isPerubahanBantuanOpen.value) {
          isPerubahanBantuanOpen.value = true;
        }
      }, 100);
    }
  });
  
  // Modal-specific state for tab navigation
  const modalCurrentStepA = ref(1);
  const modalTotalStepsA = 11;
  const modalStepsA = [
    { id: 1, label: "Peribadi" },
    { id: 2, label: "Pendidikan" },
    { id: 3, label: "Pengislaman" },
    { id: 4, label: "Perbankan" },
    { id: 5, label: "Kesihatan" },
    { id: 6, label: "Kemahiran" },
    { id: 7, label: "Alamat" },
    { id: 8, label: "Pinjaman Harta" },
    { id: 9, label: "Pemilikan" },
    { id: 10, label: "Pekerjaan" },
    { id: 11, label: "Pendapatan & Perbelanjaan" },
  ];
  
  // State for profiling form
  const searchingId = ref(false);
  const savingDraft = ref(false);
  const submittingProfile = ref(false);
  
  // Pagination state
  const currentPage = ref(1);
  const pageSize = ref(10);
  
  // Profiling tab datatable state
  const profilingColumns = [
    { key: "noRujukan", label: "No ID Pengenalan", sortable: true },
    { key: "namaPemohon", label: "Nama Pemohon", sortable: true },
    { key: "status", label: "Status Permohonan", sortable: true },
    { key: "tindakan", label: "Aksi", sortable: false },
  ];
  
  const profilingApplications = ref([
    {
      noRujukan: "770319035991",
      namaPemohon: "ADNAN BIN ABU",
      status: "Menunggu Pengesahan",
      tarikhTerima: "2024-03-20",
      namaPegawai: "Siti binti Ali",
    },
    {
      noRujukan: "091108030442",
      namaPemohon: "NUR QISTINA BINTI ADNAN",
      status: "Dalam Semakan",
      tarikhTerima: "2024-03-19",
      namaPegawai: "Aminah binti Hassan",
    },
  ]);
  
  const profilingFilteredApplications = computed(() => {
    const mapped = profilingApplications.value.map((app) => ({
      noRujukan: app.noRujukan,
      namaPemohon: app.namaPemohon,
      status: app.status,
      tindakan: { status: app.status },
    }));
  
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return mapped.slice(start, end);
  });
  
  const profilingTotalApplications = computed(() => profilingApplications.value.length);
  const profilingPaginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
  const profilingPaginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, profilingTotalApplications.value));
  
  const profilingHandleReview = (status) => {
    if (status === "Dalam Semakan") {
      navigateTo(`/BF-PRF/AS/FR/07_01`);
    } else if (status === "Menunggu Pengesahan") {
      navigateTo(`/BF-PRF/AS/FR/07_01_copy`);
    }
  };
  
  const getProfilingStatusVariant = (status) => {
    const variants = {
      baru: "info",
      "tidak lengkap": "danger",
      "untuk siasatan": "secondary",
      "menunggu siasatan": "warning",
      "selesai siasatan": "success",
      "menunggu pengesahan": "info",
      "dalam semakan": "secondary",
    };
    return variants[status.toLowerCase()] || "default";
  };								
  
  // Dropdown options
  const keadaanSiasatanOptions = [
    { label: "Semak Dokumen Sahaja", value: "semak" },
    { label: "Telefon", value: "telefon" },
    { label: "Lapangan", value: "lapangan" },
  ];
  
  const statusSiasatanOptions = [
    { label: "Selesai Siasatan", value: "selesai" },
    { label: "KIV", value: "kiv" },
  ];

  
  // Dropdown options
  const statuspengesahanlawatanOptions = [
    { label: "Belum Sah", value: "belum_sah" },
    { label: "Sah", value: "sah" },
  ];
  
  const statusLawatanOptions = [
    { label: "Lengkap", value: "lengkap" },
    { label: "Tidak lengkap", value: "tidak_lengkap" },
    { label: "Perlu lawatan semula", value: "perlu_lawatan_semula" },
  ];
  
  const assignSiasatanOptions = [
    { label: "PAK", value: "pak" },
    { label: "PAK+", value: "pak_plus" },
    { label: "Pegawai LZS", value: "pegawai_lzs" },
  ];
  
  // Computed property to show/hide lawatan fields based on kaedah siasatan
  const showLawatanFields = computed(() => {
    return investigationData.value.keadaanSiasatan === "lapangan";
  });
  
  // Table columns for assistance applications
  const assistanceColumns = [
    { key: "jenisBantuan", label: "JENIS BANTUAN", sortable: true },
    { key: "status", label: "STATUS", sortable: true },
    { key: "sla", label: "SLA", sortable: true },
    { key: "actions", label: "ACTIONS", sortable: false },
  ];
  
  // Table columns for existing assistance
  const existingAssistanceColumns = [
    { key: "jan", label: "JAN", sortable: true },
    { key: "kadar", label: "KADAR (RM)", sortable: true },
    { key: "frekuensi", label: "FREKUENSI", sortable: true },
    { key: "jumlah", label: "JUMLAH (RM)", sortable: true },
    { key: "status", label: "STATUS", sortable: true },
  ];
  
  // Table columns for other agency assistance
  const otherAssistanceColumns = [
    { key: "namaBantuan", label: "NAMA BANTUAN", sortable: true },
    { key: "jumlah", label: "JUMLAH (RM)", sortable: true },
    { key: "kekerapan", label: "KEKERAPAN", sortable: true },
    { key: "tahun", label: "TAHUN", sortable: true },
    { key: "tarikhDiperoleh", label: "TARIKH DATA DIPEROLEH", sortable: true },
    { key: "dataDaripada", label: "DATA DARIPADA", sortable: true },
  ];
  
  // Table columns for Syor (Recommended Aid)
  const recommendedAidColumns = [
    { key: "aid", label: "Aid", sortable: true },
    { key: "aidProduct", label: "Aid Product", sortable: true },
    { key: "productPackage", label: "Product Package", sortable: true },
    { key: "entitlementProduct", label: "Entitlement Product", sortable: true },
    { key: "kadarDicadangkan", label: "Kadar Dicadangkan", sortable: true },
    { key: "skorAI", label: "Skor AI", sortable: true },
    { key: "tarikhSyor", label: "Tarikh Syor", sortable: true },
    { key: "justifikasiSyor", label: "Justifikasi Syor", sortable: false },
    { key: "terimaCadangan", label: "Terima Cadangan", sortable: false },
  ];
  
  // Alias for template usage
  const otherAgencyColumns = otherAssistanceColumns;
  
  // Perubahan Bantuan - columns
  const perubahanColumns = [
    { key: "aid", label: "Aid", sortable: true },
    { key: "aidProduct", label: "Aid Product", sortable: true },
    { key: "productPackage", label: "Product Package", sortable: true },
    { key: "entitlementProduct", label: "Entitlement Product", sortable: true },
    { key: "terimaCadangan", label: "Terima Cadangan", sortable: false },
  ];
  
  const pembatalanColumns = [
    { key: "aid", label: "Aid", sortable: true },
    { key: "aidProduct", label: "Aid Product", sortable: true },
    { key: "productPackage", label: "Product Package", sortable: true },
    { key: "entitlementProduct", label: "Entitlement Product", sortable: true },
    { key: "batalBantuan", label: "Batal Bantuan", sortable: false },
  ];
  
  // Mock data for tables
  const assistanceApplications = ref([]);

  // Asnaf History Data
  const asnafHistoryData = ref([
    {
      tingkahLaku: "Sangat Sopan - Bersikap hormat, menjawab soalan dengan jelas dan membawa dokumen lengkap",
      masa: "10:30 AM",
      tarikh: "15/01/2024"
    },
    {
      tingkahLaku: "Baik - Kooperatif semasa temuduga, memberikan maklumat yang diperlukan dengan jujur",
      masa: "02:15 PM", 
      tarikh: "08/12/2023"
    },
    {
      tingkahLaku: "Agak Gelisah - Nampak nervous tetapi masih dapat menjawab soalan dengan baik",
      masa: "09:45 AM",
      tarikh: "22/10/2023"
    }
  ]);
  
  const existingAssistance = ref([
    {
      jan: "Jan Sewaan/Ansuran Rumah (Fakir)",
      kadar: "800",
      frekuensi: "12",
      jumlah: "9,600",
      status: "Lulus",
    },
    {
      jan: "Jan Pendidikan Dialisis (Fakir)",
      kadar: "2,800",
      frekuensi: "6",
      jumlah: "16,800",
      status: "Lulus",
    },
  ]);
  
  const otherAgencyAssistance = ref([
    {
      namaBantuan: "Program Kasih Siswa (dKasih)",
      jumlah: "1,300",
      kekerapan: "One-off",
      tahun: "2025",
      tarikhDiperoleh: "8/21/2025",
      dataDaripada: "ICU",
    },
    {
      namaBantuan: "Sumbangan Asas Rahmah (SARA)",
      jumlah: "2,100",
      kekerapan: "Berkala",
      tahun: "2025",
      tarikhDiperoleh: "8/21/2025",
      dataDaripada: "ICU",
    },
  ]);
  
  // Track last fetch date for "Bantuan daripada Agensi"
  const lastOtherAgencyFetchAt = ref(new Date());
  
  // Initialize last fetch date based on current data
  const initializeLastOtherAgencyFetchAt = () => {
    try {
      const dates = otherAgencyAssistance.value
        .map(item => new Date(item.tarikhDiperoleh))
        .filter(d => !isNaN(d.getTime()));
      if (dates.length > 0) {
        lastOtherAgencyFetchAt.value = new Date(Math.max(...dates.map(d => d.getTime())));
      }
    } catch (e) {
      // fallback to now
      lastOtherAgencyFetchAt.value = new Date();
    }
  };
  initializeLastOtherAgencyFetchAt();
  
  // Local datetime formatter (DD-MM-YYYY HH:MM)
  const formatDateTimeLocal = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  };
  
  // Update table with latest mock data for "Bantuan daripada Agensi"
  const getLatestOtherAgencyAssistance = () => {
    otherAgencyAssistance.value = [
      {
        namaBantuan: "Program Kasih Siswa (dKasih)",
        jumlah: "1,500",
        kekerapan: "One-off",
        tahun: "2025",
        tarikhDiperoleh: "9/22/2025",
        dataDaripada: "ICU",
      },
      {
        namaBantuan: "Sumbangan Asas Rahmah (SARA)",
        jumlah: "2,400",
        kekerapan: "Berkala",
        tahun: "2025",
        tarikhDiperoleh: "9/22/2025",
        dataDaripada: "ICU",
      },
      {
        namaBantuan: "Bantuan Prihatin Rakyat (BPR)",
        jumlah: "1,000",
        kekerapan: "One-off",
        tahun: "2025",
        tarikhDiperoleh: "9/22/2025",
        dataDaripada: "JPM",
      },
    ];
    lastOtherAgencyFetchAt.value = new Date();
  };
  
  // Recommended Aid data (Syor)
  const recommendedAid = ref([
    {
      aid: "[B103] (HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)",
      aidProduct: "(HQ) KATEGORI HEMODIALISIS (FAKIR)",
      productPackage: "(GL) (HQ) HEMODIALISIS DAN SUNTIKAN EPO (FAKIR)",
      entitlementProduct: "(GL) (HQ) SUNTIKAN EPO (FAKIR)",
      kadarDicadangkan: "500.00/bulan",
      skorAI: 87,
      tarikhSyor: "2025-08-07",
      justifikasiSyor:
        "Asnaf mempunyai masalah kesihatan dan perlu menjalani rawatan dialisis",
      terimaCadangan: false,
    },
    {
      aid: "[B106] BANTUAN MAKANAN BULANAN (FAKIR)",
      aidProduct: "MAKANAN BULANAN (FAKIR)",
      productPackage: "MAKANAN BULANAN TERAS (FAKIR) - K2",
      entitlementProduct:
        "K2 FAKIR - (10KG BERAS, 2KG TEPUNG, 2KG MINYAK, 2KG GULA, 2 BIHUN, 1 KICAP)",
      kadarDicadangkan: "56.00",
      skorAI: 95,
      tarikhSyor: "2025-08-06",
      justifikasiSyor: "Bantuan Asasi untuk Fakir",
      terimaCadangan: false,
    },
    {
      aid: "[B105] BANTUAN KEWANGAN BULANAN (FAKIR)",
      aidProduct: "BANTUAN KEWANGAN BULANAN (FAKIR)",
      productPackage: "KEWANGAN BULANAN (FAKIR) - T2",
      entitlementProduct: "KEWANGAN BULANAN (FAKIR) - T2",
      kadarDicadangkan: "400.00",
      skorAI: 96,
      tarikhSyor: "2025-08-06",
      justifikasiSyor: "Bantuan Asasi untuk Fakir",
      terimaCadangan: false,
    },
    // {
    //   aid: "[B400] BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
    //   aidProduct: "BANTUAN SUMBANGAN BINA/BAIKPULIH INSTITUSI AGAMA",
    //   productPackage: "SUMBANGAN BINA/BAIKPULIH INSTITUSI AGAMA, SUMBANGAN BINA/BAIKPULIH SEKOLAH AGAMA, SUMBANGAN BINA/BAIKPULIH SURAU SEKOLAH",
    //   entitlementProduct: "(DIRECT) SUMBANGAN BINA/BAIKPULIH INSTITUSI AGAMA, (GL) SUMBANGAN BINA/BAIKPULIH INSTITUSI AGAMA",
    //   kadarDicadangkan: "5000.00",
    //   skorAI: 88,
    //   tarikhSyor: "2025-09-26",
    //   justifikasiSyor: "Bantuan untuk pembinaan dan baik pulih institusi agama",
    //   terimaCadangan: false,
    // },
  ]);
  
  // Move selected Syor items to Bantuan Baru and remove from Syor
  const confirmRecommendedAid = () => {
    const selected = recommendedAid.value.filter(r => r.terimaCadangan);
    if (selected.length === 0) return;
  
    const newApps = selected.map(r => ({
      id: r.aid?.match(/\[(.*?)\]/)?.[1] || r.aid || `NEW-${Date.now()}`,
      jenisBantuan: r.aidProduct || r.aid || 'Bantuan Baharu',
      status: 'Perlu Diproses',
      sla: '-'
    }));
  
    assistanceApplications.value = [...assistanceApplications.value, ...newApps];
    recommendedAid.value = recommendedAid.value.filter(r => !r.terimaCadangan);
    selectAllSyor.value = false;
  };
  
  const selectAllSyor = ref(false);
  
  // Perubahan Bantuan - mock data
  const bantuanPerubahanKadar = ref([
    {
      aid: "[B106] BANTUAN MAKANAN BULANAN (FAKIR)",
      aidProduct: "MAKANAN BULANAN (FAKIR)",
      productPackage: "MAKANAN BULANAN TERAS (FAKIR) - K2",
      entitlementProduct:
        "K2 FAKIR - (10KG BERAS, 2KG TEPUNG, 2KG MINYAK, 2KG GULA, 2 BIHUN, 1 KICAP)",
      terimaCadangan: false,
    },
    {
      aid: "[B105] BANTUAN KEWANGAN BULANAN (FAKIR)",
      aidProduct: "BANTUAN KEWANGAN BULANAN (FAKIR)",
      productPackage: "KEWANGAN BULANAN (FAKIR) - T2",
      entitlementProduct: "KEWANGAN BULANAN (FAKIR) - T2",
      terimaCadangan: false,
    },
    {
      aid: "[B601] BANTUAN PENDIDIKAN (FAKIR)",
      aidProduct: "BANTUAN PENDIDIKAN (FAKIR)",
      productPackage: "(EFT) YURAN PENDIDIKAN (FAKIR)",
      entitlementProduct: "(EFT) YURAN PENDIDIKAN TINGGI (FAKIR)",
      terimaCadangan: false,
    },
    // {
    //   aid: "[B400] BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
    //   aidProduct: "BANTUAN SUMBANGAN BINA/BAIKPULIH INSTITUSI AGAMA",
    //   productPackage: "SUMBANGAN BINA/BAIKPULIH INSTITUSI AGAMA, SUMBANGAN BINA/BAIKPULIH SEKOLAH AGAMA, SUMBANGAN BINA/BAIKPULIH SURAU SEKOLAH",
    //   entitlementProduct: "(DIRECT) SUMBANGAN BINA/BAIKPULIH INSTITUSI AGAMA, (GL) SUMBANGAN BINA/BAIKPULIH INSTITUSI AGAMA",
    //   terimaCadangan: false,
    // },
    // {
    //   aid: "[B503] BANTUAN MAKANAN BULANAN (FAKIR)",
    //   aidProduct: "MAKANAN BULANAN (FAKIR)",
    //   productPackage: "(VCASH) BANTUAN BULANAN (FAKIR)",
    //   entitlementProduct: "(VCASH) BANTUAN BULANAN KELUARGA (FAKIR)",
    //   terimaCadangan: false,
    // },
    // {
    //   aid: "[B701] BANTUAN BENCANA (FAKIR)",
    //   aidProduct: "BANTUAN BENCANA (FAKIR)",
    //   productPackage: "(CASH) BANTUAN SEGERA (FAKIR)",
    //   entitlementProduct: "(CASH) BENCANA ALAM (FAKIR)",
    //   terimaCadangan: false,
    // },
  ]);
  
  const bantuanPembatalan = ref([
    {
      aid: "[B601] BANTUAN PENDIDIKAN (MISKIN)",
      aidProduct: "BANTUAN PENDIDIKAN (MISKIN)",
      productPackage: "(EFT) YURAN PENDIDIKAN (MISKIN)",
      entitlementProduct: "(EFT) YURAN PENDIDIKAN TINGGI (MISKIN)",
      batalBantuan: false,
    },
    {
      aid: "[B503] BANTUAN MAKANAN BULANAN (MISKIN)",
      aidProduct: "BANTUAN MAKANAN BULANAN (MISKIN)",
      productPackage: "(VCASH) BANTUAN BULANAN (MISKIN)",
      entitlementProduct: "(VCASH) BANTUAN BULANAN KELUARGA (MISKIN)",
      batalBantuan: false,
    },
    {
      aid: "[B304] BANTUAN KEPERLUAN HIDUP (MISKIN)",
      aidProduct: "BANTUAN KEPERLUAN HIDUP (MISKIN)",
      productPackage: "(VCASH) BANTUAN BULANAN (MISKIN)",
      entitlementProduct: "(VCASH) BAYARAN BULANAN KELUARGA (MISKIN)",
      batalBantuan: false,
    },
    // {
    //   aid: "[B701] BANTUAN BENCANA (MISKIN)",
    //   aidProduct: "BANTUAN BENCANA (MISKIN)",
    //   productPackage: "(CASH) BANTUAN SEGERA (MISKIN)",
    //   entitlementProduct: "(CASH) BENCANA ALAM (MISKIN)",
    //   batalBantuan: false,
    // },
    {
      aid: "[B205] BANTUAN PERUBATAN DIALISIS (MISKIN)",
      aidProduct: "BANTUAN PERUBATAN DIALISIS (MISKIN)",
      productPackage: "(GL) BANTUAN BULANAN (MISKIN)",
      entitlementProduct: "(GL) BANTUAN PERUBATAN DIALISIS (MISKIN)",
      batalBantuan: false,
    },
  ]);
  
  // Textarea model for pembatalan justification
  const justifikasiPembatalan = ref("");
  
  // Show textarea only when there is at least one checked cancellation
  const anyPembatalanSelected = computed(() =>
    bantuanPembatalan.value.some((row) => row.batalBantuan)
  );
  
  // Enable Sahkan only when at least one selected and justification filled
  const canConfirmPembatalan = computed(() => {
    return anyPembatalanSelected.value && String(justifikasiPembatalan.value).trim().length > 0;
  });
  
  const selectAllPerubahan = ref(false);
  const selectAllPembatalan = ref(false);
  
  // Methods
  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    // Handle form submission
  };
  
  const addNewAssistance = () => {
    console.log("Add new assistance");
    // Handle adding new assistance
  };
  
  const editAssistance = (row) => {
    router.push(`/BF-BTN/tugasan/bantuan/siasatan/${row.id}`);
  };
  
  const saveData = () => {
    console.log("Save data");
    // Handle saving data
  };
  
  const saveDraft = () => {
    console.log("Save draft");
    // Handle saving draft
  };
  
  const getStatusVariant = (status) => {
    const variants = {
      "dalam siasatan": "warning",
      "selesai siasatan": "success",
      "menunggu siasatan": "info",
    };
    return variants[status.toLowerCase()] || "default";
  };
  
  const getScoreVariant = (score) => {
    const value =
      typeof score === "number"
        ? score
        : parseInt(String(score).replace(/[^0-9]/g, ""));
    if (value >= 90) return "success";
    if (value >= 75) return "warning";
    return "danger";
  };
  
  const toggleSelectAllSyor = () => {
    recommendedAid.value.forEach((row) => {
      row.terimaCadangan = selectAllSyor.value;
    });
  };
  
  const toggleSelectAllPerubahan = () => {
    bantuanPerubahanKadar.value.forEach((row) => {
      row.terimaCadangan = selectAllPerubahan.value;
    });
  };
  
  // Move selected Perubahan items to Bantuan Baru and remove from Perubahan list
  const confirmPerubahanAid = () => {
    const selected = bantuanPerubahanKadar.value.filter(r => r.terimaCadangan);
    if (selected.length === 0) return;
  
    const newApps = selected.map(r => ({
      id: r.aid?.match(/\[(.*?)\]/)?.[1] || r.aid || `NEW-${Date.now()}`,
      jenisBantuan: r.aidProduct || r.aid || 'Bantuan Baharu',
      status: 'Perlu Diproses',
      sla: '-'
    }));
  
    assistanceApplications.value = [...assistanceApplications.value, ...newApps];
    bantuanPerubahanKadar.value = bantuanPerubahanKadar.value.filter(r => !r.terimaCadangan);
    selectAllPerubahan.value = false;
  };
  
  const toggleSelectAllPembatalan = () => {
    bantuanPembatalan.value.forEach((row) => {
      row.batalBantuan = selectAllPembatalan.value;
    });
  };
  
  const getAssistanceStatusVariant = (status) => {
    const variants = {
      "perlu diproses": "warning",
      lulus: "success",
      "tidak lulus": "danger",
    };
    return variants[status.toLowerCase()] || "default";
  };
  
  // Computed property for form validation
  const canSubmitForApproval = computed(() => {
    const baseValidation = investigationData.value.keadaanSiasatan;
    
    if (investigationData.value.keadaanSiasatan === "lapangan") {
      return (
        baseValidation &&
        investigationData.value.tarikhLawatan &&
        investigationData.value.masaLawatan &&
        investigationData.value.StatusPengesahanLawatan
      );
    }
    
    return baseValidation;
  });
  
  // Computed property for profiling form validation
  const isProfilingFormValid = computed(() => {
    return (
      profilingData.value.pengenalanId &&
      profilingData.value.nama &&
      profilingData.value.hadKifayahSyor &&
      profilingData.value.assignSiasatan
    );
  });
  
  // Image handling methods
  const triggerFileInput = () => {
    if (fileInputRef.value) {
      fileInputRef.value.click();
    }
  };
  
  const handleFileInputChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
    // Reset input value so same file can be selected again
    event.target.value = "";
  };
  
  const handleFileDrop = (event) => {
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };
  
  const processFiles = async (files) => {
    const validFiles = files.filter((file) => {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        console.error(`File ${file.name} is too large. Maximum 5MB allowed.`);
        // You could show a toast notification here
        return false;
      }
  
      // Validate file type
      if (!file.type.startsWith("image/")) {
        console.error(`File ${file.name} is not a valid image format.`);
        // You could show a toast notification here
        return false;
      }
  
      return true;
    });
  
    // Process each valid file
    for (const file of validFiles) {
      await processImageFile(file);
    }
  };
  
  const processImageFile = async (file) => {
    // Create upload progress entry
    const progressEntry = {
      filename: file.name,
      size: file.size,
      progress: 0,
    };
    uploadProgress.value.push(progressEntry);
  
    // Create image object with loading state
    const uploadedImage = {
      url: URL.createObjectURL(file),
      filename: file.name,
      caption: "",
      file: file,
      size: file.size,
      loading: true,
    };
  
    uploadedImages.value.push(uploadedImage);
  
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      progressEntry.progress += Math.random() * 30;
      if (progressEntry.progress >= 100) {
        progressEntry.progress = 100;
        clearInterval(progressInterval);
  
        // Remove from progress and update image
        const progressIndex = uploadProgress.value.indexOf(progressEntry);
        if (progressIndex > -1) {
          uploadProgress.value.splice(progressIndex, 1);
        }
  
        // Mark image as loaded
        uploadedImage.loading = false;
      }
    }, 200);
  };
  
  const removeImage = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(uploadedImages.value[index].url);
    uploadedImages.value.splice(index, 1);
  };
  
  const previewImage = (image) => {
    previewingImage.value = image;
    showPreviewModal.value = true;
  };
  
  // Form submission methods
  const handleSubmitLawatan = (formData) => {
    console.log("Investigation form submitted:", formData);
    // Handle form submission
  };
  
  const handleSimpan = async () => {
    try {
      processing.value = true;
      actionType.value = "save";
  
      // Implement save functionality
      console.log("Saving investigation data...", investigationData.value);
  
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      console.log("Investigation data saved successfully");
    } catch (error) {
      console.error("Error saving investigation data:", error);
    } finally {
      processing.value = false;
      actionType.value = "";
    }
  };
  
  const handleHantarKelulusan = async () => {
    try {
      processing.value = true;
      actionType.value = "submit";
  
      // Validate required fields
      if (!canSubmitForApproval.value) {
        console.error("Please complete all required fields before submitting");
        return;
      }
  
      // Implement submit for approval functionality
      console.log("Submitting for approval...", investigationData.value);
  
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
  
      console.log("Successfully submitted for approval");
  
      // Navigate back to list or show success message
      // navigateTo("/BF-BTN/tugasan");
    } catch (error) {
      console.error("Error submitting for approval:", error);
    } finally {
      processing.value = false;
      actionType.value = "";
    }
  };
  
  const handleKembali = () => {
    // Navigate back to the task list
    navigateTo("/BF-BTN/tugasan");
  };
  
  // Utility function for formatting file sizes
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
  
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  
  // Enhanced modal functions
  const downloadImage = (image) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const saveImageCaption = () => {
    // Caption is already bound to the image object via v-model
    // You could add validation or API call here if needed
    console.log("Caption saved:", previewingImage.value.caption);
    showPreviewModal.value = false;
  };
  
  // Profiling form methods
  const handleProfilingSubmit = (formData) => {
    console.log("Profiling form submitted:", formData);
    // Handle profiling form submission
  };
  
  const searchPengenalanId = async () => {
    if (!profilingData.value.pengenalanId) {
      console.error("Please enter an ID to search");
        return;
      }
  
    try {
      searchingId.value = true;
      console.log(
        "Searching for Pengenalan ID:",
        profilingData.value.pengenalanId
      );
  
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
  
      // Mock data population (replace with actual API response)
      profilingData.value.nama = "Mohd Ahmad bin Abdullah";
      profilingData.value.hadKifayahSyor = "75.5";
      profilingData.value.kategoriKeluargaAsnafSyor = "Fakir";
      profilingData.value.kategoriAsnafSyor = "Asnaf Produktif";
  
      console.log("Search completed successfully");
    } catch (error) {
      console.error("Error searching for ID:", error);
    } finally {
      searchingId.value = false;
    }
  };
  
  const resetProfilingForm = () => {
    // Reset all form fields to initial state
    Object.keys(profilingData.value).forEach((key) => {
      profilingData.value[key] = "";
    });
    console.log("Profiling form reset");
  };
  
  const saveProfilingDraft = async () => {
    try {
      savingDraft.value = true;
      console.log("Saving profiling draft...", profilingData.value);
  
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      console.log("Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      savingDraft.value = false;
    }
  };
  
  const submitProfiling = async () => {
    if (!isProfilingFormValid.value) {
      console.error("Please complete all required fields");
        return;
      }
  
    try {
      submittingProfile.value = true;
      console.log("Submitting profiling data...", profilingData.value);
  
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      console.log("Profiling data submitted successfully");
    } catch (error) {
      console.error("Error submitting profiling data:", error);
    } finally {
      submittingProfile.value = false;
    }
  };
  
  // Modal navigation methods
  const modalNextStepA = () => {
    if (modalCurrentStepA.value < modalTotalStepsA) {
      modalCurrentStepA.value++;
    }
  };
  
  const modalPrevStepA = () => {
    if (modalCurrentStepA.value > 1) {
      modalCurrentStepA.value--;
    }
  };
  
  const modalGoToStepA = (stepNumber) => {
    modalCurrentStepA.value = stepNumber;
  };
  
  // Function to calculate age from IC number
  const calculateAgeFromIC = (icNumber) => {
    if (!icNumber || icNumber.length < 6) return 0;
    
    const year = icNumber.substring(0, 2);
    const month = icNumber.substring(2, 4);
    const day = icNumber.substring(4, 6);
    
    // Determine century based on year
    let fullYear;
    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;
    const twoDigitYear = parseInt(year);
    
    if (twoDigitYear > (currentYear % 100)) {
      fullYear = currentCentury - 100 + twoDigitYear;
    } else {
      fullYear = currentCentury + twoDigitYear;
    }
    
    const birthDate = new Date(fullYear, parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Function to calculate birth date from IC number
  const calculateBirthDateFromIC = (icNumber) => {
    if (!icNumber || icNumber.length < 6) return null;
    
    const year = icNumber.substring(0, 2);
    const month = icNumber.substring(2, 4);
    const day = icNumber.substring(4, 6);
    
    // Determine century based on year
    let fullYear;
    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;
    const twoDigitYear = parseInt(year);
    
    if (twoDigitYear > (currentYear % 100)) {
      fullYear = currentCentury - 100 + twoDigitYear;
    } else {
      fullYear = currentCentury + twoDigitYear;
    }
    
    // Format as YYYY-MM-DD for date input
    const formattedDate = `${fullYear}-${month}-${day}`;
    return formattedDate;
  };

  // Function to create mockup file objects
  const createMockupFile = (filename, type = 'application/pdf') => {
    return {
      name: filename,
      size: Math.floor(Math.random() * 2000000) + 500000, // 500KB to 2.5MB
      type: type,
      lastModified: Date.now(),
      url: `data:${type};base64,${btoa('Mock file content')}`,
      loading: false
    };
  };

  // Function to generate mockup data for blank fields
  const generateMockupData = (record) => {
    const mockupData = {
      // Personal Information
      alamat: record.alamat || "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram",
      kariah: record.kariah || "Masjid Al-Taqwa",
      daerah: record.daerah || "Kuala Selangor",
      jenisPengenalan: record.jenisPengenalan || "MyKad",
      noTelefon: record.noTelefon || "0123456789",
      email: record.email || "pemohon@gmail.com",
      statusKeluarga: record.statusKeluarga || "Fakir",
      statusIndividu: record.statusIndividu || "Fakir",
      statusMultidimensi: record.statusMultidimensi || "Asnaf Tidak Produktif",
      
      // Calculate age and birth date from IC
      umur: calculateAgeFromIC(record.noPengenalan),
      tarikh_lahir: calculateBirthDateFromIC(record.noPengenalan),
      
      // File uploads - mockup files
      dokumen_id: [createMockupFile("mykad.pdf")],
      lain_warganegara: record.warganegara === 'Lain-lain' ? [createMockupFile("passport.pdf")] : [],
      sijil_pendidikan: [
        createMockupFile("sijil_spm.pdf"),
        createMockupFile("sijil_sijil.pdf")
      ],
      dokumen_pemilikan: [createMockupFile("dokumen_rumah.pdf")],
      pengesahan_pendapatan: [createMockupFile("slip_gaji.pdf")],
      
      // Personal details - specific for each person
      tempat_lahir: record.noBantuan === "NAS-2025-0005" ? "Kuala Selangor" : "Kuala Lumpur",
      jantina: record.noBantuan === "NAS-2025-0005" ? "Perempuan" : "Lelaki",
      agama: "Islam",
      bangsa: "Melayu",
      no_telefon_bimbit: record.noTelefon || "0123456789",
      emel: record.email || "pemohon@gmail.com",
      
      // Marital status - specific for each person
      status_perkahwinan: record.noBantuan === "NAS-2025-0005" ? "Janda" : "Berkahwin",
      status_poligami: "tidak",
      bilangan_isteri: 0,
      isteri_list: [],
      
      // Education
      masih_bersekolah: "T",
      pendidikan_tertinggi: "SPM",
      tahap_pendidikan: ["SRP/PMR", "SPM"],
      lain_pendidikan_tertinggi: "",
      lain_tahap_pendidikan: "",
      
      // Health - specific for each person
      tahap_kesihatan: record.noBantuan === "NAS-2025-0005" ? "Sihat" : "Sihat",
      keadaan_kesihatan_sakit: record.noBantuan === "NAS-2025-0005" ? "" : "",
      
      // Skills - specific for each person
      kemahiran: record.noBantuan === "NAS-2025-0005" ? ["Memasak", "Mengemas", "Menjahit"] : ["Memasak", "Mengemas", "Mengajar"],
      lain_lain_kemahiran: record.noBantuan === "NAS-2025-0005" ? "Kerja sambilan menjahit baju" : "",
      
      // Address - specific for each person
      alamat_rumah: record.alamat || "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram",
      daerah_rumah: record.daerah || "Kuala Selangor",
      poskod_rumah: record.noBantuan === "NAS-2025-0005" ? "45800" : "45800",
      bandar_rumah: record.noBantuan === "NAS-2025-0005" ? "Kuala Selangor" : "Jeram",
      negeri_rumah: "Selangor",
      
      // Family living - specific for each person
      tinggal_bersama_keluarga: "Y",
      asrama_rumah_sewa: "",
      nama_baitul: "",
      
      // Family details - specific for Faridah
      jumlah_tanggungan: record.noBantuan === "NAS-2025-0005" ? 2 : 3,
      anak_bersekolah: record.noBantuan === "NAS-2025-0005" ? 2 : 2,
      
      // Employment - specific for each person
      status_pekerjaan: record.noBantuan === "NAS-2025-0005" ? "tidak_bekerja" : "bekerja",
      jenis_pekerjaan: record.noBantuan === "NAS-2025-0005" ? "Tidak Bekerja" : "Pekerja Swasta",
      nama_majikan: record.noBantuan === "NAS-2025-0005" ? "" : "Syarikat ABC Sdn Bhd",
      alamat_tempat_kerja: record.noBantuan === "NAS-2025-0005" ? "" : "Jalan Industri, Taman Perindustrian, 45600 Selangor",
      
      // Income and expenses - specific for each person
      gaji_elaun_pendapatan: record.noBantuan === "NAS-2025-0005" ? 0 : 1500,
      pendapatan_isteri_suami_ibubapa_penjaga: record.noBantuan === "NAS-2025-0005" ? 400 : 800,
      pencen_perkeso: 0,
      sumbangan_anak_anak: record.noBantuan === "NAS-2025-0005" ? 300 : 200,
      bantuan_jkm: record.noBantuan === "NAS-2025-0005" ? 500 : 300,
      takaful: 0,
      sewa_rumah_tanah_kedai: 500,
      bil_utiliti: 200,
      pengangkutan_tambang_bas_sekolah: 100,
      jumlah_bantuan_diterima: 2000,
      
      // Property ownership
      wang_simpanan: 500,
      emas: 0,
      saham: 0,
      wang_tunai: 100,
      harta_tanah: 0,
      kenderaan: 0,
      perabot: 0,
      peralatan_elektrik: 0,
      
      // Loan information
      nama_institusi_pemberi_pinjaman: "Bank Rakyat",
      jenis_pinjaman: "Pinjaman Peribadi",
      jumlah_pinjaman: 5000,
      baki_pinjaman: 3000,
      bayaran_bulanan: 200,
      
      // Bank accounts - specific for each person
      bank_accounts: [
        {
          nama_bank: record.noBantuan === "NAS-2025-0005" ? "BIMB" : "MAYBANK",
          no_akaun_bank: record.noBantuan === "NAS-2025-0005" ? "1400567890123456" : "1234567890123456",
          nama_pemegang_akaun: record.nama || "Mohd Rosli bin Saad",
          jenis_akaun: "individu",
          id_pengenalan: "",
          nama_bersama: "",
          hubungan: "",
        }
      ],
      
      // Additional fields for blank form fields
      alamat1: "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram, Selangor",
      alamat2: "Taman Perindustrian, Kawasan Perumahan",
      alamat3: "Blok A, Tingkat 2, No. 15",
      amaun_bayaran_bulanan: 800,
      jumlah_keseluruhan_perbelanjaan: 150000,
      tahun_mula_pinjaman: "2020-01-01",
      tahun_akhir_pinjaman: "2030-12-31",
      dokumen_perjanjian_pinjaman: [createMockupFile("perjanjian_pinjaman.pdf")],
      sumber_pendapatan: ["Individu", "Sumbangan keluarga"],
      lain_lain_sumber_pendapatan: "",
      jawatan: "Pembantu Am",
      status_jawatan: "Tetap",
      pendapatan_kasar: 1800,
      pengesahan_pendapatan: [createMockupFile("slip_gaji_terkini.pdf")],
      pendapatan_tanggungan_serumah: 0,
      pendapatan_lain_lain: 0,
      perbelanjaan_makanan_minuman: 600,
      perbelanjaan_persekolahan_anak: 200,
      
      // Education entries
      education_entries: [
        {
          jenis_sekolah: "rendah",
          kategori_sekolah: "SRK",
          tahun_bersekolah: "2010",
          tahun_tingkatan: "6",
          nama_sekolah: "SK Kampung Bukit Kuching",
          alamat_sekolah_1: "Jalan Sekolah, Kampung Bukit Kuching, 45800 Jeram, Selangor",
          alamat_sekolah_2: "Taman Pendidikan, Kawasan Sekolah",
          alamat_sekolah_3: "Blok A, Tingkat 1",
          daerah_sekolah: "Kuala Selangor",
          bandar_sekolah: "Jeram",
          poskod_sekolah: "45800",
          bidang_kursus: "",
          jurusan_bidang: "",
          pembiayaan_pengajian: ["LZS"],
          lain_pembiayaan: "",
          catatan: "Sekolah rendah"
        }
      ]
    };
    
    return { ...record, ...mockupData };
  };
  
  // Load data based on route parameter
  onMounted(() => {
    const noBantuan = route.params.id || "NAS-2025-0001"; // Default to first record
    const record = mockByNoBantuan[noBantuan];
    const investigationRecord = mockInvestigationData[noBantuan];
    
    if (record) {
      // Generate mockup data for blank fields
      const completeRecord = generateMockupData(record);
      console.log("Loading record for:", noBantuan);
      console.log("Applicant data:", { nama: record.nama, kariah: record.kariah, noPengenalan: record.noPengenalan });
      Object.assign(formData.value, completeRecord);
      
      // Also populate formDataPRF for the form fields
      Object.assign(formDataPRF.value, {
        nama: completeRecord.nama,
        no_pengenalan: completeRecord.noPengenalan,
        umur: completeRecord.umur,
        tarikh_lahir: completeRecord.tarikh_lahir,
        tempat_lahir: completeRecord.tempat_lahir,
        jantina: completeRecord.jantina,
        agama: completeRecord.agama,
        bangsa: completeRecord.bangsa,
        no_telefon_bimbit: completeRecord.no_telefon_bimbit,
        emel: completeRecord.emel,
        status_perkahwinan: completeRecord.status_perkahwinan,
        status_poligami: completeRecord.status_poligami,
        bilangan_isteri: completeRecord.bilangan_isteri,
        isteri_list: completeRecord.isteri_list,
        masih_bersekolah: completeRecord.masih_bersekolah,
        pendidikan_tertinggi: completeRecord.pendidikan_tertinggi,
        tahap_pendidikan: completeRecord.tahap_pendidikan,
        lain_pendidikan_tertinggi: completeRecord.lain_pendidikan_tertinggi,
        lain_tahap_pendidikan: completeRecord.lain_tahap_pendidikan,
        tahap_kesihatan: completeRecord.tahap_kesihatan,
        kemahiran: completeRecord.kemahiran,
        lain_lain_kemahiran: completeRecord.lain_lain_kemahiran,
        alamat_rumah: completeRecord.alamat_rumah,
        daerah_rumah: completeRecord.daerah_rumah,
        poskod_rumah: completeRecord.poskod_rumah,
        bandar_rumah: completeRecord.bandar_rumah,
        negeri_rumah: completeRecord.negeri_rumah,
        tinggal_bersama_keluarga: completeRecord.tinggal_bersama_keluarga,
        asrama_rumah_sewa: completeRecord.asrama_rumah_sewa,
        nama_baitul: completeRecord.nama_baitul,
        status_pekerjaan: completeRecord.status_pekerjaan,
        jenis_pekerjaan: completeRecord.jenis_pekerjaan,
        nama_majikan: completeRecord.nama_majikan,
        alamat_tempat_kerja: completeRecord.alamat_tempat_kerja,
        gaji_elaun_pendapatan: completeRecord.gaji_elaun_pendapatan,
        pendapatan_isteri_suami_ibubapa_penjaga: completeRecord.pendapatan_isteri_suami_ibubapa_penjaga,
        pencen_perkeso: completeRecord.pencen_perkeso,
        sumbangan_anak_anak: completeRecord.sumbangan_anak_anak,
        bantuan_jkm: completeRecord.bantuan_jkm,
        takaful: completeRecord.takaful,
        sewa_rumah_tanah_kedai: completeRecord.sewa_rumah_tanah_kedai,
        bil_utiliti: completeRecord.bil_utiliti,
        pengangkutan_tambang_bas_sekolah: completeRecord.pengangkutan_tambang_bas_sekolah,
        jumlah_bantuan_diterima: completeRecord.jumlah_bantuan_diterima,
        wang_simpanan: completeRecord.wang_simpanan,
        emas: completeRecord.emas,
        saham: completeRecord.saham,
        wang_tunai: completeRecord.wang_tunai,
        harta_tanah: completeRecord.harta_tanah,
        kenderaan: completeRecord.kenderaan,
        perabot: completeRecord.perabot,
        peralatan_elektrik: completeRecord.peralatan_elektrik,
        nama_institusi_pemberi_pinjaman: completeRecord.nama_institusi_pemberi_pinjaman,
        jenis_pinjaman: completeRecord.jenis_pinjaman,
        jumlah_pinjaman: completeRecord.jumlah_pinjaman,
        baki_pinjaman: completeRecord.baki_pinjaman,
        bayaran_bulanan: completeRecord.bayaran_bulanan,
        education_entries: completeRecord.education_entries,
        dokumen_id: completeRecord.dokumen_id,
        lain_warganegara: completeRecord.lain_warganegara,
        sijil_pendidikan: completeRecord.sijil_pendidikan,
        dokumen_pemilikan: completeRecord.dokumen_pemilikan,
        pengesahan_pendapatan: completeRecord.pengesahan_pendapatan,
        alamat1: completeRecord.alamat1,
        alamat2: completeRecord.alamat2,
        alamat3: completeRecord.alamat3,
        amaun_bayaran_bulanan: completeRecord.amaun_bayaran_bulanan,
        jumlah_keseluruhan_perbelanjaan: completeRecord.jumlah_keseluruhan_perbelanjaan,
        tahun_mula_pinjaman: completeRecord.tahun_mula_pinjaman,
        tahun_akhir_pinjaman: completeRecord.tahun_akhir_pinjaman,
        dokumen_perjanjian_pinjaman: completeRecord.dokumen_perjanjian_pinjaman,
        sumber_pendapatan: completeRecord.sumber_pendapatan,
        lain_lain_sumber_pendapatan: completeRecord.lain_lain_sumber_pendapatan,
        jawatan: completeRecord.jawatan,
        status_jawatan: completeRecord.status_jawatan,
        pendapatan_kasar: completeRecord.pendapatan_kasar,
        pendapatan_tanggungan_serumah: completeRecord.pendapatan_tanggungan_serumah,
        pendapatan_lain_lain: completeRecord.pendapatan_lain_lain,
        perbelanjaan_makanan_minuman: completeRecord.perbelanjaan_makanan_minuman,
        perbelanjaan_persekolahan_anak: completeRecord.perbelanjaan_persekolahan_anak
      });
    }
    
    if (investigationRecord) {
      Object.assign(investigationData.value, investigationRecord);
      
      // Load assistance applications for this ID
      if (investigationRecord.assistanceApplications) {
        assistanceApplications.value = investigationRecord.assistanceApplications;
        console.log("Loaded assistance applications:", assistanceApplications.value);
      }
    }
  });
  </script>
  
  <style lang="scss" scoped>
  /* Table responsive enhancements */
  .scrollbar-thin {
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background-color: #f3f4f6;
    border-radius: 9999px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 9999px;
    transition: background-color 0.2s;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
  }
  
  /* Enhanced table container */
  .table-container {
    position: relative;
  }
  
  .table-container::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8));
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .table-container:hover::after {
    opacity: 1;
  }
  
  /* Table minimum width for horizontal scrolling */
  .table-responsive {
    min-width: 800px;
  }
  
  /* Mobile touch scrolling */
  @media (max-width: 768px) {
    .scrollbar-thin {
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
  
    .scrollbar-thin::-webkit-scrollbar {
      display: none;
    }
  }
  
  /* Custom animations for image upload */
  .image-upload-enter-active,
  .image-upload-leave-active {
    transition: all 0.3s ease;
  }
  
  .image-upload-enter-from {
    opacity: 0;
    transform: scale(0.9);
  }
  
  .image-upload-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
  
  /* Hover effects for better interactivity */
  .group:hover .group-hover\:scale-105 {
    transform: scale(1.05);
  }
  
  /* Loading spinner animation */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  /* Smooth transitions for progress bars */
  .progress-bar {
    transition: width 0.3s ease-in-out;
  }
  
  /* Enhanced focus states for accessibility */
  .focus\:ring-2:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  </style>
  