import { fetchJson } from '../lib/utils/fetchJson.js'

let ssweb = async (m, { conn: ndii, usedPrefix, args, command }) => {
  if (!args[0]) {
    return m.reply(
      `⚠️ Masukkan URL website yang mau di-screenshot!\n\nContoh:\n${usedPrefix + command} google.com`
    )
  }

  try {
    let url = args[0]

    // kalau user cuma masukin domain tanpa http/https
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }

    const apiUrl = `${api.ditss}/api/tools/ssweb?apikey=free&url=${encodeURIComponent(url)}`
    let res = await fetchJson(apiUrl)

    if (!res.status || !res.result) {
      return m.reply('❌ Gagal mengambil screenshot website.')
    }

    await ndii.sendMessage(
      m.chat,
      {
        image: { url: res.result },
        caption: `✅ Screenshot berhasil diambil!\n\n🌍 URL: ${url}`
      },
      { quoted: m }
    )
  } catch (e) {
    console.error('[ERROR SSWEB]', e)
    m.reply('❌ Terjadi error saat mengambil screenshot website.')
  }
}

ssweb.help = ['ssweb <url>']
ssweb.tags = ['tools']
ssweb.command = ['ssweb', 'screenshotweb']

export default ssweb