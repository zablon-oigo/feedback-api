import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateFeedback from "./pages/CreateFeedback";
import Thankyou from "./pages/ThankYou";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feedback" element={<CreateFeedback />} />
          <Route path="/thankyou" element={<Thankyou />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
