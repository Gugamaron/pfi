
//definição de forças

var gravity = new PVector(0, 0);

//criando obejto bola para testes
var ball2 = new Physical(200,550,50,50);

//Métodos do slider de desenho do slider --------------------------------------------------------------

//desenhar slider
Slider.prototype.draw = function()
{
    rectMode(CENTER);
    fill(255,255,255);
    rect(this.position.x,this.position.y,this.w,this.h);
    fill(0,0,255);
    ellipse(this.position.x+this.real_value,this.position.y,25,25);
    fill(255,255,255);
    text(this.name, this.position.x - this.w * 0.5, this.position.y - this.h*5, 200, 200);
    text(this.value, this.position.x, this.position.y + this.h*4, 200, 200);
}

//vericar se mouse está no slide e mudar valores conforme a posição do slide (Talvez possa ser melhorado)
var over = false; //mouse em cima

Slider.prototype.update = function()
{
    eval((this.variavel) + "=" + (this.value)); // modifica o valor a qual o slide se refere

    //verifica se mouse está em cima da bolinha
    if  (
        (mouseX < this.position.x+this.real_value)+25 && mouseX > (this.position.x+this.real_value)-25 &&
        (mouseX < this.position.y)+25 && mouseX > (this.position.y)-25
        )
    {
        over = true;
    }
    else
    {
        over = false;
    }

    //movimenta se mouse está em cima
    if (mousePressed == true && over == true)
    {
        if (mouseX <= this.position.x + this.w/2 && mouseX >= this.position.x - this.w/2)
        {
            this.real_value = mouseX-this.position.x;
            this.value = map(mouseX-this.position.x, -this.w/2, this.w/2, this.min, this.max); //Regra de três do slider
        }
    }

}


//criando sliders
var slider = new Slider("Força Aplicada", 0,100,"ball2.apllied_force.x",400,200,100,5); //modifica força aplicada
var sliderm = new Slider("Massa", 1,100,"ball2.mass",600,200,100,5); // Digamos que está em Kg

var sliderg = new Slider("Gravidade", 3.7, 24.79, "gravity.y",800,200,100,5); // modifica a gravidade variando da gravidade de mércurio até jupíter


// Relacionado ao canvas e ao desenho ------------------------------------------

//Configurações iniciais do canvas
void setup ()
{
    size(1280,720);
    background(100, 100, 100);
}

void draw ()
{

    background(100, 100, 100); //Para que a animação funcione.
    stroke(0,0,0); //para os desenhos terem uma linha preta ao redor.


    //Desenhando e dando uptade nos slides( é necessário uma função para fazer isso de forma otimizada)
    slider.update();
    slider.draw();
    sliderm.update();
    sliderm.draw();


    // Dando update nos obejetos físicos
    ball2.update();


    //Aplicando a gravidade
    gravity = new PVector(0, 0.1);
    sliderg.update();
    sliderg.draw();
    gravity.y *= ball2.mass;//peso
    ball2.weight = gravity;//registra o peso no objeto
    ball2.addForce(gravity);
    ball2.normal =PVector.mult(gravity, -1);//normal
    ball2.addForce(PVector.mult(gravity, -1));//registra normal no objeto


    // Calcula a força resultante da força aplicada + o atrito e aplica está força no objeto bola
    var force = PVector.add(ball2.apllied_force, ball2.friction);
    ball2.addForce(force);


    // Questões relacionadas ao desenho do quadrado (Isto deve ser mudado par um método do Physical)
    fill(0,255,0);
    rectMode(CORNER);
    rect(0,575,1280,720);
    fill(255,255,255);
    rectMode(CENTER);
    rect(ball2.position.x, ball2.position.y, ball2.w, ball2.h);


    // Para que o objeto ball2 quando sair da tela volte do outro lado. (Talvez possa ser mudado)
    if (ball2.position.x > 1280)
    {
        ball2.position.x = 0;
    }
    if (ball2.position.x < 0)
    {
        ball2.position.x = 1280;
    }

}
