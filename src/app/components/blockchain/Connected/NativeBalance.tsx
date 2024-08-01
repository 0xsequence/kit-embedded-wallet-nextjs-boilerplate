import { Box, Text } from "@0xsequence/design-system";
import { SequenceIndexer } from "@0xsequence/indexer";
import { useEffect, useState } from "react";
import { Address, Chain } from "viem";
import { INDEXER_SUPPORTED_NETWORKS } from "../../../../app/Providers";

const projectAccessKey =
  process.env.NEXT_PUBLIC_PROJECT_ACCESS_KEY ||
  "AQAAAAAAADVH8R2AGuQhwQ1y8NaEf1T7PJM";

const NativeBalance = (props: { chain: Chain; address: Address }) => {
  const { chain, address } = props;
  const [balance, setBalance] = useState<string | undefined>();

  const loadNativeNetworkBalance = async (chainId: number) => {
    const chainName = INDEXER_SUPPORTED_NETWORKS.find(
      (chainInfo) => chainInfo.id === chainId,
    )?.name;
    if (!chainName) return;
    const indexer = new SequenceIndexer(
      `https://${chainName}-indexer.sequence.app`,
      projectAccessKey,
    );
    const tokenBalances = await indexer.getEtherBalance({
      accountAddress: address,
    });
    if (tokenBalances) setBalance(tokenBalances?.balance?.balanceWei);
  };

  useEffect(() => {
    if (!address || !chain) return;
    loadNativeNetworkBalance(chain.id);
  }, [address, chain]);

  return (
    <Box display="flex">
      <Text variant="large" fontWeight="bold" color="text100">
        {chain.nativeCurrency.name} balance: {balance || "loading..."}
      </Text>
    </Box>
  );
};

export default NativeBalance;
