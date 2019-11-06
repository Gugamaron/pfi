// ***Aqui se encontram as definições das classes e de seus métodos não relacionados a desenho.
//Métodos relacionados a desenho são definidos no test.js

// Unphysical -------------------------------------------------------------------
// Esta é a classe de objetos que os quais são exibidos mas a física não se aplica
// Eles somente tem um vetor posição e atributos de comprimento e altura
var Unphysical = function(x,y,w,h)
{
    this.position = new PVector(x,y);
    this.w = w;
    this.h = h;
}

// Physical ----------------------------------------------------------------
// Esta é classe de objetos aos quais a física se aplicará. Ela herda de Unphysical. Porém também contém vetores de velocidade e aceleração
var Physical = function(x=200, y=200, w=10, h=10, mass=1, density=1)
{
    Unphysical.call(this,x,y,w,h);

    this.velocity = new PVector(0,0);
    this.acceleration = new PVector(0,0);
    this.mass = mass;

    this.apllied_force = new PVector(0,0); //força que está sendo aplicada nele (talvez mude)
    this.cStaticFriction = 0.5; // Coeficiente de atrito estático
    this.cDinamicFriction = 0.3; // Coeficiente de atrito Dinãmico
    this.friction = new PVector(0,0);

    //Peso e normal (Porém são só valores não estão relacionados a gravidade )
    this.weight = new PVector(0,0);
    this.normal = new PVector(0,0);
}

//Métodos da classe Physical

//método para definir qual será valor do atrito (ele é chamda no método update)
//(Ainda não está relacionado a gravidade, precisa realacionar)
//(Necessário retirar verficação que deixa atrito igual a zero se força igual a zero)
Physical.prototype.define_friction = function()
{
    var friction = new PVector(0, 0);

    //primeiro verifica se o atrito está se opondo ao movimento, caso contrário faz com que isto aconteça.
    if (this.friction.x > 0 && this.velocity.x > 0 || this.friction.x < 0 && this.velocity.x < 0)
    {
        this.velocity.x = 0;
        friction = PVector.mult(this.apllied_force, -1);
    }else{
        //Depois verfica se atrito que deve ser aplicado é o atrito dinâmico ou estático
        if (this.apllied_force.mag() != 0){
            friction = PVector.mult(this.apllied_force, -1);
        }else{
            friction = PVector.mult(this.velocity, -1);
        }
        if (this.velocity.mag() == 0){

            if (this.apllied_force.mag() > this.cStaticFriction * this.normal.mag()){

                friction.setMag(this.cDinamicFriction * this.normal.mag());
            }

        }else {

            friction.setMag(this.cDinamicFriction * this.normal.mag());
        }


    }


    this.friction = friction;
}

//Método para atualizações necessárias a todo momento
Physical.prototype.update = function()
{

    this.define_friction();



    //Questoões da movimentação
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
}

//Método para aplicar forças no Physical
Physical.prototype.addForce = function(force)
{
    // f = m * a  logo a = f / m  então está função calcula a aceleração gerada por uma força e aplica na aceleration
    var f = PVector.div(PVector.div(force, 60), this.mass); // a força é dividida por 60, pois ela é aplicada 60 vezes por segundo
    this.acceleration.add(f);
}

// Slider ------------------------------------------------------------
// É um controle deslizante para mudar certos valores
var Slider = function(name,min, max, variavel,x=200, y=200, w=10, h=10)
{
    Unphysical.call(this,x,y,w,h);

    //nome que será exibido em cima do slider
    this.name = name;
    //valores limite para o slider
    this.min = min;
    this.max = max;

    this.variavel = variavel; // Nome do valor que o slider vai alterar

    this.value = this.max/2; // value é o valor dentro dos limites
    this.real_value = 0; // real_value é o valor em  relação ao tamanho do slider

}
