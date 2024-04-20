
// function for fetching 
async function fetchPokemonData(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = await response.json();
    return data;
  }
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function random_from_array(arr){
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

class Pokemon {
    constructor(pk_name) {
        this.alive = true;
        this.name = pk_name;
        this.data = null;
        this.total_hp = null;
        this.level = Math.floor(Math.random() * (100 - 95 + 1)) + 95;
        this.moves = null;
        this.hp = null;
        this.attack = null;
        this.defense = null;
        this.speed = null;
        this.stats = {};
        this.type = null;
        this.moves_pp = {};
        this.index =1;
    }

    async fetchMoves() {
        const moveUrls = this.data.moves.map(move => move.move.url);
        const moves = await Promise.all(moveUrls.slice(0, 4).map(async (url) => {
          const moveData = await fetchData(url);
          return moveData;
        }));
        this.moves = moves;
        this.moves.forEach(move => {
            // Assign each move's PP to the corresponding move name in the movePP object
            this.moves_pp[move.name] = move.pp;
        });
      }

    async getdata() {
        this.data = await fetchPokemonData(this.name);
    }

    set_stat(stat) {
        return Math.floor(0.01*(2*stat.base_stat+Math.floor(0.25*stat.effort))*this.level+5);
    }

    async setdata() {
        let hp = this.data.stats[0];
        this.stats["attack"] = {
            name: "attack",
            total_value: this.data.stats[1],
            stat_state: 0
        };
        this.stats["defense"] ={
            name: "defense",
            total_value: this.data.stats[2],
            stat_state: 0
        };
        this.stats["special-attack"] ={
            name: "special_attack",
            total_value: this.data.stats[3],
            stat_state: 0
        };
        this.stats["special_defense"] ={
            name: "special_defense",
            total_value: this.data.stats[4],
            stat_state: 0
        };
        this.stats["speed"] ={
            name: "speed",
            total_value: this.data.stats[5],
            stat_state: 0
        };
        let attack = this.data.stats[1];
        let defense = this.data.stats[2];
        let special_attack = this.data.stats[3];
        let special_defense = this.data.stats[4];
        let speed = this.data.stats[5];
        this.total_hp = Math.floor(0.01*(2*hp.base_stat+Math.floor(0.25*hp.effort))+this.level+10);
        this.attack = this.set_stat(attack);
        this.defense = this.set_stat(defense);
        this.special_attack = this.set_stat(special_attack);
        this.special_defense = this.set_stat(special_defense);
        this.speed = this.set_stat(speed);
        this.type = this.data.types.map(typee => capitalize(typee.type.name));
        this.hp = this.total_hp;
    }
}

let pokemons = [
    'Pikachu', 'Eevee', 'Jigglypuff', 'Snorlax', 'Mewtwo', 'Gengar', 'Dragonite', 'Gyarados', 'Arcanine', 'Alakazam',
    'Gardevoir', 'Lucario', 'Salamence', 'Tyranitar', 'Garchomp', 'Blaziken', 'Greninja', 'Charizard', 'Venusaur', 'Blastoise',
    'Gengar', 'Machamp', 'Lapras', 'Poliwrath', 'Golem', 'Sandslash', 'Nidoking', 'Nidoqueen', 'Wigglytuff', 'Vileplume',
    'Parasect', 'Venomoth', 'Dugtrio', 'Persian', 'Golduck', 'Primeape', 'Arcanine', 'Poliwrath', 'Alakazam', 'Machamp',
    'Victreebel', 'Tentacruel', 'Golem', 'Slowbro', 'Magneton', 'Farfetch\'d', 'Dodrio', 'Dewgong', 'Muk', 'Cloyster',
    'Electrode', 'Exeggutor', 'Marowak', 'Hitmonlee', 'Hitmonchan', 'Weezing', 'Rhydon', 'Kangaskhan', 'Seaking', 'Starmie',
    'Scyther', 'Jynx', 'Electabuzz', 'Magmar', 'Pinsir', 'Tauros', 'Gyarados', 'Lapras', 'Ditto', 'Vaporeon', 'Jolteon',
    'Flareon', 'Porygon', 'Omastar', 'Kabutops', 'Aerodactyl', 'Snorlax', 'Articuno', 'Zapdos', 'Moltres', 'Dragonite',
    'Mewtwo', 'Mew', 'Chikorita', 'Cyndaquil', 'Totodile', 'Feraligatr', 'Typhlosion', 'Meganium', 'Quilava', 'Croconaw',
    'Furret', 'Noctowl', 'Ledian', 'Ariados', 'Crobat', 'Togetic', 'Xatu', 'Ampharos', 'Bellossom', 'Azumarill', 'Sudowoodo'
];
function damage(move,attacking_pk,defending_pk){
    let effectiveness = netEffectiveness(capitalize(move.type.name),defending_pk.type);
    let damage = (((2*attacking_pk.level/5+2)*move.power*attacking_pk.attack/defending_pk.defense/50)+2)*effectiveness;
    return damage;

}

function netEffectiveness(moveType, pokemonTypes) {
    const typeData = [
        {"name":"Normal","immunes":["Ghost"],"weaknesses":["Rock","Steel"],"strengths":[]},
        {"name":"Fire","immunes":[],"weaknesses":["Fire","Water","Rock","Dragon"],"strengths":["Grass","Ice","Bug","Steel"]},
        {"name":"Water","immunes":[],"weaknesses":["Water","Grass","Dragon"],"strengths":["Fire","Ground","Rock"]},
        {"name":"Electric","immunes":["Ground"],"weaknesses":["Electric","Grass","Dragon"],"strengths":["Water","Flying"]},
        {"name":"Grass","immunes":[],"weaknesses":["Fire","Grass","Poison","Flying","Bug","Dragon","Steel"],"strengths":["Water","Ground","Rock"]},
        {"name":"Ice","immunes":[],"weaknesses":["Fire","Water","Ice","Steel"],"strengths":["Grass","Ground","Flying","Dragon"]},
        {"name":"Fighting","immunes":["Ghost"],"weaknesses":["Poison","Flying","Psychic","Bug","Fairy"],"strengths":["Normal","Ice","Rock","Dark","Steel"]},
        {"name":"Poison","immunes":["Steel"],"weaknesses":["Poison","Ground","Rock","Ghost"],"strengths":["Grass","Fairy"]},
        {"name":"Ground","immunes":["Flying"],"weaknesses":["Grass","Bug"],"strengths":["Fire","Electric","Poison","Rock","Steel"]},
        {"name":"Flying","immunes":[],"weaknesses":["Electric","Rock","Steel"],"strengths":["Grass","Fighting","Bug"]},
        {"name":"Psychic","immunes":["Dark"],"weaknesses":["Psychic","Steel"],"strengths":["Fighting","Poison"]},
        {"name":"Bug","immunes":[],"weaknesses":["Fire","Fighting","Poison","Flying","Ghost","Steel","Fairy"],"strengths":["Grass","Psychic","Dark"]},
        {"name":"Rock","immunes":[],"weaknesses":["Fighting","Ground","Steel"],"strengths":["Fire","Ice","Flying","Bug"]},
        {"name":"Ghost","immunes":["Normal"],"weaknesses":["Dark"],"strengths":["Psychic","Ghost"]},
        {"name":"Dragon","immunes":["Fairy"],"weaknesses":["Steel"],"strengths":["Dragon"]},
        {"name":"Dark","immunes":[],"weaknesses":["Fighting","Dark","Fairy"],"strengths":["Psychic","Ghost"]},
        {"name":"Steel","immunes":[],"weaknesses":["Fire","Water","Electric","Steel"],"strengths":["Ice","Rock","Fairy"]},
        {"name":"Fairy","immunes":[],"weaknesses":["Fire","Poison","Steel"],"strengths":["Fighting","Dragon","Dark"]}
    ];

    const typeInfo = typeData.find(type => type.name === moveType);
    if (!typeInfo) {
        console.error("Invalid move type:", moveType);
        return 1;
    }

    let effectivenessProduct = 1;

    for (const pokemonType of pokemonTypes) {
        if (typeInfo.immunes.includes(pokemonType)) {
            effectivenessProduct *= 0;
        } else if (typeInfo.weaknesses.includes(pokemonType)) {
            effectivenessProduct *= 0.5;
        } else if (typeInfo.strengths.includes(pokemonType)) {
            effectivenessProduct *= 2;
        }
    }

    return effectivenessProduct;
}

async function spawn_pokemon(){
    const randomPokemonName = random_from_array(pokemons);
    const pokemon = new Pokemon(randomPokemonName);
    await pokemon.getdata();
    await pokemon.setdata();
    await pokemon.fetchMoves();
    return pokemon;
}

async function startGame() {
    let commentQueue = [];
    let player1mons = [null, null, null, null];
    let player2mons = [null, null, null, null];
    let alive1 = [1,0,1,1];
    let alive2 = [1,1,1,1];
    for(i=0;i<4;i++){
        player1mons[i] = await spawn_pokemon();
        player1mons[i].index = i+1;
        player2mons[i] = await spawn_pokemon();
        player2mons[i].index = i+1;
    }

    pokemon1 = player1mons[0];
    pokemon2 = player2mons[0];

    //rendering the two pokemons on the screen
    function updateUI(){
    document.getElementById('pk1').innerHTML = '<img src='+pokemon1.data.sprites.other.showdown.back_default +'></img>';
    document.getElementById('hp1').innerHTML = '<p>'+pokemon1.hp+'/'+pokemon1.total_hp+'</p>';
    document.getElementById('name1').innerHTML = '<p>'+pokemon1.name+' Lv'+pokemon1.level+'</p>';
    
    document.getElementById('pk2').innerHTML = '<img src='+pokemon2.data.sprites.other.showdown.front_default +'></img>';
    document.getElementById('hp2').innerHTML = '<p>'+pokemon2.hp+'/'+pokemon2.total_hp+'</p>';
    document.getElementById('name2').innerHTML = '<p>'+pokemon2.name+' Lv'+pokemon2.level+'</p>';

    for(i=0;i<4;i++){
        document.getElementById('p1_move'+(i+1)).innerHTML = renderbutton(pokemon1,pokemon1.moves[i]);
        document.getElementById('p2_move'+(i+1)).innerHTML = renderbutton(pokemon2,pokemon2.moves[i]);
        document.getElementById('p1_pkname'+(i+1)).innerHTML = capitalize(player1mons[i].data.name);
        document.getElementById('p2_pkname'+(i+1)).innerHTML = capitalize(player2mons[i].data.name);
    }
    document.getElementById('healthg1').style.width = ((pokemon1.hp/pokemon1.total_hp)*133)+'px';
    document.getElementById('healthg2').style.width = ((pokemon2.hp/pokemon2.total_hp)*133)+'px';
    }
    updateUI();

    let player1pressed = false;
    let player2pressed = false;
    let player1changing = false;
    let player2changing = false;
    let lastclickedby1,lastclickedby2;
    addToQueue("Player 1 choose move or switch");
    
    function processQueue() {
        if (commentQueue.length > 0) {
            const comment = commentQueue[0];
            displayComment(comment);
            setTimeout(() => {
                commentQueue.shift();
                processQueue();
            }, 1000);
        }
    }
    
    function renderbutton(pokemon,move){
        let name = move.name;
        return ('<p>'+capitalize(move.name)+'</p><span class="move_info"><span class="type_info">'+move.type.name.toUpperCase()+'</span>PP: '+pokemon.moves_pp[name]+'/'+move.pp+'</span>');
    }

    function displayComment(comment) {
        document.getElementById('comment').innerHTML = comment;
    }

    function addToQueue(comment) {
        commentQueue.push(comment);
        if (commentQueue.length === 1) {
            processQueue();
        }
    }


    // Now adding event listeners
    
    let move1,move2;
    let justfainted = false;
    let justfainted1 = false;
    let justfainted2 = false;
    function listners1move(){
    for (let i = 0; i < 4; i++) {
        (function(index) {
            document.getElementById('p1_move'+(index+1)).addEventListener('click', function(){
                if (pokemon2.moves_pp[pokemon2.moves[index].name]>0){
                    player1pressed = true;
                    move1 = pokemon1.moves[index];
                }
                else{
                    addToQueue("Out of PP for this move!");
                }
                // alert(capitalize(move1.name));
                checkButtons();
            });
        })(i);
    }
    }
    listners1move();

    function listners2move(){
    for (let i = 0; i < 4; i++) {
        (function(index) {
            document.getElementById('p2_move'+(index+1)).addEventListener('click', function(){
                if (pokemon2.moves_pp[pokemon2.moves[index].name]>0){
                player2pressed = true;
                move2 = pokemon2.moves[index];
                }
                else{
                    addToQueue("Out of PP for this move!");
                }
                checkButtons();
            });
        })(i);
    }
    }
    listners2move();

    function listners1mon(){
    for (let i = 0; i < 4; i++) {
        (function(index) {
            document.getElementById('p1_pkname'+(index+1)).addEventListener('click', function(){
                if (!player1mons[index].alive){
                        alert('The pokemon is fainted!');
                    }
                else{
                    if (justfainted1){
                        removelistners2();
                        switchPokemon(player1mons[index],1);
                        justfainted1 = false;
                        setTimeout(() => {
                            listners2mon();
                            listners2move();
                        }, 200);
                    }
                    else{
                        if (!player1changing){
                            player1pressed = true;
                            player1changing = true;
                            lastclickedby1 = player1mons[index];
                            checkButtons();
                        }
                        
                    }
                    
                }
            });
        })(i);
    }
}
    listners1mon();

    function listners2mon(){
    for (let i = 0; i < 4; i++) {
        (function(index) {
            document.getElementById('p2_pkname'+(index+1)).addEventListener('click', function(){
                if (!player2mons[index].alive){
                        alert('The pokemon is fainted!');
                    }
                else{
                    if (justfainted2){
                        removelistners1();
                        switchPokemon(player2mons[index],2);
                        justfainted2 = false;
                        setTimeout(() => {
                            listners1mon();
                            listners1move();
                        }, 200);
                    }
                    else{
                        if (!player2changing){
                            player2pressed = true;
                            player2changing = true;
                            lastclickedby2 = player2mons[index];
                            checkButtons();
                        }
                    }
                    
                }
            });
        })(i);
    }
}
    listners2mon();

    function removelistners1(){
        for (let i = 0; i < 4; i++) {
            const moveButton = document.getElementById('p1_move'+(i+1));
            const pokemonButton = document.getElementById('p1_pkname'+(i+1));
    
            const moveButtonClone = moveButton.cloneNode(true);
            const pokemonButtonClone = pokemonButton.cloneNode(true);
    
            moveButton.parentNode.replaceChild(moveButtonClone, moveButton);
            pokemonButton.parentNode.replaceChild(pokemonButtonClone, pokemonButton);
        }
    }

    function removelistners2(){
        for (let i = 0; i < 4; i++) {
            const moveButton = document.getElementById('p2_move'+(i+1));
            const pokemonButton = document.getElementById('p2_pkname'+(i+1));
    
            const moveButtonClone = moveButton.cloneNode(true);
            const pokemonButtonClone = pokemonButton.cloneNode(true);
    
            moveButton.parentNode.replaceChild(moveButtonClone, moveButton);
            pokemonButton.parentNode.replaceChild(pokemonButtonClone, pokemonButton);
        }
    }
    



    function checkButtons(){
        if (player1pressed){
            removelistners1();
        }

        if (player2pressed){
            removelistners2();
        }

        if ((player1pressed && player2pressed)){
            // alert('itna chala');
            turn(move1,move2);
            player1pressed = false;
            player2pressed = false;
            listners1mon();
            listners1move();
            listners2mon();
            listners2move();
        }
    }

    function turn(move1,move2){
        
        // check the speed of both pokemons and then decide which will attack and then pass the id in it
        if (player1changing){
            if (player2changing){
                setTimeout(function(){switchPokemon(lastclickedby1,1);},2000);
                setTimeout(function(){switchPokemon(lastclickedby2,2);},2000);
                // console.log('11');
                player1changing = false;
                player2changing = false;
                // alert('Both changing');
            }
            else{
                if (pokemon1.speed>=pokemon2.speed){
                    switchPokemon(lastclickedby1,1);
                    setTimeout(function(){attack(pokemon2,pokemon1,move2,'1');
                updateUI();},2000);
                }
                else{
                    attack(pokemon2,pokemon1,move2,'1');
                    updateUI();
                    if (pokemon1.alive){
                        setTimeout(function(){switchPokemon(lastclickedby1,1);},2000);
                    }
                }
                player1changing=false;
                // alert('1 changing');
                
            }
        }
        else{
            if (player2changing){
                if (pokemon2.speed>=pokemon1.speed){
                    switchPokemon(lastclickedby2,2);
                    setTimeout(function(){attack(pokemon1,pokemon2,move1,'2');
                updateUI();},2000);
                }
                else{
                    attack(pokemon1,pokemon2,move1,'2');
                    updateUI();
                    if (pokemon2.alive){
                        setTimeout(function(){switchPokemon(lastclickedby2,2);},2000);
                    }
                }
                player2changing=false;
                // alert('2 changing');
            }
            else{
                if (pokemon1.speed>=pokemon2.speed){
                    attack(pokemon1,pokemon2,move1,'2');
                    updateUI();
                    if (pokemon2.alive){
                        setTimeout(function(){attack(pokemon2,pokemon1,move2,'1');
                    updateUI();},2000);
                    }
                    
                }
                else{
                    attack(pokemon2,pokemon1,move2,'1');
                    updateUI();
                    if (pokemon1.alive){
                        setTimeout(function(){attack(pokemon1,pokemon2,move1,'2');
                    updateUI();},2000);
                    }
                    
                }
            }

        }
        


    }

    function attack(attacker,defender,move,id){
        if (move.target.name == "selected-pokemon" || move.target.name == "all-other-pokemon"){
            let otherid;
            if (id==1){
                otherid =2;
            }
            else{
                otherid=1;
            }
            // let moveindex;
            // for (let i = 0; i < 4; i++) {
            //     if (attacker.moves[i].name == move.name){
            //         moveindex = i;
            //     }
            // }
            document.getElementById('pk' + otherid).classList.add('attack-animation'+otherid);

            addToQueue(capitalize(attacker.data.name) + ' used '+ move.name + ' !');
            attacker.moves_pp[move.name] -=1;
            
            if ((Math.floor(Math.random() * 100) + 1)<move.accuracy){
                let move_damage = damage(move,attacker,defender);
                move_damage = Math.min(defender.hp,move_damage);
                let move_scale = netEffectiveness(capitalize(move.type.name),defender.type);
                switch(move_scale){
                    case 0:
                        addToQueue('It had no effect!');
                        break;
                    case 0.5:
                        addToQueue('It was not very effective!');
                        
                        break;
                    case 2:
                        addToQueue('It was super effective!');
                        
                        break;
                    case 4:
                        addToQueue('It was super effective!');
                        
                        break;
                }
                defender.hp -=Math.floor(move_damage);
                document.getElementById('healthg'+id).style.width = ((defender.hp/defender.total_hp)*133)+'px';
                addToQueue(capitalize(defender.data.name) + ' lost '+ Math.floor(move_damage) + ' HP');
                document.getElementById('hp'+id).innerHTML = '<p>HP:'+defender.hp+'/'+defender.total_hp+'</p>';
                
            }
            else{
                addToQueue('Attack Missed!');
            }
            setTimeout(() => {
                document.getElementById('pk' + otherid).classList.remove('attack-animation'+otherid);
            }, 1000);
            
            checkfainted(defender,id,otherid);
        }
    }

    const statStageMultiplierMap = new Map([
        [-6, 0.25],
        [-5, 0.28],
        [-4, 0.33],
        [-3, 0.40],
        [-2, 0.50],
        [-1, 0.66],
        [0, 1],
        [1, 1.5],
        [2, 2],
        [3, 2.5],
        [4, 3],
        [5, 3.5],
        [6, 4]
    ]);

    function checkfainted(defender,id,otherid){
        if (defender.hp <=0){
            addToQueue(capitalize(defender.data.name)+' Fainted!');
            defender.alive = false;
            document.getElementById('pk' + id).classList.add('faint-animation');
            document.getElementById('player' + id).classList.add('faint-animation');
            addToQueue('Player'+id+' select another pokemon');
            document.getElementById('p'+id+'_pkname'+defender.index).style.background = '#fdc1aa';
            justfainted=true;
            if (id==1){
                justfainted1=true;
            }
            else{
                justfainted2=true;
            }
            checkgameOver(defender,id,otherid);
        }
        

    }

    function checkgameOver(defender,id,otherid){
        let sum = 0;
        for (let i = 0; i < 4; i++) {
            if (id==1){
                sum += player1mons[i].hp;
            }
            else{
                sum+=player2mons[i].hp;
            }
        }
        if(sum<1){
            addToQueue('GAME OVER! Player'+otherid+' won the battle!')
        }
    }

    function switchPokemon(selectedpk,id) {
        if (id==1){
            pokemon1 = player1mons[selectedpk.index-1];
            updateUI();
            
        }
        else{
            pokemon2 = player2mons[selectedpk.index-1];
            updateUI();
        }
        addToQueue('Player'+id+' changed to '+capitalize(selectedpk.data.name));
        setTimeout(() => {
            document.getElementById('pk' + id).classList.remove('faint-animation');
            document.getElementById('player' + id).classList.remove('faint-animation');
        }, 1000);
        
    }

}



startGame();
