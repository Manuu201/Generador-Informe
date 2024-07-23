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
  const [images, setImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const submachineResponse = await axios.get(`http://localhost:3000/api/submachines/machine/${machineId}`);
        setSubmachines(submachineResponse.data);

        const tasksAndObservations = await Promise.all(submachineResponse.data.map(async (submachine) => {
          const [taskResponse, observationResponse, imageResponse] = await Promise.all([
            axios.get(`http://localhost:3000/api/tasks/submachine/${submachine.id}`),
            axios.get(`http://localhost:3000/api/observations/submachine/${submachine.id}`),
            axios.get(`http://localhost:3000/api/photos/submachine/${submachine.id}`)
          ]);
          return {
            submachineId: submachine.id,
            tasks: taskResponse.data,
            observations: observationResponse.data,
            images: imageResponse.data
          };
        }));

        const tasks = {};
        const observations = {};
        const images = {};

        tasksAndObservations.forEach(({ submachineId, tasks: taskList, observations: observationList, images: imageList }) => {
          tasks[submachineId] = taskList;
          observations[submachineId] = observationList;
          images[submachineId] = imageList;
        });

        setTasks(tasks);
        setObservations(observations);
        setImages(images);
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
      } else if (deleteItem.type === 'image') {
        await axios.delete(`http://localhost:3000/api/photos/${deleteItem.id}`);
        setImages((prev) => ({
          ...prev,
          [deleteItem.submachineId]: prev[deleteItem.submachineId].filter(img => img.id !== deleteItem.id)
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

  const handleDeleteImage = (imageId, submachineId) => {
    setDeleteItem({ id: imageId, type: 'image', submachineId });
    setShowDeleteConfirmation(true);
  };

  const handleCreateReport = () => {
    navigate(`/create-report-final/${machineId}`);
  };

  const handleImageUpload = async (event, submachineId) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('machineId', machineId);
    formData.append('submachineId', submachineId);

    try {
      const response = await axios.post('http://localhost:3000/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImages((prev) => ({
        ...prev,
        [submachineId]: [...(prev[submachineId] || []), response.data]
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
            <th>Imagen</th>
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
                {images[submachine.id]?.map((image) => (
                  <div key={image.id} className="image-container">
                    <img src={image.url} alt="submachine" className="submachine-image" />
                    <button className="delete-button" onClick={() => handleDeleteImage(image.id, submachine.id)}>Eliminar</button>
                  </div>
                ))}
                {!images[submachine.id] || images[submachine.id].length === 0 ? (
                  <input
                    type="file"
                    onChange={(event) => handleImageUpload(event, submachine.id)}
                    className="upload-button"
                  />
                ) : null}
              </td>
              <td>
                {/* Additional actions can be added here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="create-report-button" onClick={handleCreateReport}>Crear Reporte</button>

      {showObservationModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Añadir Observación</h3>
            <textarea
              value={newObservation}
              onChange={(e) => setNewObservation(e.target.value)}
              rows="4"
            />
            <button onClick={handleAddObservation}>Añadir</button>
            <button onClick={() => setShowObservationModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Añadir Tarea</h3>
            <textarea
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              rows="4"
            />
            <button onClick={handleAddTask}>Añadir</button>
            <button onClick={() => setShowTaskModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que quieres eliminar este {deleteItem.type}?</p>
            <button onClick={handleDelete}>Sí, eliminar</button>
            <button onClick={() => setShowDeleteConfirmation(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineDetails;
