import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { FaRegHeart } from 'react-icons/fa';

interface FavoriteItemProps {
  favorite: {
    user_id: string;
    puzzle: string;
    created_at: string;
  };
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ favorite }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border flex items-center">
      <p>{favorite.puzzle}</p>
    </div>
  );
};

const Favorites: NextPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    fetch('/api/currentUser')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          console.error(data.error);
        }
      });
  }, []);

  useEffect(() => {
    if (currentUser) {
      //@ts-ignore
      fetch(`${API_URL}/favorites/${currentUser.email}`)
        .then((res) => res.json())
        .then((data) => {
          setFavorites(data);
        });
    }
}, [currentUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Favorite Puzzles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
        Your Favorite Puzzles
      </h1>
      <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
        {favorites.map((favorite, index) => (
          <FavoriteItem favorite={favorite} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
