'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const SignIn = ({ toggleLayout }) => {
  const [address, setAddress] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const connectToMetamask = async () => {
    if (window.ethereum) {
      setIsLoading(true);
      toast.dismiss();
      try {
        const [selectedAddress] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (selectedAddress) {
          setAddress(selectedAddress);
          localStorage.setItem('userAddress', selectedAddress);
          toast.success('MetaMask Connected Successfully');
        } else {
          toast.error('No accounts found');
        }
      } catch (err) {
        toast.error(`Error connecting to MetaMask: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('MetaMask is not Found');
    }
  };

  const handleSubmit = () => {
    if (address) {
      router.push('/blog');
    } else {
      toast.error('MetaMask not connected');
    }
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
        Connect Your Wallet
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Securely connect your MetaMask account to get started.
      </p>

      {/* Connect MetaMask Button */}
      <button
        onClick={connectToMetamask}
        disabled={isLoading}
        className={`bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-5 rounded-lg w-full transition duration-300 ease-in-out transform ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
      >
        {isLoading ? 'Connecting...' : 'Connect to MetaMask'}
      </button>

      {/* Display connected address */}
      {address && (
        <p className="text-center text-gray-800 font-semibold mt-6 mb-6">
          Connected Address: <span className="text-blue-600 break-all">{address}</span>
        </p>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-3 px-5 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Proceed to Dashboard
      </button>

      {/* Toast Notification */}
      <Toaster position="top-center" />
    </div>
  );
};

export default SignIn;
