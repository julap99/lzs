export default [
  {
    header: "BF-PTPC",
    description: "Pengurusan Tunai dan Petty Cash",
    child: [
      {
        title: "BF-PTPC-MT-AG",
        icon: "ic:outline-dashboard",
        path: "/BF-PTPC/MT-AG/01",
        child: [],
        meta: {},
      },
      {
        title: "BF-PTPC-PC",
        icon: "ic:outline-dashboard",
        path: "/BF-PTPC/PC",
        child: [],
        meta: {},
      },
      {
        title: "BF-PTPC-DA",
        icon: "ic:outline-dashboard",
        path: "/BF-PTPC/DA",
        child: [],
        meta: {},
      },
      {
        title: "BF-PTPC-PE",
        icon: "ic:outline-dashboard",
        path: "/BF-PTPC/PE",
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
