import { Client, Wallet } from 'xrpl'

export async function pushSignalToXRPL(signal: string) {
  const client = new Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  const wallet = Wallet.fromSeed('sn3nxiW7v8KXzPzAqzyHXbSSKNuN9')

  const tx = {
    TransactionType: 'Memo',
    Account: wallet.classicAddress,
    Memos: [{
      Memo: {
        MemoData: Buffer.from(signal).toString('hex'),
      }
    }]
  }

  const prepared = await client.autofill(tx)
  const signed = wallet.sign(prepared)
  const res = await client.submitAndWait(signed.tx_blob)

  console.log('XRPL TX Hash:', res.result.hash)
  await client.disconnect()
}

