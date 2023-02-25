const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
const {
  token,
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
} = require("./config.json");

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

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function getProducts() {
  try {
    const { data, error } = await supabase.from("products").select();
    console.log("PRODUCTS DATA: ", data);
  } catch (error) {
    console.log("PRODUCTS ERROR: ", error.message);
  }
}

// TODO
// 1. Discord slash options, choices, validation
//  - /order cmd ?id=order-id ?delivery=price
//  - reply w/ updated order db
// 2. update db logic
//  - updates order db with input params
// 3. fireshop client supa subscribe for db changes
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    getProducts();
    await interaction.reply({ content: "Secret Pong!", ephemeral: true });
  }

  if (interaction.commandName === "user") {
    await interaction.reply({
      content: `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
      ephemeral: true,
    });
  }

  if (interaction.commandName === "server") {
    await interaction.reply({
      content: `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
      ephemeral: true,
    });
  }

  if (interaction.commandName === "user") {
    await interaction.reply({
      content: `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
      ephemeral: true,
    });
  }
});

client.on("error", (err) => {
  console.log(err.message);
});

client.login(token);
