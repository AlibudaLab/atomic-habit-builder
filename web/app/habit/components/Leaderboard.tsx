import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { User } from '@/types';

type LeaderboardProps = {
  userRankings: User[];
  address: string;
  challenge: {
    minimumCheckIns: number;
  };
}

function Leaderboard({ userRankings, address, challenge }: LeaderboardProps) {
  return (
    <div className="w-full max-w-md mt-8">
      <div className="text-xl text-dark mb-5">Leaderboard</div>
      <Table aria-label="Leaderboard">
        <TableHeader>
          <TableColumn className="text-center bg-white">Rank</TableColumn>
          <TableColumn className="text-center bg-white">Address</TableColumn>
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
                {index + 1}
              </TableCell>
              <TableCell className={`font-bold ${
                user.id === address ? "bg-primary text-white rounded-lg" : ""
              }`}>
                {user.id === address
                  ? "You"
                  : `${user.id.slice(0, 4)}...${user.id.slice(-4)}`}
              </TableCell>
              <TableCell className='font-bold'>{user.totalCheckIns} / {challenge.minimumCheckIns}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;