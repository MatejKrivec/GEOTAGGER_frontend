import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

interface User {
  username: string;
  profilePic: string;
}

interface Activity {
  id: number;
  userId: number;
  action: string;
  componentType: string;
  newValue: string;
  location: string;
  createdAt: string;
}

const ActivityLogItem = ({ activity }: {activity: Activity}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      try {
        const response = await fetch(`http://localhost:3000/users/${activity.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const user = await response.json();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to fetch user');
      }
    };

    fetchUser();
  }, [activity.userId]);

  return (
    <div className='LogsData grid grid-cols-6 gap-4 border-b-2 border-gray-200 pb-0.5 w-full'>
      <div className='flex items-center'>
        <img src={user?.profilePic || "src/assets/images/default_user_pic.jpg"} alt="UserPic" className="w-[2rem] h-[2rem] rounded-full mr-2" />
        <span className='username'>{user?.username || 'Unknown User'}</span>
      </div>
      <p>{new Date(activity.createdAt).toLocaleString()}</p>
      <p>{activity.action}</p>
      <p>{activity.componentType}</p>
      <p>{activity.newValue}</p>
      <p>{activity.location}</p>
    </div>
  );
};

export default ActivityLogItem;
