import axios from 'axios';

let pakustadz = async (m, { conn: ndii, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✏️ Contoh penggunaan:\n${usedPrefix + command} Assalamualaikum`);

  await m.react("📖");
  
  try {
    // Random antara v1 atau v2
    const version = Math.random() > 0.5 ? 'v1' : 'v2';
    const apiUrl = `https://api.asuma.my.id/${version}/maker/pakustadz`;

    const response = await axios.post(
      apiUrl,
      {
        apikey: 'ndiiGanteng',
        teks: text
      },
      {
        responseType: 'arraybuffer',
        timeout: 60000
      }
    );

    const buffer = Buffer.from(response.data);

    await ndii.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `✅ Berhasil! (Version: ${version.toUpperCase()})`
      },
      { quoted: m }
    );
    
    await m.react("✅");

  } catch (e) {
    console.error(e);
    m.reply('❌ Gagal membuat gambar. Coba lagi nanti.');
  }
}

pakustadz.help = ['pakustadz <teks>'];
pakustadz.tags = ['islami', 'image', 'fun'];
pakustadz.command = ['pakustadz', 'ustadz', 'ustad', 'kyai'];
pakustadz.limit = 1;

export default pakustadz;