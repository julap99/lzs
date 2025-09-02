<!--
  SCREEN: BF-PA/PE — Laporan Penolong Amil (Ringkas)
  SCENARIO: Ali bin Ahmad (PAK) — tanpa banyak filter
  TABS: Tugasan Hari Ini | Mesyuarat Saya (bulan ini) | Elaun Tahunan (tahun ini)
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 class="text-xl font-semibold">Laporan Penolong Amil</h2>
            <p class="text-sm text-gray-500">
              Ali bin Ahmad • PAK • {{ todayHuman }}
            </p>
          </div>
          <div class="text-xs text-gray-500">Dikemas kini: {{ lastUpdated }}</div>
        </div>
      </template>

      <template #body>
        <!-- KPI Ringkas (tiada filter) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div class="p-4 rounded-xl border">
            <div class="text-xs text-gray-500">Tugasan Hari Ini</div>
            <div class="text-2xl font-semibold">{{ kpi.tugasan.units }} unit</div>
            <div class="text-sm text-gray-600">RM {{ formatCurrency(kpi.tugasan.amount) }}</div>
          </div>
          <div class="p-4 rounded-xl border">
            <div class="text-xs text-gray-500">Mesyuarat (bulan ini)</div>
            <div class="text-2xl font-semibold">{{ kpi.mesyuarat.units }} kehadiran</div>
            <div class="text-sm">
              <span class="text-gray-600">RM {{ formatCurrency(kpi.mesyuarat.amount) }}</span>
              <span class="mx-2">•</span>
              <span class="text-emerald-600">Dibayar: RM {{ formatCurrency(kpi.mesyuarat.paid) }}</span>
            </div>
          </div>
          <div class="p-4 rounded-xl border">
            <div class="text-xs text-gray-500">Elaun Tahunan (tahun ini)</div>
            <div class="text-2xl font-semibold">RM {{ formatCurrency(kpi.tahunan.amount) }}</div>
            <div class="text-sm">
              <span class="text-emerald-600">Dibayar: RM {{ formatCurrency(kpi.tahunan.paid) }}</span>
              <span class="mx-2">•</span>
              <span class="text-amber-600">Belum: RM {{ formatCurrency(kpi.tahunan.unpaid) }}</span>
            </div>
          </div>
        </div>

        <!-- Tabs (ringkas) -->
        <rs-tab v-model="activeTab">
          <!-- TUGASAN HARI INI -->
          <rs-tab-item title="Tugasan Hari Ini">
            <div class="p-2">
              <div class="overflow-x-auto rounded-lg border">
                <table class="min-w-full text-sm divide-y">
                  <thead class="bg-gray-50 text-left">
                    <tr>
                      <th class="px-4 py-2">Status</th>
                      <th class="px-4 py-2">Jenis Elaun</th>
                      <th class="px-4 py-2">Kod Bajet</th>
                      <th class="px-4 py-2 text-right">Amaun Unit (RM)</th>
                      <th class="px-4 py-2 text-right">Bil. Borang</th>
                      <th class="px-4 py-2 text-right">Jumlah Elaun (RM)</th>
                      <th class="px-4 py-2">Status Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y bg-white">
                    <tr v-for="row in tugasanHariIni" :key="row.id" class="hover:bg-gray-50">
                      <td class="px-4 py-2"><rs-badge :variant="variantAktif(row.status)">{{ row.status }}</rs-badge></td>
                      <td class="px-4 py-2">{{ row.jenisElaun }}</td>
                      <td class="px-4 py-2">{{ row.kodBajet }}</td>
                      <td class="px-4 py-2 text-right">RM {{ formatCurrency(row.amaun) }}</td>
                      <td class="px-4 py-2 text-right">{{ row.units }}</td>
                      <td class="px-4 py-2 text-right font-medium">RM {{ formatCurrency(row.jumlah) }}</td>
                      <td class="px-4 py-2">
                        <rs-badge :variant="variantBayaran(row.paymentStatus)">{{ row.paymentStatus }}</rs-badge>
                      </td>
                    </tr>
                    <tr v-if="!tugasanHariIni.length">
                      <td class="px-4 py-6 text-center text-gray-500" colspan="7">Tiada tugasan untuk hari ini.</td>
                    </tr>
                  </tbody>
                  <tfoot v-if="tugasanHariIni.length" class="bg-gray-50">
                    <tr>
                      <td class="px-4 py-3 font-semibold" colspan="4">Jumlah</td>
                      <td class="px-4 py-3 text-right font-semibold">{{ sumUnits(tugasanHariIni) }}</td>
                      <td class="px-4 py-3 text-right font-semibold">RM {{ formatCurrency(sumAmount(tugasanHariIni)) }}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </rs-tab-item>

          <!-- MESYUARAT SAYA (BULAN INI) -->
          <rs-tab-item title="Mesyuarat Saya">
            <div class="p-2">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <rs-card class="md:col-span-3">
                  <template #header>
                    <h3 class="text-lg font-semibold">Elaun Mesyuarat / Kehadiran — Bulan Ini</h3>
                  </template>
                  <template #body>
                    <div class="overflow-x-auto rounded-lg border">
                      <table class="min-w-full text-sm divide-y">
                        <thead class="bg-gray-50 text-left">
                          <tr>
                            <th class="px-4 py-2">Tarikh</th>
                            <th class="px-4 py-2">Jenis Elaun</th>
                            <th class="px-4 py-2">Kod Bajet</th>
                            <th class="px-4 py-2 text-right">Amaun (RM)</th>
                            <th class="px-4 py-2">Hadir</th>
                            <th class="px-4 py-2">Status Pembayaran</th>
                            <th class="px-4 py-2 text-right">Jumlah (RM)</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y bg-white">
                          <tr v-for="row in mesyuaratBulanIni" :key="row.id" class="hover:bg-gray-50">
                            <td class="px-4 py-2">{{ fmt(row.tarikh) }}</td>
                            <td class="px-4 py-2">{{ row.jenisElaun }}</td>
                            <td class="px-4 py-2">{{ row.kodBajet }}</td>
                            <td class="px-4 py-2 text-right">RM {{ formatCurrency(row.amaun) }}</td>
                            <td class="px-4 py-2">
                              <rs-badge :variant="row.statusHadir === 'Disahkan' ? 'success' : 'secondary'">{{ row.statusHadir }}</rs-badge>
                            </td>
                            <td class="px-4 py-2">
                              <rs-badge :variant="variantBayaran(row.paymentStatus)">
                                {{ row.paymentStatus }}
                              </rs-badge>
                            </td>
                            <td class="px-4 py-2 text-right font-medium">RM {{ formatCurrency(row.jumlah) }}</td>
                          </tr>
                          <tr v-if="!mesyuaratBulanIni.length">
                            <td class="px-4 py-6 text-center text-gray-500" colspan="7">Tiada kehadiran bulan ini.</td>
                          </tr>
                        </tbody>
                        <tfoot v-if="mesyuaratBulanIni.length" class="bg-gray-50">
                          <tr>
                            <td class="px-4 py-3 font-semibold" colspan="5">Jumlah</td>
                            <td class="px-4 py-3 font-semibold">
                              <span class="text-emerald-600">Dibayar: RM {{ formatCurrency(sumPaid(mesyuaratBulanIni)) }}</span>
                            </td>
                            <td class="px-4 py-3 text-right font-semibold">RM {{ formatCurrency(sumAmount(mesyuaratBulanIni)) }}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </template>
                </rs-card>

                <!-- Aktiviti yang dihadiri (ringkas) -->
                <rs-card>
                  <template #header>
                    <h3 class="text-lg font-semibold">Aktiviti Dihadiri</h3>
                  </template>
                  <template #body>
                    <ul class="space-y-2">
                      <li v-for="row in mesyuaratBulanIni" :key="row.id" class="flex items-start">
                        <Icon name="ic:baseline-event" class="mt-0.5 mr-2" />
                        <div>
                          <div class="text-sm font-medium">{{ row.program || row.jenisElaun }}</div>
                          <div class="text-xs text-gray-500">{{ fmt(row.tarikh) }} • {{ row.kategoriPA }}</div>
                        </div>
                      </li>
                    </ul>
                  </template>
                </rs-card>
              </div>
            </div>
          </rs-tab-item>

          <!-- ELAUN TAHUNAN (TAHUN INI) -->
          <rs-tab-item title="Elaun Tahunan">
            <div class="p-2">
              <div class="overflow-x-auto rounded-lg border">
                <table class="min-w-full text-sm divide-y">
                  <thead class="bg-gray-50 text-left">
                    <tr>
                      <th class="px-4 py-2">Jenis Elaun Tahunan</th>
                      <th class="px-4 py-2">Kod Bajet</th>
                      <th class="px-4 py-2 text-right">Amaun Unit (RM)</th>
                      <th class="px-4 py-2 text-right">Unit (YTD)</th>
                      <th class="px-4 py-2 text-right">Jumlah Elaun (RM)</th>
                      <th class="px-4 py-2">Status</th>
                      <th class="px-4 py-2">Status Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y bg-white">
                    <tr v-for="row in tahunanTahunIni" :key="row.id" class="hover:bg-gray-50">
                      <td class="px-4 py-2">{{ row.jenisElaun }}</td>
                      <td class="px-4 py-2">{{ row.kodBajet }}</td>
                      <td class="px-4 py-2 text-right">RM {{ formatCurrency(row.amaun) }}</td>
                      <td class="px-4 py-2 text-right">{{ row.units }}</td>
                      <td class="px-4 py-2 text-right font-medium">RM {{ formatCurrency(row.jumlah) }}</td>
                      <td class="px-4 py-2"><rs-badge :variant="variantAktif(row.status)">{{ row.status }}</rs-badge></td>
                      <td class="px-4 py-2">
                        <rs-badge :variant="variantBayaran(row.paymentStatus)">{{ row.paymentStatus }}</rs-badge>
                      </td>
                    </tr>
                    <tr v-if="!tahunanTahunIni.length">
                      <td class="px-4 py-6 text-center text-gray-500" colspan="7">Tiada elaun tahunan untuk tahun ini.</td>
                    </tr>
                  </tbody>
                  <tfoot v-if="tahunanTahunIni.length" class="bg-gray-50">
                    <tr>
                      <td class="px-4 py-3 font-semibold" colspan="4">Jumlah</td>
                      <td class="px-4 py-3 text-right font-semibold">RM {{ formatCurrency(sumAmount(tahunanTahunIni)) }}</td>
                      <td class="px-4 py-3 font-semibold" colspan="2">
                        <span class="text-emerald-600 mr-3">Dibayar: RM {{ formatCurrency(sumPaid(tahunanTahunIni)) }}</span>
                        <span class="text-amber-600">Belum: RM {{ formatCurrency(sumUnpaid(tahunanTahunIni)) }}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </rs-tab-item>
        </rs-tab>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon } from "#components";
