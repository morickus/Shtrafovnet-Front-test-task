export interface ICustomer {
  id: string
  name: string
  email: string
  deferral_days: number
  org: {
    id: string
    name: string
    inn: string
    kpp: string
    ogrn: string
    addr: string
    bank_accounts: [
      {
        id: string
        name: string
        bik: string
        account_number: string
        corr_account_number: string
        is_default: boolean
        created_at: string
        updated_at: string
      },
      {
        id: string
        name: string
        bik: string
        account_number: string
        corr_account_number: string
        is_default: boolean
        created_at: string
        updated_at: string
      }
    ],
    created_at: string
    updated_at: string
  },
  balance: {
    currency: string
    current_amount: number
    credit_limit: number
    available_amount: number
  },
  metadata: {
    key1: string
  },
  created_at: string
  updated_at: string
  status: string
  invoice_prefix: string
  invoice_emails: string[]
}

export interface DataType {
  name: string
  id: string
  email: string
  deferral_days: number
  created_at: string
  updated_at: string
}