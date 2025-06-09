import { useForm } from 'react-hook-form';
import { FiMail, FiLock } from 'react-icons/fi';

const LoginForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-group">
        <label className="flex items-center gap-2">
          <FiMail className="text-gray-500" />
          Email
        </label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="input input-bordered w-full"
          placeholder="your.email@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      
      <div className="form-group">
        <label className="flex items-center gap-2">
          <FiLock className="text-gray-500" />
          Password
        </label>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
          className="input input-bordered w-full"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      
      <button type="submit" className="btn btn-primary w-full">
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;