import fs from 'fs'
import os from 'os'
import path from 'path'
import axios from 'axios'
import { fetchJson } from '../lib/utils/fetchJson.js' 
import { CatBox } from '../lib/utils/uploader.js'

let enhancer = async (m, { conn: ndii, usedPrefix, args, command }) => {
  await ndii.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } })

  let cap = ''
  if (command === 'remini') cap = `*Type :* Ai Remini 🖼️\n*Result :* Success ✅`
  else if (command === 'hd') cap = `*Type :* Ai HD Foto 📸\n*Result :* Success ✅`
  else if (command === 'hdr') cap = `*Type :* Ai HDR 🖼️\n*Result :* Success ✅`

  let media
  const isImageUrl = (url) => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(url)
  let targetMsg = m.quoted ? m.quoted : m; 
  if (targetMsg.mtype?.includes('image')) {
    media = await ndii.downloadAndSaveMediaMessage(targetMsg)
  } 
  else if (args[0] && isImageUrl(args[0])) {
    try {
      const response = await axios.get(args[0], { responseType: 'arraybuffer' })
      const buffer = Buffer.from(response.data)
      const tempPath = path.join(os.tmpdir(), `image_${Date.now()}.jpg`)
      await fs.promises.writeFile(tempPath, buffer)
      media = tempPath
    } catch {
      return m.reply('❌ Gagal mengunduh gambar dari URL.')
    }
  } 
  else {
    return m.reply(
      `📷 Kirim gambar dengan caption *${usedPrefix + command}*, balas gambar, atau kirim URL gambar yang valid.\n\nJika video, gunakan *${usedPrefix}hdvid*`
    )
  }
  try {
    const catBoxUrl = await CatBox(media)
    let result
    try {
      const res = await fetchJson(`https://api.vreden.my.id/api/artificial/hdr?url=${catBoxUrl}&pixel=4`)
      if (!res.result?.data?.downloadUrls) throw 'API utama gagal'
      result = res.result.data.downloadUrls[0]
    } catch {
      const ana = await fetchJson(
        `https://beta.anabot.my.id/api/ai/toEnhanceArtImage?&imageUrl=${encodeURIComponent(catBoxUrl)}&apikey=freeApikey`
      )
      if (ana.status !== 200 || !ana.data?.result) throw 'API kedua gagal'
      result = ana.data.result
    }

    await ndii.sendMessage(
      m.chat,
      { image: { url: result }, caption: cap },
      { quoted: m }
    )
  } catch (e) {
    console.error('[ERROR HDR]', e)
    m.reply('❌ Terjadi kesalahan saat memproses gambar. Coba lagi nanti.')
  } finally {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
  }
}

enhancer.help = ['remini', 'hd', 'hdr']
enhancer.tags = ['ai', 'tools']
enhancer.command = ['remini', 'hd', 'hdr']
enhancer.limit = 2;

export default enhancer