import fs from "fs";
import path from "path";

const folder = path.join(process.cwd(), "database", "users");
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

const userCache = {};
const defaultUser = {
  jid: "",
  name: "",
  joinDate: "",
  vip: false,
  ban: false,
  register: false,
  limit: 30,
  glimit: 100,
  money: 1000,
  lastclaim: 0,
  lastbegal: 0,
  lastrampok: 0,
  pc: 0,
  premium: false
};

function isValidJid(jid) {
  if (typeof jid !== "string") return false;
  return (
    jid.endsWith("@s.whatsapp.net") || // user
    jid.endsWith("@g.us") ||           // group
    jid.endsWith("@newsletter") ||     // saluran
    jid.endsWith("@lid") ||            // multi device link id
    jid.endsWith("@broadcast")         // siaran
  );
}

// --- Bagian versi awal ---
export function getUser(jid) {
  if (!isValidJid(jid)) return null;

  const file = path.join(folder, `${jid}.json`);
  if (!fs.existsSync(file)) {
    const init = { limit: 10, premium: false };
    fs.writeFileSync(file, JSON.stringify(init, null, 2));
    userCache[jid] = init;
    return init;
  }
  if (!userCache[jid]) {
    userCache[jid] = JSON.parse(fs.readFileSync(file));
  }
  return userCache[jid];
}

export function saveUser2(jid) {
  if (!isValidJid(jid)) return;

  const file = path.join(folder, `${jid}.json`);
  if (userCache[jid]) {
    fs.writeFileSync(file, JSON.stringify(userCache[jid], null, 2));
  }
}

export function getAllUsers() {
  let users = {};
  for (let file of fs.readdirSync(folder)) {
    if (!file.endsWith(".json")) continue;
    const jid = file.replace(".json", "");
    if (!isValidJid(jid)) continue;
    users[jid] = getUser(jid);
  }
  return users;
}

// --- Bagian proxy ---
function getFile(id) {
  return path.join(folder, `${id}.json`);
}

function loadUser(id, pushName = "Unknown") {
  const file = getFile(id);
  let data = {};
  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file));
    } catch (e) {
      console.error(`❌ Gagal parse file ${file}, reset ke default.`);
      data = {};
    }
  }
  for (let k in defaultUser) {
    if (!(k in data)) data[k] = defaultUser[k];
  }
  if (!data.id) data.id = id;
  if (!data.name || data.name === "") data.name = pushName;
  if (!data.joinDate || data.joinDate === "")
    data.joinDate = new Date().toISOString();

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return data;
}

function saveUser(id, data) {
  const file = getFile(id);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function makeUserProxy(data, id) {
  return new Proxy(data, {
    set(target, prop, value) {
      target[prop] = value;
      saveUser(id, target);
      return true;
    }
  });
}

export function makeUsersProxy() {
  return new Proxy(
    {},
    {
      get(_, id) {
        if (!id) return;
        if (!isValidJid(id)) return null;

        const pushName =
          global?.conn?.getName ? global.conn.getName(id) : "Unknown";

        const data = loadUser(id, pushName);
        return makeUserProxy(data, id);
      },
      set(_, id, value) {
        if (!id) return false;
        if (!isValidJid(id)) return false;

        saveUser(id, value);
        return true;
      }
    }
  );
}