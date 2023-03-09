const { createClient } = require("@supabase/supabase-js");
const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = require("./../config.json");

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function updateOrder(id, price) {
  const date = new Date();
  const dateNow = date.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  });

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ delivery_price: price, updated_at: dateNow, approved: true })
      .eq("id", id)
      .select();
    if (error) throw error;
    console.log("PRODUCTS DATA: ", data);
    return data[0];
  } catch (error) {
    console.log("PRODUCTS ERROR: ", error.message);
  }
}

module.exports = {
  updateOrder,
};
