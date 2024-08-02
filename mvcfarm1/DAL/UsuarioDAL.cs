using System;
using System.Data;
using System.Data.SqlClient;
using mvcfarm1.Models;

namespace mvcfarm1.DataAccess
{
    public class UsuarioDAL
    {
        private readonly string _connectionString;

        public UsuarioDAL(string connectionString)
        {
            _connectionString = connectionString;
        }

        // Método para crear un usuario en la base de datos
        public void CreateUsuario(Usuario usuario)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    INSERT INTO Usuarios (Correo, Contrasena, Rol, Nombre, Direccion, Telefono, Giro)
                    VALUES (@Correo, @Contrasena, @Rol, @Nombre, @Direccion, @Telefono, @Giro)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Correo", usuario.Correo);
                cmd.Parameters.AddWithValue("@Contrasena", usuario.Contrasena);
                cmd.Parameters.AddWithValue("@Rol", usuario.Rol);
                cmd.Parameters.AddWithValue("@Nombre", usuario.Nombre);
                cmd.Parameters.AddWithValue("@Direccion", usuario.Direccion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Telefono", usuario.Telefono ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Giro", usuario.Giro ?? (object)DBNull.Value);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // Método para obtener un usuario por correo electrónico
        public Usuario GetUsuarioByEmail(string email)
        {
            Usuario usuario = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Usuarios WHERE Correo = @Correo";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Correo", email);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    usuario = new Usuario
                    {
                        _id = reader["_id"].ToString(),
                        Correo = reader["Correo"].ToString(),
                        Contrasena = reader["Contrasena"].ToString(),
                        Rol = reader["Rol"].ToString(),
                        Nombre = reader["Nombre"].ToString(),
                        Direccion = reader["Direccion"] as string,
                        Telefono = reader["Telefono"] as string,
                        Giro = reader["Giro"] as string
                    };
                }
            }
            return usuario;
        }

        // Otros métodos para actualizar, eliminar usuarios, etc. pueden ser añadidos aquí.
    }
}
