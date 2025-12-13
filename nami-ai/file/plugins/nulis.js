import axios from 'axios';

let nulis = async (m, { conn: ndii, text }) => {
 if (!text) return Ditss.sendMessage(m.chat, { text: `✏️ Contoh penggunaan:
.nulis Teks yang ingin ditulis
.nulis Teks|No
.nulis Teks|No|Tanggal

📌 Keterangan:
- Gunakan tanda "|" untuk memisahkan teks, nomor, dan tanggal (jika ada).
- Nomor dan tanggal bersifat OPSIONAL, boleh diisi atau dikosongkan.

🧪 Contoh valid:
.nulis Ini catatan harian
.nulis Ini catatan harian|2
.nulis Ini catatan harian|2|20 Juni 2025
.nulis Ini catatan harian||20 Juni 2025` }, { quoted: m });
 let [isi, no, date] = text.split('|');
 isi = isi?.trim();
 no = no?.trim() || '';
 date = date?.trim() || '';

 if (!isi) return ndii.sendMessage(m.chat, { text: '⚠️ Isi tulisan tidak boleh kosong.' }, { quoted: m });
 try {
 const response = await axios.post(
 `${api.ditss}/api/maker/nulis2`,
 {
 text: isi,
 no: no,
 date: date
 },
 {
 responseType: 'arraybuffer' 
 }
 );
 const buffer = Buffer.from(response.data);
 await ndii.sendMessage(
 m.chat,
 {
 image: buffer,
 caption: `📝 Hasil tulisan:\n"${isi}"`
 },
 { quoted: m }
 );

 } catch (err) {
 console.error(err);
 
 let errorMessage = '❌ Gagal membuat gambar.';
 if (err.response) {
 errorMessage += ` Error: ${err.response.status}`;
 } else if (err.request) {
 errorMessage += ' Server tidak merespon.';
 }
 
 await ndii.sendMessage(m.chat, { text: errorMessage }, { quoted: m });
 }
}

nulis.help = ['nulis'];
nulis.tags = ['tools', 'ai'];
nulis.command = ['nulis'];
nulis.limit = 1;

export default nulis;