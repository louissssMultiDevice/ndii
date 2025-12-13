import axios from 'axios'
import { fetchJson } from '../lib/utils/fetchJson.js'

let play = async (m, { conn: ndii, usedPrefix, text, command, reply }) => {
  if (!text) {
    return m.reply('What song do you want to play? *Example*: .play cupid')
  }
  
  try {
    m.reply("bentar bang")
    
    const searchUrl = `https://ditss.vercel.app/api/search/youtube?q=${encodeURIComponent(text)}`
    const resSearch = await fetchJson(searchUrl)
    if (!resSearch?.results?.[0]) {
      console.log('Struktur response:', resSearch)
      return m.reply('Tidak ditemukan hasil pencarian.')
    }
    const video = resSearch.results[0] 
    console.log('Video found:', video.title)
    const downloadUrl = `https://ditss.vercel.app/api/download/ytmp3?url=${encodeURIComponent(video.url)}`
    const resDownload = await axios.get(downloadUrl)
    const result = resDownload.data
    if (!result.status) {
      return m.reply(result.message || 'Gagal mengambil data MP3.')
    }
    if (!result.result?.link) {
      return m.reply('Link download tidak tersedia.')
    }
    
    await ndii.sendMessage(
      m.chat,
      {
        audio: { url: result.result.link },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`,
        contextInfo: {
          forwardingScore: 100000,
          isForwarded: true,
          externalAdReply: {
            showAdAttribution: false,
            containsAutoReply: true,
            mediaType: 1,
            renderLargerThumbnail: true,
            title: video.title,
            body: `Duration: ${video.duration || 'Unknown'}`,
            previewType: 'PHOTO',
            thumbnailUrl: video.thumbnail || 'https://telegra.ph/file/7d72a6f513123a113617a.jpg',
          },
        },
      },
      { quoted: m }
    )
    
    await ndii.sendMessage(m.chat, {
      react: { text: '✅', key: m.key },
    })

  } catch (error) {
    console.error('[PLAY ERROR]', error)
    m.reply('Terjadi kesalahan saat memproses permintaan: ' + error.message)
  }
}

// 🏷️ Metadata plugin
play.help = ['play <judul lagu>']
play.tags = ['downloader']
play.command = ['play']
play.limit = 3

export default play