import { IERC20__factory, MAX_INT } from "@gearbox-protocol/sdk";

interface ApproveTokenProps {
  signer: any;
  to: string;
  address: string;
  amount?: bigint;
}

export const approveToken = async ({
  signer,
  to,
  address,
  amount,
}: ApproveTokenProps) => {
  try {
    const token = IERC20__factory.connect(address, signer);
    const receipt = await token.approve(to, amount || MAX_INT);
    return receipt;
  } catch (e: any) {
    console.error(e);
  }
};
