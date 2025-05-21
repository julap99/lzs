export default [
  {
    header: "BF-PTPC",
    description: "Pengurusan Tunai dan Petty Cash",
    child: [
      {
        title: "Mengurus Tunai",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Agihan Lain",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/MT/AG/01",
            child: [],
            meta: {},
          },
          {
            title: "Pemulangan Tunai",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/MT/PT/01",
            child: [],
            meta: {},
          },
          {
            title: "Tunai Kaunter",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/MT/TK/01",
            child: [],
            meta: {},
          },
          {
            title: "Agih Tunai Kaunter",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/MT/TT/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "Petty Cash",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Mengurus Petty Cash",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/PC/BE/01",
            child: [],
            meta: {},
          },
          {
            title: "Tunai Dilapangan",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/PC/TD/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
    ],
  },

  {
    header: "BF-TNI",
    description: "Pengurusan Tunai",
    child: [
      {
        title: "Mengurus Tunai",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Kemasukan Tunai",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-TNI/MT/KT/01",
            child: [],
            meta: {},
          },
          {
            title: "Tunai Kaunter",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-TNI/MT/TK/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
    ],
  },

  {
    header: "BF-PRF",
    description: "Profiling",
    child: [
      {
        title: "Konfigurasi",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Had Kifayah",
            icon: "iconamoon:arrow-right-2-duotone",
            child: [
              {
                title: "Admin",
                icon: "iconamoon:arrow-right-2-duotone",
                path: "/BF-PRF/KF/HK/admin",
                child: [],
                meta: {},
              },
              {
                title: "Pelulus",
                icon: "iconamoon:arrow-right-2-duotone",
                path: "/BF-PRF/KF/HK/pelulus",
                child: [],
                meta: {},
              },
            ],
            meta: {},
          },
          {
            title: "Multidimensi",
            icon: "iconamoon:arrow-right-2-duotone",
            child: [
              {
                title: "Admin",
                icon: "iconamoon:arrow-right-2-duotone",
                path: "/BF-PRF/KF/MD/admin",
                child: [],
                meta: {},
              },
              {
                title: "Pelulus",
                icon: "iconamoon:arrow-right-2-duotone",
                path: "/BF-PRF/KF/MD/pelulus",
                child: [],
                meta: {},
              },
            ],
            meta: {},
          },
          {
            title: "Kelulusan Data",
            icon: "iconamoon:arrow-right-2-duotone",
            child: [
              {
                title: "Admin",
                icon: "iconamoon:arrow-right-2-duotone",
                path: "/BF-PRF/KF/RUU/admin",
                child: [],
                meta: {},
              },
              {
                title: "Pelulus",
                icon: "iconamoon:arrow-right-2-duotone",
                path: "/BF-PRF/KF/RUU/pelulus",
                child: [],
                meta: {},
              },
            ],
            meta: {},
          },
          {
            title: "Household / Infividu",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/KF/SHI",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "Asnaf",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Pendaftaran Pantas (Single)",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/AS/QS/01",
            child: [],
            meta: {},
          },
          // {
          //   title: "AS-QB",
          //   icon: "iconamoon:arrow-right-2-duotone",
          //   child: [],
          //   meta: {},
          // },
          {
            title: "Pendaftaran Lengkap",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/AS/FR/01",
            child: [],
            meta: {},
          },
          {
            title: "Kemaskini",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/AS/UP/01",
            child: [],
            meta: {},
          },
          // {
          //   title: "AS-KA",
          //   icon: "iconamoon:arrow-right-2-duotone",
          //   child: [],
          //   meta: {},
          // },
        ],
        meta: {},
      },
      {
        title: "Organisasi",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Pendaftaran Profil",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/TP/PP/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "Third Party",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Pendaftaran Profil",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/TP/PP/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
    ],
  },

  {
    header: "BF-BTN",
    description: "Pengurusan Bantuan",
    child: [
      {
        title: "Konfigurasi",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Selenggara",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-BTN/KB/SB/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "Permohonan",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Bantuan Bulk",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-BTN/PB/BP/01",
            child: [],
            meta: {},
          },
          {
            title: "Pembatalan",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-BTN/PB/BTLB/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
    ],
  },

  {
    header: "BF-PA",
    description: "Pengurusan Penolong Amil",
    child: [
      {
        title: "Pendaftaran",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "PIC Masjid",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PA/PP/PM/01",
            child: [],
            meta: {},
          },
          {
            title: "Pra Daftar Penolong Amil",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PA/PP/PD/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
    ],
  },

  {
    header: "BF-PS",
    description: "Pentadbir Sistem",
    child: [
      {
        title: "Peranan & Kebenaran",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Konfigurasi Peranan",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PS/PPK/KP",
            child: [],
            meta: {},
          },
          {
            title: "Kebenaran Kumpulan Pengguna",
            icon: "iconamoon:arrow-right-2-duotone",
            child: [
              {
                title: "Admin",
                icon: "iconamoon:arrow-right-2-duotone",
                path: "/BF-PS/PPK/KKP/admin",
                child: [],
                meta: {},
              },
              {
                title: "NAS",
                icon: "iconamoon:arrow-right-2-duotone",
                path: "/BF-PS/PPK/KKP/nas",
                child: [],
                meta: {},
              },
            ],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "Penyelenggaraan kod",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "Admin",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PS/PK/admin",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
    ],
  },

  // {
  //   header: "Utama",
  //   description: "",
  //   child: [
  //     {
  //       title: "Dashboard",
  //       icon: "ic:outline-dashboard",
  //       child: [
  //         {
  //           title: "Dashboard Utama",
  //           path: "/dashboard",
  //           child: [],
  //           meta: {},
  //         },
  //         {
  //           title: "Dashboard Zakat",
  //           path: "/dashboard/dashboard2",
  //           child: [],
  //           meta: {},
  //         },
  //       ],
  //       meta: {},
  //     },
  //     {
  //       title: "Carian",
  //       path: "/carian",
  //       icon: "ph:magnifying-glass",
  //       child: [],
  //       meta: {},
  //     },
  //     {
  //       title: "Laporan",
  //       path: "/laporan",
  //       icon: "ph:chart-bar-fill",
  //       child: [],
  //       meta: {},
  //     },
  //   ],
  //   meta: {},
  // },
  // {
  //   header: "Fungsi",
  //   description: "",
  //   child: [
  //     {
  //       title: "Komponen",
  //       icon: "ph:gear-fine",
  //       child: [
  //         {
  //           title: "Amaran",
  //           path: "/komponen/amaran",
  //           child: [],
  //           meta: {},
  //         },
  //         {
  //           title: "Butang",
  //           path: "/komponen/butang",
  //           child: [],
  //           meta: {},
  //         },
  //         {
  //           title: "Lencana",
  //           path: "/komponen/lencana",
  //           child: [],
  //           meta: {},
  //         },
  //         {
  //           title: "Collapse",
  //           path: "/komponen/collapse",
  //           child: [],
  //           meta: {},
  //         },
  //         {
  //           title: "Dropdown",
  //           path: "/komponen/dropdown",
  //           child: [],
  //           meta: {},
  //         },
  //         {
  //           title: "Modal",
  //           path: "/komponen/modal",
  //           child: [],
  //           meta: {},
  //         },
  //         {
  //           title: "Progress Bar",
  //           path: "/komponen/progress-bar",
  //           child: [],
  //           meta: {},
  //         },
  //         {
  //           title: "Tab",
  //           path: "/komponen/tab",
  //           child: [],
  //           meta: {},
  //         },
  //       ],
  //     },
  //     {
  //       title: "Datatable",
  //       path: "/datatable",
  //       icon: "ph:table",
  //       child: [],
  //       meta: {},
  //     },
  //     {
  //       title: "Borang",
  //       path: "/borang",
  //       icon: "ph:clipboard-text",
  //       child: [],
  //     },
  //     {
  //       title: "Ikon",
  //       path: "/ikon",
  //       icon: "iconamoon:slightly-smiling-face",
  //       child: [],
  //       meta: {},
  //     },
  //     {
  //       title: "Tipografi",
  //       path: "/tipografi",
  //       icon: "ph:text-aa",
  //       child: [],
  //       meta: {},
  //     },
  //     {
  //       title: "Senarai Mesej",
  //       path: "/senarai-mesej",
  //       icon: "ic:outline-mail",
  //       child: [],
  //       meta: {},
  //     },
  //   ],
  //   meta: {},
  // },
  // {
  //   header: "Pentadbiran",
  //   description: "Urus aplikasi anda",
  //   child: [
  //     {
  //       title: "Konfigurasi",
  //       icon: "ic:outline-settings",
  //       child: [
  //         {
  //           title: "Persekitaran",
  //           path: "/devtool/config/environment",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Penyunting Menu",
  //       icon: "ci:menu-alt-03",
  //       path: "/devtool/menu-editor",
  //       child: [],
  //     },
  //     {
  //       title: "Urus Pengguna",
  //       path: "/devtool/user-management",
  //       icon: "ph:user-circle-gear",
  //       child: [
  //         {
  //           title: "Senarai Pengguna",
  //           path: "/devtool/user-management/user",
  //           icon: "",
  //           child: [],
  //         },
  //         {
  //           title: "Senarai Peranan",
  //           path: "/devtool/user-management/role",
  //           icon: "",
  //           child: [],
  //         },
  //       ],
  //     },
  //     {
  //       title: "Kandungan",
  //       icon: "mdi:pencil-ruler",
  //       child: [
  //         {
  //           title: "Penyunting",
  //           path: "/devtool/content-editor",
  //         },
  //         {
  //           title: "Templat",
  //           path: "/devtool/content-editor/template",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Penyunting API",
  //       path: "/devtool/api-editor",
  //       icon: "material-symbols:api-rounded",
  //       child: [],
  //     },
  //   ],
  //   meta: {
  //     auth: {
  //       role: ["Developer"],
  //     },
  //   },
  // },
];
