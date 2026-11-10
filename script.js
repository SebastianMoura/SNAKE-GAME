
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tamanho = 20;

let cobra;
let comida;
let direcao;
let proximaDirecao;
let pontos;
let jogoAtivo;
let intervalo;

function iniciarJogo() {
    cobra = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direcao = { x: tamanho, y: 0 };
    proximaDirecao = { x: tamanho, y: 0 };
    pontos = 0;
    jogoAtivo = true;

    document.getElementById("score").textContent = pontos;
    document.getElementById("mensagem").textContent =
        "Use as setas para jogar!";

    gerarComida();
    clearInterval(intervalo);
    intervalo = setInterval(atualizarJogo, 120);
    desenharJogo();
}

function gerarComida() {
    do {
        comida = {
            x: Math.floor(Math.random() * (canvas.width / tamanho)) * tamanho,
            y: Math.floor(Math.random() * (canvas.height / tamanho)) * tamanho
        };
    } while (cobra.some(parte =>
        parte.x === comida.x && parte.y === comida.y
    ));
}

function desenharJogo() {
    ctx.fillStyle = "#1b2935";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar comida
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(comida.x, comida.y, tamanho, tamanho);

    // Desenhar cobra
    cobra.forEach((parte, index) => {
        ctx.fillStyle = index === 0 ? "#00ff88" : "#00cc77";
        ctx.fillRect(parte.x, parte.y, tamanho - 2, tamanho - 2);
    });
}

function atualizarJogo() {
    if (!jogoAtivo) return;

    direcao = proximaDirecao;

    const cabeca = {
        x: cobra[0].x + direcao.x,
        y: cobra[0].y + direcao.y
    };

    const comeu = cabeca.x === comida.x && cabeca.y === comida.y;

    // Verificar colisão com paredes
    if (
        cabeca.x < 0 ||
        cabeca.x >= canvas.width ||
        cabeca.y < 0 ||
        cabeca.y >= canvas.height
    ) {
        finalizarJogo();
        return;
    }

    // Verificar colisão com o próprio corpo
    const corpoVerificado = comeu ? cobra : cobra.slice(0, -1);

    if (corpoVerificado.some(parte =>
        parte.x === cabeca.x && parte.y === cabeca.y
    )) {
        finalizarJogo();
        return;
    }

    cobra.unshift(cabeca);

    if (comeu) {
        pontos += 10;
        document.getElementById("score").textContent = pontos;
        gerarComida();
    } else {
        cobra.pop();
    }

    desenharJogo();
}

function finalizarJogo() {
    jogoAtivo = false;
    clearInterval(intervalo);

    document.getElementById("mensagem").textContent =
        "Game Over! Pontuação: " + pontos;
}

document.addEventListener("keydown", function(event) {
    const teclas = {
        ArrowUp: { x: 0, y: -tamanho },
        ArrowDown: { x: 0, y: tamanho },
        ArrowLeft: { x: -tamanho, y: 0 },
        ArrowRight: { x: tamanho, y: 0 }
    };

    const novaDirecao = teclas[event.key];

    if (!novaDirecao) return;

    event.preventDefault();

    if (
        novaDirecao.x + direcao.x === 0 &&
        novaDirecao.y + direcao.y === 0
    ) return;

    proximaDirecao = novaDirecao;
});

function reiniciarJogo() {
    iniciarJogo();
}

iniciarJogo();
