<p align="center">
  <img src="https://ndiicloud.privhandi.my.id/nami-ai/media/logo.png" alt="Nami-Ai Logo" width="180"/><br/>
  <b>Nami-Ai Base MD (ESM)</b><br/>
  <i>Lightweight WhatsApp Multi-Device Bot Base</i>
</p>

<p align="center">
  <a href="https://github.com/louissssMultiDevice/nami-ai/stargazers"><img src="https://img.shields.io/github/stars/louissssMultiDevice/nami-ai?style=for-the-badge" alt="Stars"/></a>
  <a href="https://github.com/louissssMultiDevice/nami-ai/network/members"><img src="https://img.shields.io/github/forks/louissssMultiDevice/nami-ai?style=for-the-badge" alt="Forks"/></a>
  <a href="https://github.com/louissssMultiDevice/nami-ai/actions"><img src="https://img.shields.io/github/actions/workflow/status/louissssMultiDevice/nami-ai/node.js.yml?style=for-the-badge&label=build" alt="Build Status"/></a>
  <a href="https://www.codefactor.io/repository/github/louissssMultiDevice/nami-ai"><img src="https://www.codefactor.io/repository/github/louissssMultiDevice/nami-ai/badge?style=for-the-badge" alt="CodeFactor"/></a>
  <a href="https://github.com/louissssMultiDevice/nami-ai"><img src="https://img.shields.io/github/license/louissssMultiDevice/nami-ai?style=for-the-badge" alt="License"/></a>
  <a href="https://github.com/WhiskeySockets/Baileys"><img src="https://img.shields.io/badge/baileys-whatsapp%20api-blue?style=for-the-badge" alt="Baileys"/></a>
  <img src="https://img.shields.io/badge/node-%3E=20.x-green?style=for-the-badge" alt="Node.js 20+"/>
</p>

---

## 🤖 Nami-Ai Base MD (ESM)

Base WhatsApp Bot Multi Device dengan struktur **ECMAScript Modules (ESM)**  
Didesain ringan, modern, dan fleksibel untuk developer yang ingin membangun bot WhatsApp dari nol.

> 💡 **Cocok untuk belajar, eksperimen, atau bikin bot WhatsApp custom.**  
> Support Node.js 20+, base sudah mendukung WhatsApp Button.

---

## ⚡ Quick Start

```bash
git clone https://github.com/louissssMultiDevice/nami-ai
cd nami-ai
npm install
node index.js

> Pastikan Node.js versi 20.x atau terbaru.




---

✨ Fitur Utama

🔹 Multi Device Support (Baileys)

🔹 Struktur Modern ESM

🔹 2 Gaya Development: Case Handler & Plugins System

🔹 Modular & Mudah Dikembangkan (AI, game, toko, dsb)

🔹 Support WhatsApp Button

🔹 Tidak ada fitur bawaan, murni untuk belajar/eksperimen

🔹 Open Source & Kontributif



---

📁 Struktur Project

nami-ai-esm/
│── index.js             # Entry point
│── WhatsApp.js          # Handler utama (case & plugins)
│── config.js            # Konfigurasi global
│── package.json
│── README.md
│
├── database/            # Penyimpanan data
│   ├── baileys_store.json
│   ├── database.json
│   ├── error.json
│   └── sampah/
│
├── lib/                 # Library & helper
│   ├── sticker.js
│   ├── fetchBuffer.js
│   ├── myfunction.js
│   ├── ai/
│   ├── func/
│   └── utils/
│
├── plugins/             # Plugins command
│   └── example.js
│
└── source/              # Backend tambahan
    ├── dashboard.js
    ├── database.js
    ├── loadDatabase.js
    └── server.js


---

⚙️ Konfigurasi (config.js)

global.owner = "6285800650661";
global.info = {
  owner: ['6285800650661'],
  namabot: 'Nami-Ai',
  nama_owner: 'Ndii'
};
global.limit = { free: 35, premium: 999, vip: 99999 };
global.user = {
  owner: '🜏', admin: '⚡', premium: '⟆', limit: '✦',
  vip: '⟁', member: '◈', guest: '◇'
};
global.money = { free: 10000, premium: 1000000, vip: 10000000 };
global.api = { ditss: "https://api-ditss.vercel.app", example: "https://example.com/api" };
global.ress = {
  key: 'Apikey Anda telah habis',
  owner: `${global.user.owner} Fitur Khusus Owner!`,
  admin: `${global.user.admin} Fitur Khusus Admin!`,
  BotAdmin: 'Bot Bukan Admin!',
  ingroup: 'Gunakan di Group!',
  private: 'Gunakan di Privat Chat!',
  limit: `${global.user.limit} Limit Anda Telah Habis!`,
  premium: `${global.user.premium} Khusus User Premium!`,
  wait: 'Loading...',
  error: 'Error!',
  done: 'Done'
};
global.tempatDB = 'database.json';
global.tempatStore = 'baileys_store.json';


---

🧑‍💻 Gaya Development

Case Handler (WhatsApp.js):

case 'ping': {
   m.reply("Pong 🏓");
}
break;

Plugin System (plugins/example.js):

export default {
  command: ['menu', 'help'],
  handler: async (m, { conn }) => {
    await m.reply("Ini contoh plugin menu ✨");
  }
}


---

📚 Referensi & Dokumentasi

Baileys WhatsApp API

ECMAScript Modules (ESM)

Node.js Docs

Wiki Nami-Ai



---

🤝 Kontribusi & Donasi

Pull request & issue welcome!

Saweria

Trakteer

Contact WhatsApp: 6285800650661



---

<p align="center"><sub>© Tim NdiiCloud</sub></p>
```