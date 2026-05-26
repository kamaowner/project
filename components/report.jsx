import { useEffect, useState } from "react";
import axios from "axios";

function Report() {

  const [reports, setReports] = useState([]);

  // FETCH REPORT DATA
  const fetchReports = async () => {
    try {

      const res = await axios.get(
        "http://localhost:7000/report"
      );

      setReports(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white p-6 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold mb-6">
          Employee Report
        </h1>

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-blue-600 text-white">

              <th className="border p-3">
                Employee Name
              </th>

              <th className="border p-3">
                Department
              </th>

              <th className="border p-3">
                Total Salary
              </th>

              <th className="border p-3">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {reports.length > 0 ? (

              reports.map((report, index) => (

                <tr
                  key={index}
                  className="text-center hover:bg-gray-100"
                >

                  <td className="border p-3">
                    {report.employeeName}
                  </td>

                  <td className="border p-3">
                    {report.department}
                  </td>

                  <td className="border p-3">
                    {report.totalSalary}
                  </td>

                  <td className="border p-3">
                    {report.reportDate}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="border p-4 text-center"
                >
                  No Report Data Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Report;