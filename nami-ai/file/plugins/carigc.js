import axios from "axios";

let carigc = async (m, { conn: ndii, text, command, reply, usedPrefix }) => {
  if (!text) return reply(`⚠️ Contoh penggunaan:\n${usedPrefix + command} mabar`);
  if (text.length > 100) return reply("⚠️ Kata kunci terlalu panjang, maksimal 100 karakter!");
  await m.react("🔍");

  try {
    let res = await axios.get(`https://www.ditss.biz.id/api/search/group?q=${encodeURIComponent(text)}`);
    let data = res.data;

    if (!data.status || !data.result || data.result.length === 0) {
      return reply("❌ Grup tidak ditemukan!");
    }

    // batasi maksimal 20 hasil
    let results = data.result.slice(0, 20);

    let teks = `📂 *Hasil Pencarian Grup WhatsApp*\n🔑 Kata kunci: *${text}*\n\n`;
    results.forEach((gc, i) => {
      teks += `*${i + 1}. ${gc.Name}*\n📄 ${gc.Description}\n🔗 Link: ${gc.Link}\n\n`;
    });

    await ndii.sendMessage(m.chat, { text: teks }, { quoted: m });
  } catch (err) {
    console.error(err);
    if (err.response) {
      reply(`❌ Error ${err.response.status}: ${err.response.statusText}`);
    } else if (err.request) {
      reply("❌ Tidak bisa terhubung ke server API");
    } else {
      reply("❌ Terjadi kesalahan, coba lagi nanti.");
    }
  }
};

carigc.help = ["carigc <kata kunci>"];
carigc.tags = ["tools"];
carigc.command = ["carigc", "cari-gc"];
carigc.limit = 1;

export default carigc;