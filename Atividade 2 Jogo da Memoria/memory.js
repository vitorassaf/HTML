var memory_array = ['A', 'A', 'B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J','K','K','L','L'];

var memory_values = [];

var memory_tile_ids = [];

var tiles_flipped = 0;

var level = 700;

var myScore;

var errou = 0;


Array.prototype.memory_tile_shuffle = function()
{
    var i = this.length, j, temp;
    while(--i > 0) 
    {
        j=Math.floor(Math.random() * (i+1));
        temp = this[j];
        this[j] = this [i];
        this[i]=temp
    }
}

function newBoard()
{
    tiles_flipped = 0;
    var output = '';
    memory_array.memory_tile_shuffle();
    for(var i = 0; i <memory_array.length; i++)
    {
        output +='<div id="tile_'+i+' "onclick="memoryFlipTile(this,\''+memory_array[i]+'\')"></div>';
    }
        document.getElementById('memory_board').innerHTML = output;
    }

    function memoryFlipTile(tile,val)
    {
        if(tile.innerHTML == "" && memory_values.length < 2)
        {
            tile.style.background ='#FFF';
            tile.innerHTML = val;
            if(memory_values.length == 0)
            {
                memory_values.push(val);
                memory_tile_ids.push(tile.id);
            }
            else if(memory_values.length == 1)
            {
            
                memory_values.push(val);
                memory_tile_ids.push(tile.id);
                if(memory_values[0] == memory_values[1])
                {
                    
                    tiles_flipped +=2;
                    //limpar os valores das arrays
                    memory_values = [];
                    memory_tile_ids = [];
                    //verificar se tem cartas ainda
                    if (tiles_flipped == memory_array.length)
                    {
                        alert ("Você Venceu! Começando Outro Jogo...");
                        document.getElementById('memory_board').innerHTML="";
                        newBoard();
                    }
                }
                    else
                    {
                        var status = document.getElementById("status");
                        status.innerHTML = "Você errou!";

                        errou += 1;

                        if(level == 200 && errou > 2 )
                        {
                            alert ("perdeu");

                        }
                        

                        function flip2Back()
                        {
                            
                            status.innerHTML = "";
                            var tile_1 = document.getElementById(memory_tile_ids[0]);
                            var tile_2 = document.getElementById(memory_tile_ids[1]);
                            tile_1.style.background = 'url("image/game.png")';
                            tile_1.style.backgroundSize = 'cover';
                            tile_1.innerHTML = "";

                            tile_2.style.background = 'url("image/game.png")';
                            tile_2.style.backgroundSize = 'cover';
                            tile_2.innerHTML = "";
                            //limpar as arrays
                            memory_values = [];
                            memory_tile_ids = [];
                        }
                        setTimeout(flip2Back, level);
                    }
                }
            }
         }
         function Dificil()
         {
            level = 200;
         }

         function Medio()
         {
            level = 600;
         }

         function facil()
         {
            level = 700;
         }

         
     
     
    

