import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const BookRecommendation = () => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    const getRecommendedBooks = async () => {
      const response = await Axios.get('http://localhost:5000/genres/Romance'); //post!
      setRecommendedBooks(response.data.recommended_books);
    };
    getRecommendedBooks();
  }, []);

  return (
    <div>
      <h1>Recommended Books</h1>
      <ul>
        {recommendedBooks.map((book) => (
          <li key={book}>{book}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookRecommendation;