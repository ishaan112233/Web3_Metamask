import { useState } from "react";
import getWeb3 from "./getWeb3";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import Web3 from "web3";

const startPayment = async ({ setError, setTxs, ether, addr }) => {
    try {
        if (!window.ethereum)
            throw new Error("No crypto wallet found. Please install it.");

        // await window.ethereum.send("eth_requestAccounts");
        // const web3 = await getWeb3();
        const web3 = new Web3(window.ethereum);
        console.log("Checking");
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        // console.log(accounts);
        const isValid = web3.utils.isAddress(addr); //Check if it is a valid address
        if (!isValid) {
            throw new Error("Invalid Address");
        }
        const tx = await web3.eth.sendTransaction({
            from: accounts[0],
            to: addr,
            value: Web3.utils.toWei(ether, "ether"),
        });
        console.log({ ether, addr });
        console.log("tx", tx);
        setTxs([tx]);
    } catch (err) {
        setError(err.message);
    }
};

export default function App() {
    const [error, setError] = useState();
    const [txs, setTxs] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        setError();
        await startPayment({
            setError,
            setTxs,
            ether: data.get("ether"),
            addr: data.get("addr"),
        });
    };

    return (
        <form className="m-4" onSubmit={handleSubmit}>
            <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
                <main className="mt-4 p-4">
                    <h1 className="text-xl font-semibold text-gray-700 text-center">
                        Send ETH payment
                    </h1>
                    <div className="">
                        <div className="my-3">
                            <input
                                type="text"
                                name="addr"
                                className="input input-bordered block w-full focus:ring focus:outline-none"
                                placeholder="Recipient Address"
                            />
                        </div>
                        <div className="my-3">
                            <input
                                name="ether"
                                type="text"
                                className="input input-bordered block w-full focus:ring focus:outline-none"
                                placeholder="Amount in ETH"
                            />
                        </div>
                    </div>
                </main>
                <footer className="p-4">
                    <button
                        type="submit"
                        className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                    >
                        Pay now
                    </button>
                    <ErrorMessage message={error} />
                    <TxList txs={txs} />
                </footer>
            </div>
        </form>
    );
}
