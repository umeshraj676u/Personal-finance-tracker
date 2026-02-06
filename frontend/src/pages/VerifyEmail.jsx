import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

const VerifyEmail = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      const response = await axios.get(`/api/auth/verify-email/${token}`)
      setStatus('success')
      setMessage(response.data.message || 'Email verified successfully!')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setStatus('error')
      setMessage(error.response?.data?.message || 'Email verification failed. The link may be invalid or expired.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <FiCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
            <Link
              to="/login"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <FiXCircle className="mx-auto text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/register"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Register Again
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
