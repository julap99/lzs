<template>
    <div class="min-h-screen">
      <div class="">
        <LayoutsBreadcrumb :items="breadcrumb" />
  
        <!-- Page Header -->
        <div class="mt-6 mb-8">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Kelulusan Bantuan</h1>
              <p class="mt-1 text-sm text-gray-600">
                Semak dan nilai maklumat siasatan untuk kelulusan
              </p>
            </div>
            <rs-badge
              v-if="formData.statusLawatan"
              :variant="getStatusVariant(formData.statusLawatan)"
              class="text-sm px-4 py-2"
            >
              {{ getStatusText(formData.statusLawatan) }}
            </rs-badge>
          </div>
        </div>
  
        <!-- Debug Section (remove this later) -->
        <!-- <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 class="text-sm font-medium text-yellow-800">Debug Info:</h3>
          <p class="text-xs text-yellow-700">Nama: {{ formData.nama }}</p>
          <p class="text-xs text-yellow-700">formData reactive: {{ JSON.stringify(formData) }}</p>
        </div> -->
  
        <div>
          <!-- Section 1: Maklumat Pemohon (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:user-circle" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Bantuan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran bantuan dan status 
                  </p>
                </div>
              </div>
            </template>
  
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Aid</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.aid
                    }}</span>
                  </div>
                </div>
  
                <div class="space-y-1 ">
                  <label class="text-sm font-medium text-gray-700">Aid Product</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.aidproduct
                    }}</span>
                  </div>
                </div>
  
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Product Package</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.productpackage
                    }}</span>
                  </div>
                </div> -->
  
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Product Package</label>
                  <FormKit
                    type="select"
                    name="productpackage"
                    v-model="formData.productpackage"
                    placeholder="Sila pilih product package"
                    :options="productPackageOptions"
                    
                    searchable="true"
                    class="mt-1"
                  />
                </div>
  
  
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Entitlement Product</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      formData.entitlementproduct
                    }}</span>
                  </div>
                </div> -->
  
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Entitlement Product</label>
                  <!-- Checkbox for B300 and B307 -->
                  <div v-if="isB300OrB307" class="mt-2 space-y-2">
                    <div class="text-xs text-gray-500 mb-2">Debug: isB300OrB307 = {{ isB300OrB307 }}, route.id = {{ route.params.id }}</div>
                    <div v-for="option in currentEntitlementOptions" :key="option.value" class="flex items-center">
                      <input
                        :id="option.value"
                        type="checkbox"
                        :value="option.value"
                        v-model="formData.entitlementProducts"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label :for="option.value" class="ml-2 text-sm text-gray-700 cursor-pointer">
                        {{ option.label }}
                      </label>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">Selected: {{ formData.entitlementProducts }}</div>
                  </div>
                  <!-- Dropdown for other IDs -->
                  <FormKit
                    v-else
                    type="select"
                    name="entitlementproduct"
                    v-model="formData.entitlementproduct"
                    placeholder="Sila pilih entitlement product"
                    :options="entitlementProductOptions"
                    searchable="true"
                    class="mt-1"
                  />
                </div>
  
                <!-- Tarikh Permohonan (Read Only) -->
                <div class="space-y-1 mt-4">
                  <label class="text-sm font-medium text-gray-700">Tarikh Permohonan</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">28/8/2025</span>
                  </div>
                </div>
  
                <!-- SLA (Read Only) -->
                <div class="space-y-1 mt-4">
                  <label class="text-sm font-medium text-gray-700">SLA</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">3 hari lagi</span>
                  </div>
                </div>
  
  
                <!-- Toggle Button SEGERA -->
                <div class="mt-6 flex items-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="formData.segera" class="sr-only peer">
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:bg-green-500 peer-checked:after:translate-x-full 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all"
                    ></div>
                    <span class="ml-3 text-sm font-medium text-gray-700">SEGERA</span>
                  </label>
                </div>
  
                <!-- Toggle Button Kelulusan Khas -->
                <div class="mt-6 flex items-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="formData.kelulusankhas" class="sr-only peer">
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:bg-green-500 peer-checked:after:translate-x-full 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all"
                    ></div>
                    <span class="ml-3 text-sm font-medium text-gray-700">Kelulusan Khas</span>
                  </label>
                </div>
  
              </div>
  
              <!-- Nyatakan Sebab (only shown if segera checked) -->
              <div v-if="formData.segera" class="mt-4 space-y-1">
                <label class="text-sm font-medium text-gray-700">Nyatakan Sebab</label>
                <textarea
                  v-model="formData.sebabSegera"
                  rows="3"
                  class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Nyatakan sebab di sini..."
                ></textarea>
              </div>
  
              <!-- Situasi Kelulusan Khas -->
          <div v-if="formData.kelulusankhas" class="mt-4 space-y-1">
            <label class="text-sm font-medium text-gray-700">Situasi</label>
            <select
              v-model="formData.situasikelulusankhas"
              class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option disabled value="">-- Sila pilih situasi --</option>
              <option>Umur, sama ada melebihi atau di bawah umur</option>
              <option>Tempoh masa terikatnya pemohon dengan sesuatu kelayakan bantuan</option>
              <option>Tidak memenuhi syarat minimum permohonan bantuan</option>
              <option>Pendapatan isi rumah yang melebihi jadual kelayakan pendapatan isi rumah yang ditetapkan</option>
              <option>Melebihi kadar Had Kifayah</option>
              <option>Lain-lain permohonan yang tidak memenuhi syarat dan kelayakan dalam GPSKAZ</option>
              <option>Permohonan berulang bagi bantuan yang bersifat sekali kelulusan dalam tempoh masa tertentu</option>
              <option>Jenis bantuan tidak tersenarai di dalam GPSKAZ/ Perkara yang melibatkan kepentingan akidah Islam dan nyawa</option>
            </select>
          </div>
            </template>
          </rs-card>
  
           <!-- NEW: Maklumat Pendidikan (read-only, shown for B300/B307) -->
           <rs-card v-if="educationInfo" class="shadow-sm border-0 bg-white">
               <template #header>
                 <div class="flex items-center space-x-3">
                   <div class="flex-shrink-0">
                     <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                       <Icon name="ph:graduation-cap" class="w-6 h-6 text-cyan-600" />
                     </div>
                   </div>
                   <div>
                     <h2 class="text-lg font-semibold text-gray-900">Maklumat Penerima Manfaat & Pendidikan</h2>
                     <p class="text-sm text-gray-500">{{ educationInfo.tablefor }}</p>
                   </div>
                 </div>
               </template>
  
               <template #body>
                 <!-- Penerima Manfaat (merged on top) -->
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <div class="space-y-1">
                     <label class="text-sm font-medium text-gray-700">Nama</label>
                     <FormKit
                       type="select"
                       v-model="dependentSelection.nama"
                       :options="dependentNameOptions"
                       placeholder="-- Sila Pilih --"
                       searchable="true"
                       class="mt-1"
                     />
                   </div>
  
                   <div class="space-y-1" v-if="Boolean(dependentSelection.nama)">
                     <label class="text-sm font-medium text-gray-700">No. Kad Pengenalan</label>
                     <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                       <span class="text-sm text-gray-900">{{ selectedDependent?.noKadPengenalan || '-' }}</span>
                     </div>
                   </div>
  
                   <div class="space-y-1" v-if="Boolean(dependentSelection.nama)">
                     <label class="text-sm font-medium text-gray-700">Hubungan</label>
                     <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                       <span class="text-sm text-gray-900">{{ selectedDependent?.hubungan || '-' }}</span>
                     </div>
                   </div>
                 </div>
                 <!-- /Penerima Manfaat -->
  
                 <div class="overflow-x-auto">
                   <table class="min-w-full divide-y divide-gray-200">
                     <tbody class="bg-white divide-y divide-gray-200">
                       <tr v-for="(value, label) in educationInfo.fields" :key="label">
                         <td class="px-6 py-3 w-1/3 text-sm font-medium text-gray-600">{{ label }}</td>
                         <td class="px-6 py-3 text-sm text-gray-900">{{ value }}</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
  
                 <!-- Editable table: Semester/Tahap (B307 only) -->
                 <div v-if="isB307" class="mt-6">
                   <div class="flex items-center justify-between mb-3">
                     <h3 class="text-md font-semibold text-gray-900">Perincian Semester/Tahap</h3>
                     <rs-button variant="primary" size="sm" @click="addSemesterRow">Tambah Baris</rs-button>
                   </div>
                   <div class="overflow-x-auto">
                     <table class="min-w-full divide-y divide-gray-200">
                       <thead class="bg-gray-50">
                         <tr>
                           <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Semester/Tahap</th>
                           <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan Mula Pengajian</th>
                           <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan Tamat Pengajian</th>
                           <!-- <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Semester</th> -->
                           <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA (jika ada)</th>
                           <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA (jika ada)</th>
                           <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yuran</th>
                           <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Aksi</th>
                         </tr>
                       </thead>
                       <tbody class="bg-white divide-y divide-gray-200">
                         <tr v-for="(sem, index) in educationSemesters" :key="index" class="hover:bg-gray-50">
                           <td class="px-3 py-2 text-sm text-gray-900">
                             <input type="number" min="1" class="w-20 p-2 border rounded" v-model.number="sem.semester" @input="normalizeSemesterNumbers" />
                           </td>
                           <td class="px-3 py-2">
                             <input type="text" class="w-full p-2 border rounded text-sm" v-model="sem.bulanMula" placeholder="cth: Jan-25" />
                           </td>
                           <td class="px-3 py-2">
                             <input type="text" class="w-full p-2 border rounded text-sm" v-model="sem.bulanTamat" placeholder="cth: Jun-25" />
                           </td>
                           <!-- <td class="px-3 py-2">
                             <select class="w-full p-2 border rounded text-sm" v-model="sem.jenis">
                               <option value="">-- Pilih --</option>
                               <option>Semester Panjang</option>
                               <option>Semester Pendek</option>
                             </select>
                           </td> -->
                           <td class="px-3 py-2">
                             <input type="text" class="w-full p-2 border rounded text-sm" v-model="sem.gpa" placeholder="cth: 3.75" />
                           </td>
                           <td class="px-3 py-2">
                             <input type="text" class="w-full p-2 border rounded text-sm" v-model="sem.cgpa" placeholder="cth: 3.60" />
                           </td>
                           <td class="px-3 py-2">
                             <input type="number" class="w-full p-2 border rounded text-sm" v-model.number="sem.yuran" placeholder="cth: 1500" />
                           </td>
                           <td class="px-3 py-2">
                             <rs-button variant="danger" size="sm" @click="removeSemesterRow(index)">Padam</rs-button>
                           </td>
                         </tr>
                         <tr v-if="educationSemesters.length === 0">
                           <td colspan="8" class="px-3 py-4 text-center text-sm text-gray-500">Tiada rekod. Klik "Tambah Baris" untuk menambah.</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                 </div>
               </template>
             </rs-card>
  
             <!-- NEW: Senarai Entitlement Product Cards -->
             <rs-card v-if="isB300OrB307" class="shadow-sm border-0 bg-white">
               <template #header>
                 <div class="flex items-center space-x-3">
                   <div class="flex-shrink-0">
                     <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                       <Icon name="ph:gift" class="w-6 h-6 text-indigo-600" />
                     </div>
                   </div>
                   <div>
                     <h2 class="text-lg font-semibold text-gray-900">Senarai Entitlement Product</h2>
                     <p class="text-sm text-gray-500">Bantuan yang dipilih berdasarkan checkbox</p>
                   </div>
                 </div>
               </template>
  
               <template #body>
                 <div class="space-y-4">
                   <!-- Entitlement Product Cards -->
                   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <div 
                       v-for="(product, index) in selectedEntitlementProducts" 
                       :key="index"
                       class="relative border rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                       :class="{
                         'border-green-200 bg-green-50': product.status === 'lengkap',
                         'border-blue-200 bg-blue-50': product.status === 'sedang_edit',
                         'border-gray-200 bg-white': product.status === 'baru'
                       }"
                     >
                       <!-- Status Badge -->
                       <div class="absolute top-2 right-2">
                         <rs-badge 
                           :variant="getProductStatusVariant(product.status)"
                           class="text-xs"
                         >
                           {{ getProductStatusText(product.status) }}
                         </rs-badge>
                       </div>
  
                       <!-- Product Info -->
                       <div class="pr-16">
                         <h3 class="font-semibold text-gray-900 text-sm mb-2">{{ product.name }}</h3>
                         <p class="text-xs text-gray-600 mb-1">{{ product.code }}</p>
                         <p class="text-xs text-gray-600 mb-3">{{ product.category }}</p>
                       </div>
  
                       <!-- Editable Sections (only when editing) -->
                       <div v-if="product.status === 'sedang_edit'" class="mt-4 space-y-4">
                         <!-- Maklumat Kadar Bantuan -->
                         <div class="bg-gray-50 p-3 rounded-lg">
                           <div class="flex items-center space-x-2 mb-3">
                             <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                               <Icon name="ph:currency-dollar" class="w-4 h-4 text-green-600" />
                             </div>
                             <div>
                               <h4 class="text-sm font-semibold text-gray-700">Maklumat Kadar Bantuan</h4>
                               <p class="text-xs text-gray-500">Nilai kadar bantuan yang dicadangkan</p>
                             </div>
                           </div>
                           <div class="space-y-3">
                             <!-- Special case for yuran_pengajian - only show editable total amount -->
                             <div v-if="product.code === 'yuran_pengajian'">
                               <label class="text-xs font-medium text-gray-600">Jumlah Keseluruhan Bantuan akan Diterima</label>
                               <input 
                                 v-model="product.kadarBantuan.jumlahKeseluruhan"
                                 type="text"
                                 class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 placeholder="Masukkan jumlah keseluruhan bantuan"
                               />
                             </div>
                             
                             <!-- Regular form for other products -->
                             <div v-else>
                               <!-- Row 1: Kadar Bantuan & Tempoh/Kekerapan -->
                               <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 <div>
                                   <label class="text-xs font-medium text-gray-600">Kadar Bantuan</label>
                                   <div class="relative">
                                     <input 
                                       v-model="product.kadarBantuan.kadarBantuan"
                                       type="number"
                                       class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                       placeholder="Masukkan kadar bantuan"
                                       @input="calculateTotalAmount(index)"
                                     />
                                     
                                   </div>
                                 </div>
                                 <div>
                                   <label class="text-xs font-medium text-gray-600">Tempoh/Kekerapan</label>
                                   <input 
                                     v-model="product.kadarBantuan.tempohKekerapan"
                                     type="number"
                                     class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                     placeholder="Masukkan bilangan tempoh/kekerapan"
                                     @input="calculateTotalAmount(index)"
                                   />
                                 </div>
                               </div>
                               
                               <!-- Row 2: Tarikh Mula & Tarikh Tamat -->
                               <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 <div>
                                   <label class="text-xs font-medium text-gray-600">Tarikh Mula</label>
                                   <div class="relative">
                                     <input 
                                       v-model="product.kadarBantuan.tarikhMula"
                                       type="date"
                                       class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                     />
                                     <Icon name="ph:calendar" class="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                   </div>
                                 </div>
                                 <div>
                                   <label class="text-xs font-medium text-gray-600">Tarikh Tamat</label>
                                   <div class="relative">
                                     <input 
                                       v-model="product.kadarBantuan.tarikhTamat"
                                       type="date"
                                       class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                     />
                                     <Icon name="ph:calendar" class="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                   </div>
                                 </div>
                               </div>
                               
                               <!-- Row 3: Jumlah Keseluruhan (read-only) -->
                               <div>
                                 <label class="text-xs font-medium text-gray-600">Jumlah Keseluruhan Bantuan akan Diterima</label>
                                 <div class="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium">
                                   {{ product.kadarBantuan.jumlahKeseluruhan }}
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
  
                         <!-- Maklumat Penerima Bayaran -->
                         <div class="bg-gray-50 p-3 rounded-lg">
                           <h4 class="text-sm font-semibold text-gray-700 mb-3">Maklumat Penerima Bayaran</h4>
                           <div class="space-y-3">
                             <!-- Kategori Penerima -->
                             <div>
                               <label class="text-xs font-medium text-gray-600">Kategori Penerima <span class="text-red-500">*</span></label>
                               <select 
                                 v-model="product.penerimaBayaran.kategoriPenerima"
                                 @change="loadPenerimaData(index)"
                                 class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                               >
                                 <option value="">-- Sila Pilih --</option>
                                 <option value="asnaf">Asnaf</option>
                                 <option value="organisasi">Organisasi</option>
                                 <option value="third_party">Third Party</option>
                               </select>
                             </div>
                             
                             <!-- No Pendaftaran Dropdown (for Organisasi/Third Party) -->
                             <div v-if="product.penerimaBayaran.kategoriPenerima === 'organisasi' || product.penerimaBayaran.kategoriPenerima === 'third_party'">
                               <label class="text-xs font-medium text-gray-600">No Pendaftaran <span class="text-red-500">*</span></label>
                               <select 
                                 v-model="product.penerimaBayaran.noPendaftaran"
                                 @change="loadPenerimaByRegistration(index)"
                                 class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                               >
                                 <option value="">-- Sila Pilih --</option>
                                 <option value="ABA1234">ABA1234 - SM Sains Kuala Selangor</option>
                                 <option value="WBA5678">WBA5678 - SM Sains Hulu Selangor</option>
                                 <option value="CBA9012">CBA9012 - Sekolah Seri Puteri, Cyberjaya</option>
                                 <option value="DGA3456">DGA3456 - Kolej Islam Sultan Alam Shah (KISAS)</option>
                                 <option value="EHA7890">EHA7890 - SBP Integrasi Gombak</option>
                                 <option value="UMA1122">UMA1122 - Universiti Malaya (UM)</option>
                                 <option value="UPM3344">UPM3344 - Universiti Putra Malaysia (UPM)</option>
                                 <option value="UKM5566">UKM5566 - Universiti Kebangsaan Malaysia (UKM)</option>
                                 <option value="UITM7788">UITM7788 - Universiti Teknologi MARA (UiTM)</option>
                                 <option value="USM9900">USM9900 - Universiti Sains Malaysia (USM)</option>
                               </select>
                             </div>
                             
                             <!-- Kaedah Pembayaran -->
                             <div>
                               <label class="text-xs font-medium text-gray-600">Kaedah Pembayaran <span class="text-red-500">*</span></label>
                               <select 
                                 v-model="product.penerimaBayaran.kaedahPembayaran"
                                 class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                               >
                                 <option value="">-- Sila Pilih --</option>
                                 <option value="EFT">EFT</option>
                                 <option value="CASH">CASH</option>
                                 <option value="CHEQUE">CHEQUE</option>
                               </select>
                             </div>
                             
                             <!-- Row 1: No Kad Pengenalan & Nama Penerima -->
                             <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                               <div>
                                 <label class="text-xs font-medium text-gray-600">No Kad Pengenalan/No Pendaftaran <span class="text-red-500">*</span></label>
                                 <input 
                                   v-model="product.penerimaBayaran.noKadPengenalan"
                                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="Masukkan no. kad pengenalan"
                                 />
                               </div>
                               <div>
                                 <label class="text-xs font-medium text-gray-600">Nama Penerima<span class="text-red-500">*</span></label>
                                 <input 
                                   v-model="product.penerimaBayaran.namaPenerima"
                                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="Masukkan nama penerima"
                                 />
                               </div>
                             </div>
                             
                             <!-- Row 2: Nama Pemegang Akaun & Bank -->
                             <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                               <div>
                                 <label class="text-xs font-medium text-gray-600">Nama Pemegang Akaun <span class="text-red-500">*</span></label>
                                 <input 
                                   v-model="product.penerimaBayaran.namaPemegangAkaun"
                                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="Masukkan nama pemegang akaun"
                                 />
                               </div>
                               <div>
                                 <label class="text-xs font-medium text-gray-600">Bank <span class="text-red-500">*</span></label>
                                 <input 
                                   v-model="product.penerimaBayaran.bank"
                                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="Masukkan nama bank"
                                 />
                               </div>
                             </div>
                             
                             <!-- Row 3: No. Akaun Bank (full width) -->
                             <div>
                               <label class="text-xs font-medium text-gray-600">No. Akaun Bank <span class="text-red-500">*</span></label>
                               <input 
                                 v-model="product.penerimaBayaran.noAkaunBank"
                                 class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 placeholder="Masukkan no. akaun bank"
                               />
                             </div>
                           </div>
                         </div>
                       </div>
  
                       <!-- Action Buttons -->
                       <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                         <div v-if="product.status === 'sedang_edit'" class="flex space-x-2">
                           <rs-button 
                             variant="success" 
                             size="sm"
                             @click="saveProduct(index)"
                           >
                             Simpan
                           </rs-button>
                           <rs-button 
                             variant="secondary" 
                             size="sm"
                             @click="cancelEdit"
                           >
                             Batal
                           </rs-button>
                         </div>
                         <div v-else class="flex space-x-2">
                           <rs-button 
                             variant="primary" 
                             size="sm"
                             @click="editProduct(index)"
                           >
                             Edit
                           </rs-button>
                           <button 
                             @click="removeProduct(index)"
                             class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                           >
                             <Icon name="ph:trash" class="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     </div>
  
                     <!-- Empty State -->
                     <div v-if="selectedEntitlementProducts.length === 0" class="col-span-full text-center py-8 text-gray-500">
                       <Icon name="ph:gift" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                       <p class="text-sm">Tiada entitlement product dipilih. Pilih checkbox di atas untuk menambah.</p>
                     </div>
                   </div>
                 </div>
               </template>
             </rs-card>
        </div>
  
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div class="col-span-1 space-y-6">
            <!-- Section 2: Dokumen Sokongan (Read-only) -->
            <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon
                        name="ph:folder-open"
                        class="w-6 h-6 text-green-600"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Dokumen Sokongan
                    </h2>
                    <p class="text-sm text-gray-500">
                      Dokumen yang dikemukakan oleh pemohon
                    </p>
                  </div>
                </div>
              </template>
  
              <template #body>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Dokumen
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="(dokumen, index) in dokumenSokongan"
                        :key="index"
                        class="hover:bg-gray-50"
                      >
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {{ dokumen.jenis }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <FormKit
                            type="select"
                            :options="statusDokumenOptions"
                            v-model="dokumen.status"
                            :classes="{
                              input: 'text-sm px-4 py-3 border-gray-300 rounded-md min-w-[120px]',
                            }"
                            outer-class="mb-0"
                            wrapper-class="mb-0"
                            inner-class="mb-0"
                          />
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        >
                          <div class="flex items-center space-x-2">
                            <rs-button
                              variant="primary"
                              @click="previewDocument(dokumen)"
                            >
                              <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                            </rs-button>
                            <rs-button
                              variant="success"
                              @click="downloadDocument(dokumen)"
                            >
                              <Icon name="ph:download" class="w-4 h-4 mr-1" />
                            </rs-button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="dokumenSokongan.length === 0">
                        <td
                          colspan="3"
                          class="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          Tiada dokumen dijumpai.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </rs-card>
  
            <!-- BQ, Laporan Gambar, Laporan Teknikal in Tabs -->
            <div v-if="visibleTabs.length" class="bg-white">
              <!-- Custom Tab Navigation -->
              <div class="flex border-b border-gray-200">
                <button
                  v-for="(tab, index) in visibleTabs"
                  :key="index"
                  @click="activeTab = tab.id"
                                :class="[
                  'px-6 py-3 text-lg font-medium transition-colors duration-200',
                  activeTab === tab.id
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-700 hover:text-gray-900'
                ]"
                >
                  {{ tab.title }}
                </button>
              </div>
  
              <!-- Tab Content -->
              <div class="tab-content">
                <!-- BQ Tab -->
                <div v-if="activeTab === 'bq' && isB1">
                <rs-card class="shadow-sm border-0 bg-white">
                  <template #header>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <div
                            class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                          >
                            <Icon
                              name="ph:file-text"
                              class="w-6 h-6 text-purple-600"
                            />
                          </div>
                        </div>
                        <div>
                          <h2 class="text-lg font-semibold text-gray-900">BQ</h2>
                          <p class="text-sm text-gray-500">
                            Bill of Quantity untuk kerja-kerja cadangan
                          </p>
                        </div>
                      </div>
                    </div>
                  </template>
  
                  <template #body>
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              No BQ
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Nama BQ
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Jumlah Keseluruhan
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="(bq, index) in bqList" :key="index">
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                              {{ bq.noBQ }}
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {{ bq.namaBQ }}
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {{ bq.jumlahBQ }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <rs-badge
                                :variant="getBQStatusVariant(bq.status)"
                                class="text-sm"
                              >
                                {{ bq.status }}
                              </rs-badge>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                            >
                              <rs-button variant="primary" @click="editBQ(bq)">
                                Edit
                              </rs-button>
                            </td>
                          </tr>
                          <tr v-if="bqList.length === 0">
                            <td
                              colspan="4"
                              class="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              Tiada BQ dijumpai. Klik butang "Tambah Baru" untuk
                              menambah BQ.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </template>
                </rs-card>
                </div>
  
                <!-- Laporan Gambar Tab -->
                <div v-if="activeTab === 'gambar'">
                <rs-card class="shadow-sm border-0 bg-white">
                  <template #header>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <div
                            class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                          >
                            <Icon
                              name="ph:image"
                              class="w-6 h-6 text-orange-600"
                            />
                          </div>
                        </div>
                        <div>
                          <h2 class="text-lg font-semibold text-gray-900">
                            Laporan Gambar
                          </h2>
                          <p class="text-sm text-gray-500">
                            Gambar lokasi dan dokumentasi kerja
                          </p>
                        </div>
                      </div>
                      <rs-button variant="primary" @click="openLaporanGambar">
                        <Icon name="ph:camera" class="w-4 h-4 mr-2" />
                        Laporan Gambar
                      </rs-button>
                    </div>
                  </template>
  
                  <template #body>
                    <div
                      v-if="gambarLokasi.length > 0"
                      class="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      <div
                        v-for="(gambar, index) in gambarLokasi"
                        :key="index"
                        class="bg-white rounded-lg border border-gray-200 overflow-hidden"
                      >
                        <div class="aspect-square overflow-hidden">
                          <img
                            :src="gambar.url"
                            :alt="gambar.catatan"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div class="p-3">
                          <p class="text-sm text-gray-700 font-medium">
                            {{ gambar.catatan }}
                          </p>
                          <p class="text-xs text-gray-500 mt-1">
                            {{ formatDateTime(gambar.masaUpload) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-500">
                      <Icon
                        name="ph:image"
                        class="w-12 h-12 mx-auto mb-2 text-gray-400"
                      />
                      <p>
                        Tiada gambar dimuat naik. Klik butang "Laporan Gambar"
                        untuk menambah gambar.
                      </p>
                    </div>
                  </template>
                </rs-card>
                </div>
  
                <!-- Laporan Teknikal Tab -->
                <div v-if="activeTab === 'teknikal'">
                <rs-card class="shadow-sm border-0 bg-white">
                  <template #header>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <div
                            class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"
                          >
                            <Icon
                              name="ph:file-doc"
                              class="w-6 h-6 text-teal-600"
                            />
                          </div>
                        </div>
                        <div>
                          <h2 class="text-lg font-semibold text-gray-900">
                            Laporan Teknikal
                          </h2>
                          <p class="text-sm text-gray-500">
                            Analisis teknikal dan cadangan kerja
                          </p>
                        </div>
                      </div>
                      <rs-button variant="primary" @click="openLaporanTeknikal">
                        <Icon name="ph:file-doc" class="w-4 h-4 mr-2" />
                        Laporan Teknikal
                      </rs-button>
                    </div>
                  </template>
  
                  <template #body>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-1">
                        <label class="text-sm font-medium text-gray-700"
                          >Latar Belakang</label
                        >
                        <div
                          class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                        >
                          <span class="text-sm text-gray-900 whitespace-pre-wrap">{{
                            laporanTeknikal.latarBelakang || "Belum diisi"
                          }}</span>
                        </div>
                      </div>
  
                      <div class="space-y-1">
                        <label class="text-sm font-medium text-gray-700 "
                          >Keperluan</label
                        >
                        <div
                          class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                        >
                          <span class="text-sm text-gray-900 whitespace-pre-wrap">{{
                            laporanTeknikal.keperluan || "Belum diisi"
                          }}</span>
                        </div>
                      </div>
  
                      <div class="space-y-1">
                        <label class="text-sm font-medium text-gray-700"
                          >Cadangan</label
                        >
                        <div
                          class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                        >
                          <span class="text-sm text-gray-900 whitespace-pre-wrap">{{
                            laporanTeknikal.cadangan || "Belum diisi"
                          }}</span>
                        </div>
                      </div>
  
                      <div class="space-y-1">
                        <label class="text-sm font-medium text-gray-700"
                          >Nilai Kerja Dicadangkan</label
                        >
                        <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                          <span class="text-sm font-medium text-gray-900 whitespace-pre-wrap">
                            RM
                            {{
                              laporanTeknikal.nilaiKerja?.toLocaleString() || "0"
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </rs-card>
                </div>
              </div>
            </div>
            
            <!-- NEW: Maklumat Penerima Manfaat (jika tanggungan)
            <rs-card v-if="false" class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Icon name="ph:users" class="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">Maklumat Penerima Manfaat <span class="text-gray-500 text-sm">(jika tanggungan)</span></h2>
                    <p class="text-sm text-gray-500">Pilih nama tanggungan untuk paparan maklumat</p>
                  </div>
                </div>
              </template>
  
              <template #body>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Nama</label>
                    <FormKit
                      type="select"
                      v-model="dependentSelection.nama"
                      :options="dependentNameOptions"
                      placeholder="-- Sila Pilih --"
                      searchable="true"
                      class="mt-1"
                    />
                  </div>
  
                  <div class="space-y-1" v-if="Boolean(dependentSelection.nama)">
                    <label class="text-sm font-medium text-gray-700">No. Kad Pengenalan</label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{ selectedDependent?.noKadPengenalan || '-' }}</span>
                    </div>
                  </div>
  
                  <div class="space-y-1" v-if="Boolean(dependentSelection.nama)">
                    <label class="text-sm font-medium text-gray-700">Hubungan</label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{ selectedDependent?.hubungan || '-' }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </rs-card> -->
  
            <!-- NEW: Maklumat Penerima Bayaran -->
            <rs-card v-if="!isB102 && !isB300 && !isB307" class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                      <Icon name="ph:hand-coins" class="w-6 h-6 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">Maklumat Penerima Bayaran</h2>
                    <p class="text-sm text-gray-500">Isi maklumat untuk pembayaran</p>
                  </div>
                </div>
              </template>
  
              <template #body>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-sm font-medium text-gray-700">Kaedah Pembayaran <span class="text-red-500">*</span></label>
                    <FormKit
                      type="select"
                      v-model="paymentInfo.kaedah"
                      :options="paymentMethodOptions"
                      placeholder="-- Sila Pilih --"
                      validation="required"
                      :classes="{ input: 'text-sm' }"
                    />
                  </div>
  
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">No Kad Pengenalan/No Pendaftaran <span class="text-red-500">*</span></label>
                    <FormKit type="text" v-model="paymentInfo.noId" validation="required" :classes="{ input: 'text-sm' }" />
                  </div>
  
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Nama Penerima/Institusi/Syarikat <span class="text-red-500">*</span></label>
                    <FormKit type="text" v-model="paymentInfo.namaPenerima" validation="required" :classes="{ input: 'text-sm' }" />
                  </div>
  
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Nama Pemegang Akaun <span class="text-red-500">*</span></label>
                    <FormKit type="text" v-model="paymentInfo.namaAkaun" validation="required" :classes="{ input: 'text-sm' }" />
                  </div>
  
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Bank <span class="text-red-500">*</span></label>
                    <FormKit type="text" v-model="paymentInfo.bank" validation="required" :classes="{ input: 'text-sm' }" />
                  </div>
  
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-sm font-medium text-gray-700">No. Akaun Bank <span class="text-red-500">*</span></label>
                    <FormKit type="text" v-model="paymentInfo.noAkaun" validation="required" :classes="{ input: 'text-sm' }" />
                  </div>
                </div>
              </template>
            </rs-card>
  
  
            
  
            <rs-card v-if="!isB300 && !isB307" class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon
                        name="ph:currency-circle-dollar"
                        class="w-6 h-6 text-emerald-600"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Maklumat Kadar Bantuan
                    </h2>
                    <p class="text-sm text-gray-500">
                      Nilai kadar bantuan yang dicadangkan
                    </p>
                  </div>
                </div>
              </template>
  
              <template #body>
                <div class="space-y-4">
                  <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div class="space-y-1"> -->
                      <!-- <label class="text-sm font-medium text-gray-700"
                        >Kadar Bantuan</label
                      > -->
                      <!-- <div class="space-y-1">
                        <label class="text-sm font-medium text-gray-700">Kadar Bantuan</label>
                        <input
                          type="number"
                          v-model="formData.jumlahBantuan"
                          class="mt-1 w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                          placeholder="Masukkan jumlah bantuan"
                        />
                        <span class="text-sm text-gray-500">(Diambil dari BQ)</span>
                      </div> -->
                      <!-- <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                         <span class="text-lg font-semibold text-gray-900">
                          RM {{ jumlahBantuan.toLocaleString() }}
                        </span> 
                        <input
                          type="number"
                          v-model="formData.jumlahBantuan"
                          class="mt-1 w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                          placeholder="Masukkan jumlah bantuan"
                        />
                        <span class="text-sm text-gray-500 ml-2"
                          >(Diambil dari BQ)</span
                        >
                      </div> -->
                    <!-- </div> -->
  
                    <!-- <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Tempoh/Kekerapan</label
                      >
                      <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <span class="text-lg font-semibold text-gray-900">
                          RM {{ jumlahBantuan.toLocaleString() }}
                        </span>
                        <span class="text-sm text-gray-500 ml-2"
                          >(Diambil dari BQ)</span>
                      </div>
                    </div> -->
  
                    <!-- <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700">Tempoh/Kekerapan</label>
                      <input
                      type="number"
                      v-model="formData.tempohKekerapan"
                      class="mt-1 w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Masukkan bilangan tempoh/kekerapan"
                      />
                    </div> -->
  
                  <!-- </div> -->
  
                  <!-- Tarikh Mula & Tarikh Tamat side by side -->
                  <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700">Tarikh Mula</label>
                      <input
                        type="date"
                        v-model="formData.tarikhMula"
                        class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
  
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700">Tarikh Tamat</label>
                      <input
                        type="date"
                        v-model="formData.tarikhTamat"
                        class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                  </div> -->
  
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Jumlah Keseluruhan Bantuan akan Diterima</label
                    >
                     <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <!-- <span class="text-lg font-semibold text-gray-900">
                        RM {{ jumlahBantuan.toLocaleString() }}
                      </span> -->
                      <span class="text-lg font-semibold text-gray-900">
                        RM {{ jumlahKeseluruhan.toLocaleString() }}  
                      </span>
                      <span class="text-sm text-gray-500 ml-2"
                        >(Diambil dari BQ)</span
                      >
                    </div>
  
                  </div>
                  
  
                  <!-- <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Catatan Pengesyoran</label
                    >
                    <div
                      class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[80px]"
                    >
                      <span class="text-sm text-gray-900">{{
                        catatanPengesyoran || "Diambil dari BQ"
                      }}</span>
                    </div>
                  </div> -->
  
                  <!-- Post-approval buttons (only shown after approval) -->
                  <div v-if="isApproved" class="space-y-2 pt-4 border-t">
                    <rs-button
                      variant="success-outline"
                      @click="viewArahanKerja"
                      class="w-full !py-2 text-sm"
                    >
                      <Icon name="ph:file-text" class="w-4 h-4 mr-2" />
                      Lihat Arahan Kerja
                    </rs-button>
  
                    <rs-button
                      variant="info-outline"
                      @click="urusPemantauan"
                      class="w-full !py-2 text-sm"
                    >
                      <Icon name="ph:monitor" class="w-4 h-4 mr-2" />
                      Urus Pemantauan
                    </rs-button>
                  </div>
                </div>
  
                
              </template>
            </rs-card>
  
          </div>
          <div class="col-span-1">
            <!-- Section 6: Catatan Lapangan (C/U/V) -->
            <!-- <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon name="ph:notebook" class="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Catatan Lapangan
                    </h2>
                    <p class="text-sm text-gray-500">
                      Nota dan dapatan semasa lawatan lapangan
                    </p>
                  </div>
                </div>
              </template>
  
              <template #body>
                <div class="space-y-4">
                  <FormKit
                    type="textarea"
                    label="Catatan Lapangan"
                    v-model="catatanLapangan.catatan"
                    rows="6"
                    placeholder="Masukkan catatan, dapatan dan pemerhatian semasa lawatan lapangan..."
                    :classes="{ input: 'text-sm' }"
                  />
  
                  <div class="text-xs text-gray-500">
                    <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                    Masa/Tarikh: {{ catatanLapangan.masaTarikh }}
                  </div>
                </div>
              </template>
            </rs-card> -->
  
            <!-- Laluan Process  -->
             
            <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon
                        name="iconamoon:check-circle-2-duotone"
                        class="w-6 h-6 text-yellow-600"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Prosedur Agihan
                    </h2>
                    <p class="text-sm text-gray-500">
                      Laluan Proses Permohonan
                    </p>
                  </div>
                </div>
              </template>
  
              
  
              <template #body>
                
                <div class="space-y-4">
                  <!-- Accordion: Laluan Proses Details -->
                  <div class="space-y-3">
                    <!-- Permohonan Accordion Item -->
                    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                        @click="accordionOpen.permohonan = !accordionOpen.permohonan"
                      >
                        <span class="font-medium text-gray-900">Permohonan</span>
                        <Icon
                          :name="accordionOpen.permohonan ? 'ic:round-expand-less' : 'ic:round-expand-more'"
                          class="w-6 h-6 text-gray-500"
                        />
                      </button>
                      <div v-show="accordionOpen.permohonan" class="px-4 pb-4 pt-1">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Permohonan Dibuat Oleh</label>
                            <p class="text-gray-900">{{ permohonanDetails.dibuatOleh }}</p>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Permohonan</label>
                            <p class="text-gray-900">{{ formatDateTime(permohonanDetails.tarikhPermohonan) }}</p>
                          </div>
                          <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Sebab Memohon Bantuan</label>
                            <p class="text-gray-900">{{ permohonanDetails.sebabMemohon }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
  
                    <!-- Siasatan Accordion Item -->
                    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                        @click="accordionOpen.siasatan = !accordionOpen.siasatan"
                      >
                        <span class="font-medium text-gray-900">Siasatan</span>
                        <Icon
                          :name="accordionOpen.siasatan ? 'ic:round-expand-less' : 'ic:round-expand-more'"
                          class="w-6 h-6 text-gray-500"
                        />
                      </button>
                      <div v-show="accordionOpen.siasatan" class="px-4 pb-4 pt-1">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Disiasat Oleh</label>
                            <p class="text-gray-900">{{ siasatanDetails.disiasatOleh }}</p>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Kaedah Siasatan</label>
                            <p class="text-gray-900">{{ siasatanDetails.kaedahSiasatan }}</p>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Status Siasatan</label>
                            <rs-badge :variant="getProcessStatusVariant(siasatanDetails.statusSiasatan)">
                              {{ siasatanDetails.statusSiasatan }}
                            </rs-badge>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Selesai Siasatan</label>
                            <p class="text-gray-900">{{ formatDateTime(siasatanDetails.tarikhSelesai) }}</p>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">SLA</label>
                            <p class="text-gray-900">{{ siasatanDetails.sla }}</p>
                          </div>
                          <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Catatan Siasatan</label>
                            <p class="text-gray-900">{{ siasatanDetails.catatan }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- <div class="text-xs text-gray-500">
                    <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                    Masa/Tarikh: {{ catatanLapangan.masaTarikh }}
                  </div> -->
                </div>
                
              </template>
              
            </rs-card>
  
            <!-- Section 7: Maklumat Bajet -->
            <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="ph:check-circle" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">Maklumat Bajet</h2>
                    <p class="text-sm text-gray-500">Semakan bajet bantuan</p>
                  </div>
                </div>
              </template>
  
              <template #body>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kod Bajet</label>
                    <input
                      type="text"
                      v-model="budgetInfo.kodBajet"
                      class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900"
                      readonly
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Bajet Semasa</label>
                    <input
                      type="text"
                      v-model="budgetInfo.jumlahBajetSemasa"
                      class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900"
                      readonly
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bajet Mencukupi</label>
                    <div class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 flex items-center">
                      <rs-badge 
                        v-if="budgetInfo.bajetMencukupi === 'Ya'" 
                        variant="success"
                        class="text-white font-semibold"
                      >
                        YA
                      </rs-badge>
                      <span v-else class="text-gray-900">{{ budgetInfo.bajetMencukupi }}</span>
                    </div>
                  </div>
                  
                  <div class="pt-2">
                    <rs-button variant="success" @click="checkBudget">
                      Semakan Bajet
                    </rs-button>
                  </div>
                </div>
              </template>
            </rs-card>
  
            <!-- Section 8: Maklumat Kelulusan -->
            <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">Maklumat Kelulusan</h2>
                    <p class="text-sm text-gray-500">Keputusan kelulusan bantuan</p>
                  </div>
                </div>
              </template>
  
              <template #body>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Keputusan Kelulusan</label>
                    <select
                      v-model="approvalInfo.keputusanKelulusan"
                      class="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih keputusan kelulusan</option>
                      <option value="lulus">Lulus</option>
                      <option value="tidak_lulus">Tidak Lulus</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Catatan
                      <span v-if="approvalInfo.keputusanKelulusan === 'tidak_lulus'" class="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      v-model="approvalInfo.catatan"
                      rows="4"
                      :class="[
                        'w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        approvalInfo.keputusanKelulusan === 'tidak_lulus' && !approvalInfo.catatan?.trim() 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300'
                      ]"
                      :placeholder="approvalInfo.keputusanKelulusan === 'tidak_lulus' ? 'Catatan diperlukan untuk keputusan Tidak Lulus' : 'Boleh mengisi catatan'"
                    ></textarea>
                    <p v-if="approvalInfo.keputusanKelulusan === 'tidak_lulus' && !approvalInfo.catatan?.trim()" class="text-red-500 text-xs mt-1">
                      Catatan diperlukan untuk keputusan Tidak Lulus
                    </p>
                  </div>
                </div>
              </template>
            </rs-card>
  
            <!-- Section 9: Status Lawatan -->
            <!-- <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon
                        name="ph:check-circle"
                        class="w-6 h-6 text-yellow-600"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Keputusan Siasatan
                    </h2>
                    <p class="text-sm text-gray-500">
                      Kemaskini status siasatan lapangan
                    </p>
                  </div>
                </div>
              </template>
  
              <template #body>
                <FormKit
                  type="select"
                  label="Status Sokongan"
                  :options="statusLawatanOptions"
                  v-model="formData.statusLawatan"
                  :classes="{ input: 'text-sm' }"
                />
                <div class="space-y-4">
                  <FormKit
                    type="textarea"
                    label="Catatan"
                    v-model="catatanLapangan.catatan"
                    rows="6"
                    placeholder="Masukkan catatan, dapatan dan pemerhatian semasa siasatan..."
                    :classes="{ input: 'text-sm' }"
                  />
  
                  <FormKit
                  type="select"
                  label="Status Proses"
                  :options="statusprosesOptions"
                  v-model="formData.statusproses"
                  :classes="{ input: 'text-sm' }"
                  />
  
                  <div class="text-xs text-gray-500">
                    <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                    Masa/Tarikh: {{ catatanLapangan.masaTarikh }}
                  </div>
                </div>
              </template>
              
            </rs-card> -->
  
            
  
            <!-- Section 9: Action Buttons -->
            <rs-card class="p-4">
              <div class="flex flex-col sm:flex-row gap-3 justify-end">
                <rs-button
                  variant="success"
                  @click="handleSimpan"
                  :disabled="processing"
                  :loading="processing && actionType === 'simpan'"
                >
                  Simpan
                </rs-button>
  
                <rs-button
                  variant="primary"
                  @click="handleSelesaiDanHantar"
                  :disabled="processing || !hasStatusSokongan || !hasValidApprovalDecision"
                  :loading="processing && actionType === 'complete_submit'"
                >
                  Hantar
                </rs-button>
  
                <rs-button
                  variant="danger"
                  @click="handleBatal"
                  :disabled="processing"
                  :loading="processing"
                >
                  Kembali
                </rs-button>
              </div>
              
              <!-- Validation Message -->
              <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">
                  Sila pastikan semua medan diperlukan telah diisi sebelum menghantar.
                </p>
              </div>
            </rs-card>
  
          </div>
        </div>
  
      </div>
  
      <!-- BQ Modal -->
      <rs-modal v-model="showBQModal" size="xl" :closable="false">
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ editingBQ ? "Edit" : "Tambah" }} BQ
          </h3>
        </template>
        <template #body>
          <!-- BQ form content will be added here -->
          <div class="text-center py-8 text-gray-500">
            <p>
              BQ Form content akan dibangunkan mengikut keperluan dalam
              REQUIREMENTS.md
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-3">
            <rs-button variant="primary-outline" @click="closeBQModal">
              Batal
            </rs-button>
            <rs-button variant="primary" @click="saveBQ"> Simpan </rs-button>
          </div>
        </template>
      </rs-modal>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted, computed, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useToast } from "vue-toastification";
  
  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const processing = ref(false);
  const actionType = ref("");
  
  // Special Approval Logic
  const isSpecialApproval = computed(() => route.query.specialApproval === 'true');
  const sourceModule = computed(() => route.query.source);
  
  definePageMeta({
    title: "Siasatan Lapangan",
  });
  
  const breadcrumb = ref([
    {
      name: "Tugasan",
      type: "link",
      path: "/BF-BTN/tugasan",
    },
    {
      name: "Kelulusan Siasatan",
      type: "current",
      path: `/BF-BTN/tugasan/bantuan/kelulusan/${route.params.id}`,
    },
    // {
    //   name: "Kemaskini Siasatan",
    //   type: "current",
    //   path: `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}`,
    // },
  ]);
  
  // Tab configuration
  const tabs = [
    { id: 'bq', title: 'BQ' },
    { id: 'gambar', title: 'Laporan Gambar' },
    { id: 'teknikal', title: 'Laporan Teknikal' }
  ];
  
  const activeTab = ref('bq');
  
  // Show/hide rules by bantuan id
  const isB1 = computed(() => String(route.params.id || '').toUpperCase().startsWith('B1'));
  const isB102 = computed(() => String(route.params.id || '').toUpperCase() === 'B102');
  const isB300 = computed(() => String(route.params.id || '').toUpperCase() === 'B300');
  const isB307 = computed(() => String(route.params.id || '').toUpperCase() === 'B307');
  const visibleTabs = computed(() => (isB1.value ? tabs : []));
  
  // Ensure active tab is valid when rules change
  watch(visibleTabs, (arr) => {
    if (!arr.find(t => t.id === activeTab.value)) {
      activeTab.value = arr[0]?.id || '';
    }
  }, { immediate: true });
  
  
  // Product Package options based on route id
  const productPackageOptions = computed(() => {
    const id = String(route.params.id || '').toUpperCase();
    
    if (id === 'B300') {
      return [
        { label: '-- Sila Pilih --', value: '' },
        { label: '(HQ) TUNTUTAN KEPERLUAN PENDIDIKAN (BIASISWA KECIL) (FAKIR)', value: 'TUNTUTAN_KEPERLUAN' },
        { label: '(HQ) TUNTUTAN PROGRAM (BIASISWA KECIL) (FAKIR)', value: 'TUNTUTAN_PROGRAM' },
        { label: '(HQ) WANG PERSEDIAAN SEKOLAH ASRAMA (FAKIR)', value: 'WANG_PERSEDIAAN' },
        { label: '(HQ) WANG SAKU SEKOLAH ASRAMA (FAKIR)', value: 'WANG_SAKU' },
        { label: '(HQ) YURAN SEKOLAH ASRAMA (FAKIR)', value: 'YURAN' }
        
      ];
    } else if (id === 'B307') {
      return [
        { label: '-- Sila Pilih --', value: '' },
        { label: '(HQ) Dermasiswa IPT Dalam Negara (Fakir) - IPTA/IPTS', value: 'DERMASISWA_IPT' },
        { label: '(HQ) KPIPT (FAKIR) - WANG PERSEDIAAN KEMASUKAN IPT', value: 'wangpersediaan_IPT' },
        { label: '(HQ) YURAN PENGAJIAN (FAKIR)', value: 'yuran_pengajian' }
      ];
    } else {
      // Default options for B102 and others
      return [
        { label: '-- Sila Pilih --', value: '' },
        { label: '(PEROLEHAN) BINA RUMAH (FAKIR)', value: 'PEROLEHAN' },
        { label: '(WO) 3 BILIK (FAKIR) - TANGGUNGAN 3-6 ORANG', value: 'WO' },
        { label: 'PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)', value: 'PEMANTAUAN1' },
        { label: 'PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)', value: 'PEMANTAUAN2' }
      ];
    }
  });
  
  // Entitlement Product options based on route id
  const entitlementProductOptions = computed(() => {
    const id = String(route.params.id || '').toUpperCase();
    
    if (id === 'B300') {
      return [
        '-- Sila Pilih --',
        '(HQ) TUNTUTAN KEPERLUAN PENDIDIKAN (BIASISWA KECIL) (FAKIR)',
        '(HQ) TUNTUTAN PROGRAM (BIASISWA KECIL) (FAKIR)',
        '(HQ) WANG PERSEDIAAN SEKOLAH ASRAMA (FAKIR)',
        '(HQ) WANG SAKU SEKOLAH ASRAMA (FAKIR)',
        '(HQ) YURAN SEKOLAH ASRAMA (FAKIR)'
      ];
    } else if (id === 'B307') {
      return [
        '-- Sila Pilih --',
        '(HQ) Dermasiswa IPT Dalam Negara (Fakir) - IPTA/IPTS'
      ];
    } else {
      // Default options for B102 and others
      return [
        '-- Sila Pilih --',
        '(PEROLEHAN) BINA RUMAH (FAKIR)',
        '(WO) 3 BILIK (FAKIR) - TANGGUNGAN 3-6 ORANG',
        '(PEROLEHAN) PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)',
        '(WO) PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)'
      ];
    }
  });
  
  // B300 Entitlement Product options for checkboxes
  const b300EntitlementOptions = ref([
    { label: '(HQ) TUNTUTAN KEPERLUAN PENDIDIKAN (BIASISWA KECIL) (FAKIR)', value: 'TUNTUTAN_KEPERLUAN' },
    { label: '(HQ) TUNTUTAN PROGRAM (BIASISWA KECIL) (FAKIR)', value: 'TUNTUTAN_PROGRAM' },
    { label: '(HQ) WANG PERSEDIAAN SEKOLAH ASRAMA (FAKIR)', value: 'wang_persediaan_sekolah_asrama' },
    { label: '(HQ) WANG SAKU SEKOLAH ASRAMA (FAKIR)', value: 'wang_saku_sekolah_asrama' },
    { label: '(HQ) YURAN SEKOLAH ASRAMA (FAKIR)', value: 'yuran_sekolah_asrama' }
  ]);
  
  // B307 Entitlement Product options for checkboxes
  const b307EntitlementOptions = ref([
    { label: '(HQ) Dermasiswa IPT Dalam Negara (Fakir) - IPTA/IPTS', value: 'DERMASISWA_IPT' },
    { label: '(HQ) KPIPT (FAKIR) - WANG PERSEDIAAN KEMASUKAN IPT', value: 'wangpersediaan_IPT' },
    { label: '(HQ) YURAN PENGAJIAN (FAKIR)', value: 'yuran_pengajian' }  
  ]);
  
  // Editing state
  const editingProductIndex = ref(-1);
  
  // Check if current ID is B300 or B307
  const isB300OrB307 = computed(() => {
    const id = String(route.params.id || '').toUpperCase();
    return id === 'B300' || id === 'B307';
  });
  
  // Get the appropriate entitlement options based on route ID
  const currentEntitlementOptions = computed(() => {
    const id = String(route.params.id || '').toUpperCase();
    if (id === 'B300') {
      return b300EntitlementOptions.value;
    } else if (id === 'B307') {
      return b307EntitlementOptions.value;
    }
    return [];
  });
  
  // Reactive data for entitlement products
  const entitlementProductsData = ref([
    // B300 Cards
    {
      code: 'wang_persediaan_sekolah_asrama',
      penerimaBayaran: {
        kategoriPenerima: 'asnaf',
        noPendaftaran: '',
        kaedahPembayaran: 'EFT',
        noKadPengenalan: '880701121234',
        namaPenerima: 'Siti binti Amin',
        namaPemegangAkaun: 'Siti binti Amin',
        bank: 'MAYBANK',
        noAkaunBank: '1234567890'
      },
      kadarBantuan: {
        kadarBantuan: 300,
        tempohKekerapan: 1,
        tarikhMula: '2025-01-01',
        tarikhTamat: '2025-01-31',
        jumlahKeseluruhan: 'RM 300.00'
      }
    },
    {
      code: 'wang_saku_sekolah_asrama',
      penerimaBayaran: {
        kategoriPenerima: 'asnaf',
        noPendaftaran: '',
        kaedahPembayaran: 'EFT',
        noKadPengenalan: '880701121234',
        namaPenerima: 'Siti binti Amin',
        namaPemegangAkaun: 'Siti binti Amin',
        bank: 'MAYBANK',
        noAkaunBank: '1234567890'
      },
      kadarBantuan: {
        kadarBantuan: 80,
        tempohKekerapan: 11,
        tarikhMula: '2025-01-01',
        tarikhTamat: '2025-11-30',
        jumlahKeseluruhan: 'RM 880.00'
      }
    },
    {
      code: 'yuran_sekolah_asrama',
      penerimaBayaran: {
        kategoriPenerima: 'organisasi',
        noPendaftaran: 'ABA1234',
        kaedahPembayaran: 'EFT',
        noKadPengenalan: 'ABA1234',
        namaPenerima: 'SM Sains Kuala Selangor',
        namaPemegangAkaun: 'SM Sains Kuala Selangor',
        bank: 'MAYBANK',
        noAkaunBank: '1234567890'
      },
      kadarBantuan: {
        kadarBantuan: 2000,
        tempohKekerapan: 1,
        tarikhMula: '2025-01-01',
        tarikhTamat: '2025-01-31',
        jumlahKeseluruhan: 'RM 2,000.00'
      }
    },
    // B307 Cards
    {
      code: 'DERMASISWA_IPT',
      penerimaBayaran: {
        kategoriPenerima: 'asnaf',
        noPendaftaran: '',
        kaedahPembayaran: 'EFT',
        noKadPengenalan: '880701121234',
        namaPenerima: 'Ali bin Amin',
        namaPemegangAkaun: 'Ali bin Amin',
        bank: 'MAYBANK',
        noAkaunBank: '1234567890'
      },
      kadarBantuan: {
        kadarBantuan: 600,
        tempohKekerapan: 36,
        tarikhMula: '2025-01-01',
        tarikhTamat: '2028-01-31',
        jumlahKeseluruhan: 'RM 21,600.00'
      }
    },
    {
      code: 'wangpersediaan_IPT',
      penerimaBayaran: {
        kategoriPenerima: 'asnaf',
        noPendaftaran: '',
        kaedahPembayaran: 'EFT',
        noKadPengenalan: '880701121234',
        namaPenerima: 'Ali bin Amin',
        namaPemegangAkaun: 'Ali bin Amin',
        bank: 'MAYBANK',
        noAkaunBank: '1234567890'
      },
      kadarBantuan: {
        kadarBantuan: 1000,
        tempohKekerapan: 1,
        tarikhMula: '2025-01-01',
        tarikhTamat: '2025-01-31',
        jumlahKeseluruhan: 'RM 1,000.00'
      }
    },
    {
      code: 'yuran_pengajian',
      penerimaBayaran: {
        kategoriPenerima: 'organisasi',
        noPendaftaran: 'UPM3344',
        kaedahPembayaran: 'EFT',
        noKadPengenalan: 'UPM3344',
        namaPenerima: 'Universiti Putra Malaysia',
        namaPemegangAkaun: 'Universiti Putra Malaysia',
        bank: 'MAYBANK',
        noAkaunBank: '1234567890'
      },
      kadarBantuan: {
        kadarBantuan: 0,
        tempohKekerapan: 0,
        tarikhMula: '',
        tarikhTamat: '',
        jumlahKeseluruhan: 'RM 30,000.00'
      }
    }
  ]);
  
  // Selected Entitlement Products (computed from checkbox selections)
  const selectedEntitlementProducts = computed(() => {
    if (!isB300OrB307.value) return [];
    
    return formData.value.entitlementProducts.map((value, index) => {
      const option = currentEntitlementOptions.value.find(opt => opt.value === value);
      const name = option ? option.label.replace('(HQ) ', '').replace(' (FAKIR)', '') : value;
      
      // Check if we already have data for this product
      let productData = entitlementProductsData.value.find(p => p.code === value);
      if (!productData) {
        productData = {
          code: value,
          penerimaBayaran: {
            kategoriPenerima: '',
            noPendaftaran: '',
            kaedahPembayaran: 'EFT',
            noKadPengenalan: '',
            namaPenerima: '',
            namaPemegangAkaun: '',
            bank: '',
            noAkaunBank: ''
          },
          kadarBantuan: {
            kadarBantuan: 0,
            tempohKekerapan: 1,
            tarikhMula: '',
            tarikhTamat: '',
            jumlahKeseluruhan: 'RM 0.00'
          }
        };
        entitlementProductsData.value.push(productData);
      }
      
      return {
        name: name,
        code: value,
        category: 'Pendidikan',
        status: index === editingProductIndex.value ? 'sedang_edit' : 'lengkap',
        penerimaBayaran: productData.penerimaBayaran,
        kadarBantuan: productData.kadarBantuan
      };
    });
  });
  
  
  // Mock data for different assistance types
  const mockAssistanceData = {
    "B102": {
      id: "B102",
      aid: "B102 - BANTUAN BINAAN RUMAH (Fakir)",
      aidproduct: "Bantuan Binaan Rumah (Fakir)",
      productpackage: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
      entitlementproduct: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
      jumlahBantuan: 43000,
      tempohKekerapan: 1,
      statusLawatan: "Sokong",
      statusproses: "selesai",
      // Special approval flags (when coming from KH module)
      segera: false,
      kelulusankhas: false,
      sebabSegera: "",
      situasikelulusankhas: "",
    },
    "B300": {
      id: "B300",
      aid: "B300 - (HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)",
      aidproduct: "Bantuan Dermasiswa Sekolah Asrama (Fakir)",
      productpackage: "Sekolah Asrama - Tingkatan 1-5",
      entitlementproduct: "Dermasiswa Bulanan - RM 200",
      jumlahBantuan: 2400,
      statusLawatan: "Sokong",
      statusproses: "selesai",
      // Special approval flags (when coming from KH module)
      segera: false,
      kelulusankhas: false,
      sebabSegera: "",
      situasikelulusankhas: "",
    },
    "B307": {
      id: "B307",
      aid: "B307 - (HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS",
      aidproduct: "Dermasiswa IPT Dalam Negara (Fakir)",
      productpackage: "IPTA/IPTS - Diploma/Degree",
      entitlementproduct: "Dermasiswa Semester - RM 1500",
      jumlahBantuan: 3000,
      statusLawatan: "Sokong",
      statusproses: "selesai",
      // Special approval flags (when coming from KH module)
      segera: false,
      kelulusankhas: false,
      sebabSegera: "",
      situasikelulusankhas: "",
    }
  };
  
  // Section 1: Maklumat Pemohon data
  const formData = ref({
    id: "",
    aid: "",
    aidproduct: "",
    productpackage: "",
    entitlementproduct: "",
    entitlementProducts: [], // For B300 checkbox selections
    jumlahBantuan: 0,
  });
  
  // Section 2: Dokumen Sokongan
  const dokumenSokongan = ref([]);
  
  // Initialize dokumen sokongan based on route ID
  const initializeDokumenSokongan = () => {
    const id = String(route.params.id || '').toUpperCase();
    
    if (id === 'B300') {
      dokumenSokongan.value = [
        {
          jenis: "Surat tawaran belajar daripada pihak sekolah/surat pengesahan belajar",
          filename: "surat_tawaran_belajar_sekolah.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "Salinan akaun bank pelajar yang mengandungi: Nama bank, Nama dan no akaun bank",
          filename: "salinan_akaun_bank_pelajar.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "Salinan kad pengenalan ketua keluarga/ penjaga",
          filename: "salinan_kad_pengenalan_ketua_keluarga.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "Salinan kad pengenalan/surat beranak pelajar",
          filename: "salinan_kad_pengenalan_pelajar.pdf",
          url: "#",
          status: "lengkap",
        },
      ];
    } else if (id === 'B307') {
      dokumenSokongan.value = [
        {
          jenis: "SURAT TAWARAN BELAJAR IPT",
          filename: "surat_tawaran_belajar_ipt.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "STRUKTUR YURAN PENGAJIAN",
          filename: "struktur_yuran_pengajian.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "KEPUTUSAN SPM BAGI PERINGKAT DIPLOMA",
          filename: "keputusan_spm_diploma.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "SALINAN MAKLUMAT AKAUN BANK",
          filename: "salinan_maklumat_akaun_bank.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "SIJIL BERHENTI SEKOLAH BAGI PERMOHONAN 17 TAHUN DAN KE BAWAH",
          filename: "sijil_berhenti_sekolah.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "SURAT PENGESAHAN BELAJAR DAN STATUS TAJAAN YANG DIKELUARKAN OLEH IPT",
          filename: "surat_pengesahan_belajar_ipt.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "SURAT KELULUSAN TAJAAN DERMASISWA DARIPADA LZS",
          filename: "surat_kelulusan_tajaan_lzs.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "INVOIS YURAN RASMI DARIPADA IPT",
          filename: "invois_yuran_rasmi_ipt.pdf",
          url: "#",
          status: "lengkap",
        },
      ];
    } else {
      // Default B102 documents
      dokumenSokongan.value = [
        {
          jenis: "Geran Tanah",
          filename: "geran_tanah.pdf",
          url: "#",
          status: "lengkap",
        },
        {
          jenis: "Carian Rasmi Pejabat Tanah",
          filename: "carian_rasmi.pdf",
          url: "#",
          status: "lengkap",
        },
      ];
    }
  };
  
  // Accordion state and mock details
  const accordionOpen = reactive({
    permohonan: false,
    siasatan: false,
  })
  
  const permohonanDetails = ref({
    dibuatOleh: 'Ahmad bin Abdullah',
    tarikhPermohonan: '2024-01-01 09:00:00',
    sebabMemohon: 'Pemohon telah menceritakan masalah mengenai keadaan rumahnya yang semakin uzur akibat dimakan anai-anai dan keadaan bumbung yang bocor. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan bantuan bina baru rumah'
  })
  
  const siasatanDetails = ref({
    disiasatOleh: 'Siti binti Ali',
    kaedahSiasatan: 'Semak Dokumen Sahaja',
    statusSiasatan: 'Sokong',
    tarikhSelesai: '2024-01-03 17:30:00',
    catatan: 'Siasatan telah dilakukan dan dokumen disahkan.',
    sla: '3 hari bekerja'
  })
  
  // Section 3: Draf BQ
  const bqList = ref([
    {
      noBQ: "BQ202508647",
      namaBQ: "BQ MOHD ROSLI BIN SAAD",
      jumlahBQ: "RM43,000",
      status: "Dalam Proses",
    },
    // {
    //   noBQ: "BQ202508648",
    //   namaBQ: "BQ SITI BINTI HASSAN - DERMASISWA SEKOLAH",
    //   jumlahBQ: "RM2,400",
    //   status: "Dalam Proses",
    // },
    // {
    //   noBQ: "BQ202508649",
    //   namaBQ: "BQ SITI BINTI HASSAN - DERMASISWA IPT",
    //   jumlahBQ: "RM3,000",
    //   status: "Dalam Proses",
    // },
  ]);
  
  const showBQModal = ref(false);
  const editingBQ = ref(null);
  
  // Section 4: Laporan Gambar
  const gambarLokasi = ref([
    {
      url: "https://scontent.fkul10-1.fna.fbcdn.net/v/t1.6435-9/33382272_977231325777776_3291633360509599744_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=tsi5WpsPCREQ7kNvwEe3GJk&_nc_oc=Adl4_F7yjD2xX6siXLa_NANICn4Cak1Wmni5VBa7XhbSYIByOReFS3wwQc7n0JHnBqz05IBIajWiWh8LE9coTq0L&_nc_zt=23&_nc_ht=scontent.fkul10-1.fna&_nc_gid=4p3_JCn3HWweiLZBezB58w&oh=00_AfZFYLhw-KRbw3goXGgJkj7ewaf54KBCnG0_XXcl4y3TWQ&oe=68E1A4D7",
      catatan: "Keadaan dinding papan rumah",
      masaUpload: new Date().toISOString(),
    },
    {
      url: "https://scontent.fkul15-1.fna.fbcdn.net/v/t39.30808-6/309943384_196941696025849_726196766864978484_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=IyNAhW7CUkgQ7kNvwHTA3nK&_nc_oc=AdmN3PYsmtpYr9gnvcQLzYd-zejr8nOaNfL2SkYiGIJsfKhvEWLi_gLtezJSzXrXrSpit_KvkUj1zjOCHOKl8Y4n&_nc_zt=23&_nc_ht=scontent.fkul15-1.fna&_nc_gid=aY79tE8vuTPag6wRgWP07g&oh=00_AfZvZmX3DPqOBnADSlF0Occy0BA6qGPavBKb7ME7Qre1eQ&oe=68C01482",
      catatan: "Pandangan depan rumah",
      masaUpload: new Date().toISOString(),
    },
  ]);
  
  // Section 5: Laporan Teknikal
  const laporanTeknikal = ref({
    latarBelakang: "",
    keperluan: "",
    cadangan: "",
    nilaiKerja: 0,
  });
  
  // Section 6: Catatan Lapangan
  const catatanLapangan = ref({
    catatan: "",
    masaTarikh: new Date().toLocaleString("ms-MY"),
  });
  
  // Section 8: Jumlah Bantuan & Catatan Pengesyoran
  const jumlahBantuan = ref(25000);
  const catatanPengesyoran = ref("");
  const isApproved = ref(false); // This will be true after approval
  
  // Dropdown options
  const statusLawatanOptions = ref([
    { label: "--Sila Pilih--", value: "sila_pilih" },
    { label: "Sokong", value: "sokong" },
    { label: "Tidak Sokong", value: "tidak_sokong" },
  ]);
  
  // Dropdown options
  const statusprosesOptions = ref([
    { label: "--Sila Pilih--", value: "belum_selesai" },
    { label: "Selesai Diproses", value: "selesai" },
    { label: "KIV", value: "kiv" },
  ]);
  
  const statusDokumenOptions = ref([
    { label: "Lengkap", value: "lengkap" },
    { label: "Tidak Lengkap", value: "tidak_lengkap" },
    { label: "Tiada Keperluan", value: "tiada_keperluan" },
  ]);
  
  // NEW: Maklumat Penerima Manfaat (jika tanggungan)
  const dependentSelection = ref({
    nama: "",
  });
  
  const dependentNameOptions = ref([
    { label: "-- Sila Pilih --", value: "" },
    { label: "Ali Bin Amin", value: "ALI" },
    { label: "Siti Binti Amin", value: "SITI" },
  ]);
  
  const dependentsDirectory = {
    ALI: { noKadPengenalan: "010101-01-0101", hubungan: "Anak" },
    SITI: { noKadPengenalan: "020202-02-0202", hubungan: "Anak" },
  };
  
  const selectedDependent = computed(() => dependentsDirectory[dependentSelection.value.nama] || null);
  
  // NEW: Maklumat Penerima Bayaran
  const paymentInfo = ref({
    kaedah: "",
    noId: "",
    namaPenerima: "",
    namaAkaun: "",
    bank: "",
    noAkaun: "",
  });
  
  // NEW: Maklumat Bajet
  const budgetInfo = ref({
    kodBajet: "A-200400-1000-1-P-1-B102",
    jumlahBajetSemasa: "0.00",
    bajetMencukupi: "",
  });
  
  // NEW: Maklumat Kelulusan
  const approvalInfo = ref({
    keputusanKelulusan: "",
    catatan: "",
  });
  
  const paymentMethodOptions = ref([
    { label: "-- Sila Pilih --", value: "" },
    { label: "EFT", value: "EFT" },
    { label: "Vcash", value: "VCASH" },
    { label: "Cheque", value: "CHEQUE" },
    { label: "TT", value: "TT" },
    { label: "eWallet", value: "EWALLET" },
    { label: "Tunai", value: "TUNAI" },
    { label: "Tunai (Kaunter Ekspres)", value: "TUNAI_KAUNTER" },
    { label: "Tunai (Lapangan)", value: "TUNAI_LAPANGAN" },
  ]);
  
  // NEW: Keputusan Siasatan
  const investigationDecision = ref({
    status: "",
    catatan: "",
    itemBantuan: "",
  });
  
  const supportDateTime = computed(() => new Date().toLocaleString("ms-MY"));
  
  // NEW: Education info (read-only) for B300/B307
  const educationByAid = {
    B300: {
      tablefor: "(HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)",
      fields: {
        "Jenis Sekolah/Institusi": "Peringkat Tinggi",
        "Kategori Sekolah/Institusi": "SBP",
        "Tahun Bersekolah": "2025",
        "Tahun/Tingkatan/Tahun Pengajian/Semester": "Tingkatan 4",
        "Nama Sekolah/ Institusi": "Sekolah Menengah Sains Kuala Selangor",
        "Tempat Tinggal Semasa Belajar": "Tidak Tinggal Bersama Keluarga",
        "Maklumat Asrama/Rumah Sewa": "Asrama Puteri",
        "Pembiayaan Pengajian": "Tiada",
        "Catatan": "Masih Bersekolah di Tingkatan 4",
      },
    },
    B307: {
      tablefor: "(HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS",
      fields: {
        "Jenis Sekolah/Institusi": "Peringkat Tinggi",
        "Kategori Sekolah/Institusi": "IPT",
        "Tarikh Mula Pengajian": "1/1/2025",
        "Tarikh Tamat Pengajian": "6/1/2028",
        "Tempoh Pengajian": "7 Semester",
        "Tahun Bersekolah": "2025",
        "Tahun/Tingkatan/Tahun Pengajian/Semester": "Semester 1",
        "Nama Sekolah/ Institusi": "UPM",
        "Bidang/Kursus Pengajian": "Ijazah Sarjana Muda:Ijazah Sarjana Muda Sains Komputer",
        "Jurusan/Bidang": "-",
        "Pembiayaan Pengajian": "Tiada",
        "Catatan": "",
        "Tinggal Bersama Keluarga Semasa Belajar": "Tidak",
        "Maklumat Asrama/Rumah Sewa": "Kolej Melati",
      },
    },
  };
  
  const educationInfo = computed(() => {
    const id = String(route.params.id || '').toUpperCase();
    return educationByAid[id] || null;
  });
  
  // NEW: Editable semesters/tahap table state
  const educationSemesters = ref([
    { semester: 1, bulanMula: 'Jan-25', bulanTamat: 'Jun-25', jenis: 'Semester Panjang', gpa: '', cgpa: '', yuran: 1500 },
    { semester: 2, bulanMula: 'Aug-25', bulanTamat: 'Dec-25', jenis: 'Semester Pendek', gpa: '', cgpa: '', yuran: 1200 },
  ]);
  
  const addSemesterRow = () => {
    const next = (educationSemesters.value.at(-1)?.semester || 0) + 1;
    educationSemesters.value.push({ semester: next, bulanMula: '', bulanTamat: '', jenis: '', gpa: '', cgpa: '', yuran: 0 });
  };
  
  const removeSemesterRow = (index) => {
    if (index >= 0 && index < educationSemesters.value.length) {
      educationSemesters.value.splice(index, 1);
      normalizeSemesterNumbers();
    }
  };
  
  const normalizeSemesterNumbers = () => {
    educationSemesters.value
      .sort((a, b) => (a.semester || 0) - (b.semester || 0))
      .forEach((row, idx) => { row.semester = idx + 1; });
  };
  
  const jumlahKeseluruhan = computed(() => {
    const kadar = parseFloat(formData.value.jumlahBantuan) || 0
    const tempoh = parseInt(formData.value.tempohKekerapan) || 0
    return kadar * tempoh
  })
  
  // Check if a valid approval decision has been made
  const hasValidApprovalDecision = computed(() => {
    if (approvalInfo.value.keputusanKelulusan === 'lulus') {
      return true;
    } else if (approvalInfo.value.keputusanKelulusan === 'tidak_lulus') {
      // For "Tidak Lulus", catatan is required
      return approvalInfo.value.catatan && approvalInfo.value.catatan.trim() !== '';
    }
    return false;
  });
  
  // Check if both status sokongan and status proses have valid data
  const hasStatusSokongan = computed(() => {
    const hasValidStatusSokongan = formData.value.statusLawatan && 
                                   formData.value.statusLawatan !== "sila_pilih" && 
                                   formData.value.statusLawatan !== "";
    
    const hasValidStatusProses = formData.value.statusproses && 
                                 formData.value.statusproses === "selesai";
    
    return hasValidStatusSokongan && hasValidStatusProses;
  })
  
  // Methods
  const getStatusVariant = (status) => {
    const variants = {
      baru: "info",
      dalam_semakan: "warning",
      tidak_lengkap: "danger",
      lengkap: "success",
      menunggu_siasatan: "warning",
      lawatan_dijadualkan: "info",
      selesai_lawatan: "success",
    };
    return variants[status?.toLowerCase()] || "default";
  };
  
  const getStatusText = (status) => {
    const statusMap = {
      baru: "Baru",
      dalam_semakan: "Dalam Semakan",
      tidak_lengkap: "Tidak Lengkap",
      lengkap: "Lengkap",
      menunggu_siasatan: "Menunggu Siasatan Lapangan",
      lawatan_dijadualkan: "Lawatan Dijadualkan",
      selesai_lawatan: "Selesai Lawatan Lapangan",
    };
    return statusMap[status?.toLowerCase()] || status;
  };
  
  const getBQStatusVariant = (status) => {
    const variants = {
      "Dalam Kelulusan": "warning",
      "Dalam Proses": "info",
      Selesai: "success",
      Ditolak: "danger",
    };
    return variants[status] || "default";
  };
  
  const getProcessStatusVariant = (status) => {
    const variants = {
      'Permohonan': 'info',
      'Semak': 'warning',
      'Sokong': 'primary',
      'Lulus': 'success'
    }
    return variants[status] || 'primary'
  }
  
  // Entitlement Product management methods
  const getProductStatusVariant = (status) => {
    const variants = {
      'lengkap': 'success',
      'sedang_edit': 'primary',
      'baru': 'info'
    }
    return variants[status] || 'default'
  }
  
  const getProductStatusText = (status) => {
    const statusMap = {
      'lengkap': 'Lengkap',
      'sedang_edit': 'Sedang Edit',
      'baru': 'Baru'
    }
    return statusMap[status] || status
  }
  
  const editProduct = (index) => {
    editingProductIndex.value = index;
    toast.info(`Mengedit product: ${selectedEntitlementProducts.value[index].name}`);
  }
  
  const saveProduct = (index) => {
    editingProductIndex.value = -1;
    toast.success('Product telah disimpan');
  }
  
  const cancelEdit = () => {
    editingProductIndex.value = -1;
    toast.info('Edit dibatalkan');
  }
  
  // Calculate total amount for a specific product
  const calculateTotalAmount = (productIndex) => {
    const product = selectedEntitlementProducts.value[productIndex];
    if (product && product.kadarBantuan) {
      const kadar = parseFloat(product.kadarBantuan.kadarBantuan) || 0;
      const tempoh = parseFloat(product.kadarBantuan.tempohKekerapan) || 0;
      const total = kadar * tempoh;
      
      // Update the reactive data
      const productData = entitlementProductsData.value.find(p => p.code === product.code);
      if (productData) {
        productData.kadarBantuan.jumlahKeseluruhan = `RM ${total.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;
      }
    }
  }
  
  // Load penerima data based on category selection
  const loadPenerimaData = (productIndex) => {
    const product = selectedEntitlementProducts.value[productIndex];
    const productData = entitlementProductsData.value.find(p => p.code === product.code);
    
    if (productData && productData.penerimaBayaran) {
      const kategori = productData.penerimaBayaran.kategoriPenerima;
      
      if (kategori === 'asnaf') {
        // Asnaf data
        productData.penerimaBayaran.kaedahPembayaran = 'EFT';
        productData.penerimaBayaran.noKadPengenalan = '010101-01-0101';
        productData.penerimaBayaran.namaPenerima = 'Siti Binti Amin';
        productData.penerimaBayaran.namaPemegangAkaun = 'Siti Binti Amin';
        productData.penerimaBayaran.noPendaftaran = '';
        productData.penerimaBayaran.bank = 'MAYBANK';
        productData.penerimaBayaran.noAkaunBank = '1234567890';
      } else if (kategori === 'organisasi' || kategori === 'third_party') {
        // Reset for organisasi/third party
        productData.penerimaBayaran.kaedahPembayaran = 'EFT';
        productData.penerimaBayaran.noKadPengenalan = '';
        productData.penerimaBayaran.namaPenerima = '';
        productData.penerimaBayaran.namaPemegangAkaun = '';
        productData.penerimaBayaran.noPendaftaran = '';
      }
    }
  }
  
  // Load penerima data based on registration number selection
  const loadPenerimaByRegistration = (productIndex) => {
    const product = selectedEntitlementProducts.value[productIndex];
    const productData = entitlementProductsData.value.find(p => p.code === product.code);
    
    if (productData && productData.penerimaBayaran) {
      const noPendaftaran = productData.penerimaBayaran.noPendaftaran;
      
      // Registration data mapping
      const registrationData = {
        'ABA1234': {
          namaPenerima: 'SM Sains Kuala Selangor',
          namaPemegangAkaun: 'SM Sains Kuala Selangor',
          bank: 'MAYBANK',
          noAkaunBank: '1234567890'
        },
        'WBA5678': {
          namaPenerima: 'SM Sains Hulu Selangor',
          namaPemegangAkaun: 'SM Sains Hulu Selangor'
        },
        'CBA9012': {
          namaPenerima: 'Sekolah Seri Puteri, Cyberjaya',
          namaPemegangAkaun: 'Sekolah Seri Puteri, Cyberjaya'
        },
        'DGA3456': {
          namaPenerima: 'Kolej Islam Sultan Alam Shah (KISAS)',
          namaPemegangAkaun: 'Kolej Islam Sultan Alam Shah (KISAS)'
        },
        'EHA7890': {
          namaPenerima: 'SBP Integrasi Gombak',
          namaPemegangAkaun: 'SBP Integrasi Gombak'
        },
        'UMA1122': {
          namaPenerima: 'Universiti Malaya (UM)',
          namaPemegangAkaun: 'Universiti Malaya (UM)',
          bank: 'MAYBANK',
          noAkaunBank: '1234567890'
        },
        'UPM3344': {
          namaPenerima: 'Universiti Putra Malaysia (UPM)',
          namaPemegangAkaun: 'Universiti Putra Malaysia (UPM)',
          bank: 'MAYBANK',
          noAkaunBank: '1234567890'
        },
        'UKM5566': {
          namaPenerima: 'Universiti Kebangsaan Malaysia (UKM)',
          namaPemegangAkaun: 'Universiti Kebangsaan Malaysia (UKM)',
          bank: 'MAYBANK',
          noAkaunBank: '1234567890'
        },
        'UITM7788': {
          namaPenerima: 'Universiti Teknologi MARA (UiTM)',
          namaPemegangAkaun: 'Universiti Teknologi MARA (UiTM)',
          bank: 'MAYBANK',
          noAkaunBank: '1234567890'
        },
        'USM9900': {
          namaPenerima: 'Universiti Sains Malaysia (USM)',
          namaPemegangAkaun: 'Universiti Sains Malaysia (USM)',
          bank: 'MAYBANK',
          noAkaunBank: '1234567890'
        }
      };
      
      if (registrationData[noPendaftaran]) {
        productData.penerimaBayaran.namaPenerima = registrationData[noPendaftaran].namaPenerima;
        productData.penerimaBayaran.namaPemegangAkaun = registrationData[noPendaftaran].namaPemegangAkaun;
        productData.penerimaBayaran.noKadPengenalan = noPendaftaran;
        productData.penerimaBayaran.bank = registrationData[noPendaftaran].bank;
        productData.penerimaBayaran.noAkaunBank = registrationData[noPendaftaran].noAkaunBank;
      }
    }
  }
  
  const removeProduct = (index) => {
    if (confirm('Adakah anda pasti mahu memadam entitlement product ini?')) {
      // Remove from checkbox selections
      const productToRemove = selectedEntitlementProducts.value[index];
      const valueIndex = formData.value.entitlementProducts.indexOf(productToRemove.code);
      if (valueIndex > -1) {
        formData.value.entitlementProducts.splice(valueIndex, 1);
      }
      
      // Remove from reactive data
      const dataIndex = entitlementProductsData.value.findIndex(p => p.code === productToRemove.code);
      if (dataIndex > -1) {
        entitlementProductsData.value.splice(dataIndex, 1);
      }
      
      toast.success('Entitlement product telah dipadam');
    }
  }
  
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-'
    const date = new Date(dateTimeString)
    return date.toLocaleString('ms-MY')
  }
  
  const previewDocument = (dokumen) => {
    console.log("Previewing document:", dokumen);
    // Implement document preview functionality
  };
  
  const downloadDocument = (dokumen) => {
    console.log("Downloading document:", dokumen);
    // Implement document download functionality
  };
  
  // BQ Functions
  const openBQForm = () => {
    editingBQ.value = null;
    showBQModal.value = true;
  };
  
  const editBQ = (bq) => {
    // Navigate to dedicated BQ drafting/editing page with current id and edit flag
    // router.push(
    //   `/BF-BTN/tugasan/bantuan/siasatan/draf-bq/${route.params.id}`
    // );
    router.push(
      `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}/draf-bq?edit=true`
    );
  
  };
  
  const closeBQModal = () => {
    showBQModal.value = false;
    editingBQ.value = null;
  };
  
  const saveBQ = () => {
    // Implement BQ save functionality
    toast.success("BQ telah disimpan");
    closeBQModal();
  };
  
  // Navigation Functions
  const openLaporanGambar = () => {
    router.push(
      `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}/laporan-gambar`
    );
  };
  
  const openLaporanTeknikal = () => {
    router.push(
      `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}/laporan-teknikal`
    );
  };
  
  const viewArahanKerja = () => {
    router.push(
      `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/arahan-kerja`
    );
  };
  
  const urusPemantauan = () => {
    router.push(
      `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/pemantauan`
    );
  };
  
  // Action Button Functions
  const handleSimpanDraf = async () => {
    try {
      processing.value = true;
  
      // Implement save draft functionality
      console.log("Saving draft...");
  
      toast.success("Draf telah disimpan");
    } catch (error) {
      toast.error("Ralat semasa menyimpan draf");
      console.error(error);
    } finally {
      processing.value = false;
    }
  };
  
  const handleSimpanDrafDanSahkan = async () => {
    try {
      processing.value = true;
      actionType.value = "draft_confirm";
  
      // Implement save draft and confirm completion functionality
      console.log("Saving draft and confirming completion...");
  
      // Update status lawatan
      formData.value.statusLawatan = "selesai_lawatan";
  
      toast.success("Draf telah disimpan dan status lawatan telah dikemaskini");
    } catch (error) {
      toast.error("Ralat semasa menyimpan dan mengesahkan");
      console.error(error);
    } finally {
      processing.value = false;
      actionType.value = "";
    }
  };
  
  const handleSelesaiDanHantar = async () => {
    try {
      processing.value = true;
      actionType.value = "complete_submit";
  
      // Validate required fields before submission
      if (
        !formData.value.statusproses ||
        formData.value.statusproses === "belum_selesai"
      ) {
        toast.error(
          "Sila kemaskini Status Proses"
        );
        return;
      }
  
      // Implement complete and submit functionality
      console.log("Completing and submitting to approval...");
  
      toast.success("Siasatan telah selesai dan dihantar untuk kelulusan");
  
      // Navigate back to list
      router.push("/BF-BTN/tugasan/bantuan/siasatan/siasatan-eoad");
    } catch (error) {
      toast.error("Ralat semasa menyelesaikan dan menghantar");
      console.error(error);
    } finally {
      processing.value = false;
      actionType.value = "";
    }
  };
  
  const handleSimpan = async () => {
    try {
      processing.value = true;
      actionType.value = "simpan";
  
      // Validate required fields before submission
      if (
        !formData.value.statusproses ||
        formData.value.statusproses === "belum_selesai"
      ) {
        toast.error(
          "Sila kemaskini Status Proses"
        );
        return;
      }
  
      // Implement complete and submit functionality
      console.log("Completing and submitting to approval...");
  
      toast.success("Maklumat telah berjaya disimpan");
  
      // Navigate back to list
      //router.push("/BF-BTN/tugasan/bantuan/siasatan/siasatan-eoad");
    } catch (error) {
      toast.error("Ralat semasa menyelesaikan dan menghantar");
      console.error(error);
    } finally {
      processing.value = false;
      actionType.value = "";
    }
  };
  
  const handleBatal = () => {
    router.push("/BF-BTN/tugasan/bantuan/siasatan/siasatan-eoad/NAS-2025-0002");
  };
  
  // Budget check function
  const checkBudget = () => {
    // Set budget to 10 million when checking
    budgetInfo.value.jumlahBajetSemasa = "RM 10,000,000.00";
    
    // Always set bajet mencukupi to "Ya"
    budgetInfo.value.bajetMencukupi = "Ya";
    toast.success("Bajet mencukupi untuk bantuan ini");
  };
  
  // Function to populate special approval data for all sections
  const populateSpecialApprovalData = (selectedType) => {
    // Section 2: Dokumen Sokongan
    if (selectedType === 'B102') {
      dokumenSokongan.value = [
        { jenis: "Kad Pengenalan", filename: "kad_pengenalan.pdf", url: "#", status: "lengkap" },
        { jenis: "Penyata Pendapatan", filename: "penyata_pendapatan.pdf", url: "#", status: "lengkap" },
        { jenis: "Surat Pengesahan", filename: "surat_pengesahan.pdf", url: "#", status: "lengkap" }
      ];
    } else if (selectedType === 'B300') {
      dokumenSokongan.value = [
        { jenis: "Surat tawaran belajar daripada pihak sekolah/surat pengesahan belajar", filename: "surat_tawaran_belajar_sekolah.pdf", url: "#", status: "lengkap" },
        { jenis: "Kad Pengenalan", filename: "kad_pengenalan.pdf", url: "#", status: "lengkap" },
        { jenis: "Penyata Pendapatan", filename: "penyata_pendapatan.pdf", url: "#", status: "lengkap" }
      ];
    } else if (selectedType === 'B307') {
      dokumenSokongan.value = [
        { jenis: "SURAT TAWARAN BELAJAR IPT", filename: "surat_tawaran_belajar_ipt.pdf", url: "#", status: "lengkap" },
        { jenis: "Kad Pengenalan", filename: "kad_pengenalan.pdf", url: "#", status: "lengkap" },
        { jenis: "Penyata Pendapatan", filename: "penyata_pendapatan.pdf", url: "#", status: "lengkap" }
      ];
    }
    
    // Section 3: Maklumat Penerima Bayaran
    paymentInfo.value = {
      kaedah: "EFT",
      noId: "850101-10-1234",
      namaPenerima: "Ahmad Bin Ali",
      namaAkaun: "Ahmad Bin Ali",
      bank: "Maybank",
      noAkaun: "1234567890"
    };
    
    // Section 4: Maklumat Bajet
    budgetInfo.value = {
      kodBajet: "A-200400-1000-1-P-1-" + selectedType,
      jumlahBajetSemasa: "100000.00",
      bajetMencukupi: "Ya"
    };
    
    // Section 5: Maklumat Kelulusan
    approvalInfo.value = {
      keputusanKelulusan: "lulus",
      catatan: "Diluluskan berdasarkan keperluan mendesak dan situasi kelulusan khas"
    };
    
    // Section 7: Maklumat Penerima Manfaat (jika tanggungan)
    dependentSelection.value = {
      nama: selectedType === 'B300' ? 'SITI' : selectedType === 'B307' ? 'ALI' : 'FATIMAH'
    };
    
    // Section 8: Keputusan Siasatan
    investigationDecision.value = {
      status: "Sokong",
      catatan: "Layak mengikut kriteria kelulusan khas",
      itemBantuan: selectedType === 'B102' ? 'Beras 10kg x 2' : selectedType === 'B300' ? 'Wang Saku Bulanan' : 'Rawatan Hospital'
    };
  };
  
  // Fetch application data on mount
  onMounted(() => {
    console.log("onMounted executed"); // Debug log
    
    // Implement API call to fetch application data
    // This is mock data for now
    formData.value = {
      aid: "B102\tBantuan Binaan Rumah (Fakir)",
      aidproduct: "Bantuan Binaan Rumah (Fakir)",
      productpackage: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
      entitlementproduct: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
      entitlementProducts: [], // Initialize checkbox array
      jumlahBantuan: 43000,
      tempohKekerapan: 1,
      // nama: "Mohd Rosli bin Saad",
      // alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
      // jenisPengenalan: "No Pengenalan",
      // myKad: "880701121234",
      // noTelefon: "0123456789",
      // emel: "rosli@gmail.com",
      // statusKeluarga: "Fakir",
      // statusIndividu: "Fakir",
      // statusMultidimensi: "Asnaf Tidak Produktif",
      // statusLawatan: "Perlu Diproses",
    };
  
    // Load by assistance type from route.params.id (e.g. B102/B300/B307)
    const selectedType = String(route.params.id || '').toUpperCase();
    if (mockAssistanceData[selectedType]) {
      Object.assign(formData.value, mockAssistanceData[selectedType]);
      console.log("Loaded assistance by id:", selectedType, formData.value);
      
      // If this is a special approval case, modify the data accordingly
      if (isSpecialApproval.value) {
        // Enable special approval flags
        formData.value.segera = true;
        formData.value.kelulusankhas = true;
        
        // Set appropriate special approval data based on the type
        if (selectedType === 'B102') {
          formData.value.sebabSegera = "Kecemasan keluarga - kehilangan sumber pendapatan utama";
          formData.value.situasikelulusankhas = "Melebihi kadar Had Kifayah";
          formData.value.jumlahBantuan = 1800;
          formData.value.tempohKekerapan = 6;
        } else if (selectedType === 'B300') {
          formData.value.sebabSegera = "Kecemasan pendidikan - memerlukan bantuan segera";
          formData.value.situasikelulusankhas = "Tidak memenuhi syarat minimum permohonan bantuan";
          formData.value.jumlahBantuan = 500;
          formData.value.tempohKekerapan = 1;
        } else if (selectedType === 'B307') {
          formData.value.sebabSegera = "Kecemasan perubatan - memerlukan rawatan segera";
          formData.value.situasikelulusankhas = "Jenis bantuan tidak tersenarai di dalam GPSKAZ/ Perkara yang melibatkan kepentingan akidah Islam dan nyawa";
          formData.value.jumlahBantuan = 1000;
          formData.value.tempohKekerapan = 1;
        }
        
        // Auto-populate other sections for special approval
        populateSpecialApprovalData(selectedType);
      }
    } else {
      console.warn("Assistance type not found, using fallback:", selectedType);
    }
  
    // Auto-select entitlement products for B300
    if (selectedType === 'B300') {
      formData.value.entitlementProducts = [
        'wang_persediaan_sekolah_asrama',
        'wang_saku_sekolah_asrama', 
        'yuran_sekolah_asrama'
      ];
    }
  
    // Auto-select entitlement products for B307
    if (selectedType === 'B307') {
      formData.value.entitlementProducts = [
        'DERMASISWA_IPT',
        'wangpersediaan_IPT',
        'yuran_pengajian'
      ];
    }
  
    // Set initial nama based on route ID
    if (selectedType === 'B300') {
      dependentSelection.value.nama = 'SITI';
    } else if (selectedType === 'B307') {
      dependentSelection.value.nama = 'ALI';
    }
  
    // Initialize dokumen sokongan based on route ID
    initializeDokumenSokongan();
  
    console.log("formData set:", formData.value); // Debug log
  
    // Auto-populate laporan teknikal latar belakang from profiling
    laporanTeknikal.value.latarBelakang =
      `1. Keterangan Harta Benda:
  Binaan rumah daripada separa batu dan kayu.
  
  2. Status hakmilik tanah seperti berikut :
  No Lot : 3439
  Mukim : JERAM
  Daerah : KUALA SELANGOR
  Nama Pemilik : MOHD ROSLI BIN SAAD
  ANG Bahagian : 1/14
  Luas : 1.1635 HEKTAR
  Lain-lain : - NIL-
  
  3. Maklumat Isirumah :
  Ketua Keluarga : Pemohon (MISKIN)
  Pasangan : 1 orang isteri tinggal bersama
  Tanggungan : - NIL-
  Lain-lain : - NIL-`;
    laporanTeknikal.value.keperluan = `Keadaan rumah separa uzur. Sebahagian besar struktur rumah yang dibina daripada kayu telah uzur dan reput dimakan anal-anal.
  Keadaan rumah tidak sempuma.
  
  Pemohon tidak mepunyai pendapatan yang mencukupi untuk membaiki kerosakan yang berlaku dirumahnya.
  Untuk rekod, rumah masih dalam keadaan baik untuk diduduki dan sesuai untuk dibaikpulih.`;
  
    laporanTeknikal.value.cadangan = `Dicadangkan kerja-kerja baikpulih berikut :
  
  1. Meroboh bahagian rumah yang rosak dan retak.
  2. Membina semula struktur bangunan rumah yang baru.
  3. Membaikpulih dan menaiktaraf pendawalan elektrik bahagian rumah yang terlibat.`;
  
    laporanTeknikal.value.nilaiKerja = "43000"
    // Auto-calculate jumlah bantuan from BQ (mock calculation)
    jumlahBantuan.value = 25000;
    catatanPengesyoran.value =
      "Cadangan kerja baik pulih bumbung bocor dan cat dinding luar untuk memastikan keselamatan dan keselesaan pemohon.";
  });
  
  </script>
  
  <style lang="scss" scoped>
  // Custom animations and transitions
  .group:hover .group-hover\:text-blue-600 {
    transition: color 0.2s ease-in-out;
  }
  
  // Enhanced focus states
  .focus\:ring-2:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  // Table row hover effect
  .hover\:bg-gray-50:hover {
    background-color: #f9fafb;
  }
  
  // Document card styling
  .border-gray-200 {
    border-color: #e5e7eb;
  }
  
  .bg-gray-50 {
    background-color: #f9fafb;
  }
  </style>