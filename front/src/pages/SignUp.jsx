import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.css';



export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
            setError(null);

    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                
            
                return;
            }
            setLoading(false);
            setError(null);
            navigate('/sign-in');
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                {error && (error === 'Username is not available' || error === 'Username must contain at least 6 characters')  &&
                    <p className='text-red-700'>{`${error === 'Username is not available'? 'Username is already taken.' : 'Username must contain at least 6 characters' } `}</p>
                }
                <input
                    type='text'
                    placeholder='username'
                    className={`border:none outline-none w-full border p-3 rounded-lg ${error === 'Username is not available' || error === 'Username must contain at least 6 characters' ? 'border-red-500' : ''}`}
                    id='username'
                    onChange={handleChange}
                    required
                />
                {error && error === 'Email is not available' &&
                    <p className='text-red-700'>Email is already taken</p>
                }
                <input
                    type='email'
                    placeholder='email'
                    className={` border:none outline-none w-full border p-3 rounded-lg ${error === 'Email is not available' ? 'border-red-500 ' : ''}`}
                    id='email'
                    onChange={handleChange}
                    required
                />
                {error && error === 'Password must contain at least 8 characters' &&
                    <p className='text-red-700'>Password must contain at least 8 characters</p>
                }
                <div className={`flex relative h-50 bg-white   rounded-lg p-3 ${error === 'Password must contain at least 8 characters' ? 'border border-red-500' : ''} `}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='password'
                        className={` w-full  border:none outline-none bg-inherit transparent`}
                        id='password'
                        onChange={handleChange}
                        required
                    />
                    <div className=''> <FontAwesomeIcon className='hover:cursor-pointer' onClick={togglePasswordVisibility} icon={showPassword ? faEyeSlash : faEye} /></div>
                </div>

                <button
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed'
                >
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                <OAuth />
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Have an account?</p>
                <Link to={'/sign-in'}>
                    <span className='text-blue-700'>Sign in</span>
                </Link>
            </div>
            {error
            && error !== 'Username is not available' 
            && error !== 'Email is not available'
            && error !== 'Password must contain at least 8 characters'
            && error !== 'Username must contain at least 6 characters' &&
                <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    );
}