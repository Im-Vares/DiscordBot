const Discord = require('discord.js')
const client = new Discord.Client({intents: 32767}) 
const keepAlive = require("./server")  
const guildInvites = new Map();

client.on('ready', () =>{ 
    console.log(`Привет! ${client.user.tag} запустился!`)
      
})


const { joinVoiceChannel } = require('@discordjs/voice');
client.on('messageCreate', message => {
    if(message.content === '!join') {
        joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })
    }
})




client.on("voiceStateUpdate",(oldState,newState)=>{
    var categoryid = "category.id";
    var channelid = "channel.id";

    if(newState.channel?.id == channelid){
        newState.guild.channels.create(`Приватка ${newState.member.user.username} `,{
            type:"GUILD_VOICE",
            parent:categoryid,
            permissionOverwrites:[{
                id:newState.member.id,
                allow: ["MANAGE_CHANNELS"]
            },{
                id:newState.guild.id,
                deny:["MANAGE_CHANNELS"]
            }] 
        }).then(channel=>{
            newState.setChannel(channel)
            channel.createInvite({
                maxAge:0,
                maxUses:0,
           
            }).then(inv=>newState.member.send(inv.toString()))
        })
    } 
    if(oldState.channel?.id != channelid && oldState.channel?.parent?.id == categoryid && !oldState.channel?.members.size) oldState.channel.delete();
})


client.on('messageCreate', message =>{ 
    if (message.author.bot) return; 
    if (message.content == '!профиль') { 
    let status = ''
    switch (message.member.presence.status) { 
        case 'online':
            status = 'онлайн'; break; 
            case 'idle':
                status = ':orange_circle:нет на месте'; break;
                case 'offline':
                    status = 'нет в сети'; break;
                    case 'dnd':
                        status = ':red_circle:не беспокоить'; break;
    }
      let embed = new Discord.MessageEmbed() 
    .setTitle(`${message.author.username}`) //вот так
    .setDescription(`**Ваш дискорд айди: ${message.author.id}
    Ваш статус: ${status}
    Дата создания аккаунта: ${message.author.createdAt.toLocaleDateString()}
    Дата входа на сервер: ${message.member.joinedAt.toLocaleDateString()}
    **`) 
    .setColor('RANDOM') 
    .setThumbnail(message.author.avatarURL()) 
    message.channel.send({embeds: [embed]})
    }
})

client.on('messageDelete', message =>{ 
   if (message.author.bot) return;
    let embed12 = new Discord.MessageEmbed()
    .setTitle('Было удалено сообщение!')
    .setColor('RANDOM')
    .addField(`Удалённое сообщение:`, `${message.content|| `отсутствует`}`, true)
    .addField("Автор:",`${message.author.tag} (${message.author})`,true)
    .addField("Канал:", `${message.channel}`, false)
    .setFooter(' - ',`${message.author.avatarURL()}`)
    .setTimestamp(message.createdAt);
  client.channels.cache.get("channel.token").send({embeds: [embed12]})
})


client.on('guildMemberAdd', member =>{ 
    let embed11 = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Привет, ${member.user.username}!`)
    .setDescription(`Ты попал на сервер `)
    .setFooter('Будь всегда на позитиве :3', 'https://cdn.discordapp.com/emojis/590614597610766336.gif?v=1')
    .setColor('RANDOM')
    member.send({embeds: [embed11]}); 

    let embed2 = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Пользователь вошел на сервер`)
     .addField('Пользователь:', `${member.user}`)
    .setColor('RANDOM')
    client.channels.cache.get('channel.token').send({embeds: [embed2]})
})

client.on('guildMemberRemove', member => { 
    let embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Пользователь покинул сервер`)
     .addField('Пользователь:', `${member.user}`)
    .setColor('RANDOM')
    client.channels.cache.get('channel.token').send({embeds: [embed]})
  })


keepAlive()

client.login(process.env.BOT_TOKKEN) 
