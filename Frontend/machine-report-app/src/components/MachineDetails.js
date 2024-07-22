import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './MachineDetails.css';

const MachineDetails = () => {
  const { machineId } = useParams();
  const [submachines, setSubmachines] = useState([]);
  const [tasks, setTasks] = useState({});
  const [observations, setObservations] = useState({});
  const [newObservation, setNewObservation] = useState('');
  const [newTask, setNewTask] = useState('');
  const [selectedSubmachineId, setSelectedSubmachineId] = useState(null);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ id: null, type: '', submachineId: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const submachineResponse = await axios.get(`http://localhost:3000/api/submachines/machine/${machineId}`);
        setSubmachines(submachineResponse.data);

        const tasksAndObservations = await Promise.all(submachineResponse.data.map(async (submachine) => {
          const [taskResponse, observationResponse] = await Promise.all([
            axios.get(`http://localhost:3000/api/tasks/submachine/${submachine.id}`),
            axios.get(`http://localhost:3000/api/observations/submachine/${submachine.id}`)
          ]);
          return {
            submachineId: submachine.id,
            tasks: taskResponse.data,
            observations: observationResponse.data
          };
        }));

        const tasks = {};
        const observations = {};

        tasksAndObservations.forEach(({ submachineId, tasks: taskList, observations: observationList }) => {
          tasks[submachineId] = taskList;
          observations[submachineId] = observationList;
        });

        setTasks(tasks);
        setObservations(observations);
      } catch (error) {
        console.error('Error fetching machine details:', error);
      }
    };
    fetchMachineDetails();
  }, [machineId]);

  const handleAddObservation = async () => {
    if (selectedSubmachineId === null) return;

    try {
      await axios.post('http://localhost:3000/api/observations', {
        machineId,
        submachineId: selectedSubmachineId,
        note: newObservation
      });
      setNewObservation('');
      setShowObservationModal(false);

      const response = await axios.get(`http://localhost:3000/api/observations/submachine/${selectedSubmachineId}`);
      setObservations((prev) => ({
        ...prev,
        [selectedSubmachineId]: response.data
      }));
    } catch (error) {
      console.error('Error adding observation:', error);
    }
  };

  const handleAddTask = async () => {
    if (selectedSubmachineId === null) return;

    try {
      await axios.post('http://localhost:3000/api/tasks', {
        machineId,
        submachineId: selectedSubmachineId,
        description: newTask,
        status: 0
      });
      setNewTask('');
      setShowTaskModal(false);

      const response = await axios.get(`http://localhost:3000/api/tasks/submachine/${selectedSubmachineId}`);
      setTasks((prev) => ({
        ...prev,
        [selectedSubmachineId]: response.data
      }));
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteItem.type === 'task') {
        await axios.delete(`http://localhost:3000/api/tasks/${deleteItem.id}`);
        setTasks((prev) => ({
          ...prev,
          [deleteItem.submachineId]: prev[deleteItem.submachineId].filter(task => task.id !== deleteItem.id)
        }));
      } else if (deleteItem.type === 'observation') {
        await axios.delete(`http://localhost:3000/api/observations/${deleteItem.id}`);
        setObservations((prev) => ({
          ...prev,
          [deleteItem.submachineId]: prev[deleteItem.submachineId].filter(obs => obs.id !== deleteItem.id)
        }));
      }
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error(`Error deleting ${deleteItem.type}:`, error);
    }
  };

  const handleDeleteTask = (taskId, submachineId) => {
    setDeleteItem({ id: taskId, type: 'task', submachineId });
    setShowDeleteConfirmation(true);
  };

  const handleDeleteObservation = (observationId, submachineId) => {
    setDeleteItem({ id: observationId, type: 'observation', submachineId });
    setShowDeleteConfirmation(true);
  };

  const handleCreateReport = () => {
    navigate(`/create-report-final/${machineId}`);
  };

  return (
    <div className="machine-details">
      <h2>Detalles de la Máquina</h2>
      <table className="details-table">
        <thead>
          <tr>
            <th>Submáquina</th>
            <th>Tareas</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {submachines.map((submachine) => (
            <tr key={submachine.id}>
              <td>{submachine.name}</td>
              <td>
                {tasks[submachine.id]?.map((task) => (
                  <div key={task.id} className="task-item">
                    <span>{task.description}</span>
                    <input
                      type="checkbox"
                      checked={task.status === 1}
                      onChange={() => {/* Handle status toggle */}}
                    />
                    <button className="delete-button" onClick={() => handleDeleteTask(task.id, submachine.id)}>Eliminar</button>
                  </div>
                ))}
                <button className="add-button" onClick={() => {
                  setSelectedSubmachineId(submachine.id);
                  setShowTaskModal(true);
                }}>+</button>
              </td>
              <td>
                {observations[submachine.id]?.map((obs) => (
                  <div key={obs.id} className="observation-item">
                    {obs.note}
                    <button className="delete-button" onClick={() => handleDeleteObservation(obs.id, submachine.id)}>Eliminar</button>
                  </div>
                ))}
                <button className="add-button" onClick={() => {
                  setSelectedSubmachineId(submachine.id);
                  setShowObservationModal(true);
                }}>+</button>
              </td>
              <td>
                {/* Additional actions can be added here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showObservationModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowObservationModal(false)}>&times;</span>
            <h2>Agregar Observación</h2>
            <input
              type="text"
              value={newObservation}
              onChange={(e) => setNewObservation(e.target.value)}
              placeholder="Agregar nueva observación"
            />
            <button onClick={handleAddObservation}>Agregar Observación</button>
          </div>
        </div>
      )}
      {showTaskModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowTaskModal(false)}>&times;</span>
            <h2>Agregar Tarea</h2>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Agregar nueva tarea"
            />
            <button onClick={handleAddTask}>Agregar Tarea</button>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowDeleteConfirmation(false)}>&times;</span>
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar esta {deleteItem.type === 'task' ? 'tarea' : 'observación'}?</p>
            <button onClick={handleDelete} className="confirm-delete-button">Confirmar</button>
            <button onClick={() => setShowDeleteConfirmation(false)} className="cancel-delete-button">Cancelar</button>
          </div>
        </div>
      )}
      <button onClick={handleCreateReport} className="create-report-button">Crear Informe</button>
    </div>
  );
};

export default MachineDetails;
