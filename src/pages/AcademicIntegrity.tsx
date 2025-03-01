import { Squircle, BookOpen, Check, Shield } from 'lucide-react';

const AcademicIntegrity = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-indigo-600 py-6 px-8">
          <div className="flex items-center text-white">
            <Shield className="mr-3" size={28} />
            <h1 className="text-2xl font-bold">Academic Integrity Policy</h1>
          </div>
        </div>
        
        <div className="p-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6 text-lg">
              PeerLearn is committed to upholding the highest standards of academic integrity. 
              This policy outlines our expectations for all users and the measures we take to 
              prevent academic misconduct.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="mr-2 text-indigo-600" size={20} />
              Our Academic Integrity Principles
            </h2>
            
            <ul className="space-y-4 mb-6">
              <li className="flex">
                <Check className="text-green-600 mr-3 flex-shrink-0 mt-1" size={18} />
                <div>
                  <strong className="text-gray-800">Learning Over Answers</strong>
                  <p className="text-gray-600">
                    Our platform focuses on facilitating understanding and learning rather than providing "ready-made" solutions.
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <Check className="text-green-600 mr-3 flex-shrink-0 mt-1" size={18} />
                <div>
                  <strong className="text-gray-800">Original Work</strong>
                  <p className="text-gray-600">
                    All content shared on PeerLearn should be original or properly cited. We employ automated tools to detect plagiarism.
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <Check className="text-green-600 mr-3 flex-shrink-0 mt-1" size={18} />
                <div>
                  <strong className="text-gray-800">Transparency</strong>
                  <p className="text-gray-600">
                    Services and assistance should be provided transparently, with clear expectations about the nature of help being offered.
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <Check className="text-green-600 mr-3 flex-shrink-0 mt-1" size={18} />
                <div>
                  <strong className="text-gray-800">Respect for Institutional Policies</strong>
                  <p className="text-gray-600">
                    Users must respect the academic integrity policies of their own institutions, which may vary.
                  </p>
                </div>
              </li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Squircle className="mr-2 text-amber-600" size={20} />
              Prohibited Activities
            </h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-red-800 mb-2">The following activities are strictly prohibited:</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-red-700">
                <li>Submitting work completed by others as your own</li>
                <li>Providing complete assignments that others can submit directly</li>
                <li>Completing exams or quizzes on behalf of another student</li>
                <li>Sharing copyrighted materials without permission</li>
                <li>Deliberately circumventing academic integrity measures</li>
              </ul>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Acceptable Use Cases</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800 mb-2">PeerLearn is designed to support:</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-green-700">
                <li>Tutoring and explaining concepts</li>
                <li>Reviewing and providing feedback on work</li>
                <li>Assistance with understanding assignments</li>
                <li>Study group collaboration</li>
                <li>Practice problems and learning exercises</li>
              </ul>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enforcement</h2>
            
            <p className="text-gray-700 mb-4">
              PeerLearn takes violations of our academic integrity policy seriously. We employ the following measures:
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex">
                <div className="bg-indigo-100 rounded-full h-6 w-6 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-medium">1</span>
                </div>
                <p className="text-gray-700">
                  <strong>Automated Detection:</strong> We use plagiarism detection tools to check content originality.
                </p>
              </li>
              
              <li className="flex">
                <div className="bg-indigo-100 rounded-full h-6 w-6 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-medium">2</span>
                </div>
                <p className="text-gray-700">
                  <strong>Reporting System:</strong> Users can report suspected violations of our policies.
                </p>
              </li>
              
              <li className="flex">
                <div className="bg-indigo-100 rounded-full h-6 w-6 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-medium">3</span>
                </div>
                <p className="text-gray-700">
                  <strong>Account Suspension:</strong> Accounts found to violate our policies may be temporarily or permanently suspended.
                </p>
              </li>
              
              <li className="flex">
                <div className="bg-indigo-100 rounded-full h-6 w-6 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-medium">4</span>
                </div>
                <p className="text-gray-700">
                  <strong>Content Removal:</strong> Content that violates our academic integrity standards will be removed.
                </p>
              </li>
            </ul>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-medium text-amber-800 mb-2">Important Note:</h3>
              <p className="text-amber-700">
                By using PeerLearn, you agree to abide by this Academic Integrity Policy. The responsibility for maintaining 
                academic integrity ultimately lies with each user. If you're unsure whether an activity violates this policy, 
                we encourage you to reach out to our support team for guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicIntegrity;
