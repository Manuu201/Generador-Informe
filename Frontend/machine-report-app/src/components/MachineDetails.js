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
  const [newSpecialist, setNewSpecialist] = useState({ name: '', email: '' });
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
        location: 'Ciudad de México',  // Use the machine's location if available
        status: 0,
        machineId
      });
      setSpecialists((prev) => [...prev, response.data]);
      setNewSpecialist({ name: '', email: '' });
      setShowSpecialistModal(false);
    } catch (error) {
      console.error('Error adding specialist:', error);
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
                {tasks[submachine.id]?.map((task) => (
                  <div key={task.id} className="task-item">
                    <span>{task.description}</span>
                    <input
                      type="checkbox"
                      checked={task.status === 1}
                      onChange={async () => {
                        try {
                          const newStatus = task.status === 1 ? 0 : 1;
                          await axios.put(`http://localhost:3000/api/tasks/${task.id}`, {
                            ...task,
                            status: newStatus
                          });
                          setTasks((prev) => ({
                            ...prev,
                            [submachine.id]: prev[submachine.id].map((t) =>
                              t.id === task.id ? { ...t, status: newStatus } : t
                            )
                          }));
                        } catch (error) {
                          console.error('Error updating task status:', error);
                        }
                      }}
                    />
                    <button className="delete-btn" onClick={() => handleDeleteTask(task.id, submachine.id)}>
                      Eliminar
                    </button>
                  </div>
                ))}
                <button onClick={() => {
                  setSelectedSubmachineId(submachine.id);
                  setShowTaskModal(true);
                }}>
                  Añadir Tarea
                </button>
              </td>
              <td>
                {observations[submachine.id]?.map((observation) => (
                  <div key={observation.id} className="observation-item">
                    <span>{observation.note}</span>
                    <button className="delete-btn" onClick={() => handleDeleteObservation(observation.id, submachine.id)}>
                      Eliminar
                    </button>
                  </div>
                ))}
                <button onClick={() => {
                  setSelectedSubmachineId(submachine.id);
                  setShowObservationModal(true);
                }}>
                  Añadir Observación
                </button>
              </td>
              <td>
                {images[submachine.id]?.map((image) => (
                  <div key={image.id} className="image-item">
                    <img src={image.url} alt="Submachine" />
                    <button className="delete-btn" onClick={() => handleDeleteImage(image.id, submachine.id)}>
                      Eliminar
                    </button>
                  </div>
                ))}
                {!images[submachine.id] || images[submachine.id].length === 0 ? (
                  <input type="file" onChange={(e) => handleImageUpload(e, submachine.id)} />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="specialists-section">
        <h3>Especialistas</h3>
        <ul>
          {specialists.map((specialist) => (
            <li key={specialist.id}>
              <span>{specialist.name}</span>
              <button className="delete-btn" onClick={() => handleDeleteSpecialist(specialist.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => setShowSpecialistModal(true)}>Añadir Especialista</button>
      </div>

      <button className="create-report-btn" onClick={handleCreateReport}>Crear Reporte</button>

      {showObservationModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Añadir Observación</h3>
            <textarea
              value={newObservation}
              onChange={(e) => setNewObservation(e.target.value)}
              placeholder="Ingrese la observación"
            />
            <button onClick={handleAddObservation}>Guardar</button>
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
              placeholder="Ingrese la tarea"
            />
            <button onClick={handleAddTask}>Guardar</button>
            <button onClick={() => setShowTaskModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {showSpecialistModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Añadir Especialista</h3>
            <input
              type="text"
              value={newSpecialist.name}
              onChange={(e) => setNewSpecialist((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre del especialista"
            />
            <input
              type="email"
              value={newSpecialist.email}
              onChange={(e) => setNewSpecialist((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email del especialista"
            />
            <button onClick={handleAddSpecialist}>Guardar</button>
            <button onClick={() => setShowSpecialistModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Está seguro de que desea eliminar este elemento?</p>
            <button onClick={handleDelete}>Confirmar</button>
            <button onClick={() => setShowDeleteConfirmation(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineDetails;
