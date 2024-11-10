const axios = require('axios');

module.exports.config = {
  name: "ai",
  author: "coffee",
  version: "1.0",
  category: "Utility",
  description: "Interact with the GPT-4 API or analyze images",
  adminOnly: false, 
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = async function ({ event, args }) {
  const query = args.join(" ") || "hi";
  const userId = event.sender.id; // Get user ID from event

  const header = "(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠) | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n・──────────────・";
  const footer = "・───── >ᴗ< ──────・";

  // Check for image attachments in the original message
  if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0]?.type === "photo") {
    const attachment = event.messageReply.attachments[0];
    const imageURL = attachment.url;

    const geminiUrl = `https://joshweb.click/gemini?ask=${encodeURIComponent(query)}&imgurl=${encodeURIComponent(imageURL)}`;
    try {
      const response = await axios.get(geminiUrl);
      const { vision } = response.data;

      if (vision) {
        return await api.sendMessage(`${header}\n${vision}\n${footer}`, event.sender.id);
      } else {
        return await api.sendMessage(`${header}\nFailed to recognize the image.\n${footer}`, event.sender.id);
      }
    } catch (error) {
      console.error("Error fetching image recognition:", error);
      return await api.sendMessage(`${header}\nAn error occurred while processing the image.\n${footer}`, event.sender.id);
    }
  }

  // Handle text queries using the GPT-4 API
  try {
    const { data } = await axios.get(`https://markdevs69v2-679r.onrender.com/new/gpt4?query=${encodeURIComponent(query)}&uid=${event.sender.id}`);

    if (data && data.response) {
      await api.sendMessage(`${header}\n${data.response}\n${footer}`, event.sender.id);
    } else {
      await api.sendMessage(`${header}\nSorry, I couldn't get a response from the API.\n${footer}`, event.sender.id);
    }
  } catch (error) {
    console.error("Error fetching from GPT-4 API:", error);
    await api.sendMessage(`${header}\nAn error occurred while trying to reach the API.\n${footer}`, event.sender.id);
  }
};
  
