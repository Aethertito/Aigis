using mvcfarm1.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using mvcfarm1.DataAccess;

namespace mvcfarm1.DAL
{
    public class AyudaUsuariosDAL
    {
        private readonly string _connectionString;

        public AyudaUsuariosDAL(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public void CreateAyudaUsuarios(AyudaUsuarios ayudaUsuarios)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    INSERT INTO ayudausuarios (_id, correo, titulo, problema, usuario_id, fecha)
                    VALUES (@Id, @Correo, @Titulo, @Problema, @UsuarioId, @Fecha)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", ayudaUsuarios.Id);
                cmd.Parameters.AddWithValue("@Correo", ayudaUsuarios.Correo);
                cmd.Parameters.AddWithValue("@Titulo", ayudaUsuarios.Titulo);
                cmd.Parameters.AddWithValue("@Problema", ayudaUsuarios.Problema);
                cmd.Parameters.AddWithValue("@UsuarioId", ayudaUsuarios.UsuarioId);
                cmd.Parameters.AddWithValue("@Fecha", ayudaUsuarios.Fecha);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public AyudaUsuarios GetAyudaUsuariosById(string id)
        {
            AyudaUsuarios ayudaUsuarios = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM ayudausuarios WHERE _id = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    ayudaUsuarios = new AyudaUsuarios
                    {
                        Id = reader["_id"].ToString(),
                        Correo = reader["correo"].ToString(),
                        Titulo = reader["titulo"].ToString(),
                        Problema = reader["problema"].ToString(),
                        UsuarioId = reader["usuario_id"].ToString(),
                        Fecha = DateTime.Parse(reader["fecha"].ToString())
                    };
                }
            }
            return ayudaUsuarios;
        }

 
    }
}
