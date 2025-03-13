import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Flex, Typography } from "antd";

const Header = ({ connected, account, balance, network } : any) => {
    return (
        <Flex align="center" justify="space-between">
            <WalletSelector />
            {connected && account ? (
                <>
                    <Typography.Paragraph>Network: {network ? network.name : 'Unknown'}</Typography.Paragraph>
                    <Typography.Paragraph>Testnet Balance: {balance !== null ? `${balance} APT` : 'Loading...'}</Typography.Paragraph>
                </>
            ) : (
                <Typography.Paragraph>No wallet connected</Typography.Paragraph>
            )}
        </Flex>
    );
}

export default Header