import LayoutsBreadcrumb from "~/components/layouts/Breadcrumb.vue";

definePageMeta({ title: "Laporan Penolong Amil (Ringkas)" });

const breadcrumb = [
  { name: "Laman Utama", path: "/" },
  { name: "Modul BF-PA", path: "/BF-PA" },
  { name: "Laporan Penolong Amil", path: null },
];

const now = new Date();
const todayISO = now.toISOString().slice(0,10); // YYYY-MM-DD
const todayHuman = now.toLocaleDateString("ms-MY", { weekday: "long", day: "2-digit", month: "short", year: "numeric" });
const lastUpdated = now.toLocaleString("ms-MY");

// ========== DATA (MOCK UNTUK ALI — PAK) ==========
// Tugasan Hari Ini (bilangan borang)
const tugasanHariIni = ref([
  rowTask("BANCIAN BARU : PER BORANG PERMOHONAN", "PAK", 30, "B34106", "AKTIF", 5, "BELUM DIBAYAR"),
  rowTask("KEMASKINI : PER BORANG PERMOHONAN", "PAK", 20, "B34106", "AKTIF", 3, "BELUM DIBAYAR"),
  rowTask("PERMOHONAN BANTUAN : PER BORANG PERMOHONAN", "PAK", 20, "B34106", "AKTIF", 2, "BELUM DIBAYAR"),
]);

