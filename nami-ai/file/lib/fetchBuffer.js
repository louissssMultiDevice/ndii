/**
 * Mengambil file dari URL dalam bentuk Buffer (menggunakan Fetch API)
 * @param {string} url - Link file
 * @param {object} options - Opsi tambahan untuk request fetch
 * @returns {Promise<Buffer>}
 */
export async function getBuffer(url, options = {}) {
  try {
    // Menggunakan Fetch API sebagai pengganti axios
    const response = await fetch(url, {
      headers: {
        'DNT': '1',
        'Upgrade-Insecure-Request': '1'
      },
      ...options
    });

    // Cek jika response tidak ok (status bukan 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Mengambil data sebagai ArrayBuffer[citation:8] lalu konversi ke Buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);

  } catch (err) {
    // Tambahkan informasi spesifik fetch jika error belum memiliki pesan
    const errorMessage = err.message || 'Unknown error occurred';
    throw new Error(`Gagal mengambil buffer dari URL: ${errorMessage}`);
  }
}
