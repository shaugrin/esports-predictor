import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiPlus, FiUser, FiUsers, FiDollarSign } from 'react-icons/fi';
import API from '../services/api';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Daily Life',
    outcomes: ['Yes', 'No'],
    startTime: '',
    endTime: '',
    visibility: 'public',
    invitedUsers: [],
    minStake: 0,
    maxStake: 100
  });
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle outcome changes
  const handleOutcomeChange = (index, value) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = value;
    setFormData(prev => ({ ...prev, outcomes: newOutcomes }));
  };

  // Add new outcome
  const addOutcome = () => {
    setFormData(prev => ({
      ...prev,
      outcomes: [...prev.outcomes, `Option ${prev.outcomes.length + 1}`]
    }));
  };

  // Remove outcome
  const removeOutcome = (index) => {
    if (formData.outcomes.length <= 2) return;
    const newOutcomes = formData.outcomes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, outcomes: newOutcomes }));
  };

  // Search users for invitation
  const searchUsers = async (query) => {
    if (query.length < 3) return;
    try {
      const response = await API.get(`/users/search?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      toast.error('Failed to search users');
    }
  };

  // Add user to invite list
  const addInvitedUser = (user) => {
    if (!formData.invitedUsers.some(u => u._id === user._id)) {
      setFormData(prev => ({
        ...prev,
        invitedUsers: [...prev.invitedUsers, user]
      }));
    }
    setUserSearch('');
    setSearchResults([]);
  };

  // Remove user from invite list
  const removeInvitedUser = (userId) => {
    setFormData(prev => ({
      ...prev,
      invitedUsers: prev.invitedUsers.filter(user => user._id !== userId)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Prepare data for API
    const eventData = {
      ...formData,
      invitedUsers: formData.invitedUsers.map(user => user._id)
    };
    
    try {
      const response = await API.post('/events', eventData);
      toast.success('Event created successfully!');
      navigate(`/event/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate form
  const isFormValid = () => {
    return (
      formData.title.trim() !== '' &&
      formData.outcomes.every(outcome => outcome.trim() !== '') &&
      formData.startTime &&
      formData.endTime &&
      new Date(formData.endTime) > new Date(formData.startTime) &&
      formData.maxStake >= formData.minStake
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Prediction Event</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card bg-base-100 shadow-sm p-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            What are we predicting?
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Will Alex forget their keys again?"
            required
          />
        </div>
        
        {/* Category */}
        <div className="card bg-base-100 shadow-sm p-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="Daily Life">Daily Life</option>
            <option value="Tech">Tech</option>
            <option value="Gaming">Gaming</option>
            <option value="Work">Work</option>
            <option value="Relationships">Relationships</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {/* Outcomes */}
        <div className="card bg-base-100 shadow-sm p-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Possible Outcomes
          </label>
          
          <div className="space-y-3">
            {formData.outcomes.map((outcome, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 flex items-center">
                  <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => handleOutcomeChange(index, e.target.value)}
                    className="input input-bordered flex-1"
                    placeholder={`Outcome ${index + 1}`}
                    required
                  />
                </div>
                {formData.outcomes.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOutcome(index)}
                    className="btn btn-ghost btn-circle text-red-500"
                  >
                    <FiX size={20} />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addOutcome}
              className="btn btn-ghost text-primary"
            >
              <FiPlus className="mr-2" />
              Add Another Outcome
            </button>
          </div>
        </div>
        
        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-sm p-6">
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Starts At
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          
          <div className="card bg-base-100 shadow-sm p-6">
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Ends At
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              min={formData.startTime || new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>
        
        {/* Visibility */}
        <div className="card bg-base-100 shadow-sm p-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Visibility
          </label>
          
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={formData.visibility === 'public'}
                onChange={handleChange}
                className="radio radio-primary"
              />
              <span className="flex items-center gap-1">
                <FiUsers /> Public (Anyone can see and predict)
              </span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={formData.visibility === 'private'}
                onChange={handleChange}
                className="radio radio-primary"
              />
              <span className="flex items-center gap-1">
                <FiUser /> Private (Only invited users)
              </span>
            </label>
          </div>
          
          {/* Invited Users (Conditional) */}
          {formData.visibility === 'private' && (
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">
                Invite Friends
              </label>
              
              {/* User search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  className="input input-bordered w-full"
                  placeholder="Search users by username..."
                />
                
                {searchResults.length > 0 && (
                  <div className="absolute z-10 bg-white w-full mt-1 rounded-lg shadow-lg border">
                    {searchResults.map(user => (
                      <div
                        key={user._id}
                        className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => addInvitedUser(user)}
                      >
                        <div className="avatar placeholder mr-2">
                          <div className="bg-neutral text-neutral-content rounded-full w-8">
                            {user.username.charAt(0)}
                          </div>
                        </div>
                        <span>{user.username}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Invited users list */}
              <div className="flex flex-wrap gap-2">
                {formData.invitedUsers.map(user => (
                  <div 
                    key={user._id} 
                    className="badge badge-primary gap-2 py-3"
                  >
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-6">
                        {user.username.charAt(0)}
                      </div>
                    </div>
                    {user.username}
                    <button 
                      type="button"
                      onClick={() => removeInvitedUser(user._id)}
                      className="text-white"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Staking */}
        <div className="card bg-base-100 shadow-sm p-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Staking Options
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <FiDollarSign /> Minimum Stake
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="minStake"
                  value={formData.minStake}
                  onChange={handleChange}
                  className="range range-primary flex-1"
                />
                <span className="badge badge-primary w-16 text-center">
                  {formData.minStake} pts
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <FiDollarSign /> Maximum Stake
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={formData.minStake}
                  max="500"
                  name="maxStake"
                  value={formData.maxStake}
                  onChange={handleChange}
                  className="range range-primary flex-1"
                />
                <span className="badge badge-primary w-16 text-center">
                  {formData.maxStake} pts
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-gray-600">
            Players can stake between {formData.minStake} and {formData.maxStake} points
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? 'Creating Event...' : 'Create Prediction Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;