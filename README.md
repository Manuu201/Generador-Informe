# Wiki

En esta wiki se documentara toda la información referente al proyecto solicitado.

## Contextualización

Se requiere de un sistema que recopile datos e imagenes referentes a las partes de cada maquina ingresada al sistema, esta información se ingresara de forma progresiva y cuando se logre conseguir la informacion 
necesaria se generara un PDF con toda la información ingresada de una maquina en especifico.

## Actores relevantes

1. Usuario 
2. Especialista
3. Lineas
4. Maquinas
5. Submaquina

## Diagrama de Contexto
![image](https://github.com/user-attachments/assets/e051387a-7ae4-4b91-a643-dbc877780d14)

## Objetivos y criterios de éxito
| Objetivos | Criterios |
|--------------|--------------|
| Generar rápido información | - No demorarse en subir informacion - No demorarse en subir imagenes|
| Facil de usar | - Minimizar los botones a utilizar - fácil de entender |
| Portable | - Facil de levantar |


## Requisitos funcionales 

1. Generación de PDF a partir de la información de cada maquina.
2. Historial de Informes de cada máquina.
3. Agregación de nuevas maquinas, lineas, maquinarios.
4. Generar información de cada maquina.
     
## Tecnologias a utilizar 

1. Frontend:
   - React como framework principal
   - CSS para estilos de la página
2. Backend:
   - MySQL como DBMS
   - Node.js para facilitar la conexion entre Frontend y Backend
3. Otros
   - Postman para peticiones del Backend HTTPS
  
## Riesgos

| Riesgo | Estado | Impacto | Medidas de mitigación |
|--------------|--------------|--------------|--------------|
| Envio tardío de informacion | No mitigado | Bajo-medio | Optimizar las peticiones realizadas a la BD |
| Perdida de información | No mitigado | Medio-Alto | Solicitar peticiones actualizadas despues de agregar información |
| Incorrecta agregación de nuevas entidades | Medio-Alto | Bajo-medio | Revisar estado de BD al actualizar o agregar |
| Actualización incorrecta en BD | No mitigado | Medio-Alto | Realizar peticiones HTTPS con postman |

## Cómo usar

Se requiere de las aplicaciones como Node.js, MySQL.
Para ejecutar de forma correcta se utilizan los siguientes pasos:
1. Abrir la carpeta Backend y ejecutar **node app.js** en la cmd
2. Abrir la carpeta Frontend/machine-report-app ejecutar **npm start**
3. Listo

