import { useState, useEffect } from 'react';


const symbols = ['🍒', '🍋', '🍇', '🍊', '🎰', '💎', '7️⃣', '🔔'];

export default function SlotMachine() {
  const [reels, setReels] = useState(['🎰', '🎰', '🎰']);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [credits, setCredits] = useState(100);
  const [jackpot, setJackpot] = useState(1000);

  const spin = () => {
    if (spinning || credits < 10) return;
    
    setCredits(prev => prev - 10);
    
    setResult(null);
    
    setSpinning(true);
    
    const spinInterval = setInterval(() => {
      setReels(reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]));
    }, 100);
    
    setTimeout(() => {
      clearInterval(spinInterval);
      
      const finalReels = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
      setReels(finalReels);
      
      const allMatch = finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2];
      
      if (allMatch) {
        if (finalReels[0] === '💎') {
          setResult({ win: true, message: `JACKPOT! YOU WIN ${jackpot} CREDITS!` });
          setCredits(prev => prev + jackpot);
        } else {
          const winAmount = 50;
          setResult({ win: true, message: `YOU WIN ${winAmount} CREDITS!` });
          setCredits(prev => prev + winAmount);
        }
      } else {
        setResult({ win: false, message: 'Better luck next time!' });
      }
      
      setSpinning(false);
    }, 2000);
  };

  useEffect(() => {
    const jackpotInterval = setInterval(() => {
      setJackpot(prev => prev + 5);
    }, 10000);
    
    return () => clearInterval(jackpotInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-4">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold mb-2 text-yellow-400 drop-shadow-lg">LUCKY SLOTS</h1>
        <div className="flex gap-8 text-lg">
          <div className="bg-black bg-opacity-50 p-2 rounded-lg">
            <span className="font-bold">CREDITS:</span> <span className="text-green-400">{credits}</span>
          </div>
          <div className="bg-black bg-opacity-50 p-2 rounded-lg">
            <span className="font-bold">JACKPOT:</span> <span className="text-yellow-400">{jackpot}</span>
          </div>
        </div>
      </div>
      

      <div className="bg-gradient-to-b from-red-800 to-red-900 p-6 rounded-xl border-8 border-yellow-600 shadow-2xl w-full max-w-md">

        <div className="bg-black p-4 rounded-lg flex justify-center gap-2 mb-6">
          {reels.map((symbol, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-center bg-white text-black font-bold text-5xl h-24 w-24 rounded-lg border-4 border-gray-300 ${spinning ? 'animate-pulse' : ''}`}
            >
              {symbol}
            </div>
          ))}
        </div>
        

        {result && (
          <div className={`text-center p-3 rounded-lg mb-4 text-xl font-bold ${
            result.win 
              ? 'bg-green-700 text-white animate-bounce' 
              : 'bg-red-800 text-white'
          }`}>
            {result.message}
          </div>
        )}
        

        <div className="flex justify-center">
          <button
            onClick={spin}
            disabled={spinning || credits < 10}
            className={`px-8 py-4 rounded-full text-xl font-bold transition-all transform ${'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 text-black shadow-lg'
            }`}
          >
            {spinning ? 'SPINNING...' : credits < 10 ? 'NEED CREDITS' : 'SPIN (10 CREDITS)'}
          </button>
        </div>
      </div>
      

      {credits < 10 && (
        <button 
          onClick={() => setCredits(prev => prev + 100)}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold"
        >
          ADD 100 CREDITS
        </button>
      )}
      

      <div className="mt-6 text-sm text-gray-300 max-w-md text-center">
        <p>Match three symbols to win! Match three 💎 for the JACKPOT!</p>
        <p className="mt-1">Each spin costs 10 credits. Regular wins pay 50 credits.</p>
      </div>
    </div>
  );
}