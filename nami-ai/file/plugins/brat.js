import axios from 'axios';

let brat = async (m, { conn: ndii, text, command, reply, usedPrefix }) => {
  if (!text) return reply(`⚠️ Contoh penggunaan:\n${usedPrefix + command} ndiiCloud`);
  if (text.length > 250) return reply("⚠️ Karakter terbatas, maksimal 250!");
  await m.react("🐱")
  try {
    let res = await axios.post(
      `https://api.asuma.my.id/v2/maker/brat`,
      {
        apikey: 'ndiiGanteng',
        text: text
      },
      {
        responseType: 'arraybuffer'
      }
    );

    let buffer = Buffer.from(res.data);

    await ndii.sendSticker(m.chat, buffer, m, {
      packname: text,
      author: `NdiiCloud`,
    });
  } catch (err) {
    console.error(err);
    if (err.response) {
      reply(`❌ Error ${err.response.status}: ${err.response.statusText}`);
    } else if (err.request) {
      reply("❌ Tidak bisa terhubung ke server");
    } else {
      reply("❌ Gagal membuat stiker. Coba lagi nanti.");
    }
  }
};

brat.help = ["brat"];
brat.tags = ["sticker", "fun"];
brat.command = ["brat", "bratt"];
brat.limit = 1;

export default brat;