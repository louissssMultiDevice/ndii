/* ============================================================================
 *  GLOBAL CONFIGURATION — NAMI-AI
 *  Author : ndiidepzX
 *  Year   : 2025
 * ==========================================================================*/
 
 // ── IMPORT MODULE
 ───────────────────────────────────────────────────────────────────
import chalk from 'chalk';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { watchFile, unwatchFile } from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// system
global.autogempa = true



// ── OWNER ───────────────────────────────────────────────────────────────────
global.owner = '6285800650661'

// ── BOT INFO ────────────────────────────────────────────────────────────────
global.info = {
  owner: [global.owner],
  botName: 'Nami-Ai',
  ownerName: 'ndii',
  brand: 'NdiiClouD',
  version: '2.0.0',
  tagline: 'Smart, Futuristic, Reliable',
  footer: '© Powered By Tim NdiiClouD'
}

// ── LIMIT CONFIG ────────────────────────────────────────────────────────────
global.limit = {
  free: 35,
  premium: 999,
  vip: 99999
}

// ── USER BADGE / ROLE SYMBOL FUTURISTIC ──────────────────────────────────────
global.user = {
  owner: '🜏',      // Owner - alkimia futuristik
  admin: '⚡',      // Admin - lightning / power
  premium: '⟆',    // Premium - high-tech symbol
  vip: '⟁',        // VIP - triangle futuristik
  limit: '✦',      // Limit - star sharp
  member: '◈',     // Member - geometric
  guest: '◇'       // Guest - hollow diamond
}

// ── SOCIAL & COMMUNITY LINKS ────────────────────────────────────────────────
global.ndii = {
  youtube: 'https://youtube.com/@NdiiClouD',
  website: 'https://ndiicloud.privhandi.my.id',
  instagram: 'https://www.instagram.com/@ndii.cloud',
  tiktok: 'https://tiktok.com/@ndii.cloud',
  github: 'https://github.com/louissssmultidevice',
  channel: 'https://whatsapp.com/channel/0029VazclOxBVJl7jkbqnW1e',
  channel2: 'https://whatsapp.com/channel/0029Vb69nLG23n3aRi3cpf2U',
  group: 'https://chat.whatsapp.com/LM2uMVGKGng11cLxYwbTNk?mode=hqrt2,
  groupId: 'Not Set',
  channelId: '120363416897292688@newsletter',
  channelId2: 'Not Set'
}

// ── MONEY / BALANCE DEFAULT ─────────────────────────────────────────────────
global.money = {
  free: 10_000,
  premium: 1_000_000,
  vip: 10_000_000
}

// ── API ENDPOINT ────────────────────────────────────────────────────────────
global.api = {
  ditss: 'https://ditss.vercel.app',
  ndiicloud: 'https://ndiicloud.privhandi.my.id'
 }

// ── RESPONSE MESSAGE TEMPLATE ───────────────────────────────────────────────
global.ress = {
  key: 'Apikey Anda telah habis',
  owner: `${global.user.owner} Fitur Khusus Owner!`,
  admin: `${global.user.admin} Fitur Khusus Admin!`,
  botAdmin: 'Bot bukan admin!',
  inGroup: 'Gunakan di group!',
  private: 'Gunakan di private chat!',
  limit: `${global.user.limit} Limit Anda telah habis!`,
  premium: `${global.user.premium} Khusus user premium!`,
  wait: 'Loading… Harap tunggu sebentar',
  error: 'Terjadi kesalahan! Mohon coba lagi',
  done: 'Selesai! ✅'
}

// ── CUSTOM STYLING & FUTURISTIC TOUCH ──────────────────────────────────────
global.style = {
  prefix: '⫷',    // prefix untuk command
  suffix: '⫸',
  separator: '⎯⎯⎯⎯', // line separator futuristik
  buttonSymbol: '⏣',  // tombol interaktif
  highlight: '⚛'      // highlight simbol futuristik
}


//db
global.tempatDB = 'database.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.tempatStore = 'baileys_store.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'settinganbot.js'"))
    import(`${file}?update=${Date.now()}`)
})
