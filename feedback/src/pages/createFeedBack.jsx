import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateFeedback() {
  const [feedback, setFeedback] = useState({
    FirstName: "",
    LastName: "",
    Age: "",
    Gender: "",
    EventRating: "",
    ValuableAspects: "",
    VenueFeedback: "",
    SpeakerFeedback: "",
    NetworkingFeedback: "",
    FutureRecommendation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFeedback((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "FirstName",
      "LastName",
      "Age",
      "Gender",
      "EventRating",
      "ValuableAspects",
      "VenueFeedback",
      "SpeakerFeedback",
      "NetworkingFeedback",
      "FutureRecommendation",
    ];

    const isEmptyField = requiredFields.some((field) => !feedback[field]);
    if (isEmptyField) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axios.post("", feedback);
      setSuccess(true);
      setTimeout(() => {
        setFeedback({
          FirstName: "",
          LastName: "",
          Age: "",
          Gender: "",
          EventRating: "",
          ValuableAspects: "",
          VenueFeedback: "",
          SpeakerFeedback: "",
          NetworkingFeedback: "",
          FutureRecommendation: "",
        });
        navigate("/thankyou");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-2xl font-semibold text-center">Submit Feedback</h1>

      {error && <div className="mb-4 text-center text-red-500">{error}</div>}
      {success && <div className="mb-4 text-center text-green-500">Feedback submitted successfully!</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="FirstName"
            placeholder="Enter your first name"
            value={feedback.FirstName}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="LastName"
            placeholder="Enter your last name"
            value={feedback.LastName}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="Age"
            placeholder="Enter your age"
            value={feedback.Age}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="Gender"
            value={feedback.Gender}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rate the overall experience of the event</label>
          <select
            name="EventRating"
            value={feedback.EventRating}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Rating</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700">
          What was the most valuable aspect of the event for you? <br />
        </label>
        <select
          name="ValuableAspects"
          value={feedback.ValuableAspects}
          onChange={handleChange}
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an option</option>
          <option value="Keynote Speeches">Keynote Speeches</option>
          <option value="Panel Discussions">Panel Discussions</option>
          <option value="Networking">Networking</option>
          <option value="Workshops">Workshops</option>
        </select>
      </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
          Did the event venue meet your expectations in terms of comfort, accessibility, and facilities?
          </label>
          <select
            name="VenueFeedback"
            value={feedback.VenueFeedback}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">How did you find the speakers presentations?</label>
          <textarea
            name="SpeakerFeedback"
            placeholder="Enter your feedback"
            value={feedback.SpeakerFeedback}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Did you have sufficient opportunities to network and connect with other participants?</label>
          <textarea
            name="NetworkingFeedback"
            placeholder="Enter your feedback"
            value={feedback.NetworkingFeedback}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        {/* Future Recommendation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Would you recommend this event to others? Why or why not?
          </label>
          <textarea
            name="FutureRecommendation"
            placeholder="Enter your feedback"
            value={feedback.FutureRecommendation}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleClick}
          disabled={loading}
          className={`w-full py-3 mt-6 font-semibold text-white rounded-lg focus:outline-none ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          }`}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
