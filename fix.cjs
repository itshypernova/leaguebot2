const fs = require('fs');

let code = fs.readFileSync('index.js', 'utf8');

const catchBlock = `    } catch (err) {
        console.error(err.response?.data || err.message)
        message.reply('❌ Error processing command')
    }
})`;

if (code.includes(catchBlock)) {
    code = code.replace(catchBlock, "");
} else {
    console.error("Could not find catchBlock");
}

const interactionBlockStart = "client.on('interactionCreate'";
const interactionBlockEnd = `    } catch (err) {
        return interaction.reply({
            content: err.response?.data?.error || '⚠️ Trade failed',
            ephemeral: true
        })
    }
})`;

let interactionCode = "";
const iStart = code.indexOf(interactionBlockStart);
if (iStart !== -1) {
    const iEnd = code.indexOf(interactionBlockEnd) + interactionBlockEnd.length;
    interactionCode = code.substring(iStart, iEnd);
    code = code.substring(0, iStart) + code.substring(iEnd);
} else {
    console.error("Could not find interactionCreate block");
}

const clientConfig = `dotenv.config()

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

client.once('ready', () => {
    console.log(\`🤖 Logged in as \${client.user.tag}\`)
})

client.login(process.env.DISCORD_TOKEN)`;

if (code.includes(clientConfig)) {
    code = code.replace(clientConfig, "");
} else {
    console.error("Could not find clientConfig");
}

const mapStatement = `const gymSetupSessions = new Map()`;
if (code.includes(mapStatement)) {
    code = code.replace(mapStatement, "");
} else {
    console.error("Could not find mapStatement");
}

code = code.replace(/import \{ EmbedBuilder \} from 'discord\.js'/g, "");

const newTop = `import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import dotenv from 'dotenv'
import axios from 'axios'
import { getPlayer } from './utils/api.js'
import { isAdmin } from './utils/isAdmin.js'

dotenv.config()
const API = process.env.API_BASE_URL
const gymSetupSessions = new Map()

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})`;

const oldTopStart = `// index.js`;
const oldTopEnd = `const API = process.env.API_BASE_URL`;
const oldTopIndex = code.indexOf(oldTopStart);
const oldTopEndIndex = code.indexOf(oldTopEnd) + oldTopEnd.length;

if (oldTopIndex !== -1 && oldTopEndIndex !== -1) {
    code = code.substring(0, oldTopIndex) + newTop + code.substring(oldTopEndIndex);
} else {
    console.error("Could not properly replace top imports");
}

code += `\n${catchBlock}\n\n${interactionCode}\n\nclient.once('ready', () => {
    console.log(\`🤖 Logged in as \${client.user.tag}\`)
})\n\nclient.login(process.env.DISCORD_TOKEN)\n`;

fs.writeFileSync('index.js', code);
console.log("File fixed!");
