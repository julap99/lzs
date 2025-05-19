export default [
  {
    header: "BF-PTPC",
    description: "Pengurusan Tunai dan Petty Cash",
    child: [
      {
        title: "BF-PTPC-MT",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "MT-AG",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/MT/AG/01",
            child: [],
            meta: {},
          },
          {
            title: "MT-PT",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/MT/PT/01",
            child: [],
            meta: {},
          },
          {
            title: "MT-TK",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/MT/TK/01",
            child: [],
            meta: {},
          },
          {
            title: "MT-TT",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/MT/TT/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "BF-PTPC-PC",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "PC-BE",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/MT/01",
            child: [],
            meta: {},
          },
          {
            title: "PC-AA",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/PC",
            child: [],
            meta: {},
          },
          {
            title: "PC-TO",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PTPC/DA",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "BF-PTPC-DA",
        icon: "iconamoon:component-fill",
        chile: [],
        meta: {},
      },
      {
        title: "BF-PTPC-PE",
        icon: "iconamoon:component-fill",
        chile: [],
        meta: {},
      },
    ],
  },

  {
    header: "BF-PRF",
    description: "Profiling",
    child: [
      {
        title: "BF-PRF-MP",
        icon: "iconamoon:component-fill",
        child: [],
        meta: {},
      },
      {
        title: "Mengurus Konfigurasi",
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
            path: "/BF-PRF/KF/MD/01",
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
            title: "KF-RUU",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/KF/HK/01",
            child: [],
            meta: {},
          },
          {
            title: "KF-SHI",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/KF/HK/01",
            child: [],
            meta: {},
          },
          {
            title: "KF-AT",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/KF/HK/01",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "BF-PRF-AS",
        icon: "iconamoon:component-fill",
        child: [
          {
            title: "AS-QS",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/AS/QS/01",
            child: [],
            meta: {},
          },
          {
            title: "AS-QB",
            icon: "iconamoon:arrow-right-2-duotone",
            child: [],
            meta: {},
          },
          {
            title: "AS-FR",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/AS/FR/01",
            child: [],
            meta: {},
          },
          {
            title: "AS-UP",
            icon: "iconamoon:arrow-right-2-duotone",
            path: "/BF-PRF/AS/UP/01",
            child: [],
            meta: {},
          },
          {
            title: "AS-KA",
            icon: "iconamoon:arrow-right-2-duotone",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "BF-PRF-OR",
        icon: "iconamoon:component-fill",
        child: [],
        meta: {},
      },
      {
        title: "BF-PRF-TP",
        icon: "iconamoon:component-fill",
        child: [],
        meta: {},
      },
      {
        title: "BF-PRF-PL",
        icon: "iconamoon:component-fill",
        child: [],
        meta: {},
      },
    ],
  },

  {
    header: "Utama",
    description: "",
    child: [
      {
        title: "Dashboard",
        icon: "ic:outline-dashboard",
        child: [
          {
            title: "Dashboard Utama",
            path: "/dashboard",
            child: [],
            meta: {},
          },
          {
            title: "Dashboard Zakat",
            path: "/dashboard/dashboard2",
            child: [],
            meta: {},
          },
        ],
        meta: {},
      },
      {
        title: "Carian",
        path: "/carian",
        icon: "ph:magnifying-glass",
        child: [],
        meta: {},
      },
      {
        title: "Laporan",
        path: "/laporan",
        icon: "ph:chart-bar-fill",
        child: [],
        meta: {},
      },
    ],
    meta: {},
  },
  {
    header: "Fungsi",
    description: "",
    child: [
      {
        title: "Komponen",
        icon: "ph:gear-fine",
        child: [
          {
            title: "Amaran",
            path: "/komponen/amaran",
            child: [],
            meta: {},
          },
          {
            title: "Butang",
            path: "/komponen/butang",
            child: [],
            meta: {},
          },
          {
            title: "Lencana",
            path: "/komponen/lencana",
            child: [],
            meta: {},
          },
          {
            title: "Collapse",
            path: "/komponen/collapse",
            child: [],
            meta: {},
          },
          {
            title: "Dropdown",
            path: "/komponen/dropdown",
            child: [],
            meta: {},
          },
          {
            title: "Modal",
            path: "/komponen/modal",
            child: [],
            meta: {},
          },
          {
            title: "Progress Bar",
            path: "/komponen/progress-bar",
            child: [],
            meta: {},
          },
          {
            title: "Tab",
            path: "/komponen/tab",
            child: [],
            meta: {},
          },
        ],
      },
      {
        title: "Datatable",
        path: "/datatable",
        icon: "ph:table",
        child: [],
        meta: {},
      },
      {
        title: "Borang",
        path: "/borang",
        icon: "ph:clipboard-text",
        child: [],
      },
      {
        title: "Ikon",
        path: "/ikon",
        icon: "iconamoon:slightly-smiling-face",
        child: [],
        meta: {},
      },
      {
        title: "Tipografi",
        path: "/tipografi",
        icon: "ph:text-aa",
        child: [],
        meta: {},
      },
      {
        title: "Senarai Mesej",
        path: "/senarai-mesej",
        icon: "ic:outline-mail",
        child: [],
        meta: {},
      },
    ],
    meta: {},
  },
  {
    header: "Pentadbiran",
    description: "Urus aplikasi anda",
    child: [
      {
        title: "Konfigurasi",
        icon: "ic:outline-settings",
        child: [
          {
            title: "Persekitaran",
            path: "/devtool/config/environment",
          },
        ],
      },
      {
        title: "Penyunting Menu",
        icon: "ci:menu-alt-03",
        path: "/devtool/menu-editor",
        child: [],
      },
      {
        title: "Urus Pengguna",
        path: "/devtool/user-management",
        icon: "ph:user-circle-gear",
        child: [
          {
            title: "Senarai Pengguna",
            path: "/devtool/user-management/user",
            icon: "",
            child: [],
          },
          {
            title: "Senarai Peranan",
            path: "/devtool/user-management/role",
            icon: "",
            child: [],
          },
        ],
      },
      {
        title: "Kandungan",
        icon: "mdi:pencil-ruler",
        child: [
          {
            title: "Penyunting",
            path: "/devtool/content-editor",
          },
          {
            title: "Templat",
            path: "/devtool/content-editor/template",
          },
        ],
      },
      {
        title: "Penyunting API",
        path: "/devtool/api-editor",
        icon: "material-symbols:api-rounded",
        child: [],
      },
    ],
    meta: {
      auth: {
        role: ["Developer"],
      },
    },
  },
];
