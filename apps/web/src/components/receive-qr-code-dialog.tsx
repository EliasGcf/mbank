import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { env } from '@/env';
import { useCopyToClipboard } from '@/hooks/copy-to-clipboard.hook';
import { CheckIcon, LinkIcon, LoaderCircleIcon, MailIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';
import QRCode from 'react-qr-code';

interface Props {
  email: string;
}

export function ReceiveQrCodeDialog({ children, email }: PropsWithChildren<Props>) {
  const [copyEmailState, copyEmail] = useCopyToClipboard();
  const [copyLinkState, copyLink] = useCopyToClipboard();

  const QRCodeURL = new URL(env.WEB_APP_URL);
  QRCodeURL.searchParams.set('toAccount', email);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="gap-5">
        <DialogHeader>
          <DialogTitle>Receive</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Show this QR code to receive money from other users.
        </DialogDescription>

        <QRCode
          bgColor="hsl(var(--background))"
          className="h-auto max-w-full w-full bg-background"
          value={QRCodeURL.toString()}
        />

        <DialogFooter className="flex flex-col gap-1 sm:flex-col sm:space-x-0">
          <span>Or share your E-mail or the payment link:</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => copyEmail(email)}>
              {copyEmailState === 'idle' && <MailIcon className="size-4 mr-2" />}
              {copyEmailState === 'coping' && (
                <LoaderCircleIcon className="animate-spin size-4 mr-2" />
              )}
              {copyEmailState === 'finish' && <CheckIcon className="size-4 mr-2" />}
              Copy your E-mail
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyLink(QRCodeURL.toString())}
            >
              {copyLinkState === 'idle' && <LinkIcon className="size-4 mr-2" />}
              {copyLinkState === 'coping' && (
                <LoaderCircleIcon className="animate-spin size-4 mr-2" />
              )}
              {copyLinkState === 'finish' && <CheckIcon className="size-4 mr-2" />}
              Copy the payment link
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
