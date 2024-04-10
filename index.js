const admin = require("firebase-admin");
const fs = require("fs").promises; // Importa fs.promises para leitura de arquivos
const serviceAccount = require("./credentials.json"); // Atualize com o caminho do seu arquivo de credenciais

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function clearCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const documents = await collectionRef.listDocuments();

  const deletions = documents.map((doc) => doc.delete());
  await Promise.all(deletions);

  console.log(`Cleared collection: ${collectionPath}`);
}

async function ensureDocumentExists(collection, queryField, name, slug) {
  const snapshot = await db
    .collection(collection)
    .where(queryField, "==", name)
    .limit(1)
    .get();
  if (snapshot.empty) {
    const ref = await db.collection(collection).add(slug);
    return ref;
  } else {
    return snapshot.docs[0].ref;
  }
}

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file from disk: ${error}`);
  }
}

async function initializeDefaultData() {
  await clearCollection("Products");
  await clearCollection("Platforms");
  await clearCollection("PaymentMethods");
  await clearCollection("PaymentTypes");
  await clearCollection("Statuses");

  // Leitura dos arquivos JSON
  const platforms = await readJsonFile("./data/platforms.json");
  const paymentMethods = await readJsonFile("./data/payment_methods.json");
  const paymentTypes = await readJsonFile("./data/payment_types.json");
  const statuses = await readJsonFile("./data/statuses.json");
  const products = await readJsonFile("./data/products.json");

  // Inicialização de plataformas
  for (const platform of platforms) {
    await ensureDocumentExists("Platforms", "slug", platform.name, platform);
  }

  // Inicialização de métodos de pagamento
  for (const method of paymentMethods) {
    await ensureDocumentExists("PaymentMethods", "slug", method.name, method);
  }

  // Inicialização de tipos de pagamento
  for (const type of paymentTypes) {
    await ensureDocumentExists("PaymentTypes", "slug", type.name, type);
  }

  // Inicialização de status
  for (const status of statuses) {
    await ensureDocumentExists("Statuses", "slug", status.name, status);
  }

  for (const product of products) {
    await ensureDocumentExists("Products", "slug", product.name, product);
  }

  console.log("Default data initialization complete.");
}

initializeDefaultData().catch(console.error);
