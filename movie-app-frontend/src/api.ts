import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface Movie {
  id: number;
  title: string;
  description: string;
}

export const getMovies = async (): Promise<Movie[]> => {
  const response = await axios.get<Movie[]>(`${API_URL}/movies`);
  return response.data;
};

export const addMovie = async (movie: Omit<Movie, 'id'>): Promise<Movie> => {
  const response = await axios.post<Movie>(`${API_URL}/movies`, movie, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const deleteMovie = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/movies/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const updateMovie = async (id: number, updatedMovieData: { title: string; description: string; }): Promise<Movie> => {
  const response = await axios.put<Movie>(`${API_URL}/movies/${id}`, updatedMovieData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};
