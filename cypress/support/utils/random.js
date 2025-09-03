// FUNÇÃO PARA GERAR UM NÚMERO ALEATÓRIO ENTRE 1 E O NÚMERO INFORMADO
export default function geraNumeroAleatorio(numFinal) {
    return Math.floor(Math.random() * (numFinal + 1))
}

// FUNÇÃO PARA GERAR UM NÚMERO ALEATÓRIO ENTRE 1 E 500
export function geraQuantidadeAleatorio() {
    return Math.floor(Math.random() * 500) +1
}