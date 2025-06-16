import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { FaceDetection } from '@mediapipe/face_detection';
import { motion, useScroll, useTransform } from 'framer-motion';
import CartoonImage from './cartoon.png';

interface SkinToneResult {
  color: string;
  type: string;
  show: boolean;
}

interface DetectProps {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  onSkinToneDetected: (color: string, type: string) => void;
}

const Detect: React.FC<DetectProps> = ({ isLoggedIn, userId, token, onSkinToneDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const faceDetectionRef = useRef<FaceDetection | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [skinToneResult, setSkinToneResult] = useState<SkinToneResult>({
    color: '#FFFFFF',
    type: '',
    show: false,
  });
  const [isCameraActive, setIsCameraActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const cameraY = useTransform(scrollYProgress, [0, 0.5], ['-50vh', '0vh']);
  const cameraOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const cameraScale = useTransform(scrollYProgress, [0.3, 0.5], [0.9, 1]);
  const cameraBorderRadius = useTransform(scrollYProgress, [0, 0.5], ['50%', '15%']);

  const resultsY = useTransform(scrollYProgress, [0, 0.5], ['50vh', '0vh']);
  const resultsOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const resultsScale = useTransform(scrollYProgress, [0.3, 0.5], [0.9, 1]);
  const resultsBorderRadius = useTransform(scrollYProgress, [0, 0.5], ['50%', '15%']);

  const buttonOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  useEffect(() => {
    faceDetectionRef.current = new FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetectionRef.current.setOptions({ model: 'short', minDetectionConfidence: 0.5 });

    faceDetectionRef.current.onResults((results) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !canvasRef.current) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.detections.length > 0) {
        processSkinTone(results.detections[0]);
      }
    });

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (faceDetectionRef.current) faceDetectionRef.current.close();
    };
  }, []);

  const handleCameraToggle = async () => {
    if (!isCameraActive) {
      setIsCameraActive(true);
      setSkinToneResult({ color: '#FFFFFF', type: '', show: false });

      if (videoRef.current) {
        cameraRef.current = new Camera(videoRef.current, {
          onFrame: async () => {
            if (faceDetectionRef.current && videoRef.current) {
              await faceDetectionRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        try {
          await cameraRef.current.start();
        } catch (error) {
          console.error('Error accessing camera:', error);
          alert('Unable to access the camera. Please ensure permissions are granted.');
          setIsCameraActive(false);
        }
      }
    } else {
      if (cameraRef.current) cameraRef.current.stop();
      setIsCameraActive(false);
    }
  };

  const processSkinTone = async (detection: any) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    const boundingBox = detection.boundingBox;
    const x = boundingBox.xCenter * 640 - (boundingBox.width * 640) / 2;
    const y = boundingBox.yCenter * 480 - (boundingBox.height * 480) / 2;
    const width = boundingBox.width * 640;
    const height = boundingBox.height * 480;

    const imageData = ctx.getImageData(x, y, width, height);
    const skinPixels: number[][] = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const hsv = rgbToHsv(r, g, b);
      if (isSkinTone(hsv)) skinPixels.push([r, g, b]);
    }

    if (skinPixels.length > 0) {
      const avgColor = calculateAverageSkinTone(skinPixels);
      if (avgColor.length !== 3) {
        throw new Error("Expected exactly 3 values for RGB");
      }
      const [r, g, b] = avgColor;
      const hexColor = rgbToHex(r, g, b);
      const hsv = rgbToHsv(r, g, b);
      const skinToneType = classifySkinTone(hsv);
    
      setSkinToneResult({ color: hexColor, type: skinToneType, show: true });
      onSkinToneDetected(hexColor, skinToneType);

      if (userId && token) {
        await fetch('http://localhost:3000/api/skin-tone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userId, hexColor, skinToneType }),
        });
      }

      if (cameraRef.current) cameraRef.current.stop();
      setIsCameraActive(false);

      const shopSection = document.getElementById('shop');
      if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isSkinTone = (hsv: number[]): boolean => {
    const [h, s, v] = hsv;
    return h >= 0 && h <= 50 && s >= 0.1 && s <= 0.8 && v >= 0.2 && v <= 1.0;
  };

  const rgbToHsv = (r: number, g: number, b: number): number[] => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h: number,
      s: number,
      v: number = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) h = 0;
    else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }
    return [h * 360, s, v];
  };

  const calculateAverageSkinTone = (pixels: number[][]): number[] => {
    let totalR = 0,
      totalG = 0,
      totalB = 0;
    pixels.forEach((pixel) => {
      totalR += pixel[0];
      totalG += pixel[1];
      totalB += pixel[2];
    });
    return [
      Math.round(totalR / pixels.length),
      Math.round(totalG / pixels.length),
      Math.round(totalB / pixels.length),
    ];
  };

  const classifySkinTone = (hsv: number[]): string => {
    const [h] = hsv;
    if (h >= 0 && h <= 30) return 'warm';
    if (h > 30 && h <= 180) return 'cool';
    return 'neutral';
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

  return (
    <section
      id="detect"
      ref={sectionRef}
      className="min-h-screen py-8 px-4 relative overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      <style>
        {`
          #detect::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 55%;
            background: linear-gradient(to bottom, #2b1155, #3c1776);
            border-bottom-left-radius: 10vw;
            border-bottom-right-radius: 10vw;
            z-index: 0;
          }
          #detect > * {
            position: relative;
            z-index: 1;
          }
        `}
      </style>
      <div className="container mx-auto max-w-6xl">
        <div className="pt-2">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Detect Your Skin Tone</h2>
          <p className="text-center text-lg mb-12 text-white">
            "Style is a way to say who you are without having to speak"<br />
            — Let's find your perfect color palette
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-end justify-center">
          {/* Left Box (Camera) */}
          <motion.div
            className="w-full lg:w-1/2 relative"
            style={{
              y: cameraY,
              opacity: cameraOpacity,
              scale: cameraScale,
            }}
          >
            <motion.div
              className="relative bg-black shadow-2xl overflow-hidden border-4 border-[#6c429f] mx-auto w-[min(80vw,300px)] h-[min(80vw,300px)] lg:w-[min(80vw,500px)] lg:h-[min(80vw,500px)]"
              style={{
                borderRadius: cameraBorderRadius,
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            >
              <div className="w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                />
                <canvas ref={canvasRef} width={640} height={480} className="hidden" />
                {!isCameraActive && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <img
                      src={CartoonImage}
                      alt="Cartoon Placeholder"
                      className="w-3/4 h-3/4 object-contain filter invert brightness-0"
                    />
                  </motion.div>
                )}
                {isCameraActive && (
                  <motion.div
                    className="absolute bottom-4 left-0 right-0 text-center bg-black bg-opacity-70 text-white py-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Analyzing your skin tone...
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="mt-6 text-center"
              style={{ opacity: buttonOpacity }}
            >
              <motion.button
                onClick={handleCameraToggle}
                className={`px-8 py-3 rounded-full font-medium text-lg ${
                  isCameraActive ? 'bg-red-500 hover:bg-red-600' : 'bg-[#493392] hover:bg-[#3f2178]'
                } text-white transition-colors shadow-lg`}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                {isCameraActive ? 'Stop Analysis' : 'Start Camera'}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Box (Results) - Hidden on mobile */}
          <motion.div
            className="w-full lg:w-1/2 relative mb-20 hidden lg:block"
            style={{
              y: resultsY,
              opacity: resultsOpacity,
              scale: resultsScale,
            }}
          >
            <motion.div
              className="relative bg-white shadow-2xl overflow-hidden border-4 border-[#643999] mx-auto"
              style={{
                borderRadius: resultsBorderRadius,
                width: 'min(80vw, 500px)',
                height: 'min(80vw, 500px)',
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            >
              <div className="w-full h-full p-8">
                <h3 className="text-2xl font-bold mb-2 text-center lg:text-left">Your Skin Tone Analysis</h3>

                <h1 className='text-xl font-bold  text-center lg:text-left'>Three Skin Tones</h1>
                    <p className=' font-bold  text-center lg:text-left'>🔥 Warm Tone</p>
                    <p className=' font-bold  text-center lg:text-left '>❄️ Cool Tone</p>
                    <p className=' font-bold text-center lg:text-left '>⚪ Neutral Tone</p>
                {skinToneResult.show ? (
                  <motion.div
                    className="flex flex-col items-center lg:items-start"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <div className="mb-6 text-center lg:text-left">
                      <p className="text-lg mb-4">
                        We've analyzed your skin tone and found the perfect matches for you!
                      </p>
                      <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                        <motion.div
                          className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                          style={{ backgroundColor: skinToneResult.color }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
                        />
                        <div>
                          <p className="text-lg font-semibold">
                            Type: <span className="capitalize">{skinToneResult.type}</span>
                          </p>
                          <p className="text-gray-600">Hex: {skinToneResult.color}</p>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => {
                        const shopSection = document.getElementById('shop');
                        if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-2 bg-[#603db1] text-white rounded-full hover:bg-[#3f2578] transition-colors shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Matching Outfits
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <h4 className="text-xl font-medium text-gray-600 mb-2">Analysis Results</h4>
                    <p className="text-gray-500">Your skin tone analysis will appear here after detection.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Detect;