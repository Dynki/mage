"use client";
import React, { useEffect } from "react";
import { SiweMessage } from "siwe";
import { polygonMumbai } from "viem/chains";
import { useAccount, useBalance, useSignMessage } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { FaWallet } from "react-icons/fa";
import { formatEther } from "viem";

export const customFormatEther = (b: bigint, d: number) => {
  const es = formatEther(b)
  const est = es.split('.')
  if (est.length < 2) {
    return es
  }
  return est[0] + '.' + est[1].substring(0, d)
}

const ConnectButton = () => {
  const [mounted, setMounted] = React.useState(false);
  const { address, isConnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address,
  })
  const { data: session, status } = useSession()
  const { open } = useWeb3Modal();
  const { signMessageAsync } = useSignMessage();
  const [hasSigned, setHasSigned] = React.useState(false);

  useEffect(() => setMounted(true), []);

  // useEffect(() => {
  //   if (isConnected && session && status === 'authenticated' && hasSigned === false) {
  //     setHasSigned(true)
  //   }

  // }, [isConnected, session, status])

  if(!mounted) return <></>

  const handleSign = async () => {
    // if (!isConnected) open();
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        address: address,
        statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
        nonce: await getCsrfToken(),
        chainId: polygonMumbai.id,
        
      });

      const signedMessage = await signMessageAsync({
        message: message.prepareMessage(),
      });

      setHasSigned(true);

      const response = await signIn("web3", {
        message: JSON.stringify(message),
        signedMessage,
        redirect: false
      });
      if (response?.error) {
        console.log("Error occured:", response.error);
      }

    } catch (error) {
      console.log("Error Occured", error);
    }
  };

  return (
    <div className="flex w-max">
      {!isConnected && (
        <button
          className="text-2xl outline-none dark:hover:text-gray-500 hover:text-blue-500"
          onClick={() => open()}
        >
          Connect Wallet
        </button>
      )}
      {isConnected && !hasSigned && (
        <div className="flex gap-2">
          <button
            className="cursor-pointer flex gap-3 items-center text-2xl font-semibold bg-white/[0.25] text-white rounded-md py-2 px-5 outline-none dark:hover:bg-white/60 dark:hover:text-white hover:text-blue-500"
            onClick={handleSign}
          >
            <FaWallet size={20} className="fill-gray-700 dark:fill-gray-200 "/>
            Login
          </button>
        </div>
      )}
      {isConnected && hasSigned && (
        <button
          className="cursor-pointer flex gap-3 items-center text-2xl font-normal bg-white/[0.25] text-white rounded-md py-2 px-5 outline-none dark:hover:bg-white/60 dark:hover:text-white hover:text-blue-500"
        >
          <FaWallet size={20} className="fill-gray-700 dark:fill-gray-200 "/>
          <div className="flex w-full">
            {data?.value ? `${customFormatEther(data.value, 6)} ${data?.symbol}` : 'Loading...'}
          </div>
        </button>
    )}
    </div>
  );
};

export default ConnectButton;
