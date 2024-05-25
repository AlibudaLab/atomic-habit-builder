import { MoonLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-primary">
      <MoonLoader color="#ff784f" />
    </div>
  );
}
