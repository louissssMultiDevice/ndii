import fs from 'fs';
import path from 'path';

let addPlugins = async (m, { conn: ndii, args, usedPrefix }) => {
    const fullArgs = args.join(' ');
    const commaIndex = fullArgs.indexOf(',');

    if (commaIndex === -1) {
        return ndii.sendMessage(m.chat, { text: `❌ Format salah! Gunakan:\n${usedPrefix}addplugins namafile, <kode plugin>` }, { quoted: m });
    }

    const pluginNameInput = fullArgs.substring(0, commaIndex).trim();

    if (!pluginNameInput) {
        return ndii.sendMessage(m.chat, { text: '❌ Nama file tidak boleh kosong.' }, { quoted: m });
    }

    if (!pluginNameInput.match(/^[a-zA-Z0-9_-]+$/)) {
        return ndii.sendMessage(m.chat, { text: '❌ Nama file hanya boleh huruf, angka, _ atau -.' }, { quoted: m });
    }
    
    const code = fullArgs.substring(commaIndex + 1).trim();
    
    if (!code) {
        return ndii.sendMessage(m.chat, { text: '❌ Kode plugin tidak boleh kosong.' }, { quoted: m });
    }

    const pluginName = `${pluginNameInput}.js`;
    const pluginPath = path.join('./plugins', pluginName);

    try {
        await fs.promises.writeFile(pluginPath, code, 'utf-8');
        ndii.sendMessage(m.chat, { text: `✅ Plugin berhasil ditambahkan!\nNama file: ${pluginName}\nRestart bot untuk mengaktifkan.` }, { quoted: m });
    } catch (e) {
        console.error(e);
        ndii.sendMessage(m.chat, { text: '❌ Gagal menambahkan plugin.' }, { quoted: m });
    }
}

addPlugins.command = ['addplugins'];
addPlugins.tags = ['owner'];
addPlugins.owner = true;
export default addPlugins;
