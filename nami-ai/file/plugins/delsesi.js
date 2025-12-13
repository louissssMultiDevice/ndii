import fs from "fs/promises"
import path from "path"
import { existsSync } from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const delsesi = async (m, { conn: ndii, editp }) => {
  const folder = path.resolve(process.cwd(), "node_modules/.bin/Session")

  if (!existsSync(folder)) {
    return m.reply(`❌ Folder session tidak ditemukan di: ${folder}`)
  }

  let files
  try {
    files = await fs.readdir(folder)
  } catch (err) {
    console.log("❌ Scan error:", err)
    return m.reply("❌ Gagal memindai folder session.")
  }

  if (files.length === 0) {
    return m.reply("📂 Folder session kosong, tidak ada file apa pun.")
  }
  let listAll = `📁 *Daftar Semua File di Folder session:*\n\n`
  listAll += files.map((file, i) => `${i + 1}. ${file}`).join("\n")
  const sampah = files.filter(
    (file) =>
      file.startsWith("pre-key") ||
      file.startsWith("sender-key") ||
      file.startsWith("session-") ||
      file.startsWith("app-state") ||
      file.endsWith(".lock") ||
      file.endsWith(".tmp") ||
      file.endsWith(".log") ||
      (!file.includes(".json") &&
        !file.includes(".db") &&
        !file.includes("creds"))
  )
  await editp(
    listAll,
    `🧹 Menghapus ${sampah.length} file sampah...`,
    "✅ File sampah berhasil dihapus tanpa menyentuh file penting."
  )
  for (const file of sampah) {
    try {
      await fs.unlink(path.join(folder, file))
    } catch (e) {
      console.log(`❌ Gagal hapus ${file}:`, e)
    }
  }
}

delsesi.help = ["delsesi"]
delsesi.tags = ["bot/settings"]
delsesi.command = ["delsesi"]
delsesi.admin = false
delsesi.group = false

export default delsesi