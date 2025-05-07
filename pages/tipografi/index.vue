<script setup>
definePageMeta({
  title: "Tipografi",
  breadcrumb: [
    {
      name: "Tipografi",
      type: "current",
    },
  ],
});

const showCode1 = ref(false);
const showCode2 = ref(false);
const showCode3 = ref(false);
const showCode4 = ref(false);
const tooltips = ref({});

const copyCode = (codeId) => {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    const codeText = codeElement.textContent;
    navigator.clipboard.writeText(codeText).then(() => {
      tooltips.value[codeId] = "Kod disalin!";
      setTimeout(() => {
        tooltips.value[codeId] = "";
      }, 2000);
    });
  }
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header> Tipografi </template>
      <template #body>
        <p class="mb-4">
          Dokumentasi tipografi untuk pembangun untuk melihat dan menggunakan.
        </p>
      </template>
    </rs-card>

    <!-- Tajuk -->
    <rs-card>
      <template #header> Tajuk </template>
      <template #body>
        <div class="space-y-2">
          <h1 class="text-4xl font-bold">Tajuk 1</h1>
          <h2 class="text-3xl font-bold">Tajuk 2</h2>
          <h3 class="text-2xl font-bold">Tajuk 3</h3>
          <h4 class="text-xl font-bold">Tajuk 4</h4>
          <h5 class="text-lg font-bold">Tajuk 5</h5>
          <h6 class="text-base font-bold">Tajuk 6</h6>
        </div>
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
                <pre id="code1" class="language-html">
                  <code>
&lt;h1 class="text-4xl font-bold"&gt;Tajuk 1&lt;/h1&gt;
&lt;h2 class="text-3xl font-bold"&gt;Tajuk 2&lt;/h2&gt;
&lt;h3 class="text-2xl font-bold"&gt;Tajuk 3&lt;/h3&gt;
&lt;h4 class="text-xl font-bold"&gt;Tajuk 4&lt;/h4&gt;
&lt;h5 class="text-lg font-bold"&gt;Tajuk 5&lt;/h5&gt;
&lt;h6 class="text-base font-bold"&gt;Tajuk 6&lt;/h6&gt;
                  </code>
                </pre>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Perenggan -->
    <rs-card>
      <template #header> Perenggan </template>
      <template #body>
        <p class="mb-2">
          Ini adalah perenggan lalai. Ia menggunakan saiz fon asas dan
          ketinggian baris.
        </p>
        <p class="text-sm mb-2">
          Ini adalah perenggan kecil menggunakan kelas text-sm.
        </p>
        <p class="text-lg mb-2">
          Ini adalah perenggan besar menggunakan kelas text-lg.
        </p>
        <p class="font-light mb-2">Ini adalah perenggan berat ringan.</p>
        <p class="font-semibold mb-2">Ini adalah perenggan separa tebal.</p>
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
                <pre id="code2" class="language-html">
                  <code>
&lt;p&gt;Ini adalah perenggan lalai. Ia menggunakan saiz fon asas dan ketinggian baris.&lt;/p&gt;
&lt;p class="text-sm"&gt;Ini adalah perenggan kecil menggunakan kelas text-sm.&lt;/p&gt;
&lt;p class="text-lg"&gt;Ini adalah perenggan besar menggunakan kelas text-lg.&lt;/p&gt;
&lt;p class="font-light"&gt;Ini adalah perenggan berat ringan.&lt;/p&gt;
&lt;p class="font-semibold"&gt;Ini adalah perenggan separa tebal.&lt;/p&gt;
                  </code>
                </pre>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Warna Teks -->
    <rs-card>
      <template #header> Warna Teks </template>
      <template #body>
        <p class="text-primary mb-2">Ini adalah teks warna utama.</p>
        <p class="text-secondary mb-2">Ini adalah teks warna sekunder.</p>
        <p class="text-gray-500 mb-2">Ini adalah teks warna kelabu.</p>
        <p class="text-red-500 mb-2">Ini adalah teks warna merah.</p>
        <p class="text-green-500 mb-2">Ini adalah teks warna hijau.</p>
        <div class="flex justify-end mt-2">
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
                <pre id="code3" class="language-html">
                  <code>
&lt;p class="text-primary"&gt;Ini adalah teks warna utama.&lt;/p&gt;
&lt;p class="text-secondary"&gt;Ini adalah teks warna sekunder.&lt;/p&gt;
&lt;p class="text-gray-500"&gt;Ini adalah teks warna kelabu.&lt;/p&gt;
&lt;p class="text-red-500"&gt;Ini adalah teks warna merah.&lt;/p&gt;
&lt;p class="text-green-500"&gt;Ini adalah teks warna hijau.&lt;/p&gt;
                  </code>
                </pre>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Gaya Fon -->
    <rs-card>
      <template #header> Gaya Fon </template>
      <template #body>
        <p class="italic mb-2">Ini adalah teks condong.</p>
        <p class="font-bold mb-2">Ini adalah teks tebal.</p>
        <p class="underline mb-2">Ini adalah teks bergaris.</p>
        <p class="line-through mb-2">Ini adalah teks dicoret.</p>
        <p class="uppercase mb-2">Ini adalah teks huruf besar.</p>
        <p class="lowercase mb-2">Ini adalah teks huruf kecil.</p>
        <p class="capitalize mb-2">Ini adalah teks huruf awal besar.</p>
        <div class="flex justify-end mt-2">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode4 ? (showCode4 = false) : (showCode4 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode4" v-highlight>
              <div class="relative">
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
                <pre id="code4" class="language-html">
                  <code>
&lt;p class="italic"&gt;Ini adalah teks condong.&lt;/p&gt;
&lt;p class="font-bold"&gt;Ini adalah teks tebal.&lt;/p&gt;
&lt;p class="underline"&gt;Ini adalah teks bergaris.&lt;/p&gt;
&lt;p class="line-through"&gt;Ini adalah teks dicoret.&lt;/p&gt;
&lt;p class="uppercase"&gt;Ini adalah teks huruf besar.&lt;/p&gt;
&lt;p class="lowercase"&gt;Ini adalah teks huruf kecil.&lt;/p&gt;
&lt;p class="capitalize"&gt;Ini adalah teks huruf awal besar.&lt;/p&gt;
                  </code>
                </pre>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.3s;
}
.tooltip-enter,
.tooltip-leave-to {
  opacity: 0;
}
</style>
