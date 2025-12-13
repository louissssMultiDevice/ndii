import { fetchJson } from '../lib/utils/fetchJson.js'
let rawgithub = async (m, { conn: ndii, usedPrefix, args, command }) => {
  if (!args[0]) {
    return m.reply(
      `⚠️ Masukkan URL GitHub!\n\nContoh:\n${usedPrefix + command} https://github.com/louissssmultidevice/nami-ai/blob/main/settinganbot.js`
    )
  }

  try {
    const apiUrl = `${api.ditss}/tools/github/raw-link?url=${encodeURIComponent(args[0])}`
    let res = await fetchJson(apiUrl)

    if (!res.status || !res.raw_url) {
      return m.reply(`❌ Gagal konversi URL GitHub.`)
    }

    await ndii.sendMessage(
      m.chat,
      {
        text: `✅ *Berhasil konversi ke RAW*\n\n📂 Repo: ${args[0]}\n🔗 Raw: ${res.raw_url}`
      },
      { quoted: m }
    )
  } catch (e) {
    console.error('[ERROR RAW GITHUB]', e)
    m.reply('❌ Terjadi error saat memproses URL GitHub.')
  }
}

rawgithub.help = ['rawgithub <url>']
rawgithub.tags = ['tools']
rawgithub.command = ['rawgithub', 'rawgit', 'ghraw', 'raw']

export default rawgithub