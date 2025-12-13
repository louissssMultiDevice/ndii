let tes = async (m, { conn, usedPrefix, args, command }) => {
    await m.reply(`✅ Plugins aktif! Command: ${usedPrefix}${command}`);
}

tes.help = ['tes']
tes.tags = ['test']
tes.command = ['tes'] // keyword command
tes.admin = false // gak perlu admin
tes.group = false // bisa di chat pribadi

export default tes;