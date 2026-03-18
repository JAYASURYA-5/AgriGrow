import { useRef } from 'react';

const Certificate = ({ certificate, onClose }) => {
  const certificateRef = useRef(null);

  const getCourseTitle = (courseId) => {
    const courseMap = {
      'soil-health': 'Soil Preparation & Health',
      'irrigation': 'Irrigation Techniques',
      'organic-farming': 'Organic Farming Practices',
      'pest-management': 'Pest & Disease Management',
      'crop-rotation': 'Crop Rotation & Diversity'
    };
    return courseMap[courseId] || courseId;
  };

  const downloadCertificate = async (format) => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      // Try to use html2canvas if available, fallback to simple image
      const canvas = await import('html2canvas').then(module => 
        module.default(element, {
          backgroundColor: '#fff',
          scale: 2
        })
      ).catch(() => {
        // Fallback: create a simple canvas
        const simpleCanvas = document.createElement('canvas');
        simpleCanvas.width = 1000;
        simpleCanvas.height = 667;
        const ctx = simpleCanvas.getContext('2d');
        
        // Simple certificate background
        ctx.fillStyle = '#fef3e2';
        ctx.fillRect(0, 0, 1000, 667);
        
        // Border
        ctx.strokeStyle = '#d4a55f';
        ctx.lineWidth = 10;
        ctx.strokeRect(30, 30, 940, 607);
        
        // Title
        ctx.font = 'bold 48px Georgia';
        ctx.fillStyle = '#8b6f47';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Achievement', 500, 120);
        
        // Content
        ctx.font = '20px Georgia';
        ctx.fillStyle = '#555';
        ctx.fillText('This certifies that', 500, 200);
        
        ctx.font = 'bold 36px Georgia';
        ctx.fillStyle = '#1a1a1a';
        ctx.fillText(certificate.userId || 'Student', 500, 280);
        
        ctx.font = '18px Georgia';
        ctx.fillStyle = '#555';
        ctx.fillText('has successfully completed', 500, 350);
        
        ctx.font = 'bold 24px Georgia';
        ctx.fillText(getCourseTitle(certificate.courseId), 500, 400);
        
        ctx.font = '16px Georgia';
        ctx.fillText(`Score: ${certificate.score}%`, 500, 480);
        ctx.fillText(`Date: ${certificate.completionDate}`, 500, 520);
        
        return simpleCanvas;
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Certificate_${certificate.courseId}_${Date.now()}.png`;
        link.click();
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        // Create simple PDF without external library
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Certificate_${certificate.courseId}_${Date.now()}.png`;
        link.click();
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      // Fallback: download as image
      const canvas = await import('html2canvas').then(module => 
        module.default(element, { backgroundColor: '#fff', scale: 2 })
      ).catch(() => null);
      
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Certificate_${certificate.courseId}_${Date.now()}.png`;
        link.click();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Certificate Display */}
        <div
          ref={certificateRef}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-200 rounded-2xl p-12 mb-8 text-center shadow-lg"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="text-5xl mb-4">🏅</div>
            <h2 className="text-4xl font-bold text-amber-900 mb-2">Certificate of Achievement</h2>
            <div className="h-1 w-24 bg-amber-400 mx-auto mb-4"></div>
          </div>

          {/* Content */}
          <div className="mb-8">
            <p className="text-gray-700 text-lg mb-4">This certifies that</p>
            <p className="text-3xl font-bold text-amber-900 mb-6">{certificate.userId || 'Student'}</p>
            <p className="text-gray-700 text-lg mb-2">has successfully completed the assessment for</p>
            <p className="text-2xl font-bold text-amber-800 mb-6">{getCourseTitle(certificate.courseId)}</p>
          </div>

          {/* Score Info */}
          <div className="bg-white/60 backdrop-blur rounded-lg p-6 mb-8 inline-block">
            <p className="text-gray-700 text-sm mb-2">Assessment Score</p>
            <p className="text-3xl font-bold text-green-600">{certificate.score}%</p>
            <p className="text-gray-600 text-sm">
              {certificate.correctAnswers} out of {certificate.totalQuestions} questions correct
            </p>
          </div>

          {/* Date */}
          <div className="border-t-2 border-amber-300 pt-8">
            <p className="text-gray-700 mb-2">Date: <span className="font-semibold">{certificate.completionDate}</span></p>
            <p className="text-xs text-gray-600">Certificate ID: {certificate.id}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => downloadCertificate('png')}
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2"
          >
            <span>📥</span> Download as PNG
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
