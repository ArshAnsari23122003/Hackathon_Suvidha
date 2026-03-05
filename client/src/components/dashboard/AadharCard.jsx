import React, { useState } from 'react';
import { RefreshCcw, ShieldCheck } from 'lucide-react';

const AadharCard = ({ userData }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full px-2 py-4">
      {/* 3D Wrapper */}
      <div className="hover-3d relative w-full max-w-[340px] h-[210px] z-10 group">
        
        {/* The Card Content */}
        <div className={`card-content relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'is-flipped' : ''}`}>
          
          {/* THE HOVER GRIDS (Now inside the tilting content to prevent flickering) */}
          <div className="absolute inset-0 z-[60] grid grid-cols-3 grid-rows-3 pointer-events-auto">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={`hover-grid-${i + 1} w-full h-full`} />
            ))}
          </div>

          {/* FRONT SIDE */}
          <div className={`absolute inset-0 backface-hidden shadow-xl rounded-2xl overflow-hidden border border-slate-200 bg-white ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-full h-full p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start border-b-2 border-orange-400 pb-1">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png" className="h-7" alt="UIDAI" />
                <div className="text-right">
                  <p className="text-[8px] font-bold text-slate-700 leading-none">भारत सरकार</p>
                  <p className="text-[7px] font-bold text-slate-500 uppercase">Govt. of India</p>
                </div>
              </div>
              
              <div className="flex mt-3 gap-4">
                <div className="w-16 h-20 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden shadow-inner">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name}`} alt="User" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black text-slate-800 uppercase truncate">{userData?.name || "Citizen Name"}</p>
                  <p className="text-[10px] font-bold text-slate-500">DOB: 05/12/1995</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Male / पुरुष</p>
                </div>
              </div>

              <div className="text-center border-t border-red-500 pt-2">
                <p className="text-lg font-bold tracking-[0.2em] text-slate-800">
                  {userData?.aadhaar?.replace(/(\d{4})/g, '$1 ').trim() || "0000 0000 0000"}
                </p>
                <div className="bg-red-600 text-white text-[7px] font-black py-1 mt-1 uppercase tracking-widest">
                  मेरा आधार, मेरी पहचान
                </div>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 shadow-xl rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <div className="w-full h-full p-4 flex flex-col">
              <div className="flex h-full">
                <div className="w-2/3 text-[10px] text-slate-700 leading-tight pr-2">
                  <p className="font-bold border-b border-slate-100 mb-2 pb-1">Address / पता:</p>
                  <p>S/O: Resident Kumar,</p>
                  <p>Nagar Setu Digital Records,</p>
                  <p>Sector 12, Smart City,</p>
                  <p>India - 110001</p>
                  <div className="mt-3">
                    <p className="text-blue-600 font-black text-[9px] flex items-center gap-1">
                       <ShieldCheck size={10}/> Verified: +91 {userData?.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="w-1/3 flex flex-col items-center justify-center">
                  <div className="p-1 border border-slate-100 bg-white shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" className="w-16 h-16" />
                  </div>
                </div>
              </div>
              <div className="mt-auto border-t-2 border-green-600 pt-2 flex justify-between items-center text-[8px] font-black text-slate-400">
                <span>www.uidai.gov.in</span>
                <span className="text-slate-900 text-xs">1947</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Button */}
      <button 
        onClick={() => setIsFlipped(!isFlipped)}
        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-all shadow-lg active:scale-95 z-20"
      >
        <RefreshCcw size={14} className={isFlipped ? 'rotate-180 transition-transform duration-700' : ''} />
        {isFlipped ? "Show Front Side" : "Show Back Side"}
      </button>

      <style>{`
        .hover-3d { perspective: 2000px; }
        .card-content { 
          transform-style: preserve-3d; 
          transition: transform 0.4s ease-out;
        }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        
        /* Flip state */
        .is-flipped { transform: rotateY(180deg); }

        /* FRONT TILT Logic (Grid triggers tilt on the card itself) */
        .card-content:has(.hover-grid-1:hover) { transform: rotateX(15deg) rotateY(-15deg); }
        .card-content:has(.hover-grid-2:hover) { transform: rotateX(15deg); }
        .card-content:has(.hover-grid-3:hover) { transform: rotateX(15deg) rotateY(15deg); }
        .card-content:has(.hover-grid-4:hover) { transform: rotateY(-15deg); }
        .card-content:has(.hover-grid-6:hover) { transform: rotateY(15deg); }
        .card-content:has(.hover-grid-7:hover) { transform: rotateX(-15deg) rotateY(-15deg); }
        .card-content:has(.hover-grid-8:hover) { transform: rotateX(-15deg); }
        .card-content:has(.hover-grid-9:hover) { transform: rotateX(-15deg) rotateY(15deg); }

        /* BACK TILT Logic (Applied when flipped) */
        .card-content.is-flipped:has(.hover-grid-1:hover) { transform: rotateY(180deg) rotateX(15deg) rotateY(15deg); }
        .card-content.is-flipped:has(.hover-grid-2:hover) { transform: rotateY(180deg) rotateX(15deg); }
        .card-content.is-flipped:has(.hover-grid-3:hover) { transform: rotateY(180deg) rotateX(15deg) rotateY(-15deg); }
        .card-content.is-flipped:has(.hover-grid-4:hover) { transform: rotateY(180deg) rotateY(15deg); }
        .card-content.is-flipped:has(.hover-grid-6:hover) { transform: rotateY(180deg) rotateY(-15deg); }
        .card-content.is-flipped:has(.hover-grid-7:hover) { transform: rotateY(180deg) rotateX(-15deg) rotateY(15deg); }
        .card-content.is-flipped:has(.hover-grid-8:hover) { transform: rotateY(180deg) rotateX(-15deg); }
        .card-content.is-flipped:has(.hover-grid-9:hover) { transform: rotateY(180deg) rotateX(-15deg) rotateY(-15deg); }

        .hover-3d:hover .card-content {
          box-shadow: 0 40px 80px -15px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </div>
  );
};

export default AadharCard;
