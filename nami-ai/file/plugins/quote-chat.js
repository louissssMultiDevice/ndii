import axios from "axios";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Untuk __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let qc = async (m, { conn: ndii, text, command, reply, usedPrefix }) => {
  if (!text) return reply(`⚠️ Contoh penggunaan:\n${usedPrefix + command} Halo! Kami Tim NdiiCloud`);
  //await reply("⏳ Tunggu sebentar, sedang diproses...");

  let ppuser;
  try {
    ppuser = await ndii.profilePictureUrl(m.sender, "image");
  } catch {
    ppuser = "https://ditss.biz.id/media/image/mat5bg09.jpg";
  }

  // 🎨 warna random + putih
  const colors = [
    "#FFFFFF",
    "#000000",
    "#FFFFFF",
    "#000000",
    "#FFFFFF",
    "#000000",
  ];
  const backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  const json = {
    type: "quote",
    format: "png",
    backgroundColor,
    width: 812,
    height: 968,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: m.pushName || "Pengguna",
          photo: { url: ppuser },
        },
        text,
        replyMessage: {},
      },
    ],
  };

  try {
    const res = await axios.post("https://bot.lyo.su/quote/generate", json, {
      headers: { "Content-Type": "application/json" },
    });

    const buffer = Buffer.from(res.data.result.image, "base64");
    const tempPath = path.join(__dirname, `../database/sampah/${m.sender}.png`);

    fs.writeFile(tempPath, buffer, async (err) => {
      if (err) return reply("❌ Error membuat QC");

      await ndii.sendSticker(m.chat, tempPath, m, {
        packname: text || "DitssBot",
        author: `asuma multi device - ${m.pushName}` || "Ditss",
      });

      fs.unlinkSync(tempPath);
    });
  } catch (err) {
    console.error("[QC Error]:", err.message);
    reply("❌ Terjadi kesalahan saat membuat quote.");
  }
};

qc.help = ["qc"];
qc.tags = ["sticker", "fun"];
qc.command = ["qc"];
qc.limit = 1;

export default qc;