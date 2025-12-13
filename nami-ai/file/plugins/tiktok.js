import * as baileys from '@whiskeysockets/baileys';
import { fetchJson } from '../lib/utils/fetchJson.js';

const { delay } = baileys;

const tiktokDownloader = async (m, { conn: ndii, usedPrefix, command, args }) => {
  const text = args.join(' ');
  if (!text) return m.reply(`Example: ${usedPrefix + command} https://www.tiktok.com/@username/video/123456789 `);
  if (!text.includes('tiktok.com')) return m.reply('Url Tidak Mengandung Link TikTok!');

    m.reply(ress.wait)
  const handleTikTokData = async (data) => {
    const isPhotoMode = Array.isArray(data.images) && data.images.length > 0;

    if (isPhotoMode) {
      const maxImages = 10;
      const total = Math.min(data.images.length, maxImages);
      await m.reply(`📸 Mengirim ${total} dari ${data.images.length} foto...`);
      for (let i = 0; i < total; i++) {
        const url = data.images[i];
        if (url) {
          await ndii.sendFileUrl(m.chat, url, `📸 *Gambar ${i + 1}*`, m);
          await delay(1000);
        }
      }
      return true;
    }
    await ndii.sendFileUrl(
      m.chat,
      data.play,
      `🎵 *TikTok Video*\n\n*👤Author:* ${data.author.nickname} (@${data.author.unique_id})\n*🎬Judul:* ${data.title || '-'}\n*📊Views:* ${data.play_count}\n*❤️Likes:* ${data.digg_count}\n*💬Comments:* ${data.comment_count}\n*🔁Share:* ${data.share_count}`,
      m
    );
    await ndii.sendMessage(m.chat, {
      audio: { url: data.music_info.play },
      mimetype: 'audio/mpeg',
      fileName: `${data.music_info.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: data.music_info.title,
          body: `by ${data.music_info.author}`,
          thumbnailUrl: data.music_info.cover,
          sourceUrl: 'https://ndiicloud.privhandi.my.id',
          mediaType: 1,
          showAdAttribution: true
        }
      },
      quoted: m
    });
    const captionText = data.title || '-';
    const urls = [...captionText.matchAll(/(https?:\/\/[^\s]+)/g)].map(v => v[0]);

    const interactiveButtons = [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "📋 Copy Caption",
          id: "copy_caption",
          copy_code: captionText
        })
      }
    ];

    urls.slice(0, 3).forEach((link, i) => {
      interactiveButtons.push({
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: `🌐 Link ${i + 1}`,
          url: link
        })
      });
    });

    const interactiveMessage = {
      text: `📄 *Caption TikTok*\n\n${captionText}`,
      title: "📝 Informasi Tambahan",
      footer: "TikTok Downloader",
      interactiveButtons
    };

    //await Ditss.sendMessage(m.chat, interactiveMessage, { quoted: m });
    return true;
  };
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[TIKTOK] Percobaan ke-${attempt} untuk URL: ${text}`);
      const json = await fetchJson(`https://api.asuma.my.id/v1/downloader/tiktok?url=${encodeURIComponent(text)}`);

      if (!json.status || !json.result?.data) {
        throw new Error(`Percobaan ${attempt}: Data tidak valid`);
      }

      await handleTikTokData(json.result.data);
      return; 

    } catch (e) {
      lastError = e;
      console.warn(`[TIKTOK] Gagal percobaan ${attempt}: ${e.message}`);
      if (attempt < 3) {
      // await m.reply(`⚠️ Percobaan ${attempt} gagal, mencoba lagi dalam 2 detik...`);
        await delay(2000);
      }
    }
  }
  console.error('[TIKTOK] Semua percobaan gagal:', lastError);
//  m.reply('❌ Gagal mengambil data TikTok setelah 3x percobaan. Coba lagi nanti.');
};

tiktokDownloader.help = ['<url> - Download TikTok video + audio'];
tiktokDownloader.tags = ['downloader', 'tools'];
tiktokDownloader.command = ['tt', 'tiktok', 'tiktokvideo', 'ttmp4', 'ttdl'];
tiktokDownloader.limit = 1;

export default tiktokDownloader;