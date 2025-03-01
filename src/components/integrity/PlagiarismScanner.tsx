import { useState } from 'react';
import { useIntegrity, PlagiarismResult } from '../../contexts/IntegrityContext';
import { Squircle, BookOpen, Check, Loader } from 'lucide-react';

interface PlagiarismScannerProps {
  serviceId: string;
  initialText?: string;
  onResultChange?: (result: PlagiarismResult | null) => void;
}

const PlagiarismScanner = ({ serviceId, initialText = '', onResultChange }: PlagiarismScannerProps) => {
  const { checkPlagiarism } = useIntegrity();
  const [text, setText] = useState(initialText);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!text.trim()) {
      setError('Please enter some text to scan');
      return;
    }

    if (text.trim().length < 100) {
      setError('Text is too short for meaningful plagiarism analysis. Please enter at least 100 characters.');
      return;
    }

    setIsScanning(true);
    setError('');

    try {
      const scanResult = await checkPlagiarism(text, serviceId);
      setResult(scanResult);
      if (onResultChange) onResultChange(scanResult);
    } catch (err) {
      setError('Failed to complete plagiarism scan. Please try again.');
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
        <BookOpen size={18} className="mr-2 text-indigo-600" />
        Originality Scanner
      </h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here to check for originality..."
        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
        disabled={isScanning}
      />

      <button
        onClick={handleScan}
        disabled={isScanning || !text.trim()}
        className={`px-4 py-2 rounded-md flex items-center justify-center ${
          isScanning || !text.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isScanning ? (
          <>
            <Loader size={16} className="animate-spin mr-2" />
            Scanning...
          </>
        ) : (
          <>Scan for Plagiarism</>
        )}
      </button>

      {result && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Originality Score</h4>
            <div className={`font-bold text-xl ${getScoreColor(result.originalityScore)}`}>
              {Math.round(result.originalityScore)}%
            </div>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full ${
                result.originalityScore >= 90
                  ? 'bg-green-500'
                  : result.originalityScore >= 75
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${result.originalityScore}%` }}
            ></div>
          </div>

          {result.matches.length > 0 ? (
            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium mb-2 flex items-center">
                <Squircle size={16} className="text-yellow-600 mr-2" />
                Potential Matches ({result.matches.length})
              </h4>
              <div className="space-y-3">
                {result.matches.map((match, index) => (
                  <div key={index} className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    <p className="text-sm mb-1">{match.text}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        {match.source ? `Source: ${match.source}` : 'Unknown source'}
                      </span>
                      <span className="font-medium text-yellow-700">
                        {match.similarity}% match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center text-green-600 mt-2">
              <Check size={16} className="mr-1" />
              No matching content found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlagiarismScanner;