// Mesyuarat / Kehadiran (bulan ini - setiap satunya 1 unit)
const mesyuaratBulanIni = ref([
  rowMeet("2025-09-01", "KEHADIRAN DALAM DAERAH 1/2 HARI", "PAK", 50, "B31702", "Disahkan", "SUDAH DIBAYAR", "2025-09-02", "Mesyuarat Kariah"),
  rowMeet("2025-09-05", "KEHADIRAN DALAM DAERAH 1 HARI", "PAK", 100, "B31702", "Disahkan", "BELUM DIBAYAR", null, "Bengkel PA Daerah"),
  rowMeet("2025-09-10", "KEHADIRAN LUAR DAERAH 1/2 HARI", "PAK", 100, "B31702", "Disahkan", "BELUM DIBAYAR", null, "Lawatan Antardaerah"),
]);

// Elaun Tahunan (tahun ini — unit = penerima/aktiviti layak/YTD)
const tahunanTahunIni = ref([
  rowAnnual("KHAS - 48 AKTIVITI/TAHUN", "PAK", 400, "B31702", "AKTIF", 1, "BELUM DIBAYAR"),
  rowAnnual("TAHUNAN KETUA PENOLONG AMIL", "PAK", 500, "B31702", "AKTIF", 1, "SUDAH DIBAYAR", "2025-01-31"),
  rowAnnual("ANUGERAH PENOLONG AMIL TERBAIK", "PAK", 400, "B31702", "AKTIF", 0, "—"),
]);

