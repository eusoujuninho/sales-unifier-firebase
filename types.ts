interface Installments {
    quantity: number;
    amount: number;
}

interface Payment {
    method: 'none' | 'visa' | 'bolbradesco' | 'amex' | 'elo' | 'hipercard' | 'master' | 'melicard' | 'free_price' | 'oxxo' | 'multibanco' | 'sencilitto' | 'pagoefectivo' | 'cupondepago' | 'efecty' | 'sepa' | 'pse' | 'bacs' | 'debito_bancario' | 'tarjeta_debito' | 'mastercard_int' | 'visa_int' | 'cartes_bancaires';
    type: 'none' | 'credit_card' | 'ticket' | 'paypal' | 'credit_card_recurrent' | 'free_price' | 'credit_card_upsell' | 'bash_payment' | 'direct_bank_transfer' | 'financed_billet' | 'google_pay' | 'hotcard' | 'hybrid' | 'manual_transfer' | 'paypal_international' | 'picpay' | 'pix' | 'samsung_pay' | 'wallet';
    currency: string;
    amount: number;
    amountToBrl: number;
    installments: Installments;
}

interface Product {
    name: string;
    code: string;
}

interface Offer {
    name: string;
    code: string;
    currency: string;
    amount: number;
    amountToBrl: number;
}

interface Commission {
    type: string;
    currency: string;
    amount: number;
    amountToBrl: number;
}

interface Address {
    address?: string;
    number?: string;
    complement?: string;
    city?: string;
    state?: string;
    country?: string;
}

interface Customer {
    fullName: string;
    email: string;
    mobilePhone: string;
    address?: Address;
    facebookUrl?: string;
    instagramUrl?: string;
}

interface Tracking {
    utm_campaign?: string;
    utm_medium?: string;
    utm_term?: string;
    utm_source?: string;
    src?: string;
    sck?: string;
}

interface Transaction {
    createdAt: number; // timestamp
    paidAt: number; // timestamp
    parentTransaction?: string;
    payment: Payment;
    currency: string;
    amount: number;
    amountToBrl: number;
    status: 'none' | 'pending' | 'approved' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'authorized' | 'charged_back' | 'completed' | 'checkout_error' | 'precheckout' | 'expired' | 'in_review' | 'no_funds' | 'overdue' | 'pre_order';
    platform: 'hotmart' | 'kiwify' | 'eduzz' | 'braip' | 'doppus';
    code: string;
    product: Product;
    offer: Offer;
    comissions: Commission[];
    customer: Customer;
    tracking?: Tracking;
}