import { useState } from "react";
import { Flex, Button } from "antd";
import { Aptos, MoveStructId, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { Typography } from "antd";

const Body = ({ connected, account, balance, network, signAndSubmitTransaction, submitTransaction } : any) => {

    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const [playerMove, setPlayerMove] = useState<number | null>(null);
    const [computerMove, setComputerMove] = useState<number | null>(null);
    const [gameResult, setGameResult] = useState<String | null>(null);
    const exp = Math.floor(Date.now() / 1000) + 60 * 10

    const handleStartGame = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::start_game"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
                functionArguments: []
            },
            options: {
                expireTimestamp: exp,
            }
        });
        try {
            await aptos.waitForTransaction({ transactionHash: response.hash });
        } catch (error) {
            console.error(error);
        }
    }

    const handleSetPlayerMove = async (num: number) => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::set_player_move"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
                functionArguments: [String(num)]
            },
            options: {
                expireTimestamp: exp,
            }
        });
        try {
            await aptos.waitForTransaction({ transactionHash: response.hash });
            console.log(response)
            setPlayerMove(num)
        } catch (error) {
            console.error(error);
        }
    }
    const handleSetComputerMove = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::randomly_set_computer_move"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
                functionArguments: []
            },
            options: {
                expireTimestamp: exp,
            }
        });
        try {
            await aptos.waitForTransaction({ transactionHash: response.hash });
            console.log(response)
        } catch (error) {
            console.error(error);
        }
    }
    const getComputerMove = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::get_computer_move"
        const response = await aptos.view({ 
            payload: {
                function: func,
                functionArguments: [account.address]
            }
         })
        console.log(response)
        setComputerMove(Number(response[0]))
    }
    const handleFinalizeGameResults = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::finalize_game_results"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
                functionArguments: []
            },
            options: {
                expireTimestamp: exp,
            }
        });
        try {
            await aptos.waitForTransaction({ transactionHash: response.hash });
            console.log(response)
        } catch (error) {
            console.error(error);
        }
    }

    const getGameResults = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::get_game_results"
        const response = await aptos.view({ 
            payload: {
                function: func,
                functionArguments: [account.address]
            }
         })
        console.log(response)
        if (Number(response[0]) === 1) setGameResult("Draw!")
        if (Number(response[0]) === 2) setGameResult("You win!")
        if (Number(response[0]) === 3) setGameResult("Computer wins!")
    }

    return (
        <div className="body">
            {connected && account ? (
                <div>
                    <Typography.Title>Rock Paper Scissors</Typography.Title>
                    <Flex align="center" justify="space-between" className="row">
                        <Typography.Paragraph>Start Game</Typography.Paragraph>
                        <Button type="primary" size="large" onClick={async () => await handleStartGame}>Start Game</Button>
                        <Typography.Paragraph></Typography.Paragraph>
                    </Flex>
                    <Flex align="center" justify="space-between" className="row">
                        <Typography.Paragraph>Select Your Move</Typography.Paragraph>
                        <div>
                            <Button type="primary" size="large" onClick={async () => await handleSetPlayerMove(1)}>1</Button>
                            <Typography.Text> | </Typography.Text>
                            <Button type="primary" size="large" onClick={async () => await handleSetPlayerMove(2)}>2</Button>
                            <Typography.Text> | </Typography.Text>
                            <Button type="primary" size="large" onClick={async () => await handleSetPlayerMove(3)}>3</Button>
                        </div>
                        <Typography.Paragraph>{playerMove}</Typography.Paragraph>
                    </Flex>
                    <Flex align="center" justify="space-between" className="row">
                        <Typography.Paragraph>Randomly Select Computer Move</Typography.Paragraph>
                        <Button type="primary" size="large" onClick={async () => {await handleSetComputerMove(); await getComputerMove()}}>Randomly Set Computer Move</Button>
                        <Typography.Paragraph>{computerMove}</Typography.Paragraph>
                    </Flex>
                    <Flex align="center" justify="space-between" className="row">
                        <Typography.Paragraph>Finalize Game Results</Typography.Paragraph>
                        <Button type="primary" size="large" onClick={async () => {await handleFinalizeGameResults(); await getGameResults()}}>Finalize Game Results</Button>
                        <Typography.Paragraph>{gameResult}</Typography.Paragraph>
                    </Flex>
                </div>
                ) : (
                <Typography.Title>Connect wallet to continue...</Typography.Title>
                )
            }
        </div>
    );
}

export default Body