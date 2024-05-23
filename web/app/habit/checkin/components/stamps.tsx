/* eslint-disable react/no-array-index-key */

import GetSingleTrait from '@/components/Nouns/GetSingleTrait';

type StampProps = {
  checkInNum: number;
  targetNum: number;
  challengeId: bigint;
};

export default function Stamps({ checkInNum, targetNum, challengeId }: StampProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 px-12 py-6">
      {Array.from({ length: targetNum }).map((_, idx) => {
        const done = idx < checkInNum;
        const iconIdx = (Number(challengeId)+ idx) % 233;
        return done ? (
          <div
            style={{ borderColor: '#EDB830', paddingTop: '4px' }}
            key={`done-${idx}`}
            className="h-12 w-12 justify-center rounded-full border border-solid text-center"
          >
            {' '}
            <GetSingleTrait
              properties={{ name: 'Hat Items', alt: 'checkin', head: iconIdx, className: '' }}
            />
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
