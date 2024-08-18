import { useCallback, useState } from 'react';

type CopyState = 'idle' | 'coping' | 'finish';

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopyState, CopyFn, CopiedValue] {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return false;
      }

      try {
        if (copyState === 'coping' || copyState === 'finish') return true;

        setCopyState('coping');
        await navigator.clipboard.writeText(text);
        await new Promise((resolve) => setTimeout(resolve, 700));
        setCopyState('finish');
        setCopiedText(text);
        setTimeout(() => setCopyState('idle'), 1000);
        return true;
      } catch (error) {
        console.warn('Copy failed', error);
        setCopiedText(null);
        return false;
      }
    },
    [copyState],
  );

  return [copyState, copy, copiedText];
}
