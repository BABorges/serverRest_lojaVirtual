// FUNÇÃO PARA GERAR UM NÚMERO ALEATÓRIO
export default function geraNumeroAleatorio(numFinal) {
    return Math.floor(Math.random() * (numFinal + 1))
}