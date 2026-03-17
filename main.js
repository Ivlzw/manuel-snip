const { Client } = require('discord.js-selfbot-v13');
const axios = require('axios');
const colors = require('colors');

async function run() {
    console.clear();
    
   
console.log(`
${"██╗      ██████╗ ██╗    ██╗ █████╗ a".green}
${"██║     ██╔═══██╗██║    ██║██╔══██╗l".green}
${"██║     ██║   ██║██║ █╗ ██║███████║l".green}
${"██║     ██║   ██║██║███╗██║██╔══██║a".red}
${"███████╗╚██████╔╝╚███╔███╔╝██║  ██║h".green}
${"╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ██║h".green}
`.red);
    
    // --- AYARLARIN ---
    const token = ""; 
    const webhookURL = "";
    const anaHedef = "yunan"; // Başlangıç mesajında görünecek ana hedef
    // ------------------

    const client = new Client({ checkUpdate: false });
    const vanityMap = new Map();

    client.on('ready', async () => {
        console.log(`${"[SYSTEM]".green} ${client.user.tag} aktif.`);
        
        // --- BAŞLANGIÇ WEBHOOK MESAJI ---
        await axios.post(webhookURL, {
            content: `🚀 **Vanity Sniper Sistemi Başlatıldı!**\n🛰️ **İzlenen Ana Hedef:** discord.gg/${anaHedef}\n şu an tüm sunucuları tarıyor...`,
        }).catch(() => console.log("gönderilemedi."));

        client.guilds.cache.forEach(guild => {
            if (guild.vanityURLCode) {
                vanityMap.set(guild.id, guild.vanityURLCode);
                console.log(`${"[TRACKING]".yellow} ${guild.name} -> ${guild.vanityURLCode}`);
            }
        });
        console.log(`\n${"[READY]".green} Vanity Sniper Aktif\n`);
    });

    setInterval(async () => {
        for (const [guildId, lastVanity] of vanityMap) {
            try {
                const invite = await client.fetchInvite(lastVanity).catch(() => null);
                
                if (!invite) {
                    const guild = client.guilds.cache.get(guildId);
                    const guildName = guild ? guild.name : "Bilinmeyen Sunucu";
                    const salt = Math.random().toString(36).substring(2, 7); 

                    console.log(`\n${"[ALERT]".red} ${lastVanity} Bildirim gidiyor.`);

                    await axios.post(webhookURL, {
                        content: `@everyone 🚨 ** URL BOŞA DÜŞTÜ!** [ID: ${salt}]\n**URL:** discord.gg/${lastVanity}\n**Sunucu:** ${guildName}`,
                        embeds: [{
                            title: "Vanity Radar",
                            description: `\`${lastVanity}\` şu an boşta! Hemen al!`,
                            color: 16711680,
                            footer: { text: `Sistem: lowa | Saat: ${new Date().toLocaleTimeString()}` }
                        }]
                    }).catch(e => console.log("Webhook hatası: " + e.message));
                }
            } catch (e) {}
        }
    }, 5000);

    client.login(token).catch(err => console.log("Giriş hatası: " + err.message));
}

run();