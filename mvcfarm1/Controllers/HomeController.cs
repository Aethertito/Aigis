using Microsoft.AspNetCore.Mvc;
using mvcfarm1.DataAccess; // Asegúrate de tener el espacio de nombres correcto
using mvcfarm1.Models;
using System;
using System.Data;
using System.Data.SqlClient;

namespace mvcfarm1.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Support()
        {
            return View(new AyudaUsuarios());
        }

        [HttpPost]
        public IActionResult Support(AyudaUsuarios model)
        {
            if (ModelState.IsValid)
            {
                // Obtener el correo y el ID del usuario autenticado
                string userEmail = User.Identity.Name; // Supone que el nombre de usuario es el correo
                string userId = ObtenerUsuarioId(userEmail); // Método para obtener el ID del usuario desde la base de datos

                // Asignar valores adicionales
                model.Correo = userEmail;
                model.UsuarioId = userId;
                model.Fecha = DateTime.Now;

                // Generar un ID único para la ayuda (puedes usar Guid u otra estrategia)
                model.Id = Guid.NewGuid().ToString();

                // Guardar el modelo en la base de datos
                GuardarAyudaEnBaseDeDatos(model);

                // Redirigir o mostrar un mensaje de éxito
                return RedirectToAction("Support", new { success = true });
            }

            // Si el modelo no es válido, vuelve a mostrar la vista con los errores
            return View(model);
        }

        private string ObtenerUsuarioId(string email)
        {
            string userId = null;
            string query = "SELECT Id FROM Usuarios WHERE Correo = @Correo";

            using (SqlConnection conn = new SqlConnection(SqlServerConnection.ConnectionString))
            {
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Correo", email);
                conn.Open();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        userId = reader["Id"].ToString();
                    }
                }
            }

            return userId;
        }

        private void GuardarAyudaEnBaseDeDatos(AyudaUsuarios ayuda)
        {
            string query = @"
                INSERT INTO AyudaUsuarios (Id, Correo, Titulo, Problema, UsuarioId, Fecha)
                VALUES (@Id, @Correo, @Titulo, @Problema, @UsuarioId, @Fecha)";

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", ayuda.Id),
                new SqlParameter("@Correo", ayuda.Correo),
                new SqlParameter("@Titulo", ayuda.Titulo),
                new SqlParameter("@Problema", ayuda.Problema),
                new SqlParameter("@UsuarioId", ayuda.UsuarioId),
                new SqlParameter("@Fecha", ayuda.Fecha)
            };

            try
            {
                SqlServerConnection.ExecuteNonQuery(query, parameters);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al guardar la ayuda en la base de datos: {ex.Message}");
            }
        }
    }
}
