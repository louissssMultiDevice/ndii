import { UguuSe } from '../lib/utils/uploader.js'

let removebg = async (m, { conn: ndii, usedPrefix, command }) => {
  try {
    let targetMsg = m.quoted ? m.quoted : m;
    let mime = (targetMsg.msg || targetMsg).mimetype || '';

    if (!mime || !/image\/(webp|jpeg|png)/.test(mime)) {
      return m.reply(
        `❌ Kirim atau reply gambar (jpg/png/webp) dengan caption *${usedPrefix + command}*`
      );
    }

    let media = await targetMsg.download();
    let uploadedUrl = await UguuSe(media);
    if (!uploadedUrl.url) return m.reply('❌ Gagal upload media ke server.');

    let apiUrl = `https://api.asuma.my.id/v1/image/removebg?url=${encodeURIComponent(uploadedUrl.url)}`
    let res = await fetch(apiUrl);
    let json = await res.json();

    if (!json.status || !json.result) {
      return m.reply('❌ Gagal menghapus background.');
    }

    await ndii.sendMessage(
      m.chat,
      {
        image: { url: json.result },
        caption: '✅ Background berhasil dihapus!'
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    m.reply('❌ Terjadi error saat memproses.');
  }
}

removebg.help = ['removebg (reply/kirim image)'];
removebg.tags = ['editor', 'ai'];
removebg.command = ['removebg', 'rbg', 'remove-bg'];
removebg.limit = 1;

export default removebg;
