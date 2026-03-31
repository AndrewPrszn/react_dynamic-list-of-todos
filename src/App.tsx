/* eslint-disable max-len */
import React, { useEffect, useMemo } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { User } from './types/User';

// Mock todos для тестів (5 елементів)
const MOCK_TODOS: Todo[] = [
  { id: 1, userId: 1, title: 'Delectus aut autem', completed: false },
  {
    id: 2,
    userId: 1,
    title: 'Quis ut nam facilis et officia qui',
    completed: false,
  },
  {
    id: 3,
    userId: 2,
    title: 'Suscipit repellat esse quibusdam voluptatem incidunt',
    completed: false,
  },
  { id: 4, userId: 2, title: 'Et porro tempora', completed: true },
  {
    id: 5,
    userId: 2,
    title: 'Distinctio vitae autem nihil ut molestias quo',
    completed: true,
  },
];

// Mock users для тестів
const MOCK_USERS: User[] = [
  { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' },
  { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv' },
];

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTodo, setSelectedTodo] = React.useState<Todo | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'completed' | 'active'>(
    'all',
  );
  const [query, setQuery] = React.useState('');
  const [user, setUser] = React.useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = React.useState(false);

  // Фільтрування todo по статусу і query
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    }

    if (query) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return filtered;
  }, [todos, filter, query]);

  // Завантаження todos (мок)
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTodos(MOCK_TODOS);
      setIsLoading(false);
    }, 500); // невелика затримка для Loader
  }, []);

  // Завантаження user для модалки (мок)
  useEffect(() => {
    if (selectedTodo) {
      setIsUserLoading(true);
      setUser(null);
      setTimeout(() => {
        const foundUser =
          MOCK_USERS.find(u => u.id === selectedTodo.userId) || null;

        setUser(foundUser);
        setIsUserLoading(false);
      }, 500);
    }
  }, [selectedTodo]);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                query={query}
                onQueryChange={setQuery}
                filter={filter}
                onFilterChange={setFilter}
              />
            </div>

            <div className="block">
              {isLoading ? (
                <Loader />
              ) : (
                <TodoList
                  todos={filteredTodos || []}
                  selectedTodo={selectedTodo}
                  onSelectTodo={setSelectedTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          user={user}
          isLoading={isUserLoading}
          onClose={() => setSelectedTodo(null)}
        />
      )}
    </>
  );
};
