import React, { useState, useEffect } from "react";
import { crearEstadoEquipo, getEstadosEquipos } from "../../services/estadoEquipoService";
import Swal from "sweetalert2";

export const EstadoNew = ( {listarEstados} ) => {
  const [estados, setEstados] = useState([]);
  const [valoresForm, setValoresForm] = useState({});
  const { name = "", status = "" } = valoresForm;

  const listarEstado = async () => {
    try {
      const { data } = await getEstadosEquipos();
      setEstados(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
  //para que estos servicios se llamen una unica vez
  useEffect(() => {
    listarEstado();
  }, []);
  //desestructuramos el parametro de la fucnion handleOnChange
  const handleOnChange = ({ target }) => {
    const { name, value } = target;
    setValoresForm({ ...valoresForm, [name]: value }); //spreed
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const estado = {
      name,
      status,
    };
    try {
      Swal.fire({
        allowOutsideClick: false,
        text: "Cargando...",
      });
      Swal.showLoading();
      const { data } = await crearEstadoEquipo(estado);
      console.log(data);
      listarEstados();
      Swal.close();
    } catch (e) {
      console.log(e);
      Swal.close();
      let mensaje;
      if (e && e.response && e.response.data) {
        mensaje = e.response.data;
      } else {
        mensaje = "Ocurrió un error, por favor intente de nuevo";
      }
      Swal.fire("Error", mensaje, "error");
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col mt-3">
            <h4>Estado Equipo</h4>
            <hr />
          </div>
        </div>
        <form onSubmit={(e) => handleOnSubmit(e)}>
          <div className="row">
            <div className="col">
              <div className="mb-3">
                <label className="form-label">Estado equipo</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  required
                  minLength={4}
                  onChange={(e) => handleOnChange(e)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col">
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  onChange={(e) => handleOnChange(e)}
                  name="status"
                  value={status}
                  required
                >
                  <option key="">--SELECCIONE--</option>
                  <option >Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col mb-4">
              <button className="btn btn-primary">Crear</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};