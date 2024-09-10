import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [tasks, setTasks] = useState([]); // Estado para armazenar as tarefas
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento
  const [error, setError] = useState(null); // Estado para gerenciar erros
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/me', {
          headers: { Authorization: `${token}` }
        });
        
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token não encontrado. Usuário não autenticado.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3000/tasks', {
          headers: { Authorization: `${token}` },
        });

        console.log(response);

        if (Array.isArray(response.data.tasks)) {
            setTasks(response.data.tasks); // Atualiza o estado com as tarefas recebidas
          }  else {
            setError('Dados inválidos recebidos da API.');
          }
      } catch (err) {
        setError('Erro ao buscar tarefas.');
      } finally {
        setLoading(false); // Finaliza o carregamento após a requisição
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {   

    e.preventDefault();
    try {        
        const token = localStorage.getItem('token');   
        await axios.post(
            'http://localhost:3000/tasks',
            { title, description }, // O corpo da requisição
            {
              headers: { Authorization: `${token}` }, // Cabeçalho de autenticação
            }
            
        )
         
    
    }catch (error) {
        console.error('Registration failed', error);
    };
  }
  const handleEdit = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:3000/tasks/${id}`,  
            { title, description }, // O corpo da requisição
            {
              headers: { Authorization: `${token}` }, // Cabeçalho de autenticação
            });
        setTasks(tasks.filter(task => task.id !== id)); // Atualiza a lista de tarefas após exclusão
      } catch (err) {
        console.error('Erro ao excluir a tarefa:', err);
      }
      
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/tasks/${id}`, {
        headers: { Authorization: `${token}` },
      });
      setTasks(tasks.filter(task => task.id !== id)); // Atualiza a lista de tarefas após exclusão
    } catch (err) {
      console.error('Erro ao excluir a tarefa:', err);
    }
  };

  if (!user) return <div>Loading...</div>;

  if (loading) {
    return <div>Carregando...</div>; // Mensagem de carregamento
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">Criar Nova Tarefa</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
            Título da Tarefa
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Criar Tarefa
        </button>
      </form>


      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Todas as Tarefas</h2>
        {tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        <ul className="list-disc pl-5">
          {tasks.map((task) => (
            <li key={task.id} className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(task.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
        </div>


    </div>
  );
}