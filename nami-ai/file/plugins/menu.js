import fs from 'fs'
import path from 'path'

let handler = async (m, { conn: Ditss }) => {
  let pluginFiles = fs.readdirSync('./plugins').filter(v => v.endsWith('.js'))
  let plugins = []

  for (let file of pluginFiles) {
    let pluginPath = path.resolve('./plugins', file)
    let plugin = await import('file://' + pluginPath)
    if (plugin && plugin.default) plugin = plugin.default

    if (plugin?.tags && plugin?.command) {
      plugins.push({
        command: plugin.command,
        tags: plugin.tags
      })
    }
  }

  let menu = {}
  for (let p of plugins) {
    for (let tag of p.tags) {
      if (!menu[tag]) menu[tag] = []
      menu[tag].push(p.command)
    }
  }
  let manual = {
    'owner': ['addprem','delprem','ban','unban','>', '$','=>'],
    'group': ['kick','add','promote','demote','hidetag'],
    'fun': ['jadian','tolak','terima'],
    'sticker': ['sticker','toimg','take'],
    'backup': ['backup','restore'],
    'downloader': ['mediafire','facebook','play','ytmp4','ytmp3'],
    'ai': ['ai','openai','chatgpt'],
    'converter': ['image2mini','toimg','tomp3','audioconvert'],
    'enhance': ['hd','remini','hdr','hdvid'],
    'editor': ['blur','invert','crop'],
    'tools': ['ssweb','qrcode','shortlink'],
    'about': ['info','sosmed'],
    'info': ['ping','runtime','speed'],
    'nsfw': ['nsfw waifu', 'nsfw neko', 'nsfw loli', 'nsfw trap', 'nsfw blowjob', 'nsfw' ],
    'main': ['menu','help']
  }
  for (let tag in manual) {
    if (!menu[tag]) menu[tag] = []
    menu[tag].push(...manual[tag])
  }
  let icons = {
    owner: '🛠️',
    group: '👥',
    fun: '😂',
    sticker: '🎨',
    backup: '💾',
    downloader: '📥',
    ai: '🧠',
    converter: '🔄',
    enhance: '✨',
    editor: '🖌️',
    tools: '🔧',
    about: 'ℹ️',
    info: '📊',
    main: '📑',
    nsfw: '🔞'
  }
  let teks = `👋 Hai *${m.pushName || 'User'}*!\n`
teks += `Selamat datang di *Nami-Ai* — bot WhatsApp kamu yang serba bisa 🤖\n\n`
teks += `✨ Dengan aku, kamu bisa:\n`
teks += `   ▸ Cari info terbaru\n`
teks += `   ▸ Nikmati hiburan & games\n`
teks += `   ▸ Gunakan tools otomatis\n\n`

teks += `┌─═⟴ BOT INFO ⟴═─┐\n`
teks += `│ 👑 Creator : NdiiCloud\n`
teks += `│ 📚 Library : ws-baileys\n`
teks += `│ 🌐 Mode    : Public\n`
teks += `└───────────────┘\n\n`

Object.keys(menu).sort().forEach(tag => {
    let title = `${icons[tag] || '✦'} ${tag.charAt(0).toUpperCase() + tag.slice(1)}`
    let commands = menu[tag].map(cmd => Array.isArray(cmd) ? cmd[0] : cmd)

    teks += `┏━⟴ ${title} ⟴━┓\n`
    commands.forEach((cmd, i) => {
        teks += `┃ ▸ ${cmd}\n`
    })
    teks += `┗━━━━━━━━━━━━━┛\n\n`
})

teks += `💡 Tips: Ketik *nama command* untuk menjalankan.\n`
teks += `🌟 Jangan lupa explore semua menu, banyak kejutan di dalam!`

//  m.reply(teks)
    const buttons = [
  { buttonId: '.owner', buttonText: { displayText: 'info owner' }, type: 1 },
  { buttonId: '.info', buttonText: { displayText: 'info bot' }, type: 1 }
]

const buttonMessage = {
    image: { url: "https://ndiicloud.privhandi.my.id/nami-ai/media/thumbnail.jpg" }, 
    caption: teks,
    footer: global.info.footer,
    buttons,
    headerType: 1
}

await ndii.sendMessage(m.chat, buttonMessage, { quoted: null })
}

handler.command = ['menu', 'help']
handler.tags = ['main']
handler.help = ['menu']

export default handler