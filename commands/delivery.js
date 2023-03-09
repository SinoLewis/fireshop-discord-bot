const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delivery")
    .setDescription("Set the delivery price for a specific order.")
    .addStringOption((option) =>
      option.setName("order-id").setDescription("The ID for the order")
    )
    .addNumberOption((option) =>
      option
        .setName("delivery-price")
        .setDescription("The Price for the delivery")
    ),
};
