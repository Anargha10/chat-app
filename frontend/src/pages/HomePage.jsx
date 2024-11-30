import React from 'react';
import { useChatstorage } from '../store/useChatStorage';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import NoChatSelected from '../components/NoChatSelected'; // Import NoChatSelected component
import ChatContainer from '../components/ChatContainer'; // Import ChatContainer component

const HomePage = () => {
  const { selectedUser } = useChatstorage();
  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar />
            
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;