function rowTask(jenisElaun, kategoriPA, amaun, kodBajet, status, units, paymentStatus){
  return {
    id: `TASK-${jenisElaun}`.replace(/\s+/g,"_"),
    jenisElaun, kategoriPA, amaun, kodBajet, status, units,
    jumlah: amaun * units,
    paymentStatus
  };
}
function rowMeet(tarikh, jenisElaun, kategoriPA, amaun, kodBajet, statusHadir, paymentStatus, paidAt=null, program=null){
  return {
    id: `MEET-${tarikh}-${jenisElaun}`.replace(/\s+/g,"_"),
    tarikh, jenisElaun, kategoriPA, amaun, kodBajet, statusHadir,
    units: 1,
    jumlah: amaun * 1,
    paymentStatus, paidAt, program
  };
}
function rowAnnual(jenisElaun, kategoriPA, amaun, kodBajet, status, units, paymentStatus, paidAt=null){
  return {
    id: `ANNUAL-${jenisElaun}`.replace(/\s+/g,"_"),
    jenisElaun, kategoriPA, amaun, kodBajet, status, units,
    jumlah: amaun * units,
    paymentStatus, paidAt
  };
}

// ========== KPI (ringkas) ==========
const kpi = computed(() => ({
  tugasan: {
    units: sumUnits(tugasanHariIni.value),
    amount: sumAmount(tugasanHariIni.value),
  },
  mesyuarat: {
    units: mesyuaratBulanIni.value.length,
    amount: sumAmount(mesyuaratBulanIni.value),
    paid: sumPaid(mesyuaratBulanIni.value),
  },
  tahunan: {
    amount: sumAmount(tahunanTahunIni.value),
    paid: sumPaid(tahunanTahunIni.value),
    get unpaid(){ return this.amount - this.paid; }
  }
}));
const activeTab = ref(0);

// ========== HELPERS ==========
function formatCurrency(n){ return Number(n||0).toLocaleString("en-MY",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function sumUnits(arr){ return arr.reduce((s,r)=>s+Number(r.units||0),0); }
function sumAmount(arr){ return arr.reduce((s,r)=>s+Number(r.jumlah||0),0); }
function sumPaid(arr){ return arr.reduce((s,r)=>s+(r.paymentStatus==='SUDAH DIBAYAR'?Number(r.jumlah||0):0),0); }
function sumUnpaid(arr){ return arr.reduce((s,r)=>s+(r.paymentStatus==='BELUM DIBAYAR'?Number(r.jumlah||0):0),0); }
function variantAktif(status){ return status==='AKTIF' ? 'success':'secondary'; }
function variantBayaran(s){ return s==='SUDAH DIBAYAR' ? 'success' : (s==='BELUM DIBAYAR' ? 'warning' : 'secondary'); }
function fmt(iso){ return new Date(iso).toLocaleDateString('ms-MY',{day:'2-digit',month:'short',year:'numeric'}); }

</script>
