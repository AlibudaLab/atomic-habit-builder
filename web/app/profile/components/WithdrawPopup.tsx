import { useMemo, useState, useEffect } from 'react';
import PopupWindow from '@/components/PopupWindow/PopupWindow';
import { Input } from '@nextui-org/input';
import { formatUnits, isAddress, parseUnits } from 'viem';
import { Button } from '@nextui-org/button';
import useTransferERC20 from '@/hooks/transaction/useTransferERC20';
import { usdcAddr } from '@/constants';

type WithdrawalProps = {
  onClose: () => void;
  maxAmount: bigint | undefined;
};

function WithdrawPopup({ onClose, maxAmount }: WithdrawalProps) {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');

  const [amountError, setAmountError] = useState<string | null>(null);

  // 5_000000 = 5 USDC
  const amountToWithdraw = useMemo(() => parseUnits(amount, 6), [amount]);

  useEffect(() => {
    console.log('Number(amount)', Number(amount));
    if (isNaN(Number(amount))) {
      setAmountError('Please enter a valid number');
    } else if (maxAmount && amountToWithdraw > maxAmount) {
      setAmountError('Amount exceeds maximum Balance');
    } else {
      setAmountError(null);
    }
  }, [amount, amountToWithdraw]);

  const invalidAddress = recipient !== '' && !isAddress(recipient);

  const { onSubmitTransaction: withdraw, isLoading: isSending } = useTransferERC20(
    usdcAddr,
    recipient as `0x${string}`,
    amountToWithdraw,
  );

  const content = (
    <div className="text-left">
      <div className="m-4 font-nunito text-sm">
        Enter recipient address on <span className="font-bold"> Base </span> to withdraw your funds.
      </div>
      <div className="mb-4">
        <Input
          type="number"
          label="Amount"
          value={amount}
          onValueChange={setAmount}
          endContent={
            <Button
              onClick={() => setAmount(maxAmount ? formatUnits(maxAmount, 6) : '0')}
              className=""
              size="sm"
            >
              Max
            </Button>
          }
          isInvalid={amountError !== null}
          errorMessage={amountError}
        />
      </div>
      <div className="mb-4">
        <Input
          type="text"
          label="Recipient Address"
          value={recipient}
          onValueChange={setRecipient}
          isInvalid={invalidAddress}
        />
      </div>

      <div className="mt-8 flex items-center justify-center">
        <Button
          className="p-4 px-8"
          color="primary"
          onClick={withdraw}
          isDisabled={recipient === '' || invalidAddress || amountError !== null}
          isLoading={isSending}
        >
          <div className="font-nunito">Withdraw on Base</div>
        </Button>
      </div>
    </div>
  );

  return <PopupWindow title="Withdraw" onClose={onClose} content={content} buttons={[]} />;
}

export default WithdrawPopup;
