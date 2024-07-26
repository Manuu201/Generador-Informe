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
  const [specialists, setSpecialists] = useState([]);
  const [newSpecialist, setNewSpecialist] = useState({ name: '' });
  const [showSpecialistModal, setShowSpecialistModal] = useState(false);
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

    const fetchSpecialists = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/specialists/machine/${machineId}`);
        setSpecialists(response.data);
      } catch (error) {
        console.error('Error fetching specialists:', error);
      }
    };

    fetchMachineDetails();
    fetchSpecialists();
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
      } else if (deleteItem.type === 'specialist') {
        await axios.delete(`http://localhost:3000/api/specialists/${deleteItem.id}`);
        setSpecialists((prev) => prev.filter(spec => spec.id !== deleteItem.id));
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

  const handleDeleteSpecialist = (specialistId) => {
    setDeleteItem({ id: specialistId, type: 'specialist' });
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

  const handleAddSpecialist = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/specialists', {
        ...newSpecialist,
        machineId,
        status: 0
      });
      setSpecialists((prev) => [...prev, response.data]);
      setNewSpecialist({ name: '' });
      setShowSpecialistModal(false);
    } catch (error) {
      console.error('Error adding specialist:', error);
    }
  };

  const handleSetAsManager = async (specialistId) => {
    try {
      await axios.put(`http://localhost:3000/api/specialists/${specialistId}`, { isManager: true });
      setSpecialists((prev) => prev.map(specialist => 
        specialist.id === specialistId ? { ...specialist, isManager: true } : specialist
      ));
    } catch (error) {
      console.error('Error setting specialist as manager:', error);
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
          </tr>
        </thead>
        <tbody>
          {submachines.map((submachine) => (
            <tr key={submachine.id}>
              <td>{submachine.name}</td>
              <td>
                {tasks[submachine.id] && tasks[submachine.id].map((task) => (
                  <div className="task-item" key={task.id}>
                    <span>{task.description}</span>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteTask(task.id, submachine.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  className="add-button"
                  onClick={() => {
                    setSelectedSubmachineId(submachine.id);
                    setShowTaskModal(true);
                  }}
                >
                  Agregar Tarea
                </button>
              </td>
              <td>
                {observations[submachine.id] && observations[submachine.id].map((observation) => (
                  <div className="observation-item" key={observation.id}>
                    <span>{observation.note}</span>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteObservation(observation.id, submachine.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  className="add-button"
                  onClick={() => {
                    setSelectedSubmachineId(submachine.id);
                    setShowObservationModal(true);
                  }}
                >
                  Agregar Observación
                </button>
              </td>
              <td>
                {images[submachine.id] && images[submachine.id].map((image) => (
                  <div className="image-item" key={image.id}>
                    <img src={image.url} alt="Submachine" className="submachine-image" />
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteImage(image.id, submachine.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                {(!images[submachine.id] || images[submachine.id].length === 0) && (
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, submachine.id)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="specialists-section">
        <h3>Especialistas</h3>
        <ul className="specialists-list">
          {specialists.map((specialist) => (
            <li key={specialist.id} className="specialist-item">
              <span>{specialist.name}</span>
              <button
                className="delete-button"
                onClick={() => handleDeleteSpecialist(specialist.id)}
              >
                Eliminar
              </button>
              {!specialist.isManager && (
                <button
                  className="set-manager-button"
                  onClick={() => handleSetAsManager(specialist.id)}
                >
                  Asignar como encargado
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          className="add-button"
          onClick={() => setShowSpecialistModal(true)}
        >
          Agregar Especialista
        </button>
      </div>
      <button className="create-report-button" onClick={handleCreateReport}>
        Crear Reporte
      </button>

      {/* Modal for adding observation */}
      {showObservationModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Observación</h3>
            <textarea
              value={newObservation}
              onChange={(e) => setNewObservation(e.target.value)}
              placeholder="Escribe una observación"
            />
            <button className="modal-add-button" onClick={handleAddObservation}>
              Agregar
            </button>
            <button className="modal-close-button" onClick={() => setShowObservationModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding task */}
      {showTaskModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Tarea</h3>
            <textarea
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Describe la tarea"
            />
            <button className="modal-add-button" onClick={handleAddTask}>
              Agregar
            </button>
            <button className="modal-close-button" onClick={() => setShowTaskModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal for delete confirmation */}
      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar este ítem?</p>
            <button className="modal-delete-button" onClick={handleDelete}>
              Eliminar
            </button>
            <button className="modal-close-button" onClick={() => setShowDeleteConfirmation(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding specialist */}
      {showSpecialistModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Especialista</h3>
            <input
              type="text"
              value={newSpecialist.name}
              onChange={(e) => setNewSpecialist({ ...newSpecialist, name: e.target.value })}
              placeholder="Nombre del especialista"
            />
            <button className="modal-add-button" onClick={handleAddSpecialist}>
              Agregar
            </button>
            <button className="modal-close-button" onClick={() => setShowSpecialistModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineDetails;
