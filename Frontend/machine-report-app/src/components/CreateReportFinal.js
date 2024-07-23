import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import './CreateReportFinal.css';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const CreateReportFinal = () => {
  const { machineId } = useParams();
  const [machineDetails, setMachineDetails] = useState(null);
  const [machineInfo, setMachineInfo] = useState(null);
  const [specialists, setSpecialists] = useState([]);

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const machineResponse = await axios.get(`http://localhost:3000/api/machines/${machineId}`);
        setMachineInfo(machineResponse.data);

        const submachineResponse = await axios.get(`http://localhost:3000/api/submachines/machine/${machineId}`);
        const specialistsResponse = await axios.get(`http://localhost:3000/api/specialists/machine/${machineId}`);
        setSpecialists(specialistsResponse.data);

        const tasksAndObservations = await Promise.all(submachineResponse.data.map(async (submachine) => {
          const [taskResponse, observationResponse, imageResponse] = await Promise.all([
            axios.get(`http://localhost:3000/api/tasks/submachine/${submachine.id}`),
            axios.get(`http://localhost:3000/api/observations/submachine/${submachine.id}`),
            axios.get(`http://localhost:3000/api/photos/submachine/${submachine.id}`)
          ]);

          // Convert images to base64
          const imagesBase64 = await Promise.all(imageResponse.data.map(async (img) => {
            try {
              const imgResponse = await axios.get(img.url, { responseType: 'blob' });
              const imgBase64 = await convertToBase64(imgResponse.data);
              return imgBase64;
            } catch (error) {
              console.error('Error converting image to base64:', error);
              return null;
            }
          }));

          return {
            submachineId: submachine.id,
            name: submachine.name,
            tasks: taskResponse.data,
            observations: observationResponse.data,
            images: imagesBase64.filter(img => img !== null) // Filter out any null values
          };
        }));

        setMachineDetails({
          machineId,
          submachines: tasksAndObservations
        });
      } catch (error) {
        console.error('Error fetching machine details:', error);
      }
    };

    fetchMachineDetails();
  }, [machineId]);

  // Function to convert image Blob to base64
  const convertToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generatePDF = () => {
    if (!machineDetails || !machineInfo) return;

    const { machineId, submachines } = machineDetails;
    const { name, location } = machineInfo;

    const docDefinition = {
      content: [
        { text: 'INFORME MANTENCIÓN ANUAL', style: 'header' },
        { text: `Máquina: ${name} - Ubicación: ${location}`, style: 'subheader' },
        { text: 'Especialistas:', style: 'subheader', margin: [0, 10, 0, 5] },
        ...specialists.map(specialist => ({ text: specialist.name, margin: [0, 5, 0, 5] })),
        ...submachines.flatMap(submachine => [
          { text: `Submáquina: ${submachine.name}`, style: 'subheader', margin: [0, 10, 0, 10] },
          submachine.images.length > 0 ? { image: submachine.images[0], width: 150, alignment: 'center', margin: [0, 0, 0, 10] } : null,
          {
            table: {
              headerRows: 1,
              widths: ['*', '*'],
              body: [
                [
                  { text: 'Tareas', style: 'tableHeader' },
                  { text: 'Observaciones', style: 'tableHeader' }
                ],
                ...generateTableRows(submachine.tasks, submachine.observations)
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ]),
        { text: '\nFin del Informe', style: 'footer' }
      ].filter(Boolean),
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          color: 'black'
        },
        footer: {
          fontSize: 12,
          italics: true,
          alignment: 'center'
        }
      }
    };

    pdfMake.createPdf(docDefinition).download(`Informe_Mantenimiento_Anual_${machineId}.pdf`);
  };

  const generateTableRows = (tasks, observations) => {
    const maxLength = Math.max(tasks.length, observations.length);
    const rows = [];

    for (let i = 0; i < maxLength; i++) {
      rows.push([
        tasks[i] ? `${i + 1}. ${tasks[i].description} [${tasks[i].status === 1 ? 'Completa' : 'Incompleta'}]` : '',
        observations[i] ? `${i + 1}. ${observations[i].note}` : ''
      ]);
    }

    return rows;
  };

  return (
    <div className="create-report-final">
      <h2>Crear Informe Final</h2>
      <button onClick={generatePDF}>Crear Reporte</button>
    </div>
  );
};

export default CreateReportFinal;
