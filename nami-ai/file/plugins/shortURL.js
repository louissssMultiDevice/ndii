import { fetchJson } from '../lib/utils/fetchJson.js'

let tinyurl = async (m, { conn: ndii, usedPrefix, args, command }) => {
  if (!args[0]) {
    return m.reply(
      `⚠️ Masukkan URL yang mau di-shortener!\n\nContoh:\n${usedPrefix + command} api-ndii.vercel.app`
    )
  }

  try {
    let url = args[0]
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }

    const apiUrl = `${api.ndii}/tools/tinyurl?url=${encodeURIComponent(url)}`
    let res = await fetchJson(apiUrl)

    if (!res.status || !res.result) {
      return m.reply('❌ Gagal membuat shortlink TinyURL.')
    }

    await ndii.sendMessage(
      m.chat,
      {
        text: `✅ *Berhasil dipendekkan!*\n\n🌍 Original: ${url}\n🔗 Short: ${res.result}`
      },
      { quoted: m }
    )
  } catch (e) {
    console.error('[ERROR TINYURL]', e)
    m.reply('❌ Terjadi error saat membuat shortlink.')
  }
}

tinyurl.help = ['tinyurl <url>']
tinyurl.tags = ['tools']
tinyurl.command = ['tinyurl', 'shorturl', 'shortlink']
tinyurl.admin = false
tinyurl.group = false

export default tinyurl