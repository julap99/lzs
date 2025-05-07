<script setup>
definePageMeta({
  title: "Modal",
});

const showModal = ref({
  modal1: false,
  modal2: false,
  modal3: false,
  modal4: false,
  modal5: false,
  modal6: false,
  modal7: false,
  modal8: false,
  modal9: false,
  modal10: false,
  modal11: false,
  modal12: false,
  modal13: false,
  modal14: false,
});

const showCode = ref({
  code1: false,
  code2: false,
  code3: false,
  code4: false,
  code5: false,
});

const tooltips = ref({});

const copyCode = (codeId) => {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    navigator.clipboard
      .writeText(codeElement.textContent)
      .then(() => {
        showTooltip(codeId, "Kod disalin!");
      })
      .catch((err) => {
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

const clickOK = () => {
  alert("Anda telah klik OK");
};

const clickCancel = () => {
  alert("Anda telah klik Batal");
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <!-- Default Modal -->
    <rs-card>
      <template #header>Default</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>rs-modal</code> untuk menunjukkan/menyembunyikan modal.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-button @click="showModal.modal1 = true"
            >Tunjukkan Modal</rs-button
          >
          <rs-button @click="showModal.modal9 = true"
            >Sembunyikan Overlay</rs-button
          >
          <rs-button @click="showModal.modal14 = true">
            Persistent Overlay
          </rs-button>
        </div>
        <rs-modal title="Ini adalah modal" v-model="showModal.modal1">
          Ini adalah kandungan modal.
        </rs-modal>
        <rs-modal
          title="Ini adalah modal"
          v-model="showModal.modal9"
          hide-overlay
        >
          Ini adalah kandungan modal.
        </rs-modal>
        <rs-modal
          title="Ini adalah modal"
          v-model="showModal.modal14"
          :overlayClose="false"
        >
          Ini adalah kandungan modal.
        </rs-modal>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="
              showCode.code1
                ? (showCode.code1 = false)
                : (showCode.code1 = true)
            "
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="relative" v-show="showCode.code1" v-highlight>
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
                      &lt;rs-button @click="showModal.modal1 = true"&gt;Tunjukkan Modal&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" v-model="showModal.modal1"&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                      &lt;rs-button @click="showModal.modal2 = true"&gt;Sembunyikan Overlay&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" v-model="showModal.modal2" hide-overlay&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                      &lt;rs-button @click="showModal.modal3 = true"&gt;Persistent Overlay&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" v-model="showModal.modal3" :overlayClose="false"&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                    &lt;/template&gt;

                    &lt;script setup&gt;
                    const showModal = ref({
                      modal1: false,
                      modal2: false,
                      modal3: false,
                    });
                    &lt;/script&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Size Modal -->
    <rs-card>
      <template #header>Saiz</template>
      <template #body>
        <p class="mb-4">
          Saiz modal menggunakan prop <code>size</code> untuk menukar saiz
          modal. Terdapat 3 saiz: <code>sm</code>, <code>md</code>, dan
          <code>lg</code>. Saiz lalai ialah <code>md</code>.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-button @click="showModal.modal2 = true">Saiz Kecil</rs-button>
          <rs-button @click="showModal.modal3 = true">Saiz Sederhana</rs-button>
          <rs-button @click="showModal.modal4 = true">Saiz Besar</rs-button>
        </div>
        <rs-modal title="Ini adalah modal" size="sm" v-model="showModal.modal2">
          Ini adalah kandungan modal kecil.
        </rs-modal>
        <rs-modal title="Ini adalah modal" size="md" v-model="showModal.modal3">
          Ini adalah kandungan modal sederhana.
        </rs-modal>
        <rs-modal title="Ini adalah modal" size="lg" v-model="showModal.modal4">
          Ini adalah kandungan modal besar.
        </rs-modal>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="
              showCode.code2
                ? (showCode.code2 = false)
                : (showCode.code2 = true)
            "
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="relative" v-show="showCode.code2" v-highlight>
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
                      &lt;rs-button @click="showModal.modal2 = true"&gt;Saiz Kecil&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" size="sm" v-model="showModal.modal2"&gt;
                        Ini adalah kandungan modal kecil.
                      &lt;/rs-modal&gt;
                      &lt;rs-button @click="showModal.modal3 = true"&gt;Saiz Sederhana&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" size="md" v-model="showModal.modal3"&gt;
                        Ini adalah kandungan modal sederhana.
                      &lt;/rs-modal&gt;
                      &lt;rs-button @click="showModal.modal4 = true"&gt;Saiz Besar&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" size="lg" v-model="showModal.modal4"&gt;
                        Ini adalah kandungan modal besar.
                      &lt;/rs-modal&gt;
                    &lt;/template&gt;

                    &lt;script setup&gt;
                    const showModal = ref({
                      modal2: false,
                      modal3: false,
                      modal4: false,
                    });
                    &lt;/script&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Position Modal -->
    <rs-card>
      <template #header>Kedudukan</template>
      <template #body>
        <p class="mb-4">
          Kedudukan modal menggunakan prop <code>position</code> untuk menukar
          kedudukan modal. Terdapat 3 kedudukan: <code>top</code>,
          <code>center</code>, dan <code>bottom</code>.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-button @click="showModal.modal5 = true">Atas</rs-button>
          <rs-button @click="showModal.modal6 = true">Tengah</rs-button>
          <rs-button @click="showModal.modal7 = true">Bawah</rs-button>
        </div>
        <rs-modal
          title="Ini adalah modal"
          position="top"
          v-model="showModal.modal5"
        >
          Ini adalah kandungan modal.
        </rs-modal>
        <rs-modal
          title="Ini adalah modal"
          position="center"
          v-model="showModal.modal6"
        >
          Ini adalah kandungan modal.
        </rs-modal>
        <rs-modal
          title="Ini adalah modal"
          position="bottom"
          v-model="showModal.modal7"
        >
          Ini adalah kandungan modal.
        </rs-modal>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="
              showCode.code3
                ? (showCode.code3 = false)
                : (showCode.code3 = true)
            "
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="relative" v-show="showCode.code3" v-highlight>
              <button
                @click="copyCode('code3')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <transition name="tooltip">
                <span
                  v-if="tooltips['code3']"
                  class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                >
                  {{ tooltips["code3"] }}
                </span>
              </transition>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="code3" class="language-html shadow-none">
                  <code>
                    &lt;template&gt; 
                      &lt;rs-button @click="showModal.modal5 = true"&gt;Atas&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" position="top" v-model="showModal.modal5"&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                      &lt;rs-button @click="showModal.modal6 = true"&gt;Tengah&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" position="center" v-model="showModal.modal6"&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                      &lt;rs-button @click="showModal.modal7 = true"&gt;Bawah&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" position="bottom" v-model="showModal.modal7"&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                    &lt;/template&gt;

                    &lt;script setup&gt;
                    const showModal = ref({
                      modal5: false,
                      modal6: false,
                      modal7: false,
                    });
                    &lt;/script&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Customize Modal -->
    <rs-card>
      <template #header>Sesuaikan</template>
      <template #body>
        <p class="mb-4 text-justify">
          Tajuk, badan dan footer modal boleh disesuaikan dengan menggunakan
          slot templat. Slot tajuk dinamakan <code>header</code>, slot badan
          dinamakan <code>body</code> dan slot footer dinamakan
          <code>footer</code>. Tajuk OK boleh disesuaikan dengan menggunakan
          prop <code>ok-title</code>. Tajuk lalai ialah <code>OK</code>. Tajuk
          Batal boleh disesuaikan dengan menggunakan prop
          <code>cancel-title</code>. Tajuk lalai ialah <code>Batal</code>.
          Butang OK dan batal boleh disembunyikan dengan menggunakan prop
          <code>ok-only</code> atau <code>cancel-only</code>. Nilai lalai ialah
          <code>false</code> untuk kedua-duanya.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-button @click="showModal.modal8 = true"
            >Tunjukkan Modal</rs-button
          >
          <rs-button @click="showModal.modal10 = true"
            >Butang Tersuai</rs-button
          >
          <rs-button @click="showModal.modal11 = true">OK Sahaja</rs-button>
          <rs-button @click="showModal.modal12 = true">Batal Sahaja</rs-button>
        </div>
        <rs-modal title="Ini adalah modal" v-model="showModal.modal8">
          <template #header> Tajuk Tersuai </template>
          <template #body> Badan Tersuai </template>
          <template #footer> Footer Tersuai </template>
        </rs-modal>
        <rs-modal
          title="Ini adalah modal"
          v-model="showModal.modal10"
          cancel-title="Tutup"
          ok-title="Terima"
        >
          Ini adalah kandungan modal.
        </rs-modal>
        <rs-modal title="Ini adalah modal" v-model="showModal.modal11" ok-only>
          Ini adalah kandungan modal.
        </rs-modal>
        <rs-modal
          title="Ini adalah modal"
          v-model="showModal.modal12"
          cancel-only
        >
          Ini adalah kandungan modal.
        </rs-modal>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="
              showCode.code4
                ? (showCode.code4 = false)
                : (showCode.code4 = true)
            "
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="relative" v-show="showCode.code4" v-highlight>
              <button
                @click="copyCode('code4')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <transition name="tooltip">
                <span
                  v-if="tooltips['code4']"
                  class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                >
                  {{ tooltips["code4"] }}
                </span>
              </transition>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="code4" class="language-html shadow-none">
                  <code>
                    &lt;template&gt; 
                      &lt;rs-button @click="showModal.modal8 = true"&gt;Tunjukkan Modal&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" v-model="showModal.modal8"&gt;
                        &lt;template #header&gt; Tajuk Tersuai &lt;/template&gt;
                        &lt;template #body&gt; Badan Tersuai &lt;/template&gt;
                        &lt;template #footer&gt; Footer Tersuai &lt;/template&gt;
                      &lt;/rs-modal&gt;
                      &lt;rs-button @click="showModal.modal10 = true"&gt;Butang Tersuai&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" v-model="showModal.modal10" cancel-title="Tutup" ok-title="Terima"&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                      &lt;rs-button @click="showModal.modal11 = true"&gt;OK Sahaja&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" v-model="showModal.modal11" ok-only&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                      &lt;rs-button @click="showModal.modal12 = true"&gt;Batal Sahaja&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" v-model="showModal.modal12" cancel-only&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                    &lt;/template&gt;

                    &lt;script setup&gt;
                    const showModal = ref({
                      modal8: false,
                      modal10: false,
                      modal11: false,
                      modal12: false,
                    });
                    &lt;/script&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Bind Function Modal -->
    <rs-card>
      <template #header>Bind Fungsi</template>
      <template #body>
        <p class="mb-4">
          Anda boleh mengikat fungsi untuk butang OK dan batal dalam modal
          dengan menggunakan prop <code>ok-callback</code> dan
          <code>cancel-callback</code>.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-button @click="showModal.modal13 = true">Bind Fungsi</rs-button>
        </div>
        <rs-modal
          title="Ini adalah modal"
          v-model="showModal.modal13"
          :ok-callback="clickOK"
          :cancel-callback="clickCancel"
        >
          Ini adalah kandungan modal.
        </rs-modal>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="
              showCode.code5
                ? (showCode.code5 = false)
                : (showCode.code5 = true)
            "
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="relative" v-show="showCode.code5" v-highlight>
              <button
                @click="copyCode('code5')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <transition name="tooltip">
                <span
                  v-if="tooltips['code5']"
                  class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                >
                  {{ tooltips["code5"] }}
                </span>
              </transition>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="code5" class="language-html shadow-none">
                  <code>
                    &lt;template&gt; 
                      &lt;rs-button @click="showModal.modal13 = true"&gt;Bind Fungsi&lt;/rs-button&gt;
                      &lt;rs-modal title="Ini adalah modal" v-model="showModal.modal13" :ok-callback="clickOK" :cancel-callback="clickCancel"&gt;
                        Ini adalah kandungan modal.
                      &lt;/rs-modal&gt;
                    &lt;/template&gt;

                    &lt;script setup&gt;
                    const showModal = ref({
                      modal13: false,
                    });

                    const clickOK = () => {
                      alert("Anda telah klik OK");
                    };

                    const clickCancel = () => {
                      alert("Anda telah klik Batal");
                    };
                    &lt;/script&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>
  </div>
</template>
