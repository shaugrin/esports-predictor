import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Predict the Fun Stuff</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create and predict everyday events with friends. Will Alex forget keys again? 
            Will coffee machine break? Place your predictions!
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline btn-light btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-md p-6">
              <div className="text-4xl mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Create Events</h3>
              <p>
                Make predictions about daily life: "Will meeting run over?", 
                "Will bus be late?", "Will Alex forget keys?"
              </p>
            </div>
            
            <div className="card bg-base-100 shadow-md p-6">
              <div className="text-4xl mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Predict Outcomes</h3>
              <p>
                Place your bets with virtual points. Set min/max stakes. 
                Private events for friends only.
              </p>
            </div>
            
            <div className="card bg-base-100 shadow-md p-6">
              <div className="text-4xl mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Earn Points</h3>
              <p>
                Get points for correct predictions. Climb the leaderboard. 
                Bragging rights included!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;