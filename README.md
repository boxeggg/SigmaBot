# SigmaBot 🎵

**SigmaBot** is a versatile music bot for Discord, built using **Node.js**, **discord.js**, and **discord-player.js**. It offers intuitive music commands that allow you to take full control of the music playback on your server.

## Features ✨

SigmaBot supports the following commands:

- **`!play <link or name>`** - Plays the selected track from YouTube or adds it to the queue.
- **`!loop`** - Toggles the loop mode for the currently playing track.
- **`!volume <0-100>`** - Adjusts the volume of the music being played.
- **`!queue`** - Displays the list of tracks currently in the queue.
- **`!skip`** - Skips the currently playing track.


## Dashboard & API 🌐

SigmaBot comes with an optional **dashboard** and **API**, making it easier to manage the bot from web and integrate it with other applications. More details can be found in a separate repository, which you can access [here](#).

## Latest Release 🚀

To get the most up-to-date and stable version of SigmaBot, head over to the [releases](#) tab.


## Setup Instructions ⚙️
To get SigmaBot running, follow these steps:

1. **Install the required npm packages** by running:

   ```bash
   npm install

2. **Create an `.env` file** in the root directory of your project with the following structure:

   ```env
   TOKEN=your-discord-bot-token
   CLIENT_ID=your-client-id
   API_URL=http://localhost:5205  # Optional: only if using the dashboard or API
3. **Run the bot** using the command:

   ```bash
   node index.js
## Support & Contact 🤝

If you have any questions or need assistance, feel free to open an issue on GitHub or reach out directly to the developer.

## Contributing 🚧

Want to contribute to the development of SigmaBot? We welcome your help! Feel free to open a pull request or submit new issues.

---

