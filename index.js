const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { token } = require("./config.json");
const { updateOrder, cancelOrder } = require("./utils/supabase.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "delivery") {
    let id = interaction.options.getString("order-id");
    let price = interaction.options.getNumber("delivery-price");
    let data = await updateOrder(id, price);
    await interaction.reply({
      content: `Delivery PRICE: ${data.delivery_price} \n Delivery APPROVED: ${data.approved}`,
      ephemeral: true,
    });
  }
  if (interaction.commandName === "cancel") {
    let id = interaction.options.getString("order-id");
    let data = await cancelOrder(id);
    await interaction.reply({
      content: `Delivery CANCELLED  for ORDER: ${id} \nDelivery APPROVED: ${data.approved}`,
      ephemeral: true,
    });
  }
});

client.on("error", (err) => {
  console.log(err.message);
});

client.login(token);
