const extractCodeBlocks = (text) => {
  const regex = /```(\w+)\n([\s\S]*?)\n```/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      language: match[1].toLowerCase(),
      content: match[2].trim()
    });
  }
  return matches;
};

let aiImageChat = async (m, { conn: ndii, usedPrefix, command, args }) => {
  if (!args[0])
    return m.reply(`Kirim prompt AI!\n\nContoh:\n${usedPrefix + command} pemandangan indah dengan pasangan romantis`);

  const prompt = encodeURIComponent(args.join(' '));
  const url = `https://anabot.my.id/api/ai/bingchat?prompt=${prompt}&apikey=freeApikey`;

  await ndii.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const json = await res.json();

    if (!json.success || !json.data?.result) return m.reply('❌ Gagal memproses AI.');

    const result = json.data.result;
    let fullResponse = '';

    if (result.chat) {
      fullResponse += result.chat.replace(/najmy|dana|asep|udin/gi, `${m.pushName}`) + '\n\n';
    }

    // ====== FILTER ======
    fullResponse = fullResponse
      .replace(/Kalau .*?(meme|puisi).*$/gmi, '') 
      .replace(/Mau .*?(meme|puisi).*$/gmi, '')
      .trim();

    const codeBlocks = extractCodeBlocks(fullResponse);
    if (result.imgeGenerate?.length) {
      const imageUrl = result.imgeGenerate[0];
      const caption = fullResponse.trim();
      await ndii.sendMessage(m.chat, { image: { url: imageUrl }, caption }, { quoted: m });
      return;
    }
    if (codeBlocks.length > 0) {
      const interactiveButtons = codeBlocks.map((block, index) => ({
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: `📋 Copy ${block.language.toUpperCase()}`,
          id: `copy_${index}_${Date.now()}`,
          copy_code: block.content
        })
      }));
      if (result.reference?.length) {
        result.reference.forEach((r, i) => {
          interactiveButtons.push({
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: `🌐 Referensi ${i + 1}`,
              url: r
            })
          });
        });
      }

      const interactiveMessage = {
        text: fullResponse.trim(),
        title: "🤖 AI Response",
        footer: `© ${info.namabot} | Ketik /ai <prompt>`,
        interactiveButtons
      };

      await ndii.sendMessage(m.chat, interactiveMessage, { quoted: m });
      return;
    }
    if (result.reference?.length) {
      const interactiveButtons = result.reference.map((r, i) => ({
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: `🌐 Referensi ${i + 1}`,
          url: r
        })
      }));

      const interactiveMessage = {
        text: fullResponse.trim(),
        title: "🤖 AI Response",
        footer: `© Powereb By Tim NdiiCloud`,
        interactiveButtons
      };

      await ndii.sendMessage(m.chat, interactiveMessage, { quoted: m });
      return;
    }
    await ndii.sendMessage(m.chat, { text: fullResponse.trim() }, { quoted: m });

  } catch (e) {
    console.error('[AI ERROR]', e);
    await ndii.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply('❌ Terjadi error saat memproses AI.');
  }
};

aiImageChat.help = ['<prompt> - Generate gambar, chat, atau kode AI'];
aiImageChat.tags = ['ai', 'tools'];
aiImageChat.command = ['ai', 'aiimage', 'chatgpt'];

export default aiImageChat;