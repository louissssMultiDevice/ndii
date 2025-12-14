import axios from 'axios'
import crypto from 'crypto'
async function nanobanana(prompt, image) {
  try {
    if (!prompt) throw new Error('Prompt is required.')
    if (!Buffer.isBuffer(image)) throw new Error('Image must be a buffer.')
    const inst = axios.create({
      baseURL: 'https://nanobananas.pro/api',
      headers: {
        origin: 'https://nanobananas.pro',
        referer: 'https://nanobananas.pro/editor',
        'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
      }
    })
    const up = await inst.post('/upload/presigned', {
      filename: Date.now() + '_ai.jpg',
      contentType: 'image/jpeg'
    })
    if (!up.data?.data?.uploadUrl) throw new Error('Upload url not found.')
    await axios.put(up.data.data.uploadUrl, image)
    const cf = await axios.post('https://api.nekolabs.web.id/tools/bypass/cf-turnstile', {
      url: 'https://nanobananas.pro/editor',
      siteKey: '0x4AAAAAAB8ClzQTJhVDd_pU'
    })
    if (!cf.data?.result) throw new Error('Failed to get cf token.')
    const task = await inst.post('/edit', {
      prompt,
      image_urls: [up.data.data.fileUrl],
      image_size: 'auto',
      turnstileToken: cf.data.result,
      uploadIds: [up.data.data.uploadId],
      userUUID: crypto.randomUUID(),
      imageHash: crypto.createHash('sha256').update(image).digest('hex').substring(0, 64)
    })
    if (!task.data?.data?.taskId) throw new Error('Task id not found.')
    while (true) {
      const r = await inst.get('/task/' + task.data.data.taskId)
      if (r.data?.data?.status === 'completed') return r.data.data.result
      await new Promise(a => setTimeout(a, 1000))
    }
  } catch (e) {
    throw new Error(e.message)
  }
}
let handler = async (m, { conn, text }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    if (!mime.startsWith('image/')) return m.reply('Mana gambarnya')
    if (!text) return m.reply('Promtnya Mna?')
    m.reply('Wait')
    const r = await nanobanana(text, await q.download())
    await conn.sendMessage(m.chat, { image: { url: r[0] } }, { quoted: m })
  } catch (e) {
    m.reply(e.message)
  }
}
