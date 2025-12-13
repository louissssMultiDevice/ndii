import axios from 'axios';

let iqc = async (m, { conn: ndii, text, usedPrefix, command }) => {
  if (!text) return m.reply(`📱 Contoh penggunaan:\n${usedPrefix + command} Hello world`);

  await m.react("💬");
  
  try {
    const apiUrl = `https://ditss.vercel.app/api/maker/imessage`;

    const response = await axios.post(
      apiUrl,
      {
        text: text
      },
      {
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );

    const buffer = Buffer.from(response.data);

    await ndii.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `💬 ${text}`
      },
      { quoted: m }
    );
    
    await m.react("✅");

  } catch (e) {
    console.error(e);
    m.reply('❌ Gagal membuat iPhone chat. Coba lagi nanti.');
  }
}

iqc.help = ['iqc <teks>'];
iqc.tags = ['maker', 'fun', 'image'];
iqc.command = ['iqc', 'imessage', 'iphonechat', 'ichat'];
iqc.limit = 1;

export default iqc;