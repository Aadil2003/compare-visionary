
import resemble from 'resemblejs';

/**
 * Compares two images and returns the difference percentage and diff image
 * @param image1Url URL of the first image (baseline)
 * @param image2Url URL of the second image (current)
 * @returns Promise with comparison results
 */
export const compareImages = async (
  image1Url: string, 
  image2Url: string
): Promise<{ diffPercentage: number; diffImageUrl: string }> => {
  
  // Function to load an image as base64
  const loadImage = async (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };

  try {
    // Load both images
    const [image1Data, image2Data] = await Promise.all([
      loadImage(image1Url),
      loadImage(image2Url)
    ]);

    // Compare images using resemble.js
    return new Promise((resolve) => {
      resemble(image1Data)
        .compareTo(image2Data)
        .ignoreColors()
        .onComplete((data) => {
          resolve({
            diffPercentage: Number(data.misMatchPercentage),
            diffImageUrl: data.getImageDataUrl()
          });
        });
    });
  } catch (error) {
    console.error('Error comparing images:', error);
    throw error;
  }
};

/**
 * Analyzes comparison results and determines if changes are significant
 * @param diffPercentage The percentage difference between images
 * @returns Whether the difference is considered significant
 */
export const isSignificantChange = (diffPercentage: number): boolean => {
  // Consider changes over 5% as significant
  return diffPercentage > 5;
};
