import { SyncLoader } from 'react-spinners';

export default function WaitingTx() {
  return (
    <div className="flex w-full items-center justify-center p-2 text-primary">
      <SyncLoader color="#ff784f" size={4} />
    </div>
  );
}
