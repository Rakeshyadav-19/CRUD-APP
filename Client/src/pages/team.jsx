import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api.jsx";
import Table from "../components/table.jsx";
import {
  AddMemberModal,
  EditMemberModal,
} from "../components/modal/addMember.jsx";
import { SendMailModal } from "../components/modal/sendMail.jsx";

const TeamMembers = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [mailRecipient, setMailRecipient] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersData, teamsData] = await Promise.all([
        apiFetch(`/team/${teamId}/members`),
        apiFetch("/team/all"),
      ]);

      // Filter out profile_pic buffer data before setting state
      const cleanedMembers = membersData.map(
        ({ profile_pic, ...member }) => member
      );
      setMembers(cleanedMembers);

      const team = teamsData.find((t) => t._id === teamId);
      setTeamName(team?.teamName || "Unknown Team");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [teamId]);

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );
    if (!confirmed) return;

    try {
      await apiFetch(`/team/delete/${member._id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to delete member");
    }
  };

  const renderActions = (member) => (
    <>
      <button
        onClick={() => {
          setEditMember(member);
          setIsEditModalOpen(true);
        }}
        className="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(member)}
        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
      >
        Delete
      </button>
      <button
        onClick={() => {
          setMailRecipient(member);
          setIsMailModalOpen(true);
        }}
        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
      >
        Send Mail
      </button>
    </>
  );

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-5">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-5 px-5 py-2.5 bg-green-500 text-white border-none rounded cursor-pointer text-sm hover:bg-green-600"
      >
        ← Back to Dashboard
      </button>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-5 px-5 py-2.5 bg-blue-500 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-600 ml-3"
      >
        + Add Member
      </button>

      <h1 className="text-3xl font-bold mb-2">Team: {teamName}</h1>
      <h2 className="text-xl font-semibold mb-4">Members ({members.length})</h2>

      <Table data={members} actions={renderActions} />

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        teamId={teamId}
        onSuccess={fetchData}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditMember(null);
        }}
        member={editMember}
        onSuccess={fetchData}
      />

      <SendMailModal
        isOpen={isMailModalOpen}
        onClose={() => {
          setIsMailModalOpen(false);
          setMailRecipient(null);
        }}
        recipient={mailRecipient}
      />
    </div>
  );
};

export default TeamMembers;
