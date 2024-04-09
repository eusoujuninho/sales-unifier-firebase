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

async function initializeDefaultData() {
    // Platform initialization
    const platformData = { name: 'perfectpay', slug: 'perfectpay' };
    const platformRef = await ensureDocumentExists('Platforms', 'slug', platformData.slug, platformData);
  
    // Payment Methods initialization
    const paymentMethods = [
        { name: 'none', slug: 'none', description: 'No payment method', externalIds: [{ id: 'none', platform: 'perfectpay' }] },
        { name: 'visa', slug: 'visa', description: 'Visa credit card', externalIds: [{ id: 'visa', platform: 'perfectpay' }] },
        { name: 'bolbradesco', slug: 'bolbradesco', description: 'Boleto Bradesco', externalIds: [{ id: 'bolbradesco', platform: 'perfectpay' }] },
        { name: 'amex', slug: 'amex', description: 'American Express credit card', externalIds: [{ id: 'amex', platform: 'perfectpay' }] },
        { name: 'elo', slug: 'elo', description: 'Elo credit card', externalIds: [{ id: 'elo', platform: 'perfectpay' }] },
        { name: 'hipercard', slug: 'hipercard', description: 'Hipercard credit card', externalIds: [{ id: 'hipercard', platform: 'perfectpay' }] },
        { name: 'master', slug: 'master', description: 'Mastercard credit card', externalIds: [{ id: 'master', platform: 'perfectpay' }] },
        { name: 'melicard', slug: 'melicard', description: 'Mercado Livres Melicard', externalIds: [{ id: 'melicard', platform: 'perfectpay' }] },
        { name: 'free_price', slug: 'free_price', description: 'Free pricing option', externalIds: [{ id: 'free_price', platform: 'perfectpay' }] },
        { name: 'oxxo', slug: 'oxxo', description: 'OXXO payment method for Mexico', externalIds: [{ id: 'oxxo', platform: 'perfectpay' }] },
        { name: 'multibanco', slug: 'multibanco', description: 'Multibanco payment method for Portugal', externalIds: [{ id: 'multibanco', platform: 'perfectpay' }] },
        { name: 'sencillito', slug: 'sencillito', description: 'Sencillito payment method for Chile', externalIds: [{ id: 'sencillito', platform: 'perfectpay' }] },
        { name: 'pagoefectivo', slug: 'pagoefectivo', description: 'PagoEfectivo payment method for Peru', externalIds: [{ id: 'pagoefectivo', platform: 'perfectpay' }] },
        { name: 'cupondepago', slug: 'cupondepago', description: 'Cupón de Pago payment method for Argentina', externalIds: [{ id: 'cupondepago', platform: 'perfectpay' }] },
        { name: 'efecty', slug: 'efecty', description: 'Efecty payment method for Colombia', externalIds: [{ id: 'efecty', platform: 'perfectpay' }] },
        { name: 'sepa', slug: 'sepa', description: 'SEPA Direct Debit for the European Union', externalIds: [{ id: 'sepa', platform: 'perfectpay' }] },
        { name: 'pse', slug: 'pse', description: 'PSE payment method for Colombia', externalIds: [{ id: 'pse', platform: 'perfectpay' }] },
        { name: 'bacs', slug: 'bacs', description: 'BACS Direct Debit for the United Kingdom', externalIds: [{ id: 'bacs', platform: 'perfectpay' }] },
        { name: 'debito_bancario', slug: 'debito_bancario', description: 'Bank Debit in Brazil', externalIds: [{ id: 'debito_bancario', platform: 'perfectpay' }] },
        { name: 'tarjeta_debito', slug: 'tarjeta_debito', description: 'Debit card payment in Mexico', externalIds: [{ id: 'tarjeta_debito', platform: 'perfectpay' }] },
        { name: 'mastercard_int', slug: 'mastercard_int', description: 'Mastercard for Europe, USA, Canada, and Asia', externalIds: [{ id: 'mastercard_int', platform: 'perfectpay' }] },
        { name: 'visa_int', slug: 'visa_int', description: 'Visa for Europe, USA, Canada, and Asia', externalIds: [{ id: 'visa_int', platform: 'perfectpay' }] },
        { name: 'cartes_bancaires', slug: 'cartes_bancaires', description: 'Cartes Bancaires payment method in France', externalIds: [{ id: 'cartes_bancaires', platform: 'perfectpay' }] }  
    ];
      
    for (const method of paymentMethods) {
      method.externalIds = [{ id: method.slug, platform: platformRef.id }];
      await ensureDocumentExists('PaymentMethods', 'slug', method.slug, method);
    }
  
    // Payment Types initialization
    const paymentTypes = [
        {
          name: 'none',
          slug: 'none',
          description: 'No payment method',
          instant: false,
          externalIds: [
            { id: 'none', platform: 'perfectpay' },
            { id: 'none', platform: 'hotmart' }
          ]
        },
        {
          name: 'credit_card',
          slug: 'credit_card',
          description: 'Payment made with a credit card',
          instant: true,
          externalIds: [
            { id: 'credit_card', platform: 'perfectpay' },
            { id: 'CREDIT_CARD', platform: 'hotmart' }
          ]
        },
        {
          name: 'ticket',
          slug: 'ticket',
          description: 'Boleto bancário, a bank slip payment method',
          instant: false,
          externalIds: [
            { id: 'ticket', platform: 'perfectpay' },
            { id: 'BILLET', platform: 'hotmart' }
          ]
        },
        {
          name: 'paypal',
          slug: 'paypal',
          description: 'Payment made through PayPal',
          instant: true,
          externalIds: [
            { id: 'paypal', platform: 'perfectpay' },
            { id: 'PAYPAL', platform: 'hotmart' }
          ]
        },
        {
          name: 'credit_card_recurrent',
          slug: 'credit_card_recurrent',
          description: 'Recurrent payment with a credit card',
          instant: true,
          externalIds: [
            { id: 'credit_card_recurrent', platform: 'perfectpay' },
            // Assuming Hotmart does not differentiate recurrent, use the CREDIT_CARD id
            { id: 'CREDIT_CARD', platform: 'hotmart' }
          ]
        },
        {
          name: 'free_price',
          slug: 'free_price',
          description: 'Free pricing option, no payment involved',
          instant: true,
          externalIds: [
            { id: 'free_price', platform: 'perfectpay' },
            { id: 'FREE_PRICE', platform: 'hotmart' }
          ]
        },
        {
          name: 'credit_card_upsell',
          slug: 'credit_card_upsell',
          description: 'Upsell with a credit card payment',
          instant: true,
          externalIds: [
            { id: 'credit_card_upsell', platform: 'perfectpay' },
            { id: 'CREDIT_CARD_UPSELL', platform: 'hotmart' }
          ]
        },
        // Additional payment types from Hotmart with assumed instant and descriptions
        {
          name: 'cash_payment',
          slug: 'cash_payment',
          description: 'Payment made in cash',
          instant: false,
          externalIds: [
            { id: 'CASH_PAYMENT', platform: 'hotmart' }
          ]
        },
        {
          name: 'direct_bank_transfer',
          slug: 'direct_bank_transfer',
          description: 'Payment made via direct bank transfer',
          instant: false,
          externalIds: [
            { id: 'DIRECT_BANK_TRANSFER', platform: 'hotmart' }
          ]
        },
        {
          name: 'direct_debit',
          slug: 'direct_debit',
          description: 'Payment made via direct debit from a bank account',
          instant: false,
          externalIds: [
            { id: 'DIRECT_DEBIT', platform: 'hotmart' }
          ]
        },
        {
          name: 'financed_billet',
          slug: 'financed_billet',
          description: 'Boleto bancário with financing option',
          instant: false,
          externalIds: [
            { id: 'FINANCED_BILLET', platform: 'hotmart' }
          ]
        },
        {
          name: 'financed_installment',
          slug: 'financed_installment',
          description: 'Installment payment that is financed',
          instant: false,
          externalIds: [
            { id: 'FINANCED_INSTALLMENT', platform: 'hotmart' }
          ]
        },
        {
          name: 'google_pay',
          slug: 'google_pay',
          description: 'Payment made via Google Pay',
          instant: true,
          externalIds: [
            { id: 'GOOGLE_PAY', platform: 'hotmart' }
          ]
        },
        {
          name: 'hotcard',
          slug: 'hotcard',
          description: 'Exclusive payment card from Hotmart',
          instant: true,
          externalIds: [
            { id: 'HOTCARD', platform: 'hotmart' }
          ]
        },
        {
          name: 'hybrid',
          slug: 'hybrid',
          description: 'Combination of payment methods',
          instant: false,
          externalIds: [
            { id: 'HYBRID', platform: 'hotmart' }
          ]
        },
        {
          name: 'manual_transfer',
          slug: 'manual_transfer',
          description: 'Payment made via manual bank transfer',
          instant: false,
          externalIds: [
            { id: 'MANUAL_TRANSFER', platform: 'hotmart' }
          ]
        },
        {
          name: 'paypal_international',
          slug: 'paypal_international',
          description: 'International PayPal payment',
          instant: true,
          externalIds: [
            { id: 'PAYPAL_INTERNACIONAL', platform: 'hotmart' }
          ]
        },
        {
          name: 'picpay',
          slug: 'picpay',
          description: 'Payment made via PicPay',
          instant: true,
          externalIds: [
            { id: 'PICPAY', platform: 'hotmart' }
          ]
        },
        {
          name: 'pix',
          slug: 'pix',
          description: 'Payment made via Pix (instant payment in Brazil)',
          instant: true,
          externalIds: [
            { id: 'PIX', platform: 'hotmart' }
          ]
        },
        {
          name: 'samsung_pay',
          slug: 'samsung_pay',
          description: 'Payment made via Samsung Pay',
          instant: true,
          externalIds: [
            { id: 'SAMSUNG_PAY', platform: 'hotmart' }
          ]
        },
        {
          name: 'wallet',
          slug: 'wallet',
          description: 'Payment made from a digital wallet',
          instant: true,
          externalIds: [
            { id: 'WALLET', platform: 'hotmart' }
          ]
        },
      ];
      
      
    for (const type of paymentTypes) {
      type.externalIds = [{ id: type.slug, platform: platformRef.id }];
      await ensureDocumentExists('PaymentTypes', 'slug', type.slug, type);
    }
  
    // Statuses initialization
    const statuses = [
        { name: 'none', slug: 'none', description: 'No status', financialImpact: 'neutro', externalIds: [{ id: 'none', platform: 'perfectpay' }, { id: 'STARTED', platform: 'hotmart' }] },
        { name: 'pending', slug: 'pending', description: 'Pending payment', financialImpact: 'neutro', externalIds: [{ id: 'pending', platform: 'perfectpay' }, { id: 'WAITING_PAYMENT', platform: 'hotmart' }] },
        { name: 'approved', slug: 'approved', description: 'Payment approved', financialImpact: 'credito', externalIds: [{ id: 'approved', platform: 'perfectpay' }, { id: 'APPROVED', platform: 'hotmart' }] },
        { name: 'in_process', slug: 'in_process', description: 'Payment in manual review', financialImpact: 'neutro', externalIds: [{ id: 'in_process', platform: 'perfectpay' }, { id: 'PROCESSING_TRANSACTION', platform: 'hotmart' }] },
        { name: 'in_mediation', slug: 'in_mediation', description: 'Payment in mediation', financialImpact: 'congelado', externalIds: [{ id: 'in_mediation', platform: 'perfectpay' }, { id: 'BLOCKED', platform: 'hotmart' }] },
        { name: 'rejected', slug: 'rejected', description: 'Payment rejected', financialImpact: 'debito', externalIds: [{ id: 'rejected', platform: 'perfectpay' }, { id: 'CANCELLED', platform: 'hotmart' }] },
        { name: 'cancelled', slug: 'cancelled', description: 'Payment cancelled', financialImpact: 'debito', externalIds: [{ id: 'cancelled', platform: 'perfectpay' }, { id: 'CANCELLED', platform: 'hotmart' }] },
        { name: 'refunded', slug: 'refunded', description: 'Payment refunded', financialImpact: 'debito', externalIds: [{ id: 'refunded', platform: 'perfectpay' }, { id: 'REFUNDED', platform: 'hotmart' }] },
        { name: 'authorized', slug: 'authorized', description: 'Payment authorized', financialImpact: 'credito', externalIds: [{ id: 'authorized', platform: 'perfectpay' }, { id: 'APPROVED', platform: 'hotmart' }] },
        { name: 'charged_back', slug: 'charged_back', description: 'Chargeback requested', financialImpact: 'debito', externalIds: [{ id: 'charged_back', platform: 'perfectpay' }, { id: 'CHARGEBACK', platform: 'hotmart' }] },
        { name: 'completed', slug: 'completed', description: 'Sale completed after 30 days', financialImpact: 'credito', externalIds: [{ id: 'completed', platform: 'perfectpay' }, { id: 'COMPLETE', platform: 'hotmart' }] },
        { name: 'checkout_error', slug: 'checkout_error', description: 'Error during checkout', financialImpact: 'neutro', externalIds: [{ id: 'checkout_error', platform: 'perfectpay' }, { id: 'OVERDUE', platform: 'hotmart' }] },
        { name: 'precheckout', slug: 'precheckout', description: 'Abandoned before checkout', financialImpact: 'neutro', externalIds: [{ id: 'precheckout', platform: 'perfectpay' }, { id: 'PRINTED_BILLET', platform: 'hotmart' }] },
        { name: 'expired', slug: 'expired', description: 'Boleto expired', financialImpact: 'neutro', externalIds: [{ id: 'expired', platform: 'perfectpay' }, { id: 'EXPIRED', platform: 'hotmart' }] },
        { name: 'in_review', slug: 'in_review', description: 'Under review', financialImpact: 'neutro', externalIds: [{ id: 'in_review', platform: 'perfectpay' }, { id: 'UNDER_ANALISYS', platform: 'hotmart' }] },
        { name: 'no_funds', slug: 'no_funds', description: 'No funds available', financialImpact: 'debito', externalIds: [{ id: 'NO_FUNDS', platform: 'hotmart' }] },
        { name: 'overdue', slug: 'overdue', description: 'Payment overdue', financialImpact: 'neutro', externalIds: [{ id: 'OVERDUE', platform: 'hotmart' }] },
        { name: 'partially_refunded', slug: 'partially_refunded', description: 'Partially refunded payment', financialImpact: 'debito', externalIds: [{ id: 'PARTIALLY_REFUNDED', platform: 'hotmart' }] },
        { name: 'pre_order', slug: 'pre_order', description: 'Pre-order status', financialImpact: 'neutro', externalIds: [{ id: 'PRE_ORDER', platform: 'hotmart' }] },
        { name: 'protested', slug: 'protested', description: 'Protested payment', financialImpact: 'neutro', externalIds: [{ id: 'PROTESTED', platform: 'hotmart' }] },
      ];
      
    for (const status of statuses) {
      status.externalIds = [{ id: status.slug, platform: platformRef.id }];
      await ensureDocumentExists('Statuses', 'slug', status.slug, status);
    }
  
    console.log('Default data initialization complete.');
  }

initializeDefaultData().catch(console.error);
