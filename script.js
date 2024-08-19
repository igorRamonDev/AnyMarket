function pesquisaPedido() {
  var numeroPedido = document.getElementById("numeroPedido").value;
  var consultaUrl = `http://pirbraiis01.b1cloud.com.br:85/ConsultaSoft/BuscaPedidoAnyMarket?PedidoSAP=${numeroPedido}`;

  document.getElementById("retorno").innerText = "";

  console.log(`Consultando API com URL: ${consultaUrl}`);

  fetch(consultaUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na resposta da rede');
    }
    return response.json();
  })
  .then(data => {
    console.log('Dados recebidos da API de consulta:', data);
    if (data && data.length > 0 && data[0].U_id_anymarket) {
      var anyMarketId = data[0].U_id_anymarket;

      fetchPrintTagPDF(anyMarketId);
    } else {
      document.getElementById("retorno").innerText = "Nenhum pedido encontrado com o número informado.";
    }
  })
  .catch(error => {
    console.error('Erro', error);
    document.getElementById("retorno").innerText = "Erro";
  });
}

function fetchPrintTagPDF(anyMarketId) {
  var url = "https://api.anymarket.com.br/v2/printtag/PDF";
  var token = "259078976L1E1753302148618C165999014861800O1.I";

  var requestBody = {
    "orders": [
      anyMarketId
    ]
  };

  console.log(`Consultando API de PDF com ID: ${anyMarketId}`);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "gumgaToken": token
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.blob();
  })
  .then(blob => {
    var url = URL.createObjectURL(blob);
    var newWindow = window.open(url);

    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
      document.getElementById("retorno").innerText = "Popup bloqueado! Por favor ative para ver o PDF.";
    } else {
      document.getElementById("retorno").innerText = "Abrindo PDF, aguarde...";
    }
  })
  .catch(error => {
    console.error('Erro', error);
    document.getElementById("retorno").innerText = "Ocorreu um erro durante a segunda chamada à API.";
  });
}
