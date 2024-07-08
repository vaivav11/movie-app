import React, { useState, useEffect, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { getMovies, addMovie, deleteMovie, updateMovie } from './api';
import { login, register } from './authService';
import styles from './styles/App.module.css';

interface Movie {
  id: number;
  title: string;
  description: string;
}

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(5);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovies();
      setMovies(data);
    };

    fetchMovies();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (editingMovie) {
      await updateMovie(editingMovie.id, { title, description });
      setMovies(movies.map(movie => (movie.id === editingMovie.id ? { ...movie, title, description } : movie)));
      setEditingMovie(null);
      setSuccessMessage('Movie updated successfully.');
    } else {
      const newMovie = await addMovie({ title, description });
      setMovies([...movies, newMovie]);
      setSuccessMessage('Movie added successfully.');
    }
    setTitle('');
    setDescription('');
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    await deleteMovie(id);
    setMovies(movies.filter(movie => movie.id !== id));
    setSuccessMessage('Movie deleted successfully.');
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setTitle(movie.title);
    setDescription(movie.description);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!loginUsername || !loginPassword) {
      setLoginError('Please enter username and password.');
      return;
    }
    try {
      const data = await login(loginUsername, loginPassword);
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setIsAuthenticated(true);
        setLoginUsername('');
        setLoginPassword('');
        setLoginError('');
        setSuccessMessage('Logged in successfully.');
      } else {
        setLoginError('Invalid username or password.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!registerUsername || !registerPassword) {
      setRegisterError('Please enter username and password.');
      return;
    }
    try {
      await register(registerUsername, registerPassword);
      setRegisterUsername('');
      setRegisterPassword('');
      setRegisterError('');
      setSuccessMessage('Registered successfully. Please log in.');
    } catch (error) {
      console.error('Registration failed:', error);
      setRegisterError('Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setSuccessMessage('Logged out successfully.');
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMovies = filteredMovies.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const toggleLoginForm = () => {
    setShowLoginForm(prev => !prev);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
  };

  const toggleRegisterForm = () => {
    setShowRegisterForm(prev => !prev);
    setRegisterUsername('');
    setRegisterPassword('');
    setRegisterError('');
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.authButtons}>
        {!isAuthenticated ? (
          <>
            <button onClick={toggleLoginForm} className={styles.authButton}>
              Login
            </button>
            <button onClick={toggleRegisterForm} className={styles.authButton}>
              Sign Up
            </button>
          </>
        ) : (
          <button onClick={handleLogout} className={styles.authButton}>
            Logout
          </button>
        )}
      </div>
      {showLoginForm && !isAuthenticated && (
        <div className={styles.authFormContainer}>
          <h2>Login</h2>
          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
              className={styles.input}
              autoComplete="username"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className={styles.input}
              autoComplete="current-password"
            />
            {loginError && <p className={styles.error}>{loginError}</p>}
            <button type="submit" className={styles.button}>Login</button>
          </form>
        </div>
      )}
      {showRegisterForm && !isAuthenticated && (
        <div className={styles.authFormContainer}>
          <h2>Register</h2>
          <form onSubmit={handleRegister} className={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
              className={styles.input}
              autoComplete="username"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              className={styles.input}
              autoComplete="new-password"
            />
            {registerError && <p className={styles.error}>{registerError}</p>}
            <button type="submit" className={styles.button}>Register</button>
          </form>
        </div>
      )}
      <h1 className={styles.header}>Movie List</h1>
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      <input
        type="text"
        placeholder="Search movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      <button onClick={toggleSortOrder} className={styles.sortButton}>
        <FontAwesomeIcon icon={faSort} className={styles.sortIcon} />
        Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
      {isAuthenticated && (
        <>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={styles.input}
            ></textarea>
            <button type="submit" className={styles.button}>
              {editingMovie ? 'Update Movie' : 'Add Movie'}
            </button>
          </form>
          <ul className={styles.list}>
            {currentMovies.map(movie => (
              <li key={movie.id} className={styles.listItem}>
                <div>
                  <h2>{movie.title}</h2>
                  <p>{movie.description}</p>
                </div>
                <div>
                  <button onClick={() => handleEdit(movie)} className={styles.editButton}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(movie.id)} className={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
