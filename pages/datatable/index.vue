<script setup>
import data from "@/assets/json/data.json";
definePageMeta({
  title: "Data Table",
  breadcrumb: [
    {
      name: "Data Table",
      type: "current",
    },
  ],
});

const fields = ["ID", "Nama Penuh", "Umur", "Emel"];

const showCode1 = ref(false);
const showCode2 = ref(false);

const tooltips = ref({});

const copyCode = (codeId) => {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    navigator.clipboard
      .writeText(codeElement.textContent)
      .then(() => {
        console.log("Kod disalin ke papan klip");
        showTooltip(codeId, "Kod disalin!");
      })
      .catch((err) => {
        console.error("Gagal menyalin kod: ", err);
        showTooltip(codeId, "Gagal menyalin kod");
      });
  }
};

const showTooltip = (codeId, message) => {
  tooltips.value[codeId] = message;
  setTimeout(() => {
    tooltips.value[codeId] = null;
  }, 2000); // Hide tooltip after 2 seconds
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <!-- Basic Table Example -->
    <rs-card>
      <template #header> Datatable Asas </template>
      <template #body>
        <rs-table
          :field="fields"
          :data="data"
          :options="{
            variant: 'default',
            striped: true,
            borderless: true,
            hover: true,
            fixed: false,
          }"
          basic
        >
        </rs-table>
        <div class="flex justify-end mt-2">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode1 ? (showCode1 = false) : (showCode1 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="z-0" v-show="showCode1" v-highlight>
              <div class="relative">
                <button
                  @click="copyCode('code1')"
                  class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
                >
                  Salin Kod
                </button>
                <transition name="tooltip">
                  <span
                    v-if="tooltips['code1']"
                    class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                  >
                    {{ tooltips["code1"] }}
                  </span>
                </transition>
                <NuxtScrollbar style="max-height: 300px">
                  <pre id="code1" class="language-html shadow-none">
                  <code>
                    &lt;template&gt;
                      &lt;rs-table
                      :field="fields"
                      :data="data"
                      :options="{
                        variant: 'default',
                        striped: true,
                        borderless: true,
                        hover: true,
                        fixed: false,
                      }"
                      basic
                      &gt;
                      &lt;/rs-table&gt;
                    &lt;/template&gt;
                    
                    &lt;script setup&gt;
                      const data = [
                        {
                          "id": "#001",
                          "namaPenuh": "John Doe",
                          "umur": 34,
                          "emel": "johndoe@example.com"
                        },
                        {
                          "id": "#002",
                          "namaPenuh": "Jane Smith",
                          "umur": 28,
                          "emel": "janesmith@example.com"
                        },
                        {
                          "id": "#003",
                          "namaPenuh": "Robert Brown",
                          "umur": 45,
                          "emel": "robertbrown@example.com"
                        },
                        {
                          "id": "#004",
                          "namaPenuh": "Emily White",
                          "umur": 37,
                          "emel": "emilywhite@example.com"
                        }
                      ];
                      const fields = ["ID", "Nama Penuh", "Umur", "Emel"];
                    &lt;/script&gt;
                  </code>
                </pre>
                </NuxtScrollbar>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Advanced Table Example -->
    <rs-card>
      <template #header> Datatable Maju</template>
      <template #body>
        <rs-table
          :data="data"
          :options="{
            variant: 'default',
            striped: true,
            borderless: true,
          }"
          :options-advanced="{
            sortable: true,
            
            filterable: false,
          }"
          advanced
        >
          <template v-slot:status="data">
            <rs-badge
              :variant="
                data.text === 'Active'
                  ? 'success'
                  : data.text == 'Inactive'
                  ? 'warning'
                  : 'danger'
              "
            >
              {{ data.text }}
            </rs-badge>
          </template>
        </rs-table>
        <div class="flex justify-end mt-2">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode2 ? (showCode2 = false) : (showCode2 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="z-0" v-show="showCode2" v-highlight>
              <div class="relative">
                <button
                  @click="copyCode('code2')"
                  class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
                >
                  Salin Kod
                </button>
                <transition name="tooltip">
                  <span
                    v-if="tooltips['code2']"
                    class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                  >
                    {{ tooltips["code2"] }}
                  </span>
                </transition>
                <NuxtScrollbar style="max-height: 300px">
                  <pre id="code2" class="language-html shadow-none">
                  <code>
                    &lt;template&gt;
                      &lt;rs-table
                        :data="data"
                        :options="{
                          variant: 'default',
                          striped: true,
                          borderless: true,
                        }"
                        :options-advanced="{
                          sortable: true,
                          
                          filterable: false,
                        }"
                        advanced
                      &gt;
                        &lt;template v-slot:status="data"&gt;
                          &lt;rs-badge
                            :variant="
                              data.text === 'Active'
                                ? 'success'
                                : data.text == 'Inactive'
                                ? 'warning'
                                : 'danger'
                            "&gt;
                            &#123;&#123; data.text &#125;&#125;
                          &lt;/rs-badge&gt;
                        &lt;/template&gt;
                      &lt;/rs-table&gt;
                    &lt;/template&gt;
                      
                    &lt;script setup&gt;
                      const data = [
                        {
                          "id": "#001",
                          "namaPenuh": "John Doe",
                          "umur": 34,
                          "emel": "johndoe@example.com",
                          "status": "Active"
                        },
                        {
                          "id": "#002",
                          "namaPenuh": "Jane Smith",
                          "umur": 28,
                          "emel": "janesmith@example.com",
                          "status": "Inactive"
                        },
                        {
                          "id": "#003",
                          "namaPenuh": "Robert Brown",
                          "umur": 45,
                          "emel": "robertbrown@example.com",
                          "status": "Banned"
                        },
                        {
                          "id": "#004",
                          "namaPenuh": "Emily White",
                          "umur": 37,
                          "emel": "emilywhite@example.com",
                          "status": "Active"
                        }
                      ];
                    &lt;/script&gt;
                  </code>
                </pre>
                </NuxtScrollbar>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
