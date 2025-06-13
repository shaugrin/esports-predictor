import { Link } from 'react-router-dom';
import { FiClock, FiUser } from 'react-icons/fi';

const EventCard = ({ event }) => {
  const timeRemaining = new Date(event.endTime) - new Date();
  const isEnded = timeRemaining <= 0;
  
  return (
    <Link 
      to={`/event/${event._id}`}
      className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title text-lg font-bold line-clamp-2">
              {event.title}
            </h3>
            <div className="badge badge-primary mt-1">
              {event.category}
            </div>
          </div>
          
          <div className="badge badge-outline">
            {event.visibility === 'private' ? <FiUser /> : 'Public'}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <FiClock />
            <span>
              {isEnded ? 'Ended' : 'Ends'} {new Date(event.endTime).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {event.outcomes.map((outcome, index) => (
              <div key={index} className="badge badge-ghost">
                {outcome}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;