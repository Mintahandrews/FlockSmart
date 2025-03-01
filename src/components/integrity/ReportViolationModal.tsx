import { useState } from 'react';
import { useIntegrity } from '../../contexts/IntegrityContext';
import { Squircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReportViolationModalProps {
  targetId: string;
  targetType: 'service' | 'user';
  onClose: () => void;
}

const ReportViolationModal = ({ targetId, targetType, onClose }: ReportViolationModalProps) => {
  const { reportViolation } = useIntegrity();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reasons = [
    '',
    'Plagiarism',
    'Complete assignment solution',
    'Exam assistance',
    'Inappropriate content',
    'Misrepresentation',
    'Other violation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      setError('Please select a reason for your report');
      return;
    }

    if (!details.trim()) {
      setError('Please provide details about the violation');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { user } = JSON.parse(localStorage.getItem('user') || '{}');
      const reporterId = user?.id;

      if (!reporterId) {
        throw new Error('User must be logged in to report a violation');
      }

      await reportViolation({
        reporterId,
        targetId,
        targetType,
        reason,
        details: details.trim()
      });

      toast.success('Report submitted successfully');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Squircle size={20} className="text-red-500 mr-2" />
            Report Academic Integrity Violation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Report
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a reason...</option>
              {reasons.slice(1).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide specific details about the violation..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800 border border-amber-200">
            <p>
              Your report will be confidential and will help us maintain academic integrity on the platform.
              False reports may result in account restrictions.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportViolationModal;
