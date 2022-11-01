import Link from "next/link";
import Container from "~/components/containers/Container";
import { useNetwork, useContractRead, useBalance, useAccount } from "wagmi";
import { progressDays } from "~/lib/helpers";
import {
  ProgressStatCard,
  NumberStatCard,
  CountdownCard,
} from "~/components/StatCards";
import { xenContract } from "~/lib/xen-contract";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import CardContainer from "~/components/containers/CardContainer";

const Stake = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [max, setMax] = useState(0);
  const [progress, setProgress] = useState(0);
  const [percent, setPercent] = useState(0);

  const { data: balanceData } = useBalance({
    ...xenContract(chain),
    watch: true,
  });

  const { data: userStake } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserStake",
    overrides: { from: address },
    watch: true,
  });

  const mintItems = [
    {
      title: "Liquid XEN",
      value: balanceData?.formatted,
      suffix: "",
    },
    {
      title: "Staked XEN",
      value: userStake?.amount,
      suffix: "",
      tokenDecimals: balanceData?.decimals,
    },
    {
      title: "APY",
      value: userStake?.apy,
      suffix: "%",
    },
    {
      title: "Term",
      value: userStake?.term,
      suffix: "",
      decimals: 0,
    },
  ];

  useEffect(() => {
    const max = Number(userStake?.term);
    const progress = progressDays(
      Number(userStake?.maturityTs),
      Number(userStake?.term)
    );

    setMax(max);
    setProgress(progress);
    setPercent((progress / max) * 100);
  }, [progress, userStake?.maturityTs, userStake?.term]);

  return (
    <Container className="max-w-2xl">
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1">
            <a className="step step-neutral">Start Stake</a>
          </Link>

          <Link href="/stake/2">
            <a className="step step-neutral">Staking</a>
          </Link>

          <Link href="/stake/3">
            <a className="step">End Stake</a>
          </Link>
        </ul>
        <CardContainer>
          <h2 className="card-title">Staking</h2>
          <div className="stats stats-vertical bg-transparent text-neutral space-y-4">
            <Countdown
              date={Number(userStake?.maturityTs) * 1000}
              intervalDelay={0}
              renderer={(props) => (
                <CountdownCard
                  days={props.days}
                  hours={props.hours}
                  minutes={props.minutes}
                  seconds={props.seconds}
                />
              )}
            />
            <ProgressStatCard
              title="Progress"
              percentComplete={percent}
              value={progress}
              max={max}
              daysRemaining={max - progress}
              dateTs={Number(userStake?.maturityTs)}
            />
            {mintItems.map((item, index) => (
              <NumberStatCard
                key={index}
                title={item.title}
                value={item.value}
                suffix={item.suffix}
                decimals={item.decimals}
                tokenDecimals={item.tokenDecimals}
              />
            ))}
          </div>
        </CardContainer>
      </div>
    </Container>
  );
};

export default Stake;
