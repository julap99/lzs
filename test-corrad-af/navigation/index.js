export default [
  {
    "header": "Utama",
    "description": "",
    "child": [
      {
        "title": "Dashboard",
        "path": "/dashboard",
        "icon": "ic:outline-dashboard",
        "child": [],
        "meta": {}
      }
    ],
    "meta": {}
  },
  {
    "header": "Pentadbiran",
    "description": "Urus aplikasi anda",
    "child": [
      {
        "title": "Konfigurasi",
        "icon": "ic:outline-settings",
        "child": [
          {
            "title": "Persekitaran",
            "path": "/devtool/config/environment"
          },
          {
            "title": "Site Settings",
            "path": "/devtool/config/site-settings"
          }
        ]
      },
      {
        "title": "Penyunting Menu",
        "icon": "ci:menu-alt-03",
        "path": "/devtool/menu-editor",
        "child": []
      },
      {
        "title": "Urus Pengguna",
        "path": "/devtool/user-management",
        "icon": "ph:user-circle-gear",
        "child": [
          {
            "title": "Senarai Pengguna",
            "path": "/devtool/user-management/user",
            "icon": "",
            "child": []
          },
          {
            "title": "Senarai Peranan",
            "path": "/devtool/user-management/role",
            "icon": "",
            "child": []
          }
        ]
      },
      {
        "title": "Kandungan",
        "icon": "mdi:pencil-ruler",
        "child": [
          {
            "title": "Penyunting",
            "path": "/devtool/content-editor"
          },
          {
            "title": "Templat",
            "path": "/devtool/content-editor/template"
          }
        ]
      },
      {
        "title": "Penyunting API",
        "path": "/devtool/api-editor",
        "icon": "material-symbols:api-rounded",
        "child": []
      }
    ],
    "meta": {
      "auth": {
        "role": [
          "Developer"
        ]
      }
    }
  }
]