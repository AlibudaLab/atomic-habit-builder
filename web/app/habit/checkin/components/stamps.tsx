/* eslint-disable react/no-array-index-key */

import Image from 'next/image';

type StampProps = {
  checkInNum: number;
  targetNum: number;
  id: string;
};

export default function Stamps({ checkInNum, targetNum, id }: StampProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 px-12 py-6">
      {Array.from({ length: targetNum }).map((_, idx) => {
        const done = idx < checkInNum;
        const iconIdx = (Number(id) % 20) + idx;
        const icon = require(`@/imgs/hats/${iconIdx + 1}.png`) as string;
        return done ? (
          <div
            style={{ borderColor: '#EDB830', paddingTop: '4px' }}
            key={`done-${idx}`}
            className="h-12 w-12 justify-center rounded-full border border-solid text-center"
          >
            {' '}
            <Image src={icon} alt="checkin" />
          </div>
        ) : (
          <div
            style={{ borderColor: 'grey', paddingTop: '10px' }}
            key={`ip-${idx}`}
            className="h-12 w-12 justify-center rounded-full border border-solid text-center "
          >
            {' '}
            {idx + 1}{' '}
          </div>
        );
      })}
    </div>
  );
}
