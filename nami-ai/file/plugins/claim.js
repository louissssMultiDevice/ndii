const timeout = 24 * 60 * 60 * 1000 

let claimLimit = async (m, { conn: ndii, db }) => {
  let user = global.db.users[m.sender];
  if (!user) global.db.users[m.sender] = { lastClaim: 0, limit: 0 };
  user = global.db.users[m.sender];

  let time = user.lastClaim || 0;
  if (new Date() - time < timeout) {
    return ndii.sendMessage(m.chat, {
      text: `⏳ Kamu sudah klaim limit sebelumnya.\nTunggu *${msToTime(time + timeout - new Date())}* lagi untuk bisa klaim lagi.`,
    }, { quoted: m });
  }

  let { hadiah, teks, rare } = getHadiah(m);
  user.lastClaim = +new Date();
  user.limit = (user.limit || 0) + hadiah;

  await ndii.sendMessage(m.chat, {
    text: teks + `\n\n📊 Limit total: *${user.limit}*`,
  }, { quoted: m });

  if (rare) {
    await ndii.sendMessage(global.my.idch2, {
      text: `🚨 [INFO RARE DROP]\n\n@${m.pushName} baru saja mendapatkan hadiah *${hadiah} limit*! 🎉🔥\n\nKlaim sekarang dan coba keberuntunganmu! 😼`,
      mentions: [m.sender],
    });
  }
};

function getHadiah(m) {
  let chance = Math.random() * 100; 
  let hadiah = 30, teks = "", rare = false;

  if (chance < 0.1) {
    hadiah = 1000;
    teks = `🎰 *JACKPOT!* 🎰\nWOOOW gila! Kamu hoki banget dapet *${hadiah} limit*! 🔥🔥🔥`;
    rare = true;
  } else if (chance < 1.1) {
    hadiah = 200;
    teks = `💎 Langka banget! Kamu berhasil dapet *${hadiah} limit*! 🎉`;
    rare = true;
  } else if (chance < 3.1) {
    hadiah = 100;
    teks = `🔥 Mantapp! Kamu dapet *${hadiah} limit*! Terbilang hoki 🐱`;
    rare = true;
  } else if (chance < 8.1) {
    hadiah = 50;
    teks = `⭐ Not bad, kamu dapet *${hadiah} limit*!`;
    rare = true;
  } else {
    hadiah = 30;
    teks = `⚪ Kamu dapet *${hadiah} limit*!`;
  }

  return { hadiah, teks, rare };
}

function msToTime(duration) {
  if (isNaN(duration)) return '00 hari 00 jam 00 menit';
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let days = Math.floor(duration / (1000 * 60 * 60 * 24));

  days = (days < 10) ? "0" + days : days;
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;

  return `${days} hari ${hours} jam ${minutes} menit`;
}

claimLimit.help = ["claim", "claimlimit", "klaimlimit", "limitclaim"];
claimLimit.tags = ["rpg"];
claimLimit.command = ["claim", "claimlimit", "klaimlimit", "limitclaim"];

export default claimLimit;