																	  

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Pemohon</h2>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)"
          >
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Section 1: Maklumat Pemohon -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Information</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nama</label
                >
                <p class="text-gray-900">{{ formData.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Alamat</label
                >
                <p class="text-gray-900">{{ formData.alamat }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
								
				 
																  
					
				   
																		   
								
				 
																  
				  
				   
																		   
                  >Jenis Pengenalan</label
                >
                <p class="text-gray-900">{{ formData.jenisPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >No Pengenalan</label
                >
                <p class="text-gray-900">{{ formData.noPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >No Telefon</label
                >
                <p class="text-gray-900">{{ formData.noTelefon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >E-mel</label
                >
                <p class="text-gray-900">{{ formData.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Status Keluarga</label
                >
                <p class="text-gray-900">{{ formData.statusKeluarga }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Status Individu</label
                >
                <p class="text-gray-900">{{ formData.statusIndividu }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Status Multidimensi</label
                >
                <p class="text-gray-900">{{ formData.statusMultidimensi }}</p>
              </div>
            </div>
          </rs-fieldset>
        </FormKit>
      </template>
    </rs-card>

    <div class="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="col-span-1">
        <rs-card class="">
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">Maklumat Bantuan</h2>
            </div>
          </template>

          <template #body>
            <!-- Main Tabs -->
            <rs-tab variant="primary" type="card">
              <rs-tab-item title="Profiling" active>
                <!-- Profiling Tab Content -->
				<div class="p-6">
                  <rs-table
                    :data="profilingFilteredApplications"
                    :columns="profilingColumns"
                    :pageSize="pageSize"
                    :showNoColumn="true"
                    :options="{
                      variant: 'default',
                      hover: true,
                      striped: true,
                    }"
                    :options-advanced="{
                      sortable: true,
                      filterable: false,
                    }"
                    advanced
                  >
                    <template #header-tindakan>
                      <div class="text-center w-full">Aksi</div>
                    </template>
                    <template v-slot:status="{ text }">
                      <rs-badge :variant="getProfilingStatusVariant(text)">
                        {{ text }}
                      </rs-badge>
                    </template>
                    <template v-slot:tindakan="{ value }">
                      <div class="flex justify-center items-center gap-2">
                        <rs-button
                          variant="primary"
                          class="p-1 flex gap-2"
                          @click="profilingHandleReview(value.status)"
                        >
                          Semak
                        </rs-button>
                      </div>
                    </template>
                  </rs-table>

                  <!-- Pagination -->
                  <div class="flex items-center justify-between px-5 mt-4">
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-700">Baris per halaman:</span>
                      <FormKit
                        v-model="pageSize"
                        type="select"
                        :options="[10, 25, 50]"
                        :classes="{
                          wrapper: 'w-20',
                          outer: 'mb-0',
                          input: '!rounded-lg',
                        }"
                      />
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-700">
                        Menunjukkan {{ profilingPaginationStart }} hingga
                        {{ profilingPaginationEnd }} daripada {{ profilingTotalApplications }} entri
                      </span>
                    </div>
                  </div>
                </div>		   
														 
											   
										
										
							   
										 
								  
									
					  
										
									 
										
					  
							
				   
											   
																
							   
													   
																		   
								  
								 
							   
														  
																		  
								  
										   
												
																	  
						 
							   
									
							
							   
							 

                
																		   
														 
																				   
							  
										  
									 
											   
								   
										  
										
											   
						  
						
						  
														 
														  
																		 
																									
							 
						  
						
					  
              </rs-tab-item>

              <rs-tab-item title="Bantuan">
                <rs-tab variant="secondary" type="border">
												   
												 
							 
																																																						
					   
							 
											
													  
										  
								 
										   
									  
									
						
										  
									   
										  
						
							  
					 
													   
																		 
								  
										   
												   
														 
											  
							
																  
						  
								 
																  
												
					   
														 
																  
												
						 
								 
																  
								
										 
														
											
						  
								 
							   
								   

												  
																	 
						
								

                  <rs-tab-item title="Bantuan daripada Agensi">
                    <!-- Bantuan daripada Agensi Sub-tab Content -->

                    <!-- <div
                    class="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 rounded-lg border border-gray-200 bg-white shadow-sm scroll-indicator"
                  > -->
                    <rs-table
                      :data="otherAgencyAssistance"
                      :columns="otherAgencyColumns"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        striped: true,
                        hover: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:jumlah="{ text }"
                        >RM {{ text }}</template
                      >
                    </rs-table>
                    <!-- </div> -->
                  </rs-tab-item>

                  <rs-tab-item title="Bantuan Sedia Ada">
                    <rs-table
                      :data="existingAssistance"
                      :columns="existingAssistanceColumns"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        striped: true,
                        hover: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:kadar="{ text }">RM {{ text }}</template>
                      <template v-slot:jumlah="{ text }"
                        >RM {{ text }}</template
                      >
                      <template v-slot:status="{ text }">
                        <rs-badge :variant="getAssistanceStatusVariant(text)">{{
                          text
                        }}</rs-badge>
                      </template>
                    </rs-table>
                  </rs-tab-item>

														 
										   
																			 
											 
																		
														  
							 
																		
																		
							 

								 
													   
													 
											  
									 
											   
										  
										
							
											  
										   
											  
							
								  
						 
														   
																			 
									  
											   
															
																  
												  
								
																	  
						
									 
																	  
									
											 
															
												
							  
									 
								   

													  
																		 
							  
						
					  
				
									   

																		   
										   
																	  
																	  
						   

							   
												 
													
											
								   
											 
										
									  
						  
											
										 
											
						  
								
					   
													   
																		   
									
											 
														   
																 
												
							  
																	
						
								   
																  
								  
										   
														
											  
							
								   
								 

													
																	   
							
						  
								

                  <rs-tab-item title="Bantuan Baru">
                    <rs-table
                      :data="assistanceApplications"
                      :columns="assistanceColumns"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        striped: true,
                        hover: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <rs-badge :variant="getAssistanceStatusVariant(text)">{{
                          text
                        }}</rs-badge>
                      </template>

                      <template v-slot:actions="{ value }">
                        <rs-button
                          variant="primary"
                          @click="editAssistance(value.actions)"
                          :loading="editingAssistance"
                          :disabled="editingAssistance"
                        >
                          <Icon name="heroicons:pencil-square" class="w-4 h-4 mr-1" />
                          Edit
                        </rs-button>
                      </template>
                    </rs-table>
                  </rs-tab-item>
                </rs-tab>
              </rs-tab-item>
            </rs-tab>
          </template>
        </rs-card>
      </div>

      <div class="col-span-1">
        <rs-card class="">
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">Maklumat Kelulusan</h2>
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
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-sm font-medium text-gray-700 mb-3">
                    Ringkasan Profil
                  </h3>
                  <ul class="text-sm space-y-1 text-gray-600">
                    <li>• Status: {{ formData.statusKeluarga }}</li>
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
                  <!-- <p class="text-sm text-gray-600 mt-3">
                    Registrasi dibuut berdasarkan profil asnaf
                  </p> -->
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-sm font-medium text-gray-700 mb-3">
                    Ringkasan Kelulusan
								 
										  
										   
													 
												
										 
										   
																			  
					  
					
                  </h3>
                  <ul class="text-sm space-y-1 text-gray-600">
                    <li>• No Bantuan: NAS-2025-000001</li>
                    <li>
                      • Nama Bantuan: Bantuan Binaan Rumah (Fakir)
                    </li>
                    <li>
                      • Kadar: RM43,000.00
                    </li>
                    <li>
                      • Kekerapan: 1
                    </li>
                    <li>
                      • Status: Lulus
                    </li>
                  </ul>
                  <!-- <p class="text-sm text-gray-600 mt-3">
                    Registrasi dibuut berdasarkan profil asnaf
                  </p> -->
							
								 
										
										  
																	   
											 
															
						
											
					  
                </div>

            
					  

											  
						  
								 
												  
													 
															 
																	 
										   
																	   
					  
					
					


											   
						  
						  
								   
											   
												  
							
											   
							   
									 
					  
					
						  

																								  
											  
																			  
											  
						  

												  
									 
											
						
											   
									   
										
													
																																																																		   
					 
											 
						   
										  
																																						  
						
							 
														   
								 
																				   
														  
							 
														
							  
																
																  
							  
							  
							  
							  

											  
						  
										
								 
									  
							  
													 
									
					  

											
																			
						  
																   
									
																			  
					   
																			
																			
											 
								   
																
														 
								   
							  
																		 
							  
																							
																	   
								 
							
						  
						

												  
						
													  
																								 
					 
						  
																
									
																																									  
					   
											  
																		
							  
											
														
																			 
														
							

												  
							  
																																								 
						   
								
																												  
							 
						   
																 
																																		   
								   
											   
							   
																	  
							 
									 
																
																																		  
											 
											 
							   
																		
									   
							  
							  

													
							  
												
																											
						   
								 
											   
																		
							  
							  
							  

										   
												   
											
																		 
								 
																		   
													 
							 
												  
								   
																	 
															  
								   
							  

												
								  
									   
														   
												   
															  
									   
											
																	  
							  
							
							
						  
					  

													 
						
														
																																						   
					 
						  
																														 
					   
												 
						 
										   
																		
							
												   
														 
							  
																
															   
					  
					  
					
						  
						
					  

											
					 
					  
								   
											
											
							
											   
							   
									 
					  
					
					  

						  
						
								 
										 
										   
													
												
										 
										   
																			  
					  
					
						  

									   
						  
						
							 
										
										  
												   
												
										 
										   
															
					  
					
						  

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
                    Hantar
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
    </div>

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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

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
    name: "Kelulusan Bantuan",
    type: "current",
    path: "/BF-BTN/tugasan/bantuan/kelulusan/siasatan-eoad",
  },
]);

								  
						 
					
						   
							   
								
																 
							  
							 
							 
								 
							
							 
							
							
												
							 

						   
						  
					  
					
																																																												 
					   
	
					
						   
							   
							  
															  
							   
					   
							 
								 
							
								   
							 
							 
										  
							 

						   
						  
					  
					
																																													  
					   
   
  

						  
							   
					
															 
								 
								
									
														
						
					  
					
										 
																																																												 
					 
						  
					  
							 
	   
				   
															
								 
						   
					 
	   
	 
	
					
											  
									
							  
											  
															   
						
					  
					
										 
																																													  
					 
						  
					  
							 
	   
				   
																			  
								 
						   
					 
		
	   
				   
																					
								 
						   
					 
	   
	 
   
  

// Load applicant data based on ID
const loadApplicantData = (applicantId) => {
  const applicantDatabase = {
    "btn-001": {
      nama: "Ahmad bin Hassan",
      alamat: "No. 123, Jalan Merdeka, Taman Seri Jaya, 43000 Kajang, Selangor",
      jenisPengenalan: "MyKad",
      noPengenalan: "880701121234",
      noTelefon: "0123456789",
      email: "ahmad.hassan@gmail.com",
      statusKeluarga: "Fakir",
      statusIndividu: "Fakir",
      statusMultidimensi: "Asnaf Tidak Produktif",
      status: "Dalam Siasatan",
    },
    "btn-002": {
      nama: "Muhammad Farhan bin Fitri",
      alamat: "No. 789, Jalan Pendidikan, Taman Ilmu, 50000 Kuala Lumpur",
      jenisPengenalan: "MyKad",
      noPengenalan: "970707077788",
      noTelefon: "0134567890",
      email: "muhammad.farhan@gmail.com",
      statusKeluarga: "Fakir",
      statusIndividu: "Fakir",
      statusMultidimensi: "Asnaf Tidak Produktif",
      status: "Dalam Siasatan",
    },
    "btn-003": {
      nama: "Alia Natasha binti Hussain",
      alamat: "No. 456, Jalan Harmoni, Taman Seri Kembangan, 43300 Seri Kembangan, Selangor",
      jenisPengenalan: "MyKad",
      noPengenalan: "971207020568",
      noTelefon: "0198765432",
      email: "alia.natasha@gmail.com",
      statusKeluarga: "Fakir",
      statusIndividu: "Fakir",
      statusMultidimensi: "Asnaf Tidak Produktif",
      status: "Dalam Siasatan",
    },
    "btn-004": {
      nama: "Amirul Hakim bin Zainuddin",
      alamat: "No. 321, Jalan Sejahtera, Taman Al-Taqwa, 45000 Kuala Selangor, Selangor",
      jenisPengenalan: "MyKad",
      noPengenalan: "791230104321",
      noTelefon: "0187654321",
      email: "amirul.hakim@gmail.com",
      statusKeluarga: "Fakir",
      statusIndividu: "Fakir",
      statusMultidimensi: "Asnaf Tidak Produktif",
      status: "Dalam Siasatan",
    }
  };

  return applicantDatabase[applicantId] || applicantDatabase["btn-003"]; // Default to Alia if not found
};

// Load investigation data based on ID
const loadInvestigationData = (applicantId) => {
  const investigationDatabase = {
    "btn-001": {
      jenisPekerjaan: "Tidak Bekerja",
      statusKediaman: "Rumah Sendiri",
      jumlahBayaranRumah: "RM0",
      bilTanggungan: "2 Orang (Isteri dan Anak)",
      statusTanggungan: "Isteri tidak bekerja, Anak masih sekolah",
      catatanPenilianAwal: "Pemohon memerlukan bantuan binaan rumah kerana rumah sedia ada dalam keadaan uzur dan tidak selamat untuk didiami",
    },
    "btn-002": {
      jenisPekerjaan: "Pelajar",
      statusKediaman: "Asrama",
      jumlahBayaranRumah: "RM0",
      bilTanggungan: "Tidak ada",
      statusTanggungan: "Pelajar IPT",
      catatanPenilianAwal: "Pemohon Muhammad Farhan adalah pelajar IPT yang memerlukan bantuan dermasiswa untuk menampung kos pengajian dan kehidupan di asrama",
    },
    "btn-003": {
      jenisPekerjaan: "Tidak Bekerja",
      statusKediaman: "Rumah Sewa",
      jumlahBayaranRumah: "RM800",
      bilTanggungan: "1 Orang (Ibu)",
      statusTanggungan: "Tidak Bekerja, Bergantung kepada anak",
      catatanPenilianAwal: "Pemohon telah menceritakan masalah mengenai keadaan rumahnya yang semakin uzur akibat dimakan anai-anai dan keadaan bumbung yang bocor. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan ini",
    },
    "btn-004": {
      jenisPekerjaan: "Buruh Harian",
      statusKediaman: "Rumah Sendiri",
      jumlahBayaranRumah: "RM0",
      bilTanggungan: "3 Orang (Isteri dan 2 Anak)",
      statusTanggungan: "Isteri suri rumah, 2 anak bersekolah",
      catatanPenilianAwal: "Pemohon Amirul Hakim bekerja sebagai buruh harian dengan pendapatan tidak tetap. Rumah dalam keadaan memerlukan pembaikan bumbung dan dinding yang retak. Keluarga memerlukan bantuan untuk pembaikan dan sara hidup harian.",
    }
  };

  return investigationDatabase[applicantId] || investigationDatabase["btn-003"]; // Default to Alia if not found
};

// Form data
const formData = ref({
  // Personal Information - will be loaded dynamically
  nama: "",
  alamat: "",
  jenisPengenalan: "MyKad",
  noPengenalan: "",
  noTelefon: "",
  email: "",
  statusKeluarga: "Fakir",
  statusIndividu: "Fakir",
  statusMultidimensi: "Asnaf Tidak Produktif",
  status: "Dalam Siasatan",

  // Investigation fields
  keputusanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "Pemohon telah menceritakan masalah mengenai keadaan rumahnya yang semakin uzur akibat dimakan anai-anai dan keadaan bumbung yang bocor. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan ini",
  gambarLokasi: null,
});

// Investigation form data - will be loaded dynamically
const investigationData = ref({
  jenisPekerjaan: "",
  statusKediaman: "",
  jumlahBayaranRumah: "",
  bilTanggungan: "",
  statusTanggungan: "",
  keadaanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
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
const editingAssistance = ref(false);
const uploadProgress = ref([]);
const fileInputRef = ref(null);

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
  { label: "Boleh ditemui", value: "boleh_ditemui" },
  { label: "Tidak dapat ditemui", value: "tidak_dapat_ditemui" },
  { label: "Alamat tidak tepat", value: "alamat_tidak_tepat" },
  { label: "Berpindah alamat", value: "berpindah_alamat" },
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

// Paparkan Bantuan Binaan Rumah hanya untuk id "btn-001"
if (route.params.id === "btn-001") {
  assistanceApplications.value.push({
    jenisBantuan: "B152 - Bantuan Binaan Rumah (Fakir)",
    status: "Perlu Diproses",
    sla: "3 hari lagi",
    actions: "/BF-BTN/tugasan/bantuan/kelulusan/B106",
  });
}

// Tambah dua baris untuk id "btn-002" dalam tab Bantuan Baru
if (route.params.id === "btn-002") {
  assistanceApplications.value.push(
    {
      jenisBantuan: "(HQ) Bantuan Dermasiswa Sekolah Asrama (Fakir)",
      status: "Perlu Diproses",
      sla: "3 hari lagi",
      actions: "/BF-BTN/tugasan/bantuan/kelulusan/pendidikan/B300",
    },
    {
      jenisBantuan:
        "(HQ) Dermasiswa IPT Dalam Negara (Fakir) - IPTA/IPTS",
      status: "Perlu Diproses",
      sla: "3 hari lagi",
      actions: "/BF-BTN/tugasan/bantuan/kelulusan/pendidikan/B307",
    }
  );
}

// Tambah bantuan untuk Alia Natasha binti Hussain (btn-003)
if (route.params.id === "btn-003") {
  assistanceApplications.value.push({
    jenisBantuan: "B300 - Bantuan Sewa Rumah (Fakir)",
    status: "Perlu Diproses",
    sla: "2 hari lagi",
    actions: "/BF-BTN/tugasan/bantuan/kelulusan/sewarumah/B300",
  });
}

// Tambah bantuan untuk Amirul Hakim bin Zainuddin (btn-004)
if (route.params.id === "btn-004") {
  assistanceApplications.value.push({
    jenisBantuan: "B103 - (HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)",
    status: "Perlu Diproses",
    sla: "3 hari lagi",
        actions: "/BF-BTN/tugasan/bantuan/kelulusan/Dialisis/B103",
  });
}

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
]);

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
    aid: "[B601] BANTUAN PENDIDIKAN (FISABILILLAH)",
    aidProduct: "BANTUAN PENDIDIKAN (FISABILILLAH)",
    productPackage: "(EFT) YURAN PENDIDIKAN (FISABILILLAH)",
    entitlementProduct: "(EFT) YURAN PENDIDIKAN TINGGI (FISABILILLAH)",
    terimaCadangan: false,
  },
  {
    aid: "[B503] BANTUAN MAKANAN BULANAN (FAKIR)",
    aidProduct: "MAKANAN BULANAN (FAKIR)",
    productPackage: "(VCASH) BANTUAN BULANAN (FAKIR)",
    entitlementProduct: "(VCASH) BANTUAN BULANAN KELUARGA (FAKIR)",
    terimaCadangan: false,
  },
  {
    aid: "[B701] BANTUAN BENCANA (MISKIN)",
    aidProduct: "BANTUAN BENCANA (MISKIN)",
    productPackage: "(CASH) BANTUAN SEGERA (MISKIN)",
    entitlementProduct: "(CASH) BENCANA ALAM (MISKIN)",
    terimaCadangan: false,
  },
]);

const bantuanPembatalan = ref([
  {
    aid: "[B601] BANTUAN PENDIDIKAN (FISABILILLAH)",
    aidProduct: "BANTUAN PENDIDIKAN (FISABILILLAH)",
    productPackage: "(EFT) YURAN PENDIDIKAN (FISABILILLAH)",
    entitlementProduct: "(EFT) YURAN PENDIDIKAN TINGGI (FISABILILLAH)",
    batalBantuan: false,
  },
  {
    aid: "[B503] BANTUAN MAKANAN BULANAN (FAKIR)",
    aidProduct: "BANTUAN MAKANAN BULANAN (FAKIR)",
    productPackage: "(VCASH) BANTUAN BULANAN (FAKIR)",
    entitlementProduct: "(VCASH) BANTUAN BULANAN KELUARGA (FAKIR)",
    batalBantuan: false,
  },
  {
    aid: "[B304] BANTUAN KEPERLUAN HIDUP (GHARIMIN)",
    aidProduct: "BANTUAN KEPERLUAN HIDUP (GHARIMIN)",
    productPackage: "(VCASH) BANTUAN BULANAN (GHARIMIN)",
    entitlementProduct: "(VCASH) BAYARAN BULANAN KELUARGA (GHARIMIN)",
    batalBantuan: false,
  },
  {
    aid: "[B701] BANTUAN BENCANA (MISKIN)",
    aidProduct: "BANTUAN BENCANA (MISKIN)",
    productPackage: "(CASH) BANTUAN SEGERA (MISKIN)",
    entitlementProduct: "(CASH) BENCANA ALAM (MISKIN)",
    batalBantuan: false,
  },
  {
    aid: "[B205] BANTUAN PERUBATAN DIALISIS (MISKIN)",
    aidProduct: "BANTUAN PERUBATAN DIALISIS (MISKIN)",
    productPackage: "(GL) BANTUAN BULANAN (MISKIN)",
    entitlementProduct: "(GL) BANTUAN PERUBATAN DIALISIS (MISKIN)",
    batalBantuan: false,
  },
]);

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

const editAssistance = async (path) => {
  console.log("Edit assistance clicked, path:", path);
  
  if (!path || typeof path !== "string") {
    console.error("Invalid path provided for edit assistance");
    // You could add a toast notification here
    return;
  }

  // Set loading state
  editingAssistance.value = true;

  try {
    console.log("Navigating to:", path);
    
    // Navigate to the edit page
    await navigateTo(path);
    
    console.log("Navigation successful");
  } catch (error) {
    console.error("Navigation failed:", error);
    
    // Fallback: if the specific route doesn't exist, navigate to a general edit page
    console.log("Attempting fallback navigation...");
    
    try {
      // Extract the assistance type and create a fallback route
      if (path.includes("/pendidikan/")) {
        await navigateTo(`/BF-BTN/tugasan/bantuan/kelulusan/pendidikan/${route.params.id}`);
      } else if (path.includes("/sewarumah/")) {
        await navigateTo(`/BF-BTN/tugasan/bantuan/kelulusan/sewarumah/${route.params.id}`);
      } else {
        // Default fallback to the current page's edit mode
        await navigateTo(`/BF-BTN/tugasan/bantuan/kelulusan/${route.params.id}`);
      }
    } catch (fallbackError) {
      console.error("Fallback navigation also failed:", fallbackError);
    }
  } finally {
    // Reset loading state
    editingAssistance.value = false;
  }
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

const toggleSelectAllPembatalan = () => {
  bantuanPembatalan.value.forEach((row) => {
    row.batalBantuan = selectAllPembatalan.value;
  });
};

const getAssistanceStatusVariant = (status) => {
  const variants = {
    "dalam semakan": "warning",
    "perlu diproses": "warning",
    lulus: "success",
    "tidak lulus": "danger",
  };
  return variants[status.toLowerCase()] || "default";
};

// Computed property for form validation
const canSubmitForApproval = computed(() => {
  return (
  
    investigationData.value.keadaanSiasatan &&
			
					   
    investigationData.value.tarikhLawatan &&
    investigationData.value.masaLawatan &&
    investigationData.value.statusLawatan
  );
   
  
						
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

									 
				 
																				  
											
															   
  
			   
										  
   
  
							
																
	
											   
													 
																				
	 
// Initialize applicant data based on route parameter
const currentApplicantId = route.params.id;
const applicantInfo = loadApplicantData(currentApplicantId);
const investigationInfo = loadInvestigationData(currentApplicantId);

// Load the applicant data into formData
Object.assign(formData.value, applicantInfo);

// Load the investigation data into investigationData
Object.assign(investigationData.value, investigationInfo);

console.log("Loaded applicant data for:", currentApplicantId, applicantInfo);
console.log("Loaded investigation data for:", currentApplicantId, investigationInfo);
   
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
