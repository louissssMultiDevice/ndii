import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'
import fs from 'fs'
import * as cheerio from 'cheerio'
/**
 * Upload file ke CDN Ditss.biz.id
 */
export async function AsumaCdn(filePath) {
  try {
    const form = new FormData()
    form.append("file", fs.createReadStream(filePath))

    const { data } = await axios.post(
      "https://cdn.ditss.biz.id/upload",
      form,
      { headers: { ...form.getHeaders() } }
    )

    return data.url 
  } catch (error) {
    console.error("DitssToUrl Error:", error.response?.data || error.message)
    throw new Error("Gagal upload ke CDN Ditss")
  }
}
/**
 * Upload buffer ke Uguu.se
 */
export async function UguuSe(buffer) {
  try {
    const form = new FormData()
    const input = Buffer.from(buffer)
    const { ext } = await fileTypeFromBuffer(buffer)
    form.append('files[]', input, { filename: 'data.' + ext })
    const { data } = await axios.post('https://uguu.se/upload.php', form, {
      headers: { ...form.getHeaders() }
    })
    return data.files[0]
  } catch (e) {
    throw e
  }
}

/**
 * Upload file ke pomf.lain.la
 */
export async function pomfCDN(filePath) {
  try {
    const fileStream = fs.createReadStream(filePath)
    const formData = new FormData()
    formData.append('files[]', fileStream)

    const { data } = await axios.post('https://pomf.lain.la/upload.php', formData, {
      headers: { ...formData.getHeaders() }
    })
    return data.files[0].url
  } catch (error) {
    console.error('Error at pomf uploader in lib/utils/uploader.js:', error)
    return 'Terjadi Kesalahan'
  }
}

/**
 * Upload ke telegra.ph
 */
export async function TelegraPh(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('File not found')
  try {
    const form = new FormData()
    form.append('file', fs.createReadStream(filePath))
    const { data } = await axios.post('https://telegra.ph/upload', form, {
      headers: { ...form.getHeaders() }
    })
    return 'https://telegra.ph' + data[0].src
  } catch (err) {
    throw new Error(String(err))
  }
}

/**
 * Upload ke catbox.moe
 */
export async function CatBox(filePath) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('userhash', '')
  form.append('fileToUpload', fs.createReadStream(filePath))
  const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0'
    }
  })
  return data
}

/**
 * Upload file ke Uguu via path
 */
export async function UploadFileUgu(input) {
  try {
    const form = new FormData()
    form.append('files[]', fs.createReadStream(input))
    const { data } = await axios.post('https://uguu.se/upload.php', form, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        ...form.getHeaders()
      }
    })
    return data.files[0]
  } catch (err) {
    throw err
  }
}

/**
 * Upload file ke GitHub CDN DitssCloud
 */
export async function DitssCloudUrl(filePath) {
  try {
    const buffer = fs.readFileSync(filePath)
    const type = await fileTypeFromBuffer(buffer) // ✅ sudah fix
    const ext = type?.ext || 'bin'
    const mime = type?.mime || 'application/octet-stream'
    const filename = `${Date.now().toString(36)}.${ext}`
    const mediaPath = `media/${filename}`
    const contentBase64 = buffer.toString('base64')

    const githubToken = process.env.GITHUB_TOKEN || 'ghp_isi_token_disini'
    const owner = 'ditss-dev'
    const repo = 'Baileysss'
    const branch = 'main'
    const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${mediaPath}`

    await axios.put(apiURL, {
      message: `Upload via bot: ${filename}`,
      content: contentBase64,
      branch
    }, {
      headers: {
        Authorization: `token ${githubToken}`,
        'User-Agent': 'wa-bot-uploader',
        Accept: 'application/vnd.github+json'
      }
    })

    return {
      url: `https://ditss.cloud/${mediaPath}`,
      ext,
      mime
    }
  } catch (error) {
    console.error('DitssCloudUrl Error:', error.response?.data || error.message)
    throw new Error('Gagal upload ke GitHub CDN')
  }
}

/**
 * Convert WebP ke MP4 (via ezgif)
 */
export async function webp2mp4File(url) {
  try {
    const res = await axios.get(`https://ezgif.com/webp-to-mp4?url=${url}`)
    const $ = cheerio.load(res.data)
    const file = $('input[name="file"]').attr('value')
    if (!file) throw new Error('Gagal mendapatkan file dari respon pertama.')

    const data = new URLSearchParams({ file, convert: 'Convert WebP to MP4!' })
    const res2 = await axios.post(`https://ezgif.com/webp-to-mp4/${file}`, data)
    const $2 = cheerio.load(res2.data)
    const link = $2('div#output > p.outfile > video > source').attr('src')
    if (!link) throw new Error('Gagal mendapatkan link hasil konversi.')

    return `https:${link}`
  } catch (error) {
    console.error('webp2mp4File Error:', error.message)
    throw error
  }
}