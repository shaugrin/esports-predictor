import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiCalendar, FiAward, FiUser } from 'react-icons/fi';
import API from '../services/api';
import { getCurrentUser } from '../services/auth';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Fetch user's events (created and participating)
        const response = await API.get('/events/my-events');
        setEvents(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Loading your predictions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.username || 'Predictor'}!
          </h1>
          <p className="text-gray-600">
            What will you predict today?
          </p>
        </div>
        
        <Link 
          to="/events/new" 
          className="btn btn-primary mt-4 md:mt-0"
        >
          <FiPlusCircle className="mr-2" />
          Create New Event
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FiCalendar className="text-purple-600 text-xl" />
              </div>
              <div>
                <h2 className="card-title text-gray-800">Active Predictions</h2>
                <p className="text-gray-600">Events you're participating in</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">12</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FiAward className="text-green-600 text-xl" />
              </div>
              <div>
                <h2 className="card-title text-gray-800">Prediction Points</h2>
                <p className="text-gray-600">Your current score</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">1,240</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FiUser className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="card-title text-gray-800">Friends</h2>
                <p className="text-gray-600">Predicting with you</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">8</div>
          </div>
        </div>
      </div>
      
      <div className="bg-base-100 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Recent Events</h2>
          <Link to="/events" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-400 mb-4">No events created yet</div>
            <Link to="/events/new" className="btn btn-primary">
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 5).map(event => (
              <div 
                key={event._id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{event.title}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2">
                        {event.category}
                      </span>
                      <span>Ends: {new Date(event.endTime).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="badge badge-outline">
                    {event.visibility === 'private' ? 'Private' : 'Public'}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.outcomes.map((outcome, index) => (
                    <div key={index} className="badge badge-ghost">
                      {outcome}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;