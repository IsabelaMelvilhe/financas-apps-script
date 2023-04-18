//Função inicializa nossa web app através do arquivo index.html
function doGet(){
  var template = HtmlService.createTemplateFromFile('index')
  return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

//ID da planilha
var planilha = SpreadsheetApp.openById("idDaPlanilha")

//Função para buscar os dados de acordo com o tipo da transação
function getDados(tipo){
  //Busca as categorias disponiveis
  let abaCategorias = planilha.getSheetByName("Categorias de Transações")
  let dadosCategorias = abaCategorias.getRange(2,1,abaCategorias.getLastRow()-1,2).getValues()
  var categorias

  //Diferencia transação de pagamento e recebimento
  if (tipo == "recebimento") categorias = dadosCategorias.filter(dado => dado[1] == "Recebimento").map(dado => dado[0])
  else categorias = dadosCategorias.filter(dado => dado[1] !== "Recebimento").map(dado => dado[0])

  //Puxa as formas de pagamento disponiveis
  let abaPagamentos = planilha.getSheetByName("Formas de Pagamento")
  let formasDePagamento = abaPagamentos.getRange(2,1,abaPagamentos.getLastRow()-1,4).getValues()

  Logger.log({categorias, formasDePagamento})

  return {categorias, formasDePagamento}
}

//Função busca e retorna as contas fixas registradas na planilha
function getContasFixas(){
  let aba = planilha.getSheetByName("Contas Fixas")
  let dados = aba.getRange(2,1,aba.getLastRow()-1,2).getValues()
  var contasFixas = dados.map(dado => { return {nome: dado[0], valor: dado[1]} })
  
  Logger.log(contasFixas)

  return contasFixas
}

//Função para salvar transações na planilha
function novaTransacao(transacoes) {
  let aba = planilha.getSheetByName("Transações")
  let lastRow = aba.getLastRow() + 1

  //Percorre cada transação para inserir a data/hora, o e-mail de registro e as demais informações da transação
  let dados = transacoes.map(transacao => {
    let novaTransacao = transacao

    while (novaTransacao.length < 9) {
      novaTransacao.push(null)
    }

    return novaTransacao
  })

  Logger.log(dados)

  //Salva os dados na planilha
  aba.getRange(lastRow,1,dados.length,9).setValues(dados)
}


