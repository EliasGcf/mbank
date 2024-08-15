import { ProfileDropdown } from '@/components/profile-dropdown';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useMyAccount } from '@/hooks/my-account.hook';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { account } = useMyAccount();

  const [showAmountInfo, setShowAmountInfo] = useState(false);

  return (
    <header className="bg-muted/80 px-6 py-4 flex justify-center border-b">
      <div className="w-full max-w-6xl flex justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-1">
            <div>Available balance</div>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setShowAmountInfo((prev) => !prev)}
            >
              {showAmountInfo ? (
                <EyeIcon className="size-4" />
              ) : (
                <EyeOffIcon className="size-4" />
              )}
            </Button>
          </div>

          {showAmountInfo ? (
            <strong>{account?.balanceFormatted}</strong>
          ) : (
            <strong>********</strong>
          )}
        </div>

        <div className="flex gap-5 items-center h-full">
          <div className="flex flex-col">
            <p>{account.name}</p>
            <p>{account.email}</p>
          </div>

          <Separator orientation="vertical" className="h-3/4" />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
