import { useMemo, useState, useEffect } from 'react';
import PopupWindow from '@/components/PopupWindow/PopupWindow';
import { Input } from '@nextui-org/input';
import { formatUnits, isAddress, parseUnits } from 'viem';
import { Button } from '@nextui-org/button';
import { emergencySupportedChains, usdcContractAddrs } from '@/constants';
import useTransferERC20ArbitraryChain from '@/hooks/transaction/useTransferERC20ArbitraryChain';
import { getChainsForEnvironment } from '@/store/supportedChains';
const defaultChain = getChainsForEnvironment();

type WithdrawalProps = {
  onClose: () => void;
  chainId: number;
  maxAmount: bigint | undefined;
};

function SpecialWithdrawPopup({ onClose, maxAmount, chainId }: WithdrawalProps) {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');

  const [amountError, setAmountError] = useState<string | null>(null);

  // 5_000000 = 5 USDC
  const amountToWithdraw = useMemo(() => parseUnits(amount, 6), [amount]);

  const chain = useMemo(() => {
    return emergencySupportedChains.find((c) => c.id === chainId) ?? defaultChain;
  }, [chainId]);

  useEffect(() => {
    if (isNaN(Number(amount))) {
      setAmountError('Please enter a valid number');
    } else if (maxAmount && amountToWithdraw > maxAmount) {
      setAmountError('Amount exceeds maximum Balance');
    } else {
      setAmountError(null);
    }
  }, [amount, amountToWithdraw, maxAmount]);

  const invalidAddress = recipient !== '' && !isAddress(recipient);

  const { onSubmitTransaction: withdraw, isLoading: isSending } = useTransferERC20ArbitraryChain(
    usdcContractAddrs[chain.id],
    recipient as `0x${string}`,
    amountToWithdraw,
    chain,
    onClose, // onSuccess
  );

  const content = (
    <div className="text-left">
      <div className="m-4 font-nunito text-sm">
        Enter recipient address on <span className="font-bold"> {chain.name} </span> to withdraw
        your funds.
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
          <div className="font-nunito">Withdraw on {chain.name}</div>
        </Button>
      </div>
    </div>
  );

  return <PopupWindow title="Special Withdraw" onClose={onClose} content={content} buttons={[]} />;
}

export default SpecialWithdrawPopup;
