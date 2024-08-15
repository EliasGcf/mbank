import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  DollarSignIcon,
  HandCoinsIcon,
  QrCodeIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { TransferDialog } from '@/components/transfer-dialog';
import { Header } from '@/components/header';

export function DashboardPage() {
  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto mt-8">
        <div className="flex justify-between gap-4">
          <Card className="flex-1">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Income</CardTitle>
              <ArrowUpCircleIcon className="text-primary" />
            </CardHeader>
            <CardContent className="text-2xl">R$ 17.400,00</CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Outcome</CardTitle>
              <ArrowDownCircleIcon className="text-destructive" />
            </CardHeader>
            <CardContent className="text-2xl">R$ 1.259,00</CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Total</CardTitle>
              <DollarSignIcon />
            </CardHeader>
            <CardContent className="text-2xl">R$ 16.141,00</CardContent>
          </Card>
        </div>

        <div className="mt-4 flex gap-2 justify-end">
          {/* Show a QRCode */}
          <Button variant="secondary">
            <QrCodeIcon className="size-4 mr-2" />
            Receive
          </Button>

          <TransferDialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <HandCoinsIcon className="size-4 mr-2" />
                Send
              </Button>
            </DialogTrigger>
          </TransferDialog>
        </div>
      </main>
    </div>
  );
}
