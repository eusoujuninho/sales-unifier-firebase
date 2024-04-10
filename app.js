const admin = require('firebase-admin');
const serviceAccount = require('./credentials.json'); // Atualize com o caminho do seu arquivo de credenciais

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function ensureDocumentExists(collection, queryField, name, slug) {
  const snapshot = await db.collection(collection)
                           .where(queryField, '==', name)
                           .limit(1)
                           .get();
  if (snapshot.empty) {
    const ref = await db.collection(collection).add({ name, slug });
    return ref;
  } else {
    return snapshot.docs[0].ref;
  }
}


async function fetchExchangeRate(fromCurrency, toCurrency) {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const rates = await response.json();
      return rates.rates[toCurrency];
    } catch (error) {
      console.error(`Failed to fetch exchange rate: ${error}`);
      return null; // ou algum valor padrão que você escolher
    }
  }

async function insertMockData() {
  // Assegura a existência de PaymentMethod, PaymentType, Product, Platform e Status
  const paymentMethodRef = await ensureDocumentExists('PaymentMethods', 'name', 'visa', 'visa');
  const paymentTypeRef = await ensureDocumentExists('PaymentTypes', 'name', 'credit_card', 'credit-card');
  const productRef = await ensureDocumentExists('Products', 'name', 'Online Course', 'online-course');
  const platformRef = await ensureDocumentExists('Platforms', 'name', 'Digital Market', 'digital-market');
  const statusRef = await ensureDocumentExists('Statuses', 'name', 'approved', 'approved');

  const exchangeRates = {
    paidValue: await fetchExchangeRate('USD', 'BRL')
  }

  const transactionData = {
    paidValue: {
      amount: {
        original: {
            currency: 'USD',
            value: 100,
            rate: exchangeRates.paidValue
        },
        final: {
            currency: 'BRL',
            value: (100 * exchangeRates.paidValue)
        }
      }
    },
    code: "unique_transaction_identifier",
    platform: platformRef,
    product: productRef,
    plan: {
      name: "Subscription Plan",
      externalIds: [
        { id: "plan123", platform: "Platform A" }
      ],
      currency: "USD",
      exchangeRate: await fetchExchangeRate('USD', 'BRL'),
      value: 29.99,
      items: [productRef] // Assumindo que essa referência exista
    },
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "Anystate",
        country: "Country",
        zipCode: "12345"
      },
      document: "123.456.789-10"
    },
    tracking: {
      utmTags: ["utm_source=google", "utm_medium=cpc"],
      src: "google",
      sck: "specific_code"
    },
    paymentMethod: paymentMethodRef,
    paymentType: paymentTypeRef,
    commissions: [
      {
        currencyCode: "USD",
        amount: 10.00,
        type: "platform"
      }
    ],
    status: statusRef
  };

  const result = await db.collection('Transactions').add(transactionData);
  console.log(`Mock data inserted with ID: ${result.id}`);
}

// initializeDefaultData().catch(console.error);

insertMockData().catch(console.error);