<script setup>
definePageMeta({
  title: "Collapse",
});

const type = ref("default");
const showCode1 = ref(false);
const showCode2 = ref(false);
const showCode3 = ref(false);

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

    <!-- Default Collapse Example -->
    <rs-card>
      <template #header> Default </template>
      <template #body>
        <p class="mb-2">
          Gunakan <code>rs-collapse</code> untuk menunjukkan collapse.
          <code>rs-collapse-item</code> digunakan untuk menunjukkan item
          collapse.
        </p>
        <rs-collapse>
          <rs-collapse-item title="Collapse Item 1">
            <p class="text-justify">
              Lorem Ipsum adalah teks rekaan semata-mata dalam industri
              percetakan dan penyusunan huruf. Lorem Ipsum telah menjadi teks
              rekaan piawai industri sejak 1500-an, apabila pencetak yang tidak
              dikenali mengambil alih sebatang jenis dan mengocoknya untuk
              membuat buku spesimen jenis.
            </p>
          </rs-collapse-item>
          <rs-collapse-item title="Collapse Item 2">
            <p>Kandungan Collapse Item 2</p>
          </rs-collapse-item>
        </rs-collapse>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode1 ? (showCode1 = false) : (showCode1 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode1" v-highlight>
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
                        &lt;rs-collapse&gt;
                          &lt;rs-collapse-item title="Collapse Item 1"&gt;
                            &lt;p class="text-justify"&gt;
                              Lorem Ipsum adalah teks rekaan semata-mata dalam industri percetakan dan penyusunan huruf. Lorem Ipsum telah menjadi teks rekaan piawai industri sejak 1500-an.
                            &lt;/p&gt;
                          &lt;/rs-collapse-item&gt;
                          &lt;rs-collapse-item title="Collapse Item 2"&gt;
                            &lt;p&gt;Kandungan Collapse Item 2&lt;/p&gt;
                          &lt;/rs-collapse-item&gt;
                        &lt;/rs-collapse&gt;
                      &lt;/template&gt;

                      &lt;script setup&gt;&lt;/script&gt;
                    </code>
                  </pre>
                </NuxtScrollbar>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Accordion Example -->
    <rs-card>
      <template #header> Accordion </template>
      <template #body>
        <p class="mb-2">
          Gunakan prop <code>accordion</code> kepada
          <code>rs-collapse</code> untuk menjadikannya sebagai accordion.
        </p>
        <rs-collapse accordion>
          <rs-collapse-item title="Accordion Item 1">
            <p class="text-justify">
              Lorem Ipsum adalah teks rekaan semata-mata dalam industri
              percetakan dan penyusunan huruf. Lorem Ipsum telah menjadi teks
              rekaan piawai industri sejak 1500-an, apabila pencetak yang tidak
              dikenali mengambil alih sebatang jenis dan mengocoknya untuk
              membuat buku spesimen jenis.
            </p>
          </rs-collapse-item>
          <rs-collapse-item title="Accordion Item 2">
            <p>Kandungan Accordion Item 2</p>
          </rs-collapse-item>
        </rs-collapse>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode2 ? (showCode2 = false) : (showCode2 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode2" v-highlight>
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
                        &lt;rs-collapse accordion&gt;
                          &lt;rs-collapse-item title="Accordion Item 1"&gt;
                            &lt;p class="text-justify"&gt;
                              Lorem Ipsum adalah teks rekaan semata-mata dalam industri percetakan dan penyusunan huruf. Lorem Ipsum telah menjadi teks rekaan piawai industri sejak 1500-an.
                            &lt;/p&gt;
                          &lt;/rs-collapse-item&gt;
                          &lt;rs-collapse-item title="Accordion Item 2"&gt;
                            &lt;p&gt;Kandungan Accordion Item 2&lt;/p&gt;
                          &lt;/rs-collapse-item&gt;
                        &lt;/rs-collapse&gt;
                      &lt;/template&gt;

                      &lt;script setup&gt;&lt;/script&gt;
                    </code>
                  </pre>
                </NuxtScrollbar>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Type Example -->
    <rs-card>
      <template #header> Jenis </template>
      <template #body>
        <p class="mb-2">
          Gunakan prop <code>type</code> kepada <code>rs-collapse</code> untuk
          menetapkan jenisnya. Jenis boleh menjadi <code>default</code>,
          <code>border</code>, dan <code>card</code>.
        </p>
        <FormKit
          v-model="type"
          type="radio"
          label="Jenis"
          :options="[
            { label: 'Default', value: 'default' },
            { label: 'Border', value: 'border' },
            { label: 'Card', value: 'card' },
          ]"
        />
        <rs-collapse :type="type">
          <rs-collapse-item title="Collapse Item 1">
            <p class="text-justify">
              Lorem Ipsum adalah teks rekaan semata-mata dalam industri
              percetakan dan penyusunan huruf. Lorem Ipsum telah menjadi teks
              rekaan piawai industri sejak 1500-an, apabila pencetak yang tidak
              dikenali mengambil alih sebatang jenis dan mengocoknya untuk
              membuat buku spesimen jenis.
            </p>
          </rs-collapse-item>
          <rs-collapse-item title="Collapse Item 2">
            <p>Kandungan Collapse Item 2</p>
          </rs-collapse-item>
          <rs-collapse-item title="Collapse Item 3">
            <p>Kandungan Collapse Item 3</p>
          </rs-collapse-item>
        </rs-collapse>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode3 ? (showCode3 = false) : (showCode3 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode3" v-highlight>
              <div class="relative">
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
                        &lt;!-- Default Styling('default') --&gt;
                        &lt;rs-collapse&gt;
                          &lt;rs-collapse-item title="Collapse Item 1"&gt;
                            Kandungan Collapse Item 1
                          &lt;/rs-collapse-item&gt;
                          &lt;rs-collapse-item title="Collapse Item 2"&gt;
                            Kandungan Collapse Item 2
                          &lt;/rs-collapse-item&gt;
                        &lt;/rs-collapse&gt;

                        &lt;!-- Border Styling('border') --&gt;
                        &lt;rs-collapse type="border"&gt;
                          &lt;rs-collapse-item title="Collapse Item 1"&gt;
                            Kandungan Collapse Item 1
                          &lt;/rs-collapse-item&gt;
                          &lt;rs-collapse-item title="Collapse Item 2"&gt;
                            Kandungan Collapse Item 2
                          &lt;/rs-collapse-item&gt;
                        &lt;/rs-collapse&gt;

                        &lt;!-- Card Styling('card') --&gt;
                        &lt;rs-collapse type="card"&gt;
                          &lt;rs-collapse-item title="Collapse Item 1"&gt;
                            Kandungan Collapse Item 1
                          &lt;/rs-collapse-item&gt;
                          &lt;rs-collapse-item title="Collapse Item 2"&gt;
                            Kandungan Collapse Item 2
                          &lt;/rs-collapse-item&gt;
                        &lt;/rs-collapse&gt;
                      &lt;/template&gt;

                      &lt;script setup&gt;&lt;/script&gt;
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
