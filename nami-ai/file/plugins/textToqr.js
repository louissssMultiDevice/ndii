let qrcode = async (m, { conn: ndii, usedPrefix, args, command }) => {
  if (!args[0]) {
    return m.reply(
      `⚠️ Masukkan teks yang mau dijadikan QR Code!\n\nContoh:\n${usedPrefix + command} halo dunia`
    )
  }

  try {
    let text = args.join(" ")
    let apiUrl = `${api.ditss}/tools/textToqr?text=${encodeURIComponent(text)}`

    await ndii.sendMessage(
      m.chat,
      {
        image: { url: apiUrl },
        caption: `✅ QR Code berhasil dibuat!\n\n📝 Text: ${text}`
      },
      { quoted: m }
    )
  } catch (e) {
    console.error('[ERROR QRCODE]', e)
    m.reply('❌ Terjadi error saat membuat QR Code.')
  }
}

qrcode.help = ['qrcode <text>']
qrcode.tags = ['tools']
qrcode.command = ['qrcode', 'makeqr', 'kiris']
qrcode.admin = false
qrcode.group = false

export default qrcode