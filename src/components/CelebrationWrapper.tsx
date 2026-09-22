import { useRef, useEffect } from 'react';
import { Celebration } from '../../Celebration/Celebration/Celebration.js';

interface CelebrationWrapperProps {
  isVisible: boolean;
  onComplete: () => void;
  muted?: boolean;
  soundUrl?: string;
  imageSrc?: string;
}

export function CelebrationWrapper({
  isVisible,
  onComplete,
  muted = false,
  soundUrl,
  imageSrc,
}: CelebrationWrapperProps) {
  const celebrationRef = useRef<InstanceType<typeof Celebration> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Instantiate the Celebration class once, attaching to document.body
  useEffect(() => {
    celebrationRef.current = new Celebration(document.body, {
      muted,
      soundUrl,
      imageSrc,
    });

    return () => {
      celebrationRef.current?.hide();
      celebrationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, soundUrl, imageSrc]);

  // React to isVisible changes
  useEffect(() => {
    const instance = celebrationRef.current;
    if (!instance) return;

    if (isVisible) {
      instance.show(() => {
        onCompleteRef.current();
      });
    } else {
      instance.hide();
    }
  }, [isVisible]);

  return null;
}
