import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUsers, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import API from '../services/api';
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';
import { getCurrentUser } from '../services/auth';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [userPrediction, setUserPrediction] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
        const [eventRes, predictionsRes] = await Promise.all([
          API.get(`/events/${id}`),
          API.get(`/predictions/event/${id}`)
        ]);
        
        setEvent(eventRes.data);
        setPredictions(predictionsRes.data);
        
        // Check if user has already predicted
        const userPred = predictionsRes.data.find(p => p.user._id === user?._id);
        setUserPrediction(userPred);
      } catch (err) {
        toast.error('Failed to load event data');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventData();
  }, [id]);

  const handleStakeChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= event.minStake && value <= event.maxStake) {
      setStakeAmount(value);
    }
  };

  const handleSubmitPrediction = async () => {
    if (!selectedOutcome) {
      toast.error('Please select an outcome');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await API.post('/predictions', {
        eventId: id,
        outcomeIndex: selectedOutcome,
        stake: stakeAmount
      });
      
      setUserPrediction(response.data);
      toast.success('Prediction submitted!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit prediction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateOutcomePercentages = () => {
    if (!event || predictions.length === 0) return {};
    
    const totalStake = predictions.reduce((sum, p) => sum + p.stake, 0);
    const outcomeStakes = {};
    
    event.outcomes.forEach((_, index) => {
      outcomeStakes[index] = predictions
        .filter(p => p.outcomeIndex === index)
        .reduce((sum, p) => sum + p.stake, 0);
    });
    
    const percentages = {};
    Object.keys(outcomeStakes).forEach(index => {
      percentages[index] = totalStake > 0 
        ? Math.round((outcomeStakes[index] / totalStake) * 100)
        : 0;
    });
    
    return percentages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Loading prediction event...</p>
        </div>
      </div>
    );
  }

  const outcomePercentages = calculateOutcomePercentages();
  const timeRemaining = new Date(event.endTime) - new Date();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-ghost mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to Events
      </button>
      
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <h1 className="card-title text-3xl font-bold">{event.title}</h1>
              <div className="badge badge-primary mt-2">{event.category}</div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-bold flex items-center gap-2">
                <FiClock /> 
                <Countdown 
                  date={Date.now() + timeRemaining} 
                  renderer={({ hours, minutes, seconds, completed }) => (
                    completed ? 'Event ended' : `${hours}h ${minutes}m ${seconds}s`
                  )}
                />
              </div>
              <div className="text-gray-600">
                Ends: {new Date(event.endTime).toLocaleString()}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Created by: {event.creator.username}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiUsers className="text-gray-500" />
                <h3 className="font-bold">Participants</h3>
              </div>
              <div className="text-2xl font-bold">{predictions.length}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="text-gray-500" />
                <h3 className="font-bold">Total Staked</h3>
              </div>
              <div className="text-2xl font-bold">
                {predictions.reduce((sum, p) => sum + p.stake, 0)} pts
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Prediction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Outcome Selection */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-md mb-6">
            <div className="card-body">
              <h2 className="card-title text-xl font-bold mb-4">
                Predict the Outcome
              </h2>
              
              {userPrediction ? (
                <div className="alert alert-success">
                  <div>
                    <span className="font-bold">Your Prediction:</span> You staked {userPrediction.stake} points on "{event.outcomes[userPrediction.outcomeIndex]}"
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {event.outcomes.map((outcome, index) => (
                      <div 
                        key={index}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedOutcome === index 
                            ? 'border-primary bg-primary/10' 
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedOutcome(index)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-bold">{outcome}</div>
                          <div className="badge badge-primary">
                            {outcomePercentages[index] || 0}%
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${outcomePercentages[index] || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block font-bold mb-2">
                      Stake Amount: {stakeAmount} points
                    </label>
                    <input
                      type="range"
                      min={event.minStake}
                      max={event.maxStake}
                      value={stakeAmount}
                      onChange={handleStakeChange}
                      className="range range-primary w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 px-2">
                      <span>Min: {event.minStake}</span>
                      <span>Max: {event.maxStake}</span>
                    </div>
                  </div>
                  
                  <button
                    className="btn btn-primary w-full"
                    onClick={handleSubmitPrediction}
                    disabled={isSubmitting || !selectedOutcome}
                  >
                    {isSubmitting ? 'Submitting...' : 'Place Your Prediction'}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Prediction List */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-xl font-bold mb-4">
                All Predictions ({predictions.length})
              </h2>
              
              {predictions.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No predictions yet - be the first to predict!
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((prediction) => (
                    <div 
                      key={prediction._id} 
                      className="flex items-center justify-between p-3 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            {prediction.user.username.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{prediction.user.username}</div>
                          <div className="text-sm text-gray-600">
                            Staked: {prediction.stake} points
                          </div>
                        </div>
                      </div>
                      <div className="badge badge-primary">
                        {event.outcomes[prediction.outcomeIndex]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Sidebar */}
        <div>
          <div className="card bg-base-100 shadow-md sticky top-6">
            <div className="card-body">
              <h2 className="card-title text-xl font-bold mb-4">
                <FiBarChart2 className="mr-2" /> Prediction Stats
              </h2>
              
              <div className="space-y-4">
                {event.outcomes.map((outcome, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{outcome}</span>
                      <span>{outcomePercentages[index] || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full" 
                        style={{ width: `${outcomePercentages[index] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <div className="divider"></div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Predictions:</span>
                    <span className="font-bold">{predictions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Points Staked:</span>
                    <span className="font-bold">
                      {predictions.reduce((sum, p) => sum + p.stake, 0)} pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Stake:</span>
                    <span className="font-bold">{event.minStake} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Stake:</span>
                    <span className="font-bold">{event.maxStake} pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;