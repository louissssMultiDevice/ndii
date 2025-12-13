// tes apakah ke update
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');

let updateHandler = async (m, { conn: ndii, args, usedPrefix }) => {
    const command = m.text.split(' ')[0].slice(1).toLowerCase();
    const sender = m.sender.split('@')[0];
    const owner = global.owner || '6285800650661';
    const isOwner = Array.isArray(owner) ? owner.includes(sender) : owner === sender;
    
    if (!isOwner) return ndii.sendMessage(m.chat, { text: global.ress?.owner || '❌ Fitur khusus owner!' }, { quoted: m });

    if (command === 'update' || command === 'up') {
        const processMsg = await ndii.sendMessage(m.chat, { text: '🔍 *Mengecek update dari GitHub...*' }, { quoted: m });
        
        try {
            const repoApi = 'https://api.github.com/repos/ndii-labs/asuma/git/trees/main?recursive=1';
            const response = await axios.get(repoApi);
            
            if (response.status !== 200) throw new Error(`Gagal mengambil data: ${response.status}`);
            
            const tree = response.data.tree;
            const filesToCheck = tree.filter(item => item.type === 'blob');
            
            await ndii.sendMessage(m.chat, { text: `📁 Ditemukan ${filesToCheck.length} file\n🔄 Membandingkan dengan file lokal...` }, { edit: processMsg.key });
            
            const filesToUpdate = [];
            const skipPatterns = [/^database\//, /^database\.json$/, /^baileys_store\.json$/, /^\.tmp\//, /^\.git\//, /^node_modules\//];
            
            for (const file of filesToCheck) {
                const filePath = file.path;
                const shouldSkip = skipPatterns.some(pattern => pattern.test(filePath));
                if (shouldSkip) continue;
                
                const rawUrl = `https://raw.githubusercontent.com/ndii-labs/asuma/main/${filePath}`;
                
                try {
                    const [localExists, githubContent] = await Promise.all([
                        fs.promises.access(filePath).then(() => true).catch(() => false),
                        axios.get(rawUrl, { responseType: 'arraybuffer', timeout: 10000 })
                    ]);
                    
                    if (githubContent.status !== 200) continue;
                    
                    const githubBuffer = Buffer.from(githubContent.data);
                    const githubHash = crypto.createHash('sha256').update(githubBuffer).digest('hex');
                    
                    let localHash = '';
                    if (localExists) {
                        try {
                            const localBuffer = await fs.promises.readFile(filePath);
                            localHash = crypto.createHash('sha256').update(localBuffer).digest('hex');
                        } catch { localHash = 'FILE_ERROR'; }
                    }
                    
                    if (!localExists || localHash !== githubHash) {
                        filesToUpdate.push({ path: filePath, url: rawUrl, buffer: githubBuffer, status: localExists ? 'UPDATE' : 'NEW' });
                    }
                } catch { continue; }
            }
            
            if (filesToUpdate.length === 0) {
                await ndii.sendMessage(m.chat, { text: '✅ *Bot sudah versi terbaru!*' }, { edit: processMsg.key });
                return;
            }
            
            let updateMessage = `🔄 *UPDATE TERSEDIA!*\n📊 ${filesToUpdate.length} file perlu diupdate\n\n`;
            updateMessage += `📋 *Contoh file:*\n`;
            filesToUpdate.slice(0, 10).forEach(f => updateMessage += `${f.status === 'NEW' ? '🆕' : '📝'} ${f.path}\n`);
            
            if (filesToUpdate.length > 10) updateMessage += `...dan ${filesToUpdate.length - 10} file lainnya\n`;
            
            updateMessage += `\n⚠️ *Konfirmasi Update?*\nKetik: *.confirmupdate* untuk melanjutkan`;
            
            global.pendingUpdate = { files: filesToUpdate, total: filesToUpdate.length, messageKey: processMsg.key };
            
            await ndii.sendMessage(m.chat, { text: updateMessage }, { edit: processMsg.key });
            
        } catch (error) {
            let errorMsg = '❌ *Gagal cek update!*\n';
            if (error.response?.status === 403) errorMsg += 'API GitHub limit, coba beberapa menit lagi.';
            else errorMsg += `Error: ${error.message}`;
            await ndii.sendMessage(m.chat, { text: errorMsg }, { edit: processMsg.key });
        }
    }

    else if (command === 'confirmupdate' || command === 'confirmup') {
        if (!global.pendingUpdate) return ndii.sendMessage(m.chat, { text: '❌ Tidak ada update yang tertunda.' }, { quoted: m });
        
        const { files, total } = global.pendingUpdate;
        const progressMsg = await ndii.sendMessage(m.chat, { text: `⬇️ *Memulai update ${total} file...*` }, { quoted: m });
        
        let successCount = 0, failCount = 0;
        const npmUpdated = files.some(f => f.path === 'package.json');
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const dir = path.dirname(file.path);
                if (dir !== '.') await fs.promises.mkdir(dir, { recursive: true });
                await fs.promises.writeFile(file.path, file.buffer);
                successCount++;
            } catch { failCount++; }
        }
        
        delete global.pendingUpdate;
        
        let resultMsg = `📊 *UPDATE SELESAI!*\n✅ Berhasil: ${successCount} file\n❌ Gagal: ${failCount} file\n\n`;
        
        if (npmUpdated) resultMsg += `📦 *package.json* telah diupdate\nJalankan *.npm* untuk update dependency\n\n`;
        
        resultMsg += `🔄 *Bot akan restart dalam 5 detik...*`;
        
        await ndii.sendMessage(m.chat, { text: resultMsg });
        
        setTimeout(() => {
            ndii.sendMessage(m.chat, { text: '🚀 Restarting bot...' }).then(() => {
                process.exit(0);
            });
        }, 5000);
    }

    else if (command === 'npm' || command === 'npminstall') {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        
        const msg = await ndii.sendMessage(m.chat, { text: '📦 *Installing dependencies...*' }, { quoted: m });
        
        try {
            const { stdout } = await execAsync('npm install');
            let result = '✅ *Dependencies updated!*\n';
            if (stdout.includes('added')) {
                const addedMatch = stdout.match(/(\d+) packages? added/);
                if (addedMatch) result += `➕ ${addedMatch[1]} packages ditambahkan\n`;
            }
            result += '🚀 Bot siap digunakan!';
            await ndii.sendMessage(m.chat, { text: result }, { edit: msg.key });
        } catch (error) {
            await ndii.sendMessage(m.chat, { text: `❌ *Gagal npm install:*\n${error.message}` }, { quoted: m });
        }
    }

    else if (command === 'cancel') {
        if (global.pendingUpdate) {
            delete global.pendingUpdate;
            await ndii.sendMessage(m.chat, { text: '❎ Update dibatalkan.' }, { quoted: m });
        } else {
            await ndii.sendMessage(m.chat, { text: '❌ Tidak ada update yang tertunda.' }, { quoted: m });
        }
    }
}

updateHandler.command = ['update', 'up', 'confirmupdate', 'confirmup', 'npm', 'npminstall', 'cancel'];
updateHandler.tags = ['owner'];
updateHandler.owner = true;
export default updateHandler;
