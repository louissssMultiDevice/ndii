import { UguuSe } from '../lib/utils/uploader.js'
import axios from 'axios';

let imageToMini = async (m, { conn: ndii, usedPrefix, command }) => {
  try {
    let targetMsg = m.quoted ? m.quoted : m;
    let mime = (targetMsg.msg || targetMsg).mimetype || '';

    if (!mime || !/image\/(webp|jpeg|png)/.test(mime)) {
      return m.reply(
        `❌ Kirim atau reply gambar (jpg/png/webp) dengan caption *${usedPrefix + command}*`
      );
    }
    
    await m.react("🦖")
    let media = await targetMsg.download();
    let uploadedUrl = await UguuSe(media);
    if (!uploadedUrl.url) return m.reply('❌ Gagal upload media ke server.');
    const response = await axios.post(
      `https://ditss.vercel.app/api/ai/to-pacar`,
      {
        url: uploadedUrl.url
      },
      {
        responseType: 'arraybuffer', 
        timeout: 100000 
      }
    );
    const buffer = Buffer.from(response.data);

    await ndii.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: '✅ Berhasil menambahkan pasangan.'
      },
      { quoted: m }
    );
    
    await m.react("✨")

  } catch (e) {
    console.error(e);
    if (e.response) {
      m.reply(`❌ Server error: ${e.response.status}`);
    } else if (e.request) {
      m.reply('❌ Timeout: Server tidak merespon.');
    } else {
      m.reply('❌ Terjadi error saat memproses.');
    }
  }
}

imageToMini.help = ['topacar (reply/kirim image)'];
imageToMini.tags = ['editor', 'ai', 'fun'];
imageToMini.command = ['topacar', 'to-pacar'];
imageToMini.limit = 1;

export default imageToMini;