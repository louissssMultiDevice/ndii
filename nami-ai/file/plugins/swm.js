let swm = async (m, { conn: ndii, usedPrefix, text, qmsg, mime, reply }) => {
    if (!text) return reply("Kirim namamu bersama media");
    if (!/image|video/gi.test(mime)) return reply("Kirim namamu bersama media");
    if (/video/gi.test(mime) && qmsg.seconds > 15) return reply("Durasi video maksimal 15 detik!");

    try {
        var image = await ndii.downloadAndSaveMediaMessage(qmsg);
        await ndii.sendSticker(m.chat, image, m, { 
    packname: text,
    author: m.pushName
});
        // fs.unlinkSync(image); // opsional hapus file sementara
    } catch (err) {
        console.error(err);
        return reply("Terjadi kesalahan saat membuat sticker");
    }
}

swm.help = ['swm', 'wm', 'colong']
swm.tags = ['sticker']
swm.command = ['swm', 'wm', 'colong']
swm.admin = false
swm.group = false

export default swm;