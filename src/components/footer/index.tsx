'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Dialog from './dialog';
import { RiMailAddLine } from 'react-icons/ri';
import { ErrorMessage, SuccessMessage } from './message';

export default function Footer() {
  const [close, setClose] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [statusMessage, setStatusMessage] = useState('');

  const handleClose = () => {
    setClose(!close);
    setStatusMessage('');
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmitEmail = async (e: any) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatusMessage('Masukkan alamat email yang valid');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          subject,
          message,
        }),
      });

      if (res.ok) {
        setEmail('');
        setName('');
        setSubject('');
        setMessage('');
      }

      const data = await res.json();

      console.log(data);
      console.log(data.message);

      if (data.message === 'Success Send Message Email') {
        setStatusMessage('Pesan berhasil dikirim');
      }

      if (data.errors.includes('email is required')) {
        setStatusMessage('Masukin alamat email');
      } else if (data.errors.includes('name is required')) {
        setStatusMessage('Masukin nama anda');
      } else if (data.errors.includes('subject is required')) {
        setStatusMessage('Masukin subject');
      } else if (data.errors.includes('message is required')) {
        setStatusMessage('Masukin pesan anda');
      }
    } catch (error) {
      console.log(error);
      setMessage('Pesan gagal dikirim');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='w-full'>
      <footer className='bg-primary text-white'>
        <div className='mx-auto max-w-6xl text-center'>
          <p className='mt-6 pb-5'>© 2023 Mochamad Ichsan Nr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
