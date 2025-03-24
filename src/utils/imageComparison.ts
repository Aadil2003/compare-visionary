
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

/**
 * Advanced image comparison with customizable options
 * @param image1Url URL of the first image (baseline)
 * @param image2Url URL of the second image (current) 
 * @param options Comparison options
 * @returns Promise with detailed comparison results
 */
export const advancedCompareImages = async (
  image1Url: string,
  image2Url: string,
  options: {
    ignoreColors?: boolean;
    ignoreAntialiasing?: boolean;
    ignoreAlpha?: boolean;
    ignoreLess?: boolean;
    errorType?: 'flat' | 'movement' | 'flatDifferenceIntensity' | 'movementDifferenceIntensity' | 'diffOnly';
    errorPixelColor?: string;
    transparency?: number;
    largeImageThreshold?: number;
    ignoreAreasColoredWith?: string;
  } = {}
): Promise<{
  diffPercentage: number;
  diffImageUrl: string;
  analysisTime: number;
  dimensionMismatch: boolean;
}> => {
  
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

    // Set up the comparison with the provided options
    return new Promise((resolve) => {
      const comparison = resemble(image1Data).compareTo(image2Data);
      
      // Apply options
      if (options.ignoreColors) comparison.ignoreColors();
      if (options.ignoreAntialiasing) comparison.ignoreAntialiasing();
      if (options.ignoreAlpha) comparison.ignoreAlpha();
      if (options.ignoreLess) comparison.ignoreLess();
      
      // Apply other options
      comparison.scaleToSameSize();
      
      // Set output options
      const outputSettings: any = {
        errorType: options.errorType || 'flat',
        transparency: options.transparency !== undefined ? options.transparency : 1,
        largeImageThreshold: options.largeImageThreshold || 1200,
      };
      
      if (options.errorPixelColor) {
        outputSettings.errorColor = {
          red: parseInt(options.errorPixelColor.substring(1, 3), 16),
          green: parseInt(options.errorPixelColor.substring(3, 5), 16),
          blue: parseInt(options.errorPixelColor.substring(5, 7), 16),
        };
      }
      
      comparison.outputSettings(outputSettings);
      
      // Run the comparison
      comparison.onComplete((data) => {
        const isSameDimensions = data.isSameDimensions;
        
        resolve({
          diffPercentage: Number(data.misMatchPercentage),
          diffImageUrl: data.getImageDataUrl(),
          analysisTime: data.analysisTime,
          dimensionMismatch: !isSameDimensions
        });
      });
    });
  } catch (error) {
    console.error('Error in advanced image comparison:', error);
    throw error;
  }
};

/**
 * Compare images ignoring specified regions
 * @param image1Url URL of the first image (baseline)
 * @param image2Url URL of the second image (current)
 * @param ignoreRegions Array of regions to ignore during comparison
 * @returns Promise with comparison results
 */
export const compareImagesWithIgnoreRegions = async (
  image1Url: string,
  image2Url: string,
  ignoreRegions: Array<{ x: number, y: number, width: number, height: number }>
): Promise<{ diffPercentage: number; diffImageUrl: string }> => {
  try {
    // Load both images
    const img1 = new Image();
    const img2 = new Image();
    
    const loadImagePromise = (img: HTMLImageElement, url: string) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    };
    
    const [loadedImg1, loadedImg2] = await Promise.all([
      loadImagePromise(img1, image1Url),
      loadImagePromise(img2, image2Url)
    ]);
    
    // Create canvases for both images
    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    canvas1.width = loadedImg1.width;
    canvas1.height = loadedImg1.height;
    canvas2.width = loadedImg2.width;
    canvas2.height = loadedImg2.height;
    
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    
    if (!ctx1 || !ctx2) {
      throw new Error('Could not get canvas context');
    }
    
    // Draw images on canvases
    ctx1.drawImage(loadedImg1, 0, 0);
    ctx2.drawImage(loadedImg2, 0, 0);
    
    // Mask out ignore regions with white rectangles (assuming white background)
    ignoreRegions.forEach(region => {
      ctx1.fillStyle = 'white';
      ctx1.fillRect(region.x, region.y, region.width, region.height);
      
      ctx2.fillStyle = 'white';
      ctx2.fillRect(region.x, region.y, region.width, region.height);
    });
    
    // Get data URLs from canvases
    const img1DataUrl = canvas1.toDataURL('image/png');
    const img2DataUrl = canvas2.toDataURL('image/png');
    
    // Compare the masked images
    return new Promise((resolve) => {
      resemble(img1DataUrl)
        .compareTo(img2DataUrl)
        .ignoreColors()
        .onComplete((data) => {
          resolve({
            diffPercentage: Number(data.misMatchPercentage),
            diffImageUrl: data.getImageDataUrl()
          });
        });
    });
  } catch (error) {
    console.error('Error comparing images with ignore regions:', error);
    throw error;
  }
};
