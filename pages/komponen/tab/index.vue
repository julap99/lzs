<script setup>
definePageMeta({
  title: "Tab",
});

const showCode1 = ref(false);
const showCode2 = ref(false);
const showCode3 = ref(false);
const vertical = ref(false);
const type = ref("default");
const variant = ref("primary");
const fill = ref(false);
const justify = ref("left");

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

const variantOptions = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Success", value: "success" },
  { label: "Danger", value: "danger" },
  { label: "Warning", value: "warning" },
  { label: "Info", value: "info" },
];
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header> Default </template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>rs-tab</code> untuk membuat antara muka berasaskan tab.
          <code>rs-tab-item</code> digunakan untuk membuat setiap tab.
        </p>
        <rs-tab>
          <rs-tab-item title="Tab 1"> Tab 1 </rs-tab-item>
          <rs-tab-item title="Tab 2"> Tab 2 </rs-tab-item>
          <rs-tab-item title="Tab 3"> Tab 3 </rs-tab-item>
        </rs-tab>
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
            <div class="relative" v-show="showCode1" v-highlight>
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
                &lt;rs-tab&gt;
                  &lt;rs-tab-item title="Tab 1"&gt; Tab 1 &lt;/rs-tab-item&gt;
                  &lt;rs-tab-item title="Tab 2"&gt; Tab 2 &lt;/rs-tab-item&gt;
                  &lt;rs-tab-item title="Tab 3"&gt; Tab 3 &lt;/rs-tab-item&gt;
                &lt;/rs-tab&gt;
              &lt;/template&gt;

              &lt;script setup&gt;&lt;/script&gt;
            </code>
          </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <rs-card>
      <template #header> Tab Menegak </template>
      <template #body>
        <p class="mb-4">
          Gunakan props <code>vertical</code> untuk membuat antara muka tab
          menegak.
        </p>
        <rs-tab vertical>
          <rs-tab-item title="Tab 1"> Tab 1 </rs-tab-item>
          <rs-tab-item title="Tab 2"> Tab 2 </rs-tab-item>
          <rs-tab-item title="Tab 3"> Tab 3 </rs-tab-item>
        </rs-tab>

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
            <div class="relative" v-show="showCode2" v-highlight>
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
                &lt;rs-tab vertical&gt;
                  &lt;rs-tab-item title="Tab 1"&gt; Tab 1 &lt;/rs-tab-item&gt;
                  &lt;rs-tab-item title="Tab 2"&gt; Tab 2 &lt;/rs-tab-item&gt;
                  &lt;rs-tab-item title="Tab 3"&gt; Tab 3 &lt;/rs-tab-item&gt;
                &lt;/rs-tab&gt;
              &lt;/template&gt;

              &lt;script setup&gt;&lt;/script&gt;
            </code>
          </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <rs-card>
      <template #header> Penggayaan </template>
      <template #body>
        <p class="mb-4">
          Tab boleh digayakan menggunakan props <code>variant</code> dan
          <code>type</code>. Prop <code>type</code> boleh digunakan untuk
          membuat tab gaya kad dan sempadan. Prop <code>variant</code> boleh
          digunakan untuk menukar warna tab.
        </p>
        <div class="flex flex-wrap gap-x-5">
          <FormKit
            label="Varian"
            type="radio"
            v-model="variant"
            :options="variantOptions"
            :classes="{
              options: 'flex flex-wrap gap-4 pt-2',
              fieldset: 'px-4 py-0 max-w-full',
            }"
          />

          <FormKit
            v-model="type"
            type="radio"
            label="Jenis"
            :options="[
              { label: 'Default', value: 'default' },
              { label: 'Border', value: 'border' },
              { label: 'Card', value: 'card' },
            ]"
            :classes="{
              options: 'flex flex-wrap gap-4 pt-2',
              fieldset: 'px-4 py-0 max-w-full',
            }"
          />
          <FormKit
            v-model="vertical"
            type="radio"
            label="Menegak"
            :options="[
              { label: 'False', value: false },
              { label: 'True', value: true },
            ]"
            :classes="{
              options: 'flex flex-wrap gap-4 pt-2',
              fieldset: 'px-4 py-0 max-w-full',
            }"
          />
          <FormKit
            v-model="fill"
            type="radio"
            label="Isian"
            :options="[
              { label: 'False', value: false },
              { label: 'True', value: true },
            ]"
            :classes="{
              options: 'flex flex-wrap gap-4 pt-2',
              fieldset: 'px-4 py-0 max-w-full',
            }"
          />
          <FormKit
            v-model="justify"
            type="radio"
            label="Justifikasi"
            :options="[
              { label: 'Kiri', value: 'left' },
              { label: 'Tengah', value: 'center' },
              { label: 'Kanan', value: 'right' },
            ]"
            :classes="{
              options: 'flex flex-wrap gap-4 pt-2',
              fieldset: 'px-4 py-0 max-w-full',
            }"
          />
        </div>

        <rs-tab
          :variant="variant"
          :type="type"
          :fill="fill"
          :justify="justify"
          :vertical="vertical"
        >
          <rs-tab-item title="Tab 1"> Tab 1 </rs-tab-item>
          <rs-tab-item title="Tab 2"> Tab 2 </rs-tab-item>
          <rs-tab-item title="Tab 3"> Tab 3 </rs-tab-item>
        </rs-tab>
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode3 ? (showCode3 = false) : (showCode3 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="relative" v-show="showCode3" v-highlight>
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
                &lt;rs-tab 
                    variant="primary|secondary|info|success|warning|danger" 
                    type="default|border|card"
                    justify="left|center|right"
                    fill
                    vertical&gt;
                  &lt;rs-tab-item title="Tab 1"&gt; Tab 1 &lt;/rs-tab-item&gt;
                  &lt;rs-tab-item title="Tab 2"&gt; Tab 2 &lt;/rs-tab-item&gt;
                  &lt;rs-tab-item title="Tab 3"&gt; Tab 3 &lt;/rs-tab-item&gt;
                &lt;/rs-tab&gt;
              &lt;/template&gt;

              &lt;script setup&gt;&lt;/script&gt;
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
