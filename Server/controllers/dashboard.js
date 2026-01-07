import Users from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    // Use aggregation pipeline for efficient single query
    const stats = await Users.aggregate([
      {
        $facet: {
          // Count by team
          teamCounts: [
            { $group: { _id: "$team_Id", count: { $sum: 1 } } },
            {
              $lookup: {
                from: "team_info",
                localField: "_id",
                foreignField: "_id",
                as: "teamInfo",
              },
            },
            {
              $unwind: { path: "$teamInfo", preserveNullAndEmptyArrays: true },
            },
            {
              $project: {
                _id: 1,
                teamName: "$teamInfo.teamName",
                count: 1,
              },
            },
          ],
          // Count by role
          roleCounts: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
          // Count by gender
          genderCounts: [{ $group: { _id: "$gender", count: { $sum: 1 } } }],
        },
      },
    ]);

    // Format the results
    const teamCounts = stats[0].teamCounts.reduce((acc, item) => {
      acc[item.teamName || item._id] = item.count;
      return acc;
    }, {});

    const genderStats = stats[0].genderCounts.reduce((acc, item) => {
      acc[item._id.toLowerCase() + "Count"] = item.count;
      return acc;
    }, {});

    const employeeCount =
      stats[0].roleCounts.find((r) => r._id === "Employee")?.count || 0;

    res.status(200).json({
      teamCounts,
      employeeCount,
      maleCount: genderStats.maleCount || 0,
      femaleCount: genderStats.femaleCount || 0,
      otherCount: genderStats.otherCount || 0,
      totalUsers: await Users.countDocuments(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching dashboard stats", message: err.message });
  }
};

export default { getAllUsers };
