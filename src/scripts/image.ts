export function getImageDimensions(
  imageSrc: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = (err) => {
      reject(
        new Error(
          `Failed to load image from URL '${imageSrc}': ${err.toString()}`
        )
      );
    };

    img.src = imageSrc;
  });
}
