import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { User } from '@/types';
import { ChallengeTypes } from '@/constants';
import { RotateCw } from 'lucide-react';
import { useUserChallenges } from '@/providers/UserChallengesProvider';

type LeaderboardProps = {
  userRankings: User[];
  address: string;
  challenge: {
    minimumCheckIns: number;
    type: ChallengeTypes;
  };
};

function Leaderboard({ userRankings, address, challenge }: LeaderboardProps) {
  const { refetch } = useUserChallenges();

  const sortedUserRankings = [...userRankings].sort(
    (a, b) => Number(b.totalCheckIns) - Number(a.totalCheckIns),
  );

  return (
    <div className="mt-10 w-full max-w-md pb-12">
      <div className="mb-5 flex items-center justify-between text-xl text-dark">
        <span>🏆 Leaderboard</span>
        <RotateCw
          className="h-4 w-4 cursor-pointer"
          onClick={() => {
            refetch();
          }}
        />
      </div>
      <Table aria-label="Leaderboard">
        <TableHeader>
          <TableColumn className="bg-white text-center">Rank</TableColumn>
          <TableColumn className="bg-white text-center">ID</TableColumn>
          <TableColumn className="bg-white text-center">Check-ins</TableColumn>
        </TableHeader>
        <TableBody>
          {sortedUserRankings.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell
                className={`font-bold ${
                  index === 0
                    ? 'text-yellow-500'
                    : index === 1
                    ? 'text-gray-400'
                    : index === 2
                    ? 'text-amber-600'
                    : ''
                }`}
              >
                No. {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <div
                    className={`w-15 h-15 flex items-center justify-center overflow-hidden rounded-full font-bold ${
                      user.id === address.toLocaleLowerCase()
                        ? 'bg-primary text-white'
                        : 'bg-dark text-white'
                    }`}
                    style={{
                      width: '50px',
                      height: '50px',
                      minWidth: '50px',
                      minHeight: '50px',
                    }}
                  >
                    <span className="text-sm">
                      {user.id === address.toLocaleLowerCase() ? 'You' : `${user.id.slice(2, 5)}`}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-bold">
                {user.totalCheckIns} {challenge.type}s
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Leaderboard;
