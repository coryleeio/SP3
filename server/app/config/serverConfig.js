module.exports = {
    'shared_server_secret' : process.env.SHARED_SERVER_SECRET,
    'host' : process.env.HOST,
    'port' : process.env.PORT,
    roomsPerServer: process.env.NUMROOMS || 4,
    playersPerRoom: process.env.PLAYERS_PER_ROOM || 16
};