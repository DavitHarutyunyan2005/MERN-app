import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [succeded, setSucceded] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
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
        setSucceded(false);
        return;
      } else{
        setSucceded(true);
        setLoading(false);
        navigate('/sign-in');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }

    
 
  };
  
  let UsernameTaken;
  let EmailTaken;
  let successfull;
  if(error && error === 'Username is already taken.'){
    UsernameTaken = 'Username is already taken.';
    setSucceded(false);
  } 
  
  if(error && error === 'Email is already taken.'){
    EmailTaken = 'Email is already taken.';
    setSucceded(false);
  }

  if(succeded === true){
    successfull = 'Registration succeded.';
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      {UsernameTaken && <p  className='text-red-500 mt-5 text-xs'>{UsernameTaken}</p>}
        <input type="text" placeholder='username'  className={`border p-3 rounded-lg ${UsernameTaken ? 'border-red-500' : ''}`} onChange={handleChange} id='username' />
        {<div className=''>{EmailTaken && <p  className='text-red-500 mt-5 text-xs '>{EmailTaken}</p>}</div>}
        <input type="email" placeholder="email" className={`border p-3 rounded-lg ${EmailTaken ? 'border-red-500' : ''}`} id="email" onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 cursor:pointer disabled:opacity-80 disabled:cursor-not-allowed'>{loading ? 'Loading...' : 'Sign Up'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Already have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {succeded === true  && <p  className='text-green-600 mt-5  '>{successfull}</p>}
    </div>
  )
}
