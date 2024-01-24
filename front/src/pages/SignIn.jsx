import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
    SignInError
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.css';



export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        dispatch(SignInError(null));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                {error && error === 'Email does not exist' &&
                    <p className='text-red-700'>Email does not exist</p>
                }
                <input
                    type='email'
                    placeholder='email'
                    className={` border:none outline-none w-full border p-3 rounded-lg ${error === 'Email does not exist' ? 'border-red-500 ' : ''}`}
                    id='email'
                    onChange={handleChange}
                    required
                />
                {error && error === 'Password is invalid' &&
                    <p className='text-red-700'>Password is invalid</p>
                }
                    <div className={`flex relative h-50 bg-white   rounded-lg p-3 ${error === 'Password is invalid' ? 'border border-red-500' : ''} `}> 
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='password'
                        // className={` w-full border p-3 rounded-lg ${error === 'Password is invalid' ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500' : ''}`}
                        className={` w-full  border:none outline-none bg-inherit transparent`}
                        id='password'
                        onChange={handleChange}
                        required

                    />
                    <div className=''> <FontAwesomeIcon className='hover:cursor-pointer' onClick={togglePasswordVisibility} icon={showPassword ? faEyeSlash : faEye} /></div> 
                    </div>  

                <button
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
                <OAuth />
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Dont have an account?</p>
                <Link to={'/sign-up'}>
                    <span className='text-blue-700'>Sign up</span>
                </Link>
            </div>
            {error && error !== 'Email does not exist'
                && error !== 'Password is invalid' &&
                <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    );
}