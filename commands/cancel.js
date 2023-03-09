const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cancel")
    .setDescription("Cancel delivery for an order.")
    .addStringOption((option) =>
      option.setName("order-id").setDescription("The ID for the order")
    )
};
