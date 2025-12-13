import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Export fungsi utama
const cimage = async (m, { conn: ndii, args, usedPrefix }) => {
    let fullPrompt = args.join(" ");

    switch (args[0]) {
        case 'style': {
            const style = args[1];
            const prompt = args.slice(2).join(" ");

            if (!style || !prompt) return m.reply("❌ Masukkan style dan prompt.");
            m.reply("⏳ Sedang membuat gambar...");

            try {
                const apiUrl = `https://api.asuma.my.id/v1/ai/unrestricted?prompt=${encodeURIComponent(prompt)}&style=${encodeURIComponent(style)}`;
                const result = await axios.get(apiUrl);
 //m.reply(result)
               await ndii.sendMessage(
                    m.chat,
                    {
                        image: { url: result.data.url },
                        caption: `🎨 *AI Image Generator*\n\n📝 Prompt: *${prompt}*\n🎭 Style: *${style}*`
                    },
                    { quoted: m }
                );
            } catch {
                m.reply("❌ Terjadi kesalahan saat membuat gambar.");
            }
            break;
        }

        default: {
            if (!fullPrompt) {
                const teks = `🎨 *AI Custom Image Generator*\n\nSilakan masukkan prompt.\n\nContoh:\n.cimage cewek memakai jas formal`;

                const buttons = [
                    {
                        buttonId: "cimage",
                        buttonText: { displayText: "🎨 Buat Gambar" },
                        type: 4,
                        nativeFlowInfo: {
                            name: "request_welcome",
                            paramsJson: JSON.stringify({
                                title: "Masukkan prompt gambar",
                                description: "Contoh: cewek berkacamata",
                                button: "Kirim Prompt"
                            })
                        }
                    }
                ];

                return ndii.sendMessage(
                    m.chat,
                    {
                        text: teks,
                        footer: `${global.info.footer}`,
                        buttons,
                        headerType: 1,
                        viewOnce: true
                    },
                    { quoted: m }
                );
            }

            const styles = [
                { id: "photorealistic", title: "Photorealistic", desc: "Gaya realistis seperti foto asli" },
                { id: "digital-art", title: "Digital Art", desc: "Ilustrasi modern digital" },
                { id: "impressionist", title: "Impressionist", desc: "Lukisan sapuan kuas klasik" },
                { id: "anime", title: "Anime", desc: "Gaya kartun Jepang" },
                { id: "fantasy", title: "Fantasy", desc: "Ilustrasi fantasi epik" },
                { id: "sci-fi", title: "Sci-Fi", desc: "Nuansa futuristik" },
                { id: "vintage", title: "Vintage", desc: "Gaya retro / klasik" }
            ];

            const rows = styles.map(s => ({
                title: s.title,
                description: s.desc,
                id: `.cimage style ${s.id} ${fullPrompt}`
            }));

            return ndii.sendMessage(
                m.chat,
                {
                    text: `🎨 *Pilih Style Gambar*\nPrompt: *${fullPrompt}*`,
                    footer: `${global.info.footer}`,
                    buttons: [
                        {
                            buttonId: "choose_style",
                            buttonText: { displayText: "🎭 Pilih Style" },
                            type: 4,
                            nativeFlowInfo: {
                                name: "single_select",
                                paramsJson: JSON.stringify({
                                    title: "Pilih Style AI Image",
                                    sections: [{ title: "Daftar Style", rows }]
                                })
                            }
                        }
                    ],
                    headerType: 1
                },
                { quoted: m }
            );
        }
    }
};

// Metadata untuk command
cimage.help = ["cimage"];
cimage.tags = ["ai", "image", "fun"];
cimage.command = ["cimage", "aiimage"];
cimage.limit = 1;
cimage.description = "AI Image Generator dengan berbagai style";

export default cimage;