import workImage from "../assets/work.jpg"

const JobInfoCard = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
            <div className="relative w-full h-64 md:h-80">
              {/* Replace "/api/placeholder/400/320" with your actual image path */}
              <img 
                src={workImage}
                alt="Person working on laptop with hourglass" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How much job listed here
            </h2>
            
            <p className="text-gray-600 mb-6">
              Job listings typically include experience and education 
              requirements, a description of the position, what materials
              you need to apply.
            </p>
            
            <div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200">
                View More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobInfoCard;