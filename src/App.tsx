import { useEffect, useState } from 'react';
import './App.css';
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosClient } from 'aptos';
import Header from './components/Header';
import Body from './components/Body';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');

function App() {
  const { connected, account, network, signAndSubmitTransaction, submitTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const resources: any[] = await client.getAccountResources(account.address);
          const accountResource = resources.find((r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
          
          if (accountResource) {
            const balanceValue = (accountResource.data as any).coin.value;
            setBalance(balanceValue ? parseInt(balanceValue) / 100000000 : 0);
          } else {
            setBalance(0);
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    if (connected) {
      fetchBalance();
    }
  }, [account, connected]);

  return (
    <div className='content'>
        <Header connected={connected} account={account} balance={balance} network={network} />
        <Body connected={connected} account={account} balance={balance} network={network} signAndSubmitTransaction={signAndSubmitTransaction} client={client} submitTransaction={submitTransaction} />
    </div>
  );
}

export default App;