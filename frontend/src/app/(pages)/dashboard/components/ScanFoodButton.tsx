import { useState, useRef } from 'react';
import { getAuthHeaders } from '../utils';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity?: string;
}

interface ScanFoodResponse {
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

interface ScanFoodButtonProps {
  onScanComplete?: (data: ScanFoodResponse) => void;
  onError?: (error: string) => void;
}

export function ScanFoodButton({ onScanComplete, onError }: ScanFoodButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanFoodResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Please select a valid image file');
      return;
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      onError?.('Image size exceeded');
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setPreview(base64);
      setIsModalOpen(true);
    } catch (error) {
      onError?.('Failed to process image');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleImageSelect(file);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleImageSelect(file);
  };

  const scanFood = async () => {
    if (!preview) return;

    setIsScanning(true);
    try {
      const response = await fetch('/api/food-scan', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          imageBase64: preview,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to scan food' }));
        throw new Error(errorData.error || 'Failed to scan food');
      }

      const data: ScanFoodResponse = await response.json();
      setScanResult(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan food';
      onError?.(errorMessage);
      console.error('Error scanning food:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPreview(null);
    setScanResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleUseResult = () => {
    if (scanResult && onScanComplete) {
      onScanComplete(scanResult);
      handleCloseModal();
    }
  };

  return (
    <>
      <div className="fixed bottom-8 left-0 w-full flex justify-center z-50">
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-slate-600 to-sky-500 text-white font-bold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
            />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Scan Food
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-black/90 backdrop-blur rounded-3xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Scan Food</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!preview && !scanResult && (
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm mb-4">
                    Choose an option to scan your food:
                  </p>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-white font-medium">Upload from Gallery</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span className="text-white font-medium">Take Photo</span>
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraCapture}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {preview && !scanResult && (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-white/10">
                    <img src={preview} alt="Preview" className="w-full h-auto max-h-64 object-contain" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={scanFood}
                      disabled={isScanning}
                      className="flex-1 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isScanning ? 'Scanning...' : 'Scan Food'}
                    </button>
                  </div>
                </div>
              )}

              {scanResult && (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-white/10">
                    <img src={preview || ''} alt="Scanned" className="w-full h-auto max-h-48 object-contain" />
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 space-y-3">
                    <h3 className="text-white font-semibold">Detected Foods:</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {scanResult.foods.map((food, index) => (
                        <div key={index} className="bg-black/30 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-white font-medium">{food.name}</span>
                            {food.quantity && (
                              <span className="text-gray-400 text-sm">{food.quantity}</span>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs text-gray-300">
                            <div>Cal: {food.calories}</div>
                            <div>P: {food.protein}g</div>
                            <div>C: {food.carbs}g</div>
                            <div>F: {food.fats}g</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-white/20">
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <div className="text-gray-400">Total</div>
                          <div className="text-white font-semibold">{scanResult.totalCalories}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400">Protein</div>
                          <div className="text-white font-semibold">{scanResult.totalProtein}g</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400">Carbs</div>
                          <div className="text-white font-semibold">{scanResult.totalCarbs}g</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400">Fats</div>
                          <div className="text-white font-semibold">{scanResult.totalFats}g</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleUseResult}
                      className="flex-1 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors"
                    >
                      Use This
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
