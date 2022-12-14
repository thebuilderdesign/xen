import type { NextPage } from "next";
import Container from "~/components/containers/Container";
import { useContractReads, useNetwork, useToken } from "wagmi";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  NumberStatCard,
  ChainStatCard,
  DateStatCard,
  DataCard,
} from "~/components/StatCards";
import CardContainer from "~/components/containers/CardContainer";
import { xenContract } from "~/lib/xen-contract";
import { chainIcons } from "~/components/Constants";
import Link from "next/link";
import { chainList } from "~/lib/client";

interface DashboardData {
  globalRank: number;
  activeMinters: number;
  activeStakes: number;
  totalXenStaked: number;
  totalXenLiquid: number;
  genesisTs: number;
  maxMintDays: number;
  ampRewards: number;
  eaaRewards: number;
  apyRewards: number;
}

const Dashboard: NextPage = () => {
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const { chainId } = router.query as unknown as { chainId: number };

  const chainFromId = chainList.find((c) => c && c.id == chainId);

  const { data: tokenData } = useToken({
    address: xenContract(chainFromId).addressOrName,
    chainId: chainFromId?.id,
  });

  const {} = useContractReads({
    contracts: [
      {
        ...xenContract(chainFromId),
        functionName: "globalRank",
      },
      {
        ...xenContract(chainFromId),
        functionName: "activeMinters",
      },
      {
        ...xenContract(chainFromId),
        functionName: "activeStakes",
      },
      {
        ...xenContract(chainFromId),
        functionName: "totalXenStaked",
      },
      {
        ...xenContract(chainFromId),
        functionName: "totalSupply",
      },
      {
        ...xenContract(chainFromId),
        functionName: "genesisTs",
      },
      {
        ...xenContract(chainFromId),
        functionName: "getCurrentMaxTerm",
      },

      {
        ...xenContract(chainFromId),
        functionName: "getCurrentAMP",
      },
      {
        ...xenContract(chainFromId),
        functionName: "getCurrentEAAR",
      },
      {
        ...xenContract(chainFromId),
        functionName: "getCurrentAPY",
      },
    ],

    onSuccess(data) {
      setDashboardData({
        globalRank: Number(data[0]),
        activeMinters: Number(data[1]),
        activeStakes: Number(data[2]),
        totalXenStaked: Number(data[3]),
        totalXenLiquid: Number(data[4]),
        genesisTs: Number(data[5]),
        maxMintDays: Number(data[6]),
        ampRewards: Number(data[7]),
        eaaRewards: Number(data[8]),
        apyRewards: Number(data[9]),
      });
    },
    watch: true,
  });

  const generalStats = [
    {
      title: "Global Rank",
      value: Number(dashboardData?.globalRank),
    },
    {
      title: "Active Minters",
      value: Number(dashboardData?.activeMinters),
    },
    {
      title: "Active Stakes",
      value: Number(dashboardData?.activeStakes),
    },
    {
      title: "Max Mint Term",
      value: Number(dashboardData?.maxMintDays) / 86400,
      suffix: " Days",
    },
  ];

  const stakeItems = [
    {
      title: "Total",
      value:
        (Number(dashboardData?.totalXenLiquid) +
          Number(dashboardData?.totalXenStaked)) /
        1e18,
    },
    {
      title: "Liquid",
      value: Number(dashboardData?.totalXenLiquid) / 1e18,
    },
    {
      title: "Stake",
      value: Number(dashboardData?.totalXenStaked) / 1e18,
    },
  ];

  const rewardsItems = [
    {
      title: "AMP",
      value: Number(dashboardData?.ampRewards),
      decimals: 0,
      tooltip:
        "Reward Amplifier (AMP) is a time-dependent part of XEN Mint Reward calculation. It starts at 3,000 at Genesis and decreases by 1 every day until it reaches 1",
    },
    {
      title: "EAA",
      value: Number((dashboardData?.eaaRewards ?? 0) / 10.0),
      decimals: 2,
      suffix: "%",
      tooltip:
        "Early Adopter Amplifier (EAA) is a part of XEN Mint Reward calculation which depends on current Global Rank. EAA starts from 10% and decreases in a linear fashion by 0.1% per each 100,000 increase in Global Rank.",
    },
    {
      title: "APY",
      value: Number(dashboardData?.apyRewards),
      decimals: 0,
      suffix: "%",
      tooltip:
        "Annual Percentage Yield (APY) determines XEN Staking Reward calculation. It is non-compounding and is pro-rated by days. APY starts at 20% on Genesis and decreases by 1p.p. every 90 days until it reaches 2%",
    },
  ];

  return (
    <div>
      <Container className="max-w-2xl">
        <div className="flex flex-col space-y-8">
          <div>
            <div className="tabs flex justify-center">
              {chainList
                .filter((chain) => !chain.testnet)
                .map((c) => (
                  <Link href={`/dashboard/${c.id}`} key={c.id}>
                    <a
                      className={`tab tab-lg tab-lifted text-neutral ${
                        c.id == chainId ? "glass" : ""
                      }`}
                    >
                      {chainIcons[c.id]}
                    </a>
                  </Link>
                ))}
            </div>
            <CardContainer>
              <h2 className="card-title">General Stats</h2>
              <div className="stats stats-vertical bg-transparent text-neutral">
                <ChainStatCard
                  value={chainFromId?.name ?? "Ethereum"}
                  id={chainFromId?.id ?? 1}
                />
                <DateStatCard
                  title="Days Since Launch"
                  dateTs={Number(dashboardData?.genesisTs ?? 0)}
                  isPast={true}
                />
                {tokenData && (
                  <DataCard
                    title={"Contract"}
                    value={tokenData?.symbol ?? "XEN"}
                    description={xenContract(chainFromId).addressOrName}
                  />
                )}

                {generalStats.map((item, index) => (
                  <NumberStatCard
                    key={index}
                    title={item.title}
                    value={item.value}
                    decimals={0}
                    suffix={item.suffix}
                  />
                ))}
              </div>
            </CardContainer>
          </div>

          <CardContainer>
            <h2 className="card-title">Supply</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              {stakeItems.map((item, index) => (
                <NumberStatCard
                  key={index}
                  title={item.title}
                  value={item.value}
                />
              ))}
            </div>
          </CardContainer>

          <CardContainer>
            <h2 className="card-title">Rewards</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              {rewardsItems.map((item, index) => (
                <NumberStatCard
                  key={index}
                  title={item.title}
                  value={item.value}
                  decimals={item.decimals}
                  suffix={item.suffix}
                  tooltip={item.tooltip}
                />
              ))}
            </div>
          </CardContainer>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
