import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { apiFetch } from "../api/Api.jsx";
import Table from "../components/Table.jsx";
import {
  AddMemberModal,
  EditMemberModal,
} from "../components/modal/MemberModal.jsx";
import { SendMailModal } from "../components/modal/SendMailModal.jsx";

const TeamMembers = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [genderFilter, setGenderFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [mailRecipient, setMailRecipient] = useState(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [membersResponse, teamsData] = await Promise.all([
        apiFetch(`/team/${teamId}/members?page=1&limit=10`),
        apiFetch("/team/all"),
      ]);

      const cleanedMembers = membersResponse.users.map(
        ({ profile_pic, ...member }) => member
      );
      setMembers(cleanedMembers);
      setTotalCount(membersResponse.pagination.totalCount);
      setHasMore(cleanedMembers.length < membersResponse.pagination.totalCount);
      setPage(1);

      const team = teamsData.find((t) => t._id === teamId);
      setTeamName(team?.teamName || "Unknown Team");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1;
      const membersResponse = await apiFetch(
        `/team/${teamId}/members?page=${nextPage}&limit=10`
      );

      const cleanedMembers = membersResponse.users.map(
        ({ profile_pic, ...member }) => member
      );
      setMembers((prev) => [...prev, ...cleanedMembers]);
      setPage(nextPage);
      setHasMore(
        members.length + cleanedMembers.length <
          membersResponse.pagination.totalCount
      );
    } catch (err) {
      console.error("Error fetching more data:", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [teamId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter members on frontend
  const filteredMembers = members.filter((member) => {
    const matchesGender =
      genderFilter === "all" || member.gender === genderFilter;
    const matchesSearch =
      !searchQuery ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGender && matchesSearch;
  });

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );
    if (!confirmed) return;

    try {
      await apiFetch(`/team/delete/${member._id}`, {
        method: "DELETE",
      });
      fetchInitialData();
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
      <h2 className="text-xl font-semibold mb-4">
        Members ({filteredMembers.length} of {totalCount})
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="flex-1 min-w-62.5">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="min-w-37.5">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <InfiniteScroll
        dataLength={members.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className="text-center p-4">Loading more...</h4>}
        endMessage={
          <p className="text-center p-4 text-gray-500">
            <b>All members loaded</b>
          </p>
        }
      >
        <Table
          data={filteredMembers}
          actions={renderActions}
          onRowClick={(member) =>
            navigate(`/team/${teamId}/member/${member._id}`)
          }
        />
      </InfiniteScroll>

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        teamId={teamId}
        onSuccess={fetchInitialData}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditMember(null);
        }}
        member={editMember}
        onSuccess={fetchInitialData}
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
