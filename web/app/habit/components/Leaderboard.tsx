import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { User } from '@/types';
import { ChallengeTypes } from '@/constants';

type LeaderboardProps = {
  userRankings: User[];
  address: string;
  challenge: {
    minimumCheckIns: number;
    type: ChallengeTypes;
  };
}

function Leaderboard({ userRankings, address, challenge }: LeaderboardProps) {
  return (
    <div className="w-full max-w-md mt-8">
      <div className="text-xl text-dark mb-5">🏆Leaderboard</div> 
      <Table aria-label="Leaderboard">
        <TableHeader>
          <TableColumn className="text-center bg-white">Rank</TableColumn>
          <TableColumn className="text-center bg-white">ID</TableColumn>
          <TableColumn className="text-center bg-white">Check-ins</TableColumn>
        </TableHeader>
        <TableBody>
          {userRankings.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className={`font-bold ${
                index === 0 ? 'text-yellow-500' :
                index === 1 ? 'text-gray-400' :
                index === 2 ? 'text-amber-600' :
                ''
              }`}>
                No. {index + 1}
              </TableCell>
              <TableCell>
                <div
                  id="super-good-ball"
                  className={`font-bold flex justify-center items-center ${
                    user.id === address.toLocaleLowerCase() ? "bg-primary text-white" : "bg-dark text-white"
                  }`}
                  style={{
                    borderRadius: '50%',
                    height: '60px',
                  }}
                  >
                  {user.id === address.toLocaleLowerCase()
                    ? "You"
                    : `${user.id.slice(2, 5)}`}
                </div>
              </TableCell>
              <TableCell className='font-bold'>{user.totalCheckIns} {challenge.type}s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;