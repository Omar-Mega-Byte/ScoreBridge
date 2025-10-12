import { AlertCircle, Info } from 'lucide-react';

const HackathonBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-blue-600 text-white shadow-lg sticky top-0 z-[100] border-b-4 border-primary-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-3 flex-wrap text-center">
          <Info className="flex-shrink-0 animate-pulse" size={28} />
          <div className="flex-1 min-w-0 max-w-4xl">
            <p className="text-base md:text-lg font-bold drop-shadow-md">
              🎉 <span className="font-extrabold text-white">HACKATHON PROJECT</span> 🎉
            </p>
            <p className="text-sm md:text-base mt-1 font-medium">
              ⚠️ This app uses an <span className="font-bold underline">in-memory H2 database</span>. 
              Your data <span className="font-bold underline">will be lost</span> when the server restarts, 
              after periods of inactivity, or when you close your browser. 
              <span className="font-bold"> Do NOT store important information!</span> ⚠️
            </p>
          </div>
          <AlertCircle className="flex-shrink-0 animate-pulse" size={28} />
        </div>
      </div>
    </div>
  );
};

export default HackathonBanner;
