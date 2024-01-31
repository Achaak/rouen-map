import { useEffect, useState } from 'react';
import * as usehooks from 'usehooks-ts';

export const useWindowSize = usehooks.useWindowSize;

export type Medias = '2xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';

export const getMediaByScreenSize = (screenSize: number): Medias => {
  if (screenSize < 480) {
    return 'xs';
  } else if (screenSize < 640) {
    return 'sm';
  } else if (screenSize < 768) {
    return 'md';
  } else if (screenSize < 1024) {
    return 'lg';
  } else if (screenSize < 1280) {
    return 'xl';
  } else {
    return '2xl';
  }
};

export const getScreenSizeByMedia = (media: Medias): number => {
  switch (media) {
    case 'xs':
      return 480;
    case 'sm':
      return 640;
    case 'md':
      return 768;
    case 'lg':
      return 1024;
    case 'xl':
      return 1280;
    case '2xl':
      return 1536;
    default:
      return 0;
  }
};

export const useMediaScreen = (): Medias => {
  const { width } = usehooks.useWindowSize();
  const [media, setMedia] = useState<Medias>(getMediaByScreenSize(width));

  useEffect(() => {
    setMedia(getMediaByScreenSize(width));
  }, [width]);

  return media;
};

export const useMediaScreenValid = ({
  media,
  operator,
}: {
  media: Medias;
  operator?: '<' | '<=' | '=' | '>' | '>=';
}): boolean | undefined => {
  const { width } = usehooks.useWindowSize();
  const [valid, setValid] = useState<boolean | undefined>(
    width === 0 || width > getScreenSizeByMedia(media)
  );

  useEffect(() => {
    if (width === 0) {
      setValid(undefined);
    } else {
      switch (operator) {
        case '>':
          setValid(width > getScreenSizeByMedia(media));
          break;
        case '<':
          setValid(width < getScreenSizeByMedia(media));
          break;
        case '>=':
          setValid(width >= getScreenSizeByMedia(media));
          break;
        case '<=':
          setValid(width <= getScreenSizeByMedia(media));
          break;
        case '=':
          setValid(width === getScreenSizeByMedia(media));
          break;
        default:
          setValid(width === getScreenSizeByMedia(media));
          break;
      }
    }
  }, [width, media, operator]);

  return valid;
};
