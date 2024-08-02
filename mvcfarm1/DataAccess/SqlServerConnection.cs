using System;
using System.Data;
using System.Data.SqlClient;

namespace mvcfarm1.DataAccess
{
    public static class SqlServerConnection
    {
        public static string ConnectionString { get; set; } = @"
            Server=tcp:aigis.database.windows.net,1433;
            Initial Catalog=aigisf;
            Persist Security Info=False;
            User ID=aigis;
            Password=SecurePassword123;
            MultipleActiveResultSets=False;
            Encrypt=True;
            TrustServerCertificate=False;
            Connection Timeout=30;
        ";

        public static DataTable ExecuteQuery(string query, SqlParameter[] parameters = null)
        {
            DataTable table = new DataTable();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                try
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        if (parameters != null)
                        {
                            command.Parameters.AddRange(parameters);
                        }

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(table);
                        }
                    }
                }
                catch (SqlException e)
                {
                    Console.WriteLine($"SQL Exception: {e.Message}\nStack Trace: {e.StackTrace}");
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Exception: {ex.Message}\nStack Trace: {ex.StackTrace}");
                    throw;
                }
            }

            return table;
        }

        public static void ExecuteNonQuery(string query, SqlParameter[] parameters = null)
        {
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                try
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        if (parameters != null)
                        {
                            command.Parameters.AddRange(parameters);
                        }

                        command.ExecuteNonQuery();
                    }
                }
                catch (SqlException e)
                {
                    Console.WriteLine($"SQL Exception: {e.Message}\nStack Trace: {e.StackTrace}");
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Exception: {ex.Message}\nStack Trace: {ex.StackTrace}");
                    throw;
                }
            }
        }
    }
}
