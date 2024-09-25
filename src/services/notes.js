import axios from "axios";
// const baseUrl = "http://localhost:3001/notes"; // Estas notes salen de json server
// const baseUrl = "http://localhost:3001/api/notes"; // Estas notes salen del back
const baseUrl = "/api/notes"; // Debido a que tanto el frontend como el backend estan en la misma direccion, podemos declarar baseURL como una URL relativa. Entonces podemos omitir la parte que declara el servidor.

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

// const getAll = () => {
//   const request = axios.get(baseUrl);
//   const nonExisting = {
//     id: 10000,
//     content: "This note is not saved to server",
//     important: true,
//   };
//   return request.then((response) => response.data.concat(nonExisting));
// };

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  update,
};
