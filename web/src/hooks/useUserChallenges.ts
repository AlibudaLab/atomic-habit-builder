import { readContract } from '@wagmi/core';
import * as trackerContract from '@/contracts/tracker';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';
import useAllChallenges from './useAllChallenges';
import { ChallengeWithCheckIns } from '@/types';

const useUserChallenges = (address: string | undefined) => {
  const [loading, setLoading] = useState(true);

  // fetch both public and private challenges
  const { challenges } = useAllChallenges(false);

  const [data, setData] = useState<ChallengeWithCheckIns[] | []>([]);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!address) return;
    if (challenges.length === 0) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const userChallenges = await readContract(config, {
          abi: trackerContract.abi,
          address: trackerContract.address,
          functionName: 'getUserChallenges',
          args: [address as `0x${string}`],
        });

        // fetch user activities from rpc
        const userRegisteredIds = userChallenges as bigint[];

        // all challenges that user participants in
        let knownChallenges = challenges.filter((c) => userRegisteredIds.includes(BigInt(c.id)));

        const checkedIns = await Promise.all(
          knownChallenges.map(async (c) => {
            const checkedIn = (await readContract(config, {
              abi: trackerContract.abi,
              address: trackerContract.address,
              functionName: 'getUserCheckInCounts',
              args: [BigInt(c.id), address as `0x${string}`],
            })) as unknown as bigint;
            return checkedIn;
          }),
        );

        // TODO: remove this once we have a better view function to get winner's stake
        const totalSucceededCounts = await Promise.all(
          knownChallenges.map(async (c) => {
            const succeeded = (await readContract(config, {
              abi: trackerContract.abi,
              address: trackerContract.address,
              functionName: 'getChallengeSucceedParticipantsCount',
              args: [BigInt(c.id)],
            })) as unknown as bigint;
            return succeeded;
          }),
        );

        const claimables = await Promise.all(
          knownChallenges.map(async (c) => {
            const stake = (await readContract(config, {
              abi: trackerContract.abi,
              address: trackerContract.address,
              functionName: 'getClaimableAmount',
              args: [BigInt(c.id), address as `0x${string}`],
            })) as unknown as bigint;
            return stake;
          }),
        );

        const challengesWithCheckIns: ChallengeWithCheckIns[] = knownChallenges.map((c, idx) => {
          return {
            ...c,
            checkedIn: Number(checkedIns[idx].toString()),
            claimable: claimables[idx],
            totalSucceeded: totalSucceededCounts[idx],
          };
        });

        setData(challengesWithCheckIns);
        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [address, challenges]);

  return { loading, data, error };
};

export default useUserChallenges;
