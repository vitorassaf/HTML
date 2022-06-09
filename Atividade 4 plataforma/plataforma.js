var  LEVELS=[];
LEVELS[0]=[
    "  =xxx  |      v     |o x",
    "                        x",
    "                        x",
    "   @    x!!!!           x",
    "       xxx!!!!          x",
    "      xxxxx!!!          x",
    " xxxxxxxxxxxxxxxxxxxxxxxx"
];
// - espaço vazio
// = obstaculo com movimento horizontal
// x Parede/plataforma
// | obstaculo com movimento vertical
// v gotejamento
// @ posição inicial do jogador
// o moeda
// ! lava

function Level(plan) //criar o cenario
{
    this.width = plan [0].lenght;
    this.height = plan.lenght;
    this.grid = [];
    this.actors = [];

    for(var y= 0; y < this.height;y ++)
    {
        var line = plan[y], gridLine =[];
        for(var x = 0; x < this.width; x++)
        {
            var ch = line[x], fieldType = null;
            var Actor = actorChars[ch];

            if(Actor)
            {
            this.actors.push(new Actor(new Vector(x,y), ch));
            }

            else if(ch == "x")
            {
                fieldType = "Wall"
            }
            else if (ch == "!")
            {
                fieldType = "Lava"
            }
            gridLine.push(fieldType);
        }
        this.grid.push(gridLine);
    }

    this.player = this.actors.filter(function(actor)
    {
        return actor.type == "player";
    })[0];

    this.status = this.finishDelay = null;
    
}

Level.prototype.isFinished = function() //verificar se ele venceu/perdeu
{
    return this.status != null && this.finishDelay < 0;
};

function Vector (x, y)
{
    this.x = x;
    this.y = y;
}
Vector.prototype.plus = function(other)
{
    return new Vector(this.x +other.x, this.y + other.y)
    
};
Vector.prototype.times = function(factor)
{
    return new Vector(this.x * factor,this.y * factor);
};

var actorChars = 
{
    "@": Player,
    "o": Coin,
    "=": Lava, "|": Lava, "v":Lava
};

function Player (pos) //Posição, tamanho e velocidade do player
{
    this.pos = pos.plus(new Vector(0, -0.5));
    this.size = new Vector (0.8, 1.5);
    this.speed = new Vector(0,0);
}

Player.prototype.type = "player";

function Lava(pos, ch) //posição da lava,tamanho dos objetos e velocidade dos objetos
{
    this.pos = pos;
    this.size = new Vector (1,1);
    if(ch == "=")
    {
        this.speed = new Vector (2,0)
    }
    else if (ch == "|")
    {
        this.speed = new Vector(0, 2);
    }
    else if (ch == "v")
    {
        this.speed = new Vector(0, 3);
        this.repeatPos = pos;
    }
}
Lava.prototype.type = "lava";

function Coin(pos)
{
    this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1))
    this.size = new Vector(0.6, 0.6);
    this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

function elt(name, className)
{
    var elt = document.createElement(name);
    if(className) elt.className = className
    return elt;
}
function Domdisplay(parent, level)
{
    this.wrap = parent.appendChild(elt("div", "game"));
    this.level;

    this.wrap.appendChild(this.drawBackground());
    this.actorLayer = null;
    this.drawFrame();
}

var scale = 20

Domdisplay.prototype.drawBackground = function()
{
    var table = elt("table", "background");
    table.style.width = this.level.width * scale + "px";
    this.level.grid.ForEach(function(row)
    {
        var rowElt = table.appendChild(elt("tr"))
        rowElt.style.height = scale + "px";
        row.ForEach(function (type)
        {
            rowElt.appendChild(elt("td",type));
        });
    });
    return table;
};

