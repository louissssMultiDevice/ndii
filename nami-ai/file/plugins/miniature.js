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
    await m.react("🙀")
    let media = await targetMsg.download();
    let uploadedUrl = await UguuSe(media);
    if (!uploadedUrl.url) return m.reply('❌ Gagal upload media ke server.');
    const response = await axios.post(
      `https://ditss.vercel.app/api/ai/to-figure`,
      {
        url: uploadedUrl.url
      },
      {
        responseType: 'arraybuffer' 
      }
    );
    const buffer = Buffer.from(response.data);
    await ndii.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: '✅ Berhasil jadi miniature.'
      },
      { quoted: m }
    );
    
    await m.react("✨")

  } catch (e) {
    console.error(e);
    m.reply('❌ Terjadi error saat memproses.');
  }
}

imageToMini.help = ['img-to-mini (reply/kirim image)'];
imageToMini.tags = ['editor', 'ai', 'converter'];
imageToMini.command = ['image2mini', 'img2mini', 'miniatur', 'imgtominiatur', 'figure'];
imageToMini.limit = 1;

export default imageToMini;