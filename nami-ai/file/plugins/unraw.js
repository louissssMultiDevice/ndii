import { fetchJson } from '../lib/utils/fetchJson.js'

let unrawgithub = async (m, { conn: ndii, usedPrefix, args, command }) => {
  if (!args[0]) {
    return m.reply(
      `⚠️ Masukkan URL RAW GitHub!\n\nContoh:\n${usedPrefix + command} https://raw.githubusercontent.com/ditss-cloud/asuma.esm/main/config.js`
    )
  }

  try {
    const apiUrl = `${api.ditss}/tools/github/unraw?url=${encodeURIComponent(args[0])}`
    let res = await fetchJson(apiUrl)

    if (!res.status || !res.github_url) {
      return m.reply(`❌ Gagal konversi RAW GitHub ke link asli.`)
    }

    await ndii.sendMessage(
      m.chat,
      {
        text: `✅ *Berhasil konversi ke URL GitHub asli*\n\n📂 Raw: ${args[0]}\n🔗 GitHub: ${res.github_url}`
      },
      { quoted: m }
    )
  } catch (e) {
    console.error('[ERROR UNRAW GITHUB]', e)
    m.reply('❌ Terjadi error saat memproses URL RAW GitHub.')
  }
}

unrawgithub.help = ['unrawgithub <url>']
unrawgithub.tags = ['tools']
unrawgithub.command = ['unrawgithub', 'unrawgit', 'ghunraw', 'unraw']
unrawgithub.admin = false
unrawgithub.group = false

export default unrawgithub