Domdisplay.prototype.drawActors = function()
{
    var wrap = elt("div")
    this.level.actors.ForEach(function(actor)
    {
        var rect = wrap.appendChild(elt("div", "actor " + actor.type));
        rect.style.width = actor.size.x * scale + "px";
        rect.style.height = actor.size.y * scale + "px";
        rect.style.left = actor.pos.x * scale + "px";
        rect.style.top = actor.pos.y * scale + "px";
    });
    return wrap;
};

Domdisplay.prototype.drawFrame = function()
{
 if(this.actorLayer)
 {
     this.wrap.removeChild(this.actorLayer);
 }
 this.actorLayer = this.wrap.appendChild(this.drawActors());
 this.wrap.className = "game" + (this.level.status || "")
 this.scrollPlayerIntoView();
};

Domdisplay.prototype.scrollPlayerIntoView = function()
{
    var width = this.wrap.clientWidth;
    var height = this.wrap.clientHeight;
    var margin = width/3;

    var left = this.wrap.scrolleft, right = left + width;
    var top = this.wrap.scrollTop, bottom = top + height;

    var player = this.level.player;
    var center = player.pos.plus(player.size.times(0.5))
                            .times(scale);
    
    if(center.x < left + margin)
    this.wrap.scrolleft = center.x - margin;
    else if (center.x > right - margin)
    this.wrap.scrolleft = center.x + margin - width;
    if(center.y < top + margin)
    this.wrap.scrollTop = center.y - margin
    else if(center.y < top + margin)
    this.wrap.scrollTop = center.y + margin - height;
};

Domdisplay.prototype.clear = function ()
{
    this.wrap.parentNode.removeChild(this.wrap);
};

level.prototype.obstacleAt = function(pos, size)
{
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y);
    var yEnd = Math.ceil(pos.y + size.y);

    if(xStart < 0 || xEnd > this.width || yStart < 0)
      return "wall";
    if(yEnd > this.height)
      return "lava";
    for(var y = yStart;y < yEnd; y++)
    {
        for(var x = xStart; x < xEnd; x++)
        {
            var fieldType = this.grid[y][x];
            if(fieldType) return fieldType;
        }
    }
};

level.prototype.actorAt = function(actor)
{
    for(var i = 0;i < this.actors.lenght;i++)
    {
        var other = this.actors[i];
        if(other != actor && 
            actor.pos.x + actor.size.x > other.pos.x &&
            actor.pos.x < other.size.x + other.pos.x &&
            actor.pos.y + actor.size.y > other.pos.y &&
            actor.pos.y < other.size.y + other.pos.y)

            return other;
    }
};

level.prototype.animate = function(step, keys)
{
    if(this.status != null)
    this.finishDelay -= step;

    while(step > 0)
    {
        var thiStep = Math.min(step, maxStep);
        this.actors.ForEach(function(actor)
    {
    
    actor.act(thiStep,this, keys);
    }, this);
    step -= thiStep;
}

};

Lava.prototype.act = function(step, level)
{
    var newPos = this.pos.plus(this.speed.times(step));
    if(!level.obstacleAt(newPos, this.size))
        this.pos = newPos;
    else if(this.repeatPos)
        this.pos = this.repeatPos;
    else
        this.speed = this.speed.times(-1)
};

var wobbleSpeed = 8; wobbleDist = 0.07;

Coin.prototype.act = function(step)
{
    this.wobble += step * wobbleSpeed;
    var wobblePos = math.sin(this.wobble) * wobbleDist;
    this.pos = this.basePos.plus(new Vector(0, wobblePos));
};
var playerXSpeed = 7;

Player.prototype.moveX - function(step, level, keys)
{
    this.speed.x = 0;
    if(keys.left) this.speed.x -= playerXSpeed;
    if(keys.right) this.speed.x += playerXSpeed;

    var motion = new Vector(this.speed.x * step,0);
    var newPos = this.pos.plus(motion)
    
};

var arrowCodes = {37: "left", 38: "up", 39: "right"};

function trackKeys(codes)
{
    var pressed = Object.create(null);
    //function handler =
}