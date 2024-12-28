import ConfettiCanvas from "react-confetti-canvas";  

export default function Thankyou() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white bg-black">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <ConfettiCanvas
          recycle={false}
          confettiCount={200} 
          angle={90} 
          spread={90}
          tilt={10}
          fadeOut={true}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <div className="z-10 flex flex-col items-center justify-center">
        <h1 className="mb-4 text-5xl font-extrabold">Thank You</h1>
        <p className="max-w-md mb-8 text-lg text-center">
          Your feedback has been submitted successfully 🎉 
          We value your input and can't wait to make our events even better.
        </p>
        <div className="flex space-x-4">
          <a
            href="/"
            className="px-6 py-3 font-bold text-white transition-all duration-300 bg-blue-600 rounded-full shadow-md hover:bg-blue-800"
          >
            Go to Home
          </a>
        </div>
      </div>
   </div>
)}
