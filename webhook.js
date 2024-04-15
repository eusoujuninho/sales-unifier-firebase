const fetch = require("node-fetch"); // Certifique-se de ter o node-fetch instalado para fetchExchangeRate

// ... código anterior ...

async function insertTransaction(transactionData) {
  const result = await db.collection("Transactions").add(transactionData);
  console.log(`Transaction inserted with ID: ${result.id}`);
}

async function mockWebhookRequest() {
  // Aqui você simularia os dados recebidos de um webhook
  const webhookData = {
    createdAt: "",
    paidAt: "",
    payment: {
      method: "",
      type: "",
      currency: "",
      amount: "",
      installments: {
        quantity: 1,
        amount: 1
      }
    },
    currency: "BRL",
    amount: 100,
    status: "approved",
    platform: "perfectpay",
    code: "",
    product: {
      name: "",
      code: ""
    },
    offer: {
      name: "",
      code: "",
      currency: "",
      amount: ""
    },
    comissions: [
      {
        type: "producer",
        currency: "BRL",
        amount: 20
      }
    ],
    customer: {
      fullName: "",
      email: "",
      address: {
        address: "",
        number: "",
        complement: "",
        city: "",
        state: "",
        country: "",
      },
    },
    tracking: {
      utm_campaign: "",
      utm_medium: "",
      utm_term: "",
      utm_source: "",
      src: "",
      sck: "",
    },
  };

  // Use getDocumentByExternalId para buscar os dados necessários baseados nos IDs externos
  const paymentMethodData = await getDocumentByExternalId(
    "PaymentMethods",
    webhookData.paymentMethodExternalId,
    webhookData.platform,
  );
  const paymentTypeData = await getDocumentByExternalId(
    "PaymentTypes",
    webhookData.paymentTypeExternalId,
    webhookData.platform,
  );
  const statusData = await getDocumentByExternalId(
    "Statuses",
    webhookData.statusExternalId,
    webhookData.platform,
  );

  const exchangeRate = await fetchExchangeRate("USD", "BRL");

  // Construa o objeto de transação com base nos dados recebidos e nas informações recuperadas
  const transactionData = {
    paidValue: {
      amount: webhookData.amount, // Suponha que este valor é fornecido pelo webhook
      currency: "USD",
      exchangeRate: exchangeRate,
    },
    finalValueBRL: webhookData.amount * exchangeRate,
    code: webhookData.transactionCode, // Suponha que o código da transação é fornecido pelo webhook
    platform: webhookData.platform, // A referência da plataforma já foi buscada
    paymentMethod: paymentMethodData, // Os dados do método de pagamento já foram buscados
    paymentType: paymentTypeData, // Os dados do tipo de pagamento já foram buscados
    status: statusData, // Os dados do status já foram buscados
    // ... outros campos conforme a estrutura desejada
  };

  // Insira os dados de transação
  await insertTransaction(transactionData);
}

mockWebhookRequest().catch(console.error);
