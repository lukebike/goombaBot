const { Events, ActivityType, PresenceUpdateStatus } = require("discord.js");
const onlineStatuses = ["online", "idle", "dnd"];
module.exports = {
  name: Events.PresenceUpdate,
  async execute(oldPresence, newPresence) {
    const client = newPresence.client;
    const guild = newPresence.guild;
    if (!guild) return;

    const fetchedMembers = await guild.members.fetch({ withPresences: true });

    const totalOnline = fetchedMembers.filter(
      (member) =>
        !member.user.bot && onlineStatuses.includes(member.presence?.status)
    );

    const onlineNames = totalOnline.map((member) => member.displayName);
    console.log(onlineNames);
    client.user.setActivity(`with my real ${totalOnline.size} goombales`, {
      type: ActivityType.Playing,
    });
  },
};
