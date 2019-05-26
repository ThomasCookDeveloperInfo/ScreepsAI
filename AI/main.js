var roleHarvester = require('harvester');
var roleUpgrader = require('upgrader');
var roleBuilder = require('builder');

const MAX_HARVESTER_TEAMS_PER_ROOM = 2;
const MAX_HARVESTERS_PER_ROOM = 10;

module.exports.loop = function () {
    function initialize() {
        Memory.harvesterTeams = [];
        Memory.isInitialized = true;
        console.log("Initialized");
    }

    if (!Memory.isInitialized) {
        initialize();
    }

    for var harvesterTeam in Memory.harvesterTeams) {
        for (var name in harvesterTeam) {
            if(!Game.creeps[name]) {
                delete Memory.harvesterTeams[harvesterTeam][name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }

    var harvesterTeams = Memory.harvesterTeams;

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

    if(harvesters.length < MAX_HARVESTERS_PER_ROOM) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
