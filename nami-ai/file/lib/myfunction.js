/*
 * ============================================
 *  SCRIPT CREDIT
 * ============================================
 *
 *  Project   : nami-ai
 *  Developer : ndiidepzX
 *  Year      : 2025
 *
 *  Notes:
 *  Script ini dikembangkan untuk keperluan
 *  pengembangan, pembelajaran, dan eksperimen.
 *  Dilarang menghapus credit ini dari source code.
 *
 * ============================================
 */
import * as baileys from "@whiskeysockets/baileys";
import chalk from 'chalk';
import { fileTypeFromBuffer } from 'file-type'
import fs from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { convertImgToWebp, convertVidToWebp, attachExifToWebp } from '../lib/sticker.js';
const { proto, 
       getContentType, 
       areJidsSameUser, 
       generateWAMessage, 
       downloadContentFromMessage,
       generateWAMessageFromContent 
      } = baileys;
import { getBuffer } from '../lib/fetchBuffer.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Serialize Message
 */
export function smsg(ndii, m, store) {
    if (!m) return m;

    let M = proto?.WebMessageInfo;
    if (!M) {
        console.error("proto.WebMessageInfo tidak tersedia.");
        return m;
    }

    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = ndii.decodeJid(m.fromMe ? ndii.user.id : m.participant || m.key.participant || m.chat || '');
        if (m.isGroup) m.participant = ndii.decodeJid(m.key.participant) || '';
    }

    if (m.message) {
        m.mtype = getContentType(m.message);
        m.msg = (m.mtype === 'viewOnceMessage') ? 
            m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : 
            m.message[m.mtype];

        m.body = m.message.conversation || m.msg.caption || m.msg.text || 
                 (m.mtype === 'listResponseMessage' && m.msg.singleSelectReply.selectedRowId) || 
                 (m.mtype === 'buttonsResponseMessage' && m.msg.selectedButtonId) || 
                 (m.mtype === 'viewOnceMessage' && m.msg.caption) || m.text;

        let quoted = m.quoted = m.msg.contextInfo?.quotedMessage || null;
        m.mentionedJid = m.msg.contextInfo?.mentionedJid || [];

        if (m.quoted) {
            let type = Object.keys(m.quoted)[0];
            m.quoted = m.quoted[type];

            if (type === 'productMessage') {
                type = Object.keys(m.quoted)[0];
                m.quoted = m.quoted[type];
            }
            if (typeof m.quoted === 'string') m.quoted = { text: m.quoted };

            m.quoted.mtype = type;
            m.quoted.id = m.msg.contextInfo?.stanzaId;
            m.quoted.chat = m.msg.contextInfo?.remoteJid || m.chat;
            m.quoted.isBaileys = m.quoted.id?.startsWith('BAE5') && m.quoted.id.length === 16;
            m.quoted.sender = ndii.decodeJid(m.msg.contextInfo?.participant);
            m.quoted.fromMe = m.quoted.sender === ndii.decodeJid(ndii.user.id);
            m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || 
                            m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || '';
            m.quoted.mentionedJid = m.msg.contextInfo?.mentionedJid || [];

            m.getQuotedObj = async () => {
                if (!m.quoted.id) return false;
                let q = await store.loadMessage(m.chat, m.quoted.id, ndii);
                return smsg(ndii, q, store);
            };

            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    remoteJid: m.quoted.chat,
                    fromMe: m.quoted.fromMe,
                    id: m.quoted.id
                },
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            });

            m.quoted.delete = () => ndii.sendMessage(m.quoted.chat, { delete: vM.key });
            m.quoted.copyNForward = (jid, forceForward = false, options = {}) => ndii.copyNForward(jid, vM, forceForward, options);
            m.quoted.download = () => ndii.downloadMediaMessage(m.quoted);
        }
    }

    if (m.msg?.url) m.download = () => ndii.downloadMediaMessage(m.msg);
    m.text = m.body || m.msg.text || m.msg.caption || m.message.conversation || 
             m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || '';

  /*  m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text) ? 
        ndii.sendMedia(chatId, text, 'file', '', m, { ...options }) : 
        ndii.sendText(chatId, text, m, { ...options });*/
    
    		m.reply = async (content, options = {}) => {
	const {
		quoted = m,
		chat = m.chat,
		caption = '',
		ephemeralExpiration = m.expiration || store?.messages[m.chat]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0,
		mentions = (typeof content === 'string' || typeof content.text === 'string' || typeof content.caption === 'string')
			? [...(content.text || content.caption || content).matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')
			: [],
		...validate
	} = options;

	const baseOptions = { ...options, quoted, ephemeralExpiration, ai: !m.isGroup };

	if (typeof content === 'object') {
		return ndii.sendMessage(chat, content, baseOptions);
	} else if (typeof content === 'string') {
		try {
			if (/^https?:\/\//.test(content)) {
				const data = await axios.get(content, { responseType: 'arraybuffer' });
				const mime = data.headers['content-type'] || (await FileType.fromBuffer(data.data)).mime;

				if (/gif|image|video|audio|pdf|stream/i.test(mime)) {
					return ndii.sendMedia(chat, data.data, '', caption, quoted, content);
				} else {
					return ndii.sendMessage(chat, { text: content, mentions, ...options, ai: !m.isGroup }, { quoted, ephemeralExpiration });
				}
			} else {
				return ndii.sendMessage(chat, { text: content, mentions, ...options, ai: !m.isGroup }, { quoted, ephemeralExpiration });
			}
		} catch (e) {
			return ndii.sendMessage(chat, { text: content, mentions, ...options, ai: !m.isGroup }, { quoted, ephemeralExpiration });
		}
	}
}    
                ndii.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
let mime = '';
let res = await axios.head(url)
mime = res.headers['content-type']
if (mime.split("/")[1] === "gif") {
return ndii.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
}
let type = mime.split("/")[0]+"Message"
if (mime === "application/pdf"){
return ndii.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
}
if (mime.split("/")[0] === "image"){
return ndii.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
}
if (mime.split("/")[0] === "video"){
return ndii.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
}
if (mime.split("/")[0] === "audio"){
return ndii.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
}
}
            
            ndii.sendSticker = async (jid, path, quoted, options = {}) => {
  const buff = Buffer.isBuffer(path)
    ? path
    : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split(',')[1], 'base64')
      : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
          ? fs.readFileSync(path)
          : Buffer.alloc(0);

  let buffer;
  if (options && (options.packname || options.author)) {
    buffer = await attachExifToWebp(buff, options);
  } else {
    buffer = await (/video/.test((await import('file-type')).fileTypeFromBuffer(buff)?.mime))
      ? await convertVidToWebp(buff)
      : await convertImgToWebp(buff);
  }

  await ndii.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
  return buffer;
}
            ndii.downloadMediaMessage = async (message) => {
const msg = message.msg || message;
const mime = msg.mimetype || '';
const messageType = (message.type || mime.split('/')[0]).replace(/Message/gi, '');
const stream = await downloadContentFromMessage(msg, messageType);
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);
}
return buffer
}
            
            ndii.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]

    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    let type = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' }
    let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename

    // save to file
    await fs.writeFileSync(trueFileName, buffer)

    return trueFileName
}


                ndii.sendGroupInvite = async (jid, participant, inviteCode, inviteExpiration, groupName = 'Unknown Subject', caption = 'Invitation to join my WhatsApp group', jpegThumbnail = null, options = {}) => {
		const msg = proto.Message.fromObject({
			groupInviteMessage: {
				inviteCode,
				inviteExpiration: parseInt(inviteExpiration) || + new Date(new Date + (3 * 86400000)),
				groupJid: jid,
				groupName,
				jpegThumbnail: Buffer.isBuffer(jpegThumbnail) ? jpegThumbnail : null,
				caption,
				contextInfo: {
					mentionedJid: options.mentions || []
				}
			}
		});
		const message = generateWAMessageFromContent(participant, msg, options);
		const invite = await ndii.relayMessage(participant, message.message, { messageId: message.key.id })
		return invite
	}
    
    m.react = (u) => ndii.sendMessage(m.chat, { react: { text: u, key: m.key }})
    
    ndii.sendText = (jid, text, quoted = '', options) => ndii.sendMessage(jid, { text: text, ...options }, { quoted });
    
    m.copy = () => smsg(ndii, M.fromObject(M.toObject(m)));
    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => ndii.copyNForward(jid, m, forceForward, options);

    ndii.appendTextMessage = async (text, chatUpdate) => {
        let messages = await generateWAMessage(m.chat, { text, mentions: m.mentionedJid }, {
            userJid: ndii.user.id,
            quoted: m.quoted?.fakeObj
        });
        messages.key.fromMe = areJidsSameUser(m.sender, ndii.user.id);
        messages.key.id = m.key.id;
        messages.pushName = m.pushName;
        if (m.isGroup) messages.participant = m.sender;

        let msg = {
            ...chatUpdate,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'append'
        };
        ndii.ev.emit('messages.upsert', msg);
    };

    return m;
}

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.redBright(`Update ${__filename}`));
    import(`${import.meta.url}?update=${Date.now()}`)
        .then(() => console.log('Kode diperbarui!'))
        .catch(err => console.error('Gagal memperbarui:', err));
});
