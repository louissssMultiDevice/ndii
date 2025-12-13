import '../../settinganbot.js';
import axios from 'axios';
import { getPrompt } from './perintah.js';
export async function handleAutoAi({ m, body, pushname, ndii, set, isCmd }) {
    if (!body) return;
    if (!(set.autoaiprivate && !m.isGroup && !isCmd && !m.key.fromMe)) return;

    const pushNama = pushname || 'Kamu';
    const prompt = getPrompt(pushNama);

    const requestData = {
        content: body,
        user: m.sender,
        prompt
    };

    try {
        const quoted = m.quoted || m;
        const mimetype = quoted?.mimetype || quoted?.msg?.mimetype;
        if (mimetype && /image/.test(mimetype)) {
            requestData.imageBuffer = await quoted.download();
        }

        const response = await axios.post('https://luminai.my.id', requestData);
        const pmangsut = response.data?.result;

        if (!pmangsut) {
            await m.reply('Maaf, aku gak ngerti maksud kamu~');
            return;
        }

        try {
            const vnRes = await axios.get(
                `https://${api.ditss}/tools/tts-nahida?apikey=DitssGanteng&text=${encodeURIComponent(hasil)}`,
                { responseType: 'arraybuffer' }
            );

            await ndii.sendMessage(m.chat, {
                audio: vnRes.data,
                mimetype: 'audio/mp4',
                ptt: true,
                ai: true,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: false,
                    externalAdReply: {
                        showAdAttribution: true,
                        title: `Nami — Auto AI`,
                        body: `${global.info.footer}`,
                        thumbnailUrl: `${api.ndiicloud}/nami-ai/media/thumbnail.jpg`,
                        sourceUrl: `${api.ndiicloud}`,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });

        } catch {
            await ndii.sendMessage(m.chat, {
                text: pmangsut,
                ai: true,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: false,
                    externalAdReply: {
                        showAdAttribution: true,
                        title: `Nami — Auto AI`,
                        body: `${global.info.footer}`,
                        thumbnailUrl: `${api.ndiicloud}/nami-ai/media/thumbnail.jpg`,
                        sourceUrl: `${api.ndiicloud}`,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });
        }

    } catch (err) {
        console.error('Auto AI error:', err);
        await m.reply('Lagi error nih, coba nanti lagi ya 😿');
    }
}
