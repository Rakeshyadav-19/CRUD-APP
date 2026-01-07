import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api.jsx";
import Table from "../components/table.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    employeeCount: 0,
    maleCount: 0,
    femaleCount: 0,
    otherCount: 0,
    totalUsers: 0,
    teamCounts: {},
  });
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, teamsData] = await Promise.all([
          apiFetch("/dashboard/all"),
          apiFetch("/team/all"),
        ]);
        setDashboardData(dashData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Top Stats Boxes */}
      <div className="flex gap-5 mb-8 flex-wrap">
        <div className="flex-1 min-w-[200px] p-5 bg-green-500 text-white rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-5xl my-2">{dashboardData.employeeCount}</p>
        </div>

        <div className="flex-1 min-w-[200px] p-5 bg-blue-500 text-white rounded-lg text-center">
          <h3 className="text-lg font-semibold">Male</h3>
          <p className="text-5xl my-2">{dashboardData.maleCount}</p>
        </div>

        <div className="flex-1 min-w-[200px] p-5 bg-pink-600 text-white rounded-lg text-center">
          <h3 className="text-lg font-semibold">Female</h3>
          <p className="text-5xl my-2">{dashboardData.femaleCount}</p>
        </div>

        <div className="flex-1 min-w-[200px] p-5 bg-orange-500 text-white rounded-lg text-center">
          <h3 className="text-lg font-semibold">Other</h3>
          <p className="text-5xl my-2">{dashboardData.otherCount}</p>
        </div>
      </div>

      {/* Team Counts Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Team Distribution</h2>
        <Table
          data={teams.map((team) => ({
            "Team Name": team.teamName,
            "Member Count": dashboardData.teamCounts[team.teamName] || 0,
            teamId: team._id,
          }))}
          onRowClick={(row) => {
            if (row.teamId) {
              navigate(`/team/${row.teamId}/members`);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
