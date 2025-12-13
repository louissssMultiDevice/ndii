import '../settinganbot.js';
import axios from "axios";

const API_URL = "https://ditss-cloud.vercel.app/api/tools/cekgempa";

export class AutoGempa {
  constructor(sendFn, opts = {}) {
    this.sendFn = sendFn;
    this.lastKey = null;
    this.interval = opts.pollIntervalMs || 30_000;
    this.thresholdMag = typeof opts.thresholdMag === "number" ? opts.thresholdMag : 0;
    this.timer = null;
  }

  formatMsg(res) {
    return [
      "⚠️ *Pemberitahuan Gempa*",
      "",
      `📍 Lokasi: ${res.lokasi}`,
      `⏱ Waktu : ${res.waktu}`,
      `🌐 Koordinat: ${res.koordinat}`,
      `💥 Magnitude: ${res.magnitude}`,
      `🔻 Kedalaman: ${res.kedalaman}`,
      `📣 Potensi: ${res.potensi}`,
      `👥 Dirasakan: ${res.dirasakan || "-"}`,
      "",
      `🗺️ Peta: ${res.peta || "-"}`,
      "",
      "_Sumber: BMKG_",
    ].join("\n");
  }

  async checkOnce() {
    try {
      if (!global.autogempa) return;

      const { data } = await axios.get(API_URL, { timeout: 10_000 });
      if (!data?.status || !data?.result) return;

      const res = data.result;
      const key = `${res.waktu}|${res.magnitude}|${res.koordinat}`;
      const magNum = parseFloat(String(res.magnitude).replace(",", ".")) || 0;

      if (this.lastKey !== key && magNum >= this.thresholdMag) {
        const text = this.formatMsg(res);

        if (res.peta) {
          await this.sendFn(text, { type: "image", url: res.peta });
        } else {
          await this.sendFn(text);
        }

        this.lastKey = key;
        console.log(`[autoGempa] Notified: ${key}`);
      }
    } catch (err) {
      console.error("[autoGempa] Error:", err.message || err);
    }
  }

  start() {
    this.checkOnce();
    this.timer = setInterval(() => this.checkOnce(), this.interval);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }
}