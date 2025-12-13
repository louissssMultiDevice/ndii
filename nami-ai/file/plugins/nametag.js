let nametag = async (m, { conn: ndii, text, command, usedPrefix, reply }) => {
  if (!text) return reply(`Example:\n${usedPrefix + command} Orang Sikma`);

  const ndiiCloud = await ndii.sendMessage(
    m.chat,
    { text: "*Loading...*" },
    { quoted: m }
  );

  try {
    await ndii.relayMessage(
      m.chat,
      {
        protocolMessage: {
          type: 30,
          memberLabel: {
            label: text,
            labelTimestamp: Date.now()
          }
        }
      },
      {}
    );

    await ndii.sendMessage(
      m.chat,
      {
        edit: ndiiCloud.key,
        text: "*Label successfully applied!*"
      }
    );
  } catch (e) {
    await ndii.sendMessage(
      m.chat,
      {
        edit: ndiiCloud.key,
        text: `❌ Error:\n${e}`
      }
    );
  }
};

nametag.help = ["label"];
nametag.tags = ["owner"];
nametag.command = ["label", "setlabel"];
nametag.owner = true;

export default nametag;
